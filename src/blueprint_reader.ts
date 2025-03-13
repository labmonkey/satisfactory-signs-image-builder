import { Blueprint, Parser, SaveEntity, StructProperty, col4 } from "@etothepii/satisfactory-file-parser";
import * as fs from 'fs';
import { srgbToLinear } from './color_utils';
import { parseTranslationToPosition } from './mapping_utils';
import { ImagePixel } from './image_reader';
import { blueprintSignsConfigPath, blueprintSignsPath, blueprintSignsSize } from './config';
import * as path from 'path';

const sign1m = '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_Square_Small.Build_StandaloneWidgetSign_Square_Small_C';
// const sign2m = '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_Square.Build_StandaloneWidgetSign_Square_C';

function buildBlueprintName(baseName: string, row: number, col: number) {
    return baseName + " " + row + "x" + col;
}

export function calculateSectionRange(sectionX: number, sectionY: number): { xStart: number, xEnd: number, yStart: number, yEnd: number } {
    const xStart = (sectionX - 1) * blueprintSignsSize + 1;
    const xEnd = sectionX * blueprintSignsSize;

    const yStart = (sectionY - 1) * blueprintSignsSize + 1;
    const yEnd = sectionY * blueprintSignsSize;

    return { xStart, xEnd, yStart, yEnd };
}

export function parseBlueprint(blueprintName: string, imagePixels: ImagePixel[]) {
    const sectionsCount = imagePixels.length / (blueprintSignsSize * blueprintSignsSize);
    const sectionsSize = Math.floor(Math.sqrt(sectionsCount)); // Ensure integer grid size

    for (let sectionY = 1; sectionY <= sectionsSize; sectionY++) { // Process top to bottom
        for (let sectionX = 1; sectionX <= sectionsSize; sectionX++) { // Process left to right
            const { xStart, xEnd, yStart, yEnd } = calculateSectionRange(sectionX, sectionY);
            console.log(`Processing section '${sectionY}x${sectionX}' - X: ${xStart} to ${xEnd}, Y: ${yStart} to ${yEnd}`);

            // Expected section output:
            // section 1x1 -> x: 1-32, y: 1-32
            // section 1x2 -> x: 33-64, y: 1-32
            // section 2x1 -> x: 1-32, y: 33-64
            // section 2x2 -> x: 33-64, y: 33-64
            // etc.

            const processedBlueprint = processSectionToBlueprint(imagePixels, xStart, yStart);
            saveBlueprint(processedBlueprint, buildBlueprintName(blueprintName, sectionX, sectionY));
        }
    }
}

function processSectionToBlueprint(
    imagePixels: ImagePixel[],
    xStart: number,
    yStart: number
): Blueprint {
    const blueprint = Parser.ParseBlueprintFiles("Blueprint", blueprintSignsPath, blueprintSignsConfigPath);
    const signsList = blueprint.objects.filter(obj => obj.typePath === sign1m) as SaveEntity[];

    const sectionsSize = 2; // Since we have a 64x64 image split into 4 sections (32x32 each)

    for (const sign of signsList) {
        const foreground = sign.properties.mForegroundColor as StructProperty;
        const foregroundColor = foreground.value as col4;
        const background = sign.properties.mBackgroundColor as StructProperty;
        const backgroundColor = background.value as col4;
        const auxilary = sign.properties.mAuxilaryColor as StructProperty;
        const auxilaryColor = auxilary.value as col4;

        const positionTranslation = parseTranslationToPosition(sign.transform.translation);
        let { row, col } = positionTranslation;

        // Ensure row/col are within the local 1-32 range
        row = ((row - 1) % 32) + 1;
        col = ((col - 1) % 32) + 1;

        // Correct section mapping (flip row calculation for bottom-to-top ordering)
        for (const imagePixel of imagePixels) {
            const sectionRow = sectionsSize - Math.floor((imagePixel.col - 1) / 32); // Right to left ✅
            const sectionCol = Math.floor((imagePixel.row - 1) / 32) + 1; // Bottom to top ✅            

            const localRow = ((imagePixel.row - 1) % 32) + 1;
            const localCol = ((imagePixel.col - 1) % 32) + 1;

            // Ensure the imagePixel belongs to this section
            if (sectionRow === sectionsSize - Math.floor((yStart - 1) / 32) &&
                sectionCol === Math.ceil(xStart / 32)) {

                if (localRow === row && localCol === col) {
                    foregroundColor.r = backgroundColor.r = auxilaryColor.r = srgbToLinear(imagePixel.r);
                    foregroundColor.g = backgroundColor.g = auxilaryColor.g = srgbToLinear(imagePixel.g);
                    foregroundColor.b = backgroundColor.b = auxilaryColor.b = srgbToLinear(imagePixel.b);
                }
            }
        }
    }

    return blueprint;
}

function saveBlueprint(blueprint: Blueprint, blueprintName: string) {
    // Now, save the modified blueprint back to files
    let mainFileHeader: Uint8Array;
    const mainFileBodyChunks: Uint8Array[] = [];

    const dirPath = './output';

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const summary = Parser.WriteBlueprintFiles(
        blueprint,
        (header: Uint8Array) => {
            // This callback handles the header of the main file
            mainFileHeader = header;
        },
        (chunk: Uint8Array) => {
            // This callback handles each chunk of the main file body
            mainFileBodyChunks.push(chunk);
        }
    );

    // Write complete .sbp file back to disk
    fs.writeFileSync(path.join(process.cwd(), 'output', blueprintName + '.sbp'), Buffer.concat([mainFileHeader!, ...mainFileBodyChunks]));

    // Write .sbpcfg file back to disk, we get that data from the result of WriteBlueprintFiles
    fs.writeFileSync(path.join(process.cwd(), 'output', blueprintName + '.sbpcfg'), Buffer.from(summary.configFileBinary));
}

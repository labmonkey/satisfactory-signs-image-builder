import { readImagePixels } from './image_reader';
import { parseBlueprint } from './blueprint_reader';
import { imagePath, blueprintName } from './config';


async function main() {
    const imagePixels = await readImagePixels(imagePath);

    // console.log(imagePixels);

    parseBlueprint(blueprintName, imagePixels);
}

main()
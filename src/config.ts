import * as fs from 'fs';
import * as path from 'path';
import { getAsset, isSea } from 'node:sea';

const blueprintSignsFileName = 'Signs 1m 32x32';

export const blueprintSignsSize = 32; // The blueprint used has 32x32 signs
export const blueprintSignsSteps = 100; // width/height of a 1m sign in the game units
export const blueprintSignsMinX = -1140; // Specific to this blueprint file itself. Coordinates on the Blueprint Designer.
export const blueprintSignsMinZ = 60; // Specific to this blueprint file itself. Coordinates on the Blueprint Designer.

function getBlueprintPaths() {
    if (isSea()) {
        return {
            blueprintSignsPath: Buffer.from(getAsset(blueprintSignsFileName + '.sbp')),
            blueprintSignsConfigPath: Buffer.from(getAsset(blueprintSignsFileName + '.sbpcfg'))
        };
    } else {
        return {
            blueprintSignsPath: fs.readFileSync(path.join(process.cwd(), 'assets', blueprintSignsFileName + '.sbp')),
            blueprintSignsConfigPath: fs.readFileSync(path.join(process.cwd(), 'assets', blueprintSignsFileName + '.sbpcfg'))
        };
    }
}

const { blueprintSignsPath, blueprintSignsConfigPath } = getBlueprintPaths();

export { blueprintSignsPath, blueprintSignsConfigPath };

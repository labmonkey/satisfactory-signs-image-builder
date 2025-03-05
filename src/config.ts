import * as fs from 'fs';
import * as path from 'path';

/**
 ** Configuration
 **/

export const imagePath = path.join(__dirname, '../assets/doge64.jpg'); // Path to the desired image
export const blueprintName = 'Doge'; // Name of the output blueprint files

/**
 ** Internal Configuration
 **/
// Does not have to be changed.

const blueprintSignsFileName = 'Signs 1m 32x32';
export const blueprintSignsPath = fs.readFileSync(path.join(__dirname, '../assets/', blueprintSignsFileName + '.sbp'));
export const blueprintSignsConfigPath = fs.readFileSync(path.join(__dirname, '../assets/', blueprintSignsFileName + '.sbpcfg'));

export const blueprintSignsSize = 32; // The blueprint used has 32x32 signs
export const blueprintSignsSteps = 100; // width/height of a 1m sign in the game units
export const blueprintSignsMinX = -1140; // Specific to this blueprint itself. Coordinates on the Blueprint Designer.
export const blueprintSignsMinZ = 60; // Specific to this blueprint itself. Coordinates on the Blueprint Designer.
import { readImagePixels } from './image_reader';
import { parseBlueprint } from './blueprint_reader';

export async function main(blueprintName: string, imagePath: string) {
    const imagePixels = await readImagePixels(imagePath);

    // console.log(imagePixels);

    parseBlueprint(blueprintName, imagePixels);
}

if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log('Usage: ssib.exe <name> <image>');
        console.log('- name: The desired name of the blueprint in the game');
        console.log('- image: The path to your image');
        console.log('Example: ssib.exe DOGE ./assets/doge64.jpg');

        process.exit(1);
    }

    const [name, image] = args;
    main(name, image);
}
import { Jimp, intToRGBA } from "jimp";

export class ImagePixel {
    row: number;
    col: number;
    r: number;
    g: number;
    b: number;

    constructor(row: number, col: number, r: number, g: number, b: number) {
        this.row = row;
        this.col = col;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toHex() {
        return `#${this.r.toString(16).padStart(2, "0")}${this.g.toString(16).padStart(2, "0")}${this.b.toString(16).padStart(2, "0")}`;
    }
}

export async function readImagePixels(imagePath: string): Promise<ImagePixel[]> {
    try {
        const image = await Jimp.read(imagePath);
        const width = image.width;
        const height = image.height;
        const signs: ImagePixel[] = [];

        console.log(`The image size is ${width}x${height}`);

        if (!(width % 32 == 0) || !(height % 32 == 0)) {
            throw Error("Image width and height have to be divisible by 32")
        }

        // rows and columns are stored from bottom left to top right
        for (let x = 0; x < width; x++) {
            for (let y = height - 1; y >= 0; y--) {
                const pixelColor = image.getPixelColor(x, y);
                const rgbaColor = intToRGBA(pixelColor);

                const imagePixel = new ImagePixel((height - y), x + 1, rgbaColor.r, rgbaColor.g, rgbaColor.b);

                // console.log(x, y, imagePixel.row, imagePixel.col, imagePixel.toHex())

                signs.push(imagePixel);
            }
        }

        return signs;
    } catch (error) {
        throw new Error(`Failed to process image: ${error}`);
    }
}

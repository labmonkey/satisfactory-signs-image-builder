export function linearToSrgb(value: number): number {
    return value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}

export function srgbToLinear(value: number): number {
    const srgb = value / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

// Below were used when I was designing the 'Signs 1x 32x32' Blueprint

// export function rgbToHex(r: number, g: number, b: number): string {
//     const r_srgb = linearToSrgb(r);
//     const g_srgb = linearToSrgb(g);
//     const b_srgb = linearToSrgb(b);

//     return `#${Math.round(r_srgb * 255).toString(16).padStart(2, '0').toUpperCase()}`
//          + `${Math.round(g_srgb * 255).toString(16).padStart(2, '0').toUpperCase()}`
//          + `${Math.round(b_srgb * 255).toString(16).padStart(2, '0').toUpperCase()}`;
// }

// export function hexToRgb(hex: string): { r: number, g: number, b: number } {
//     hex = hex.replace(/^#/, '');
//     if (hex.length !== 6) throw new Error("Invalid HEX format. Expected #RRGGBB");

//     return {
//         r: srgbToLinear(parseInt(hex.substring(0, 2), 16) / 255),
//         g: srgbToLinear(parseInt(hex.substring(2, 4), 16) / 255),
//         b: srgbToLinear(parseInt(hex.substring(4, 6), 16) / 255),
//     };
// }

// export function parseHexColor(hex: string): { col: number, row: number } {
//     hex = hex.replace('#', '');
//     return { row: parseInt(hex.substring(0, 2), 16), col: parseInt(hex.substring(2, 4), 16) };
// }

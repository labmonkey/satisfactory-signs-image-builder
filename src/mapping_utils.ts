import { blueprintSignsSize, blueprintSignsSteps, blueprintSignsMinZ, blueprintSignsMinX } from './config';

export function mapZValueToRow(value: number): number {
    const min = blueprintSignsMinZ, steps = blueprintSignsSteps, minMapped = 1, maxMapped = blueprintSignsSize;
    return Math.max(minMapped, Math.min(maxMapped, Math.round((value - min) / steps) + 1));
}

export function mapXValueToCol(value: number): number {
    const min = blueprintSignsMinX, steps = blueprintSignsSteps, minMapped = blueprintSignsSize, maxMapped = 1;
    return Math.max(maxMapped, Math.min(minMapped, minMapped - Math.round((value - min) / steps)));
}

export function parseTranslationToPosition(translation: { x: number, y: number, z: number }) {
    return { row: mapZValueToRow(translation.z), col: mapXValueToCol(translation.x) };
}

// export function intToHex(value: number): string {
//     return value.toString(16).toUpperCase().padStart(2, '0');
// }
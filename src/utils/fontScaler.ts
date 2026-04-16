import { TextSize } from '@src/models/main/MyAccount/Settings';

/**
 * Scales a font size based on the user's text size preference.
 *
 * @remarks
 * This function applies a multiplier to the base font size according to the
 * selected {@link TextSize} option. System-level font scaling is handled
 * separately by React Native's `allowFontScaling` prop.
 *
 * - `'Chica'` — 90% of base size
 * - `'Mediana'` — 100% of base size
 * - `'Sistema'` — 100% of base size (delegates OS scaling to `allowFontScaling`)
 * - `'Grande'` — 110% of base size
 *
 * @param size - The base font size in pixels
 * @param textSize - The user's selected text size preference
 * @returns The scaled font size
 *
 * @example
 * ```ts
 * scaleFont(16, 'Grande'); // 17.6
 * scaleFont(16, 'Chica');  // 14.4
 * ```
 */
const TEXT_SIZE_MULTIPLIERS: Record<TextSize, number> = {
  Chica: 0.87,
  Mediana: 1.0,
  System: 1.0,
  Grande: 1.13
};

export const scaleFont = (size: number, textSize: TextSize): number =>
  size * (TEXT_SIZE_MULTIPLIERS[textSize] ?? 1.0);

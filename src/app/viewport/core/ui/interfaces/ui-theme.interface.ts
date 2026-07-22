import { Vector2 } from "@xloxlolex/vector-math";

/**
 * Interface defining the theme for the UI components.
 *
 * @export
 * @interface UITheme
 */
export interface UITheme {
    backdropBackground: string;
    panelBackground: string;
    panelBorder: string;
    panelTitleColor: string;
    panelTextColor: string;
    buttonBackground: string;
    buttonHoverBackground: string;
    buttonPressedBackground: string;
    buttonDisabledBackground: string;
    buttonTextColor: string;
    buttonDisabledTextColor: string;
    accentColor: string;
    shadowColor: string;
    panelRadius: number;
    buttonRadius: number;
    borderWidth: number;
    padding: Vector2;
    titleFont: string;
    bodyFont: string;
    buttonFont: string;
    shadowBlur: number;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
}
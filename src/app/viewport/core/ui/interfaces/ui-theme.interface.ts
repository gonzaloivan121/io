import { Vector2 } from "@xloxlolex/vector-math";
import { FillStyle, StrokeStyle } from "../../renderer";

/**
 * Interface defining the theme for the UI components.
 *
 * @export
 * @interface UITheme
 */
export interface UITheme {
    /**
     * The fill style of the backdrop, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UITheme
     */
    backdropBackground: FillStyle;

    /**
     * The fill style of the panel background, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UITheme
     */
    panelBackground: FillStyle;

    /**
     * The stroke style of the panel border, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {StrokeStyle}
     * @memberof UITheme
     */
    panelBorder: StrokeStyle;

    /**
     * The fill style of the panel title text, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UITheme
     */
    panelTitleColor: FillStyle;

    /**
     * The fill style of the panel content text, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UITheme
     */
    panelTextColor: FillStyle;

    /**
     * The fill style of the button background, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UITheme
     */
    buttonBackgroundColor: FillStyle;

    /**
     * The fill style of the button background when the mouse is hovering over it, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UITheme
     */
    buttonHoverBackgroundColor: FillStyle;

    /**
     * The fill style of the button background when it is pressed, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UITheme
     */
    buttonPressedBackgroundColor: FillStyle;

    /**
     * The fill style of the button background when it is disabled, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UITheme
     */
    buttonDisabledBackgroundColor: FillStyle;

    /**
     * The stroke style of the button border, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {StrokeStyle}
     * @memberof UITheme
     */
    buttonBorderColor: StrokeStyle;

    /**
     * The stroke style of the button border when the mouse is hovering over it, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {StrokeStyle}
     * @memberof UITheme
     */
    buttonHoverBorderColor: StrokeStyle;

    /**
     * The stroke style of the button border when it is pressed, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {StrokeStyle}
     * @memberof UITheme
     */
    buttonPressedBorderColor: StrokeStyle;

    /**
     * The stroke style of the button border when it is disabled, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {StrokeStyle}
     * @memberof UITheme
     */
    buttonDisabledBorderColor: StrokeStyle;

    /**
     * The fill style of the button text, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UITheme
     */
    buttonTextColor: FillStyle;

    /**
     * The fill style of the button text when it is disabled, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UITheme
     */
    buttonDisabledTextColor: FillStyle;

    /**
     * The accent color used for highlights and interactive elements, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UITheme
     */
    accentColor: FillStyle;

    /**
     * The color of the shadow used for UI elements, specified as a CSS color string (e.g., "rgba(0, 0, 0, 0.18)").
     *
     * @type {string}
     * @memberof UITheme
     */
    shadowColor: string;

    /**
     * The radius of the rounded corners for panels and buttons, specified in pixels.
     *
     * @type {number}
     * @memberof UITheme
     */
    panelRadius: number;

    /**
     * The radius of the rounded corners for buttons, specified in pixels.
     *
     * @type {number}
     * @memberof UITheme
     */
    buttonRadius: number;

    /**
     * The width of the border for panels and buttons, specified in pixels.
     *
     * @type {number}
     * @memberof UITheme
     */
    borderWidth: number;

    /**
     * The padding inside panels and buttons, specified as a Vector2 where x is the horizontal padding and y is the vertical padding.
     *
     * @type {Vector2}
     * @memberof UITheme
     */
    padding: Vector2;

    /**
     * The font style used for titles in the UI, specified as a CSS font string (e.g., "bold 16px Arial").
     *
     * @type {string}
     * @memberof UITheme
     */
    titleFont: string;

    /**
     * The font style used for body text in the UI, specified as a CSS font string (e.g., "14px Arial").
     *
     * @type {string}
     * @memberof UITheme
     */
    bodyFont: string;

    /**
     * The font style used for buttons in the UI, specified as a CSS font string (e.g., "600 14px Arial").
     *
     * @type {string}
     * @memberof UITheme
     */
    buttonFont: string;

    /**
     * The blur radius of the shadow used for UI elements, specified in pixels.
     *
     * @type {number}
     * @memberof UITheme
     */
    shadowBlur: number;

    /**
     * The offset of the shadow used for UI elements, specified as a Vector2 where x is the horizontal offset and y is the vertical offset.
     *
     * @type {Vector2}
     * @memberof UITheme
     */
    shadowOffset: Vector2;

    /**
     * The text alignment for text elements in the UI, which can be 'left', 'right', 'center', 'start', or 'end'.
     *
     * @type {CanvasTextAlign}
     * @memberof UITheme
     */
    textAlign: CanvasTextAlign;

    /**
     * The text baseline for text elements in the UI, which can be 'top', 'hanging', 'middle', 'alphabetic', 'ideographic', or 'bottom'.
     *
     * @type {CanvasTextBaseline}
     * @memberof UITheme
     */
    textBaseline: CanvasTextBaseline;
}
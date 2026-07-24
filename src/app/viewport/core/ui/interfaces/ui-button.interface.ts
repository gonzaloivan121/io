import { Vector2 } from "@xloxlolex/vector-math";
import { UIAnchor } from "../types/ui-anchor.type";
import { FillStyle, StrokeStyle } from "../../renderer";

/**
 * Interface defining the options for rendering a button in the `UI` system.
 *
 * @export
 * @interface UIButton
 */
export interface UIButton {
    /**
     * The position of the button in the UI coordinate system.
     *
     * @type {Vector2}
     * @memberof UIButton
     */
    position: Vector2;

    /**
     * The size of the button in the UI coordinate system.
     *
     * @type {Vector2}
     * @memberof UIButton
     */
    size?: Vector2;

    /**
     * The anchor point of the button, which determines how the button is positioned relative to its position.
     *
     * @type {UIAnchor}
     * @memberof UIButton
     */
    anchor?: UIAnchor;

    /**
     * Indicates whether the button is enabled or disabled. A disabled button will not respond to user interactions.
     *
     * @type {boolean}
     * @memberof UIButton
     */
    enabled?: boolean;

    /**
     * The fill style of the button, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIButton
     */
    fillStyle?: FillStyle;

    /**
     * The fill style of the button when the mouse is hovering over it, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIButton
     */
    hoverFillStyle?: FillStyle;

    /**
     * The fill style of the button when it is pressed, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIButton
     */
    pressedFillStyle?: FillStyle;

    /**
     * The stroke style of the button, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {StrokeStyle}
     * @memberof UIButton
     */
    strokeStyle?: StrokeStyle;

    /**
     * The text color of the button's label, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIButton
     */
    textColor?: FillStyle;

    /**
     * The font used for the button's label, specified as a CSS font string (e.g., "16px Arial").
     *
     * @type {string}
     * @memberof UIButton
     */
    font?: string;

    /**
     * The text alignment of the button's label, which can be 'left', 'right', 'center', 'start', or 'end'.
     *
     * @type {CanvasTextAlign}
     * @memberof UIButton
     */
    textAlign?: CanvasTextAlign;

    /**
     * The text baseline of the button's label, which can be 'top', 'hanging', 'middle', 'alphabetic', 'ideographic', or 'bottom'.
     *
     * @type {number}
     * @memberof UIButton
     */
    textBaseline?: CanvasTextBaseline;

    /**
     * The radius of the button's corners, allowing for rounded corners. A value of 0 means sharp corners.
     *
     * @type {number}
     * @memberof UIButton
     */
    radius?: number;

    /**
     * The padding inside the button, which defines the space between the button's content (like text) and its border.
     *
     * @type {Vector2}
     * @memberof UIButton
     */
    padding?: Vector2;
}
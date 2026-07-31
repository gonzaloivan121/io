import { Vector2 } from "@xloxlolex/vector-math";

import { UIAnchor } from "../types/ui-anchor.type";
import { FillStyle, StrokeStyle } from "../../engine/renderer";

/**
 * Interface defining the options for rendering a label in the `UI` system.
 *
 * @export
 * @interface UILabel
 */
export interface UILabel {
    /**
     * The position of the label in the UI coordinate system.
     *
     * @type {Vector2}
     * @memberof UILabel
     */
    position: Vector2;

    /**
     * The anchor point of the label, which determines how the label is positioned relative to its position.
     *
     * @type {UIAnchor}
     * @memberof UILabel
     */
    anchor?: UIAnchor;

    /**
     * The fill style of the label, which can be a color string, a `CanvasGradient`, or a `CanvasPattern`.
     *
     * @type {FillStyle}
     * @memberof UILabel
     */
    fillStyle?: FillStyle;
    
    /**
     * The stroke style of the label, which can be a color string, a `CanvasGradient`, or a `CanvasPattern`.
     *
     * @type {StrokeStyle}
     * @memberof UILabel
     */
    strokeStyle?: StrokeStyle;

    /**
     * The font style of the label, which can be a CSS font string.
     *
     * @type {string}
     * @memberof UILabel
     */
    font?: string;

    /**
     * The text alignment of the label, which can be 'left', 'right', 'center', 'start', or 'end'.
     *
     * @type {CanvasTextAlign}
     * @memberof UILabel
     */
    textAlign?: CanvasTextAlign;

    /**
     * The text baseline of the label, which can be 'top', 'hanging', 'middle', 'alphabetic', 'ideographic', or 'bottom'.
     *
     * @type {CanvasTextBaseline}
     * @memberof UILabel
     */
    textBaseline?: CanvasTextBaseline;
}

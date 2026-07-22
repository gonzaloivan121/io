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
    position: Vector2;
    size?: Vector2;
    anchor?: UIAnchor;
    enabled?: boolean;
    fillStyle?: FillStyle;
    hoverFillStyle?: FillStyle;
    pressedFillStyle?: FillStyle;
    strokeStyle?: StrokeStyle;
    textColor?: string;
    font?: string;
    textAlign?: CanvasTextAlign;
    radius?: number;
    padding?: Vector2;
}
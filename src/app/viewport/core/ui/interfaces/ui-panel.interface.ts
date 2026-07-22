import { Vector2 } from "@xloxlolex/vector-math";
import { UIAnchor } from "../types/ui-anchor.type";
import { FillStyle, StrokeStyle } from "../../renderer";

/**
 * Interface defining the options for rendering a panel in the `UI` system.
 *
 * @export
 * @interface UIPanel
 */
export interface UIPanel {
    position: Vector2;
    size: Vector2;
    anchor?: UIAnchor;
    fillStyle?: FillStyle;
    strokeStyle?: StrokeStyle;
    titleColor?: string;
    textColor?: string;
    titleFont?: string;
    contentFont?: string;
    titleAlign?: CanvasTextAlign;
    radius?: number;
    padding?: Vector2;
    lineGap?: number;
}
import { Vector2 } from "@xloxlolex/vector-math";
import { UIAnchor } from "../types/ui-anchor.type";

/**
 * Interface defining the options for rendering a label in the `UI` system.
 *
 * @export
 * @interface UILabel
 */
export interface UILabel {
    position: Vector2;
    anchor?: UIAnchor;
    color?: string;
    font?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
}

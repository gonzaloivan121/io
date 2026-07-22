import { Vector2 } from "@xloxlolex/vector-math";
import { FillStyle } from "../../renderer";

/**
 * Interface defining the options for rendering a backdrop in the `UI` system.
 *
 * @export
 * @interface UIBackdrop
 */
export interface UIBackdrop {
    position?: Vector2;
    size?: Vector2;
    fillStyle?: FillStyle;
}

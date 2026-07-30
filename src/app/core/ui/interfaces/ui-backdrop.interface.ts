import { Vector2 } from "@xloxlolex/vector-math";

import { FillStyle } from "../../engine/renderer";

/**
 * Interface defining the options for rendering a backdrop in the `UI` system.
 *
 * @export
 * @interface UIBackdrop
 */
export interface UIBackdrop {
    /**
     * The position of the backdrop in the UI coordinate system.
     *
     * @type {Vector2}
     * @memberof UIBackdrop
     */
    position?: Vector2;

    /**
     * The size of the backdrop in the UI coordinate system.
     *
     * @type {Vector2}
     * @memberof UIBackdrop
     */
    size?: Vector2;

    /**
     * The fill style of the backdrop, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIBackdrop
     */
    fillStyle?: FillStyle;
}

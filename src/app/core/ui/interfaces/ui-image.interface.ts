import { Vector2 } from "@xloxlolex/vector-math";

import { UIAnchor } from "../types/ui-anchor.type";

/**
 * Interface defining the options for rendering an image in the `UI` system.
 *
 * @export
 * @interface UIImage
 */
export interface UIImage {
    /**
     * The source image to be drawn on the canvas.
     * This can be an HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement.
     *
     * @type {CanvasImageSource}
     * @memberof UIImage
     */
    image: CanvasImageSource;

    /**
     * The position of the upper-left corner where the image should be drawn on the canvas.
     *
     * @type {Vector2}
     * @memberof UIImage
     */
    position: Vector2;

    /**
     * The size to draw the image on the canvas. The image will be scaled to fit this size.
     *
     * @type {Vector2}
     * @memberof UIImage
     */
    size: Vector2;

    /**
     * The anchor point for the image, which determines how the image is positioned relative to its `position`.
     *
     * @type {UIAnchor}
     * @memberof UIImage
     */
    anchor?: UIAnchor;
}
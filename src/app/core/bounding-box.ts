/**
 * Represents the bounding box of an entity in the viewport.
 *
 * @export
 * @interface IBoundingBox
 */
export interface IBoundingBox {
    /**
     * The left boundary of the bounding box.
     *
     * @type {number}
     * @memberof IBoundingBox
     */
    left: number;

    /**
     * The right boundary of the bounding box.
     *
     * @type {number}
     * @memberof IBoundingBox
     */
    right: number;

    /**
     * The top boundary of the bounding box.
     *
     * @type {number}
     * @memberof IBoundingBox
     */
    top: number;

    /**
     * The bottom boundary of the bounding box.
     *
     * @type {number}
     * @memberof IBoundingBox
     */
    bottom: number;
}
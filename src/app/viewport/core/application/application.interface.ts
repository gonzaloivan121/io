/**
 * Interface defining the structure of an `Application` that can be run by the `Engine`.
 *
 * @export
 * @interface IApplication
 */
export interface IApplication {
    /**
     * Initializes the `Application` with the given dimensions.
     *
     * This method is called once during startup.
     *
     * @param {number} width - The initial `width` of the `Application`.
     * @param {number} height - The initial `height` of the `Application`.
     * @memberof IApplication
     */
    Initialize(width: number, height: number): void;

    /**
     * Restarts the `Application` with the given dimensions.
     *
     * @param {number} width - The new `width` of the `Application`.
     * @param {number} height - The new `height` of the `Application`.
     * @memberof IApplication
     */
    Restart(width: number, height: number): void;

    /**
     * Updates the `Application` state.
     *
     * This method is called on every animation frame with the elapsed time since
     * the last update and the current dimensions.
     *
     * @param {number} ts - The elapsed time in seconds since the last update.
     * @param {number} width - The current `width` of the `Application`.
     * @param {number} height - The current `height` of the `Application`.
     * @memberof IApplication
     */
    Update(ts: number, width: number, height: number): void;

    /**
     * Renders the `Application` state to the screen.
     *
     * This method is called on every animation frame after `Update` with the
     * elapsed time since the last update and the current dimensions.
     *
     * @param {number} ts - The elapsed time in seconds since the last update.
     * @param {number} width - The current `width` of the `Application`.
     * @param {number} height - The current `height` of the `Application`.
     * @memberof IApplication
     */
    Draw(ts: number, width: number, height: number): void;
}

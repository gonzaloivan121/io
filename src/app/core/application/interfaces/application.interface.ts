/**
 * Interface defining the structure of an `Application` that can be run by the `Engine`.
 *
 * @export
 * @interface Application
 */
export interface Application {
    /**
     * Initializes the `Application`.
     *
     * This method is called once during startup.
     *
     * @memberof Application
     */
    Initialize(): void;

    /**
     * Shuts down the `Application`.
     * 
     * This method is called once during shutdown.
     *
     * @memberof Application
     */
    Shutdown(): void;

    /**
     * Restarts the `Application`.
     *
     * @memberof Application
     */
    Restart(): void;

    /**
     * Updates the `Application` state.
     *
     * This method is called every frame before `Draw`.
     *
     * @memberof Application
     */
    Update(): void;

    /**
     * Renders the `Application` state to the screen.
     *
     * This method is called every frame after `Update`.
     *
     * @memberof Application
     */
    Draw(): void;
}

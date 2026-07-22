/**
 * Time class to manage time-related properties in the application.
 * 
 * It holds the current time and delta time values, which can be used for animations,
 * game logic updates, and other time-dependent features.
 *
 * @export
 * @class Time
 */
export class Time {
    /**
     * The current time in seconds since the application started.
     *
     * @static
     * @type {number}
     * @memberof Time
     */
    public static Time: number = 0;

    /**
     * The time difference in seconds between the current frame and the previous frame.
     *
     * @static
     * @type {number}
     * @memberof Time
     */
    public static DeltaTime: number = 0;

    /**
     * The unscaled delta time in seconds, which is the time difference between the current frame and the previous frame without any time scaling applied.
     *
     * @static
     * @type {number}
     * @memberof Time
     */
    public static UnscaledDeltaTime: number = 0;

    /**
     * The time scale factor applied to the delta time.
     *
     * @private
     * @static
     * @type {number}
     * @memberof Time
     */
    private static timeScale: number = 1;

    /**
     * The minimum time scale value allowed for the application.
     *
     * @private
     * @static
     * @type {number}
     * @memberof Time
     */
    private static minTimeScale: number = 0.05;

    /**
     * The maximum time scale value allowed for the application.
     *
     * @private
     * @static
     * @type {number}
     * @memberof Time
     */
    private static maxTimeScale: number = 1;

    /**
     * Gets the current time scale for the application.
     *
     * @static
     * @type {number}
     * @memberof Time
     */
    public static get TimeScale(): number {
        return this.timeScale;
    }

    /**
     * Sets the time scale for the application.
     *
     * @static
     * @param {number} scale - The new time scale value to set.
     * @memberof Time
     */
    public static SetTimeScale(scale: number): void {
        if (!Number.isFinite(scale)) {
            return;
        }

        this.timeScale = Math.max(this.minTimeScale, Math.min(this.maxTimeScale, scale));
    }

    /**
     * Resets the time scale to its default value of 1.
     *
     * @static
     * @memberof Time
     */
    public static ResetTimeScale(): void {
        this.SetTimeScale(1);
    }
}

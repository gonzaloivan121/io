/**
 * Time class to manage time-related properties in the application.
 * It holds the current time and delta time values.
 * These values can be used for animations, game logic updates, and other time-dependent features.
 */
export class Time {
    public static Time: number = 0;
    public static DeltaTime: number = 0;
    public static UnscaledDeltaTime: number = 0;

    private static timeScale: number = 1;

    public static get TimeScale(): number {
        return this.timeScale;
    }

    public static set TimeScale(scale: number) {
        if (!Number.isFinite(scale)) {
            return;
        }

        this.timeScale = Math.max(0.05, Math.min(1, scale));
    }

    public static ResetScale(): void {
        this.timeScale = 1;
    }
}

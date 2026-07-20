import { Vector2 } from "@xloxlolex/vector-math";
import { Color } from "./color";
import { Renderer } from "./renderer";

/**
 * Represents a Timer that can be started, paused, stopped, and reset.
 * It tracks elapsed time and can display the time in a formatted string.
 */
export class Timer {
    /**
     * The time when the timer was started.
     * This is used to calculate the elapsed time.
     * @private
     */
    private startTime: number = 0;

    /**
     * The total elapsed time in milliseconds.
     * This is updated when the timer is paused or stopped.
     * @private
     */
    private elapsedTime: number = 0;

    /**
     * Indicates whether the timer is currently running.
     * It is set to true when the timer is started and false when paused or stopped.
     * @private
     */
    private isRunning: boolean = false;

    /**
     * The color of the timer text.
     * This color is used when drawing the timer text on the screen.
     * @private
     */
    private color: Color = Color.White;

    /**
     * The position of the timer text on the screen.
     * This is used to determine where to draw the timer text.
     * @private
     */
    private position: Vector2 = Vector2.zero;

    /**
     * Creates an instance of Timer.
     * @param {Color} color - The color of the timer text.
     */
    constructor(color: Color = Color.White) {
        this.color = color;
        this.Reset();
    }

    /**
     * Gets whether the timer is currently running.
     * @returns {boolean} True if the timer is running, false otherwise.
     */
    public get IsRunning(): boolean {
        return this.isRunning;
    }

    /**
     * Gets the current position of the timer.
     * @returns {Vector2} The position of the timer.
     */
    public get Position(): Vector2 {
        return this.position;
    }

    /**
     * Gets the color of the timer text.
     * This color is used when drawing the timer text on the screen.
     * @returns {Color} The color of the timer text.
     */
    public get Color(): Color {
        return this.color;
    }

    /**
     * Sets the color of the timer text.
     * This color will be used when drawing the timer text on the screen.
     * @param {Color} color - The new color for the timer text.
     */
    public set Color(color: Color) {
        this.color = color;
    }

    /**
     * Starts the timer if it is not already running.
     * If the timer was paused, it resumes from the last elapsed time.
     * 
     * @memberof Timer
     */
    public Start(): void {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.isRunning = true;
        }
    }

    /**
     * Pauses the timer if it is currently running.
     * It saves the elapsed time so that it can be resumed later.
     * 
     * @memberof Timer
     */
    public Pause(): void {
        if (this.isRunning) {
            this.elapsedTime = Date.now() - this.startTime;
            this.isRunning = false;
        }
    }

    /**
     * Stops the timer and resets the elapsed time.
     * The timer can be restarted with the `Reset` method.
     *
     * @memberof Timer
     */
    public Stop(): void {
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
    }

    /**
     * Resets the timer to its initial state.
     * It sets the start time to the current time and resets the elapsed time.
     * The timer will be running after this method is called.
     *
     * @memberof Timer
     */
    public Reset(): void {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.color = Color.White;

        if (!this.isRunning) {
            this.isRunning = true;
        }
    }

    /**
     * Gets the elapsed time in milliseconds.
     * If the timer is running, it calculates the elapsed time since it started.
     *
     * @returns {number} The elapsed time in milliseconds.
     * @memberof Timer
     */
    public Elapsed(): number {
        if (this.isRunning) {
            return Date.now() - this.startTime;
        }

        return this.elapsedTime;
    }

    /**
     * Draws the timer text on the screen at the specified position.
     * The text is formatted as "HH:MM:SS" based on the elapsed time.
     * @memberof Timer
     */
    public Draw(): void {
        const fontSize: number = 64;
        const position: Vector2 = new Vector2(
            Renderer.ViewportCenter.x,
            fontSize * 1.5
        );

        Renderer.SetFillStyle(this.color.String);

        Renderer.DrawText(
            Timer.Format(this.Elapsed()),
            position,
            {
                font: `${fontSize}px Arial`,
                textBaseline: 'middle',
            }
        );
    }

    /**
     * Formats the elapsed time in milliseconds into a string of the format `HH:MM:SS`.
     * 
     * @static
     * @param {number} ms - The elapsed time in milliseconds.
     * @returns {string} The formatted time string.
     * @memberof Timer
     */
    public static Format(ms: number): string {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);

        const h = hours.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');

        return `${h}:${m}:${s}`;
    }
}
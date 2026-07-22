import { Vector2 } from '@xloxlolex/vector-math';
import { Color } from './color';
import { Renderer } from './renderer';
import { UI } from './ui/ui';

/**
 * Represents the specification for a Timer's appearance,
 * including color, position, font size, and text baseline.
 *
 * @export
 * @interface ITimerSpecification
 */
export interface ITimerSpecification {
    color: Color;
    position: Vector2;
    fontSize: number;
    textBaseline?: CanvasTextBaseline;
}

/**
 * Represents a Timer that can be started, paused, stopped, and reset.
 *
 * It tracks elapsed time and can display the time in a formatted string.
 *
 * @export
 * @class Timer
 */
export class Timer {
    /**
     * The start time of the timer in milliseconds.
     *
     * @private
     * @type {number}
     * @memberof Timer
     */
    private startTime: number = 0;

    /**
     * The total elapsed time in milliseconds.
     *
     * @private
     * @type {number}
     * @memberof Timer
     */
    private elapsedTime: number = 0;

    /**
     * Indicates whether the timer is currently running.
     *
     * @private
     * @type {boolean}
     * @memberof Timer
     */
    private isRunning: boolean = false;

    /**
     * The specification for the timer's appearance, including color, position, font size, and text baseline.
     *
     * @private
     * @type {ITimerSpecification}
     * @memberof Timer
     */
    private specification: ITimerSpecification;

    /**
     * Creates an instance of `Timer`.
     *
     * @param {ITimerSpecification} [specification] - The specification for the timer's appearance.
     * @memberof Timer
     */
    constructor(
        specification: ITimerSpecification = {
            color: Color.White,
            position: Vector2.zero,
            fontSize: 64,
            textBaseline: 'middle',
        },
    ) {
        this.specification = specification;
        this.Reset();
    }

    /**
     * Gets whether the timer is currently running.
     *
     * @readonly
     * @type {boolean}
     * @memberof Timer
     */
    public get Running(): boolean {
        return this.isRunning;
    }

    /**
     * Gets the current position of the timer.
     *
     * @readonly
     * @type {Vector2}
     * @memberof Timer
     */
    public get Position(): Vector2 {
        return this.specification.position;
    }

    /**
     * Gets the color of the timer text.
     *
     * @type {Color}
     * @memberof Timer
     */
    public get Color(): Color {
        return this.specification.color;
    }

    /**
     * Gets the font size of the timer text.
     *
     * @readonly
     * @type {number}
     * @memberof Timer
     */
    public get FontSize(): number {
        return this.specification.fontSize;
    }

    /**
     * Gets the text baseline of the timer text.
     *
     * @readonly
     * @type {(CanvasTextBaseline | undefined)}
     * @memberof Timer
     */
    public get TextBaseline(): CanvasTextBaseline | undefined {
        return this.specification.textBaseline;
    }

    /**
     * Starts the timer if it is not already running.
     *
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
     *
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
     *
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
     *
     * It sets the start time to the current time and resets the elapsed time.
     * The timer will be running after this method is called.
     *
     * @memberof Timer
     */
    public Reset(): void {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.specification.color = Color.White;

        if (!this.isRunning) {
            this.isRunning = true;
        }
    }

    /**
     * Gets the elapsed time in milliseconds.
     *
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
     * Draws the timer text on the screen.
     *
     * The text is formatted as "HH:MM:SS" based on the elapsed time.
     *
     * @memberof Timer
     */
    public Draw(): void {
        const text = Timer.Format(this.Elapsed());
        const position = this.Position;
        const font = `${this.FontSize}px Arial`;
        const textBaseline = this.TextBaseline;
        const color = this.Color.String;

        UI.Label(text, {
            position,
            font,
            textBaseline,
            color,
        });
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
        if (ms < 0) {
            return '00:00:00';
        }

        if (Number.isNaN(ms)) {
            return '00:00:00';
        }

        if (!Number.isFinite(ms)) {
            return '00:00:00';
        }

        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);

        const h = hours.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');

        return `${h}:${m}:${s}`;
    }
}

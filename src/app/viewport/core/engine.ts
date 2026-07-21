import { Vector2 } from '@xloxlolex/vector-math';
import { Time } from './time';
import { Color } from './color';
import { Renderer } from './renderer';
import { InvalidArgumentError, NotFoundError } from '../../errors';
import { Input } from './input/input';
import { Log } from './log/log';

/**
 * Represents the core engine of the application, responsible for managing the game loop, rendering, and timing.
 * It provides methods to initialize the engine, run the game loop, and handle rendering.
 *
 * @export
 * @class Engine
 */
export class Engine {
    /**
     * The interval ID for the game loop.
     * This is used to clear the interval when stopping the game loop.
     *
     * @static
     * @type {number}
     * @memberof Engine
     */
    private static intervalId: number;

    /**
     * Initializes the engine with the specified canvas element.
     * This method sets up the canvas and context for rendering.
     *
     * @static
     * @param {HTMLCanvasElement} canvas - The HTML canvas element to be used for rendering the viewport.
     * @throws {InvalidArgumentError} If the canvas element or the 2D context is not provided or is invalid.
     * @memberof Engine
     */
    public static Initialize(canvas: HTMLCanvasElement): void {
        if (!canvas) {
            throw new InvalidArgumentError(
                'Canvas element must be provided for engine initialization.',
            );
        }

        const context = canvas.getContext('2d', {
            alpha: false,
        });

        if (!context) {
            throw new InvalidArgumentError(
                'Failed to get 2D context from the provided canvas element.',
            );
        }

        Log.Initialize();

        Renderer.Initialize(context);
        Renderer.Resize();

        Input.Initialize();
    }

    /**
     * Runs the engine and starts the game loop.
     *
     * This method uses `requestAnimationFrame` to create a loop that calls the provided update function.
     * It calculates the delta time for each frame and updates the `Time` class accordingly.
     *
     * This is the main entry point for running the game logic and rendering.
     * It should be called after the engine has been initialized and the canvas is ready.
     *
     * @static
     * @param {() => void} update - The update function to be called on each frame.
     * @throws {InvalidArgumentError} If the update function is not provided or is not a function.
     * @memberof Engine
     */
    public static Run(update: () => void): void {
        if (!update || typeof update !== 'function') {
            throw new InvalidArgumentError(
                'Update function must be provided and must be a function.',
            );
        }

        this.CalculateDeltaTime();
        update();

        Input.Update();

        this.intervalId = requestAnimationFrame(this.Run.bind(this, update));
    }

    /**
     * Stops the game loop and clears the animation frame request.
     *
     * @static
     * @memberof Engine
     */
    public static Stop(): void {
        cancelAnimationFrame(this.intervalId);
    }

    /**
     * Calculates the delta time since the last frame.
     *
     * This method updates the `Time.DeltaTime` and `Time.Time` properties.
     * Delta time is the time difference between the current frame and the previous frame,
     * which can be used for smooth animations and game logic updates.
     *
     * It also updates the `Time.UnscaledDeltaTime` property, which represents the delta time without any time scaling applied.
     *
     * @private
     * @static
     * @memberof Engine
     */
    private static CalculateDeltaTime(): void {
        const now = performance.now();

        Time.UnscaledDeltaTime = -(Time.Time - now) / 1000;
        Time.DeltaTime = Time.UnscaledDeltaTime * Time.TimeScale;
        Time.Time = now;
    }

    /**
     * Draws the background of the viewport with a specified color.
     *
     * This method fills the entire viewport with the given color.
     * It is typically used to set a background color before drawing other elements.
     *
     * @static
     * @param {Color} [color=Color.Black] - The color to fill the background with, default is black.
     * @memberof Engine
     */
    public static DrawBackground(color: Color = Color.Black): void {
        Renderer.Clear();

        Renderer.FillRect(
            Vector2.zero,
            new Vector2(Renderer.GetWidth(), Renderer.GetHeight()),
            color.String,
        );
    }

    /**
     * Loads an image from a specified source URL.
     *
     * This method creates a new `Image` object and sets its source to the provided URL.
     * The image can then be used for drawing on the canvas.
     *
     * @static
     * @param {string} source - The URL of the image to load.
     * @returns {CanvasImageSource} The loaded image as a CanvasImageSource.
     * @memberof Engine
     */
    public static LoadImage(source: string): CanvasImageSource {
        const image: CanvasImageSource = new Image();
        image.src = source;

        return image;
    }

    /**
     * Loads an audio file from a specified source URL.
     *
     * This method creates a new `HTMLAudioElement` and sets its source to the provided URL.
     *
     * @static
     * @param {string} source - The URL of the audio file to load.
     * @returns {HTMLAudioElement} The loaded audio element.
     * @memberof Engine
     */
    public static LoadAudio(source: string): HTMLAudioElement {
        const audio: HTMLAudioElement = new Audio();
        audio.src = source;

        return audio;
    }

    /**
     * Loads a video from a specified source URL.
     *
     * This method creates a new `HTMLVideoElement` and sets its source to the provided URL.
     *
     * @static
     * @param {string} source - The URL of the video to load.
     * @returns {HTMLVideoElement} The loaded video element.
     * @memberof Engine
     */
    public static LoadVideo(source: string): HTMLVideoElement {
        const video: HTMLVideoElement = document.createElement('video');
        video.src = source;

        return video;
    }
}

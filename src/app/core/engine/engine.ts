import { Application } from '../application/interfaces/application.interface';

import { Time } from './time';
import { Renderer } from './renderer';

import { Input } from '../input/input';
import { Log } from '../log/log';
import { Network } from '../network/network';
import { UI } from '../ui/ui';

import {
    AlreadyInitializedError,
    InvalidArgumentError,
    NotInitializedError
} from '../../errors';

/**
 * Represents the core `Engine` of the application, responsible for managing the game loop, rendering, and timing.
 * It provides methods to initialize the `Engine`, run the game loop, and handle rendering.
 *
 * @export
 * @class Engine
 */
export class Engine {
    /**
     * Indicates whether the `Engine` has been initialized.
     *
     * @private
     * @static
     * @type {boolean}
     * @memberof Engine
     */
    private static initialized: boolean = false;

    /**
     * Indicates whether the `Engine` is currently running.
     *
     * @private
     * @static
     * @type {boolean}
     * @memberof Engine
     */
    private static running: boolean = false;

    /**
     * The animation frame ID for the game loop.
     *
     * This is used to cancel the animation frame when stopping the game loop.
     *
     * @static
     * @type {number}
     * @memberof Engine
     */
    private static animationFrameId: number;

    /**
     * The `Application` instance that the engine will run.
     *
     * This instance is responsible for the game logic, including initialization, updating, and drawing.
     *
     * @private
     * @static
     * @type {Application}
     * @memberof Engine
     */
    private static application: Application;

    /**
     * Indicates whether the `Engine` has been initialized.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Engine
     */
    public static get Initialized(): boolean {
        return this.initialized;
    }

    /**
     * Initializes the `Engine` with the specified canvas element.
     * This method sets up the canvas and context for rendering.
     *
     * @static
     * @param {HTMLCanvasElement} canvas - The HTML canvas element to be used for rendering the viewport.
     * @param {Application} application - The `Application` instance to be run by the engine.
     * @throws {AlreadyInitializedError} If the `Engine` has already been initialized.
     * @throws {InvalidArgumentError} If the application instance, the canvas element or the 2D context are not provided or are invalid.
     * @memberof Engine
     */
    public static Initialize(canvas: HTMLCanvasElement, application: Application): void {
        Log.Info('Engine.Initialize() - Initializing Engine...');
        Log.Trace('Engine.Initialize() - Checking if Engine is already initialized...');

        if (this.initialized) {
            throw new AlreadyInitializedError(
                'Engine has already been initialized. Please call Engine.Shutdown() before re-initializing.',
            );
        }

        Log.Trace(
            'Engine.Initialize() - Engine is not initialized. Proceeding with initialization...',
        );

        Log.Trace('Engine.Initialize() - Checking application instance...');

        if (!application) {
            throw new InvalidArgumentError(
                'Application must be provided for Engine initialization.',
            );
        }

        Log.Trace('Engine.Initialize() - Application instance provided.');

        this.application = application;

        Log.Trace('Engine.Initialize() - Checking canvas element...');

        if (!canvas) {
            throw new InvalidArgumentError(
                'Canvas element must be provided for Engine initialization.',
            );
        }

        Log.Trace('Engine.Initialize() - Canvas element provided.');
        Log.Trace('Engine.Initialize() - Getting 2D context from canvas...');

        const context = canvas.getContext('2d', {
            alpha: false,
        });

        Log.Trace('Engine.Initialize() - Checking 2D context from canvas...');

        if (!context) {
            throw new InvalidArgumentError(
                'Failed to get 2D context from the provided canvas element.',
            );
        }

        Log.Trace('Engine.Initialize() - 2D context obtained from canvas.');
        Log.Trace('Engine.Initialize() - Initializing Renderer, UI, Input, and Network ...');

        Renderer.Initialize(context);
        UI.Initialize();
        Input.Initialize();
        Network.Initialize();

        Log.Trace('Engine.Initialize() - Initializing Application...');

        application.Initialize();
        Log.Trace('Engine.Initialize() - Application initialized successfully.');

        this.initialized = true;
        Log.Debug('Engine.Initialize() - Engine initialized successfully.');
    }

    /**
     * Starts the `Engine` and begins the game loop.
     *
     * This is the main entry point for running the `Engine` logic and rendering.
     * It should be called after the `Engine` has been initialized and the canvas is ready.
     *
     * @static
     * @throws {NotInitializedError} If the `Engine` has not been initialized.
     * @memberof Engine
     */
    public static Start(): void {
        Log.Info('Engine.Start() - Starting the Engine...');

        if (!this.initialized) {
            throw new NotInitializedError(
                'Engine must be initialized before starting. Please call Engine.Initialize() with a valid canvas context and application instance.',
            );
        }

        this.running = true;
        this.Run();
    }

    /**
     * Runs the `Engine` and starts the game loop.
     *
     * This method uses `requestAnimationFrame` to create a loop that calls the `Update` and `Draw` methods of the `Application` instance.
     * It calculates the delta time for each frame and updates the `Time` class accordingly.
     *
     * @private
     * @static
     * @memberof Engine
     */
    private static Run(): void {
        this.CalculateDeltaTime();

        if (!this.application) {
            throw new InvalidArgumentError(
                'Application instance must be provided before running the Engine.',
            );
        }

        this.application.Update();
        this.application.Draw();

        Input.Update();

        if (this.running) {
            this.animationFrameId = requestAnimationFrame(this.Run.bind(this));
        } else {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    /**
     * Stops the game loop and clears the animation frame request.
     *
     * @static
     * @memberof Engine
     */
    public static Stop(): void {
        Log.Trace('Engine.Stop() - Stopping the game loop...');

        if (!this.running) {
            Log.Warn('Engine.Stop() - No active game loop to stop.');
            return;
        }

        this.running = false;
        Log.Trace('Engine.Stop() - Game loop stopped successfully.');
    }

    /**
     * Shuts down the `Engine` and cleans up resources.
     *
     * @static
     * @throws {NotInitializedError} If the `Engine` has not been initialized.
     * @memberof Engine
     */
    public static Shutdown(): void {
        Log.Info('Engine.Shutdown() - Shutting down Engine...');
        Log.Trace('Engine.Shutdown() - Checking if Engine is initialized...');

        if (!this.initialized) {
            throw new NotInitializedError(
                'Engine is not initialized. Please call Engine.Initialize() before shutting down.',
            );
        }

        Log.Trace('Engine.Shutdown() - Engine is initialized. Proceeding with shutdown...');

        this.Stop();

        Log.Trace('Engine.Shutdown() - Shutting down Application...');
        this.application.Shutdown();

        Log.Trace('Engine.Shutdown() - Shutting down Renderer, UI, Input, and Network...');

        Renderer.Shutdown();
        UI.Shutdown();
        Input.Shutdown();
        Network.Shutdown();

        this.initialized = false;
        Log.Debug('Engine.Shutdown() - Engine shut down successfully.');
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
        this.EnsureSource(source);

        const image: CanvasImageSource = new Image();
        image.src = source;

        return image;
    }

    /**
     * Loads multiple images from an array of source URLs.
     *
     * This method iterates over the provided array of image source URLs,
     * loads each image using the `LoadImage` method, and returns an array of loaded images.
     *
     * The loaded images can then be used for drawing on the canvas or for other purposes in the application.
     *
     * @static
     * @param {string[]} sources - An array of image source URLs to load.
     * @returns {CanvasImageSource[]} An array of loaded images as CanvasImageSource objects.
     * @memberof Engine
     */
    public static LoadImages(sources: string[]): CanvasImageSource[] {
        const images: CanvasImageSource[] = [];

        for (const source of sources) {
            const image: CanvasImageSource = this.LoadImage(source);
            images.push(image);
        }

        return images;
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

    /**
     * Ensures that the provided source string is valid.
     *
     * @private
     * @static
     * @param {string} source - The source string to validate.
     * @throws {InvalidArgumentError} If the source is not provided or is not a string.
     * @memberof Engine
     */
    private static EnsureSource(source: string): void {
        if (!source || source.trim() === '' || typeof source !== 'string') {
            throw new InvalidArgumentError('Source must be provided and must be a string.');
        }
    }
}

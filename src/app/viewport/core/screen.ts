import { Log } from "./log/log";

/**
 * Screen orientation types.
 *
 * @export
 * @enum {number}
 */
export enum ScreenOrientation {
    /**
     * Landscape orientation.
     */
    Landscape,

    /**
     * Portrait orientation.
     */
    Portrait,
}

/**
 * A utility class for accessing screen properties such as width, height, aspect ratio, and orientation.
 *
 * @export
 * @class Screen
 */
export class Screen {
    /**
     * Returns the current width of the screen in pixels.
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Screen
     */
    public static get Width(): number {
        return window.screen.width;
    }

    /**
     * Returns the current height of the screen in pixels.
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Screen
     */
    public static get Height(): number {
        return window.screen.height;
    }

    /**
     * Returns the color depth of the screen in bits per pixel.
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Screen
     */
    public static get ColorDepth(): number {
        return window.screen.colorDepth;
    }

    /**
     * Returns the pixel depth of the screen in bits per pixel.
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Screen
     */
    public static get PixelDepth(): number {
        return window.screen.pixelDepth;
    }

    /**
     * Returns the aspect ratio of the screen (width divided by height).
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Screen
     */
    public static get AspectRatio(): number {
        const width = this.Width;
        const height = this.Height;

        if (height === 0) {
            Log.Warn(
                'Screen.AspectRatio - Height is zero, returning aspect ratio as 0 to avoid division by zero.',
            );
            return 0;
        }

        return width / height;
    }

    /**
     * Returns the device pixel ratio.
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Screen
     */
    public static get PixelRatio(): number {
        return window.devicePixelRatio || 1;
    }

    /**
     * Returns the current screen orientation.
     *
     * @readonly
     * @static
     * @type {ScreenOrientation}
     * @memberof Screen
     */
    public static get Orientation(): ScreenOrientation {
        return this.Width >= this.Height ? ScreenOrientation.Landscape : ScreenOrientation.Portrait;
    }

    /**
     * Returns `true` if the screen is in landscape orientation, `false` otherwise.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Screen
     */
    public static get Landscape(): boolean {
        return this.Orientation === ScreenOrientation.Landscape;
    }

    /**
     * Returns `true` if the screen is in portrait orientation, `false` otherwise.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Screen
     */
    public static get Portrait(): boolean {
        return this.Orientation === ScreenOrientation.Portrait;
    }

    /**
     * Returns `true` if the screen is currently in fullscreen mode, `false` otherwise.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Screen
     */
    public static get Fullscreen(): boolean {
        return document.fullscreenElement !== null;
    }

    /**
     * Enters fullscreen mode.
     * 
     * If the screen is already in fullscreen mode, a warning is logged and the function returns early.
     *
     * @static
     * @memberof Screen
     */
    public static EnterFullscreen(): void {
        if (this.Fullscreen) {
            Log.Warn('Screen.EnterFullscreen() - Already in fullscreen mode.');
            return;
        }

        document.documentElement.requestFullscreen().catch((err) => {
            Log.Error(
                `Screen.EnterFullscreen() - Error attempting to enter fullscreen mode: ${err.message} (${err.name})`,
            );
        });
    }

    /**
     * Exits fullscreen mode.
     * 
     * If the screen is not in fullscreen mode, a warning is logged and the function returns early.
     *
     * @static
     * @memberof Screen
     */
    public static ExitFullscreen(): void {
        if (!this.Fullscreen) {
            Log.Warn('Screen.ExitFullscreen() - Not in fullscreen mode.');
            return;
        }

        document.exitFullscreen().catch((err) => {
            Log.Error(
                `Screen.ExitFullscreen() - Error attempting to exit fullscreen mode: ${err.message} (${err.name})`,
            );
        });
    }

    /**
     * Toggles fullscreen mode for the document.
     * 
     * If the screen is currently in fullscreen mode, it will exit fullscreen; otherwise, it will enter fullscreen.
     *
     * @static
     * @memberof Screen
     */
    public static ToggleFullscreen() {
        if (!this.Fullscreen) {
            this.EnterFullscreen();
        } else {
            this.ExitFullscreen();
        }
    }
}
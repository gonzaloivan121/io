/**
 * This class provides static methods and properties to detect device characteristics,
 * such as whether the device is mobile, tablet, or desktop,
 * as well as viewport dimensions, orientation, pixel ratio, touch capability,
 * online status, gamepad support, and user preferences for reduced motion.
 * 
 * It also includes methods to evaluate media queries and trigger device vibrations.
 *
 * @export
 * @class Device
 */
export class Device {
    /**
     * Returns the current user agent string in lowercase.
     *
     * @private
     * @readonly
     * @static
     * @type {string}
     * @memberof Device
     */
    private static get UserAgent(): string {
        const nav = typeof navigator !== 'undefined' ? navigator : undefined;
        const legacyOpera = typeof window !== 'undefined' ? (window as Window & { opera?: string }).opera : undefined;

        return String(nav?.userAgent || nav?.vendor || legacyOpera || '').toLowerCase();
    }

    /**
     * Returns a boolean indicating whether the current device is a mobile device based on the user agent string.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Device
     */
    public static get Mobile(): boolean {
        return /android|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(this.UserAgent);
    }

    /**
     * Returns a boolean indicating whether the current device is likely a tablet.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Device
     */
    public static get Tablet(): boolean {
        return /ipad|tablet|kindle|silk|playbook/.test(this.UserAgent);
    }

    /**
     * Returns a boolean indicating whether the current device is likely a phone.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Device
     */
    public static get Phone(): boolean {
        return this.Mobile && !this.Tablet;
    }

    /**
     * Returns a boolean indicating whether the current device is a desktop device based on the user agent string.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Device
     */
    public static get Desktop(): boolean {
        return !this.Mobile;
    }

    /**
     * Returns the current viewport width in CSS pixels.
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Device
     */
    public static get ViewportWidth(): number {
        return typeof window !== 'undefined' ? window.innerWidth : 0;
    }

    /**
     * Returns the current viewport height in CSS pixels.
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Device
     */
    public static get ViewportHeight(): number {
        return typeof window !== 'undefined' ? window.innerHeight : 0;
    }

    /**
     * Returns a boolean indicating whether the viewport is currently in landscape orientation.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Device
     */
    public static get Landscape(): boolean {
        return this.ViewportWidth >= this.ViewportHeight;
    }

    /**
     * Returns a boolean indicating whether the viewport is currently in portrait orientation.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Device
     */
    public static get Portrait(): boolean {
        return !this.Landscape;
    }

    /**
     * Returns the current device pixel ratio.
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Device
     */
    public static get PixelRatio(): number {
        return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    }

    /**
     * Returns a boolean indicating whether the current device supports touch input.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Device
     */
    public static get TouchCapable(): boolean {
        const nav = typeof navigator !== 'undefined' ? navigator : undefined;

        return (
            typeof window !== 'undefined' && 'ontouchstart' in window
        ) || (nav?.maxTouchPoints ?? 0) > 0;
    }

    /**
     * Returns a boolean indicating whether the browser is currently online.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Device
     */
    public static get Online(): boolean {
        return typeof navigator === 'undefined' ? true : navigator.onLine;
    }

    /**
     * Returns a boolean indicating whether gamepads are supported by the current browser.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Device
     */
    public static get GamepadSupported(): boolean {
        return typeof navigator !== 'undefined' && typeof navigator.getGamepads === 'function';
    }

    /**
     * Returns a boolean indicating whether the user prefers reduced motion.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Device
     */
    public static get ReducedMotion(): boolean {
        return this.MatchesMediaQuery('(prefers-reduced-motion: reduce)');
    }

    /**
     * Returns a boolean indicating whether the pointer is likely coarse (touch-first device).
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Device
     */
    public static get CoarsePointer(): boolean {
        return this.MatchesMediaQuery('(pointer: coarse)');
    }

    /**
     * Evaluates a media query and returns whether it currently matches.
     *
     * @static
     * @param {string} query - The media query to evaluate.
     * @returns {boolean} `true` if the media query matches; otherwise, `false`.
     * @memberof Device
     */
    public static MatchesMediaQuery(query: string): boolean {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return false;
        }

        return window.matchMedia(query).matches;
    }

    /**
     * Returns a boolean indicating whether the current viewport width is less than or equal to the given breakpoint.
     *
     * @static
     * @param {number} maxWidth - The maximum viewport width in CSS pixels.
     * @returns {boolean} `true` if the viewport is at or below the breakpoint; otherwise, `false`.
     * @memberof Device
     */
    public static IsViewportAtMost(maxWidth: number): boolean {
        return this.ViewportWidth <= maxWidth;
    }

    /**
     * Attempts to trigger a device vibration pattern.
     *
     * @static
     * @param {(number | number[])} pattern - Duration in milliseconds or vibration pattern.
     * @returns {boolean} `true` if the vibration API accepted the request; otherwise, `false`.
     * @memberof Device
     */
    public static Vibrate(pattern: number | number[]): boolean {
        if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
            return false;
        }

        return navigator.vibrate(pattern);
    }
}
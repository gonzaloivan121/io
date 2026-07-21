import { Utilities } from "./utilities";

/**
 * Represents a color with red, green, blue, and alpha components.
 * Provides methods for color manipulation and predefined colors.
 * This class allows to create colors using RGBA values,
 * access individual color components, and use predefined colors.
 */
export class Color {
    /**
     * The red component of the color, ranging from 0 to 1.
     *
     * @type {number}
     * @private
     */
    private r: number;

    /**
     * The green component of the color, ranging from 0 to 1.
     *
     * @type {number}
     * @private
     */
    private g: number;

    /**
     * The blue component of the color, ranging from 0 to 1.
     *
     * @type {number}
     * @private
     */
    private b: number;

    /**
     * The alpha component of the color, ranging from 0 to 1.
     * This represents the transparency of the color.
     *
     * @type {number}
     * @private
     */
    private a: number;

    /**
     * Creates a new Color instance.
     *
     * @param {number} r - The red component (0 to 1).
     * @param {number} g - The green component (0 to 1).
     * @param {number} b - The blue component (0 to 1).
     * @param {number} a - The alpha component (0 to 1, default is 1).
     */
    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * Gets the red component of the color, clamped between 0 and 1.
     *
     * @returns {number} The red component of the color.
     * @memberof Color
     */
    public get R(): number {
        return Color.GetColor(this.r);
    }

    /**
     * Gets the green component of the color, clamped between 0 and 1.
     *
     * @returns {number} The green component of the color.
     * @memberof Color
     */
    public get G(): number {
        return Color.GetColor(this.g);
    }

    /**
     * Gets the blue component of the color, clamped between 0 and 1.
     *
     * @returns {number} The blue component of the color.
     * @memberof Color
     */
    public get B(): number {
        return Color.GetColor(this.b);
    }

    /**
     * Gets the alpha component of the color, clamped between 0 and 1.
     *
     * @returns {number} The alpha component of the color.
     * @memberof Color
     */
    public get A(): number {
        return Color.GetColor(this.a);
    }

    /**
     * Clamps the color component value between 0 and 1.
     * This ensures that the color components are always valid for rendering.
     *
     * @param color - The color component value to clamp.
     * @returns {number} The clamped color component value.
     * @private This method is used internally to ensure color validity.
     * @static This method can be called without an instance of the `Color` class.
     * @memberof Color
     */
    private static GetColor(color: number): number {
        if (color < 0) {
            return 0;
        } else if (color > 1) {
            return 1;
        } else {
            return color;
        }
    }

    /**
     * Predefined color: `Red`.
     *
     * This color is represented as `(1, 0, 0, 1)`
     *
     * @returns {Color} A new `Color` instance representing the red color.
     * @static
     */
    public static get Red(): Color {
        return new Color(1, 0, 0, 1);
    }

    /**
     * Predefined color: `Dark Red`.
     *
     * This color is represented as `(0.5, 0, 0, 1)`
     *
     * @readonly
     * @static
     * @type {Color}
     * @memberof Color
     */
    public static get DarkRed(): Color {
        return new Color(0.5, 0, 0, 1);
    }

    /**
     * Predefined color: `Persian Red`.
     *
     * This color is represented as `(0.8, 0.2, 0.2, 1)`
     *
     * @returns {Color} A new `Color` instance representing the Persian red color.
     * @static
     */
    public static get PersianRed(): Color {
        return new Color(0.8, 0.2, 0.2, 1);
    }

    /**
     * Predefined color: `Transparent Persian Red`.
     *
     * This color is represented as `(0.8, 0.2, 0.2, 0)`
     *
     * @returns {Color} A new `Color` instance representing the transparent Persian red color.
     * @static
     */
    public static get TransparentPersianRed(): Color {
        return new Color(0.8, 0.2, 0.2, 0);
    }

    /**
     * Predefined color: `Orange`.
     *
     * This color is represented as `(1, 0.5, 0, 1)`
     *
     * @returns {Color} A new `Color` instance representing the orange color.
     * @static
     */
    public static get Orange(): Color {
        return new Color(1, 0.5, 0, 1);
    }

    /**
     * Predefined color: `Green`.
     *
     * This color is represented as `(0, 1, 0, 1)`
     *
     * @returns {Color} A new `Color` instance representing the green color.
     * @static
     */
    public static get Green(): Color {
        return new Color(0, 1, 0, 1);
    }

    /**
     * Predefined color: `Apple Green`.
     *
     * This color is represented as `(0.2, 0.8, 0.2, 1)`
     *
     * @returns {Color} A new `Color` instance representing the Apple Green color.
     * @static
     */
    public static get AppleGreen(): Color {
        return new Color(0.2, 0.8, 0.2, 1);
    }

    /**
     * Predefined color: `Blue`.
     *
     * This color is represented as `(0, 0, 1, 1)`
     *
     * @returns {Color} A new `Color` instance representing the blue color.
     * @static
     */
    public static get Blue(): Color {
        return new Color(0, 0, 1, 1);
    }

    /**
     * Predefined color: `Governor Bay Blue`.
     *
     * This color is represented as `(0.2, 0.2, 0.8, 1)`
     *
     * @returns {Color} A new `Color` instance representing the Governor Bay Blue color.
     * @static
     */
    public static get GovernorBayBlue(): Color {
        return new Color(0.2, 0.2, 0.8, 1);
    }

    /**
     * Predefined color: `Purple`.
     *
     * This color is represented as `(0.5, 0, 0.5, 1)`
     *
     * @returns {Color} A new `Color` instance representing the purple color.
     * @static
     */
    public static get Purple(): Color {
        return new Color(0.5, 0, 0.5, 1);
    }
    /**
     * Predefined color: `Yellow`.
     *
     * This color is represented as `(1, 1, 0, 1)`
     *
     * @returns {Color} A new `Color` instance representing the yellow color.
     * @static
     */
    public static get Yellow(): Color {
        return new Color(1, 1, 0, 1);
    }

    /**
     * Predefined color: `Cyan`.
     *
     * This color is represented as `(0, 1, 1, 1)`
     *
     * @returns {Color} A new `Color` instance representing the cyan color.
     * @static
     */
    public static get Cyan(): Color {
        return new Color(0, 1, 1, 1);
    }

    /**
     * Predefined color: `Magenta`.
     *
     * This color is represented as `(1, 0, 1, 1)`
     *
     * @returns {Color} A new `Color` instance representing the magenta color.
     * @static
     */
    public static get Magenta(): Color {
        return new Color(1, 0, 1, 1);
    }

    /**
     * Predefined color: `Black`.
     *
     * This color is represented as `(0, 0, 0, 1)`
     *
     * @returns {Color} A new `Color` instance representing the black color.
     * @static
     */
    public static get Black(): Color {
        return new Color(0, 0, 0, 1);
    }

    /**
     * Predefined color: `White`.
     *
     * This color is represented as `(1, 1, 1, 1)`
     *
     * @returns {Color} A new `Color` instance representing the white color.
     * @static
     */
    public static get White(): Color {
        return new Color(1, 1, 1, 1);
    }

    /**
     * Predefined color: `Transparent`.
     *
     * This color is represented as `(1, 1, 1, 0)`
     *
     * @returns {Color} A new `Color` instance representing the transparent color.
     * @static
     */
    public static get Transparent(): Color {
        return new Color(1, 1, 1, 0);
    }

    /**
     * Predefined color: `Gray`.
     *
     * This color is represented as `(0.5, 0.5, 0.5, 1)`
     *
     * @returns {Color} A new `Color` instance representing the gray color.
     * @static
     */
    public static get Gray(): Color {
        return new Color(0.5, 0.5, 0.5, 1);
    }

    /**
     * Predefined color: `Dark Gray`.
     *
     * This color is represented as `(0.2, 0.2, 0.2, 1)`
     *
     * @returns {Color} A new `Color` instance representing the dark gray color.
     * @static
     */
    public static get DarkGray(): Color {
        return new Color(0.2, 0.2, 0.2, 1);
    }

    /**
     * Predefined color: `Light Gray`.
     *
     * This color is represented as `(0.8, 0.8, 0.8, 1)`
     *
     * @returns {Color} A new `Color` instance representing the light gray color.
     * @static
     */
    public static get LightGray(): Color {
        return new Color(0.8, 0.8, 0.8, 1);
    }

    /**
     * Predefined color: `Gold`.
     *
     * This color is represented as `(1, 0.84, 0, 1)`
     *
     * @returns {Color} A new `Color` instance representing the gold color.
     * @static
     */
    public static get Gold(): Color {
        return new Color(1, 0.84, 0, 1);
    }

    /**
     * Predefined color: `Silver`.
     *
     * This color is represented as `(0.75, 0.75, 0.75, 1)`
     *
     * @returns {Color} A new `Color` instance representing the silver color.
     * @static
     */
    public static get Silver(): Color {
        return new Color(0.75, 0.75, 0.75, 1);
    }

    /**
     * Predefined color: `Bronze`.
     *
     * This color is represented as `(0.8, 0.52, 0.25, 1)`
     *
     * @returns {Color} A new `Color` instance representing the bronze color.
     * @static
     */
    public static get Bronze(): Color {
        return new Color(0.8, 0.52, 0.25, 1);
    }

    /**
     * Predefined color: `Pink`.
     *
     * This color is represented as `(1, 0.75, 0.8, 1)`
     *
     * @returns {Color} A new `Color` instance representing the pink color.
     * @static
     */
    public static get Pink(): Color {
        return new Color(1, 0.75, 0.8, 1);
    }

    /**
     * Predefined color: `Brown`.
     *
     * This color is represented as `(0.6, 0.4, 0.2, 1)`
     *
     * @returns {Color} A new `Color` instance representing the brown color.
     * @static
     */
    public static get Brown(): Color {
        return new Color(0.6, 0.4, 0.2, 1);
    }

    /**
     * Predefined color: `Kaly Turquoise`.
     *
     * This color is represented as `(0.012, 0.988, 0.631, 1)`
     *
     * @readonly
     * @static
     * @type {Color}
     * @memberof Color
     */
    public static get KalyTurquoise(): Color {
        return new Color(0.012, 0.988, 0.631, 1);
    }

    /**
     * Predefined color: `Trace`.
     * 
     * This color is represented as `(0.6, 0.6, 0.6, 1)`
     *
     * @readonly
     * @static
     * @type {Color}
     * @memberof Color
     */
    public static get Trace(): Color {
        return new Color(0.6, 0.6, 0.6, 1);
    }

    /**
     * Predefined color: `Debug`.
     * 
     * This color is represented as `(0.25, 0.75, 0.35, 1)`
     *
     * @readonly
     * @static
     * @type {Color}
     * @memberof Color
     */
    public static get Debug(): Color {
        return new Color(0.25, 0.75, 0.35, 1);
    }

    /**
     * Predefined color: `Info`.
     * 
     * This color is represented as `(0.2, 0.6, 0.9, 1)`
     *
     * @readonly
     * @static
     * @type {Color}
     * @memberof Color
     */
    public static get Info(): Color {
        return new Color(0.2, 0.6, 0.9, 1);
    }

    /**
     * Predefined color: `Warn`.
     * 
     * This color is represented as `(0.95, 0.65, 0.15, 1)`
     *
     * @readonly
     * @static
     * @type {Color}
     * @memberof Color
     */
    public static get Warn(): Color {
        return new Color(0.95, 0.65, 0.15, 1);
    }

    /**
     * Predefined color: `Error`.
     * 
     * This color is represented as `(0.85, 0.25, 0.25, 1)`
     *
     * @readonly
     * @static
     * @type {Color}
     * @memberof Color
     */
    public static get Error(): Color {
        return new Color(0.85, 0.25, 0.25, 1);
    }

    /**
     * Predefined color: `Fatal`.
     * 
     * This color is represented as `(0.65, 0.15, 0.15, 1)`
     *
     * @readonly
     * @static
     * @type {Color}
     * @memberof Color
     */
    public static get Fatal(): Color {
        return new Color(0.65, 0.15, 0.15, 1);
    }

    /**
     * Returns an array of all predefined colors in the `Color` class.
     *
     * @readonly
     * @static
     * @type {Color[]}
     * @memberof Color
     */
    public static get All(): Color[] {
        return [
            Color.Red,
            Color.PersianRed,
            Color.Orange,
            Color.Green,
            Color.AppleGreen,
            Color.Blue,
            Color.GovernorBayBlue,
            Color.Purple,
            Color.Yellow,
            Color.Cyan,
            Color.Magenta,
            Color.Black,
            Color.White,
            Color.Gray,
            Color.DarkGray,
            Color.LightGray,
            Color.Gold,
            Color.Silver,
            Color.Bronze,
            Color.Pink,
            Color.Brown,
        ];
    }

    /**
     * Predefined color: Negative.
     * This color is the negative of the current color, calculated as (1 - R, 1 - G, 1 - B, A).
     *
     * @returns {Color} A new `Color` instance representing the negative color.
     */
    public get Negative(): Color {
        return new Color(1 - this.R, 1 - this.G, 1 - this.B, this.A);
    }

    /**
     * Gets a darker version of the current color by reducing the RGB components by half.
     * The alpha component remains unchanged.
     *
     * @readonly
     * @type {Color}
     * @memberof Color
     */
    public get Darker(): Color {
        return new Color(this.R * 0.5, this.G * 0.5, this.B * 0.5, this.A);
    }

    /**
     * Returns the string representation of the color in hexadecimal format.
     * The format is `#RRGGBBAA`, where RR, GG, BB, and AA are the red, green, blue, and alpha components in hexadecimal.
     *
     * @readonly
     * @type {string}
     * @memberof Color
     */
    public get String(): string {
        const r = Math.round(this.R * 255);
        const g = Math.round(this.G * 255);
        const b = Math.round(this.B * 255);
        const a = Math.round(this.A * 255);

        const toHex = (value: number): string => {
            return value.toString(16).padStart(2, '0').toUpperCase();
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
    }

    /**
     * Returns the string representation of the color in RGB format.
     * The format is `rgb(R, G, B)`, where R, G, and B are the red, green, and blue components scaled to the range 0-255.
     *
     * @readonly
     * @type {string}
     * @memberof Color
     */
    public get RGBString(): string {
        const r = Math.round(this.R * 255);
        const g = Math.round(this.G * 255);
        const b = Math.round(this.B * 255);

        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Returns the string representation of the color in RGBA format.
     * The format is `rgba(R, G, B, A)`, where R, G, and B are the red, green, and blue components scaled to the range 0-255, and A is the alpha component in the range 0-1.
     *
     * @readonly
     * @type {string}
     * @memberof Color
     */
    public get RGBAString(): string {
        const r = Math.round(this.R * 255);
        const g = Math.round(this.G * 255);
        const b = Math.round(this.B * 255);
        const a = this.A;

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    /**
     * Linearly interpolates between two colors based on a parameter t.
     *
     * If t is less than 0, returns the first color.
     * If t is greater than 1, returns the second color.
     * Otherwise, returns a new Color instance that is the result of the interpolation.
     *
     * @param {Color} a - The first `Color`.
     * @param {Color} b - The second `Color`.
     * @param {number} t - The interpolation parameter (0 to 1).
     * @returns {Color} The interpolated `Color`.
     * @memberof Color
     */
    public static Lerp(a: Color, b: Color, t: number): Color {
        if (t < 0) return a;
        if (t > 1) return b;

        return new Color(
            Utilities.Lerp(a.r, b.r, t),
            Utilities.Lerp(a.g, b.g, t),
            Utilities.Lerp(a.b, b.b, t),
            Utilities.Lerp(a.a, b.a, t),
        );
    }

    /**
     * Linearly interpolates between two colors based on a parameter t without clamping.
     *
     * This method allows t to be any value, and the resulting color may be outside the range of the two input colors.
     *
     * @static
     * @param {Color} a - The first `Color`.
     * @param {Color} b - The second `Color`.
     * @param {number} t - The interpolation parameter.
     * @returns {Color} The interpolated `Color`.
     * @memberof Color
     */
    public static LerpUnclamped(a: Color, b: Color, t: number): Color {
        return new Color(
            Utilities.LerpUnclamped(a.r, b.r, t),
            Utilities.LerpUnclamped(a.g, b.g, t),
            Utilities.LerpUnclamped(a.b, b.b, t),
            Utilities.LerpUnclamped(a.a, b.a, t),
        );
    }
}
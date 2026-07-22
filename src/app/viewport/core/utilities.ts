/**
 * A collection of utility functions for various operations.
 * 
 * This class provides methods for generating random numbers, linear interpolation,
 * and other mathematical operations.
 * 
 * @export
 * @class Utilities
 */
export class Utilities {
    /**
     * A function that returns a random number between two numbers.
     *
     * @static
     * @param {number} min - The minimum number that the random function could output.
     * @param {number} max - The maximum number that the random function could output.
     * @returns {number} The resulting random number.
     * @memberof Utilities
     */
    public static Random(min: number, max: number): number {
        return Math.random() * (max + 1 - min) + min;
    }

    /**
     * A function that returns a random integer between two numbers.
     *
     * @static
     * @param {number} min - The minimum number that the random function could output.
     * @param {number} max - The maximum number that the random function could output.
     * @returns {number} The resulting random integer.
     * @memberof Utilities
     */
    public static RandomInt(min: number, max: number): number {
        return Math.floor(this.Random(min, max));
    }

    /**
     * Linearly interpolates between two numbers. If t is lower than 0, return a. If t is greater than 1, return b.
     *
     * @static
     * @param {number} a - The start value, returned when `t = 0`.
     * @param {number} b - The end value, returned when `t = 1`.
     * @param {number} t - The value used to interpolate between `a` and `b`.
     * @returns {number} The interpolated value, equals to `a + (b - a) * t`.
     * @memberof Utilities
     */
    public static Lerp(a: number, b: number, t: number): number {
        if (t < 0) return a;
        if (t > 1) return b;

        return this.DoLerp(a, b, t);
    }

    /**
     * Linearly interpolates between two numbers.
     *
     * @static
     * @param {number} a - The start value, returned when `t = 0`.
     * @param {number} b - The end value, returned when `t = 1`.
     * @param {number} t - The value used to interpolate between `a` and `b`.
     * @returns {number} The interpolated value, equals to `a + (b - a) * t`.
     * @memberof Utilities
     */
    public static LerpUnclamped(a: number, b: number, t: number): number {
        return this.DoLerp(a, b, t);
    }

    /**
     * Linearly interpolates between two numbers.
     *
     * @private
     * @static
     * @param {number} a - The start value, returned when `t = 0`.
     * @param {number} b - The end value, returned when `t = 1`.
     * @param {number} t - The value used to interpolate between `a` and `b`.
     * @returns {number} The interpolated value, equals to `a + (b - a) * t`.
     * @memberof Utilities
     */
    private static DoLerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
}
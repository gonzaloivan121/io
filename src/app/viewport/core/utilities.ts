/**
 * A collection of utility functions for various operations.
 * This class provides methods for generating random numbers, linear interpolation,
 * and other mathematical operations.
 * @class Utilities
 */
export class Utilities {
    /**
     * A function that returns a random number between two numbers
     *
     * @param { number } min - The minimum number that the random function could output
     * @param { number } max - The maximum number that the random function could output
     * @returns { number } the resulting random number
     */
    public static Random(min: number, max: number): number {
        return Math.random() * ((max + 1) - min) + min;
    }

    /**
     * A function that returns a random integer between two numbers
     *
     * @param { number } min - The minimum number that the random function could output
     * @param { number } max - The maximum number that the random function could output
     * @returns { number } the resulting random number
     */
    public static RandomInt(min: number, max: number): number {
        return Math.floor(this.Random(min, max));
    }

    /**
     * Linearly interpolates between two points. If t is lower than 0, return a. If t is greater than 1, return b.
     *
     * @param a Start value, returned when t = 0.
     * @param b End value, returned when t = 1.
     * @param t Value used to interpolate between a and b.
     * @returns Interpolated value, equals to a + (b - a) * t.
     */
    public static Lerp(a: number, b: number, t: number): number {
        if (t < 0) return a;
        if (t > 1) return b;

        return this.DoLerp(a, b, t);
    }

    /**
     * Linearly interpolates between two points.
     * 
     * @param a Start value, returned when t = 0.
     * @param b End value, returned when t = 1.
     * @param t Value used to interpolate between a and b.
     * @returns Interpolated value, equals to a + (b - a) * t.
     */
    public static LerpUnclamped(a: number, b: number, t: number): number {
        return this.DoLerp(a, b, t);
    }

    /**
     * Linearly interpolates between two points.
     * 
     * @param a Start value, returned when t = 0.
     * @param b End value, returned when t = 1.
     * @param t Value used to interpolate between a and b.
     * @returns Interpolated value, equals to a + (b - a) * t.
     */
    private static DoLerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
}
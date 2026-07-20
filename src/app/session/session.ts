import { InvalidArgumentError } from "../errors";

/**
 * Represents a `Session` storage utility.
 *
 * @export
 * @class Session
 */
export class Session {
    /**
     * Returns the number of items stored in the `Session` storage.
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Session
     */
    public static get length(): number {
        return localStorage.length;
    }

    /**
     * Clears the `Session` storage.
     * If a `key` is provided, it removes the item associated with that `key`;
     * otherwise, it clears all items in the storage.
     *
     * @static
     * @param {string} [key] - The `key` of the item to remove from the storage. If not provided, all items will be cleared.
     * @memberof Session
     */
    public static Clear(key?: string): void {
        if (key && key.trim().length > 0) {
            localStorage.removeItem(key);
        } else {
            localStorage.clear();
        }
    }

    /**
     * Retrieves the value associated with the specified `key` from the `Session` storage.
     * If the `key` does not exist, it returns `null`.
     *
     * @static
     * @param {string} key - The `key` of the item to retrieve from the storage.
     * @throws {InvalidArgumentError} If the provided `key` is `null` or empty.
     * @returns {(string | null)} The value associated with the specified `key`, or `null` if the `key` does not exist.
     * @memberof Session
     */
    public static Get(key: string): string | null {
        if (!key || key.trim().length === 0) {
            throw new InvalidArgumentError('Key cannot be null or empty.');
        }

        return localStorage.getItem(key);
    }

    /**
     * Retrieves the key at the specified `index` from the `Session` storage.
     * If the `index` is out of bounds, it throws an `InvalidArgumentError`.
     *
     * @static
     * @param {number} index - The `index` of the key to retrieve from the storage.
     * @throws {InvalidArgumentError} If the `index` is out of bounds.
     * @returns {(string | null)} The key at the specified `index`, or `null` if the `index` is out of bounds.
     * @memberof Session
     */
    public static Key(index: number): string | null {
        if (index < 0 || index >= this.length) {
            throw new InvalidArgumentError('Index is out of bounds.');
        }

        return localStorage.key(index);
    }

    /**
     * Returns an array of all keys stored in the `Session` storage.
     *
     * @static
     * @returns {string[]} An array of all keys stored in the `Session` storage.
     * @memberof Session
     */
    public static Keys(): string[] {
        const keys: string[] = [];

        for (let i = 0; i < this.length; i++) {
            const key = this.Key(i);

            if (key) {
                keys.push(key);
            }
        }

        return keys;
    }

    /**
     * Sets a key-value pair in the `Session` storage.
     *
     * @static
     * @param {string} key - The `key` of the item to store in the `Session` storage.
     * @param {string} value - The `value` of the item to store in the `Session` storage.
     * @throws {InvalidArgumentError} If the provided `key` or `value` is null or empty.
     * @memberof Session
     */
    public static Set(key: string, value: string): void {
        if (!key || key.trim().length === 0) {
            throw new InvalidArgumentError('Key cannot be null or empty.');
        }

        if (!value || value.trim().length === 0) {
            throw new InvalidArgumentError('Value cannot be null or empty.');
        }

        localStorage.setItem(key, value);
    }

    /**
     * Checks if a `key` exists in the `Session` storage.
     *
     * @static
     * @param {string} key - The `key` to check for existence in the `Session` storage.
     * @throws {InvalidArgumentError} If the provided `key` is `null` or empty.
     * @returns {boolean} `true` if the `key` exists, `false` otherwise.
     * @memberof Session
     */
    public static Exists(key: string): boolean {
        if (!key || key.trim().length === 0) {
            throw new InvalidArgumentError('Key cannot be null or empty.');
        }

        return localStorage.getItem(key) !== null;
    }

    /**
     * Checks if the value associated with a `key` in the `Session` storage matches the provided `value`.
     *
     * @static
     * @param {string} key - The `key` to check in the `Session` storage.
     * @param {string} value - The `value` to compare against the value associated with the `key` in the `Session` storage.
     * @throws {InvalidArgumentError} If the provided `key` or `value` is `null` or empty.
     * @returns {boolean} `true` if the value associated with the `key` matches the provided `value`, `false` otherwise.
     * @memberof Session
     */
    public static Is(key: string, value: string): boolean {
        if (!key || key.trim().length === 0) {
            throw new InvalidArgumentError('Key cannot be null or empty.');
        }

        if (!value || value.trim().length === 0) {
            throw new InvalidArgumentError('Value cannot be null or empty.');
        }

        return localStorage.getItem(key) === value;
    }
}

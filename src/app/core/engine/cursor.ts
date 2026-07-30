import { Log } from "../log/log";

/**
 * Represents the cursor management functionality, allowing for showing and hiding the cursor.
 *
 * @export
 * @class Cursor
 */
export class Cursor {
    /**
     * Gets the current visibility state of the cursor.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Cursor
     */
    public static get Visible(): boolean {
        return document.pointerLockElement === null;
    }

    /**
     * Shows the cursor by requesting pointer lock on the document's root element.
     *
     * @static
     * @memberof Cursor
     */
    public static Show(): void {
        if (this.Visible) {
            Log.Warn('Cursor.Show() - Cursor is already visible.');
            return;
        }

        document.exitPointerLock();
    }

    /**
     * Hides the cursor by exiting pointer lock on the document.
     *
     * @static
     * @memberof Cursor
     */
    public static Hide(): void {
        if (!this.Visible) {
            Log.Warn('Cursor.Hide() - Cursor is already hidden.');
            return;
        }

        document.documentElement.requestPointerLock().catch((err) => {
            Log.Error(
                `Cursor.Hide() - Error attempting to enable pointer lock: ${err.message} (${err.name})`,
            );
        });
    }
}
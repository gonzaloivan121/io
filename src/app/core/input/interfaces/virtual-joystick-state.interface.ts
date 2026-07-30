import { Vector2 } from "@xloxlolex/vector-math";

import { UIVirtualJoystick } from "../../ui/interfaces/ui-virtual-joystick.interface";

/**
 * Represents the state of a virtual joystick, including its configuration options, thumb offset, and active pointer ID.
 *
 * @export
 * @interface VirtualJoystickState
 */
export interface VirtualJoystickState {
    /**
     * The configuration options for the virtual joystick, defining its behavior and appearance.
     *
     * @type {UIVirtualJoystick}
     * @memberof VirtualJoystickState
     */
    options: UIVirtualJoystick;

    /**
     * The current offset of the joystick's thumb from its center position, represented as a 2D vector.
     *
     * @type {Vector2}
     * @memberof VirtualJoystickState
     */
    thumbOffset: Vector2;

    /**
     * The ID of the pointer (e.g., touch or mouse) that is currently interacting with the virtual joystick.
     *
     * @type {(number | null)}
     * @memberof VirtualJoystickState
     */
    activePointerId: number | null;
}

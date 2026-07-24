import { Vector2 } from "@xloxlolex/vector-math";
import { GamepadAxis } from "../../input/gamepad-axis";
import { FillStyle, StrokeStyle } from "../../renderer";
import { UIAnchor } from "../types/ui-anchor.type";

/**
 * Interface defining the options for rendering and driving a virtual joystick in the `UI` system.
 *
 * @export
 * @interface UIVirtualJoystick
 */
export interface UIVirtualJoystick {
    /**
     * The position of the virtual joystick in the UI coordinate system.
     *
     * @type {Vector2}
     * @memberof UIVirtualJoystick
     */
    position: Vector2;

    /**
     * The anchor point of the virtual joystick,
     * which determines how the joystick is positioned relative to its position.
     *
     * @type {UIAnchor}
     * @memberof UIVirtualJoystick
     */
    anchor?: UIAnchor;

    /**
     * Indicates whether the virtual joystick is enabled or disabled.
     * A disabled joystick will not respond to user interactions.
     *
     * @type {boolean}
     * @memberof UIVirtualJoystick
     */
    enabled?: boolean;

    /**
     * The index of the gamepad to which the virtual joystick is mapped.
     * This allows the virtual joystick to control a specific gamepad.
     *
     * @type {number}
     * @memberof UIVirtualJoystick
     */
    gamepadIndex?: number;

    /**
     * The gamepad axis that the virtual joystick controls for horizontal movement.
     * This allows the virtual joystick to control a specific axis of the gamepad.
     *
     * @type {GamepadAxis}
     * @memberof UIVirtualJoystick
     */
    xAxis?: GamepadAxis;

    /**
     * The gamepad axis that the virtual joystick controls for vertical movement.
     * This allows the virtual joystick to control a specific axis of the gamepad.
     *
     * @type {GamepadAxis}
     * @memberof UIVirtualJoystick
     */
    yAxis?: GamepadAxis;

    /**
     * The outer radius of the virtual joystick's ring,
     * which defines the maximum distance the thumb can move from the center.
     *
     * @type {number}
     * @memberof UIVirtualJoystick
     */
    outerRadius?: number;

    /**
     * The radius of the virtual joystick's thumb,
     * which defines the size of the thumb that the user can drag.
     *
     * @type {number}
     * @memberof UIVirtualJoystick
     */
    thumbRadius?: number;

    /**
     * The maximum distance the thumb can move from the center of the virtual joystick,
     * which defines the sensitivity of the joystick.
     * 
     * If not specified, the thumb can move up to the outer radius of the joystick.
     *
     * @type {number}
     * @memberof UIVirtualJoystick
     */
    maxThumbDistance?: number;

    /**
     * The fill style of the virtual joystick's ring, which can be a color string, gradient, or pattern.
     *
     * @type {FillStyle}
     * @memberof UIVirtualJoystick
     */
    ringFillStyle?: FillStyle;

    /**
     * The stroke style of the virtual joystick's ring, which can be a color string, gradient, or pattern.
     *
     * @type {StrokeStyle}
     * @memberof UIVirtualJoystick
     */
    ringStrokeStyle?: StrokeStyle;

    /**
     * The line width of the virtual joystick's ring, which defines the thickness of the ring's stroke.
     *
     * @type {number}
     * @memberof UIVirtualJoystick
     */
    ringLineWidth?: number;

    /**
     * The fill style of the virtual joystick's thumb, which can be a color string, gradient, or pattern.
     *
     * @type {FillStyle}
     * @memberof UIVirtualJoystick
     */
    thumbFillStyle?: FillStyle;

    /**
     * The stroke style of the virtual joystick's thumb, which can be a color string, gradient, or pattern.
     *
     * @type {StrokeStyle}
     * @memberof UIVirtualJoystick
     */
    thumbStrokeStyle?: StrokeStyle;

    /**
     * The line width of the virtual joystick's thumb, which defines the thickness of the thumb's stroke.
     *
     * @type {number}
     * @memberof UIVirtualJoystick
     */
    thumbLineWidth?: number;

    /**
     * The shadow color of the virtual joystick's ring and thumb, which can be a color string.
     *
     * @type {string}
     * @memberof UIVirtualJoystick
     */
    shadowColor?: string;

    /**
     * The shadow blur radius of the virtual joystick's ring and thumb, which defines the softness of the shadow.
     *
     * @type {number}
     * @memberof UIVirtualJoystick
     */
    shadowBlur?: number;

    /**
     * The shadow offset of the virtual joystick's ring and thumb, which defines the distance of the shadow from the joystick.
     *
     * @type {Vector2}
     * @memberof UIVirtualJoystick
     */
    shadowOffset?: Vector2;
}
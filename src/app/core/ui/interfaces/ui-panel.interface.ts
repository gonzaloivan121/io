import { Vector2 } from "@xloxlolex/vector-math";

import { FillStyle, StrokeStyle } from "../../engine/renderer";

import { UIAnchor } from "../types/ui-anchor.type";

/**
 * Inline text fragment used inside rich panel content lines.
 *
 * @export
 * @interface UIPanelInlineTextRun
 */
export interface UIPanelInlineTextRun {
    type: 'text';
    text: string;
    color?: FillStyle;
    font?: string;
}

/**
 * Inline image fragment used inside rich panel content lines.
 *
 * @export
 * @interface UIPanelInlineImageRun
 */
export interface UIPanelInlineImageRun {
    type: 'image';
    image: CanvasImageSource;
    size: Vector2;
    yOffset?: number;
    marginLeft?: number;
    marginRight?: number;
}

/**
 * Union type for inline runs rendered inside a single panel content line.
 *
 * @export
 */
export type UIPanelInlineRun = UIPanelInlineTextRun | UIPanelInlineImageRun;

/**
 * Rich content line that supports mixed text and inline images.
 *
 * @export
 * @interface UIPanelLineContent
 */
export interface UIPanelLineContent {
    type: 'line';
    runs: UIPanelInlineRun[];
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    lineGap?: number;
}

/**
 * Custom content block that can render any UI element within the panel body.
 *
 * @export
 * @interface UIPanelCustomContent
 */
export interface UIPanelCustomContent {
    type: 'custom';
    size: Vector2;
    marginBottom?: number;
    render: (position: Vector2, size: Vector2) => void;
}

/**
 * Vertical spacer used to create additional separation between panel content blocks.
 *
 * @export
 * @interface UIPanelSpacerContent
 */
export interface UIPanelSpacerContent {
    type: 'spacer';
    size: number;
}

/**
 * Supported rich panel content items.
 *
 * @export
 */
export type UIPanelContentItem =
    | string
    | UIPanelLineContent
    | UIPanelCustomContent
    | UIPanelSpacerContent;

/**
 * The drawable area inside a panel, below the title and separator.
 *
 * @export
 * @interface UIPanelContentArea
 */
export interface UIPanelContentArea {
    position: Vector2;
    size: Vector2;
}

/**
 * Interface defining the options for rendering a panel in the `UI` system.
 *
 * @export
 * @interface UIPanel
 */
export interface UIPanel {
    /**
     * The position of the panel in the UI coordinate system.
     *
     * @type {Vector2}
     * @memberof UIPanel
     */
    position: Vector2;

    /**
     * The size of the panel in the UI coordinate system.
     *
     * @type {Vector2}
     * @memberof UIPanel
     */
    size: Vector2;

    /**
     * The anchor point of the panel, which determines how the panel is positioned relative to its position.
     *
     * @type {UIAnchor}
     * @memberof UIPanel
     */
    anchor?: UIAnchor;

    /**
     * The fill style of the panel, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIPanel
     */
    fillStyle?: FillStyle;

    /**
     * The stroke style of the panel, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {StrokeStyle}
     * @memberof UIPanel
     */
    strokeStyle?: StrokeStyle;

    /**
     * The fill style of the panel's title, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIPanel
     */
    titleColor?: FillStyle;

    /**
     * The fill style of the panel's text, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIPanel
     */
    textColor?: FillStyle;

    /**
     * The font style of the panel's title, which can be a CSS font string.
     *
     * @type {string}
     * @memberof UIPanel
     */
    titleFont?: string;

    /**
     * The font style of the panel's content, which can be a CSS font string.
     *
     * @type {string}
     * @memberof UIPanel
     */
    contentFont?: string;

    /**
     * The text alignment of the panel's title, which can be 'left', 'right', 'center', 'start', or 'end'.
     *
     * @type {CanvasTextAlign}
     * @memberof UIPanel
     */
    titleAlign?: CanvasTextAlign;

    /**
     * The text alignment of the panel's content, which can be 'left', 'right', 'center', 'start', or 'end'.
     *
     * @type {CanvasTextAlign}
     * @memberof UIPanel
     */
    contentAlign?: CanvasTextAlign;

    /**
     * The text baseline of the panel's title, which can be 'top', 'hanging', 'middle', 'alphabetic', 'ideographic', or 'bottom'.
     *
     * @type {CanvasTextBaseline}
     * @memberof UIPanel
     */
    titleBaseline?: CanvasTextBaseline;

    /**
     * The text baseline of the panel's content, which can be 'top', 'hanging', 'middle', 'alphabetic', 'ideographic', or 'bottom'.
     *
     * @type {CanvasTextBaseline}
     * @memberof UIPanel
     */
    contentBaseline?: CanvasTextBaseline;

    /**
     * The radius of the panel's corners, which defines how rounded the corners are.
     *
     * @type {number}
     * @memberof UIPanel
     */
    radius?: number;

    /**
     * The padding inside the panel, which defines the space between the panel's border and its content.
     *
     * @type {Vector2}
     * @memberof UIPanel
     */
    padding?: Vector2;

    /**
     * The gap between lines of text in the panel, which defines the vertical spacing between lines of text.
     *
     * @type {number}
     * @memberof UIPanel
     */
    lineGap?: number;

    /**
     * Rich panel content blocks.
     *
     * @type {UIPanelContentItem[]}
     * @memberof UIPanel
     */
    content?: UIPanelContentItem[];

    /**
     * Optional callback to draw arbitrary UI elements inside the panel body area.
     *
     * @memberof UIPanel
     */
    onDrawContent?: (contentArea: UIPanelContentArea) => void;
}
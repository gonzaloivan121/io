import { Vector2 } from '@xloxlolex/vector-math';

import { Renderer } from '../engine/renderer';

import { Input, KeyCode, MouseButton } from '../input/input';

import { UITheme } from './interfaces/ui-theme.interface';
import { UIInput } from './interfaces/ui-input.interface';
import { UIBackdrop } from './interfaces/ui-backdrop.interface';
import { UILabel } from './interfaces/ui-label.interface';
import { UIButton } from './interfaces/ui-button.interface';
import {
    UIPanel,
    UIPanelContentArea,
    UIPanelContentItem,
    UIPanelInlineRun,
    UIPanelLineContent,
} from './interfaces/ui-panel.interface';
import { UIVirtualJoystick } from './interfaces/ui-virtual-joystick.interface';
import { UIImage } from './interfaces/ui-image.interface';
import { UIThemes } from './themes';
import { UIUtilities } from './ui-utilities';
import { Log } from '../log/log';

/**
 * Class representing the User Interface (UI) system.
 * 
 * @export
 * @class UI
 */
export class UI {
    /**
     * The current UI theme.
     *
     * @private
     * @static
     * @type {UITheme}
     * @memberof UI
     */
    private static theme: UITheme;

    /**
     * The ID of the currently active input field.
     *
     * @private
     * @static
     * @type {(string | null)}
     * @memberof UI
     */
    private static activeInputId: string | null = null;

    /**
     * Initializes the UI system with an optional custom theme.
     *
     * @static
     * @param {Partial<UITheme>} [theme] - An optional partial theme to customize the UI appearance.
     * @memberof UI
     */
    public static Initialize(theme?: Partial<UITheme>): void {
        Log.Info('UI.Initialize() - Initializing UI...');

        this.theme = {
            ...UIThemes.Slate,
            ...theme,
        };

        Log.Debug('UI.Initialize() - UI initialized successfully.');
    }

    /**
     * Shuts down the UI system, clearing any active input state.
     *
     * @static
     * @memberof UI
     */
    public static Shutdown(): void {
        Log.Info('UI.Shutdown() - Shutting down UI...');
        
        this.activeInputId = null;

        Log.Trace('UI.Shutdown() - UI shutdown complete.');
    }

    /**
     * Sets the current UI theme.
     *
     * @static
     * @param {Partial<UITheme>} theme - The partial theme to set.
     * @memberof UI
     */
    public static SetTheme(theme: Partial<UITheme>): void {
        this.theme = {
            ...this.theme,
            ...theme,
        };
    }

    /**
     * Gets the current UI theme.
     *
     * @static
     * @returns {Readonly<UITheme>} The current UI theme.
     * @memberof UI
     */
    public static GetTheme(): Readonly<UITheme> {
        return this.theme;
    }

    /**
     * Renders an image on the screen with the specified options.
     *
     * @static
     * @param {UIImage} options - An object containing the image rendering options.
     * @memberof UI
     */
    public static Image(options: UIImage): void {
        UIUtilities.DrawScreenSpace(() => {
            Renderer.DrawImage(
                options.image,
                UIUtilities.ResolvePosition(options.position, options.anchor, options.size),
                options.size,
            );
        });
    }

    /**
     * Renders a backdrop on the screen with the specified options.
     *
     * @static
     * @param {UIBackdrop} [options] - An optional object containing the backdrop rendering options.
     * @memberof UI
     */
    public static Backdrop(options?: UIBackdrop): void {
        UIUtilities.DrawScreenSpace(() => {
            Renderer.FillRect(
                options?.position ?? Vector2.zero,
                options?.size ?? Renderer.ViewportSize,
                options?.fillStyle ?? this.theme.backdropBackground,
            );
        });
    }

    /**
     * Renders a label on the screen with the specified text and options.
     *
     * @static
     * @param {string} text - The text to be displayed in the label.
     * @param {UILabel} options - An object containing the label rendering options.
     * @memberof UI
     */
    public static Label(text: string, options: UILabel): void {
        UIUtilities.DrawScreenSpace(() => {
            Renderer.DrawText(text, UIUtilities.ResolvePosition(options.position, options.anchor), {
                fillStyle: options.color ?? this.theme.panelTextColor,
                font: options.font ?? this.theme.bodyFont,
                textAlign: options.textAlign ?? this.theme.textAlign,
                textBaseline: options.textBaseline ?? this.theme.textBaseline,
            });
        });
    }

    /**
     * Renders a button on the screen with the specified text, click handler, and options.
     *
     * @static
     * @param {string} text - The text to be displayed on the button.
     * @param {() => void} onClick - The function to be called when the button is clicked.
     * @param {UIButton} options - An object containing the button rendering options.
     * @returns {boolean} `true` if the button was clicked, `false` otherwise.
     * @memberof UI
     */
    public static Button(text: string, onClick: () => void, options: UIButton): boolean {
        const enabled = options.enabled ?? true;
        const font = options.font ?? this.theme.buttonFont;
        const padding = options.padding ?? this.theme.padding;
        const size = options.size ?? UIUtilities.MeasureButtonSize(text, font, padding);
        const position = UIUtilities.ResolvePosition(options.position, options.anchor, size);
        const hovered =
            enabled && UIUtilities.IsPointInsideRect(Input.MousePosition, position, size);
        const pressed = hovered && Input.GetMouseButton(MouseButton.Left);
        const clicked = hovered && enabled && Input.GetMouseButtonUp(MouseButton.Left);

        const fillStyle = !enabled
            ? this.theme.buttonDisabledBackgroundColor
            : pressed
              ? (options.pressedFillStyle ?? this.theme.buttonPressedBackgroundColor)
              : hovered
                ? (options.hoverFillStyle ?? this.theme.buttonHoverBackgroundColor)
                : (options.fillStyle ?? this.theme.buttonBackgroundColor);

            const strokeStyle = !enabled
                ? this.theme.buttonDisabledBorderColor
                : pressed
                    ? (options.pressedStrokeStyle ?? this.theme.buttonPressedBorderColor)
                    : hovered
                        ? (options.hoverStrokeStyle ?? this.theme.buttonHoverBorderColor)
                        : (options.strokeStyle ?? this.theme.buttonBorderColor);

        UIUtilities.DrawScreenSpace(() => {
            Renderer.SetShadow(this.theme.shadowColor, this.theme.shadowBlur, this.theme.shadowOffset.x, this.theme.shadowOffset.y);
            Renderer.DrawRoundedRect(
                position,
                size,
                options.radius ?? this.theme.buttonRadius,
                fillStyle,
                strokeStyle,
                this.theme.borderWidth,
            );
            Renderer.ClearShadow();

            Renderer.DrawText(
                text,
                new Vector2(position.x + size.x * 0.5, position.y + size.y * 0.5),
                {
                    fillStyle: enabled
                        ? (options.textColor ?? this.theme.buttonTextColor)
                        : this.theme.buttonDisabledTextColor,
                    font,
                    textAlign: options.textAlign ?? 'center',
                    textBaseline: options.textBaseline ?? 'middle',
                },
            );
        });

        if (clicked) {
            onClick();
        }

        return clicked;
    }

    /**
     * Renders a panel on the screen with the specified title, content, and options.
     *
     * @static
     * @param {string} title - The title of the panel.
     * @param {string} content - The content of the panel.
     * @param {UIPanel} options - An object containing the panel rendering options.
     * @memberof UI
     */
    public static Panel(title: string, content: string | UIPanelContentItem[], options: UIPanel): void {
        const padding = options.padding ?? this.theme.padding;
        const radius = options.radius ?? this.theme.panelRadius;
        const lineGap = options.lineGap ?? 6;
        const defaultContentFont = options.contentFont ?? this.theme.bodyFont;
        const defaultContentAlign = options.contentAlign ?? 'left';
        const defaultContentBaseline = options.contentBaseline ?? 'top';
        const defaultContentColor = options.textColor ?? this.theme.panelTextColor;
        const position = UIUtilities.ResolvePosition(
            options.position,
            options.anchor,
            options.size,
        );
        const richContent = Array.isArray(content) ? content : options.content;
        const plainContent = typeof content === 'string' ? content : '';
        const deferredContentRenderers: Array<() => void> = [];

        UIUtilities.DrawScreenSpace(() => {
            Renderer.SetShadow(this.theme.shadowColor, this.theme.shadowBlur, this.theme.shadowOffset.x, this.theme.shadowOffset.y);
            Renderer.DrawRoundedRect(
                position,
                options.size,
                radius,
                options.fillStyle ?? this.theme.panelBackground,
                options.strokeStyle ?? this.theme.panelBorder,
                this.theme.borderWidth,
            );
            Renderer.ClearShadow();

            const titleAlign = options.titleAlign ?? 'left';
            const titleBaseline = options.titleBaseline ?? 'top';
            const titleX =
                titleAlign === 'center'
                    ? position.x + options.size.x * 0.5
                    : titleAlign === 'right' || titleAlign === 'end'
                      ? position.x + options.size.x - padding.x
                      : position.x + padding.x;
            const titlePosition = new Vector2(titleX, position.y + padding.y);
            Renderer.DrawText(title, titlePosition, {
                fillStyle: options.titleColor ?? this.theme.panelTitleColor,
                font: options.titleFont ?? this.theme.titleFont,
                textAlign: titleAlign,
                textBaseline: titleBaseline,
            });

            const separatorY =
                position.y +
                padding.y +
                UIUtilities.MeasureLineHeight(options.titleFont ?? this.theme.titleFont) +
                8;
            Renderer.DrawLine(
                new Vector2(position.x + padding.x, separatorY),
                new Vector2(position.x + options.size.x - padding.x, separatorY),
                this.theme.accentColor,
                1,
            );

            const contentAreaPosition = new Vector2(position.x + padding.x, separatorY + 10);
            const contentAreaBottom = position.y + options.size.y - padding.y;
            const contentAreaSize = new Vector2(
                Math.max(0, options.size.x - padding.x * 2),
                Math.max(0, contentAreaBottom - contentAreaPosition.y),
            );
            let cursorY = contentAreaPosition.y;

            if (richContent && richContent.length > 0) {
                for (const item of richContent) {
                    if (typeof item === 'string') {
                        for (const line of item.split('\n')) {
                            Renderer.DrawText(line, new Vector2(contentAreaPosition.x, cursorY), {
                                fillStyle: defaultContentColor,
                                font: defaultContentFont,
                                textAlign: defaultContentAlign,
                                textBaseline: defaultContentBaseline,
                            });

                            cursorY += UIUtilities.MeasureLineHeight(defaultContentFont) + lineGap;
                        }

                        continue;
                    }

                    if (item.type === 'spacer') {
                        cursorY += item.size;
                        continue;
                    }

                    if (item.type === 'custom') {
                        const customPosition = new Vector2(contentAreaPosition.x, cursorY);

                        deferredContentRenderers.push(() => {
                            item.render(customPosition, item.size);
                        });

                        cursorY += item.size.y + (item.marginBottom ?? lineGap);
                        continue;
                    }

                    cursorY += this.DrawPanelInlineLine(
                        item,
                        contentAreaPosition,
                        contentAreaSize,
                        cursorY,
                        defaultContentFont,
                        defaultContentAlign,
                        defaultContentBaseline,
                        defaultContentColor,
                        lineGap,
                    );
                }
            } else {
                for (const line of plainContent.split('\n')) {
                    Renderer.DrawText(line, new Vector2(contentAreaPosition.x, cursorY), {
                        fillStyle: defaultContentColor,
                        font: defaultContentFont,
                        textAlign: defaultContentAlign,
                        textBaseline: defaultContentBaseline,
                    });

                    cursorY += UIUtilities.MeasureLineHeight(defaultContentFont) + lineGap;
                }
            }

            if (options.onDrawContent) {
                const panelContentArea: UIPanelContentArea = {
                    position: contentAreaPosition,
                    size: contentAreaSize,
                };

                deferredContentRenderers.push(() => {
                    options.onDrawContent?.(panelContentArea);
                });
            }
        });

        for (const renderer of deferredContentRenderers) {
            renderer();
        }
    }

    private static DrawPanelInlineLine(
        item: UIPanelLineContent,
        contentAreaPosition: Vector2,
        contentAreaSize: Vector2,
        cursorY: number,
        defaultFont: string,
        defaultAlign: CanvasTextAlign,
        defaultBaseline: CanvasTextBaseline,
        defaultColor: CanvasFillStrokeStyles['fillStyle'],
        defaultLineGap: number,
    ): number {
        const lineMetrics = this.MeasurePanelInlineRuns(item.runs, defaultFont);
        const align = item.align ?? defaultAlign;
        const baseline = item.baseline ?? defaultBaseline;
        const lineGap = item.lineGap ?? defaultLineGap;
        const lineHeight = lineMetrics.height;
        let runX = contentAreaPosition.x;

        if (align === 'center') {
            runX += (contentAreaSize.x - lineMetrics.width) * 0.5;
        } else if (align === 'right' || align === 'end') {
            runX += contentAreaSize.x - lineMetrics.width;
        }

        const textY =
            baseline === 'middle'
                ? cursorY + lineHeight * 0.5
                : baseline === 'bottom' || baseline === 'alphabetic' || baseline === 'ideographic'
                  ? cursorY + lineHeight
                  : cursorY;

        for (const run of item.runs) {
            if (run.type === 'text') {
                const runFont = run.font ?? defaultFont;

                Renderer.SetFont(runFont);
                Renderer.DrawText(run.text, new Vector2(runX, textY), {
                    fillStyle: run.color ?? defaultColor,
                    font: runFont,
                    textAlign: 'left',
                    textBaseline: baseline,
                });

                runX += Renderer.MeasureText(run.text).width;
                continue;
            }

            const topAlignedImageY =
                baseline === 'middle'
                    ? cursorY + (lineHeight - run.size.y) * 0.5
                    : baseline === 'bottom' || baseline === 'alphabetic' || baseline === 'ideographic'
                      ? cursorY + lineHeight - run.size.y
                      : cursorY;

            runX += run.marginLeft ?? 0;

            Renderer.DrawImage(
                run.image,
                new Vector2(runX, topAlignedImageY + (run.yOffset ?? 0)),
                run.size,
            );

            runX += run.size.x + (run.marginRight ?? 0);
        }

        return lineHeight + lineGap;
    }

    private static MeasurePanelInlineRuns(
        runs: UIPanelInlineRun[],
        defaultFont: string,
    ): { width: number; height: number } {
        let width = 0;
        let height = 0;

        for (const run of runs) {
            if (run.type === 'text') {
                const runFont = run.font ?? defaultFont;

                Renderer.SetFont(runFont);

                width += Renderer.MeasureText(run.text).width;
                height = Math.max(height, UIUtilities.MeasureLineHeight(runFont));
                continue;
            }

            width += (run.marginLeft ?? 0) + run.size.x + (run.marginRight ?? 0);
            height = Math.max(height, run.size.y + Math.max(0, run.yOffset ?? 0));
        }

        if (height <= 0) {
            height = UIUtilities.MeasureLineHeight(defaultFont);
        }

        return { width, height };
    }

    /**
     * Renders the virtual joystick in screen space.
     *
     * @static
     * @memberof UI
     */
    public static VirtualJoystick(id: string, options: UIVirtualJoystick): void {
        Input.ConfigureVirtualJoystick(id, options);

        if (!Input.VirtualJoystickEnabled || !(options.enabled ?? true)) {
            return;
        }

        const metrics = Input.GetVirtualJoystickMetrics(id);

        if (!metrics) {
            return;
        }

        const ringFillStyle = options.ringFillStyle ?? (() => {
            const gradient = Renderer.CreateRadialGradient(
                metrics.center.x,
                metrics.center.y,
                metrics.outerRadius * 0.15,
                metrics.center.x,
                metrics.center.y,
                metrics.outerRadius,
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            return gradient;
        })();
        const thumbCenter = new Vector2(
            metrics.center.x + Input.GetVirtualJoystickThumbOffset(id).x,
            metrics.center.y + Input.GetVirtualJoystickThumbOffset(id).y,
        );
        const thumbFillStyle = options.thumbFillStyle ?? (() => {
            const gradient = Renderer.CreateRadialGradient(
                thumbCenter.x - metrics.thumbRadius * 0.3,
                thumbCenter.y - metrics.thumbRadius * 0.3,
                metrics.thumbRadius * 0.2,
                thumbCenter.x,
                thumbCenter.y,
                metrics.thumbRadius,
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
            gradient.addColorStop(1, 'rgba(198, 198, 198, 0.92)');

            return gradient;
        })();

        UIUtilities.DrawScreenSpace(() => {
            Renderer.DrawEllipse(
                metrics.center,
                new Vector2(metrics.outerRadius, metrics.outerRadius),
                0,
                ringFillStyle,
                options.ringStrokeStyle ?? 'rgba(219, 219, 219, 0.78)',
                options.ringLineWidth ?? 8,
            );

            Renderer.SetShadow(
                options.shadowColor ?? this.theme.shadowColor,
                options.shadowBlur ?? this.theme.shadowBlur,
                options.shadowOffset?.x ?? this.theme.shadowOffset.x,
                options.shadowOffset?.y ?? this.theme.shadowOffset.y
            );
            Renderer.DrawEllipse(
                thumbCenter,
                new Vector2(metrics.thumbRadius, metrics.thumbRadius),
                0,
                thumbFillStyle,
                options.thumbStrokeStyle ?? 'rgba(255, 255, 255, 0.45)',
                options.thumbLineWidth ?? 1,
            );
            Renderer.ClearShadow();
        });
    }

    /**
     * Renders an input field on the screen with the specified options and returns the current value of the input.
     *
     * @static
     * @param {UIInput} options - An object containing the input field rendering options.
     * @returns {string} The current value of the input field.
     * @memberof UI
     */
    public static Input(options: UIInput): string {
        const enabled = options.enabled ?? true;
        const readOnly = options.readOnly ?? false;
        const padding = options.padding ?? this.theme.padding;
        const radius = options.radius ?? this.theme.buttonRadius;
        const font = options.font ?? this.theme.bodyFont;
        const textAlign = options.textAlign ?? 'left';
        const textBaseline = options.textBaseline ?? 'middle';
        const id = options.id ?? UIUtilities.BuildInputId(options);
        const position = UIUtilities.ResolvePosition(
            options.position,
            options.anchor,
            options.size,
        );
        const hovered =
            enabled && UIUtilities.IsPointInsideRect(Input.MousePosition, position, options.size);
        const leftMouseDown = Input.GetMouseButtonDown(MouseButton.Left);

        if (leftMouseDown) {
            if (hovered && enabled) {
                this.activeInputId = id;
            } else if (this.activeInputId === id) {
                this.activeInputId = null;
            }
        }

        const focused = enabled && this.activeInputId === id;
        const state = UIUtilities.GetOrCreateInputState(id, options.value ?? '');

        if (!focused && options.value !== undefined && state.value !== options.value) {
            state.value = options.value;
        }

        if (focused && !readOnly) {
            const previousValue = state.value;

            if (Input.GetKeyDown(KeyCode.Backspace) && state.value.length > 0) {
                state.value = state.value.slice(0, -1);
            }

            if (Input.GetKeyDown(KeyCode.Delete)) {
                state.value = '';
            }

            if (Input.GetKeyDown(KeyCode.Escape)) {
                this.activeInputId = null;
                options.onCancel?.(state.value);
            }

            if (Input.GetKeyDown(KeyCode.Enter)) {
                options.onSubmit?.(state.value);

                if (options.clearOnSubmit) {
                    state.value = '';
                }

                if (options.blurOnSubmit ?? true) {
                    this.activeInputId = null;
                }
            }

            const maxLength = options.maxLength;
            const typedCharacters = UIUtilities.GetTypedCharacters();

            if (typedCharacters.length > 0) {
                const allowedText =
                    maxLength === undefined
                        ? typedCharacters
                        : typedCharacters.slice(0, Math.max(0, maxLength - state.value.length));

                state.value += allowedText;
            }

            if (previousValue !== state.value) {
                options.onChange?.(state.value);
            }
        }

        const hasValue = state.value.length > 0;
        const displayValue = hasValue ? state.value : (options.placeholder ?? '');
        const displayColor = hasValue
            ? (options.textColor ?? this.theme.buttonTextColor)
            : (options.placeholderColor ?? 'rgba(203, 213, 225, 0.7)');
        const drawText = UIUtilities.FitInputTextToWidth(
            displayValue,
            font,
            options.size.x - padding.x * 2,
            hasValue,
        );

        const fillStyle = focused
            ? (options.focusedFillStyle ?? options.fillStyle ?? 'rgba(15, 23, 42, 0.95)')
            : hovered
              ? (options.hoverFillStyle ?? options.fillStyle ?? 'rgba(15, 23, 42, 0.9)')
              : (options.fillStyle ?? 'rgba(15, 23, 42, 0.8)');
        const strokeStyle = focused
            ? (options.focusedStrokeStyle ?? this.theme.accentColor)
            : (options.strokeStyle ?? this.theme.panelBorder);

        UIUtilities.DrawScreenSpace(() => {
            Renderer.SetShadow(this.theme.shadowColor, this.theme.shadowBlur, 0, 4);
            Renderer.DrawRoundedRect(
                position,
                options.size,
                radius,
                fillStyle,
                strokeStyle,
                this.theme.borderWidth,
            );
            Renderer.ClearShadow();

            const textX =
                textAlign === 'center'
                    ? position.x + options.size.x * 0.5
                    : textAlign === 'right' || textAlign === 'end'
                      ? position.x + options.size.x - padding.x
                      : position.x + padding.x;

            Renderer.DrawText(drawText, new Vector2(textX, position.y + options.size.y * 0.5), {
                fillStyle: displayColor,
                font,
                textAlign,
                textBaseline,
            });

            if (focused && UIUtilities.ShouldDrawCaret()) {
                Renderer.SetFont(font);
                const textWidth = Renderer.MeasureText(drawText).width;
                let caretX = textX;

                if (textAlign === 'center') {
                    caretX += textWidth * 0.5 + 2;
                } else if (textAlign !== 'right' && textAlign !== 'end') {
                    caretX += textWidth + 2;
                }

                caretX = Math.min(
                    position.x + options.size.x - padding.x,
                    Math.max(position.x + padding.x, caretX),
                );

                Renderer.DrawLine(
                    new Vector2(caretX, position.y + padding.y * 0.5),
                    new Vector2(caretX, position.y + options.size.y - padding.y * 0.5),
                    options.caretColor ?? this.theme.accentColor,
                    1.5,
                );
            }
        });

        return state.value;
    }
}
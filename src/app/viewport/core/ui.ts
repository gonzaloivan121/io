import { Vector2 } from '@xloxlolex/vector-math';
import { Input, MouseButton } from './input';
import { Renderer } from './renderer';

interface UITheme {
    panelBackground: string;
    panelBorder: string;
    panelTitleColor: string;
    panelTextColor: string;
    buttonBackground: string;
    buttonHoverBackground: string;
    buttonPressedBackground: string;
    buttonDisabledBackground: string;
    buttonTextColor: string;
    buttonDisabledTextColor: string;
    accentColor: string;
    shadowColor: string;
    panelRadius: number;
    buttonRadius: number;
    borderWidth: number;
    padding: number;
    titleFont: string;
    bodyFont: string;
    buttonFont: string;
    shadowBlur: number;
}

export interface UILabelOptions {
    position: Vector2;
    anchor?: UIAnchor;
    color?: string;
    font?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
}

export type UIAnchor =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export interface UIButtonOptions {
    position: Vector2;
    size?: Vector2;
    anchor?: UIAnchor;
    enabled?: boolean;
    fillStyle?: string;
    hoverFillStyle?: string;
    pressedFillStyle?: string;
    strokeStyle?: string;
    textColor?: string;
    font?: string;
    textAlign?: CanvasTextAlign;
    radius?: number;
    padding?: number;
}

export interface UIPanelOptions {
    position: Vector2;
    size: Vector2;
    anchor?: UIAnchor;
    fillStyle?: string;
    strokeStyle?: string;
    titleColor?: string;
    textColor?: string;
    titleFont?: string;
    contentFont?: string;
    titleAlign?: CanvasTextAlign;
    radius?: number;
    padding?: number;
    lineGap?: number;
}

export class UI {
    private static readonly defaultTheme: UITheme = {
        panelBackground: 'rgba(15, 23, 42, 0.9)',
        panelBorder: 'rgba(148, 163, 184, 0.35)',
        panelTitleColor: '#f8fafc',
        panelTextColor: '#cbd5e1',
        buttonBackground: '#2563eb',
        buttonHoverBackground: '#3b82f6',
        buttonPressedBackground: '#1d4ed8',
        buttonDisabledBackground: '#475569',
        buttonTextColor: '#eff6ff',
        buttonDisabledTextColor: '#cbd5e1',
        accentColor: '#7dd3fc',
        shadowColor: 'rgba(15, 23, 42, 0.45)',
        panelRadius: 14,
        buttonRadius: 10,
        borderWidth: 2,
        padding: 14,
        titleFont: '600 18px monospace',
        bodyFont: '14px monospace',
        buttonFont: '600 14px monospace',
        shadowBlur: 16,
    };

    private static theme: UITheme = { ...UI.defaultTheme };

    public static Initialize(theme?: Partial<UITheme>): void {
        this.theme = {
            ...this.defaultTheme,
            ...theme,
        };
    }

    public static SetTheme(theme: Partial<UITheme>): void {
        this.theme = {
            ...this.theme,
            ...theme,
        };
    }

    public static Label(text: string, options: UILabelOptions): void {
        this.DrawScreenSpace(() => {
            Renderer.DrawText(text, this.ResolvePosition(options.position, options.anchor), {
                fillStyle: options.color ?? this.theme.panelTextColor,
                font: options.font ?? this.theme.bodyFont,
                textAlign: options.textAlign ?? 'left',
                textBaseline: options.textBaseline ?? 'top',
            });
        });
    }

    public static Button(
        text: string,
        onClick: () => void,
        options: UIButtonOptions,
    ): boolean {
        const enabled = options.enabled ?? true;
        const font = options.font ?? this.theme.buttonFont;
        const padding = options.padding ?? this.theme.padding;
        const size = options.size ?? this.MeasureButtonSize(text, font, padding);
        const position = this.ResolvePosition(options.position, options.anchor, size);
        const hovered = enabled && this.IsPointInsideRect(Input.MousePosition, position, size);
        const pressed = hovered && Input.GetMouseButton(MouseButton.Left);
        const clicked = hovered && enabled && Input.GetMouseButtonDown(MouseButton.Left);

        const fillStyle = !enabled
            ? this.theme.buttonDisabledBackground
            : pressed
              ? options.pressedFillStyle ?? this.theme.buttonPressedBackground
              : hovered
                ? options.hoverFillStyle ?? this.theme.buttonHoverBackground
                : options.fillStyle ?? this.theme.buttonBackground;

        this.DrawScreenSpace(() => {
            Renderer.SetShadow(this.theme.shadowColor, this.theme.shadowBlur, 0, 6);
            Renderer.DrawRoundedRect(
                position,
                size,
                options.radius ?? this.theme.buttonRadius,
                fillStyle,
                options.strokeStyle ?? this.theme.accentColor,
                this.theme.borderWidth,
            );
            Renderer.ClearShadow();

            Renderer.DrawText(
                text,
                new Vector2(position.x + size.x * 0.5, position.y + size.y * 0.5),
                {
                    fillStyle: enabled
                        ? options.textColor ?? this.theme.buttonTextColor
                        : this.theme.buttonDisabledTextColor,
                    font,
                    textAlign: options.textAlign ?? 'center',
                    textBaseline: 'middle',
                },
            );
        });

        if (clicked) {
            onClick();
        }

        return clicked;
    }

    public static Panel(title: string, content: string, options: UIPanelOptions): void {
        const padding = options.padding ?? this.theme.padding;
        const radius = options.radius ?? this.theme.panelRadius;
        const lineGap = options.lineGap ?? 6;
        const position = this.ResolvePosition(options.position, options.anchor, options.size);

        this.DrawScreenSpace(() => {
            Renderer.SetShadow(this.theme.shadowColor, this.theme.shadowBlur, 0, 8);
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
            const titleX =
                titleAlign === 'center'
                    ? position.x + options.size.x * 0.5
                    : titleAlign === 'right' || titleAlign === 'end'
                      ? position.x + options.size.x - padding
                      : position.x + padding;
            const titlePosition = new Vector2(titleX, position.y + padding);
            Renderer.DrawText(title, titlePosition, {
                fillStyle: options.titleColor ?? this.theme.panelTitleColor,
                font: options.titleFont ?? this.theme.titleFont,
                textAlign: titleAlign,
                textBaseline: 'top',
            });

            const separatorY = position.y + padding + this.MeasureLineHeight(options.titleFont ?? this.theme.titleFont) + 8;
            Renderer.DrawLine(
                new Vector2(position.x + padding, separatorY),
                new Vector2(position.x + options.size.x - padding, separatorY),
                this.theme.accentColor,
                1,
            );

            let cursorY = separatorY + 10;

            for (const line of content.split('\n')) {
                Renderer.DrawText(line, new Vector2(position.x + padding, cursorY), {
                    fillStyle: options.textColor ?? this.theme.panelTextColor,
                    font: options.contentFont ?? this.theme.bodyFont,
                    textAlign: 'left',
                    textBaseline: 'top',
                });

                cursorY += this.MeasureLineHeight(options.contentFont ?? this.theme.bodyFont) + lineGap;
            }
        });
    }

    private static DrawScreenSpace(draw: () => void): void {
        Renderer.Save();
        Renderer.ResetTransform();

        try {
            draw();
        } finally {
            Renderer.Restore();
        }
    }

    private static MeasureButtonSize(text: string, font: string, padding: number): Vector2 {
        Renderer.SetFont(font);

        const metrics = Renderer.MeasureText(text);
        const width = Math.max(96, metrics.width + padding * 2);
        const height = Math.max(36, this.MeasureLineHeight(font) + padding);

        return new Vector2(width, height);
    }

    private static MeasureLineHeight(font: string): number {
        const match = font.match(/(\d+(?:\.\d+)?)px/);

        if (!match) {
            return 16;
        }

        return Number(match[1]) * 1.2;
    }

    private static IsPointInsideRect(point: Vector2, position: Vector2, size: Vector2): boolean {
        return (
            point.x >= position.x &&
            point.x <= position.x + size.x &&
            point.y >= position.y &&
            point.y <= position.y + size.y
        );
    }

    private static ResolvePosition(
        position: Vector2,
        anchor: UIAnchor = 'top-left',
        size: Vector2 = Vector2.zero,
    ): Vector2 {
        const origin = this.GetAnchorOrigin(anchor);

        return new Vector2(
            origin.x + position.x - size.x * this.GetHorizontalAnchorFactor(anchor),
            origin.y + position.y - size.y * this.GetVerticalAnchorFactor(anchor),
        );
    }

    private static GetAnchorOrigin(anchor: UIAnchor): Vector2 {
        switch (anchor) {
            case 'top-center':
                return new Vector2(Renderer.ViewportCenter.x, 0);
            case 'top-right':
                return new Vector2(Renderer.ViewportSize.x, 0);
            case 'center-left':
                return new Vector2(0, Renderer.ViewportCenter.y);
            case 'center':
                return Renderer.ViewportCenter;
            case 'center-right':
                return new Vector2(Renderer.ViewportSize.x, Renderer.ViewportCenter.y);
            case 'bottom-left':
                return new Vector2(0, Renderer.ViewportSize.y);
            case 'bottom-center':
                return new Vector2(Renderer.ViewportCenter.x, Renderer.ViewportSize.y);
            case 'bottom-right':
                return new Vector2(Renderer.ViewportSize.x, Renderer.ViewportSize.y);
            case 'top-left':
            default:
                return Vector2.zero;
        }
    }

    private static GetHorizontalAnchorFactor(anchor: UIAnchor): number {
        if (anchor.endsWith('right')) {
            return 1;
        }

        if (anchor.includes('center')) {
            return 0.5;
        }

        return 0;
    }

    private static GetVerticalAnchorFactor(anchor: UIAnchor): number {
        if (anchor.startsWith('bottom')) {
            return 1;
        }

        if (anchor.startsWith('center')) {
            return 0.5;
        }

        return 0;
    }
}
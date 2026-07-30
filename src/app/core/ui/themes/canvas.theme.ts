import { Vector2 } from "@xloxlolex/vector-math";

import { UITheme } from "../interfaces/ui-theme.interface";

export const CanvasTheme: UITheme = {
    backdropBackground: 'rgba(245, 158, 11, 0.08)',
    panelBackground: 'rgba(255, 251, 235, 0.96)',
    panelBorder: 'rgba(251, 146, 60, 0.34)',
    panelTitleColor: '#1f2937',
    panelTextColor: '#4b5563',
    buttonBackgroundColor: '#f97316',
    buttonHoverBackgroundColor: '#fb923c',
    buttonPressedBackgroundColor: '#ea580c',
    buttonDisabledBackgroundColor: '#d1d5db',
    buttonBorderColor: '#ea580c',
    buttonHoverBorderColor: '#f97316',
    buttonPressedBorderColor: '#c2410c',
    buttonDisabledBorderColor: '#9ca3af',
    buttonTextColor: '#fff7ed',
    buttonDisabledTextColor: '#6b7280',
    accentColor: '#ec4899',
    shadowColor: 'rgba(124, 45, 18, 0.18)',
    panelRadius: 20,
    buttonRadius: 16,
    borderWidth: 2,
    padding: new Vector2(18, 18),
    titleFont: '700 18px Helvetica',
    bodyFont: '14px Helvetica',
    buttonFont: '700 14px Helvetica',
    shadowBlur: 20,
    shadowOffset: new Vector2(0, 8),
    textAlign: 'left',
    textBaseline: 'top',
};
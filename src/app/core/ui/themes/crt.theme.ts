import { Vector2 } from "@xloxlolex/vector-math";

import { UITheme } from "../interfaces/ui-theme.interface";

export const CRTTheme: UITheme = {
    backdropBackground: 'rgba(0, 12, 6, 0.52)',
    panelBackground: 'rgba(6, 20, 10, 0.96)',
    panelBorder: 'rgba(34, 197, 94, 0.48)',
    panelTitleColor: '#dcfce7',
    panelTextColor: '#86efac',
    buttonBackgroundColor: '#0b2f18',
    buttonHoverBackgroundColor: '#14532d',
    buttonPressedBackgroundColor: '#071d10',
    buttonDisabledBackgroundColor: '#0a160f',
    buttonBorderColor: '#166534',
    buttonHoverBorderColor: '#22c55e',
    buttonPressedBorderColor: '#14532d',
    buttonDisabledBorderColor: '#052e16',
    buttonTextColor: '#f0fdf4',
    buttonDisabledTextColor: '#4ade80',
    accentColor: '#22c55e',
    shadowColor: 'rgba(0, 0, 0, 0.28)',
    panelRadius: 0,
    buttonRadius: 0,
    borderWidth: 1,
    padding: new Vector2(16, 16),
    titleFont: '700 18px Consolas',
    bodyFont: '14px Consolas',
    buttonFont: '700 14px Consolas',
    shadowBlur: 8,
    shadowOffset: new Vector2(0, 2),
    textAlign: 'left',
    textBaseline: 'top',
};
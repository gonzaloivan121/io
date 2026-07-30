import { Vector2 } from "@xloxlolex/vector-math";

import { UITheme } from "../interfaces/ui-theme.interface";

export const WorkbenchTheme: UITheme = {
    backdropBackground: 'rgba(12, 16, 23, 0.54)',
    panelBackground: 'rgba(30, 41, 59, 0.96)',
    panelBorder: 'rgba(96, 165, 250, 0.32)',
    panelTitleColor: '#f8fafc',
    panelTextColor: '#cbd5e1',
    buttonBackgroundColor: '#2563eb',
    buttonHoverBackgroundColor: '#3b82f6',
    buttonPressedBackgroundColor: '#1d4ed8',
    buttonDisabledBackgroundColor: '#334155',
    buttonBorderColor: '#1d4ed8',
    buttonHoverBorderColor: '#2563eb',
    buttonPressedBorderColor: '#1e40af',
    buttonDisabledBorderColor: '#475569',
    buttonTextColor: '#eff6ff',
    buttonDisabledTextColor: '#94a3b8',
    accentColor: '#38bdf8',
    shadowColor: 'rgba(15, 23, 42, 0.42)',
    panelRadius: 14,
    buttonRadius: 10,
    borderWidth: 2,
    padding: new Vector2(16, 16),
    titleFont: '600 18px Consolas',
    bodyFont: '14px Segoe UI',
    buttonFont: '600 14px Segoe UI',
    shadowBlur: 18,
    shadowOffset: new Vector2(0, 6),
    textAlign: 'left',
    textBaseline: 'top',
};
import { Vector2 } from "@xloxlolex/vector-math";

import { UITheme } from "../interfaces/ui-theme.interface";

export const DefaultTheme: UITheme = {
    backdropBackground: 'rgba(15, 23, 42, 0.5)',
    panelBackground: 'rgba(15, 23, 42, 0.9)',
    panelBorder: 'rgba(148, 163, 184, 0.35)',
    panelTitleColor: '#f8fafc',
    panelTextColor: '#cbd5e1',
    buttonBackgroundColor: '#2563eb',
    buttonHoverBackgroundColor: '#3b82f6',
    buttonPressedBackgroundColor: '#1d4ed8',
    buttonDisabledBackgroundColor: '#475569',
    buttonBorderColor: '#1d4ed8',
    buttonHoverBorderColor: '#2563eb',
    buttonPressedBorderColor: '#1e40af',
    buttonDisabledBorderColor: '#334155',
    buttonTextColor: '#eff6ff',
    buttonDisabledTextColor: '#cbd5e1',
    accentColor: '#7dd3fc',
    shadowColor: 'rgba(15, 23, 42, 0.45)',
    panelRadius: 16,
    buttonRadius: 12,
    borderWidth: 2,
    padding: new Vector2(16, 16),
    titleFont: '600 18px monospace',
    bodyFont: '14px monospace',
    buttonFont: '600 14px monospace',
    shadowBlur: 16,
    shadowOffset: new Vector2(0, 6),
    textAlign: 'left',
    textBaseline: 'top',
};
export type HealthTheme = {
  background: string;
  surface: string;
  elevated: string;
  text: string;
  muted: string;
  subtle: string;
  border: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  secondary: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  shadow: string;
};

export const healthThemes: Record<"light" | "dark", HealthTheme> = {
  light: {
    background: "#eef7f4",
    surface: "#ffffff",
    elevated: "#f8fcfb",
    text: "#102a43",
    muted: "#526476",
    subtle: "#7c8b9a",
    border: "#d9e8e4",
    primary: "#0f9f8a",
    primaryDark: "#087568",
    primarySoft: "#d8f3ed",
    secondary: "#2563eb",
    success: "#16a34a",
    successSoft: "#dcfce7",
    warning: "#d97706",
    warningSoft: "#fef3c7",
    danger: "#dc2626",
    dangerSoft: "#fee2e2",
    shadow: "#0f3d35",
  },
  dark: {
    background: "#071513",
    surface: "#10201d",
    elevated: "#162b27",
    text: "#edfdf8",
    muted: "#b6cac4",
    subtle: "#87a39b",
    border: "#28443d",
    primary: "#34d3bd",
    primaryDark: "#18a998",
    primarySoft: "#123d37",
    secondary: "#8bb7ff",
    success: "#4ade80",
    successSoft: "#12361f",
    warning: "#fbbf24",
    warningSoft: "#3d2d0f",
    danger: "#fb7185",
    dangerSoft: "#451a24",
    shadow: "#000000",
  },
};

export const lightTheme = {
  colors: {
    primary: "#007AFF",
    background: "#FFFFFF",
    card: "#F2F2F7",
    text: "#000000",
    icon: "#000000",
    textSecondary: "#8E8E93",
    border: "#C6C6C8",
    error: "#FF3B30",
    success: "#34C759",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: { fontSize: 28, fontWeight: "700" },
    h2: { fontSize: 22, fontWeight: "600" },
    body: { fontSize: 16, fontWeight: "400" },
    caption: { fontSize: 12, fontWeight: "400" },
  },
} as const;

export const darkTheme = {
  colors: {
    primary: "#0A84FF",
    background: "#000000",
    card: "#1C1C1E",
    text: "#FFFFFF",
    icon: "#FFFFFF",
    textSecondary: "#8E8E93",
    border: "#38383A",
    error: "#FF453A",
    success: "#32D74B",
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
} as const;

export type Theme = typeof lightTheme | typeof darkTheme;

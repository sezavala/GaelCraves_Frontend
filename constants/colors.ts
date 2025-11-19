/**
 * Color constants used throughout the application
 * Centralized color scheme for consistent theming
 */

export const Colors = {
  // Base colors
  background: "#0B1313",
  panel: "#0E1717",
  peach: "#E7C4A3",
  
  // Text colors
  text: "rgba(255,255,255,0.92)",
  textMuted: "rgba(255,255,255,0.72)",
  textDark: "#1b1b1b",
  
  // Input colors
  inputBackground: "#1a2424",
  border: "rgba(255,255,255,0.08)",
  
  // Status colors
  error: "#ff4444",
  success: "#4CAF50",
  warning: "#FFA726",
  info: "#29B6F6",
} as const;

export type ColorKey = keyof typeof Colors;

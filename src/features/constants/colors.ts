export const colors = {
  bg: "#F2F3F7",
  bgCard: "#FFFFFF",

  textPrimary: "#0A0F1E",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  textInverse: "#FFFFFF",

  primary: "#1A9B5A",
  primaryDark: "#157A47",
  primaryLight: "#E8F8F0",

  income: "#16A34A",
  incomeBg: "#DCFCE7",
  expense: "#DC2626",
  expenseBg: "#FEE2E2",

  border: "#E5E7EB",
  borderLight: "#F3F4F6",

  darkCard: "#0D1B2A",
  darkCardMid: "#1A2E45",

  danger: "#EF4444",
  dangerBg: "#FEF2F2",
};

export default colors;

export function getContrastColor(bgColor: string): string {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65 ? colors.textPrimary : "#FFFFFF";
}

export const COLORS_PALETTE = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#22C55E",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
  "#78716C",
];
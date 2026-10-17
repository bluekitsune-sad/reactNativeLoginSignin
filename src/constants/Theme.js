/**
 * MallMate design tokens — "Midnight Graphite + Emerald".
 * Source of truth: MallMate_Project_Blueprint/04-mobile/DESIGN_SYSTEM.md
 * (also summarized in MallMate_Project_Blueprint/PRD.md section 8).
 *
 * New MallMate screens and components must use these tokens. The legacy
 * food-ordering screens still use Colors.js / Fonts.js — migrating them is
 * incremental; do not rewrite legacy screens only to swap tokens.
 */
const MallMateTheme = {
  color: {
    background: "#101418",
    surface: "#191F24",
    surfaceElevated: "#232B32",
    primary: "#19C37D",
    primaryPressed: "#12A66A",
    highlight: "#F5B942",
    textPrimary: "#F5F7F8",
    textSecondary: "#A6B0B8",
    textMuted: "#7E8A94",
    border: "#303A42",
    error: "#FF6464",
    info: "#65B8FF",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    huge: 48,
  },
  radius: {
    card: 16,
    control: 12,
    sheet: 24,
  },
  typography: {
    display: { fontSize: 32, fontWeight: "700" },
    h1: { fontSize: 28, fontWeight: "700" },
    h2: { fontSize: 24, fontWeight: "600" },
    h3: { fontSize: 20, fontWeight: "600" },
    h4: { fontSize: 18, fontWeight: "600" },
    bodyLarge: { fontSize: 16, fontWeight: "400" },
    body: { fontSize: 14, fontWeight: "400" },
    label: { fontSize: 13, fontWeight: "500" },
    caption: { fontSize: 12, fontWeight: "400" },
    button: { fontSize: 15, fontWeight: "600" },
    price: { fontSize: 18, fontWeight: "700" },
  },
  fontFamily: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semiBold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    fallback: "System",
  },
  touchTarget: {
    min: 44,
    ideal: 48,
  },
};

export default MallMateTheme;

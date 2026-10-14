# Mobile Design System

## Brand direction
**Midnight Graphite + Emerald**: premium, urban, modern, high-contrast dark UI. Avoid purple as the dominant accent. Merchant assets may retain their own brand colors inside content areas.

## Color tokens
| Token | Hex |
|---|---|
| background | `#101418` |
| surface | `#191F24` |
| surfaceElevated | `#232B32` |
| primary | `#19C37D` |
| primaryPressed | `#12A66A` |
| highlight | `#F5B942` |
| textPrimary | `#F5F7F8` |
| textSecondary | `#A6B0B8` |
| textMuted | `#7E8A94` |
| border | `#303A42` |
| error | `#FF6464` |
| info | `#65B8FF` |

## Typography
Typeface: Inter, with platform fallback. Load fonts before rendering the main application. Respect system scaling.

| Token | Size | Weight |
|---|---:|---:|
| display | 32 | 700 |
| h1 | 28 | 700 |
| h2 | 24 | 600 |
| h3 | 20 | 600 |
| h4 | 18 | 600 |
| bodyLarge | 16 | 400 |
| body | 14 | 400 |
| label | 13 | 500 |
| caption | 12 | 400 |
| button | 15 | 600 |
| price | 18 | 700 |

## Spacing
4, 8, 12, 16, 24, 32, 48 px. Screen padding 16–20 px; cards 16 px internal padding; section gap 24–32 px.

## Shape and touch
- Card radius 16 px.
- Button/input radius 12 px.
- Bottom sheet top radius 24 px.
- Interactive target ideally 44–48 px minimum.
- Use restrained elevation; separate dark surfaces with contrast and borders.

## Component states
Buttons: default, pressed, disabled, loading.  
Inputs: default, focused, invalid, disabled.  
Cards: default, pressed, sponsored, unavailable.  
Network sections: loading, empty, error, stale/degraded.  
Financial status: pending, successful, failed, refunded; always include text/icon, not color alone.

## Rules
- Sentence case for headings and buttons.
- Keep essential text at least 12 px when possible.
- Use tabular numerals for prices/balances if available.
- Do not rely on color alone.
- Respect reduced-motion and dynamic type.
- Keep icon family consistent and provide accessible labels.
- Optimize images; use stable aspect ratios and loading placeholders.
- Avoid overloading the home screen; use horizontal carousels sparingly and provide full-list pages.
- Sponsored placements require a readable sponsored label.
- Discount terms must remain accessible from the offer.
- Mall-specific logo/branding may appear in the selector but must not break core design tokens.

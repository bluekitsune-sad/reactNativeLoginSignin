# Suggested Repository Structure

A monorepo can help share API contracts and design tokens. Keep packages independently testable.

```text
mallmate/
├── apps/
│   ├── mobile/                  # React Native + Expo
│   │   ├── app/                 # Expo Router routes, if selected
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── mall-selection/
│   │   │   │   ├── home/
│   │   │   │   ├── discovery/
│   │   │   │   ├── merchant/
│   │   │   │   ├── promotions/
│   │   │   │   ├── food-court/
│   │   │   │   ├── maps/
│   │   │   │   ├── parking/
│   │   │   │   ├── checkout/
│   │   │   │   ├── orders/
│   │   │   │   ├── rewards/
│   │   │   │   ├── events/
│   │   │   │   └── profile/
│   │   │   ├── navigation/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   ├── state/
│   │   │   ├── theme/
│   │   │   ├── utils/
│   │   │   └── types/
│   │   ├── assets/
│   │   └── tests/
│   ├── api/                     # NestJS
│   │   ├── src/
│   │   │   ├── common/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── malls/
│   │   │   ├── capabilities/
│   │   │   ├── merchants/
│   │   │   ├── catalog/
│   │   │   ├── discovery/
│   │   │   ├── promotions/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── loyalty/
│   │   │   ├── seats/
│   │   │   ├── maps/
│   │   │   ├── parking/
│   │   │   ├── events/
│   │   │   ├── notifications/
│   │   │   ├── analytics/
│   │   │   └── audit/
│   │   ├── migrations/
│   │   └── test/
│   ├── merchant-portal/         # Next.js
│   └── admin-portal/            # Next.js
├── packages/
│   ├── api-contracts/           # Shared DTOs/schemas
│   ├── design-tokens/           # Colors, spacing, typography
│   ├── lint-config/
│   └── ts-config/
├── docs/
│   ├── PRD.md
│   ├── ERD.md
│   ├── API_SPEC.md
│   └── ...
├── .github/workflows/
├── .env.example                # placeholders only; no secrets
├── package.json
└── README.md
```

## Rules
- Feature modules own their screens, API hooks, types, and tests.
- Keep API calls out of presentation components.
- Keep business rules on the server.
- Do not store secrets in mobile bundles or web public environment variables.
- Use one navigation system and one primary shared-state solution unless a concrete need proves otherwise.
- Prefer typed API contracts and schema validation.
- Keep merchant, mall, and platform admin access checks server-side.
- Do not share privileged server code with mobile packages.

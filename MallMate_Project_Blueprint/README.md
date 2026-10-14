# MallMate — Multi-Mall Platform Blueprint

This package contains the original PRD plus implementation-oriented planning artifacts for a React Native + Expo multi-mall application, initially piloted at LuckyOne Mall, Karachi.

## Contents
- `PRD.md` — product requirements document
- `01-architecture/TECHNICAL_SPEC.md` — architecture, modules, tenancy, environments
- `01-architecture/PROJECT_STRUCTURE.md` — recommended repository structure
- `02-data/ERD.md` — core entities and Mermaid ER diagram
- `02-data/TENANT_ISOLATION.md` — tenant scoping and authorization rules
- `03-api/API_SPEC.md` — REST API outline, conventions, endpoints and examples
- `04-mobile/SCREEN_INVENTORY.md` — mobile screens, navigation, and flows
- `04-mobile/DESIGN_SYSTEM.md` — dark graphite + emerald theme and typography
- `05-portals/MERCHANT_ADMIN_PORTALS.md` — merchant and mall/platform portal requirements
- `06-workflows/PAYMENTS_ORDERS_LOYALTY.md` — state machines and financial rules
- `06-workflows/SEAT_SESSIONS_PARKING_MAPS.md` — facility workflows
- `07-delivery/ROADMAP_AND_BACKLOG.md` — phased backlog and acceptance criteria
- `07-delivery/SECURITY_QA_DEPLOYMENT.md` — security, testing, operations checklist
- `08-decisions/OPEN_DECISIONS.md` — decisions to validate before implementation

## Important
This is a development blueprint, not production-ready code. Confirm payment provider capabilities, mall data access, legal obligations, map data, merchant settlement model, and loyalty funding before implementation. No credentials, production integrations, or real payment processing are included.

## Suggested reading order
1. `PRD.md`
2. `08-decisions/OPEN_DECISIONS.md`
3. `01-architecture/TECHNICAL_SPEC.md`
4. `02-data/ERD.md` and `02-data/TENANT_ISOLATION.md`
5. `03-api/API_SPEC.md`
6. `04-mobile/SCREEN_INVENTORY.md`
7. `06-workflows/`
8. `07-delivery/`

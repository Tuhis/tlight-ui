# TLight-UI Test Strategy

## Overview

This document defines a comprehensive, maintainable, and readable test strategy for the **tlight-ui** React SPA. The goal is to ensure that AI-generated or manual code changes do not break existing functionality.

## Architecture Summary

| Layer | Purpose | Files |
|-------|---------|-------|
| **Presentational Components** | Pure UI components, no Redux | `src/components/presentational/` (~18 components) |
| **Container Components** | Redux-connected smart components | `src/components/container/` (6 components) |
| **Redux Actions** | Action creators & thunks | `src/actions/` (3 files) |
| **Redux Reducers** | State management | `src/reducers/` (5 files) |
| **Middleware** | API communication layer | `src/middleware/tlightApiMiddleware.js` |
| **App & Routing** | Main app shell with react-router | `src/App.js`, `src/index.js` |

---

## Test Strategy Layers

### 1. Unit Tests (Foundation)

**Target:** Pure functions and isolated logic.

| Category | What to Test | Tools |
|----------|--------------|-------|
| **Reducers** | State transitions for all action types | Jest |
| **Action Creators** | Correct action shape returned | Jest |
| **Utility Functions** | `nodeStateFromValues`, `lightDataFromValues` | Jest |

**Example Coverage:**
- `reducers/nodes.js` → test `NODES_RECEIVED` produces expected state
- `reducers/effects.js` → test all effect-related actions
- All action creators return correct `{ type, payload }` shapes

**Priority:** ⭐⭐⭐ High – Fast, stable, catches logic bugs early.

---

### 2. Component Tests (Core)

**Target:** Presentational and container components.

| Component Type | Approach | Tools |
|----------------|----------|-------|
| **Presentational** | Render with props, assert output | React Testing Library + Jest |
| **Container** | Mock Redux store, test integration | React Testing Library + Redux mock |

**Presentational Components to Test:**
- `NormalButton` – click handler, CSS variants
- `Slider` / `SliderAndInput` – value changes, callbacks
- `Dropdown` – selection behavior
- `BaseCard` – rendering with various props
- `Breadcrumbs` – path rendering
- `ColorWrapper` – color picker integration

**Container Components to Test:**
- `NodeCardGrid` – renders cards based on Redux state
- `LightCardGrid` – same pattern
- `EffectCardGrid` – same pattern
- `NodeCard` / `LightCard` / `EffectCard` – user interactions dispatch correct actions

**Priority:** ⭐⭐⭐ High – Core of the application behavior.

---

### 3. Middleware & Integration Tests

**Target:** API middleware and Redux flow.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| **Middleware Unit** | Action interception, API call formation | Jest + fetch mock |
| **Redux Integration** | Action dispatch → reducer → state update | Jest + real store |

**Existing Test:**
- `tlightApiMiddleware.test.js` – covers 3 API actions (good baseline, needs expansion)

**Additional Coverage Needed:**
- `fetchNodeData` action flow
- Throttled actions (`postNodeValuesThrottled`, `postLightValuesThrottled`)
- Error handling paths (network failures)

**Priority:** ⭐⭐ Medium – Critical for API correctness.

---

### 4. Routing & Navigation Tests

**Target:** React Router paths and navigation.

| Test | Expected Behavior |
|------|-------------------|
| `/nodes` | Renders `NodeCardGrid` |
| `/effects` | Renders `EffectCardGrid` |
| `/nodes/:nodeId/lights` | Renders `LightCardGrid` with correct nodeId |
| Default redirect | Unknown paths redirect to `/nodes` |

**Tools:** React Testing Library with `MemoryRouter`.

**Priority:** ⭐⭐ Medium – Prevents broken navigation.

---

### 5. End-to-End Tests (Playwright)

**Target:** Critical user flows through the full application stack.

**Tool:** Playwright

**Test Location:** `e2e/` directory at project root

**Key User Flows to Test:**

| Flow | Description | Assertions |
|------|-------------|------------|
| **App Load** | Navigate to root URL | Redirects to `/nodes`, sidebar visible |
| **Node List** | View nodes page | Node cards rendered from API data |
| **Navigation** | Click node → view lights | URL changes, lights displayed |
| **Effects Page** | Navigate to effects | Effect cards rendered |
| **Slider Interaction** | Adjust brightness slider | API call made with correct value |
| **Color Change** | Use color picker | API call includes RGB values |
| **Reset** | Click reset button | localStorage cleared, page reloads |
| **Responsive** | Narrow viewport | Fullscreen menu replaces sidebar |

**API Mocking Strategy:**
- Mock backend responses with Playwright's `page.route()` 
- Test both success and error states
- Avoid dependency on live `tlight-commander` backend

**Priority:** ⭐⭐⭐ High – Validates real user experience.

---

## Test File Naming Convention

```
src/
├── components/
│   ├── presentational/
│   │   └── NormalButton/
│   │       ├── NormalButton.js
│   │       └── NormalButton.test.js    ← co-located
│   └── container/
│       └── NodeCardGrid/
│           ├── NodeCardGrid.js
│           └── NodeCardGrid.test.js
├── reducers/
│   ├── nodes.js
│   └── nodes.test.js                    ← co-located
├── actions/
│   ├── nodeActions.js
│   └── nodeActions.test.js
└── middleware/
    ├── tlightApiMiddleware.js
    └── tlightApiMiddleware.test.js      ← exists
```

---

## Testing Guidelines

### Do's
- **Test behavior, not implementation** – Avoid testing internal state
- **Use descriptive test names** – `it('should dispatch NODES_RECEIVED when API returns nodes')`
- **Mock at boundaries** – Mock `fetch`, not internal functions
- **Keep tests focused** – One assertion group per test
- **Use data-testid sparingly** – Prefer accessible queries (role, label)

### Don'ts
- ❌ Don't test CSS styling (brittle, visual regression tools are better)
- ❌ Don't mock what you own (prefer real reducers in integration tests)
- ❌ Don't test third-party libraries (lodash, react-color)

---

## Test Execution

**Run all tests:**
```bash
npm test
```

**Run with coverage:**
```bash
npm test -- --coverage --watchAll=false
```

**Run specific file:**
```bash
npm test -- NormalButton.test.js
```

---

## Implementation Phases

### Phase 1: Foundation + E2E Setup
1. **Playwright Setup** – Initialize with `npm init playwright@latest`
2. All reducer tests
3. All action creator tests  
4. Expand middleware tests (error handling)
5. Core Playwright E2E tests (app load, navigation, node list)

**Goal:** ~50% unit coverage + critical path E2E validation.

### Phase 2: Component & E2E Coverage
1. Key presentational component tests (5-8 components)
2. All container component tests
3. Routing tests (React Testing Library)
4. Expanded E2E tests (slider interactions, color picker, effects)

**Goal:** ~70% unit coverage + user flow E2E coverage.

### Phase 3: Polish & Edge Cases
1. Remaining presentational components
2. E2E error handling scenarios (API failures)
3. Performance benchmarks for throttled actions
4. Responsive layout E2E tests

**Goal:** ~80% coverage, high confidence for refactoring.

---

## Dependencies to Add

**Unit/Component Testing:**
```json
{
  "devDependencies": {
    "@testing-library/react": "^12.1.5",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "redux-mock-store": "^1.5.4"
  }
}
```

**E2E Testing (Playwright):**
```bash
npm init playwright@latest
```

This will add:
- `@playwright/test` dev dependency
- `playwright.config.js` configuration
- `e2e/` test directory

> [!IMPORTANT]
> React Testing Library may already be included via `react-scripts`. Verify before adding.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Code coverage (lines) | ≥70% |
| Test execution time | <30 seconds |
| Flaky test rate | 0% |
| Tests per PR | All must pass |

---

## Summary

This strategy prioritizes **unit tests for business logic** (reducers, actions, middleware) and **component tests for UI behavior**. It avoids over-testing implementation details and focuses on maintainability.

By following this strategy, AI-assisted code changes can be validated quickly, preventing regressions and ensuring stable application behavior.

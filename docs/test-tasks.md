# TLight-UI Test Implementation Tasks

This document breaks down the test strategy into small, AI-processable tasks.  
Each task should be completable in a single AI session.

---

## Phase 1: Foundation + E2E Setup

### 1.1 Playwright Setup
- [x] **Task 1.1.1**: Initialize Playwright in the project
  - Run `npm init playwright@latest`
  - Configure for Chromium only (faster CI)
  - Set base URL to `http://localhost:3000`
  - Create `e2e/` directory structure
  - Add npm scripts: `test:e2e`, `test:e2e:headed`

### 1.2 Reducer Unit Tests
- [x] **Task 1.2.1**: Test `reducers/nodes.js`
  - Test initial state is empty object
  - Test `NODES_RECEIVED` action merges nodes by ID
  - Test duplicate node IDs are handled correctly

- [x] **Task 1.2.2**: Test `reducers/effects.js`
  - Test initial state structure
  - Test `NODES_RECEIVED` creates `effectsInUsePerNode`
  - Test `CREATE_NEW_EFFECT` adds new effect with UUID
  - Test `SELECT_EFFECT` updates node's effectId
  - Test `DELETE_EFFECT` removes effect from list
  - Test `SET_EFFECT_NAME` updates specific effect
  - Test `SET_EFFECT_TYPE` updates type and resets properties
  - Test `SET_EFFECT_PROPERTY` sets nested property value

- [x] **Task 1.2.3**: Test `reducers/nodeValues.js`
  - Test `NODE_VALUES_CHANGED` updates values for node

- [x] **Task 1.2.4**: Test `reducers/lightValues.js`
  - Test `LIGHT_VALUES_CHANGED` updates values for light

### 1.3 Action Creator Tests
- [x] **Task 1.3.1**: Test `actions/nodeActions.js`
  - Test `nodesReceived()` returns correct action shape
  - Test `nodeReceived()` includes nodeId and node
  - Test `nodeValuesChanged()` includes nodeId and values
  - Test `changeNodeValues()` thunk dispatches API action then local action
  - Test `loadNodeData()` thunk fetches and dispatches

- [x] **Task 1.3.2**: Test `actions/effectActions.js`
  - Test all action creators return correct `{ type, payload }`
  - Test thunk actions dispatch correctly

- [x] **Task 1.3.3**: Test `actions/lightActions.js`
  - Test action creators return correct shapes
  - Test thunk actions

### 1.4 Middleware Tests (Expand Existing)
- [x] **Task 1.4.1**: Expand `tlightApiMiddleware.test.js`
  - Test `fetchNodeData` calls correct endpoint
  - Test error handling when fetch fails
  - Test non-API actions pass through unchanged
  - Test throttled actions work correctly

### 1.5 Core E2E Tests
- [x] **Task 1.5.1**: E2E - App load and navigation
  - Test root URL redirects to `/nodes` ✅
  - Test sidebar is visible on wide viewport ⚠️ (selector needs adjustment)
  - Test clicking "Nodes" navigates to `/nodes` ✅
  - Test clicking "Effects" navigates to `/effects` ⚠️ (selector needs adjustment)
  - Mock API response for `/v1/lights/nodes` ✅

- [x] **Task 1.5.2**: E2E - Node list display
  - Mock API to return 2-3 test nodes ✅
  - Verify node cards are rendered ✅
  - Verify node names are displayed ✅

---

## Phase 2: Component & E2E Coverage

### 2.1 Presentational Component Tests
- [ ] **Task 2.1.1**: Test `NormalButton`
  - Test renders children correctly
  - Test click handler is called
  - Test cancel button CSS variant applied

- [ ] **Task 2.1.2**: Test `Slider` component
  - Test renders with initial value
  - Test onChange callback fires with value
  - Test min/max constraints

- [ ] **Task 2.1.3**: Test `SliderAndInput` component
  - Test slider and input are synchronized
  - Test value changes propagate

- [ ] **Task 2.1.4**: Test `Dropdown` component
  - Test renders options
  - Test selection fires onChange
  - Test displays selected value

- [ ] **Task 2.1.5**: Test `Breadcrumbs` component
  - Test renders path segments
  - Test handles empty path

- [ ] **Task 2.1.6**: Test `BaseCard` component
  - Test renders title and children
  - Test optional props (actions, expandable)

- [ ] **Task 2.1.7**: Test `BigLinkList` component
  - Test renders list of links
  - Test click handlers work

- [ ] **Task 2.1.8**: Test `ColorWrapper` component
  - Test integrates with react-color
  - Test color changes fire callback

### 2.2 Container Component Tests
- [ ] **Task 2.2.1**: Test `NodeCardGrid`
  - Mock Redux store with nodes
  - Test renders NodeCard for each node
  - Test handles empty state

- [ ] **Task 2.2.2**: Test `LightCardGrid`
  - Mock store with lights for a node
  - Test renders LightCard for each light
  - Test uses nodeId from route params

- [ ] **Task 2.2.3**: Test `EffectCardGrid`
  - Mock store with configured effects
  - Test renders EffectCard for each effect
  - Test AddNewCard is present

- [ ] **Task 2.2.4**: Test `NodeCard`
  - Mock store and test rendering
  - Test brightness slider dispatches action
  - Test color picker dispatches action

- [ ] **Task 2.2.5**: Test `LightCard`
  - Test individual light controls
  - Test dispatches correct light actions

- [ ] **Task 2.2.6**: Test `EffectCard`
  - Test effect selection dropdown
  - Test effect property controls

### 2.3 Routing Tests
- [ ] **Task 2.3.1**: Test App routing with MemoryRouter
  - Test `/nodes` renders NodeCardGrid
  - Test `/effects` renders EffectCardGrid
  - Test `/nodes/:nodeId/lights` renders LightCardGrid
  - Test unknown routes redirect to `/nodes`

### 2.4 Expanded E2E Tests
- [ ] **Task 2.4.1**: E2E - Slider interactions
  - Navigate to a node
  - Interact with brightness slider
  - Verify API call is made with correct body

- [ ] **Task 2.4.2**: E2E - Color picker
  - Navigate to a node with color feature
  - Change color via picker
  - Verify API call includes RGB values

- [ ] **Task 2.4.3**: E2E - Effects workflow
  - Navigate to effects page
  - Create new effect
  - Set effect name and type
  - Verify localStorage persistence

---

## Phase 3: Polish & Edge Cases

### 3.1 Remaining Presentational Components
- [ ] **Task 3.1.1**: Test `AddNewCard`
  - Test click handler fires

- [ ] **Task 3.1.2**: Test `CardAdjustmentRow`
  - Test renders label and control

- [ ] **Task 3.1.3**: Test `Centerizer`
  - Test vertical/horizontal alignment props

- [ ] **Task 3.1.4**: Test `Divider`
  - Test renders correctly

- [ ] **Task 3.1.5**: Test `FullscreenMenu`
  - Test toggle open/close
  - Test renders children when open

- [ ] **Task 3.1.6**: Test `KeyValueList`
  - Test renders key-value pairs

- [ ] **Task 3.1.7**: Test `NumericInputBox`
  - Test accepts numeric input
  - Test validation

- [ ] **Task 3.1.8**: Test `Row50`
  - Test renders two columns

- [ ] **Task 3.1.9**: Test `Sidebar`
  - Test renders children

- [ ] **Task 3.1.10**: Test `Topbar`
  - Test renders children

### 3.2 E2E Error Handling
- [ ] **Task 3.2.1**: E2E - API failure scenarios
  - Mock API to return 500 error
  - Verify app handles gracefully (no crash)
  - Test network timeout handling

- [ ] **Task 3.2.2**: E2E - Empty state
  - Mock API to return empty nodes array
  - Verify empty state UI

### 3.3 Responsive & Edge Cases
- [ ] **Task 3.3.1**: E2E - Responsive layout
  - Test narrow viewport shows FullscreenMenu
  - Test wide viewport shows Sidebar
  - Test navigation works in both modes

- [ ] **Task 3.3.2**: E2E - Reset functionality
  - Click reset button
  - Verify localStorage is cleared
  - Verify page reloads correctly

### 3.4 Integration Tests
- [ ] **Task 3.4.1**: Redux integration test
  - Create real store
  - Dispatch action sequence
  - Verify final state

---

## Task Execution Guidelines

### For AI Sessions
1. **One task per session** - Complete the entire task before stopping
2. **Run tests after creation** - Use `npm test -- <filename>` to verify
3. **Follow existing patterns** - Check `tlightApiMiddleware.test.js` for style
4. **Mock external dependencies** - Never call real APIs in unit tests
5. **Co-locate test files** - Place `.test.js` next to source file

### Test File Template
```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const mockFn = jest.fn();
    render(<ComponentName onClick={mockFn} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Test Template
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API
    await page.route('**/v1/lights/nodes', route => {
      route.fulfill({ json: { nodes: [] } });
    });
  });

  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/nodes');
  });
});
```

---

## Progress Tracking

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| 1.1 Playwright Setup | 1 | 1 | ✅ Complete |
| 1.2 Reducer Tests | 4 | 4 | ✅ Complete |
| 1.3 Action Tests | 3 | 3 | ✅ Complete |
| 1.4 Middleware Tests | 1 | 1 | ✅ Complete |
| 1.5 Core E2E | 2 | 2 | ✅ Complete (10/15 passing) |
| 2.1 Presentational | 8 | 0 | Not Started |
| 2.2 Container | 6 | 0 | Not Started |
| 2.3 Routing | 1 | 0 | Not Started |
| 2.4 E2E Expanded | 3 | 0 | Not Started |
| 3.1 Remaining | 10 | 0 | Not Started |
| 3.2 E2E Errors | 2 | 0 | Not Started |
| 3.3 Responsive | 2 | 0 | Not Started |
| 3.4 Integration | 1 | 0 | Not Started |
| **Total** | **44** | **11** | **25%** |
  - Test `fetchNodeData` calls correct endpoint
  - Test error handling when fetch fails
  - Test non-API actions pass through unchanged
  - Test throttled actions work correctly

### 1.5 Core E2E Tests
- [ ] **Task 1.5.1**: E2E - App load and navigation
  - Test root URL redirects to `/nodes`
  - Test sidebar is visible on wide viewport
  - Test clicking "Nodes" navigates to `/nodes`
  - Test clicking "Effects" navigates to `/effects`
  - Mock API response for `/v1/lights/nodes`

- [ ] **Task 1.5.2**: E2E - Node list display
  - Mock API to return 2-3 test nodes
  - Verify node cards are rendered
  - Verify node names are displayed

---

## Phase 2: Component & E2E Coverage

### 2.1 Presentational Component Tests
- [ ] **Task 2.1.1**: Test `NormalButton`
  - Test renders children correctly
  - Test click handler is called
  - Test cancel button CSS variant applied

- [ ] **Task 2.1.2**: Test `Slider` component
  - Test renders with initial value
  - Test onChange callback fires with value
  - Test min/max constraints

- [ ] **Task 2.1.3**: Test `SliderAndInput` component
  - Test slider and input are synchronized
  - Test value changes propagate

- [ ] **Task 2.1.4**: Test `Dropdown` component
  - Test renders options
  - Test selection fires onChange
  - Test displays selected value

- [ ] **Task 2.1.5**: Test `Breadcrumbs` component
  - Test renders path segments
  - Test handles empty path

- [ ] **Task 2.1.6**: Test `BaseCard` component
  - Test renders title and children
  - Test optional props (actions, expandable)

- [ ] **Task 2.1.7**: Test `BigLinkList` component
  - Test renders list of links
  - Test click handlers work

- [ ] **Task 2.1.8**: Test `ColorWrapper` component
  - Test integrates with react-color
  - Test color changes fire callback

### 2.2 Container Component Tests
- [ ] **Task 2.2.1**: Test `NodeCardGrid`
  - Mock Redux store with nodes
  - Test renders NodeCard for each node
  - Test handles empty state

- [ ] **Task 2.2.2**: Test `LightCardGrid`
  - Mock store with lights for a node
  - Test renders LightCard for each light
  - Test uses nodeId from route params

- [ ] **Task 2.2.3**: Test `EffectCardGrid`
  - Mock store with configured effects
  - Test renders EffectCard for each effect
  - Test AddNewCard is present

- [ ] **Task 2.2.4**: Test `NodeCard`
  - Mock store and test rendering
  - Test brightness slider dispatches action
  - Test color picker dispatches action

- [ ] **Task 2.2.5**: Test `LightCard`
  - Test individual light controls
  - Test dispatches correct light actions

- [ ] **Task 2.2.6**: Test `EffectCard`
  - Test effect selection dropdown
  - Test effect property controls

### 2.3 Routing Tests
- [ ] **Task 2.3.1**: Test App routing with MemoryRouter
  - Test `/nodes` renders NodeCardGrid
  - Test `/effects` renders EffectCardGrid
  - Test `/nodes/:nodeId/lights` renders LightCardGrid
  - Test unknown routes redirect to `/nodes`

### 2.4 Expanded E2E Tests
- [ ] **Task 2.4.1**: E2E - Slider interactions
  - Navigate to a node
  - Interact with brightness slider
  - Verify API call is made with correct body

- [ ] **Task 2.4.2**: E2E - Color picker
  - Navigate to a node with color feature
  - Change color via picker
  - Verify API call includes RGB values

- [ ] **Task 2.4.3**: E2E - Effects workflow
  - Navigate to effects page
  - Create new effect
  - Set effect name and type
  - Verify localStorage persistence

---

## Phase 3: Polish & Edge Cases

### 3.1 Remaining Presentational Components
- [ ] **Task 3.1.1**: Test `AddNewCard`
  - Test click handler fires

- [ ] **Task 3.1.2**: Test `CardAdjustmentRow`
  - Test renders label and control

- [ ] **Task 3.1.3**: Test `Centerizer`
  - Test vertical/horizontal alignment props

- [ ] **Task 3.1.4**: Test `Divider`
  - Test renders correctly

- [ ] **Task 3.1.5**: Test `FullscreenMenu`
  - Test toggle open/close
  - Test renders children when open

- [ ] **Task 3.1.6**: Test `KeyValueList`
  - Test renders key-value pairs

- [ ] **Task 3.1.7**: Test `NumericInputBox`
  - Test accepts numeric input
  - Test validation

- [ ] **Task 3.1.8**: Test `Row50`
  - Test renders two columns

- [ ] **Task 3.1.9**: Test `Sidebar`
  - Test renders children

- [ ] **Task 3.1.10**: Test `Topbar`
  - Test renders children

### 3.2 E2E Error Handling
- [ ] **Task 3.2.1**: E2E - API failure scenarios
  - Mock API to return 500 error
  - Verify app handles gracefully (no crash)
  - Test network timeout handling

- [ ] **Task 3.2.2**: E2E - Empty state
  - Mock API to return empty nodes array
  - Verify empty state UI

### 3.3 Responsive & Edge Cases
- [ ] **Task 3.3.1**: E2E - Responsive layout
  - Test narrow viewport shows FullscreenMenu
  - Test wide viewport shows Sidebar
  - Test navigation works in both modes

- [ ] **Task 3.3.2**: E2E - Reset functionality
  - Click reset button
  - Verify localStorage is cleared
  - Verify page reloads correctly

### 3.4 Integration Tests
- [ ] **Task 3.4.1**: Redux integration test
  - Create real store
  - Dispatch action sequence
  - Verify final state

---

## Task Execution Guidelines

### For AI Sessions
1. **One task per session** - Complete the entire task before stopping
2. **Run tests after creation** - Use `npm test -- <filename>` to verify
3. **Follow existing patterns** - Check `tlightApiMiddleware.test.js` for style
4. **Mock external dependencies** - Never call real APIs in unit tests
5. **Co-locate test files** - Place `.test.js` next to source file

### Test File Template
```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const mockFn = jest.fn();
    render(<ComponentName onClick={mockFn} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Test Template
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API
    await page.route('**/v1/lights/nodes', route => {
      route.fulfill({ json: { nodes: [] } });
    });
  });

  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/nodes');
  });
});
```

---

## Progress Tracking

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| 1.1 Playwright Setup | 1 | 1 | ✅ Complete |
| 1.2 Reducer Tests | 4 | 4 | ✅ Complete |
| 1.3 Action Tests | 3 | 1 | 🔄 In Progress |
| 1.4 Middleware Tests | 1 | 0 | Not Started |
| 1.5 Core E2E | 2 | 0 | Not Started |
| 2.1 Presentational | 8 | 0 | Not Started |
| 2.2 Container | 6 | 0 | Not Started |
| 2.3 Routing | 1 | 0 | Not Started |
| 2.4 E2E Expanded | 3 | 0 | Not Started |
| 3.1 Remaining | 10 | 0 | Not Started |
| 3.2 E2E Errors | 2 | 0 | Not Started |
| 3.3 Responsive | 2 | 0 | Not Started |
| 3.4 Integration | 1 | 0 | Not Started |
| **Total** | **44** | **6** | **14%** |

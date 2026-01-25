# TLight UI - UX Roadmap

This document outlines planned UX/UI improvements for tlight-ui, based on analysis conducted on 2026-01-24.

## Current State

The existing UI is functional but uses a dated design (circa 2018). It features:
- Dark theme with cyan accents
- Card-based grid layout for nodes and lights
- Sidebar navigation with text-only links
- Basic slider controls for RGB and brightness

---

## Improvement 1: Visual Color Picker

**Priority:** High  
**Complexity:** Medium  
**Impact:** Significantly improved user experience for color selection

### Current Behavior
Users must manually adjust three separate sliders (Red, Green, Blue) to achieve a desired color. This is unintuitive and time-consuming.

### Proposed Solution
Replace or augment the RGB sliders with a modern color picker component:
- **Color wheel** for intuitive hue/saturation selection
- **Brightness slider** integrated with the picker
- **Hex/RGB input field** for precise values
- **Color presets** for commonly used colors (warm white, cool white, etc.)

### Technical Notes
- Consider using a library like `react-color` or building a custom component
- Maintain the existing RGB sliders as an "Advanced" option for power users
- Store recently used colors in localStorage for quick access

---

## Improvement 2: Real-Time State Previews

**Priority:** High  
**Complexity:** Low  
**Impact:** Immediate visual feedback without reading slider values

### Current Behavior
Light cards show text labels and sliders but no visual representation of the current color or brightness state.

### Proposed Solution
Add visual indicators to each card:
- **Colored circle/bulb icon** that reflects the actual RGB values
- **Brightness overlay** (opacity or glow effect) to show brightness level
- **Animated transitions** when values change for polish

### Technical Notes
- Use CSS `background-color` with dynamic RGB values
- Apply `opacity` or `filter: brightness()` for brightness visualization
- Consider adding a subtle pulsing animation for "live" lights

---

## Improvement 3: Bulk/Master Controls for Lights

**Priority:** High  
**Complexity:** Medium  
**Impact:** Massive time savings when controlling multiple lights

### Current Behavior
On the "Lights" detail page (`/nodes/:nodeId/lights`), users must adjust each light individually. For nodes with 15+ lights, this is extremely tedious.

### Proposed Solution
Implement group control features:
- **Master Control Panel** at the top of the lights grid
  - Global brightness slider
  - Global color picker
  - "Apply to All" button
- **Multi-select mode** to select specific lights and apply changes to the selection
- **Quick presets** (All On, All Off, Rainbow, etc.)

### Technical Notes
- Add a "Select All" checkbox in the header
- Individual light cards get a checkbox for multi-select
- Master controls dispatch batch API calls or iterate over selected lights
- Consider debouncing/throttling for performance

---

## Improvement 4: Enhanced Navigation

**Priority:** Medium  
**Complexity:** Low  
**Impact:** Improved discoverability and navigation flow

### Current Behavior
- Sidebar uses text-only links
- Breadcrumb navigation shows path but is not clickable
- No visual indication of currently active section

### Proposed Solution
**Sidebar Improvements:**
- Add icons next to each navigation item:
  - 💡 Nodes
  - ✨ Effects  
  - 📁 Groups
  - 🔄 Reset
- Highlight the active section with a background color or border
- Add hover states for better interactivity

**Breadcrumb Improvements:**
- Make each breadcrumb segment clickable
- Add ">" separator styling
- Show a "home" icon at the start

### Technical Notes
- Use `react-router-dom`'s `NavLink` with `activeClassName` for highlighting
- Wrap breadcrumb segments in `<Link>` components
- Consider using an icon library like `react-icons` or simple SVGs

---

## Improvement 5: Onboarding & Empty State UX

**Priority:** Medium  
**Complexity:** Low  
**Impact:** Better first-time user experience and discoverability

### Current Behavior
- "Effects" page shows only an "Add New" card
- "Groups" page is completely empty
- No guidance for new users

### Proposed Solution
Design helpful empty states:

**Effects Page:**
- Illustration or icon showing what effects do
- Headline: "Create Your First Effect"
- Description: "Effects are automated lighting sequences. Create one to make your lights dance, pulse, or cycle through colors."
- Prominent "Create Effect" button

**Groups Page:**
- Similar illustration
- Headline: "Organize Your Lights into Groups"
- Description: "Groups let you control multiple lights together. Create a group to synchronize your living room, bedroom, or outdoor lights."
- "Create Group" button

**General Onboarding:**
- Optional first-time tour highlighting key features
- Tooltip hints on hover for unfamiliar controls

### Technical Notes
- Create reusable `<EmptyState>` component with props for icon, title, description, and action
- Consider storing "has seen tour" flag in localStorage
- Use CSS animations to make empty states feel inviting

---

## Implementation Priority

| Improvement | Priority | Effort | Suggested Sprint |
|-------------|----------|--------|------------------|
| Visual Color Picker | High | Medium | 1 |
| Real-Time State Previews | High | Low | 1 |
| Bulk/Master Controls | High | Medium | 2 |
| Enhanced Navigation | Medium | Low | 2 |
| Empty State UX | Medium | Low | 3 |

---

## Future Considerations

- **Dark/Light mode toggle** - Some users may prefer a light theme
- **Mobile responsiveness** - Test and optimize for mobile devices
- **Keyboard shortcuts** - Power users would benefit from quick access keys
- **Undo/Redo** - Allow reverting accidental changes
- **Animations/Transitions** - Add smooth transitions between states for polish

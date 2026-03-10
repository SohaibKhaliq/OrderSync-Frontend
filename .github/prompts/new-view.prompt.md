---
description: "Scaffold a new staff dashboard page view with SWR data fetching, loading/error states, toast notifications, and all project conventions."
agent: "agent"
argument-hint: "e.g. InventoryPage at /dashboard/inventory fetching /inventory with INVENTORY scope"
---

Scaffold a new staff dashboard view for this project following all conventions in [copilot-instructions.md](../copilot-instructions.md).

## What to create

### 1. View file — `src/views/<ViewName>.jsx`

Structure:

```jsx
import React, { useState } from 'react'
import Page from "../components/Page";
import { Icon... } from "@tabler/icons-react";
import { iconStroke } from "../config/config";
import toast from "react-hot-toast";
import { useXxx } from "../controllers/xxx.controller";

export default function <ViewName>() {
  const { data, error, isLoading } = useXxx();

  if (isLoading) {
    return <Page>Please wait...</Page>;
  }

  if (error) {
    console.error(error);
    return <Page>Error loading data. Please try again later.</Page>;
  }

  return (
    <Page>
      <h3 className='text-2xl font-["Playfair_Display"]'><Title></h3>
      {/* main content */}
    </Page>
  );
}
```

- Use `font-["Playfair_Display"]` for page titles, `font-["Inter"]` for body text
- Use custom colors: `restro-green`, `restro-green-light`, `restro-green-dark`, `theme-orange`, `theme-dark`
- Use `@tabler/icons-react` icons with `strokeWidth={1.5}` (use the `iconStroke` constant from config)
- Use `@headlessui/react` for modals and dropdowns — do not use native `<dialog>` or `<select>` for menus
- Name button handlers with `btn` prefix: `btnSave`, `btnDelete`, `btnShowModal`
- Name modal/element IDs in kebab-case: `add-item-modal`
- Use `toast.success(...)` / `toast.error(...)` for all user feedback — never `alert()`
- Tailwind only — no inline styles unless Tailwind cannot express it

### 2. Controller — `src/controllers/<name>.controller.js`

- Use named async function exports: `export async function getItems() { ... }`
- All calls go through `ApiClient` from `../helpers/ApiClient`
- Wrap every call in try/catch and rethrow errors
- Add a SWR hook export for data that needs live refetch:
  ```js
  import useSWR from "swr";
  export function useXxx() {
    return useSWR("/route", () => getXxx().then((r) => r.data));
  }
  ```
- Add JSDoc `@param` comments for functions that take arguments
- No class-based patterns

### 3. Route registration — `src/App.jsx`

Add the new route inside the `<PrivateRoute>` / `<DashboardLayout>` block. If the view requires a scope, wrap it in `<ScopeProtectedRoute scope={SCOPES.XXX}>`. Available scopes are in `src/config/scopes.jsx`.

## Required inputs (infer from the user's argument or ask if missing)

- **View name** (PascalCase, e.g. `InventoryPage`)
- **Route path** (e.g. `/dashboard/inventory`)
- **API endpoint** to fetch from (e.g. `/inventory`)
- **Required RBAC scope** (e.g. `SCOPES.INVENTORY`) — omit wrapper if the view is scope-free
- **Key data fields** to display (infer a sensible table or card list if not specified)

## Checklist before finishing

- [ ] View file created at `src/views/<ViewName>.jsx`
- [ ] Controller created at `src/controllers/<name>.controller.js` with SWR hook
- [ ] Route added in `src/App.jsx` (with scope wrapper if applicable)
- [ ] No inline styles, no `alert()`, no direct `axios` calls
- [ ] Icons use `strokeWidth={1.5}`

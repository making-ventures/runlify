# Frontend File Graph (`<prefix>-ui`)

> **Load this file when:** you need to find a specific file in the generated frontend,
> understand which files are safe to edit, or know what gets regenerated.
>
> Legend: `[gen]` = regenerated every `regen` (DO NOT EDIT) · `[yours]` = created once,
> yours to implement · `[once]` = created once, rarely needs changes
>
> Related: [01-overview.md](./01-overview.md) · [07-backend-file-graph.md](./07-backend-file-graph.md)

---

## Full tree

```
<prefix>-ui/
│
└── src/
    └── adm/
        │
        ├── pages/
        │   └── <EntityName>/               One folder per entity
        │       │
        │       ├── <EntityName>List/
        │       │   ├── index.tsx           [gen]  Entry point — re-exports Default or custom
        │       │   ├── Default<Entity>List.tsx  [gen]  Generated list component
        │       │   ├── <Entity>Filter.tsx  [yours] Your custom filter (created once)
        │       │   ├── Default<Entity>Filter.tsx [gen]  Generated default filter
        │       │   └── <Entity>ListBreadcrumbs.tsx [gen]  Breadcrumb component
        │       │
        │       ├── <EntityName>Show/
        │       │   ├── index.tsx           [gen]  Entry point
        │       │   ├── Default<Entity>Show.tsx  [gen]  Generated show component
        │       │   ├── MainTab.tsx         [yours] Your custom main tab content
        │       │   ├── DefaultMainTab.tsx  [gen]  Generated main tab
        │       │   ├── DefaultActions.tsx  [gen]  Generated action buttons
        │       │   ├── additionalTabs.tsx  [yours] Your extra tabs in show view
        │       │   └── tabs/
        │       │       └── <RelatedEntity>Tab.tsx  [gen]  Auto-generated dependency tabs
        │       │
        │       ├── <EntityName>Create/
        │       │   ├── index.tsx           [gen]  Entry point
        │       │   └── Default<Entity>Create.tsx [gen]  Generated create form
        │       │
        │       └── <EntityName>Edit/
        │           ├── index.tsx           [gen]  Entry point
        │           └── Default<Entity>Edit.tsx   [gen]  Generated edit form
        │
        ├── widgets/
        │   └── <EntityName>/
        │       ├── <Entity>CountWidget.tsx [gen]  Count widget for dashboard
        │       └── <Entity>ListWidget.tsx  [gen]  List widget for dashboard
        │
        ├── resources.tsx                   [gen]  react-admin resource registry
        ├── resourcesChunk0.tsx             [gen]  Chunked resource imports (code splitting)
        ├── resourcesChunk1.tsx             [gen]  Chunked resource imports
        ├── ResourcesPage.tsx               [gen]  /resources debug page
        ├── MetaPage.tsx                    [gen]  /meta debug page
        ├── entityMapping.ts               [gen]  Entity name → component mapping
        ├── routes.tsx                      [gen]  All react-admin routes
        ├── additionalRoutes.tsx            [yours] Your custom routes/pages
        ├── Dashboard.tsx                   [yours] Home page content
        ├── getDefaultMenu.ts              [gen]  Auto-generated sidebar menu
        ├── getAdditionalMenu.ts           [yours] Your extra menu items
        │
        ├── functions/
        │   └── Functions.tsx              [gen]  System functions page
        │
        ├── i18n/
        │   ├── lang/
        │   │   ├── <lang>.catalogs.ts      [gen]  Catalog translations per language
        │   │   ├── <lang>.documents.ts     [gen]  Document translations
        │   │   ├── <lang>.infoRegistries.ts [gen]
        │   │   ├── <lang>.sumRegistries.ts [gen]
        │   │   ├── <lang>.reports.ts       [gen]
        │   │   └── <lang>.ts               [gen]  Root translation file for this language
        │   └── i18nProvider/
        │       └── index.ts               [gen]  react-admin i18n provider
        │
        └── environment/
            ├── src/
            │   ├── App.tsx                [gen]  Root react-admin App component
            │   ├── dataProvider/
            │   │   ├── index.ts           [gen]  GraphQL data provider
            │   │   └── getAdditionalMethods.ts [once] Hook for custom data provider methods
            │   ├── i18nProvider/
            │   │   └── index.ts           [gen]
            │   ├── layout/
            │   │   ├── AppBar.tsx         [gen]  Top application bar
            │   │   └── Menu.tsx           [gen]  Sidebar menu component
            │   ├── routes.ts              [gen]  Route registration
            │   └── contexts/
            │       └── SpacesContext.ts   [gen]  Multi-space / tenant context
            │
            ├── .gitlab-ci.yml             [gen]  GitLab CI pipeline for UI
            ├── Dockerfile                 [gen]  nginx-based frontend Docker image
            └── chart/                     Helm chart for Kubernetes
                ├── Chart.yaml             [gen]
                ├── values.yaml            [gen]
                └── templates/
                    ├── front.yaml         [gen]
                    └── ingress.yaml       [gen]
```

---

## Per-entity: what to edit and what not to

### List page

| File | Owner | When to edit |
|------|-------|-------------|
| `index.tsx` | `[gen]` | Never — re-exports Default or your override |
| `Default<Entity>List.tsx` | `[gen]` | Never |
| `Default<Entity>Filter.tsx` | `[gen]` | Never |
| `<Entity>Filter.tsx` | `[yours]` | Customise filter fields, add new filters |
| `<Entity>ListBreadcrumbs.tsx` | `[gen]` | Never |

### Show page

| File | Owner | When to edit |
|------|-------|-------------|
| `index.tsx` | `[gen]` | Never |
| `Default<Entity>Show.tsx` | `[gen]` | Never |
| `DefaultMainTab.tsx` | `[gen]` | Never |
| `MainTab.tsx` | `[yours]` | Override the main tab layout |
| `DefaultActions.tsx` | `[gen]` | Never |
| `additionalTabs.tsx` | `[yours]` | Add extra tabs to the show view |
| `tabs/<Related>Tab.tsx` | `[gen]` | Never — auto-generated dependency lists |

### Create / Edit pages

All files under `Create/` and `Edit/` are `[gen]`. Form fields and their order are
controlled from the meta via `entity.getForms()`. See [03-entity-types.md](./03-entity-types.md).

---

## System-level files

### `Dashboard.tsx` — yours {#dashboard}

The home page of the admin UI. Empty by default. Add widgets, stats, charts here.
Widget components are generated per-entity in `widgets/<EntityName>/`.

### `additionalRoutes.tsx` — yours {#additional-routes}

Register custom react-admin `<Route>` components here. Used for non-entity pages like
reports, custom dashboards, or wizard flows.

### `getAdditionalMenu.ts` — yours {#additional-menu}

Return extra menu items from this function. Appended to the auto-generated menu.
Menu items added via `system.addGroupMenuItem` / `addInternalMenuItem` etc. in the meta
are reflected in `getDefaultMenu.ts` — do not edit that file.

---

## How the menu is built

```
getDefaultMenu.ts  [gen]   ← from system.addGroupMenuItem / addInternalMenuItem in meta
getAdditionalMenu.ts [yours] ← your custom extra items

Menu.tsx [gen]             ← combines both
```

**Anti-pattern — editing `getDefaultMenu.ts` to add menu items:**

```ts
// WRONG: overwritten on next regen
export const getDefaultMenu = () => [
  ...generatedItems,
  { label: 'My Custom Page', path: '/custom' }  // lost on regen
]
```

**Correct:** add menu items in `getAdditionalMenu.ts` (for frontend-only custom items)
or via `system.addInternalMenuItem` / `addGroupMenuItem` in the meta (for items
backed by a page registered in the system).

---

## i18n

Translation files are fully generated from entity titles and field titles defined in the
meta. To change a translation:

1. Update the title in `metadata.ts`: `entity.setTitle({ singular: 'Order', plural: 'Orders' }, 'en')`
2. Run `regen`

**Anti-pattern — editing translation files directly:**

Editing `<lang>.catalogs.ts` or any generated lang file is pointless — changes are
overwritten on regen.

---

## Data provider

`dataProvider/index.ts` is generated. It wires the react-admin data provider to the
GraphQL backend.

`dataProvider/getAdditionalMethods.ts` is created once. Use it to add custom data
provider methods for non-standard GraphQL queries.

---

## Anti-patterns

### Editing `Default<Entity>*.tsx` components

**Wrong:** modifying generated list/show/create/edit components directly.

**Why:** overwritten on every `regen`. Your changes vanish.

**Correct:**
- For list: customise `<Entity>Filter.tsx`
- For show: implement `MainTab.tsx` or add tabs in `additionalTabs.tsx`
- For create/edit: adjust field visibility/order in the meta via `entity.getForms()`
  or `field.setShowInCreate(false)` / `setShowInEdit(false)`

---

### Adding custom routes directly to `routes.tsx`

**Wrong:** editing the generated `routes.tsx` to add a new route.

**Why:** overwritten on regen.

**Correct:** add custom routes in `additionalRoutes.tsx`.

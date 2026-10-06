# Frontend File Graph (`<prefix>-ui`)

> **Load this file when:** you need to find a specific file in the generated frontend,
> understand which files are safe to edit, or know what gets regenerated.
>
> Legend: `[gen]` = regenerated every `regen` (DO NOT EDIT) · `[yours]` = created once,
> yours to implement · `[once]` = created once, rarely needs changes
>
> Related: [01-overview.md](./01-overview.md) · [07-backend-file-graph.md](./07-backend-file-graph.md) ·
> [11-permissions.md](./11-permissions.md)

---

## Full tree

```
<prefix>-ui/
│
└── src/
    │
    ├── adm/
    │   │
    │   ├── pages/
    │   │   └── <EntityName>/               One folder per entity
    │   │       │
    │   │       ├── <EntityName>List/
    │   │       │   ├── index.tsx           [once] Entry point — renders Default or your custom component
    │   │       │   ├── Default<Entity>List.tsx  [gen]  Generated list component
    │   │       │   ├── <Entity>Filter.tsx  [yours] Your custom filter (created once)
    │   │       │   ├── Default<Entity>Filter.tsx [gen]  Generated default filter
    │   │       │   └── <Entity>ListBreadcrumbs.tsx [once] Breadcrumb component
    │   │       │
    │   │       ├── <EntityName>Show/
    │   │       │   ├── index.tsx           [once] Entry point
    │   │       │   ├── Default<Entity>Show.tsx  [gen]  Generated show component
    │   │       │   ├── MainTab.tsx         [yours] Your custom main tab content
    │   │       │   ├── DefaultMainTab.tsx  [gen]  Generated main tab
    │   │       │   ├── DefaultActions.tsx  [gen]  Generated action buttons
    │   │       │   ├── additionalTabs.tsx  [yours] Your extra tabs in show view
    │   │       │   └── tabs/
    │   │       │       └── <RelatedEntity>Tab.tsx  [gen]  Auto-generated dependency tabs
    │   │       │
    │   │       ├── <EntityName>Create/
    │   │       │   ├── index.tsx           [once] Entry point
    │   │       │   └── Default<Entity>Create.tsx [gen]  Generated create form
    │   │       │
    │   │       ├── <EntityName>Edit/
    │   │       │   ├── index.tsx           [once] Entry point
    │   │       │   └── Default<Entity>Edit.tsx   [gen]  Generated edit form
    │   │       │
    │   │       └── get<Entity>Validation.tsx [gen]  yup schema of the create/edit forms
    │   │
    │   ├── widgets/
    │   │   └── <EntityName>/
    │   │       ├── <Entity>CountWidget.tsx [gen]  Count widget for dashboard
    │   │       └── <Entity>ListWidget.tsx  [gen]  List widget for dashboard
    │   │
    │   ├── resources.tsx                   [gen]  react-admin resource registry
    │   ├── resourcesChunk0.tsx             [gen]  Chunked resource imports (code splitting)
    │   ├── resourcesChunk1.tsx             [gen]  Chunked resource imports
    │   ├── ResourcesPage.tsx               [gen]  /resources debug page
    │   ├── MetaPage.tsx                    [gen]  /meta debug page
    │   ├── entityMapping.ts                [gen]  Entity name → component mapping
    │   ├── routes.tsx                      [gen]  All react-admin routes
    │   ├── additionalRoutes.tsx            [yours] Your custom routes/pages
    │   ├── Dashboard.tsx                   [yours] Home page content
    │   ├── PermissionPage.tsx              [once]  Shown when withPermission denies access
    │   ├── NotFoundPage.tsx                [once]  Shown when an action doesn't exist on the entity
    │   ├── getDefaultMenu.ts               [gen]  Auto-generated sidebar menu
    │   ├── getAdditionalMenu.ts            [yours] Your extra menu items
    │   │
    │   └── functions/
    │       └── Functions.tsx               [gen]  System functions page
    │
    ├── i18n/
    │   ├── types.ts                        [once]  ValidationMessages type (one per project)
    │   └── <lang>/
    │       ├── <lang>Catalogs.ts           [gen]   Catalog translations for this language
    │       ├── <lang>Docs.ts               [gen]   Document translations (exports `<lang>Documents`)
    │       ├── <lang>InfoRegistries.ts     [gen]
    │       ├── <lang>SumRegistries.ts      [gen]
    │       ├── <lang>Reports.ts            [gen]
    │       ├── <lang>Validation.ts         [once]  Validation messages (one per language)
    │       └── index.ts                    [once]  Assembles the above + custom keys, per language
    │
    ├── utils/
    │   └── permissions.ts                  [gen]   hasPermission / hasAnyPermission / hasAllPermissions / withPermission
    │
    └── environment/
        ├── src/
        │   ├── App.tsx                    [gen]  Root react-admin App component
        │   ├── dataProvider/
        │   │   ├── index.ts               [gen]  GraphQL data provider
        │   │   └── getAdditionalMethods.ts [once] Hook for custom data provider methods
        │   ├── i18nProvider/
        │   │   └── index.ts               [gen]  react-admin i18n provider — merges src/i18n/<lang> per language
        │   ├── layout/
        │   │   ├── AppBar.tsx             [gen]  Top application bar
        │   │   └── Menu.tsx               [gen]  Sidebar menu component
        │   ├── routes.ts                  [gen]  Route registration
        │   └── contexts/
        │       └── SpacesContext.ts       [gen]  Multi-space / tenant context
        │
        ├── .gitlab-ci.yml                 [gen]  GitLab CI pipeline for UI
        ├── Dockerfile                     [gen]  nginx-based frontend Docker image
        └── chart/                         Helm chart for Kubernetes
            ├── Chart.yaml                 [gen]
            ├── values.yaml                [gen]
            └── templates/
                ├── front.yaml             [gen]
                └── ingress.yaml           [gen]
```

---

## Per-entity: what to edit and what not to

### List page

| File | Owner | When to edit |
|------|-------|-------------|
| `index.tsx` | `[once]` | Switch the page to your own component |
| `Default<Entity>List.tsx` | `[gen]` | Never |
| `Default<Entity>Filter.tsx` | `[gen]` | Never |
| `<Entity>Filter.tsx` | `[yours]` | Customise filter fields, add new filters |
| `<Entity>ListBreadcrumbs.tsx` | `[once]` | Change the breadcrumbs of the list |

### Show page

| File | Owner | When to edit |
|------|-------|-------------|
| `index.tsx` | `[once]` | Switch the page to your own component |
| `Default<Entity>Show.tsx` | `[gen]` | Never |
| `DefaultMainTab.tsx` | `[gen]` | Never |
| `MainTab.tsx` | `[yours]` | Override the main tab layout |
| `DefaultActions.tsx` | `[gen]` | Never |
| `additionalTabs.tsx` | `[yours]` | Add extra tabs to the show view |
| `tabs/<Related>Tab.tsx` | `[gen]` | Never — auto-generated dependency lists |

### Create / Edit pages

`Default<Entity>Create.tsx`, `Default<Entity>Edit.tsx` and the shared
`get<Entity>Validation.tsx` (the yup schema of both forms) are `[gen]`, the two
`index.tsx` are `[once]`. Form fields and their order are controlled from the meta via
`entity.getForms()`. See [03-entity-types.md](./03-entity-types.md).

---

## Descriptor mode (per entity) {#descriptor-mode}

An entity can opt out of the generated `Default*` components of all four pages:

```ts
entity.getForms().setUiPagesMode('descriptor')   // default is 'legacy'
```

In this mode runlify generates **data instead of components** — the pages are rendered
by universal components of the UI project (`src/uiLib/entityPages/`), which the project
implements once for all entities.

| File | Owner | Notes |
|------|-------|-------|
| `pages/<EntityName>/<Entity>Descriptor.ts` | `[gen]` | All the data of the four pages: fields, filter fields, dependency tabs, permissions, sort, i18n keys, `keyField`, `forms` |
| `pages/<EntityName>/<Entity>Slots.tsx` | `[yours, optional]` | Exports `<camelSingular>Slots`. If the file exists, the descriptor imports it as `slots`; it is never created by runlify |
| `pages/<EntityName>/<Entity>List/index.tsx` | `[once]` | Renders `<EntityList descriptor={...} />` |
| `pages/<EntityName>/<Entity>Show/index.tsx` | `[once]` | Renders `<EntityShow descriptor={...} />` |
| `pages/<EntityName>/<Entity>Create/index.tsx` | `[once]` | Renders `<EntityCreate descriptor={...} />`. Written **only** when the entity is `creatableByUser` |
| `pages/<EntityName>/<Entity>Edit/index.tsx` | `[once]` | Renders `<EntityEdit descriptor={...} />`. Written **only** when the entity is `updatableByUser` |
| `uiLib/entityPages/descriptorTypes.ts` | `[gen]` | The descriptor data type, written once per project when at least one entity uses the mode |

**Dependency tab columns.** A `dependencyTabs` entry always carries `ownerEntity` and the
service keys (`ownerType`, `fromField`, `path`, `labelKey`, `permissions`), while its
`fields` are printed **only when the owner entity is not in the `descriptor` mode**. An
owner in the mode writes its own `<Owner>Descriptor.ts`, so repeating a copy of its fields
in every tab of every dependent entity would be pure duplication. The UI is therefore
required to resolve `ownerEntity` through its own registry of generated descriptors (in
rlw — `src/uiLib/entityPages/descriptorRegistry.ts`, an `import.meta.glob` without
`eager`) and to build the columns out of the owner fields the same way the generator did:
`!hidden && !markdown`, the meta order, `showInList` not taken into account. The inline
`fields` stay the contract for legacy owners (an entity with `allowedToChange`, for
instance, can never get a descriptor).

**Form data in the descriptor.** Every object of `fields` (and only there — the fields of
`dependencyTabs` keep the smaller shape) carries `showInCreate`, `showInEdit`,
`requiredOnInput`, `sharded` and the optional `defaultValue`; the entity itself carries
`keyField: {name, autoGenerated}` (the `id` input is shown in Create only when the key is
not auto generated) and `forms: {create: {enabled}, edit: {enabled}}` (a copy of
`creatableByUser` / `updatableByUser`, so that a universal component can tell a disabled
form from an empty one).

`defaultValue` is the `defaultValueExpression` of the field **as data**: a JSON literal
(`''`, `0`, `true`, `'active'`, …), or `{kind: 'now'}` for `new Date()` and `Date.now()`;
a `bool` field without an expression gets `false`, as in the legacy template. A field with
no default has no `defaultValue` key at all. Any other expression is a generation error —
such an entity cannot use the descriptor mode. Note that `Date.now()` becomes a `Date` in
the form (not a number), and that `{kind: 'now'}` is evaluated when the form is opened,
while the legacy template evaluated `new Date()` once per chunk load.

**Validation** is not generated any more: the universal components build the yup schema at
runtime out of the same descriptor data (`type`, `category`, `requiredOnInput`,
`stringType`, `numberType`), and a project-specific schema can be plugged in through the
form slots.

**Not generated any more for such an entity** (and removed by the next `regen` if they
exist): `Default<Entity>List.tsx`, `Default<Entity>Filter.tsx`,
`Default<Entity>Show.tsx`, `DefaultMainTab.tsx`, `DefaultActions.tsx`,
`<Entity>Show/tabs/*`, `Default<Entity>Create.tsx`, `Default<Entity>Edit.tsx` and
`get<Entity>Validation.tsx`. The `[once]` stubs (`<Entity>Filter.tsx`,
`<Entity>ListBreadcrumbs.tsx`, `MainTab.tsx`, `additionalTabs.tsx`, and the four
`index.tsx`) are never deleted by runlify — move their content into `<Entity>Slots.tsx` and
remove them manually. In particular, turning `creatableByUser` / `updatableByUser` off
after the migration leaves the corresponding `index.tsx` behind as an orphan: the route
already renders `NotFound`, but the file has to be deleted by hand.

**Requirements of the UI project.** The mode expects `src/uiLib/entityPages/` with the
universal `EntityList` / `EntityShow` / `EntityCreate` / `EntityEdit` components and the
slots type. Without them the generated pages will not compile — a project that does not
have them should stay on `legacy`.

**Adding or removing `<Entity>Slots.tsx` requires a `regen`:** the import is written
into the descriptor at generation time, based on the existence of the file.

**Going back to `legacy`:** remove `setUiPagesMode('descriptor')` from the meta and run
`regen` — the `Default*` files, `tabs/*` and `get<Entity>Validation.tsx` are generated
again and `<Entity>Descriptor.ts` is removed. All four `index.tsx` are `[once]` and are
**not** overwritten: delete them before the regen so that the legacy ones are created.

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

### `PermissionPage.tsx` / `NotFoundPage.tsx` — once {#permission-fallbacks}

Fallback components rendered instead of a page's real content. Both re-export a
react-admin built-in by default and are safe to replace. See
[11-permissions.md](./11-permissions.md#fallback-components) for when each one is used.

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

## i18n {#i18n}

Entity/field-derived translation files (`<lang>Catalogs.ts`, `<lang>Docs.ts`,
`<lang>InfoRegistries.ts`, `<lang>SumRegistries.ts`, `<lang>Reports.ts`) are `[gen]` —
fully generated from entity titles and field titles defined in the meta. To change one
of these translations:

1. Update the title in `metadata.ts`: `entity.setTitle({ singular: 'Order', plural: 'Orders' }, 'en')`
2. Run `regen`

Three other files exist per project/language and are `[once]` — created only if
missing, then yours to edit freely:

| File | Scope | Purpose |
|------|-------|---------|
| `i18n/types.ts` | One per project | The `ValidationMessages` type — add fields here as you add validation messages |
| `i18n/<lang>/<lang>Validation.ts` | One per language | Validation message strings, typed by `ValidationMessages` |
| `i18n/<lang>/index.ts` | One per language | Assembles all of the above into the object `i18nProvider` imports; the place to add any translation key that isn't derived from an entity/field (UI labels, error messages, etc.) |

`i18n/<lang>/index.ts` is what `environment/src/i18nProvider/index.ts` (`[gen]`)
actually imports — it merges the entity-derived generated files, `<lang>Validation.ts`,
and falls back to `ra-language-english` for anything not overridden. Since it's created
once, it's safe to add project-specific keys directly into it.

**Anti-pattern — editing an entity/field-derived translation file directly:**

Editing `<lang>Catalogs.ts`, `<lang>Docs.ts`, or any other `[gen]` lang file is
pointless — changes are overwritten on regen. Add custom keys to `i18n/<lang>/index.ts`
instead.

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

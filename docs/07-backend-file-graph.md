# Backend File Graph (`<prefix>-back`)

> **Load this file when:** you need to find a specific file in the generated backend,
> understand which files are safe to edit, or know what gets regenerated.
>
> Legend: `[gen]` = regenerated every `regen` (DO NOT EDIT) · `[yours]` = created once,
> yours to implement · `[once]` = created once by Runlify, rarely needs changes
>
> Related: [01-overview.md](./01-overview.md) · [08-frontend-file-graph.md](./08-frontend-file-graph.md)

---

## Full tree

```
<prefix>-back/
│
├── src/
│   │
│   ├── config/
│   │   └── config.ts                          [gen]  Runtime config loader (reads env JSON)
│   │
│   ├── adm/
│   │   │
│   │   ├── graph/
│   │   │   ├── permissionsToGraphql.ts        [gen]  Permission → GraphQL mapping
│   │   │   ├── additionalResolvers.ts         [gen]  Wires additional service resolvers
│   │   │   ├── additionalTypes.ts             [gen]  Additional GraphQL type definitions
│   │   │   │
│   │   │   └── <EntityName>/                  [gen]  Per-entity GraphQL folder
│   │   │       ├── resolvers.ts               [gen]  CRUD resolvers
│   │   │       ├── types.ts                   [gen]  GraphQL type definitions
│   │   │       └── permissionsToGraphql.ts    [gen]  Entity permission mappings
│   │   │
│   │   └── services/
│   │       └── <EntityName>Service/           One folder per entity
│   │           │
│   │           ├── <EntityName>Service.ts     [gen]  Base service class — DO NOT EDIT
│   │           ├── Additional<Entity>Service.ts [yours] Your custom methods + overrides
│   │           ├── config.ts                  [gen]  Service configuration
│   │           ├── initBuiltInHooks.ts        [gen]  Wires built-in framework hooks
│   │           ├── initUserHooks.ts           [yours] Wire your custom hooks here
│   │           │
│   │           └── hooks/
│   │               ├── beforeCreate.ts        [yours] Runs before INSERT
│   │               ├── afterCreate.ts         [yours] Runs after INSERT
│   │               ├── beforeUpdate.ts        [yours] Runs before UPDATE
│   │               ├── afterUpdate.ts         [yours] Runs after UPDATE
│   │               ├── beforeDelete.ts        [yours] Runs before DELETE
│   │               ├── afterDelete.ts         [yours] Runs after DELETE
│   │               ├── beforeUpsert.ts        [yours] Runs before UPSERT
│   │               ├── additionalOperationsOnCreate.ts  [yours] Side-effects after create
│   │               ├── additionalOperationsOnUpdate.ts  [yours] Side-effects after update
│   │               ├── additionalOperationsOnDelete.ts  [yours] Side-effects after delete
│   │               ├── changeListFilter.ts    [yours] Mutate the list query filter at runtime
│   │               └── tenantIdRequiredHooks.ts [yours] Tenant isolation (only if multitenancy enabled)
│   │
│   ├── clients/
│   │   ├── createPgPrismaClient.ts            [gen]  Prisma client factory
│   │   └── getPrisma.ts                       [gen]  Prisma client getter (per DB)
│   │
│   ├── rest/
│   │   └── restRouter.ts                      [once] Custom REST endpoints (yours)
│   │
│   ├── enums/
│   │   ├── enums.ts                           [gen]  All entity name enums
│   │   ├── devEnums.ts                        [gen]  Dev-only enums
│   │   └── initEntities.ts                    [gen]  Entity registry initialisation
│   │
│   └── index.ts                               [gen]  Application entry point
│
├── prisma/
│   └── schema.<dbName>.prisma                 [gen]  Prisma schema (one per database)
│
├── config/
│   ├── dev.json                               [gen]  Dev environment config (values from meta)
│   └── prod.json                              [gen]  Prod environment config (values from meta)
│
├── docs/
│   ├── spec.md                                [gen]  Auto-generated project specification
│   ├── configuration.md                       [gen]  Config vars documentation
│   └── entities/
│       └── <EntityName>.md                    [gen]  Per-entity documentation
│
├── Dockerfile                                 [gen]  Backend Docker image
├── .gitlab-ci.yml                             [gen]  GitLab CI pipeline
│
└── chart/                                     Helm chart for Kubernetes
    ├── Chart.yaml                             [gen]
    ├── values.yaml                            [gen]
    └── templates/
        ├── back.yaml                          [gen]  Deployment manifest
        └── ingress.yaml                       [gen]  Ingress manifest
```

---

## Per-entity service: what to edit and what not to

### `<EntityName>Service.ts` — DO NOT EDIT {#entity-service-generated}

Generated on every `regen`. Contains:
- Standard CRUD operations (`getAll`, `getById`, `create`, `update`, `delete`)
- Prisma query building, filter application, sorting, pagination
- Hook invocation calls (calls into `initUserHooks.ts`)

### `Additional<EntityName>Service.ts` — yours {#additional-service}

Created once. Never overwritten. This is where you add:
- Custom methods that are too complex for the standard service
- Business logic that wraps or extends generated CRUD
- Helper methods used by hooks

### `hooks/` — yours {#hooks}

All hook files are created once and never overwritten.

| Hook file | When called | Common uses |
|-----------|------------|-------------|
| `beforeCreate.ts` | Before DB INSERT | Validate, enrich input, set computed fields |
| `afterCreate.ts` | After DB INSERT | Send notifications, trigger side effects |
| `beforeUpdate.ts` | Before DB UPDATE | Validate new state, check transitions |
| `afterUpdate.ts` | After DB UPDATE | Sync caches, publish events |
| `beforeDelete.ts` | Before DB DELETE | Check dependencies, soft-delete fallback |
| `afterDelete.ts` | After DB DELETE | Clean up related data |
| `beforeUpsert.ts` | Before UPSERT | |
| `additionalOperationsOnCreate.ts` | After create, separate tx context | Audit log, async tasks |
| `additionalOperationsOnUpdate.ts` | After update, separate tx context | |
| `additionalOperationsOnDelete.ts` | After delete, separate tx context | |
| `changeListFilter.ts` | On every list query | Inject runtime filters (tenant, user scope) |
| `tenantIdRequiredHooks.ts` | On create (multitenancy only) | Ensure `tenantId` is set from user context |

### `initUserHooks.ts` — yours {#init-user-hooks}

Registers your hook implementations with the framework. Created once.
When you implement a hook, register it here.

### `initBuiltInHooks.ts` — DO NOT EDIT {#init-built-in-hooks}

Generated. Registers framework-level hooks (audit logging, search index sync, etc.).

---

## Prisma schema

One `.prisma` file per registered database:
- `schema.main.prisma` — always generated
- `schema.<name>.prisma` — generated for each additional database registered via
  `system.addDatabase(name)`

The schema is fully generated. **Do not edit it** — all model definitions come from
the meta. Schema changes go in the meta, not in the `.prisma` file.

**Anti-pattern — editing the Prisma schema directly:**

```
// WRONG: you add a column directly to schema.main.prisma
model Order {
  id     Int    @id @default(autoincrement())
  myField String  // <-- added manually
}
```

After the next `regen`, `myField` is gone.

**Correct:** add the field in `metadata.ts` via `entity.addField('myField')`, then regen.

---

## Config files (`config/`)

`dev.json` and `prod.json` are generated from the config vars defined in `metadata.ts`.
They contain placeholder / default values.

**Do not commit secrets** to these files. They are intended as value templates.
Actual secret values should be injected from CI/CD environment variables, not from these
files.

---

## Anti-patterns

### Adding custom logic to `<EntityName>Service.ts`

**Wrong:** editing the generated service file directly.

**Why:** overwritten on every `regen`. Your changes are lost.

**Correct:** use `Additional<EntityName>Service.ts` for custom logic or `hooks/` for
lifecycle interception.

---

### Creating custom hooks outside the `hooks/` directory

**Wrong:** adding a `customHook.ts` file inside `<EntityName>Service/` and calling it
directly from `Additional<EntityName>Service.ts`.

**Why:** works, but bypasses the hook registration system. Framework hooks (audit,
search) won't compose correctly with custom hooks unless they go through `initUserHooks`.

**Correct:** implement hooks in the designated `hooks/` files and register them in
`initUserHooks.ts`.

---

### Modifying `initBuiltInHooks.ts`

**Wrong:** editing the generated file to remove audit logging or search sync hooks.

**Why:** the file is regenerated. Your changes are lost.

**Correct:** if you need to suppress a built-in hook, do it via the meta (e.g.
`entity.setAuditable(false)` to disable audit logging).

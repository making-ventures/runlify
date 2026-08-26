# Overview & Mental Model

> **Load this file when:** you need to understand how Runlify works end-to-end,
> or when you need to orient yourself in a Runlify-powered project for the first time.

---

## What Runlify is

Runlify is a **metadata-driven full-stack code generator**. A consumer describes their
system declaratively using a fluent builder API (`SystemMetaBuilder`). Runlify generates
two complete sibling projects from that description plus all deployment infrastructure.

```
meta-project/                  ← you own this
  src/meta/metadata.ts         ← SystemMetaBuilder DSL — the source of truth
  src/meta/options.json        ← BootstrapEntityOptions — generation switches

        runlify regen
              │
     ┌────────┴────────┐
     ▼                 ▼
<prefix>-back/     <prefix>-ui/
NestJS/Prisma      react-admin
GraphQL            TypeScript/React
```

The meta project is **not deployed**. It is a build tool. The two generated projects are
what actually runs in production.

---

## Data flow

```
SystemMetaBuilder
  .addCatalog(...)
  .addDocument(...)
  .addMethod(...)
  .build()                     ← produces a System object

System  ──serialize──▶  src/meta/metadata.json
BootstrapEntityOptions  ──▶  src/meta/options.json

runlify regen
  │
  ├─ reads metadata.json + options.json
  ├─ prepareProjectWideGenerationArgs()   ← resolves links, normalises DBs
  ├─ cleanFiles()                         ← wipes previous generated output
  ├─ generateBack()  [typesOnly pass]     ← generates TS types first
  ├─ genGraphSchemesByLocalGenerator()    ← generates .graphql schema files
  ├─ generateBack()  [full pass]          ← full backend generation
  ├─ generateFront()                      ← frontend generation (if enabled)
  └─ generateEnvironment()               ← Dockerfile, CI, Helm charts
```

---

## Two classes of files

Every file in the generated projects is one of two classes.

### Generated files — DO NOT EDIT

Written by Runlify on **every** `regen`. First line is always:

```
// DO NOT EDIT! THIS IS GENERATED FILE
```

Editing these files is pointless — changes are lost on the next regen.

Examples: `<Entity>Service.ts`, GraphQL resolvers, Prisma schema, `resources.tsx`,
`routes.tsx`, `<Entity>List/index.tsx`.

### Your files — safe to edit

Created by Runlify **once** (on first regen) then never touched again.
These are your extension points.

**Backend:**
| File | Purpose |
|------|---------|
| `Additional<Entity>Service.ts` | Add methods, override behaviour |
| `hooks/beforeCreate.ts` | Run logic before DB insert |
| `hooks/afterCreate.ts` | Run logic after DB insert |
| `hooks/beforeUpdate.ts` | Run logic before DB update |
| `hooks/afterUpdate.ts` | Run logic after DB update |
| `hooks/beforeDelete.ts` | Run logic before DB delete |
| `hooks/afterDelete.ts` | Run logic after DB delete |
| `hooks/beforeUpsert.ts` | Run logic before upsert |
| `hooks/additionalOperationsOnCreate.ts` | Side-effects on create |
| `hooks/additionalOperationsOnUpdate.ts` | Side-effects on update |
| `hooks/additionalOperationsOnDelete.ts` | Side-effects on delete |
| `hooks/changeListFilter.ts` | Mutate list query filter at runtime |
| `hooks/tenantIdRequiredHooks.ts` | Tenant isolation enforcement |
| `rest/restRouter.ts` | Custom REST endpoints |
| `init/roles/customPermissions.ts` | Hand-written data-space permissions — see [11-permissions.md](./11-permissions.md) |
| `init/roles/customUiPermissions.ts` | Hand-written UI-space permissions — see [11-permissions.md](./11-permissions.md) |

**Frontend:**
| File | Purpose |
|------|---------|
| `Dashboard.tsx` | Home page content |
| `additionalRoutes.tsx` | Custom pages/routes |
| `getAdditionalMenu.ts` | Extra menu items |
| `PermissionPage.tsx` | Shown instead of a page the user lacks permission for |
| `NotFoundPage.tsx` | Shown for an action that doesn't exist on the entity (e.g. no edit form) |
| `i18n/types.ts`, `i18n/<lang>/<lang>Validation.ts`, `i18n/<lang>/index.ts` | Validation messages and the per-language translation root — see [08-frontend-file-graph.md](./08-frontend-file-graph.md#i18n) |

See [11-permissions.md](./11-permissions.md) for access control — a separate system from
these "yours" files, spanning both projects.

Full file trees: [07-backend-file-graph.md](./07-backend-file-graph.md) and
[08-frontend-file-graph.md](./08-frontend-file-graph.md).

---

## What gets generated

| Area | Technology | Docs |
|------|-----------|------|
| ORM / DB schema | Prisma (v6/v7) | [07-backend-file-graph.md](./07-backend-file-graph.md) |
| API layer | GraphQL (Apollo) | [07-backend-file-graph.md](./07-backend-file-graph.md) |
| Admin UI | react-admin | [08-frontend-file-graph.md](./08-frontend-file-graph.md) |
| Config | JSON env files | [09-options.md](./09-options.md) |
| CI/CD | GitLab CI `.yml` | [09-options.md](./09-options.md) |
| Containers | Dockerfile | [09-options.md](./09-options.md) |
| Kubernetes | Helm charts | [09-options.md](./09-options.md) |

---

## Output paths

By default `regen` resolves sibling directories relative to the meta project:

```
../  ← parent of the meta project
  <prefix>-back/    ← detachedBackProject
  <prefix>-ui/      ← detachedUiProject
  <meta-project>/
```

Both paths are overridable via `detachedBackProject` and `detachedUiProject` in
`options.json`. See [09-options.md](./09-options.md).

---

## Anti-patterns

### Editing generated files

**Wrong:** opening `<Entity>Service.ts` and adding a method directly.

**Why:** the file is overwritten completely on every `runlify regen`. Your changes vanish
with no warning.

**Correct:** put all custom logic in `Additional<Entity>Service.ts` or the appropriate
`hooks/` file.

---

### Putting business logic in `metadata.ts`

**Wrong:** computing values, calling APIs, or reading environment variables inside the
`SystemMetaBuilder` chain.

**Why:** `metadata.ts` is a build-time description. It must be pure and deterministic.
Side effects here cause unpredictable generation output.

**Correct:** keep `metadata.ts` as a plain declarative description of the domain.
All runtime logic goes into the generated project.

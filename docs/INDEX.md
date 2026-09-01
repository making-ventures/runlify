# Runlify Documentation

> Written for **consumers** of Runlify — projects that already use it.
> Primary audience: AI agents. Secondary: human developers.
>
> Each file in this documentation is **self-contained** for its topic.
> Load only the file relevant to your current task.

---

## Table of Contents

| # | File | Topic |
|---|------|-------|
| 1 | [01-overview.md](./01-overview.md) | Mental model, data flow, two classes of files (generated vs yours) |
| 2 | [02-system-meta-builder.md](./02-system-meta-builder.md) | All top-level methods on `SystemMetaBuilder` |
| 3 | [03-entity-types.md](./03-entity-types.md) | `Catalog`, `Document`, `InfoRegistry`, `SumRegistry`, `Report` — when to use each |
| 4 | [04-fields.md](./04-fields.md) | All field builders, scalar types, filters, indexes, constraints |
| 5 | [05-custom-methods.md](./05-custom-methods.md) | `MethodBuilder`, Input/Output models, workers, cron schedules |
| 6 | [06-storage.md](./06-storage.md) | `StorageType` options: Postgres, ClickHouse, Elasticsearch |
| 7 | [07-backend-file-graph.md](./07-backend-file-graph.md) | Annotated file tree for `<prefix>-back` |
| 8 | [08-frontend-file-graph.md](./08-frontend-file-graph.md) | Annotated file tree for `<prefix>-ui` |
| 9 | [09-options.md](./09-options.md) | All `BootstrapEntityOptions` flags with defaults |
| 10 | [10-modules.md](./10-modules.md) | Built-in modules, how to write your own |
| 11 | [11-permissions.md](./11-permissions.md) | Data-space vs UI-space permissions, where each is checked, how they're seeded |

---

## Quick orientation

```
meta-project/
  src/meta/metadata.ts     ← you write this (SystemMetaBuilder DSL)
  src/meta/options.json    ← generation options (BootstrapEntityOptions)

runlify regen              ← regenerates everything from the meta

<prefix>-back/             ← generated NestJS/Prisma/GraphQL backend
<prefix>-ui/               ← generated react-admin frontend
```

The meta project **describes** the system. Runlify **generates** the implementation.
Business logic lives only in files Runlify creates once and never overwrites.

---

## Two classes of files

| Class | Owner | Overwritten on `regen`? | Marker |
|-------|-------|------------------------|--------|
| **Generated** (`[gen]`) | Runlify | **Yes — every run** | `DO NOT EDIT! THIS IS GENERATED FILE` at top |
| **Yours** (`[yours]` / `[once]`) | Developer | No — created only if missing | Most have no marker; some (e.g. `PermissionPage.tsx`, `i18n/<lang>/index.ts`) have a short `Generated once, not overwritten on next generation. Edit freely.` note instead |

Yours files: `Additional<Entity>Service.ts`, `hooks/*`, `additionalRoutes.tsx`,
`Dashboard.tsx`, `getAdditionalMenu.ts`, `restRouter.ts`, `PermissionPage.tsx`,
`NotFoundPage.tsx`, `customPermissions.ts`, `customUiPermissions.ts`, and others.
See [07-backend-file-graph.md](./07-backend-file-graph.md) and [08-frontend-file-graph.md](./08-frontend-file-graph.md) for the full list.

---

## Features not covered in this documentation

The following exist in Runlify but are intentionally omitted here — they are used
selectively and vary significantly per project. Refer to the Runlify source at
`src/projectsGeneration/builders/` and `src/commands/` for details.

- **Workers** — `addWorker()` on `SystemMetaBuilder`
- **Telegram Bots** — `addTelegramBot()` on `SystemMetaBuilder`
- **Integration Clients** — `addIntegrationClient()` on `SystemMetaBuilder`
- **Cloud CLI** — `login`, `pullEnvs`, `runlify start` commands

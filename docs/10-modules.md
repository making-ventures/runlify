# Modules

> **Load this file when:** you need to use a built-in module, understand what
> `addCommonEntities` adds to the system, or write a reusable module function.
>
> Related: [02-system-meta-builder.md](./02-system-meta-builder.md) ·
> [03-entity-types.md](./03-entity-types.md)

---

## What a module is

A module is a plain function with the signature:

```ts
(system: SystemMetaBuilder) => void
```

It calls `system.addCatalog`, `system.addDocument`, `system.addConfigVar`, etc. to
register a bundle of related entities and config in one call. There is no special
registration mechanism — a module is just a function you call.

---

## `addCommonEntities(system)` {#addCommonEntities}

Source: `src/projectsGeneration/commonEntities/addCommonEntities.ts`
Import: `import { addCommonEntities } from 'runlify'`

The standard foundation layer. Adds all infrastructure entities required by the
framework itself. Most meta projects call this once near the top of `metadata.ts`.

### What it adds

| Entity | Type | Purpose |
|--------|------|---------|
| `languages` | Catalog | Supported UI languages |
| `tenants` | Catalog | Tenants (only used when `tenantsAvailable=true`) |
| `managers` | Catalog | Admin users |
| `users` | Catalog | End users |
| `auditLogs` | Catalog | Change history records |
| `roles` | Catalog | Access roles |
| `refreshTokens` | Catalog | JWT refresh token storage |
| `autogeneration` | Catalog | Code generation tracking |
| `aggregateTrackings` | Catalog | External search sync tracking |

Plus:
- Email module entities (see [`addEmailModuleEntities`](#addEmailModuleEntities))
- Configuration variable entities (`configurationVariables` — stores runtime config in DB)
- Standard system CLI commands

**Anti-pattern — calling `addCommonEntities` after adding your own entities:**

The common entities use fixed names. If you add a catalog named `users` or `roles`
before calling `addCommonEntities`, the call throws (duplicate entity name).

**Correct:** always call `addCommonEntities(system)` **before** adding your domain
entities.

---

## `addEmailModuleEntities(system)` {#addEmailModuleEntities}

Source: `src/projectsGeneration/modules/addEmailModuleEntities.ts`
Import: `import { addEmailModuleEntities } from 'runlify'` (also called by `addCommonEntities`)

Adds all entities required for the email / notification system.

### What it adds

| Entity | Type | Purpose |
|--------|------|---------|
| `messageTypes` | Catalog | Message type registry (e.g. `plain`) |
| `templateStyles` | Catalog | HTML/CSS styles for email templates |
| `messageTemplates` | Catalog | Email template definitions |
| `mailingCampaignStatuses` | Catalog | Campaign lifecycle statuses |
| `mailingCampaigns` | Catalog | Mailing campaign records |
| `mailingMessages` | Catalog | Individual messages in a campaign |

Called automatically by `addCommonEntities`. Only call it directly if you are NOT using
`addCommonEntities` but still need the email module.

**Anti-pattern — calling `addEmailModuleEntities` twice:**

Called once by `addCommonEntities`. Calling it again throws duplicate entity name errors.

---

## Writing your own module {#custom-module}

A module is just a function. Convention: one file per module, function named `add<ModuleName>`.

```ts
// src/meta/modules/addOrderingModule.ts
import SystemMetaBuilder from 'runlify'

export const addOrderingModule = (system: SystemMetaBuilder) => {
  const orderStatuses = system.addCatalog('orderStatuses', { singular: 'Order status', plural: 'Order statuses' })
  orderStatuses.getKey().setType('string')
  orderStatuses.addField('title', undefined, { isTitleField: true }).setType('string').setRequired()
  orderStatuses.addPredefinedElements([
    { id: 'new', title: 'New' },
    { id: 'processing', title: 'Processing' },
    { id: 'completed', title: 'Completed' },
  ])

  const orders = system.addDocument('orders', { singular: 'Order', plural: 'Orders' })
  orders.addField('amount').setType('float').setRequired()
  orders.addLinkField(orderStatuses, 'statusId').setRequired()
}
```

Then in `metadata.ts`:

```ts
import { addOrderingModule } from './modules/addOrderingModule'

const system = new SystemMetaBuilder('myapp')
addCommonEntities(system)
addOrderingModule(system)
```

---

## Module composition rules

1. **Order matters.** Modules that reference entities from other modules must be called
   after those modules.
2. **No circular references.** Module A cannot reference entities that Module B adds, if
   Module B also references entities from Module A.
3. **Call `addCommonEntities` first** — it seeds `users`, `tenants`, `roles`, and other
   system entities that domain modules typically reference.

---

## Anti-patterns

### Defining a module that conditionally adds entities

**Wrong:**
```ts
export const addOrderingModule = (system: SystemMetaBuilder, withReturns: boolean) => {
  system.addDocument('orders')
  if (withReturns) {
    system.addDocument('returns')  // conditional entity
  }
}
```

**Why:** generates inconsistent meta across environments or team members. The system
description must be deterministic and environment-independent.

**Correct:** always include or always exclude. Use separate modules for separate
feature sets: `addOrderingModule` and `addOrderingWithReturnsModule`.

---

### Putting module logic inside `metadata.ts` directly

**Wrong:** writing 500 lines of entity definitions directly in `metadata.ts`.

**Why:** hard to maintain, hard to reuse across projects, impossible to test in isolation.

**Correct:** extract domain areas into module functions in `src/meta/modules/`.

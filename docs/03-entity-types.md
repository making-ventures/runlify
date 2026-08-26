# Entity Types

> **Load this file when:** you need to choose which entity type to use, understand
> what each type provides, or configure entity-level behaviour (deletable, auditable,
> multitenancy, storage, permissions, etc.).
>
> Related: [02-system-meta-builder.md](./02-system-meta-builder.md) ·
> [04-fields.md](./04-fields.md) · [06-storage.md](./06-storage.md)

---

## Choosing an entity type

| Type | Use when | Deletable by default | Auto-added fields |
|------|----------|---------------------|-------------------|
| `Catalog` | Reference / lookup data (statuses, categories, countries) | No | `id`, `search` |
| `Document` | Business transactions (orders, invoices, payments) | No | `id`, `date`, `search` |
| `InfoRegistry` | Accounting-style state snapshots (inventory levels, balances at a point in time) | No | `id`, + registrar fields if `registrarDepended=true` |
| `SumRegistry` | Accounting-style running totals (sum of amounts per dimension) | No | `id`, `date`, + registrar fields if `registrarDepended=true` |
| `Report` | Read-only report pages (no CRUD, no storage) | — | none |

All savable entity types (`Catalog`, `Document`, `InfoRegistry`, `SumRegistry`) inherit
from `BaseSavableEntityBuilder` and share the same core API described below.

---

## BaseSavableEntityBuilder — shared API

All methods below are available on every savable entity.

### Default state

| Property | Default |
|----------|---------|
| `deletable` | `false` |
| `editable` | `true` |
| `auditable` | `true` |
| `creatableByUser` | `true` |
| `updatableByUser` | `true` |
| `removableByUser` | `true` |
| `exportableByUser` | `true` |
| `searchEnabled` | `true` |
| `storage` | `POSTGRES` |
| `multitenancy` | `'none'` |
| `database` | `'main'` |
| `sortField` | `'id'` |
| `sortOrder` | `'DESC'` |

---

### Access control {#access-control}

#### `setCreatableByUser(value?: boolean): this`

Controls whether users can create records via the UI and GraphQL mutation.
Defaults to `true`.

#### `setUpdatableByUser(value?: boolean): this`

Controls whether users can update records. Defaults to `true`.

#### `setRemovableByUser(value?: boolean): this`

Controls whether users can delete records. Defaults to `true`.

**Anti-pattern — hiding entity from UI by setting `setNotUpdatableByUser` on every field:**

```ts
// WRONG: makes fields optional in generated types, conflicts with setRequired()
entity.addField('name').setRequired().setNotUpdatableByUser()
entity.addField('status').setRequired().setNotUpdatableByUser()
// ... repeat for every field

// CORRECT: disable at the entity level
entity
  .setCreatableByUser(false)
  .setUpdatableByUser(false)
  .setRemovableByUser(false)
```

`setNotUpdatableByUser()` on a field marks that field as **not required in update input
types**. When combined with `setRequired()`, the field is required in the DB but not in
the update GraphQL input — which is the correct semantic for immutable fields. Using it
globally to hide an entity from the UI is the wrong tool.

#### `setExportableByUser(value?: boolean): this`

Controls whether users can export records (e.g. to CSV). Defaults to `true`.

See [11-permissions.md](./11-permissions.md) for how access control actually works —
both the backend-enforced `<entity>.<action>` permissions and the frontend-only
`ui.<entity>.list` permission.

---

### Deletion and editing {#deletion-and-editing}

#### `setDeletable(value?: boolean): this`

Allows physical deletion of records. Default `false` — most entities use soft-delete or
are not deletable at all.

#### `setEditable(value?: boolean): this`

Controls whether the edit UI form is shown. Default `true`.

---

### Auditing {#auditing}

#### `setAuditable(value?: boolean): this`

Enables audit logging (recording who created/updated/deleted records). Default `true`.

---

### Caching {#caching}

#### `setCacheable(value?: boolean): this`

Enables in-memory caching for this entity. Default `false`. Use for small, rarely
changing reference data (e.g. currencies, countries).

---

### Storage {#storage}

#### `setStorage(storage: StorageType): this`

Sets the storage engine. See [06-storage.md](./06-storage.md) for all options.

When set to an external-search storage, automatically:
- Forces `id` type to `string` with `cuid()` auto-generation
- Creates an `externalSearchTrackings` helper entity

#### `setDatabase(name: string): this`

Assigns this entity to a named database. Default `'main'`.
The database must be registered first via `system.addDatabase(name)`.
See [02-system-meta-builder.md#addDatabase](./02-system-meta-builder.md#addDatabase).

---

### Search {#search}

#### `setSearchEnabled(value?: boolean): this`

Enables/disables full-text search for this entity. Default `true` for Catalog/Document,
`false` for InfoRegistry.

---

### Sorting {#sorting}

#### `setSort(field: string, order?: 'ASC' | 'DESC'): this`

Sets the default sort order for list queries. The field must exist on the entity.
Default: `'id'`, `'DESC'`.

---

### Unique constraints & indexes {#constraints-and-indexes}

#### `addUniqueConstraint(fields: string[]): this`

Adds a multi-column unique constraint. All field names must exist on the entity.

#### `addIndex({ fields, type }: Index): this`

Adds a database index.

| `type` | `IndexType` value | Notes |
|--------|------------------|-------|
| BTree | `IndexType.BTree` | Default; supports multi-column |
| Hash | `IndexType.Hash` | Single-column only |
| GIN | `IndexType.Gin` | For full-text / array search |

**Anti-pattern — multi-column Hash index:**

```ts
// WRONG: throws at build() time
entity.addIndex({ fields: ['statusId', 'date'], type: IndexType.Hash })

// CORRECT: use BTree for multi-column
entity.addIndex({ fields: ['statusId', 'date'], type: IndexType.BTree })
```

---

### Multitenancy {#multitenancy}

#### `setMultitenancy(multitenancy, commonElementsVisibleToAll?): this`

| Value | Behaviour |
|-------|-----------|
| `'none'` | No tenant isolation (default) |
| `'optional'` | Records may belong to a tenant or be global. Pass `commonElementsVisibleToAll` to control whether global records are visible to all tenants |
| `'required'` | Every record must belong to a tenant. `tenantId` is auto-populated from the current user's profile |

Automatically adds a `tenantId` link field to `tenants` entity when `!== 'none'`.

**Anti-pattern — `commonElementsVisibleToAll` with non-optional multitenancy:**

```ts
// WRONG: throws at build() time
entity.setMultitenancy('required', true)

// CORRECT: commonElementsVisibleToAll is only valid for 'optional'
entity.setMultitenancy('optional', true)
```

---

### Predefined data {#predefined-data}

```ts
addPredefinedElements(rows: Record<string, any>[])   // seeds data in all environments
setPredefinedElements(rows: Record<string, any>[])   // replaces (not appends) seed data
addDevPredefinedElements(rows: Record<string, any>[]) // seeds data in dev environment only
setDevPredefinedElements(rows: Record<string, any>[])
```

---

### Data cleanup {#data-cleanup}

#### `setClearDBAfter(count: number, unit: DateUnit): this`

Automatically deletes records older than `count` `unit`s.

`DateUnit` values: `'year' | 'month' | 'day' | 'hour' | 'minute'`

---

### UI / menu {#ui-menu}

#### `setExcludeFromCommonMenu(exclude?: boolean): this`

Prevents this entity from appearing in the auto-generated sidebar menu. Default `false`.

#### `getForms(): FormsBuilder`

Returns the UI forms builder for customising list/show/create/edit form fields and
their display order. See [08-frontend-file-graph.md](./08-frontend-file-graph.md).

---

### Key field {#key-field}

#### `getKey(): IdFieldBuilder`

Returns the `id` field builder. Use to change the key type:

```ts
entity.getKey().setType('string')   // cuid() auto-generated string id
entity.getKey().setType('int')      // autoincrement integer
entity.getKey().setType('bigint')   // autoincrement bigint
```

Default type is `int` (autoincrement).

---

### Title field {#title-field}

#### `setTitleFieldByName(fieldName: string): this`

Sets which field is shown as the record's display name in dropdowns and relation fields.
Default is `id`. Usually set to a `name` or `title` scalar field.

---

### Fields {#fields}

All field methods are described in [04-fields.md](./04-fields.md).

```ts
addField(name, title?, options?)           // ScalarFieldBuilder
addLinkField(entity, name, title?)         // LinkFieldBuilder — name MUST end in 'Id'
addFileField(name, title?)                 // LinkFieldBuilder to 'files' (plain file)
addImageField(name, title?)                // LinkFieldBuilder to 'files' (image)
addViewLinkField(entity, name, title?)     // ViewLinkFieldBuilder (read-only join)
delField(name)                             // removes a field
getFiled(name)                             // returns a field builder or throws
getFieldIfExist(name)                      // returns a field builder or undefined
getLinkFileds()                            // returns all LinkFieldBuilders
```

---

### Custom methods & models on an entity {#entity-methods}

Entities can have their own custom GraphQL operations in addition to the standard CRUD.

```ts
entity.addMethod(name, methodType, title?)         // MethodType.Query | Mutation
entity.createGeneralModel(name, title?)            // model for input or output
entity.createInputModel(name, title?)              // input-only model
entity.createOutputModel(name, title?)             // output-only model
```

See [05-custom-methods.md](./05-custom-methods.md).

---

## Catalog {#catalog}

Created via `system.addCatalog(name, title?, options?)`.

**Additional auto-added fields:** `search` (hidden, string, not updatable by user).

**Additional properties:**

| Property | Default | Setter |
|----------|---------|--------|
| `deletable` | `false` | `setDeletable()` |
| `editable` | `true` | `setEditable()` |

Use for: statuses, categories, countries, currencies, units of measure, any lookup table.

---

## Document {#document}

Created via `system.addDocument(name, title?, options?)`.

**Additional auto-added fields:** `date` (datetime, required, defaults to `new Date()`)
and `search` (hidden string).

**Additional methods:**

#### `addRegistry(registryName: string)`

Links this document to an InfoRegistry or SumRegistry that it drives.
`registryName` is the name of the registry entity.

#### `setSharded(value?: boolean): this`

When `true`, additionally adds hidden fields `repostRequired` (bool, default `true`) and
`deleteRequired` (bool, default `false`) used for sharded accounting workflows.

Use for: orders, invoices, payments, events, anything that represents a business
transaction at a point in time.

---

## InfoRegistry {#inforegistry}

Created via `system.addInfoRegistry(name, registrarDepended, title?, options?)`.

An information register stores **state snapshots** — the value of something at a
specific moment. Think of it as a time-series table of dimension→resource pairs.

**Search disabled by default.**

**When `registrarDepended = true`**, auto-adds:
- `registrarTypeId` (string link to `entities`)
- `registrarId` (int or string, configurable via `RegistryOptions.registrarIdType`)
- `row` (int, default `1`)
- Unique constraint on `[registrarTypeId, registrarId, row]`

**Dimension vs Resource:**

| Role | Meaning | Methods |
|------|---------|---------|
| **Dimension** | What you're measuring (product, warehouse, account) | `addDimension`, `addDimensionLinkField`, `addDimensionViewLinkField` |
| **Resource** | The value being stored (quantity, amount, flag) | `addResource`, `addResourceLinkField`, `addResourceViewLinkField` |

Auto-generated unique constraint: all dimension field names combined.

#### `setPeriod(period: InfoRegistryPeriod): this`

| Value | Auto-added field |
|-------|-----------------|
| `'notPeriodic'` | none |
| `'second'` | `date` (datetime) |
| `'day'` | `date` (date) |
| `'month'` | `date` (date) |
| `'year'` | `date` (date) |

#### `delDimension(name) / delResource(name)`

Removes a dimension or resource field.

---

## SumRegistry {#sumregistry}

Created via `system.addSumRegistry(name, registrarDepended, title?, options?)`.

A totals register stores **running aggregated sums** across dimensions. Think of it as
a materialized aggregate table.

`RegistryOptions`:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `registrarIdType` | `'int' \| 'string'` | `'int'` | Type of the `registrarId` field |
| `sharded` | `boolean` | `undefined` | Use `ViewLinkField` instead of `LinkField` for `registrarTypeId` |

**When `registrarDepended = true`**, auto-adds:
- `date` (datetime, required)
- `registrarTypeId` (string link/view-link to `entities`)
- `registrarId` (int or string)
- `row` (int, default `1`)
- Unique constraint on `[registrarTypeId, registrarId, row]`
- **Also sets `creatableByUser(false)`, `updatableByUser(false)`, `removableByUser(false)`**

Same dimension/resource API as `InfoRegistry`.

---

## Report {#report}

Created via `system.addReport(name, title?, options?)`.

A report is a **read-only UI page** with no storage, no CRUD GraphQL, and no Prisma
model. It generates a page and a `read` permission automatically — see
[11-permissions.md](./11-permissions.md) for how permissions are structured and enforced.

Reports do not inherit from `BaseSavableEntityBuilder` — they have no fields, no
methods, and no storage configuration.

Use for: dashboards, custom analytics pages, external data views.

---

## Anti-patterns

### Using `Document` for reference data

**Wrong:** creating a `Document` to store countries or categories.

**Why:** Documents auto-add a `date` field and are designed for transactions. Reference
data has no meaningful transaction date.

**Correct:** use `Catalog` for lookup / reference data.

---

### Using `Catalog` for transactional data

**Wrong:** creating a `Catalog` to store orders.

**Why:** Catalogs have no `date` field, no registry linking, and no sharding support
designed for transactions.

**Correct:** use `Document` for transactional entities.

---

### Forgetting `system.addDatabase()` before `setDatabase()`

**Wrong:**
```ts
const orders = system.addDocument('orders')
orders.setDatabase('archive')  // throws at build(): 'archive' is not registered
```

**Correct:**
```ts
system.addDatabase('archive')
const orders = system.addDocument('orders')
orders.setDatabase('archive')
```

---

> **Examples:** this file intentionally omits code examples. Add real usage examples
> from the consuming project here. A reference metadata file is typically at
> `src/meta/metadata.ts` in the meta project.

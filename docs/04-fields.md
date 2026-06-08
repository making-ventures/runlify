# Fields

> **Load this file when:** you need to add or configure fields on an entity — scalar
> fields, link fields, file/image fields, view-link fields, or the id field. Also covers
> filters, display visibility, required/optional semantics, and indexes.
>
> Related: [03-entity-types.md](./03-entity-types.md) ·
> [02-system-meta-builder.md](./02-system-meta-builder.md)

---

## Field types overview

| Builder class | Created by | Used for |
|--------------|-----------|---------|
| `ScalarFieldBuilder` | `entity.addField()` | Primitive values: string, int, float, bool, datetime, date |
| `IdFieldBuilder` | auto (always `id`) | Primary key of an entity |
| `LinkFieldBuilder` | `entity.addLinkField()`, `addFileField()`, `addImageField()` | FK reference to another entity |
| `ViewLinkFieldBuilder` | `entity.addViewLinkField()` | Read-only join, not a real FK column |

---

## Scalar types (`FieldType`)

| Type | TypeScript | Prisma | Notes |
|------|-----------|--------|-------|
| `'string'` | `string` | `String` | Default. Use `setStringType()` to specialise |
| `'int'` | `number` | `Int` | |
| `'bigint'` | `bigint` | `BigInt` | |
| `'float'` | `number` | `Float` | |
| `'bool'` | `boolean` | `Boolean` | `searchable` set to `false` automatically |
| `'datetime'` | `Date` | `DateTime` | |
| `'date'` | `Date` | `DateTime` | Date only (no time component in UI) |

Default type for new fields created via `addField()` is `'int'`. Always call
`setType()` explicitly.

---

## String sub-types (`StringType`)

Set via `field.setStringType(StringType.X)`. Only valid when `type === 'string'`.

| Value | Effect | Notes |
|-------|--------|-------|
| `StringType.Plain` | Single-line text input | Default |
| `StringType.Number` | Number-formatted string | Displayed as number but stored as string |
| `StringType.Multiline` | Multi-line textarea | |
| `StringType.RichEdit` | WYSIWYG rich text editor | |
| `StringType.Markdown` | Markdown editor | Auto-sets `showInList=false`, `showInFilter=false` |
| `StringType.Json` | JSON editor | Auto-sets `showInList=false`, `showInFilter=false` |

---

## Number sub-types (`NumberType`)

Set via `field.setNumberType(NumberType.X)`. Only valid for `int`, `bigint`, `float`.

| Value | Effect |
|-------|--------|
| `NumberType.Base` | Plain number (default) |
| `NumberType.Money` | Formatted as monetary value in UI |

---

## BaseFieldBuilder — all methods

Available on every field type.

### Type & subtype

#### `setType(type: FieldType): this` {#setType}

Sets the scalar type. Validates that existing filters are compatible with the new type.
When set to `'bool'`, automatically sets `searchable = false`.

#### `setStringType(stringType: StringType): this` {#setStringType}

Only for `type === 'string'`. Throws otherwise.

#### `setNumberType(numberType: NumberType): this` {#setNumberType}

Only for `type === 'int' | 'bigint' | 'float'`. Throws otherwise.

---

### Required / optional semantics {#required}

#### `setRequired(value?: boolean): this`

Marks the field as required in the DB (`NOT NULL`) and in GraphQL input types.
Also sets `requiredOnInput = true` if it has not been set explicitly before.

#### `setNotRequired(): this`

Marks the field as optional (`NULL` allowed). Equivalent to `setRequired(false)`.

#### `setRequiredOnInput(value: boolean, defaultValueExpression?: string): this`

Controls whether the field is required in GraphQL **input types** independently of
whether it is required in the DB. Use when the field is required in the DB but has a
server-side default, so the client doesn't need to send it.

---

### Updatability {#updatability}

#### `setNotUpdatableByUser(defaultValueExpression?, defaultBackendValueExpression?): this` {#setNotUpdatableByUser}

Marks the field as **not updatable via user-facing GraphQL mutations**.
Internally calls `setRequiredOnInput(false, defaultValueExpression)`.

| Parameter | Description |
|-----------|-------------|
| `defaultValueExpression` | Frontend expression used as default value in create forms |
| `defaultBackendValueExpression` | Server-side expression evaluated on create/update |

**Anti-pattern — using `setNotUpdatableByUser` to make a field immutable when it is
also `setRequired()`:**

```ts
// WRONG: setNotUpdatableByUser sets requiredOnInput=false
// This means the field is optional in update input even though it is required in DB.
// For a create-only field that the server fills, this is CORRECT.
// For a field that the user MUST provide on create, use setRequiredOnInput explicitly:
field
  .setRequired()                    // required in DB
  .setNotUpdatableByUser()          // NOT in update mutations
  .setRequiredOnInput(true)         // required in CREATE mutation
```

**Anti-pattern — using `setNotUpdatableByUser` on every field to hide entity from UI:**

```ts
// WRONG: intended to make entity read-only, but breaks required/type semantics
entity.addField('name').setRequired().setNotUpdatableByUser()
entity.addField('code').setRequired().setNotUpdatableByUser()

// CORRECT: hide at entity level
entity.setCreatableByUser(false).setUpdatableByUser(false).setRemovableByUser(false)
```

See [03-entity-types.md#access-control](./03-entity-types.md#access-control).

#### `setUpdatableByUser(): this`

Reverses `setNotUpdatableByUser`. Marks field as editable by user again.

#### `setUpdatable(value?: boolean): this`

Controls whether the field appears in backend update operations at all (not just user-
facing). Lower-level than `setUpdatableByUser`.

---

### Visibility {#visibility}

All default to `true` except where noted.

| Method | Controls |
|--------|---------|
| `setShowInList(value?)` | Shown in entity list table |
| `setShowInFilter(value?)` | Shown in list filter panel |
| `setShowInCreate(value?)` | Shown in create form |
| `setShowInEdit(value?)` | Shown in edit form |
| `setShowInShow(value?)` | Shown in record detail view |
| `setHidden(value?)` | Hidden everywhere (UI + generated TS types) |
| `setSearchable(value?)` | Included in full-text search indexing |

`Markdown` and `Json` string types auto-set `showInList=false` and `showInFilter=false`.

---

### Default values {#defaults}

#### `setDefaultDbValue(value: string | boolean | undefined): this`

Sets the Prisma `@default(...)` value in the schema. This is a DB-level default.

#### `setDefaultValueExpression(value: string): this`

Sets the expression used on the **frontend** (create forms) and as the backend default
expression. Cannot be `'null'` or `'undefined'` — throws.

Also automatically calls `setDefaultBackendValueExpression(value)`.

#### `setDefaultBackendValueExpression(value: string): this`

Sets only the backend expression (TypeScript code evaluated during create/update).
Cannot be `'null'` or `'undefined'` — throws.

---

### Filters {#filters}

Default filter for all fields: `['equal']`.

#### `setFilters(filters: Filter[]): this`

Replaces the filter list entirely. Validates compatibility with the field type.

#### `addFilter(filter: Filter): this` / `addFilters(filters: Filter[]): this`

Adds one or more filters.

#### `delFilter(filter: Filter): this`

Removes a filter.

**Allowed filters per type:**

| Type | Allowed filters |
|------|----------------|
| `string` | `equal`, `defined`, `not_defined`, `in`, `not_in` |
| `int`, `bigint`, `float` | `equal`, `defined`, `not_defined`, `in`, `not_in`, `lte`, `gte`, `lt`, `gt` |
| `date`, `datetime` | `equal`, `defined`, `not_defined`, `lte`, `gte`, `lt`, `gt` |
| `bool` | `equal`, `defined`, `not_defined` |

**Anti-pattern — `in` / `not_in` on a scalar field:**

```ts
// WRONG: throws at build() time — 'in'/'not_in' only allowed on LinkFields
entity.addField('statusCode').setType('string').addFilter('in')

// CORRECT: 'in'/'not_in' is only valid on link fields
entity.addLinkField('statuses', 'statusId').addFilter('in')
```

---

### Other

#### `setTitle(title: string, language?: string): this`

Sets human-readable title for a language. Defaults to the system's default language.

#### `setTitles(titles: Record<string, string>): this`

Sets titles for multiple languages at once: `{ en: 'Name', ru: 'Имя' }`.

#### `setNeedFor(text: string): this`

Documents what this field is used for. Included in generated docs.

#### `setSharded(value?: boolean): this`

Marks this field as a sharding key. The field becomes part of the composite unique
constraint that groups records in a shard.

#### `setArray(value?: boolean): this`

Marks the field as an array type in GraphQL and TypeScript output types.

#### `setMeaning(meaning: 'img'): this`

Marks the field with a semantic meaning. Currently only `'img'` is supported — hints
the UI to render this string field as an image URL.

---

## IdFieldBuilder {#id-field}

Accessed via `entity.getKey()`. Auto-created as `id`.

#### `setType(type: TKeyFieldType): this`

| Value | Prisma | Auto-generation |
|-------|--------|----------------|
| `'int'` | `Int` | `@default(autoincrement())` — default |
| `'bigint'` | `BigInt` | `@default(autoincrement())` |
| `'string'` | `String` | `@default(cuid())` |

---

## LinkFieldBuilder {#link-field}

Created via `entity.addLinkField(entityNameOrBuilder, name, title?)`.

**Name MUST end in `Id`** — validated on construction. Throws immediately if violated.

```ts
entity.addLinkField('statuses', 'statusId')   // correct
entity.addLinkField('statuses', 'status')     // throws: must end in 'Id'
```

#### `setType(type: TKeyFieldType): this`

Sets the FK column type: `'int'` (default), `'bigint'`, or `'string'`.
When passing a `CatalogBuilder` instance to `addLinkField`, the type is inferred
automatically from the target entity's key type.

#### `setPredefinedLinkedEntity(value: 'none' | 'file'): this`

`'file'` — marks this field as linking to the built-in `files` catalog with special
file-upload UI treatment. Set automatically by `addFileField()` and `addImageField()`.

#### `setFileType(type: 'plain' | 'image'): this`

Only valid when `predefinedLinkedEntity === 'file'`. Throws otherwise.
Set automatically by `addImageField()` to `'image'`.

**Anti-pattern — using `addLinkField` for file/image fields:**

```ts
// WRONG: works but misses file-upload UI and correct type semantics
entity.addLinkField('files', 'avatarId')

// CORRECT: use the dedicated helpers
entity.addFileField('documentId')    // file upload UI
entity.addImageField('avatarId')     // image upload UI with preview
```

---

## ViewLinkFieldBuilder {#view-link-field}

Created via `entity.addViewLinkField(entityNameOrBuilder, name, title?)`.

A **read-only join** — does not create a real FK column in the database. Used to display
data from a related entity without storing a FK. The name must still end in `Id`.

Use for: displaying computed or external references that should not be part of the
entity's own schema.

---

## Convenience helpers on entity

```ts
entity.addFileField(name, title?)    // LinkField to 'files', predefined='file', fileType='plain'
entity.addImageField(name, title?)   // LinkField to 'files', predefined='file', fileType='image'
```

---

## Field name rules

Field names must match `/^[a-zA-Z0-9]+$/`. No underscores, hyphens, or special chars.
Validated on construction — throws immediately.

**Anti-pattern — underscores or special chars in field names:**

```ts
// WRONG: throws immediately
entity.addField('first_name')
entity.addField('first-name')
entity.addField('firstName!')

// CORRECT
entity.addField('firstName')
```

---

> **Examples:** this file intentionally omits code examples. Add real usage examples
> from the consuming project here. A reference metadata file is typically at
> `src/meta/metadata.ts` in the meta project.

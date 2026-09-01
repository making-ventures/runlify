# SystemMetaBuilder API

> **Load this file when:** you need to know what methods are available on the root
> `SystemMetaBuilder` instance — adding entities, config vars, roles, menus, pages,
> databases, deploy environments, or custom methods.
>
> Related: [03-entity-types.md](./03-entity-types.md) · [04-fields.md](./04-fields.md) ·
> [05-custom-methods.md](./05-custom-methods.md) · [09-options.md](./09-options.md)

---

## Constructor

```ts
new SystemMetaBuilder(prefix: string, defOpts?: BootstrapEntityOptions, defaultLanguage?: string)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prefix` | `string` | required | Project prefix, used as the base name for all generated artifacts |
| `defOpts` | `BootstrapEntityOptions` | `defaultBootstrapEntityOptions` | Generation options passed to every entity added. See [09-options.md](./09-options.md) |
| `defaultLanguage` | `string` | `'ru'` | Default language code for all titles and labels |

The constructor automatically:
- Seeds ~80 default config vars (DB, S3, JWT, Kafka, ES, ClickHouse, OIDC, Keycloak, recaptcha, Sentry, Loki)
- Creates two deploy environments: `dev` and `prod`
- Registers languages `en` and `ru`
- Adds the built-in `files` catalog via `initDefaultCatalogs()`

---

## Identity

### `setName(name: string): this`

Sets the system name (defaults to `prefix`). Used in generated docs and specs.

### `setPrefix(prefix: string): this`

Sets the project prefix. Affects generated project names and k8s chart names.

### `setNeedFor(needFor: string): this`

Human-readable description of what this system is for. Used in generated documentation.

---

## Entities

All `add*` entity methods throw if a name is already taken across **all** entity types.

### `addCatalog(name, title?, options?): CatalogBuilder` {#addCatalog}

Adds a reference data entity (lookup table).

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Unique entity name, `camelCase` |
| `title` | `{ singular?: string, plural?: string }` | Human-readable titles |
| `options` | `BootstrapEntityOptions` | Overrides default generation options for this entity |

Returns a `CatalogBuilder`. See [03-entity-types.md#catalog](./03-entity-types.md#catalog).

### `addDocument(name, title?, options?): DocumentBuilder` {#addDocument}

Adds a transactional document entity (e.g. orders, invoices).

Same signature as `addCatalog`. Returns a `DocumentBuilder`.
See [03-entity-types.md#document](./03-entity-types.md#document).

### `addInfoRegistry(name, registrarDepended, title?, options?): InfoRegistryBuilder` {#addInfoRegistry}

Adds an information register (accounting-style, stores state snapshots).

| Parameter | Type | Description |
|-----------|------|-------------|
| `registrarDepended` | `boolean` | If `true`, auto-adds `registrarTypeId`, `registrarId`, `row` fields + unique constraint |

See [03-entity-types.md#inforegistry](./03-entity-types.md#inforegistry).

### `addSumRegistry(name, registrarDepended, title?, options?): SumRegistryBuilder` {#addSumRegistry}

Adds a totals register (accounting-style, stores aggregated sums).

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `RegistryOptions` | `{ registrarIdType: 'int' \| 'string', sharded?: boolean }` |

See [03-entity-types.md#sumregistry](./03-entity-types.md#sumregistry).

### `addManyToManyRelation(name, title?, options?): CatalogBuilder`

Creates a junction catalog for a many-to-many relationship. Identical to `addCatalog`
internally — the name is semantic only, to signal intent.

### `addReport(name, title?, options?): ReportBuilder` {#addReport}

Adds a read-only report page. Automatically creates a page and a `read` permission.
See [03-entity-types.md#report](./03-entity-types.md#report).

---

## Lookups

```ts
getCatalogByName(name: string): CatalogBuilder      // throws if not found
getInfoRegistryByName(name: string): InfoRegistryBuilder
getSavableEntities(): EntityBuilderWithOptions[]     // catalogs + documents + infoRegistries + sumRegistries
getCatalogs(): EntityBuilderWithOptions[]
getDocuments(): EntityBuilderWithOptions[]
```

---

## Config Variables

Config vars define the runtime configuration schema for the generated application.
All config vars seeded in the constructor can be modified after construction.

### `addConfigVar(name, type, required, def, needFor, scopes?, hidden?, editable?): ConfigVarBuilder` {#addConfigVar}

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | required | Dot-notation key, e.g. `'database.main.write.uri'` |
| `type` | `FieldType` | required | `'string' \| 'int' \| 'bigint' \| 'float' \| 'bool' \| 'datetime' \| 'date'` |
| `required` | `boolean` | required | Whether the var must be set in every environment |
| `def` | `ConfigValue<T>` | required | Default value |
| `needFor` | `string` | required | Human description of what this var configures |
| `scopes` | `ConfigVarScope[]` | `['back','worker','telegramBot']` | Which services use this var |
| `hidden` | `boolean` | `false` | Hide from UI |
| `editable` | `boolean` | `true` | Allow editing in UI |

Returns a `ConfigVarBuilder` which supports further chaining:
- `.setRequired()` / `.setScopes(scopes)` / `.addScopes(scopes)` / `.delScopes(scopes)`
- `.setHidden()` / `.setEditable()` / `.setDefValue(value)`
- `.setSecure()` — shorthand for `.setHidden(true).setEditable(false)`. Use for secrets.

`ConfigVarScope` values: `'ci' | 'back' | 'admin-app' | 'cutomer-app' | 'worker' | 'telegramBot'`

### `delConfigVar(name: string): this`

Removes a config var by name. Useful for removing default vars seeded in the constructor.

### `getConfigVar(name: string): ConfigVarBuilder | undefined`

Returns the builder for an existing config var, or `undefined`.

### `getConfigVarRequired(name: string): ConfigVarBuilder`

Returns the builder or throws if not found. Use to modify default vars:

```ts
system.getConfigVarRequired('database.main.write.uri').setDefValue('postgresql://...')
```

**Anti-pattern — legacy methods:**

`setConfigVarDefaultValue(name, def)` and `setDefaultValueForConfigVar(name, def)` are
deprecated. They log a warning and delegate to `getConfigVarRequired(name).setDefValue(def)`.

**Correct:** always use `system.getConfigVarRequired(name).setDefValue(value)`.

---

## Databases

`main` is always registered. Additional databases must be registered before entities
reference them.

### `addDatabase(name: string): this` {#addDatabase}

Registers an additional named database. Automatically generates connection config vars
for the new database (`database.<name>.write.uri`, etc.).

**Anti-pattern — referencing an unregistered database:**

```ts
// WRONG: throws at build() time
const orders = system.addCatalog('orders')
orders.setDatabase('archive')  // 'archive' was never registered

// CORRECT
system.addDatabase('archive')
const orders = system.addCatalog('orders')
orders.setDatabase('archive')
```

### `getRegisteredDatabaseNames(): string[]`

Returns `['main', ...others]` sorted alphabetically.

---

## Roles

### `addRole(name: string, title?: string): RoleBuilder` {#addRole}

Defines an access role. Roles are referenced by permissions on entities.
Name must be unique across all entity names. See
[11-permissions.md](./11-permissions.md) for how permission strings are named and enforced.

---

## Deploy Environments

Two default environments (`dev`, `prod`) are seeded in the constructor.

### `addDeployEnvironment(env: DeployEnvironment): this`

Adds a new deploy environment. `DeployEnvironment` shape:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Environment name (`'staging'`, `'prod'`, etc.) |
| `main` | `boolean` | Is this the primary/production environment |
| `manualDeploy` | `boolean` | Requires manual trigger in CI |
| `clusterName` | `string` | Kubernetes cluster name |
| `workerClusterName` | `string` | Kubernetes cluster for workers |
| `branchName` | `string` | Git branch that triggers this environment |
| `metricsEnabled` | `boolean` | Enable metrics collection |
| `host` | `string` | Base domain for this environment |
| `runnerTag` | `string` | GitLab CI runner tag |
| `gitlabEnvPrefix` | `string` | Prefix for GitLab environment variables |

### `editDeployEnvironment(name: string, partial: Partial<DeployEnvironment>): this`

Modifies an existing environment. Use to override the defaults:

```ts
system.editDeployEnvironment('dev', { host: 'mycompany.dev', branchName: 'develop' })
system.editDeployEnvironment('prod', { host: 'mycompany.com', clusterName: 'prod01' })
```

### `delDeployEnvironment(name: string): this`

Removes an environment.

---

## Pages & Menu

### `addPage(name, link, label, title?): PageBuilder` {#addPage}

Adds a standalone UI page (not tied to an entity). Used as a target for menu items.

| Parameter | Description |
|-----------|-------------|
| `name` | Unique page identifier |
| `link` | URL path (e.g. `'/dashboard'`) |
| `label` | i18n key shown in breadcrumbs/menu |
| `title` | Optional human title |

### `addGroupMenuItem(label: string): GroupMenuItemBuilder`

Adds a collapsible group in the sidebar menu. Returns a builder to add sub-items:
- `.addInternalMenuItem(pageName)` — link to a page defined in the system
- `.addExternalMenuItem(label, url)` — link to an absolute URL
- `.addExternalEnvMenuItem(label, env)` — link resolved from a config var at runtime

### `addInternalMenuItem(pageName: string): InternalMenuItemBuilder`

Adds a top-level sidebar link to an existing page.

### `addExternalMenuItem(label, url): ExternalMenuItemBuilder`

Adds a top-level link to a hardcoded external URL.

### `addExternalEnvMenuItem(label, env): ExternalEnvMenuItemBuilder`

Adds a top-level link where the URL is read from the config var named `env` at runtime.
Useful for linking to environment-specific external services.

**Anti-pattern — menu items pointing to non-existent pages:**

`addInternalMenuItem` validates that the page exists at `build()` time.
Calling it with a name that hasn't been registered via `addPage` (or auto-created by an
entity) throws. Always call `addPage` (or add the entity that owns the page) before
adding menu items that reference it.

---

## Custom Methods & Models

These produce additional GraphQL operations outside of entity CRUD.

### `addMethod(name, methodType, title?): MethodBuilder` {#addMethod}

Adds a custom GraphQL Query or Mutation at the system level.

| Parameter | Type | Values |
|-----------|------|--------|
| `methodType` | `MethodType` | `MethodType.Query` \| `MethodType.Mutation` |

Returns a `MethodBuilder`. See [05-custom-methods.md](./05-custom-methods.md).

### `createGeneralModel(name, title?): BaseModelBuilder`

Creates a model usable as both input and output.

### `createInputModel(name, title?): BaseModelBuilder`

Creates a model usable only as input (GraphQL `input` type).

### `createOutputModel(name, title?): BaseModelBuilder`

Creates a model usable only as output (GraphQL `type`).

See [05-custom-methods.md](./05-custom-methods.md) for full `MethodBuilder` and model API.

---

## i18n

```ts
addLanguage(id: string, title?: string)  // adds a language (en/ru pre-seeded)
deleteLanguage(id: string)               // removes a language
setDefailtLanguage(id: string)           // sets default; must exist or throws
```

---

## Glossary & Commands

```ts
addGlossaryTerm(term: string, definition: string)
// Adds a domain term to the generated documentation. Throws on duplicate.

addCommnad(projectCategory: ProjectCategory, name: string, command: string, needFor: string)
// Registers a CLI command in the generated docs.
// projectCategory: 'back' | 'ui' | 'app' | 'land'
```

---

## Additional Service (standalone service without entity)

### `addAdditionalService(name, title?): AdditionalServiceBuilder`

Adds a standalone backend service with its own methods and models — not tied to any
entity. Useful for orchestration logic, external integrations, or complex business
operations that span multiple entities.

---

## Backend deployment config

### `getBack(): DeploymentBuilder`

Returns the `DeploymentBuilder` for the main backend service. Allows configuring
replicas, CPU/memory requests and limits:

```ts
system.getBack().setReplicas(2).setRequests({ cpu: '100m', memory: '256Mi' })
```

---

## Build

### `build(): System`

Validates and serialises the entire meta description into a plain `System` object.
Throws on any validation error (duplicate names, unregistered databases, invalid
constraints, etc.).

### `validate(): System`

Alias of `build()`. Can be used to check for errors without assigning the result.

---

## Anti-patterns

### Using `setConfigVarDefaultValue` / `setDefaultValueForConfigVar`

Both are **deprecated**. They print a warning on every call.

**Wrong:**
```ts
system.setConfigVarDefaultValue('database.main.write.uri', 'postgresql://...')
```

**Correct:**
```ts
system.getConfigVarRequired('database.main.write.uri').setDefValue('postgresql://...')
```

### Duplicate names across different entity types

All entity names share a single namespace. `addCatalog('users')` and then
`addDocument('users')` will throw. Names must be unique across catalogs, documents,
infoRegistries, sumRegistries, roles, and pages.

### Calling `build()` multiple times expecting different results

`build()` is deterministic. Calling it twice produces two separate plain objects with
identical content. If you need to check validity without producing output, use
`validate()` — it is the same operation.

---

> **Examples:** this file intentionally omits code examples. If you are working with
> this documentation as an AI agent or developer, add real usage examples from the
> consuming project here. A reference metadata file can typically be found at
> `src/meta/metadata.ts` in the meta project.

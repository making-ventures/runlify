# Custom Methods

> **Load this file when:** you need to add custom GraphQL operations (Query or Mutation)
> beyond the standard CRUD — either at the system level or on a specific entity.
> Also covers input/output models, args, return types, workers, and cron schedules.
>
> Related: [02-system-meta-builder.md#addMethod](./02-system-meta-builder.md#addMethod) ·
> [03-entity-types.md#entity-methods](./03-entity-types.md#entity-methods)

---

## Where to add methods

Methods can live on:

| Scope | How to create | Generated location |
|-------|--------------|-------------------|
| **System-level** | `system.addMethod(name, type)` | Top-level GraphQL schema + `AdditionalService` |
| **Entity-level** | `entity.addMethod(name, type)` | Inside entity's `<Entity>Service` |

Standard CRUD methods (`all`, `create`, `update`, `delete`) are auto-generated on every
savable entity. Do not add them manually.

---

## `addMethod(name, methodType, title?): MethodBuilder` {#addMethod}

| Parameter | Type | Values |
|-----------|------|--------|
| `name` | `string` | Method name, `camelCase`, unique within the owner |
| `methodType` | `MethodType` | `MethodType.Query` — read operation; `MethodType.Mutation` — write operation |
| `title` | `string` | Optional human-readable title |

Returns a `MethodBuilder`.

---

## MethodBuilder API

### `setExportedToApi(value?: boolean): this` {#setExportedToApi}

Exposes this method in the generated GraphQL schema. Default `false` for custom methods
(standard CRUD methods are exported automatically via their own mechanism).

Call `.setExportedToApi()` on any custom method that should be callable from the
frontend.

**Anti-pattern — forgetting `setExportedToApi`:**

```ts
// WRONG: method is generated in the service but NOT in the GraphQL schema
entity.addMethod('recalculate', MethodType.Mutation)

// CORRECT
entity.addMethod('recalculate', MethodType.Mutation).setExportedToApi()
```

---

### `setMethodType(type: MethodType): this`

Changes the method type after creation.

---

### `setAsync(value?: boolean): this`

Marks the method as `async`. Affects the generated service method signature.

---

### `setWorker(workerName: string): this` / `resetWorker(): this`

Associates this method with a named worker. The worker must be registered via
`system.addWorker(name)`. When a worker is set, the method runs in the worker process
rather than the main backend.

---

### `addRunSchedule(cronExpression: string): this` / `resetRunSchedule(): this`

Adds a cron expression to automatically trigger this method on a schedule.
Multiple schedules can be added. Duplicate cron expressions throw.

```ts
method.addRunSchedule('0 * * * *')   // every hour
method.addRunSchedule('0 0 * * *')   // every day at midnight
```

---

### `getArgsModel(): ArgsModelBuilder` {#argsModel}

Returns the **args model** — the input type for this method. Add fields to it to define
what the caller must pass.

`ArgsModelBuilder` extends `BaseModelBuilder` — it has the same `addField()` and
`addModelField()` API (see [Models section](#models) below).

---

### Return type

A method's return type is one of three variants. Set exactly one.

#### `setReturnObjectModel(name: string): ReturnObjectBuilder` {#setReturnObjectModel}

Sets return type to a custom object type. Returns a `ReturnObjectBuilder` which extends
`BaseModelBuilder` — add fields to define the returned shape.

The returned model name is auto-namespaced: `${methodName}${PascalCase(name)}`.

`ReturnObjectBuilder` additionally supports:
```ts
returnModel.setArray(true)   // returns an array of objects
```

#### `setReturnScalarModel(): ReturnScalarBuilder` {#setReturnScalarModel}

Sets return type to a scalar. Returns a `ReturnScalarBuilder` which extends
`ScalarFieldBuilder` — call `setType()` to set the scalar type, `setArray()` to return
an array of scalars.

```ts
const ret = method.setReturnScalarModel()
ret.setType('string')
ret.setArray()   // returns string[]
```

#### `setReturnVoidModel(name?: string): ReturnVoidBuilder` {#setReturnVoidModel}

Sets return type to `void` (no return value). This is the **default** — methods start
as void.

---

## Models — input and output {#models}

Models are named TypeScript / GraphQL types used as method arguments or return values.
They are defined on the owner (system or entity) and referenced by methods.

### Creating models

| Method | Type | Use as |
|--------|------|--------|
| `createGeneralModel(name, title?)` | `BaseModelBuilder` | Input or output |
| `createInputModel(name, title?)` | `BaseModelBuilder` | Input only (GraphQL `input` type) |
| `createOutputModel(name, title?)` | `BaseModelBuilder` | Output only (GraphQL `type`) |

### `BaseModelBuilder` API

#### `addField(name, title?): ScalarFieldBuilder`

Adds a scalar field to the model. Returns a `ScalarFieldBuilder` with the full field API
from [04-fields.md](./04-fields.md).

#### `addModelField(model, name, title?): ModelFieldBuilder`

Adds a reference to another model defined on the same owner. The referenced model must
exist at the time of this call — throws if not found.

```ts
const address = system.createGeneralModel('address')
address.addField('street').setType('string').setRequired()
address.addField('city').setType('string').setRequired()

const output = method.setReturnObjectModel('result')
output.addModelField('address', 'shippingAddress')
```

#### `delField(name): this`

Removes a field from the model.

---

## Full wiring example pattern

```
system
  .addMethod('calculateDiscount', MethodType.Query)
  .setExportedToApi()
  .setAsync()
  ┌─ .getArgsModel()
  │     .addField('orderId').setType('int').setRequired()
  │     .addField('promoCode').setType('string')
  │
  └─ .setReturnObjectModel('result')
        .addField('discountPercent').setType('float').setRequired()
        .addField('finalPrice').setType('float').setRequired()
```

The method name, args model, and return model combine to generate:
- A GraphQL schema entry (`Query.calculateDiscount(orderId: Int!, promoCode: String): CalculateDiscountResult`)
- A service method stub in the `Additional*Service.ts` file (yours to implement)

---

## Anti-patterns

### Defining return shape via separate `createOutputModel` without linking it to the method

**Wrong:**
```ts
system.createOutputModel('discountResult')  // created but never linked

const method = system.addMethod('getDiscount', MethodType.Query)
// forgot to call setReturnObjectModel()
```

**Why:** the model is generated but the method returns `void`. The GraphQL schema
doesn't reference the model.

**Correct:** always call one of `setReturnObjectModel`, `setReturnScalarModel`, or
`setReturnVoidModel` explicitly. For object returns, the model is created and registered
by `setReturnObjectModel` automatically — no need to pre-create it separately.

---

### Adding standard CRUD method names manually

**Wrong:**
```ts
entity.addMethod('all', MethodType.Query)    // throws: 'all' already exists
entity.addMethod('create', MethodType.Mutation)
```

**Why:** `all`, `create`, `update`, `delete` are auto-added by `BaseSavableEntityBuilder`
constructor. Adding them again throws a duplicate name error.

**Correct:** use only unique custom names.

---

### Duplicate cron expressions on the same method

**Wrong:**
```ts
method.addRunSchedule('0 * * * *')
method.addRunSchedule('0 * * * *')   // throws: duplicate cron
```

**Correct:** each cron expression must be unique per method.

---

> **Examples:** this file intentionally omits code examples. Add real usage examples
> from the consuming project here. A reference metadata file is typically at
> `src/meta/metadata.ts` in the meta project.

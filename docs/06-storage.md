# Storage

> **Load this file when:** you need to choose or change the storage engine for an entity.
>
> Related: [03-entity-types.md#storage](./03-entity-types.md#storage) ·
> [09-options.md](./09-options.md)

---

## StorageType values

Import: `import { Storage, StorageType } from 'runlify'`

| Constant | String value | What it means |
|----------|-------------|---------------|
| `Storage.POSTGRES` | `'postgres'` | PostgreSQL only. Default for all entities. |
| `Storage.ELASTIC` | `'elastic'` | Elasticsearch only. No Prisma model generated. |
| `Storage.CLICKHOUSE` | `'clickhouse'` | ClickHouse only. No Prisma model generated. |
| `Storage.POSTGRES_WITH_ELASTIC_SEARCH` | `'postgres_with_elastic_search'` | PostgreSQL as primary store + Elasticsearch for search queries |
| `Storage.POSTGRES_WITH_CLICKHOUSE_SEARCH` | `'postgres_with_clickhouse_search'` | PostgreSQL as primary store + ClickHouse for search queries |

---

## How to set storage

```ts
entity.setStorage(Storage.POSTGRES_WITH_ELASTIC_SEARCH)
```

The storage must be set **before** adding fields, because some storage types force
the `id` type to `string`.

---

## Side effects of `setStorage()`

| Storage | Forces `id` type | Creates external tracking entity | Notes |
|---------|-----------------|----------------------------------|-------|
| `POSTGRES` | No | No | Default |
| `ELASTIC` | `string` (cuid) | No | No Prisma schema |
| `CLICKHOUSE` | `string` (cuid) | No | No Prisma schema |
| `POSTGRES_WITH_ELASTIC_SEARCH` | `string` (cuid) | Yes: `external<Entity>SearchTrackings` | Dual-write: PG + ES |
| `POSTGRES_WITH_CLICKHOUSE_SEARCH` | `string` (cuid) | Yes: `external<Entity>SearchTrackings` | Dual-write: PG + CH |

The `external<Entity>SearchTrackings` catalog is auto-generated and tracks sync state
between Postgres and the external search engine.

---

## Infrastructure requirements

Setting a non-Postgres storage triggers bootstrap generation:

| Storage contains | Generated bootstrap |
|-----------------|---------------------|
| `elastic` or `postgres_with_elastic_search` | `generateBackElasticBootstrap` — ES client init, index creation jobs |
| `clickhouse` or `postgres_with_clickhouse_search` | `generateBackClickHouseBootstrap` — CH client init, table creation jobs |

These bootstraps require the corresponding config vars to be set:
- Elasticsearch: `es.enabled`, `es.node` (or `es.cloudId` + `es.username` + `es.password`)
- ClickHouse: `ch.enabled`, `ch.host`, `ch.port`, `ch.database`, `ch.username`, `ch.password`

---

## Choosing the right storage

| Scenario | Recommended storage |
|----------|---------------------|
| Standard CRUD entity | `Storage.POSTGRES` |
| Entity with full-text search needs, Postgres as source of truth | `Storage.POSTGRES_WITH_ELASTIC_SEARCH` |
| Analytical / time-series data with heavy aggregation | `Storage.POSTGRES_WITH_CLICKHOUSE_SEARCH` or `Storage.CLICKHOUSE` |
| Pure analytics table, no CRUD | `Storage.CLICKHOUSE` |
| Pure search index, no relational data | `Storage.ELASTIC` |

---

## Helper functions (exported from `runlify`)

```ts
isStoragePostgres(storage)              // true for POSTGRES, PG+ES, PG+CH
isStorageElasticOnly(storage)           // true only for ELASTIC
isStorageClickHouseOnly(storage)        // true only for CLICKHOUSE
isStorageExternalSearch(storage)        // true for PG+ES, PG+CH
isStorageElasticSearch(storage)         // true for ELASTIC, PG+ES
isStorageClickHouseSearch(storage)      // true for CLICKHOUSE, PG+CH
getSearchEngine(storage)                // returns 'elastic' | 'clickhouse' | null
usesPrismaDelegate(storage)             // false only for ELASTIC and CLICKHOUSE
```

---

## Anti-patterns

### Setting `id` type after setting external search storage

**Wrong:**
```ts
entity.setStorage(Storage.POSTGRES_WITH_ELASTIC_SEARCH)
entity.getKey().setType('int')   // silently overrides forced 'string' type
```

**Why:** `setStorage()` with external-search storage forces `id` to `string` (cuid).
Overriding it to `int` or `bigint` breaks the external search sync because search engine
IDs must be strings.

**Correct:** do not override the key type when using external search storage.

---

### Using `ELASTIC` or `CLICKHOUSE` for entities that need relational joins

**Wrong:**
```ts
const orders = system.addDocument('orders')
orders.setStorage(Storage.ELASTIC)   // no Prisma model, no FK support
orders.addLinkField('users', 'userId')   // FK has nowhere to land
```

**Why:** `ELASTIC` and `CLICKHOUSE` storages do not generate a Prisma model, so foreign
keys and relational queries are not supported.

**Correct:** use `POSTGRES_WITH_ELASTIC_SEARCH` to keep Postgres as the relational
source of truth while gaining search capabilities.

---

> **Examples:** this file intentionally omits code examples. Add real usage examples
> from the consuming project here. A reference metadata file is typically at
> `src/meta/metadata.ts` in the meta project.

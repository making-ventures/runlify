# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

> **Note (2026-10-05):** entries from 0.0.733 through 0.0.799 below were reconstructed after the fact from `git log` — `standard-version`'s `release` script (and this file) stopped being run for a long stretch while the project also migrated from GitLab to GitHub (`making-ventures/runlify`), so no automatic entries exist for that period. Versions 0.0.733–0.0.756 have no reconstructable dedicated commit on `main` at all (likely published from a branch that was never merged back with its bump commit) and are omitted rather than guessed. From here on, run `pnpm release` after merging a feature so this file stays current.

## [Unreleased] — `runtime-meta` graph schema mode (PR branch `runtime-meta`, not yet merged/versioned)

Foundational work for building the GraphQL CRUD schema/resolvers/permissions **in the consuming project's runtime**, straight from entity metadata, instead of printing them to per-entity generated files (`baseTypeDefs.ts`/`baseResolvers.ts`/`basePermissionsToGraphql.ts`/`permissionsToGraphql.ts`) at `pnpm regen` time. Opt-in via a new **project-wide** option, `graphSchemaMode: 'files' | 'runtime_meta'` (default `'files'`, zero effect on existing consumers until they opt in and regenerate).

- `c7232b2` **Add runtime-meta graph schema mode foundation** — new `graphSchemaMode` option (`src/projectsGeneration/types.ts`); `genGraphCrudResolvers(entity)` and `genGraphCrudPermissions(entity)` (`src/projectsGeneration/generators/graph/`), executable-object counterparts to the existing `backBaseResolversTmpl`/`backBasePermissionToGraphqlTmpl` string templates, built on the already-executable `genGraphCrudSchema(entity)`; a minimal `RuntimeCrudService`/`RuntimeGraphContext` interface (`runtimeGraphTypes.ts`) that deliberately doesn't import the consumer's own generated types, so `runlify` stays decoupled from its output; and `graphSchemaModeParity.spec.ts`, a regex-based parity test asserting the new object-returning functions never drift from what the string templates would have printed, for both a plain catalog fixture and a `document`-type fixture (covers the `rePost` branch).
- `6de8f63` **Gate per-entity graph files and root permissions aggregator behind `graphSchemaMode`** — `generateBackEntityGraph.ts` skips writing the five base files for an entity in `runtime_meta` mode (the two `additional*.ts` hand-edit stubs are never touched, in either mode); `backPermissionToGraphqlTmpl`'s root aggregator drops imports/entries for `runtime_meta` entities. New `cleanStaleRuntimeMetaGraphFiles.ts` deletes those five stale files on the next regen after an entity switches modes — reusing the `resolveGenerationPath`/`GenerationPathCategory` pattern already established by (the until-now-uncalled) `cleanGraphServices.ts`. Fixed a real wiring gap found along the way: `fileCleaners/cleanFiles.ts` only ever invoked `cleanUi()` — the back-side cleaner is now wired in too.
- `0273f54` **Export runtime-meta graph schema building blocks from the package root** (`src/projectsGeneration/index.ts`) — so a consuming project's runtime code can `import {genGraphCrudSchema, genGraphCrudResolvers, genGraphCrudPermissions} from 'runlify'`.
- `52eadcc` (Ivan Kuleshevich, merged from `vanilock28/runlify:FixMonoRepoRegen`) **`copyGraphqlTsToUi` and `uiGraphqlSchemaImport` options** — splits the old single `copySchemaToUi` flag into independent control over copying `graphql.ts` vs. `graphql.schema.json` into the UI app, and makes the UI `dataProvider`'s schema import path configurable (e.g. pointing at a shared workspace package's schema instead of a locally-copied file) — needed because a monorepo consumer may want the UI to read the schema from a shared package rather than a duplicated local copy.

Validated against `rlw` on branch `runlify-diff` (consumed temporarily via `"runlify": "file:../../../runlify"`, meant to be reverted to a published version before merging either repo's default branch): flag flipped project-wide, hundreds of per-entity base/permission files deleted, full `pnpm test` (4830 passed) and the full e2e suite green, and the three known edge cases spot-checked directly against the live-built schema — `document`-type `rePost` mutation + `Void` scalar, a bigint/money field (`BsAccrualBonusType.premialPercentAmount`), and an entity with real custom `additionalResolvers.ts` content (`bsPartners`) — all merge and dispatch correctly. That pass also caught and fixed a real pre-existing bug in `rlw` itself: `bsPartners/additionalTypeDefs.ts` redeclared the base `createBsPartner` mutation with a stale nullable `wrongPasswordCounter: Int` (entity meta says `.setRequired()` → should be `Int!`) and no resolver of its own — under the old file-based merge this was silently tolerated, under `mergeSchemas` it was silently winning and weakening the real type; removed.

Still open before this can be merged/released: bump `runlify`'s own version and publish it (still `0.0.799` on this branch), then switch `rlw` off the temporary `file:` dependency onto the published version via its pnpm catalog.

### [0.0.799](https://github.com/making-ventures/runlify/compare/fc01ebf...66f7c72) (2026-09-05)

* fix: don't treat benign stderr output as a failure in `genGraphSchemesByLocalGenerator` (PR [#12](https://github.com/making-ventures/runlify/pull/12))

### [0.0.798](https://github.com/making-ventures/runlify/compare/75b5098...fc01ebf) (2026-09-05)

* feat: CJS module format support, `prismaModuleFormatCjs` flag (PR [#11](https://github.com/making-ventures/runlify/pull/11))

### [0.0.797](https://github.com/making-ventures/runlify/compare/161eb7a...75b5098) (2026-09-03)

* fix(ui): dashboard menu item checked stale `dashboards.main` permission instead of generated `ui.dashboard` (PR [#10](https://github.com/making-ventures/runlify/pull/10))

### [0.0.796](https://github.com/making-ventures/runlify/compare/40b9144...161eb7a) (2026-09-03)

* feat: generated UI permissions system — permission checks on generated pages, generated-permissions utils, new default-menu UI permissions, docs (PR [#9](https://github.com/making-ventures/runlify/pull/9) `features/permission`)
* merged ClickHouse fixes from PR [#8](https://github.com/making-ventures/runlify/pull/8) (`795-clickhouse`, see 0.0.795)

### [0.0.795](https://github.com/making-ventures/runlify/compare/9d5d681...40b9144) (2026-08-17)

* fix(clickhouse): nullable-field bucketing and non-string id/link keys in `genJobs` type generation; always emit `genJobs.ts` even with zero ClickHouse entities; dropped a stale step reference from a spec comment; added `jobs.spec.ts` coverage mirroring the Elastic equivalent

### [0.0.794](https://github.com/making-ventures/runlify/compare/1058d88...9d5d681) (2026-07-24)

_(republish only, no functional change)_

### [0.0.793](https://github.com/making-ventures/runlify/compare/6edac84...1058d88) (2026-07-24)

* feat: monorepo generation paths (PR [#6](https://github.com/making-ventures/runlify/pull/6), `vanilock28/monorepo-generation-paths`) — find `runlify.json` by walking up from `cwd`; rename layout mode `legacy` → `detached`; configurable `GenerationPathCategory`/`resolveGenerationPath` builder; fixed GraphQL schema copy using back as shared and ignoring path overrides — the direct precursor of this repo's current `monorepo`/`paths` support

### [0.0.792](https://github.com/making-ventures/runlify/compare/8ca46c7...6edac84) (2026-07-24)

* fix: bigint/money field issues (PR [#7](https://github.com/making-ventures/runlify/pull/7) `791-bigint-fix`)

### [0.0.790](https://github.com/making-ventures/runlify/compare/08f9d3b...8ca46c7) (2026-07-13)

* feat: money fields switched from Elastic "long" to `bigint`; bigint support added for Elastic long types (PR [#4](https://github.com/making-ventures/runlify/pull/4)/[#5](https://github.com/making-ventures/runlify/pull/5) `money-type`)

### [0.0.787](https://github.com/making-ventures/runlify/compare/84ad29d...08f9d3b) (2026-06-09)

* ci: Telegram release notifications (PR [#3](https://github.com/making-ventures/runlify/pull/3))

### [0.0.786](https://github.com/making-ventures/runlify/compare/560661b...84ad29d) (2026-06-09)

* fix: npm provenance metadata (PR [#2](https://github.com/making-ventures/runlify/pull/2))

### [0.0.785](https://github.com/making-ventures/runlify/compare/b3b0062...560661b) (2026-06-09)

* ci: migrated CI/CD to GitHub Actions (PR [#1](https://github.com/making-ventures/runlify/pull/1)) — marks the GitLab → GitHub move
* feat: Prisma 7 support merged from `784-prisma-7-from-main`

### [0.0.783](https://github.com/making-ventures/runlify/compare/f68956a...b3b0062) (2026-05-29)

_(package.json touch-up; published after 0.0.784 despite the lower number — branch-publish ordering, not a revert)_

### [0.0.784](https://github.com/making-ventures/runlify/compare/1e76d66...f68956a) (2026-05-27)

* feat: ClickHouse storage support (`783-add-clickhouse`) — jobs/bootstrap generation for `Storage.POSTGRES_WITH_CLICKHOUSE_SEARCH`, `StorageType`/`Storage` helpers, renamed `AddElasticSearch` → `AddExternalSearch`

### [0.0.782](https://github.com/making-ventures/runlify/compare/675aadf...1e76d66) (2026-05-10)

* feat: multi-database-instance support (`781-multi-db`), fixed `getPrisma` generation for it

### [0.0.780](https://github.com/making-ventures/runlify/compare/91fb0e2...675aadf) (2026-04-04)

* feat: `gin` index support for cacheable Prisma fields (`779-cacheable-gin`)

> Between 0.0.777 and here, 2026-03-14 saw a cluster of republish churn (`0.0.778` cut four times, `0.0.780` once, `0.0.779` once) around an Apollo-compatibility `gql` import generation update and a rollback — collapsed here rather than itemized; 0.0.780 above is the version that actually stuck.

### [0.0.777](https://github.com/making-ventures/runlify/compare/e1c5e57...a6d81e2) (2026-03-11)

* fix: chart generation

### [0.0.776](https://github.com/making-ventures/runlify/compare/19905ae...e1c5e57) (2026-03-11)

* feat: `detachedBackProject`/`detachedUiProject` options

### [0.0.775](https://github.com/making-ventures/runlify/compare/39ad8a0...19905ae) (2026-02-13)

* fix: don't generate UI docs when `genFrontend` is `false`

### [0.0.774](https://github.com/making-ventures/runlify/compare/f5d0088...39ad8a0) (2026-02-13)

* feat: `--back-only` flag for the `regen` command

### [0.0.773](https://github.com/making-ventures/runlify/compare/5d1ca3f...f5d0088) (2025-12-16)

* fix: menu icons generation

### [0.0.772](https://github.com/making-ventures/runlify/compare/45e887f...5d1ca3f) (2025-12-12)

* rollback (reverts part of the OIDC-publisher churn below)

### [0.0.771](https://github.com/making-ventures/runlify/compare/bae085c...45e887f) (2025-12-12)

_(republish only)_

### [0.0.770](https://github.com/making-ventures/runlify/compare/b1d13c9...bae085c) (2025-12-12)

### [0.0.769](https://github.com/making-ventures/runlify/compare/c62cb29...b1d13c9) (2025-12-12)

### [0.0.768](https://github.com/making-ventures/runlify/compare/9b3cde9...c62cb29) (2025-12-12)

### [0.0.767](https://github.com/making-ventures/runlify/compare/088f1f4...9b3cde9) (2025-12-12)

* ci: set up npm OIDC Trusted Publisher (0.0.767–0.0.770 are retries of the same change)

### [0.0.766](https://github.com/making-ventures/runlify/compare/f477fa1...088f1f4) (2025-12-12)

_(republish only)_

### [0.0.765](https://github.com/making-ventures/runlify/compare/fbb64ed...f477fa1) (2025-12-11)

* feat(ui): update react-admin dependency

### [0.0.764](https://github.com/making-ventures/runlify/compare/20251cb...fbb64ed) (2025-12-02)

* fix: add override (no further detail recoverable from the commit message)

### [0.0.763](https://github.com/making-ventures/runlify/compare/43f5b1b...20251cb) (2025-12-02)

* feat: `options.graphGeneratorCommand`; docs on publishing a custom tag to npm

### [0.0.762](https://github.com/making-ventures/runlify/compare/0c87239...43f5b1b) (2025-10-30)

* feat: global `auditableOnlyByUser` option

### [0.0.761](https://github.com/making-ventures/runlify/compare/499152a...0c87239) (2025-09-22)

* fix: made the Kafka SASL mechanism required

### [0.0.760](https://github.com/making-ventures/runlify/compare/5bac0a6...499152a) (2025-09-22)

* fix: Kafka SASL mechanism support

### [0.0.759](https://github.com/making-ventures/runlify/compare/e1168eb...5bac0a6) (2025-09-10)

* feat: search support for info-registries (`inforeg-search`, disabled by default); dockerfile-generation option

### [0.0.758](https://github.com/making-ventures/runlify/compare/dc0fe4e...e1168eb) (2025-08-27)

* fix: `permissionsToGraphql` reference bug

### [0.0.732-removeCustoms.0](https://gitlab.com/making.ventures/runlify/compare/v0.0.730-removeCustoms.0...v0.0.732-removeCustoms.0) (2025-06-13)

### [0.0.730-removeCustoms.0](https://gitlab.com/making.ventures/runlify/compare/v0.0.729...v0.0.730-removeCustoms.0) (2025-06-13)

### [0.0.729](https://gitlab.com/making.ventures/runlify/compare/v0.0.728...v0.0.729) (2025-06-13)

### [0.0.728](https://gitlab.com/making.ventures/runlify/compare/v0.0.728-test.0...v0.0.728) (2025-06-13)

### [0.0.728-test.0](https://gitlab.com/making.ventures/runlify/compare/v0.0.728-alpha.0...v0.0.728-test.0) (2025-06-13)

### [0.0.728-alpha.0](https://gitlab.com/making.ventures/runlify/compare/v0.0.718...v0.0.728-alpha.0) (2025-06-13)

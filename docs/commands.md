# Command Reference for runlify

> **Load this file when:** you need to regenerate a project from the meta or to find
> out what a CLI flag does.
>
> Source: `src/commands/`
>
> Related: [09-options.md](./09-options.md) · [08-frontend-file-graph.md](./08-frontend-file-graph.md)

---

## `runlify regen` {#regen}

Alias: `runlify regenerate`.

Reads `meta/metadata.json` and `meta/options.json` (the paths are resolved from the
current working directory and `runlify.json`) and regenerates the backend and the
frontend projects.

```shell
runlify regen
```

`metadata.json` itself is produced by the meta project from its `SystemMetaBuilder`
code — run the project's own meta build (usually `yarn gen` / `pnpm gen`) before
`regen` when the meta has changed.

### Flags

| Flag | Effect |
|------|--------|
| `--backOnly` (`--back-only`) | Sets `genFrontend = false` for this run: only the backend is regenerated. `options.json` is not changed |
| `--prune` | Additionally removes page folders of `src/adm/pages` that have no entity in the meta — but only folders that contain generated files and standard created-once stubs. A folder with any handwritten file is kept and reported with a warning |
| `--prune-dry-run` | The same analysis as `--prune`, but nothing is removed: the plan is printed to the log (`prune: would remove …`). Implies `--prune` |

Both prune flags are service flags: they are passed to the generation as
`pruneOrphanPages` / `pruneDryRun` and are never written to `options.json`.

### What is removed on every regen (without any flag)

- widgets of entities that no longer exist, and all widgets of a type switched off by
  `genUiCountWidget` / `genUiListWidget`;
- `<Entity>Icon.tsx` when `genUiEntityIcons` is off;
- legacy list/show components of entities switched to the descriptor mode, see
  [08-frontend-file-graph.md](./08-frontend-file-graph.md#descriptor-mode).

Page folders without an entity are only reported (a warning per folder) unless
`--prune` is given.

---

## Other commands

`runlify init`, `generate`, `start`, `login`, `logout`, `pullEnvs`, `readEnv`,
`showToken`, `availableEnvironments` — project bootstrap and cloud commands; they are
out of scope of this documentation, see `src/commands/` in the runlify repository.

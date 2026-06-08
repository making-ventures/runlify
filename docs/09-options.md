# Bootstrap Options (`BootstrapEntityOptions`)

> **Load this file when:** you need to toggle a generation feature on/off, change
> project identity settings, configure infrastructure (k8s, CI, Docker), or understand
> what a specific option flag does.
>
> Source: `src/projectsGeneration/types.ts`
> Consumed from: `src/meta/options.json` (read by `runlify regen`)

---

## How options are applied

`options.json` is read once per `regen` and applied globally to all entities.
Individual entities can receive their own options override by passing `options` as the
third argument to `addCatalog`, `addDocument`, etc.:

```ts
system.addCatalog('specialCatalog', undefined, { ...defaultBootstrapEntityOptions, genUiResources: false })
```

Most projects use the same options object for all entities.

---

## All flags

### Code generation toggles — Backend

| Flag | Default | Description |
|------|---------|-------------|
| `genPrismaServices` | `true` | Generate Prisma-based service files |
| `genPrismaSchema` | `true` | Generate `.prisma` schema files |
| `genGraphSchema` | `true` | Generate GraphQL type definitions |
| `genGraphResolvers` | `true` | Generate GraphQL resolvers |
| `genContext` | `true` | Generate request context wiring |
| `typesOnly` | `false` | Internal — first generation pass (types only). Do not set manually. |
| `readOnly` | `false` | Skip write operations in generation. Rarely used. |
| `corePrismaGetter` | `true` | Generate the Prisma client getter (`getPrisma.ts`) |
| `coreIndex` | `true` | Generate the main `index.ts` entry point |

---

### Code generation toggles — Frontend

| Flag | Default | Description |
|------|---------|-------------|
| `genFrontend` | `true` | Generate the entire frontend. Set `false` to generate backend only (`regen --backOnly` also sets this). |
| `genUiResources` | `true` | Generate react-admin resource registrations |
| `genUiResourcesPage` | `true` | Generate the `/resources` debug page |
| `genUiEntityMapping` | `true` | Generate `entityMapping.ts` |
| `genUiMenu` | `true` | Generate `getDefaultMenu.ts` |
| `genUiElements` | `true` | Generate entity page components |
| `genUiRoutes` | `true` | Generate `routes.tsx` |
| `genUIApp` | `true` | Generate the root `App.tsx` |
| `genUiFunctions` | `true` | Generate the functions page |
| `genUiDashboard` | `true` | Generate `Dashboard.tsx` (created once) |
| `genUiCountWidget` | `true` | Generate count widgets per entity |
| `genUiListWidget` | `true` | Generate list widgets per entity |
| `genUiAppBar` | `true` | Generate `AppBar.tsx` |
| `showMetaPage` | `true` | Show the `/meta` debug page in the UI |

---

### Form generation toggles

Nested under `forms`:

| Flag | Default | Description |
|------|---------|-------------|
| `forms.list.gen` | `true` | Generate list page components |
| `forms.show.gen` | `true` | Generate show page components |
| `forms.edit.gen` | `true` | Generate edit form components |
| `forms.edit.idEditable` | `false` | Show `id` field in edit forms |
| `forms.create.gen` | `true` | Generate create form components |
| `forms.create.idEditable` | `false` | Show `id` field in create forms |
| `forms.menu.show` | `true` | Show entity in sidebar menu |
| `forms.resourcesPage.show` | `true` | Show entity on resources page |

---

### CI/CD — GitLab CI

| Flag | Default | Description |
|------|---------|-------------|
| `genBackGitlabCi` | `true` | Generate `.gitlab-ci.yml` for backend |
| `genUiGitlabCi` | `true` | Generate `.gitlab-ci.yml` for frontend |
| `genBackCiNotify` | `true` | Include Slack/chat notifications in backend CI |
| `genUiCiNotify` | `true` | Include Slack/chat notifications in frontend CI |

---

### CI/CD — Docker

| Flag | Default | Description |
|------|---------|-------------|
| `genDockerfileBack` | `true` | Generate `Dockerfile` for backend |
| `genDockerfileUI` | `true` | Generate `Dockerfile` for frontend |
| `adminBaseDockerimage` | `'nginx:1.23-alpine'` | Base image for frontend Docker build |
| `backendBaseDockerimage` | `'registry.gitlab.com/making.ventures/images/node-base'` | Base image for backend Docker build |

---

### Kubernetes / Helm

| Flag | Default | Description |
|------|---------|-------------|
| `genBackChartValues` | `true` | Generate `chart/values.yaml` for backend |
| `genBackChartIngress` | `true` | Generate `chart/templates/ingress.yaml` for backend |
| `genBackChartBack` | `true` | Generate `chart/templates/back.yaml` for backend |
| `genUiChartIngress` | `true` | Generate ingress chart for frontend |
| `genUiChartFront` | `true` | Generate deployment chart for frontend |
| `k8sChartName` | `''` | Helm chart name |
| `k8sNamespacePrefix` | `''` | Kubernetes namespace prefix |
| `k8sAppsDomain` | `'apps.making.ventures'` | Base domain for k8s ingress |
| `k8sSubdomainPrefix` | `''` | Subdomain prefix applied to all ingress hosts |
| `k8sImagePullSecrets` | `'docker-registry'` | k8s image pull secret name |
| `ingressAnnotationBodySize` | `'50m'` | `nginx.ingress.kubernetes.io/proxy-body-size` annotation |

---

### Project identity

| Flag | Default | Description |
|------|---------|-------------|
| `projectsGroup` | `''` | GitLab group or organisation name |
| `projectPrefix` | `''` | Technical prefix (e.g. `'myapp'`) — used in k8s names, image tags |
| `dbName` | `''` | Default database name in Postgres |
| `projectName` | `''` | Human-readable project name |

---

### Feature flags

| Flag | Default | Description |
|------|---------|-------------|
| `usersEnabled` | `true` | Generate user management entities and auth |
| `tenantsAvailable` | `false` | Enable multi-tenancy support |
| `themesEnabled` | `true` | Enable theme switching in UI |
| `mainColorOfAppTitile` | `true` | Apply primary color to app title |
| `sharding` | `false` | Enable sharding support globally |
| `breadcrumb` | `false` | Enable breadcrumb navigation in UI |
| `telemetry` | `false` | Enable OpenTelemetry tracing |
| `mountebankEnabled` | `false` | Enable Mountebank mock server integration |
| `exportHtmlEnabled` | `false` | Enable HTML export feature |
| `auditableOnlyByUser` | `false` | Only audit changes made by users (not system) |
| `useSortedFilter` | `false` | Use sorted filter UI in list pages |

---

### System menu visibility

| Flag | Default | Description |
|------|---------|-------------|
| `showFunctionsInMenu` | `true` | Show system Functions page in menu |
| `showResourcesInMenu` | `true` | Show Resources debug page in menu |
| `showMetaInMenu` | `true` | Show Meta debug page in menu |

---

### Output paths

| Flag | Default | Description |
|------|---------|-------------|
| `detachedBackProject` | `''` | Absolute path to the backend project. Auto-resolved to `../<prefix>-back` if empty. |
| `detachedUiProject` | `''` | Absolute path to the frontend project. Auto-resolved to `../<prefix>-ui` if empty. |

---

### Other

| Flag | Default | Description |
|------|---------|-------------|
| `skipWarningThisIsGenerated` | `false` | Suppress the `DO NOT EDIT! THIS IS GENERATED FILE` header |
| `graphGeneratorCommand` | `''` | Command to run the local GraphQL schema generator (alternative to built-in) |

---

## Anti-patterns

### Setting `typesOnly: true` in `options.json`

**Wrong:** manually setting `typesOnly: true` in the options file.

**Why:** this is an internal flag used by `generateProject` for the first generation
pass. It produces an incomplete output — only TypeScript type files, no resolvers, no
Prisma schema. If set permanently, your backend will be broken.

**Correct:** never set `typesOnly` manually.

---

### Setting `genFrontend: false` in `options.json` permanently to skip frontend

**Wrong:** permanently disabling frontend in `options.json` while the team still needs
frontend generation.

**Why:** other developers running `regen` won't regenerate the frontend, leading to
divergent states.

**Correct:** use the CLI flag `runlify regen --backOnly` for a one-off backend-only
regen. It temporarily sets `genFrontend=false` without changing `options.json`.

---

### Leaving `projectPrefix`, `dbName`, `projectName` empty

**Wrong:** keeping default empty strings in `options.json`.

**Why:** these values are embedded into generated Helm chart names, Docker image tags,
database names, and CI variables. Empty strings produce broken infrastructure configs.

**Correct:** always set all three to meaningful values for your project.

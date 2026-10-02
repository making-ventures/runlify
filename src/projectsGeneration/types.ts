import BaseBuilder from './builders/BaseBuilder'
import CatalogBuilder from './builders/CatalogBuilder'
import ReportBuilder from './builders/ReportBuilder'
import {Entity, LinkField} from './builders/buildedTypes'

const defaultFormsShowOptions = {
  gen: true,
}

const defaultFormsEditOptions = {
  gen: true,
  idEditable: false,
}

const defaultFormsCreateOptions = {
  gen: true,
  idEditable: false,
}

const defaultFormsListOptions = {
  gen: true,
}

const defaultFormsOptions = {
  list: defaultFormsListOptions,
  show: defaultFormsShowOptions,
  edit: defaultFormsEditOptions,
  create: defaultFormsCreateOptions,
  menu: {
    show: true,
  },
  resourcesPage: {
    show: true,
  },
}

export const defaultBootstrapEntityOptions = {
  genPrismaServices: true,
  genGraphSchema: true,
  genGraphResolvers: true,
  // 'files' (default): today's behavior — per-entity typeDefs/resolvers/permissions
  // files on disk, unchanged. 'runtime_meta': base CRUD graph layer is built in
  // memory from entity meta at server start instead, no per-entity files for it.
  graphSchemaMode: 'files' as 'files' | 'runtime_meta',
  genUiResources: true,
  skipWarningThisIsGenerated: false,
  genPrismaSchema: true,
  genContext: true,
  typesOnly: false,

  genRootConfig: true,
  genRootElements: true,

  genUiCountWidget: true,
  genUiListWidget: true,
  genUiEntityIcons: true,
  genUiAppBar: true,

  genUiEntityMapping: true,
  genUiMenu: true,
  genUiElements: true,
  genUiResourcesPage: true,
  genUiRoutes: true,
  genUIApp: true,

  genUiFunctions: true,
  genUiDashboard: true,

  showMetaPage: true,

  readOnly: false,

  forms: defaultFormsOptions,

  projectsGroup: '',
  projectPrefix: '',
  dbName: '',
  projectName: '',

  k8sChartName: '',
  k8sNamespacePrefix: '',
  k8sAppsDomain: 'apps.making.ventures',
  k8sSubdomainPrefix: '',
  k8sImagePullSecrets: 'docker-registry',
  ciDockerRegistry: 'registry.service.making.ventures',
  telemetry: false,
  useSortedFilter: false,

  // Back

  // ci
  genBackGitlabCi: true,
  genUiGitlabCi: true,

  // ciNotify
  genBackCiNotify: true,
  genUiCiNotify: true,

  // dockerfile
  adminBaseDockerimage: 'nginx:1.23-alpine',
  backendBaseDockerimage: 'registry.gitlab.com/making.ventures/images/node-base',

  // chart
  genBackChartValues: true,
  genBackChartIngress: true,
  genBackChartBack: true,
  genUiChartIngress: true,
  genUiChartFront: true,
  ingressAnnotationBodySize: '50m',
  mountebankEnabled: false,
  exportHtmlEnabled: false,

  // Environment
  corePrismaGetter: true,
  coreIndex: true,

  // Users
  usersEnabled: true,

  // Tenants
  tenantsAvailable: false,

  themesEnabled: true,
  mainColorOfAppTitile: true,
  sharding: false,
  breadcrumb: false,

  // System menu pages
  showFunctionsInMenu: true,
  showResourcesInMenu: true,
  showMetaInMenu: true,

  genFrontend: true,

  genDockerfileBack: true,
  genDockerfileUI: true,
  auditableOnlyByUser: false,

  // genGraphSchemesByLocalGenerator: true,
  graphGeneratorCommand: '',

  detachedBackProject: '',
  detachedUiProject: '',
  detachedSharedProject: '',

  // Filled by resolveProjectPaths during regen (optional in options.json)
  metaDir: '',
  repoRoot: '',
  layoutMode: 'detached' as 'detached' | 'monorepo',
  sharedSchemaPath: '',
  copySchemaToUi: true,
  /** Copy back src/generated/graphql.ts to ui. Unset → follows copySchemaToUi. */
  copyGraphqlTsToUi: undefined as boolean | undefined,
  /** Module specifier of the introspection schema in the generated ui src/dataProvider/index.ts. */
  uiGraphqlSchemaImport: '../generated/graphql.schema.json',
  prismaModuleFormatCjs: false,
}

export type BootstrapEntityOptions = typeof defaultBootstrapEntityOptions & {
  /** Service flag set by `regen --prune`; never part of defaults, so it is not written to options.json. */
  pruneOrphanPages?: boolean;
  /** Service flag set by `regen --prune-dry-run`: print the prune plan, remove nothing. */
  pruneDryRun?: boolean;
};

export interface EntityBuilderWithOptions<
  T extends BaseBuilder | ReportBuilder = CatalogBuilder
> {
  entity: T
  options: BootstrapEntityOptions
}

export interface EntityWithOptions {
  entity: Entity
  options: BootstrapEntityOptions
}

export type LinkedEntitiesType = 'oneToOne' | 'manyToMany' | 'oneToMany'

export type LinkedEntities =
  | {
      type: 'oneToOne'
      entityOwnerName: string
      fromField: LinkField
      externalEntityName: string
    }
  | {
      type: 'oneToMany'
      entityOwnerName: string
      fromField: LinkField
      externalEntityName: string
    }

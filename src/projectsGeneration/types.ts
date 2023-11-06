import BaseBuilder from './builders/BaseBuilder'
import CatalogBuilder from './builders/CatalogBuilder'
import ReportBuilder from './builders/ReportBuilder'
import { Entity, LinkField } from './builders/buildedTypes'

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
  genUiResources: true,
  skipWarningThisIsGenerated: false,
  genPrismaSchema: true,
  genContext: true,
  typesOnly: false,

  genRootConfig: true,
  genRootElements: true,

  genUiCountWidget: true,
  genUiListWidget: true,
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

  detachedBackProject: '',
  detachedUiProject: '',
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

  // Back

  // ci
  genBackGitlabCi: true,
  genUiGitlabCi: true,

  // dockerfile
  adminBaseDockerimage: 'nginx:1.23-alpine',
  backendBaseDockerimage: 'registry.gitlab.com/making.ventures/images/node-base',

  // chart
  genBackChartValues: true,
  genBackChartIngress: true,
  genBackChartBack: true,
  genUiChartIngress: true,
  genUiChartFront: true,

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
}

export type BootstrapEntityOptions = typeof defaultBootstrapEntityOptions

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

import {join} from 'path'

/** Корень артефакта генерации */
export type GenerationPathRoot = 'back' | 'ui' | 'shared'

export const GenerationPathRoot = {
  back: 'back',
  ui: 'ui',
  shared: 'shared',
} as const satisfies Record<string, GenerationPathRoot>

/**
 * Единый источник правды по именам категорий.
 * Паттерн как у Storage: const + typeof → union.
 */
export const GenerationPathCategory = {
  BackHookBeforeCreate: 'back.hook.beforeCreate',
  BackHookAfterCreate: 'back.hook.afterCreate',
  BackHookBeforeUpdate: 'back.hook.beforeUpdate',
  BackHookAfterUpdate: 'back.hook.afterUpdate',
  BackHookBeforeDelete: 'back.hook.beforeDelete',
  BackHookAfterDelete: 'back.hook.afterDelete',
  BackHookBeforeUpsert: 'back.hook.beforeUpsert',
  BackHookChangeListFilter: 'back.hook.changeListFilter',
  BackHookAdditionalOperationsOnCreate: 'back.hook.additionalOperationsOnCreate',
  BackHookAdditionalOperationsOnUpdate: 'back.hook.additionalOperationsOnUpdate',
  BackHookAdditionalOperationsOnDelete: 'back.hook.additionalOperationsOnDelete',
  BackHookTenantIdRequiredHooks: 'back.hook.tenantIdRequiredHooks',
  BackHookInitUserHooks: 'back.hook.initUserHooks',
  BackHookInitBuiltInHooks: 'back.hook.initBuiltInHooks',
  BackServiceClass: 'back.service.class',
  BackServiceAdditionalClass: 'back.service.additionalClass',
  BackServiceConfig: 'back.service.config',
  BackServiceBaseServices: 'back.service.baseServices',
  BackServiceServiceConstrictors: 'back.service.serviceConstrictors',
  UiPageShowMainTab: 'ui.page.show.MainTab',
  UiPageShowDefaultMainTab: 'ui.page.show.DefaultMainTab',
  UiPageShowDefaultEntityShow: 'ui.page.show.DefaultEntityShow',
  UiPageShowDefaultActions: 'ui.page.show.DefaultActions',
  UiPageShowIndex: 'ui.page.show.index',
  UiPageShowAdditionalTabs: 'ui.page.show.additionalTabs',
  UiPageShowDependencyTab: 'ui.page.show.dependencyTab',
  UiPageCreateDefault: 'ui.page.create.Default',
  UiPageCreateIndex: 'ui.page.create.index',
  UiPageEditDefault: 'ui.page.edit.Default',
  UiPageEditIndex: 'ui.page.edit.index',
  UiPageListDefault: 'ui.page.list.Default',
  UiPageListFilter: 'ui.page.list.filter',
  UiPageListDefaultFilter: 'ui.page.list.DefaultFilter',
  UiPageListBreadcrumbs: 'ui.page.list.breadcrumbs',
  UiPageListIndex: 'ui.page.list.index',
  UiPageIcon: 'ui.page.icon',
  UiPageValidation: 'ui.page.validation',
  UiWidgetCount: 'ui.widget.count',
  UiWidgetList: 'ui.widget.list',
  // —— graph ——
  BackGraphEntityBaseTypeDefs: 'back.graph.entity.baseTypeDefs',
  BackGraphEntityAdditionalTypeDefs: 'back.graph.entity.additionalTypeDefs',
  BackGraphEntityBaseResolvers: 'back.graph.entity.baseResolvers',
  BackGraphEntityAdditionalResolvers: 'back.graph.entity.additionalResolvers',
  BackGraphEntityPermissionsToGraphql: 'back.graph.entity.permissionsToGraphql',
  BackGraphEntityBasePermissionsToGraphql: 'back.graph.entity.basePermissionsToGraphql',
  BackGraphEntityAdditionalPermissionsToGraphql: 'back.graph.entity.additionalPermissionsToGraphql',
  BackGraphHelpBaseTypeDefs: 'back.graph.help.baseTypeDefs',
  BackGraphHelpBaseResolvers: 'back.graph.help.baseResolvers',
  BackGraphHelpPermissionsToGraphql: 'back.graph.help.permissionsToGraphql',
  BackGraphPermissionsToGraphql: 'back.graph.permissionsToGraphql',
  BackServiceHelpService: 'back.service.helpService',
  BackGeneratedGraphqlTs: 'back.generated.graphqlTs',
  BackGeneratedGraphqlSchemaJson: 'back.generated.graphqlSchemaJson',
  UiGeneratedGraphqlTs: 'ui.generated.graphqlTs',
  UiGeneratedGraphqlSchemaJson: 'ui.generated.graphqlSchemaJson',
  SharedGraphqlSchemaJson: 'shared.generated.graphqlSchemaJson',
  BackConfig: 'back.config',
  BackRestRouter: 'back.rest.router',
  // —— additional services ——
  BackAdditionalServiceTypes: 'back.additionalService.types',
  BackAdditionalServiceGraphTypeDefs: 'back.additionalService.graph.typeDefs',
  BackAdditionalServiceGraphResolvers: 'back.additionalService.graph.resolvers',
  BackAdditionalServiceGraphPermissionsToGraphql:
    'back.additionalService.graph.permissionsToGraphql',
  BackAdditionalServices: 'back.additionalServices',
  // —— integration clients ——
  BackIntegrationClientClass: 'back.integrationClient.class',
  BackIntegrationClientTypes: 'back.integrationClient.types',
  BackIntegrationClientConstrictors: 'back.integrationClient.constrictors',
  BackIntegrationClients: 'back.integrationClients',
  // —— i18n ——
  UiI18nDocs: 'ui.i18n.docs',
  UiI18nCatalogs: 'ui.i18n.catalogs',
  UiI18nInfoRegistries: 'ui.i18n.infoRegistries',
  UiI18nSumRegistries: 'ui.i18n.sumRegistries',
  UiI18nReports: 'ui.i18n.reports',
  // —— enums & inits ——
  BackTypeEnum: 'back.type.enum',
  BackTypeEntityEnum: 'back.type.entityEnum',
  BackTypeDevEnum: 'back.type.devEnum',
  BackInitCommonEnum: 'back.init.common.enum',
  BackInitCommonEntities: 'back.init.common.entities',
  BackInitDevEnum: 'back.init.dev.enum',
  // —— ui adm shell ——
  UiResources: 'ui.resources',
  UiResourcesChunk0: 'ui.resourcesChunk0',
  UiResourcesChunk1: 'ui.resourcesChunk1',
  UiResourcesPage: 'ui.resourcesPage',
  UiMetaPage: 'ui.metaPage',
  UiEntityMapping: 'ui.entityMapping',
  UiGetDefaultMenu: 'ui.getDefaultMenu',
  UiGetAdditionalMenu: 'ui.getAdditionalMenu',
  UiMenuIcons: 'ui.menuIcons',
  UiAdditionalMenuIcons: 'ui.additionalMenuIcons',
  UiRoutes: 'ui.routes',
  UiAdditionalRoutes: 'ui.additionalRoutes',
  UiFunctions: 'ui.functions',
  UiDashboard: 'ui.dashboard',
  // —— environment / prisma / chart / ci ——
  BackClientsGetPrisma: 'back.clients.getPrisma',
  BackClientsCreatePgPrismaClient: 'back.clients.createPgPrismaClient',
  BackClientsGetQueue: 'back.clients.getQueue',
  BackIndex: 'back.index',
  BackTracing: 'back.tracing',
  BackInitPrismaWriteClientPackageStubs: 'back.init.prisma.writeClientPackageStubs',
  BackPrismaSchema: 'back.prisma.schema',
  BackPrismaShardsSchema: 'back.prisma.shards.schema',
  BackPrismaShardsDeployConnection: 'back.prisma.shards.deployConnection',
  BackPrismaShardsConfig: 'back.prisma.shards.config',
  BackPrismaShardsDeployConfig: 'back.prisma.shards.deployConfig',
  BackPrismaDeployConnection: 'back.prisma.deployConnection',
  BackPrismaConfig: 'back.prisma.config',
  BackPrismaDeployConfig: 'back.prisma.deployConfig',
  BackPrismaDatabaseSchema: 'back.prisma.database.schema',
  BackPrismaDatabaseDeployConnection: 'back.prisma.database.deployConnection',
  BackPrismaDatabaseConfig: 'back.prisma.database.config',
  BackPrismaDatabaseDeployConfig: 'back.prisma.database.deployConfig',
  BackPrismaDatabaseMigrationLock: 'back.prisma.database.migrationLock',
  BackChartChart: 'back.chart.chart',
  BackChartValues: 'back.chart.values',
  BackChartIngress: 'back.chart.ingress',
  BackChartBack: 'back.chart.back',
  BackGitlabCi: 'back.gitlabCi',
  BackCiNotify: 'back.ciNotify',
  BackDockerfile: 'back.dockerfile',
  UiApp: 'ui.app',
  UiLayoutMenu: 'ui.layout.menu',
  UiLayoutAppBar: 'ui.layout.appBar',
  UiSpacesContext: 'ui.contexts.spacesContext',
  UiDataProvider: 'ui.dataProvider',
  UiDataProviderGetAdditionalMethods: 'ui.dataProvider.getAdditionalMethods',
  UiI18nProvider: 'ui.i18nProvider',
  UiChartChart: 'ui.chart.chart',
  UiChartValues: 'ui.chart.values',
  UiChartFront: 'ui.chart.front',
  UiChartIngress: 'ui.chart.ingress',
  UiGitlabCi: 'ui.gitlabCi',
  UiCiNotify: 'ui.ciNotify',
  UiDockerfile: 'ui.dockerfile',
  // —— config / docs / bootstrap ——
  BackConfigDefaultJson: 'back.config.defaultJson',
  BackDocsConfiguration: 'back.docs.configuration',
  BackDocsSpec: 'back.docs.spec',
  BackDocsRestApi: 'back.docs.restApi',
  BackDocsIntegrationClient: 'back.docs.integrationClient',
  BackDocsEntity: 'back.docs.entity',
  UiDocsConfiguration: 'ui.docs.configuration',
  BackInitElasticGenJobs: 'back.init.elastic.genJobs',
  BackInitClickHouseGenJobs: 'back.init.clickhouse.genJobs',
} as const

export type GenerationPathCategory =
  (typeof GenerationPathCategory)[keyof typeof GenerationPathCategory]

export const GenerationPathParam = {
  entityName: 'entityName',
  ServiceName: 'ServiceName',
  pascalSingular: 'pascalSingular',
  PascalEntity: 'PascalEntity',
  camelPlural: 'camelPlural',
  OwnerPascal: 'OwnerPascal',
  FromFieldPascal: 'FromFieldPascal',
  serviceName: 'serviceName',
  ServicePascal: 'ServicePascal',
  clientName: 'clientName',
  ClientPascal: 'ClientPascal',
  restApiName: 'restApiName',
  entityTypePlural: 'entityTypePlural',
  langId: 'langId',
  database: 'database',
} as const

export type GenerationPathParam =
  (typeof GenerationPathParam)[keyof typeof GenerationPathParam]

export type GenerationPathTemplate = string

export type GenerationPathVars = Partial<Record<GenerationPathParam, string>>

export interface GenerationPathDefinition {
  root: GenerationPathRoot
  defaultTemplate: GenerationPathTemplate
  params: readonly GenerationPathParam[]
}

export type GenerationPathsRegistry = {
  [K in GenerationPathCategory]: GenerationPathDefinition
}

export interface GenerationPathsConfig {
  overrides: Partial<Record<GenerationPathCategory, GenerationPathTemplate>>
}

export interface ResolveGenerationPathArgs {
  category: GenerationPathCategory
  detachedBackProject: string
  detachedUiProject: string
  /** Monorepo `paths.shared`; falls back to back when omitted. */
  detachedSharedProject?: string
  pathsConfig?: GenerationPathsConfig | null
  vars: GenerationPathVars
}

const PLACEHOLDER_RE = /\{(\w+)\}/g

const generationPathParamValues = new Set<string>(Object.values(GenerationPathParam))

const serviceNameParams = [GenerationPathParam.ServiceName] as const

const uiPageParams = [
  GenerationPathParam.entityName,
  GenerationPathParam.pascalSingular,
] as const

const backHook = (hookFile: string): GenerationPathDefinition => ({
  root: 'back',
  defaultTemplate: `src/adm/services/{ServiceName}/hooks/${hookFile}.ts`,
  params: serviceNameParams,
})

const uiPage = (defaultTemplate: string, params: readonly GenerationPathParam[] = uiPageParams): GenerationPathDefinition => ({
  root: 'ui',
  defaultTemplate,
  params,
})

const camelPluralParams = [GenerationPathParam.camelPlural] as const

const backGraphEntity = (file: string): GenerationPathDefinition => ({
  root: 'back',
  defaultTemplate: `src/adm/graph/services/{camelPlural}/${file}.ts`,
  params: camelPluralParams,
})

export const DEFAULT_GENERATION_PATHS = {
  [GenerationPathCategory.BackHookBeforeCreate]: backHook('beforeCreate'),
  [GenerationPathCategory.BackHookAfterCreate]: backHook('afterCreate'),
  [GenerationPathCategory.BackHookBeforeUpdate]: backHook('beforeUpdate'),
  [GenerationPathCategory.BackHookAfterUpdate]: backHook('afterUpdate'),
  [GenerationPathCategory.BackHookBeforeDelete]: backHook('beforeDelete'),
  [GenerationPathCategory.BackHookAfterDelete]: backHook('afterDelete'),
  [GenerationPathCategory.BackHookBeforeUpsert]: backHook('beforeUpsert'),
  [GenerationPathCategory.BackHookChangeListFilter]: backHook('changeListFilter'),
  [GenerationPathCategory.BackHookAdditionalOperationsOnCreate]: backHook('additionalOperationsOnCreate'),
  [GenerationPathCategory.BackHookAdditionalOperationsOnUpdate]: backHook('additionalOperationsOnUpdate'),
  [GenerationPathCategory.BackHookAdditionalOperationsOnDelete]: backHook('additionalOperationsOnDelete'),
  [GenerationPathCategory.BackHookTenantIdRequiredHooks]: backHook('tenantIdRequiredHooks'),
  [GenerationPathCategory.BackHookInitUserHooks]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/{ServiceName}/initUserHooks.ts',
    params: serviceNameParams,
  },
  [GenerationPathCategory.BackHookInitBuiltInHooks]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/{ServiceName}/initBuiltInHooks.ts',
    params: serviceNameParams,
  },
  [GenerationPathCategory.BackServiceClass]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/{ServiceName}/{ServiceName}.ts',
    params: serviceNameParams,
  },
  [GenerationPathCategory.BackServiceAdditionalClass]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/{ServiceName}/Additional{ServiceName}.ts',
    params: serviceNameParams,
  },
  [GenerationPathCategory.BackServiceConfig]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/{ServiceName}/config.ts',
    params: serviceNameParams,
  },
  [GenerationPathCategory.BackServiceBaseServices]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/BaseServices.ts',
    params: [],
  },
  [GenerationPathCategory.BackServiceServiceConstrictors]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/serviceConstrictors.ts',
    params: [],
  },
  [GenerationPathCategory.UiPageShowMainTab]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Show/MainTab.tsx',
  ),
  [GenerationPathCategory.UiPageShowDefaultMainTab]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Show/DefaultMainTab.tsx',
  ),
  [GenerationPathCategory.UiPageShowDefaultEntityShow]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Show/Default{pascalSingular}Show.tsx',
  ),
  [GenerationPathCategory.UiPageShowDefaultActions]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Show/DefaultActions.tsx',
  ),
  [GenerationPathCategory.UiPageShowIndex]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Show/index.tsx',
  ),
  [GenerationPathCategory.UiPageShowAdditionalTabs]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Show/additionalTabs.tsx',
  ),
  [GenerationPathCategory.UiPageShowDependencyTab]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Show/tabs/{OwnerPascal}{FromFieldPascal}Tab.tsx',
    [
      GenerationPathParam.entityName,
      GenerationPathParam.pascalSingular,
      GenerationPathParam.OwnerPascal,
      GenerationPathParam.FromFieldPascal,
    ],
  ),
  [GenerationPathCategory.UiPageCreateDefault]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Create/Default{pascalSingular}Create.tsx',
  ),
  [GenerationPathCategory.UiPageCreateIndex]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Create/index.tsx',
  ),
  [GenerationPathCategory.UiPageEditDefault]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Edit/Default{pascalSingular}Edit.tsx',
  ),
  [GenerationPathCategory.UiPageEditIndex]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Edit/index.tsx',
  ),
  [GenerationPathCategory.UiPageListDefault]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}List/Default{pascalSingular}List.tsx',
  ),
  [GenerationPathCategory.UiPageListFilter]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}List/{pascalSingular}Filter.tsx',
  ),
  [GenerationPathCategory.UiPageListDefaultFilter]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}List/Default{pascalSingular}Filter.tsx',
  ),
  [GenerationPathCategory.UiPageListBreadcrumbs]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}List/{pascalSingular}ListBreadcrumbs.tsx',
  ),
  [GenerationPathCategory.UiPageListIndex]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}List/index.tsx',
  ),
  [GenerationPathCategory.UiPageIcon]: uiPage(
    'src/adm/pages/{entityName}/{pascalSingular}Icon.tsx',
  ),
  [GenerationPathCategory.UiPageValidation]: uiPage(
    'src/adm/pages/{entityName}/get{pascalSingular}Validation.tsx',
  ),
  [GenerationPathCategory.UiWidgetCount]: {
    root: 'ui',
    defaultTemplate: 'src/adm/widgets/count/Count{PascalEntity}Widget.tsx',
    params: [GenerationPathParam.PascalEntity],
  },
  [GenerationPathCategory.UiWidgetList]: {
    root: 'ui',
    defaultTemplate: 'src/adm/widgets/list/List{PascalEntity}Widget.tsx',
    params: [GenerationPathParam.PascalEntity],
  },
  [GenerationPathCategory.BackGraphEntityBaseTypeDefs]: backGraphEntity('baseTypeDefs'),
  [GenerationPathCategory.BackGraphEntityAdditionalTypeDefs]: backGraphEntity('additionalTypeDefs'),
  [GenerationPathCategory.BackGraphEntityBaseResolvers]: backGraphEntity('baseResolvers'),
  [GenerationPathCategory.BackGraphEntityAdditionalResolvers]: backGraphEntity('additionalResolvers'),
  [GenerationPathCategory.BackGraphEntityPermissionsToGraphql]: backGraphEntity('permissionsToGraphql'),
  [GenerationPathCategory.BackGraphEntityBasePermissionsToGraphql]: backGraphEntity('basePermissionsToGraphql'),
  [GenerationPathCategory.BackGraphEntityAdditionalPermissionsToGraphql]:
    backGraphEntity('additionalPermissionsToGraphql'),
  [GenerationPathCategory.BackGraphHelpBaseTypeDefs]: {
    root: 'back',
    defaultTemplate: 'src/adm/graph/services/help/baseTypeDefs.ts',
    params: [],
  },
  [GenerationPathCategory.BackGraphHelpBaseResolvers]: {
    root: 'back',
    defaultTemplate: 'src/adm/graph/services/help/baseResolvers.ts',
    params: [],
  },
  [GenerationPathCategory.BackGraphHelpPermissionsToGraphql]: {
    root: 'back',
    defaultTemplate: 'src/adm/graph/services/help/permissionsToGraphql.ts',
    params: [],
  },
  [GenerationPathCategory.BackGraphPermissionsToGraphql]: {
    root: 'back',
    defaultTemplate: 'src/adm/graph/permissionsToGraphql.ts',
    params: [],
  },
  [GenerationPathCategory.BackServiceHelpService]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/HelpService/HelpService.ts',
    params: [],
  },
  [GenerationPathCategory.BackGeneratedGraphqlTs]: {
    root: 'back',
    defaultTemplate: 'src/generated/graphql.ts',
    params: [],
  },
  [GenerationPathCategory.BackGeneratedGraphqlSchemaJson]: {
    root: 'back',
    defaultTemplate: 'src/generated/graphql.schema.json',
    params: [],
  },
  [GenerationPathCategory.UiGeneratedGraphqlTs]: {
    root: 'ui',
    defaultTemplate: 'src/generated/graphql.ts',
    params: [],
  },
  [GenerationPathCategory.UiGeneratedGraphqlSchemaJson]: {
    root: 'ui',
    defaultTemplate: 'src/generated/graphql.schema.json',
    params: [],
  },
  [GenerationPathCategory.SharedGraphqlSchemaJson]: {
    root: 'shared',
    defaultTemplate: 'src/graphql.schema.json',
    params: [],
  },
  [GenerationPathCategory.BackConfig]: {
    root: 'back',
    defaultTemplate: 'src/config/config.ts',
    params: [],
  },
  [GenerationPathCategory.BackRestRouter]: {
    root: 'back',
    defaultTemplate: 'src/rest/restRouter.ts',
    params: [],
  },
  [GenerationPathCategory.BackAdditionalServiceTypes]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/{ServiceName}/types.ts',
    params: serviceNameParams,
  },
  [GenerationPathCategory.BackAdditionalServiceGraphTypeDefs]: {
    root: 'back',
    defaultTemplate: 'src/adm/graph/services/{serviceName}/typeDefs.ts',
    params: [GenerationPathParam.serviceName],
  },
  [GenerationPathCategory.BackAdditionalServiceGraphResolvers]: {
    root: 'back',
    defaultTemplate: 'src/adm/graph/services/{serviceName}/resolvers.ts',
    params: [GenerationPathParam.serviceName],
  },
  [GenerationPathCategory.BackAdditionalServiceGraphPermissionsToGraphql]: {
    root: 'back',
    defaultTemplate: 'src/adm/graph/services/{serviceName}/permissionsToGraphql.ts',
    params: [GenerationPathParam.serviceName],
  },
  [GenerationPathCategory.BackAdditionalServices]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/AdditionalServices.ts',
    params: [],
  },
  [GenerationPathCategory.BackIntegrationClientClass]: {
    root: 'back',
    defaultTemplate: 'src/integrationClients/{clientName}/{ClientPascal}Client.ts',
    params: [GenerationPathParam.clientName, GenerationPathParam.ClientPascal],
  },
  [GenerationPathCategory.BackIntegrationClientTypes]: {
    root: 'back',
    defaultTemplate: 'src/integrationClients/{clientName}/types.ts',
    params: [GenerationPathParam.clientName],
  },
  [GenerationPathCategory.BackIntegrationClientConstrictors]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/integrationClientConstrictors.ts',
    params: [],
  },
  [GenerationPathCategory.BackIntegrationClients]: {
    root: 'back',
    defaultTemplate: 'src/adm/services/IntegrationClients.ts',
    params: [],
  },
  [GenerationPathCategory.UiI18nDocs]: {
    root: 'ui',
    defaultTemplate: 'src/i18n/{langId}/{langId}Docs.ts',
    params: [GenerationPathParam.langId],
  },
  [GenerationPathCategory.UiI18nCatalogs]: {
    root: 'ui',
    defaultTemplate: 'src/i18n/{langId}/{langId}Catalogs.ts',
    params: [GenerationPathParam.langId],
  },
  [GenerationPathCategory.UiI18nInfoRegistries]: {
    root: 'ui',
    defaultTemplate: 'src/i18n/{langId}/{langId}InfoRegistries.ts',
    params: [GenerationPathParam.langId],
  },
  [GenerationPathCategory.UiI18nSumRegistries]: {
    root: 'ui',
    defaultTemplate: 'src/i18n/{langId}/{langId}SumRegistries.ts',
    params: [GenerationPathParam.langId],
  },
  [GenerationPathCategory.UiI18nReports]: {
    root: 'ui',
    defaultTemplate: 'src/i18n/{langId}/{langId}Reports.ts',
    params: [GenerationPathParam.langId],
  },
  [GenerationPathCategory.BackTypeEnum]: {
    root: 'back',
    defaultTemplate: 'src/types/{pascalSingular}.ts',
    params: [GenerationPathParam.pascalSingular],
  },
  [GenerationPathCategory.BackTypeEntityEnum]: {
    root: 'back',
    defaultTemplate: 'src/types/Entity.ts',
    params: [],
  },
  [GenerationPathCategory.BackTypeDevEnum]: {
    root: 'back',
    defaultTemplate: 'src/types/Dev{pascalSingular}.ts',
    params: [GenerationPathParam.pascalSingular],
  },
  [GenerationPathCategory.BackInitCommonEnum]: {
    root: 'back',
    defaultTemplate: 'src/init/common/init{PascalEntity}.ts',
    params: [GenerationPathParam.PascalEntity],
  },
  [GenerationPathCategory.BackInitCommonEntities]: {
    root: 'back',
    defaultTemplate: 'src/init/common/initEntities.ts',
    params: [],
  },
  [GenerationPathCategory.BackInitDevEnum]: {
    root: 'back',
    defaultTemplate: 'src/init/dev/init{PascalEntity}.ts',
    params: [GenerationPathParam.PascalEntity],
  },
  [GenerationPathCategory.UiResources]: {
    root: 'ui',
    defaultTemplate: 'src/adm/resources.tsx',
    params: [],
  },
  [GenerationPathCategory.UiResourcesChunk0]: {
    root: 'ui',
    defaultTemplate: 'src/adm/resourcesChunk0.tsx',
    params: [],
  },
  [GenerationPathCategory.UiResourcesChunk1]: {
    root: 'ui',
    defaultTemplate: 'src/adm/resourcesChunk1.tsx',
    params: [],
  },
  [GenerationPathCategory.UiResourcesPage]: {
    root: 'ui',
    defaultTemplate: 'src/adm/ResourcesPage.tsx',
    params: [],
  },
  [GenerationPathCategory.UiMetaPage]: {
    root: 'ui',
    defaultTemplate: 'src/adm/MetaPage.tsx',
    params: [],
  },
  [GenerationPathCategory.UiEntityMapping]: {
    root: 'ui',
    defaultTemplate: 'src/adm/entityMapping.ts',
    params: [],
  },
  [GenerationPathCategory.UiGetDefaultMenu]: {
    root: 'ui',
    defaultTemplate: 'src/adm/getDefaultMenu.ts',
    params: [],
  },
  [GenerationPathCategory.UiGetAdditionalMenu]: {
    root: 'ui',
    defaultTemplate: 'src/adm/getAdditionalMenu.ts',
    params: [],
  },
  [GenerationPathCategory.UiMenuIcons]: {
    root: 'ui',
    defaultTemplate: 'src/uiLib/menu/menuIcons.ts',
    params: [],
  },
  [GenerationPathCategory.UiAdditionalMenuIcons]: {
    root: 'ui',
    defaultTemplate: 'src/adm/additionalMenuIcons.ts',
    params: [],
  },
  [GenerationPathCategory.UiRoutes]: {
    root: 'ui',
    defaultTemplate: 'src/adm/routes.tsx',
    params: [],
  },
  [GenerationPathCategory.UiAdditionalRoutes]: {
    root: 'ui',
    defaultTemplate: 'src/adm/additionalRoutes.tsx',
    params: [],
  },
  [GenerationPathCategory.UiFunctions]: {
    root: 'ui',
    defaultTemplate: 'src/adm/functions/Functions.tsx',
    params: [],
  },
  [GenerationPathCategory.UiDashboard]: {
    root: 'ui',
    defaultTemplate: 'src/adm/Dashboard.tsx',
    params: [],
  },
  [GenerationPathCategory.BackClientsGetPrisma]: {
    root: 'back',
    defaultTemplate: 'src/clients/getPrisma.ts',
    params: [],
  },
  [GenerationPathCategory.BackClientsCreatePgPrismaClient]: {
    root: 'back',
    defaultTemplate: 'src/clients/createPgPrismaClient.ts',
    params: [],
  },
  [GenerationPathCategory.BackClientsGetQueue]: {
    root: 'back',
    defaultTemplate: 'src/clients/queue/getQueue.ts',
    params: [],
  },
  [GenerationPathCategory.BackIndex]: {
    root: 'back',
    defaultTemplate: 'src/index.ts',
    params: [],
  },
  [GenerationPathCategory.BackTracing]: {
    root: 'back',
    defaultTemplate: 'src/tracing.ts',
    params: [],
  },
  [GenerationPathCategory.BackInitPrismaWriteClientPackageStubs]: {
    root: 'back',
    defaultTemplate: 'src/init/prisma/writeClientPackageStubs.ts',
    params: [],
  },
  [GenerationPathCategory.BackPrismaSchema]: {
    root: 'back',
    defaultTemplate: 'prisma/schema.prisma',
    params: [],
  },
  [GenerationPathCategory.BackPrismaShardsSchema]: {
    root: 'back',
    defaultTemplate: 'prisma/shards/schema.prisma',
    params: [],
  },
  [GenerationPathCategory.BackPrismaShardsDeployConnection]: {
    root: 'back',
    defaultTemplate: 'prisma/shards/deployConnection.prisma',
    params: [],
  },
  [GenerationPathCategory.BackPrismaShardsConfig]: {
    root: 'back',
    defaultTemplate: 'prisma/shards/prisma.config.ts',
    params: [],
  },
  [GenerationPathCategory.BackPrismaShardsDeployConfig]: {
    root: 'back',
    defaultTemplate: 'prisma/shards/deploy.prisma.config.ts',
    params: [],
  },
  [GenerationPathCategory.BackPrismaDeployConnection]: {
    root: 'back',
    defaultTemplate: 'prisma/deployConnection.prisma',
    params: [],
  },
  [GenerationPathCategory.BackPrismaConfig]: {
    root: 'back',
    defaultTemplate: 'prisma/prisma.config.ts',
    params: [],
  },
  [GenerationPathCategory.BackPrismaDeployConfig]: {
    root: 'back',
    defaultTemplate: 'prisma/deploy.prisma.config.ts',
    params: [],
  },
  [GenerationPathCategory.BackPrismaDatabaseSchema]: {
    root: 'back',
    defaultTemplate: 'prisma/databases/{database}/schema.prisma',
    params: [GenerationPathParam.database],
  },
  [GenerationPathCategory.BackPrismaDatabaseDeployConnection]: {
    root: 'back',
    defaultTemplate: 'prisma/databases/{database}/deployConnection.prisma',
    params: [GenerationPathParam.database],
  },
  [GenerationPathCategory.BackPrismaDatabaseConfig]: {
    root: 'back',
    defaultTemplate: 'prisma/databases/{database}/prisma.config.ts',
    params: [GenerationPathParam.database],
  },
  [GenerationPathCategory.BackPrismaDatabaseDeployConfig]: {
    root: 'back',
    defaultTemplate: 'prisma/databases/{database}/deploy.prisma.config.ts',
    params: [GenerationPathParam.database],
  },
  [GenerationPathCategory.BackPrismaDatabaseMigrationLock]: {
    root: 'back',
    defaultTemplate: 'prisma/databases/{database}/migrations/migration_lock.toml',
    params: [GenerationPathParam.database],
  },
  [GenerationPathCategory.BackChartChart]: {
    root: 'back',
    defaultTemplate: 'chart/Chart.yaml',
    params: [],
  },
  [GenerationPathCategory.BackChartValues]: {
    root: 'back',
    defaultTemplate: 'chart/values.yaml',
    params: [],
  },
  [GenerationPathCategory.BackChartIngress]: {
    root: 'back',
    defaultTemplate: 'chart/templates/ingress.yaml',
    params: [],
  },
  [GenerationPathCategory.BackChartBack]: {
    root: 'back',
    defaultTemplate: 'chart/templates/back.yaml',
    params: [],
  },
  [GenerationPathCategory.BackGitlabCi]: {
    root: 'back',
    defaultTemplate: '.gitlab-ci.yml',
    params: [],
  },
  [GenerationPathCategory.BackCiNotify]: {
    root: 'back',
    defaultTemplate: 'ci-notify.sh',
    params: [],
  },
  [GenerationPathCategory.BackDockerfile]: {
    root: 'back',
    defaultTemplate: 'Dockerfile',
    params: [],
  },
  [GenerationPathCategory.UiApp]: {
    root: 'ui',
    defaultTemplate: 'src/App.tsx',
    params: [],
  },
  [GenerationPathCategory.UiLayoutMenu]: {
    root: 'ui',
    defaultTemplate: 'src/layout/Menu.tsx',
    params: [],
  },
  [GenerationPathCategory.UiLayoutAppBar]: {
    root: 'ui',
    defaultTemplate: 'src/layout/AppBar.tsx',
    params: [],
  },
  [GenerationPathCategory.UiSpacesContext]: {
    root: 'ui',
    defaultTemplate: 'src/contexts/SpacesContext.tsx',
    params: [],
  },
  [GenerationPathCategory.UiDataProvider]: {
    root: 'ui',
    defaultTemplate: 'src/dataProvider/index.ts',
    params: [],
  },
  [GenerationPathCategory.UiDataProviderGetAdditionalMethods]: {
    root: 'ui',
    defaultTemplate: 'src/dataProvider/getAdditionalMethods.ts',
    params: [],
  },
  [GenerationPathCategory.UiI18nProvider]: {
    root: 'ui',
    defaultTemplate: 'src/i18nProvider/index.ts',
    params: [],
  },
  [GenerationPathCategory.UiChartChart]: {
    root: 'ui',
    defaultTemplate: 'chart/Chart.yaml',
    params: [],
  },
  [GenerationPathCategory.UiChartValues]: {
    root: 'ui',
    defaultTemplate: 'chart/values.yaml',
    params: [],
  },
  [GenerationPathCategory.UiChartFront]: {
    root: 'ui',
    defaultTemplate: 'chart/templates/front.yaml',
    params: [],
  },
  [GenerationPathCategory.UiChartIngress]: {
    root: 'ui',
    defaultTemplate: 'chart/templates/ingress.yaml',
    params: [],
  },
  [GenerationPathCategory.UiGitlabCi]: {
    root: 'ui',
    defaultTemplate: '.gitlab-ci.yml',
    params: [],
  },
  [GenerationPathCategory.UiCiNotify]: {
    root: 'ui',
    defaultTemplate: 'ci-notify.sh',
    params: [],
  },
  [GenerationPathCategory.UiDockerfile]: {
    root: 'ui',
    defaultTemplate: 'Dockerfile',
    params: [],
  },
  [GenerationPathCategory.BackConfigDefaultJson]: {
    root: 'back',
    defaultTemplate: 'config/default.json',
    params: [],
  },
  [GenerationPathCategory.BackDocsConfiguration]: {
    root: 'back',
    defaultTemplate: 'docs/configuration.md',
    params: [],
  },
  [GenerationPathCategory.BackDocsSpec]: {
    root: 'back',
    defaultTemplate: 'docs/spec.md',
    params: [],
  },
  [GenerationPathCategory.BackDocsRestApi]: {
    root: 'back',
    defaultTemplate: 'docs/restApis/{restApiName}.md',
    params: [GenerationPathParam.restApiName],
  },
  [GenerationPathCategory.BackDocsIntegrationClient]: {
    root: 'back',
    defaultTemplate: 'docs/integrationClients/{clientName}.md',
    params: [GenerationPathParam.clientName],
  },
  [GenerationPathCategory.BackDocsEntity]: {
    root: 'back',
    defaultTemplate: 'docs/{entityTypePlural}/{entityName}.md',
    params: [GenerationPathParam.entityTypePlural, GenerationPathParam.entityName],
  },
  [GenerationPathCategory.UiDocsConfiguration]: {
    root: 'ui',
    defaultTemplate: 'docs/configuration.md',
    params: [],
  },
  [GenerationPathCategory.BackInitElasticGenJobs]: {
    root: 'back',
    defaultTemplate: 'src/init/elastic/genJobs.ts',
    params: [],
  },
  [GenerationPathCategory.BackInitClickHouseGenJobs]: {
    root: 'back',
    defaultTemplate: 'src/init/clickhouse/genJobs.ts',
    params: [],
  },
} as const satisfies GenerationPathsRegistry

export const extractGenerationPathParams = (template: string): GenerationPathParam[] => {
  const found = new Set<GenerationPathParam>()
  const re = new RegExp(PLACEHOLDER_RE.source, 'g')
  let match: RegExpExecArray | null

  while ((match = re.exec(template)) !== null) {
    const name = match[1]
    if (!generationPathParamValues.has(name)) {
      throw new Error(`Unknown generation path placeholder "{${name}}"`)
    }
    found.add(name as GenerationPathParam)
  }

  return [...found]
}

export const validateGenerationPathTemplate = (template: string): void => {
  extractGenerationPathParams(template)
}

const substituteGenerationPathParams = (
  template: string,
  placeholders: readonly GenerationPathParam[],
  vars: GenerationPathVars,
): string => {
  let result = template
  for (const param of placeholders) {
    result = result.split(`{${param}}`).join(vars[param]!)
  }
  return result
}

export function resolveGenerationPath(args: ResolveGenerationPathArgs): string {
  const {
    category,
    detachedBackProject,
    detachedUiProject,
    detachedSharedProject,
    pathsConfig,
    vars,
  } = args

  const definition = DEFAULT_GENERATION_PATHS[category]
  const template = pathsConfig?.overrides?.[category] ?? definition.defaultTemplate

  validateGenerationPathTemplate(template)

  const placeholders = extractGenerationPathParams(template)
  const requiredParams = new Set<GenerationPathParam>([
    ...definition.params,
    ...placeholders,
  ])

  for (const param of requiredParams) {
    const value = vars[param]
    if (value === undefined || value === '') {
      throw new Error(
        `Missing generation path variable "{${param}}" for category "${category}"`,
      )
    }
  }

  const relativePath = substituteGenerationPathParams(template, placeholders, vars)
  const rootDir =
    definition.root === 'back'
      ? detachedBackProject
      : definition.root === 'ui'
        ? detachedUiProject
        : (detachedSharedProject || detachedBackProject)

  return join(rootDir, relativePath)
}

/** Parent of `count`/`list` under widgets — derived from UiWidgetCount template. */
export function resolveUiWidgetsDir(args: {
  detachedBackProject: string
  detachedUiProject: string
  pathsConfig?: GenerationPathsConfig | null
}): string {
  const samplePath = resolveGenerationPath({
    category: GenerationPathCategory.UiWidgetCount,
    detachedBackProject: args.detachedBackProject,
    detachedUiProject: args.detachedUiProject,
    pathsConfig: args.pathsConfig,
    vars: {PascalEntity: '_'},
  })
  return join(samplePath, '..', '..')
}

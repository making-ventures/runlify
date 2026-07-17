import {join} from 'path'

/** Корень артефакта генерации */
export type GenerationPathRoot = 'back' | 'ui'

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
  const rootDir = definition.root === 'back' ? detachedBackProject : detachedUiProject

  return join(rootDir, relativePath)
}

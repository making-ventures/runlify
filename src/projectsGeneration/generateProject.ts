import {join} from 'path'
import {uiResourcesTmpl} from './generators/fileTemplates/ui/resources'
import {uiResourcesPageTmpl} from './generators/fileTemplates/ui/ResourcesPage'
import {backPermissionToGraphqlTmpl} from './generators/fileTemplates/back/graph/permissionsToGraphql'
import uiRoutesTmpl from './generators/fileTemplates/ui/environment/src/routes'
import {uiEntityMappingTmpl} from './generators/fileTemplates/ui/entityMapping'
import uiDashboardTmpl from './generators/fileTemplates/ui/Dashboard'
import {uiFunctionsTmpl} from './generators/fileTemplates/ui/functions/Functions'
import {uiGetDefaultMenuTmpl} from './generators/fileTemplates/ui/getDefaultMenu'
import {generateEnvironment} from './generateEnvironment'
import {configItemsTmpl} from './generators/fileTemplates/back/root/config/config'
import {genGraphSchemesByLocalGenerator} from './genGraphSchemesByLocalGenerator'
import {BootstrapEntityInnerOptions, defaultBootstrapEntityOptions, FileCreator} from './types'
import {restRouterTmpl} from './generators/fileTemplates/back/root/restRouter'
import {createFilesToWriteUtils, writeFiles} from './utils'
import {uiAdditionalRoutesTmpl} from './generators/fileTemplates/ui/additionalRoutes'
import {uiGetAdditionalMenuTmpl} from './generators/fileTemplates/ui/getAdditionalMenu'
import {uiMetaPageTmpl} from './generators/fileTemplates/ui/MetaPage'
import {additionalServicesTmpl} from './generators/fileTemplates/back/services/AdditionalServices'
import {System} from './builders/buildedTypes'
import {uiTranslationsLangDocsTmpl} from './generators/fileTemplates/ui/i18n/lang/uiLangDocsTmpl'
import {cwd} from 'fs-jetpack'
import {uiTranslationsLangReportsTmpl} from './generators/fileTemplates/ui/i18n/lang/uiLangReportsTmpl'
import {uiEntityIconTmpl} from './generators/fileTemplates/ui/pages/Icon'
import {camelPlural, pascal, pascalPlural, pascalSingular} from '../utils/cases'
import {uiTranslationsLangCatalogsTmpl} from './generators/fileTemplates/ui/i18n/lang/uiLangCatalogsTmpl'
import {uiTranslationsLangInfoRegistriesTmpl} from './generators/fileTemplates/ui/i18n/lang/uiLangInfoRegistriesTmpl'
import {uiTranslationsLangSumRegistriesTmpl} from './generators/fileTemplates/ui/i18n/lang/uiLangSumRegistriesTmpl'
import {
  EntityWideGenerationArgs,
  prepareAdditionalServiceWideGenerationArgs,
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
  ProjectWideGenerationArgs,
} from './args'
import {backDefaultEnv} from './generators/fileTemplates/back/environment/defaultEnv'
import backDocsConfiguration from './generators/fileTemplates/back/environment/docs/backDocsConfiguration'
import {adminAppDocsConfiguration} from './generators/fileTemplates/ui/environment/docs/adminAppDocsConfiguration'
import backDocsRestApi from './generators/fileTemplates/back/environment/docs/backDocsRestApi'
import backDocsEntity from './generators/fileTemplates/back/environment/docs/backDocsEntity'
import {plural, singular} from 'pluralize'
import baseResolversTmpl from './generators/fileTemplates/back/graph/help/baseResolvers'
import helpServiceTmpl from './generators/fileTemplates/back/services/HelpService/HelpService'
import graphBaseServicesTmpl from './generators/fileTemplates/back/services/BaseServices'
import baseTypeDefsTmpl from './generators/fileTemplates/back/graph/help/baseTypeDefs'
import permissionsToGraphqlTmpl from './generators/fileTemplates/back/graph/help/permissionsToGraphql'
import {enumTmpl} from './generators/fileTemplates/back/enum'
import {devEnumTmpl} from './generators/fileTemplates/back/devEnum'
import {initCommonEnumTmpl} from './generators/fileTemplates/back/initCommon'
import {initDevEnumTmpl} from './generators/fileTemplates/back/initDev'
import graphServiceConstrictorsTmpl from './generators/fileTemplates/back/services/serviceConstrictors'
import {backEntitiesEnumTmpl} from './generators/fileTemplates/back/backEntitiesEnumTmpl'
import {initEntities} from './generators/fileTemplates/back/initEntities'
import {uiGetEntityValidationTmpl} from './generators/fileTemplates/ui/pages/getEntityValidation'
import {generateBackElasticBootstrap} from './generators/fileTemplates/back/elastic/elastic';
import backDocsIntegrationClient from './generators/fileTemplates/back/environment/docs/backDocsIntegrationClient'
import backIntegrationClientTmpl from './generators/fileTemplates/back/environment/src/integrationClients/IntegrationClient'
import {pascalCase} from 'change-case'
import backIntegrationClientTypesTmpl from './generators/fileTemplates/back/environment/src/integrationClients/types'
import backDocSpec from './generators/fileTemplates/back/environment/docs/backDocSpec'
import {generateAdditionalService} from './generateAdditionalService'
import genIntegrationClientsTmpl from './generators/fileTemplates/back/environment/src/integrationClients/IntegrationClients'
import genIntegrationClientConstrictorsTmpl from './generators/fileTemplates/back/environment/src/integrationClients/integrationClientConstrictors'
import cleanFiles from './fileCleaners/cleanFiles'
import {uiListWidgetTmpl} from './generators/fileTemplates/ui/widgets/list/ListWidget'
import {uiCountWidgetTmpl} from './generators/fileTemplates/ui/widgets/count/CountWidget'
import {uiEntityShowIndexTmpl} from './generators/fileTemplates/ui/pages/EntityShow'
import {uiDefaultEditTmpl} from './generators/fileTemplates/ui/pages/EntityEdit/DefaultEntityEdit'
import {uiDefaultCreateTmpl} from './generators/fileTemplates/ui/pages/EntityCreate/DefaultEntityCreate'
import {uiDefaultListTmpl} from './generators/fileTemplates/ui/pages/EntityList/DefaultEntityList'
import {uiFilterTmpl} from './generators/fileTemplates/ui/pages/EntityList/EntityFilter'
import {uiEditTmpl} from './generators/fileTemplates/ui/pages/EntityEdit'
import {uiCreateTmpl} from './generators/fileTemplates/ui/pages/EntityCreate'
import {uiListTmpl} from './generators/fileTemplates/ui/pages/EntityList'
import {getLinksFromExternalEntities} from './links/getLinksFromExternalEntities'
import {uiDefaultShowTmpl} from './generators/fileTemplates/ui/pages/EntityShow/DefaultEntityShow'
import {uiDefaultFilterTmpl} from './generators/fileTemplates/ui/pages/EntityList/DefaultEntityFilter'
import {uiListBreadcrumbsTmpl} from './generators/fileTemplates/ui/pages/EntityList/EntityBreadcrumbs'
import {uiEntityShowMainTabTmpl} from './generators/fileTemplates/ui/pages/EntityShow/MainTab'
import {uiEntityShowDefaultMainTabTmpl} from './generators/fileTemplates/ui/pages/EntityShow/DefaultMainTab'
import {uiEntityShowDependencyTabTmpl} from './generators/fileTemplates/ui/pages/EntityShow/DependencyTab'
import {uiDefaultActionTmpl} from './generators/fileTemplates/ui/pages/EntityShow/DefaultActions'
import {uiAdditionalTabsTmpl} from './generators/fileTemplates/ui/pages/EntityShow/additionalTabs'
import {backBaseTypesTmpl} from './generators/fileTemplates/back/graph/types'
import {backBaseResolversTmpl} from './generators/fileTemplates/back/graph/resolvers'
import {genGraphCrudSchema} from './generators/graph/genGraphCrudSchema'
import {printSchema} from 'graphql'
import {backAdditionalResolversTmpl} from './generators/fileTemplates/back/graph/additionalResolvers'
import {backEntityPermissionToGraphqlTmpl} from './generators/fileTemplates/back/graph/entityPermissionToGraphqlTmpl'
import {backEntityAdditionalPermissionToGraphqlTmpl} from './generators/fileTemplates/back/graph/entityAdditionalPermissionToGraphqlTmpl'
import {backBasePermissionToGraphqlTmpl} from './generators/fileTemplates/back/graph/entityBasePermissionToGraphql'
import {backAdditionalTypesTmpl} from './generators/fileTemplates/back/graph/additionalTypes'
import {additionalOperationsOnCreateTmpl} from './generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnCreate'
import {additionalOperationsOnDeleteTmpl} from './generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnDelete'
import {additionalOperationsOnUpdateTmpl} from './generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnUpdate'
import {afterCreateTmpl} from './generators/fileTemplates/back/services/entity/hooks/afterCreate'
import {beforeCreateTmpl} from './generators/fileTemplates/back/services/entity/hooks/beforeCreate'
import {beforeUpdateTmpl} from './generators/fileTemplates/back/services/entity/hooks/beforeUpdate'
import {afterUpdateTmpl} from './generators/fileTemplates/back/services/entity/hooks/afterUpdate'
import {afterDeleteTmpl} from './generators/fileTemplates/back/services/entity/hooks/afterDelete'
import {beforeDeleteTmpl} from './generators/fileTemplates/back/services/entity/hooks/beforeDelete'
import {beforeUpsertTmpl} from './generators/fileTemplates/back/services/entity/hooks/beforeUpsert'
import {changeListFilterTmpl} from './generators/fileTemplates/back/services/entity/hooks/changeListFilter'
import {initUserHooksTmpl} from './generators/fileTemplates/back/services/entity/initUserHooks'
import {initBuiltInHooksTmpl} from './generators/fileTemplates/back/services/entity/initBuiltInHooks'
import {tenantIdRequiredHooksTmpl} from './generators/fileTemplates/back/services/entity/hooks/tenantIdRequiredHooks'
import {configTmpl} from './generators/fileTemplates/back/services/entity/config'
import {prismaServiceBaseClassTmpl} from './generators/fileTemplates/back/services/entity/class'
import {prismaAdditionalServiceClassTmpl} from './generators/fileTemplates/back/services/entity/additionalClass'

const generateHelpService = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
  typesOnly = false,
) => {
  fileCreator.create(
    join(
      args.options.detachedBackProject,
      'src',
      'adm',
      'graph',
      'services',
      'help',
      'baseTypeDefs.ts'
    ),
    baseTypeDefsTmpl(args)
  )
  if (!typesOnly) {
    fileCreator.create(
      join(
        args.options.detachedBackProject,
        'src',
        'adm',
        'graph',
        'services',
        'help',
        'baseResolvers.ts'
      ),
      baseResolversTmpl()
    )
    fileCreator.create(
      join(
        args.options.detachedBackProject,
        'src',
        'adm',
        'graph',
        'services',
        'help',
        'permissionsToGraphql.ts'
      ),
      permissionsToGraphqlTmpl()
    )
    fileCreator.create(
      join(
        args.options.detachedBackProject,
        'src',
        'adm',
        'services',
        'HelpService',
        'HelpService.ts'
      ),
      helpServiceTmpl(args)
    )
  }
}

const generateEntityBackServices = async (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    allSumRegistries,
    allInfoRegistries,
    entity,
    options,
  } = args;

  if (options.genPrismaServices && !options.typesOnly) {
    const serviceName = `${pascalPlural(entity.name)}Service`;
    const serviceDir = join(options.detachedBackProject, 'src', 'adm', 'services', serviceName);
    const servicePath = join(serviceDir, `${serviceName}.ts`);
    const configPath = join(serviceDir, `config.ts`);
    const additionalServicePath = join(serviceDir, `Additional${serviceName}.ts`);

    const additionalClassService = prismaAdditionalServiceClassTmpl(args);
    fileCreator.createIfNotExists(additionalServicePath, additionalClassService);

    const generatedClassService = prismaServiceBaseClassTmpl(args);
    fileCreator.create(servicePath, generatedClassService);

    const config = configTmpl(
      args,
      allSumRegistries,
      allInfoRegistries,
    );
    fileCreator.create(configPath, config);

    fileCreator.createIfNotExists(
      join(serviceDir, 'initUserHooks.ts'),
      initUserHooksTmpl(args)
    );

    const hooksDir = join(serviceDir, 'hooks');
    if (['optional', 'required'].includes(entity.multitenancy)) {
      if (
        !args.entities.some(
          (entity) => entity.name === 'tenants'
        )
      ) {
        throw new Error('Tenants entity not presented, you can\'t use tenants in project');
      }

      fileCreator.create(
        join(hooksDir, 'tenantIdRequiredHooks.ts'),
        tenantIdRequiredHooksTmpl(args)
      );
    }

    fileCreator.create(
      join(serviceDir, 'initBuiltInHooks.ts'),
      initBuiltInHooksTmpl(args)
    );

    if (!entity.elasticOnly) {
      fileCreator.createIfNotExists(
        join(hooksDir, 'additionalOperationsOnCreate.ts'),
        additionalOperationsOnCreateTmpl(args)
      );
      fileCreator.createIfNotExists(
        join(hooksDir, 'additionalOperationsOnUpdate.ts'),
        additionalOperationsOnUpdateTmpl(args)
      );
      fileCreator.createIfNotExists(
        join(hooksDir, 'additionalOperationsOnDelete.ts'),
        additionalOperationsOnDeleteTmpl(args)
      );
    }

    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeCreate.ts'),
      beforeCreateTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeDelete.ts'),
      beforeDeleteTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeUpdate.ts'),
      beforeUpdateTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeUpsert.ts'),
      beforeUpsertTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'afterCreate.ts'),
      afterCreateTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'afterUpdate.ts'),
      afterUpdateTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'afterDelete.ts'),
      afterDeleteTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'changeListFilter.ts'),
      changeListFilterTmpl(args)
    );
  }
}

const generateEntityBackGraph = async (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
  } = args;

  const graphServiceDir = join(
    options.detachedBackProject,
    'src',
    'adm',
    'graph',
    'services',
    camelPlural(entity.name)
  );

  // Graph schema
  if (options.genGraphSchema) {
    fileCreator.create(
      join(graphServiceDir, 'baseTypeDefs.ts'),
      backBaseTypesTmpl(printSchema(genGraphCrudSchema(entity)), options)
    );

    fileCreator.createIfNotExists(
      join(graphServiceDir, 'additionalTypeDefs.ts'),
      backAdditionalTypesTmpl()
    );
  }

  if (!options.typesOnly) {
    // Graph resolvers
    if (options.genGraphResolvers) {
      fileCreator.create(
        `${graphServiceDir}/baseResolvers.ts`,
        backBaseResolversTmpl(args)
      );
      fileCreator.createIfNotExists(
        `${graphServiceDir}/additionalResolvers.ts`,
        backAdditionalResolversTmpl()
      );
    }

    // Permissions
    fileCreator.create(
      `${graphServiceDir}/permissionsToGraphql.ts`,
      backEntityPermissionToGraphqlTmpl(args)
    );
    fileCreator.create(
      `${graphServiceDir}/basePermissionsToGraphql.ts`,
      backBasePermissionToGraphqlTmpl(args)
    );
    fileCreator.create(
      `${graphServiceDir}/additionalPermissionsToGraphql.ts`,
      backEntityAdditionalPermissionToGraphqlTmpl(args)
    );
  }
}

export const generateBackSrc = async (fileCreator: FileCreator, args: ProjectWideGenerationArgs, typesOnly: boolean) => {
  if (!typesOnly) {
    await Promise.all([
      fileCreator.create(
        join(args.options.detachedBackProject, 'src', 'config', 'config.ts'),
        configItemsTmpl(args)
      ),
      generateBackIntegrationClients(fileCreator, args),
    ]);
  }

  await Promise.all([
    ...args.entities.flatMap((entity) => [
      generateEntityBackServices(fileCreator, prepareEntityWideGenerationArgs(args, entity)),
      generateEntityBackGraph(fileCreator, prepareEntityWideGenerationArgs(args, entity)),
    ]),
    generateHelpService(fileCreator, args, typesOnly),
  ]);
}

export const generateBackIntegrationClients = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const client of args.system.integrationClients) {
    const clientFolder = join(
      args.options.detachedBackProject,
      'src',
      'integrationClients',
      `${client.name}`,
    )

    fileCreator.createIfNotExists(join(clientFolder, `${pascalCase(client.name)}Client.ts`), backIntegrationClientTmpl(args, client));
    fileCreator.create(join(clientFolder, `types.ts`), backIntegrationClientTypesTmpl(args, client));
  }
}

export const generateBackEnvs = async (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const filePath = join(
    args.options.detachedBackProject,
    'config',
    'default.json'
  )

  fileCreator.create(filePath, backDefaultEnv(args))
}

export const generateBackDocsConfiguration = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'docs',
    'configuration.md'
  )

  fileCreator.create(filePath, backDocsConfiguration(args))
}

export const generateBackDocsSpec = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'docs',
    'spec.md'
  )

  fileCreator.create(filePath, backDocSpec(args))
}

export const generateBackDocsRestApis = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const restApi of args.system.restApis) {
    const filePath = join(
      args.options.detachedBackProject,
      'docs',
      'restApis',
      `${restApi.name}.md`
    )

    fileCreator.create(filePath, backDocsRestApi(args, restApi))
  }
}

export const generateBackDocsIntegrationClients = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const client of args.system.integrationClients) {
    const filePath = join(
      args.options.detachedBackProject,
      'docs',
      'integrationClients',
      `${client.name}.md`
    )

    fileCreator.create(filePath, backDocsIntegrationClient(args, client))
  }
}

export const generateBackDocsEntities = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  await Promise.all(
    args.entities.map((entity) => {
      const filePath = join(
        args.options.detachedBackProject,
        'docs',
        plural(entity.type),
        `${entity.name}.md`
      )

      return fileCreator.create(
        filePath,
        backDocsEntity(prepareEntityWideGenerationArgs(args, entity))
      )
    })
  )
}

export const generateBackEnums = async (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  await Promise.all(
    args.entities
      .filter((e) => e.predefinedElements.length > 0)
      .map((entity) => {
        const filePath = join(
          args.options.detachedBackProject,
          'src',
          'types',
          `${pascal(singular(entity.name))}.ts`
        )

        return fileCreator.create(
          filePath,
          enumTmpl({
            entity,
            options: args.options,
          } as EntityWideGenerationArgs)
        )
      })
  )
}

export const generateBackEntityEnum = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'src',
    'types',
    'Entity.ts'
  )

  return fileCreator.create(
    filePath,
    backEntitiesEnumTmpl({
      entities: args.entities,
      options: args.options,
    } as ProjectWideGenerationArgs)
  )
}

export const generateBackEnumsInit = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  await Promise.all(
    args.entities
      .filter((e) => e.predefinedElements.length > 0)
      .map((entity) => {
        const filePath = join(
          args.options.detachedBackProject,
          'src',
          'init',
          'common',
          `init${pascal(entity.name)}.ts`
        )

        return fileCreator.create(
          filePath,
          initCommonEnumTmpl({
            entity,
            options: args.options,
          } as EntityWideGenerationArgs)
        )
      })
  )
}

export const generateBackEntitiesEnumInit = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'src',
    'init',
    'common',
    'initEntities.ts'
  )

  return fileCreator.create(filePath, initEntities(args))
}

export const generateBackDevEnums = async (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  await Promise.all(
    args.entities
      .filter((e) => e.devPerefinedElements.length > 0)
      .map((entity) => {
        const filePath = join(
          args.options.detachedBackProject,
          'src',
          'types',
          `Dev${pascal(singular(entity.name))}.ts`
        )

        return fileCreator.create(
          filePath,
          devEnumTmpl({
            entity,
            options: args.options,
          } as EntityWideGenerationArgs)
        )
      })
  )
}

export const generateBackDevEnumsInit = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  await Promise.all(
    args.entities
      .filter((e) => e.devPerefinedElements.length > 0)
      .map((entity) => {
        const filePath = join(
          args.options.detachedBackProject,
          'src',
          'init',
          'dev',
          `init${pascal(entity.name)}.ts`
        )

        return fileCreator.create(
          filePath,
          initDevEnumTmpl({
            entity,
            options: args.options,
          } as EntityWideGenerationArgs)
        )
      })
  );
}

export const generateAdminAppDocsConfiguration = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedUiProject,
    'docs',
    'configuration.md'
  )

  fileCreator.create(filePath, adminAppDocsConfiguration(args))
}

export const generateBackDocs = async (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  await Promise.all([
    generateBackDocsSpec(fileCreator, args),
    generateBackDocsConfiguration(fileCreator, args),
    generateBackDocsRestApis(fileCreator, args),
    generateBackDocsIntegrationClients(fileCreator, args),
    generateBackDocsEntities(fileCreator, args),
    generateBackEnums(fileCreator, args),
    generateBackEnumsInit(fileCreator, args),
    generateBackEntityEnum(fileCreator, args),
    generateBackEntitiesEnumInit(fileCreator, args),
    generateBackDevEnums(fileCreator, args),
    generateBackDevEnumsInit(fileCreator, args),
    generateAdminAppDocsConfiguration(fileCreator, args),
  ]);
}

export const generateBack = async (fileCreator: FileCreator, args: ProjectWideGenerationArgs, typesOnly: boolean) => {
  if (!typesOnly) {
    await Promise.all([
      generateBackEnvs(fileCreator, args),
      generateBackDocs(fileCreator, args),
      generateBackElasticBootstrap(fileCreator, args),
    ]);
  }

  generateBackSrc(fileCreator, args, typesOnly);
}

export const generateFrontSrcEntityTranslationsDocs = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Docs.ts`
    )

    fileCreator.create(filePath, uiTranslationsLangDocsTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsCatalogs = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Catalogs.ts`
    )

    fileCreator.create(filePath, uiTranslationsLangCatalogsTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsInfoRegistries = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}InfoRegistries.ts`
    )

    fileCreator.create(filePath, uiTranslationsLangInfoRegistriesTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsSumRegistries = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}SumRegistries.ts`
    )

    fileCreator.create(filePath, uiTranslationsLangSumRegistriesTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsReports = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Reports.ts`
    )

    fileCreator.create(filePath, uiTranslationsLangReportsTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityIcon = async (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity: { name },
  } = args

  const filePath = join(
    args.options.detachedUiProject,
    `src/adm/pages/${name}/${pascalSingular(name)}Icon.tsx`
  )

  fileCreator.create(filePath, uiEntityIconTmpl(args))
}

export const generateFrontSrcGetEntityValidation = async (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity: { name },
  } = args

  const filePath = join(
    args.options.detachedUiProject,
    `src/adm/pages/${name}/get${pascalSingular(name)}Validation.tsx`
  )

  fileCreator.create(filePath, uiGetEntityValidationTmpl(args))
}

export const generateFrontSrcEntity = async (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  await Promise.all([
    generateFrontSrcEntityIcon(fileCreator, args),
    generateFrontSrcGetEntityValidation(fileCreator, args),
  ]);
}

export const generateFrontSrcTranslations = async (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  await Promise.all([
    generateFrontSrcEntityTranslationsDocs(fileCreator, args),
    generateFrontSrcEntityTranslationsCatalogs(fileCreator, args),
    generateFrontSrcEntityTranslationsSumRegistries(fileCreator, args),
    generateFrontSrcEntityTranslationsInfoRegistries(fileCreator, args),
    generateFrontSrcEntityTranslationsReports(fileCreator, args),
  ]);
}


const generateEntityUiWidgets = async (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
  } = args;

  if (!options.typesOnly) {
    const widgetsDir = join(options.detachedUiProject, 'src', 'adm', 'widgets');

    // CountWidget
    if (options.genUiCountWidget) {
      const countWdgetsDir = join(widgetsDir, 'count');

      const generatedResources = uiCountWidgetTmpl(args);

      fileCreator.create(
        join(countWdgetsDir, `Count${pascal(entity.name)}Widget.tsx`),
        generatedResources
      );
    }

    // ListWidget
    if (options.genUiListWidget) {
      const listWdgetsDir = join(widgetsDir, 'list');

      const generatedResources = uiListWidgetTmpl(args);

      fileCreator.create(
        join(listWdgetsDir, `List${pascal(entity.name)}Widget.tsx`),
        generatedResources
      );
    }
  }
}

const generateEntityUiShow = async (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    allEntities,
    entity,
    options,
    allLinks,
  } = args;

  if (!options.typesOnly && options.forms.show) {
    const toLinks = getLinksFromExternalEntities(entity, allLinks);

    const entityShowDir = join(
      options.detachedUiProject,
      'src',
      'adm',
      'pages',
      entity.name,
      `${pascalSingular(entity.name)}Show`,
    );

    // MainTab
    const mainTab = uiEntityShowMainTabTmpl();
    fileCreator.createIfNotExists(join(entityShowDir, 'MainTab.tsx'), mainTab);

    // DefaultMainTab
    const defaultMainTab = uiEntityShowDefaultMainTabTmpl(
      args
    );
    fileCreator.create(join(entityShowDir, 'DefaultMainTab.tsx'), defaultMainTab);

    // DefaultEntityShow
    fileCreator.create(
      join(entityShowDir, `Default${pascalSingular(entity.name)}Show.tsx`),
      uiDefaultShowTmpl(args)
    );

    // DefaultActions
    fileCreator.create(
      join(entityShowDir, 'DefaultActions.tsx'),
      uiDefaultActionTmpl(args)
    );

    // index
    fileCreator.createIfNotExists(
      join(entityShowDir, 'index.tsx'),
      uiEntityShowIndexTmpl(args)
    );

    const additionalTabs = uiAdditionalTabsTmpl();
    fileCreator.createIfNotExists(
      join(entityShowDir, 'additionalTabs.tsx'),
      additionalTabs
    );

    // DependencyTabs
    for (const link of toLinks) {
      const tabsDir = join(entityShowDir, 'tabs');

      const entity = allEntities.get(link.entityOwnerName);

      if (!entity) {
        throw new Error(`The is no "${link.entityOwnerName}" entity`);
      }

      const componentName = `${pascal(entity.name)}${pascal(
        link.fromField.name
      )}Tab`;

      const dependencyTab = uiEntityShowDependencyTabTmpl(
        allEntities,
        entity,
        link,
        options
      );
      fileCreator.create(join(tabsDir, `${componentName}.tsx`), dependencyTab);
    }
  }
}

const generateEntityUiCreate = async (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
  } = args;

  if (!options.typesOnly && options.forms.create) {
    const entityCreateDir = join(
      options.detachedUiProject,
      'src',
      'adm',
      'pages',
      entity.name,
      `${pascalSingular(entity.name)}Create`
    );

    fileCreator.create(
      join(
        entityCreateDir,
        `Default${pascalSingular(entity.name)}Create.tsx`
      ),
      uiDefaultCreateTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(entityCreateDir, 'index.tsx'),
      uiCreateTmpl(args)
    );
  }
}

const generateEntityUiEdit = async (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
  } = args;

  if (!options.typesOnly && options.forms.edit) {
    const entityEditDir = join(
      options.detachedUiProject,
      'src',
      'adm',
      'pages',
      entity.name,
      `${pascalSingular(entity.name)}Edit`,
    );

    fileCreator.create(
      join(entityEditDir, `Default${pascalSingular(entity.name)}Edit.tsx`),
      uiDefaultEditTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(entityEditDir, 'index.tsx'),
      uiEditTmpl(args)
    );
  }
}

const generateEntityUiList = async (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
  } = args;

  if (!options.typesOnly && options.forms.list) {
    const entityListDir = join(
      options.detachedUiProject,
      'src',
      'adm',
      'pages',
      entity.name,
      `${pascalSingular(entity.name)}List`,
    );

    fileCreator.create(
      join(entityListDir, `Default${pascalSingular(entity.name)}List.tsx`),
      uiDefaultListTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(entityListDir, `${pascalSingular(entity.name)}Filter.tsx`),
      uiFilterTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(entityListDir, `${pascalSingular(entity.name)}ListBreadcrumbs.tsx`),
      uiListBreadcrumbsTmpl(args)
    );
    fileCreator.create(
      join(entityListDir, `Default${pascalSingular(entity.name)}Filter.tsx`),
      uiDefaultFilterTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(entityListDir, 'index.tsx'),
      uiListTmpl(args)
    );
  }
}

const generateEntityUiPages = async (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  generateEntityUiShow(fileCreator, args);
  generateEntityUiCreate(fileCreator, args);
  generateEntityUiEdit(fileCreator, args);
  generateEntityUiList(fileCreator, args);
}

export const generateFrontSrc = async (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  await Promise.all([
    ...args.entities.flatMap((entity) => [
      generateFrontSrcEntity(fileCreator, prepareEntityWideGenerationArgs(args, entity)),
      generateEntityUiWidgets(fileCreator, prepareEntityWideGenerationArgs(args, entity)),
      generateEntityUiPages(fileCreator, prepareEntityWideGenerationArgs(args, entity)),
    ]),
    generateFrontSrcTranslations(fileCreator, args),
  ]);
}

export const generateFront = async (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  await Promise.all([
    generateFrontSrc(fileCreator, args),
  ]);
}

const generateProject = async (
  system: System,
  initialOpts = defaultBootstrapEntityOptions
) => {
  const {
    getFiles,
    reset,
    create,
    createIfNotExists,
  } = createFilesToWriteUtils();

  const fileCreator: FileCreator = {create, createIfNotExists};

  const dir = cwd('..').cwd();

  const detachedBackProject = join(dir, `${initialOpts.projectPrefix}-back`);
  const detachedUiProject = join(dir, `${initialOpts.projectPrefix}-ui`);;

  const opts: BootstrapEntityInnerOptions = {
    ...defaultBootstrapEntityOptions,
    ...initialOpts,
    detachedBackProject,
    detachedUiProject,
  }

  const args = prepareProjectWideGenerationArgs(system, opts);

  await cleanFiles(args);

  // Pre grapgql types compose generation
  await Promise.all([
    ...system.additionalServices.map((service) =>
      generateAdditionalService(
        fileCreator,
        prepareAdditionalServiceWideGenerationArgs(
          {
            ...args,
            options: {
              ...opts,
              typesOnly: true,
            },
          },
          service
        )
      )
    ),
    generateBack(fileCreator, args, true),
  ]);

  writeFiles(getFiles());
  reset();

  await genGraphSchemesByLocalGenerator(opts);

  await generateFront(fileCreator, args);

  // Full generation
  await Promise.all([
    ...system.additionalServices.map((service) =>
      generateAdditionalService(
        fileCreator,
        prepareAdditionalServiceWideGenerationArgs(
          {
            ...args,
            options: {
              ...opts,
            },
          },
          service
        )
      )
    ),
    generateBack(fileCreator, args, false),
  ]);

  let prjBackSrcPrefixedDir = '';
  const prjDetachedBackSrcDir = join(opts.detachedBackProject, 'src');

  prjBackSrcPrefixedDir = join(prjDetachedBackSrcDir, 'adm');

  // Prisma schema
  const servicesDir = join(prjBackSrcPrefixedDir, 'services')

  // Graph
  const graphDir = join(prjBackSrcPrefixedDir, 'graph')

  // Types
  if (opts.genContext) {
    fileCreator.create(
      join(servicesDir, 'BaseServices.ts'),
      graphBaseServicesTmpl(args)
    )
  }

  // Types
  if (opts.genContext) {
    fileCreator.create(
      join(servicesDir, 'serviceConstrictors.ts'),
      graphServiceConstrictorsTmpl(args)
    )
  }

  fileCreator.create(
    join(servicesDir, 'IntegrationClients.ts'),
    genIntegrationClientsTmpl(args)
  )

  fileCreator.create(
    join(servicesDir, 'integrationClientConstrictors.ts'),
    genIntegrationClientConstrictorsTmpl(args)
  )

  const generatedAdditionalServices = additionalServicesTmpl()
  fileCreator.createIfNotExists(
    join(servicesDir, 'AdditionalServices.ts'),
    generatedAdditionalServices
  )

  fileCreator.create(
    join(graphDir, 'permissionsToGraphql.ts'),
    backPermissionToGraphqlTmpl(args, opts)
  )

  // Root

  const restRouter = restRouterTmpl()
  fileCreator.createIfNotExists(
    join(prjDetachedBackSrcDir, 'rest', 'restRouter.ts'),
    restRouter
  )

  // UI

  let prjUiSrcPrefixedDir = ''
  const prjDetachedUiSrcDir = join(opts.detachedUiProject, 'src')

  prjUiSrcPrefixedDir = join(prjDetachedUiSrcDir, 'adm');

  if (!opts.typesOnly) {
    // Resources
    if (opts.genUiResources) {
      const {resources, resourcesChunk0, resourcesChunk1} = uiResourcesTmpl(args)

      fileCreator.create(join(prjUiSrcPrefixedDir, 'resources.tsx'), resources);
      fileCreator.create(join(prjUiSrcPrefixedDir, 'resourcesChunk0.tsx'), resourcesChunk0);
      fileCreator.create(join(prjUiSrcPrefixedDir, 'resourcesChunk1.tsx'), resourcesChunk1);
    }

    // Resources page
    if (opts.genUiResourcesPage) {
      const generatedResources = uiResourcesPageTmpl(args)

      fileCreator.create(
        join(prjUiSrcPrefixedDir, 'ResourcesPage.tsx'),
        generatedResources
      )
    }

    const generatedUiMetaPage = uiMetaPageTmpl()
    fileCreator.create(join(prjUiSrcPrefixedDir, 'MetaPage.tsx'), generatedUiMetaPage)

    // Resources page
    if (opts.genUiEntityMapping) {
      const generatedResources = uiEntityMappingTmpl(args, opts)

      fileCreator.create(
        join(prjUiSrcPrefixedDir, 'entityMapping.ts'),
        generatedResources
      )
    }

    // Resources page
    if (opts.genUiMenu) {
      const generatedSubMenu = uiGetDefaultMenuTmpl(args)
      const generatedAdditionalMenu = uiGetAdditionalMenuTmpl()

      fileCreator.create(
        join(prjUiSrcPrefixedDir, 'getDefaultMenu.ts'),
        generatedSubMenu
      )
      fileCreator.createIfNotExists(
        join(prjUiSrcPrefixedDir, 'getAdditionalMenu.ts'),
        generatedAdditionalMenu
      )
    }

    // Resources page
    if (opts.genUiRoutes) {
      const generatedResources = uiRoutesTmpl(args)

      fileCreator.create(join(prjUiSrcPrefixedDir, 'routes.tsx'), generatedResources)
    }

    const generatedUiAdditionalRoutesTmpl = uiAdditionalRoutesTmpl()
    fileCreator.createIfNotExists(
      join(prjUiSrcPrefixedDir, 'additionalRoutes.tsx'),
      generatedUiAdditionalRoutesTmpl
    )

    // Functions page
    if (opts.genUiFunctions) {
      const generatedResources = uiFunctionsTmpl(opts)

      const uiFunctionsDir = join(prjUiSrcPrefixedDir, 'functions')

      fileCreator.create(join(uiFunctionsDir, 'Functions.tsx'), generatedResources)
    }

    // Dashboard page
    if (opts.genUiDashboard) {
      const generatedResources = uiDashboardTmpl()

      fileCreator.createIfNotExists(
        join(prjUiSrcPrefixedDir, 'Dashboard.tsx'),
        generatedResources
      )
    }
  }

  await generateEnvironment(fileCreator, args);

  writeFiles(getFiles());
  reset();
}

export default generateProject;

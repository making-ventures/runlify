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
import {generateEntity} from './generateEntity'
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
import {pascal, pascalSingular} from '../utils/cases'
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

  generateHelpService(fileCreator, args, typesOnly);
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
  entityWideGenerationArgs: EntityWideGenerationArgs,
) => {
  const {
    entity: { name },
  } = entityWideGenerationArgs

  const filePath = join(
    entityWideGenerationArgs.options.detachedUiProject,
    `src/adm/pages/${name}/${pascalSingular(name)}Icon.tsx`
  )

  fileCreator.create(filePath, uiEntityIconTmpl(entityWideGenerationArgs))
}

export const generateFrontSrcGetEntityValidation = async (
  fileCreator: FileCreator,
  entityWideGenerationArgs: EntityWideGenerationArgs,
) => {
  const {
    entity: { name },
  } = entityWideGenerationArgs

  const filePath = join(
    entityWideGenerationArgs.options.detachedUiProject,
    `src/adm/pages/${name}/get${pascalSingular(name)}Validation.tsx`
  )

  fileCreator.create(filePath, uiGetEntityValidationTmpl(entityWideGenerationArgs))
}

export const generateFrontSrcEntity = async (
  fileCreator: FileCreator,
  entityWideGenerationArgs: EntityWideGenerationArgs,
) => {
  await Promise.all([
    generateFrontSrcEntityIcon(fileCreator, entityWideGenerationArgs),
    generateFrontSrcGetEntityValidation(fileCreator, entityWideGenerationArgs),
  ]);
}

export const generateFrontSrc = async (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  await Promise.all([
    args.entities.map((entity) =>
      generateFrontSrcEntity(fileCreator, prepareEntityWideGenerationArgs(args, entity))
    ),
    generateFrontSrcEntityTranslationsDocs(fileCreator, args),
    generateFrontSrcEntityTranslationsCatalogs(fileCreator, args),
    generateFrontSrcEntityTranslationsSumRegistries(fileCreator, args),
    generateFrontSrcEntityTranslationsInfoRegistries(fileCreator, args),
    generateFrontSrcEntityTranslationsReports(fileCreator, args),
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
  const { entities } = args;

  await cleanFiles(args);

  // Pre grapgql types compose generation
  await Promise.all([
    ...entities.map((entity) =>
      generateEntity(
        fileCreator,
        prepareEntityWideGenerationArgs(
          {
            ...args,
            options: {
              ...opts,
              typesOnly: true,
            },
          },
          entity
        )
      )
    ),
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
    ...entities.map((entity) =>
      generateEntity(
        fileCreator,
        prepareEntityWideGenerationArgs(
          {
            ...args,
            options: {
              ...opts,
            },
          },
          entity
        )
      )
    ),
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

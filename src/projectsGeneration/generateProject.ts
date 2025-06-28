import { join } from 'path'
import { uiResourcesTmpl } from './generators/fileTemplates/ui/resources'
import { uiResourcesPageTmpl } from './generators/fileTemplates/ui/ResourcesPage'
import { backPermissionToGraphqlTmpl } from './generators/fileTemplates/back/graph/permissionsToGraphql'
import uiRoutesTmpl from './generators/fileTemplates/ui/environment/src/routes'
import { uiEntityMappingTmpl } from './generators/fileTemplates/ui/entityMapping'
import uiDashboardTmpl from './generators/fileTemplates/ui/Dashboard'
import { uiFunctionsTmpl } from './generators/fileTemplates/ui/functions/Functions'
import { uiGetDefaultMenuTmpl } from './generators/fileTemplates/ui/getDefaultMenu'
import { generateEnvironment } from './generateEnvironment'
import { configItemsTmpl } from './generators/fileTemplates/back/root/config/config'
import { genGraphSchemesByLocalGenerator } from './genGraphSchemesByLocalGenerator'
import { BootstrapEntityInnerOptions, defaultBootstrapEntityOptions, FileWriter } from './types'
import { generateEntity } from './generateEntity'
import { restRouterTmpl } from './generators/fileTemplates/back/root/restRouter'
import { createFilesToWriteUtils, writeFiles } from './utils'
import { uiAdditionalRoutesTmpl } from './generators/fileTemplates/ui/additionalRoutes'
import { uiGetAdditionalMenuTmpl } from './generators/fileTemplates/ui/getAdditionalMenu'
import { uiMetaPageTmpl } from './generators/fileTemplates/ui/MetaPage'
import { additionalServicesTmpl } from './generators/fileTemplates/back/services/AdditionalServices'
import { System } from './builders/buildedTypes'
import { uiTranslationsLangDocsTmpl } from './generators/fileTemplates/ui/i18n/lang/uiLangDocsTmpl'
import { cwd } from 'fs-jetpack'
import { uiTranslationsLangReportsTmpl } from './generators/fileTemplates/ui/i18n/lang/uiLangReportsTmpl'
import { uiEntityIconTmpl } from './generators/fileTemplates/ui/pages/Icon'
import { pascal, pascalSingular } from '../utils/cases'
import { uiTranslationsLangCatalogsTmpl } from './generators/fileTemplates/ui/i18n/lang/uiLangCatalogsTmpl'
import { uiTranslationsLangInfoRegistriesTmpl } from './generators/fileTemplates/ui/i18n/lang/uiLangInfoRegistriesTmpl'
import { uiTranslationsLangSumRegistriesTmpl } from './generators/fileTemplates/ui/i18n/lang/uiLangSumRegistriesTmpl'
import {
  EntityWideGenerationArgs,
  prepareAdditionalServiceWideGenerationArgs,
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
  ProjectWideGenerationArgs,
} from './args'
import { backDefaultEnv } from './generators/fileTemplates/back/environment/defaultEnv'
import backDocsConfiguration from './generators/fileTemplates/back/environment/docs/backDocsConfiguration'
import { adminAppDocsConfiguration } from './generators/fileTemplates/ui/environment/docs/adminAppDocsConfiguration'
import backDocsRestApi from './generators/fileTemplates/back/environment/docs/backDocsRestApi'
import backDocsEntity from './generators/fileTemplates/back/environment/docs/backDocsEntity'
import { plural, singular } from 'pluralize'
import baseResolversTmpl from './generators/fileTemplates/back/graph/help/baseResolvers'
import helpServiceTmpl from './generators/fileTemplates/back/services/HelpService/HelpService'
import graphBaseServicesTmpl from './generators/fileTemplates/back/services/BaseServices'
import baseTypeDefsTmpl from './generators/fileTemplates/back/graph/help/baseTypeDefs'
import permissionsToGraphqlTmpl from './generators/fileTemplates/back/graph/help/permissionsToGraphql'
import { enumTmpl } from './generators/fileTemplates/back/enum'
import { devEnumTmpl } from './generators/fileTemplates/back/devEnum'
import { initCommonEnumTmpl } from './generators/fileTemplates/back/initCommon'
import { initDevEnumTmpl } from './generators/fileTemplates/back/initDev'
import graphServiceConstrictorsTmpl from './generators/fileTemplates/back/services/serviceConstrictors'
import { Entities } from './generators/fileTemplates/back/Entities'
import { initEntities } from './generators/fileTemplates/back/initEntities'
import { uiGetEntityValidationTmpl } from './generators/fileTemplates/ui/pages/getEntityValidation'
import {generateBackElasticBootstrap} from './generators/fileTemplates/back/elastic/elastic';
import backDocsIntegrationClient from './generators/fileTemplates/back/environment/docs/backDocsIntegrationClient'
import backIntegrationClientTmpl from './generators/fileTemplates/back/environment/src/integrationClients/IntegrationClient'
import { pascalCase } from 'change-case'
import backIntegrationClientTypesTmpl from './generators/fileTemplates/back/environment/src/integrationClients/types'
import backDocSpec from './generators/fileTemplates/back/environment/docs/backDocSpec'
import { generateAdditionalService } from './generateAdditionalService'
import genIntegrationClientsTmpl from './generators/fileTemplates/back/environment/src/integrationClients/IntegrationClients'
import genIntegrationClientConstrictorsTmpl from './generators/fileTemplates/back/environment/src/integrationClients/integrationClientConstrictors'
import cleanFiles from './fileCleaners/cleanFiles'

const generateHelpService = async (
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
  typesOnly = false
) => {
  fileWriter.write(
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
    fileWriter.write(
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
    fileWriter.write(
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
    fileWriter.write(
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

export const generateBackSrc = async (fileWriter: FileWriter, args: ProjectWideGenerationArgs, typesOnly: boolean) => {
  if (!typesOnly) {
    await Promise.all([
      fileWriter.write(
        join(args.options.detachedBackProject, 'src', 'config', 'config.ts'),
        configItemsTmpl(args)
      ),
      generateBackIntegrationClients(fileWriter, args),
    ]);
  }

  generateHelpService(fileWriter, args, typesOnly);
}

export const generateBackIntegrationClients = async (
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  for (const client of args.system.integrationClients) {
    const clientFolder = join(
      args.options.detachedBackProject,
      'src',
      'integrationClients',
      `${client.name}`,
    )

    fileWriter.writeFileIfNotExists(join(clientFolder, `${pascalCase(client.name)}Client.ts`), backIntegrationClientTmpl(args, client));
    fileWriter.write(join(clientFolder, `types.ts`), backIntegrationClientTypesTmpl(args, client));
  }
}

export const generateBackEnvs = async (fileWriter: FileWriter, args: ProjectWideGenerationArgs) => {
  const filePath = join(
    args.options.detachedBackProject,
    'config',
    'default.json'
  )

  fileWriter.write(filePath, backDefaultEnv(args))
}

export const generateBackDocsConfiguration = async (
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'docs',
    'configuration.md'
  )

  fileWriter.write(filePath, backDocsConfiguration(args))
}

export const generateBackDocsSpec = async (
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'docs',
    'spec.md'
  )

  fileWriter.write(filePath, backDocSpec(args))
}

export const generateBackDocsRestApis = async (
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  for (const restApi of args.system.restApis) {
    const filePath = join(
      args.options.detachedBackProject,
      'docs',
      'restApis',
      `${restApi.name}.md`
    )

    fileWriter.write(filePath, backDocsRestApi(args, restApi))
  }
}

export const generateBackDocsIntegrationClients = async (
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  for (const client of args.system.integrationClients) {
    const filePath = join(
      args.options.detachedBackProject,
      'docs',
      'integrationClients',
      `${client.name}.md`
    )

    fileWriter.write(filePath, backDocsIntegrationClient(args, client))
  }
}

export const generateBackDocsEntities = async (
  fileWriter: FileWriter,
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

      return fileWriter.write(
        filePath,
        backDocsEntity(prepareEntityWideGenerationArgs(args, entity))
      )
    })
  )
}

export const generateBackEnums = async (fileWriter: FileWriter, args: ProjectWideGenerationArgs) => {
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

        return fileWriter.write(
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
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'src',
    'types',
    'Entity.ts'
  )

  return fileWriter.write(
    filePath,
    Entities({
      entities: args.entities,
      options: args.options,
    } as ProjectWideGenerationArgs)
  )
}

export const generateBackEnumsInit = async (
  fileWriter: FileWriter,
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

        return fileWriter.write(
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
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'src',
    'init',
    'common',
    'initEntities.ts'
  )

  return fileWriter.write(filePath, initEntities(args))
}

export const generateBackDevEnums = async (fileWriter: FileWriter, args: ProjectWideGenerationArgs) => {
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

        return fileWriter.write(
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
  fileWriter: FileWriter,
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

        return fileWriter.write(
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
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedUiProject,
    'docs',
    'configuration.md'
  )

  fileWriter.write(filePath, adminAppDocsConfiguration(args))
}

export const generateBackDocs = async (fileWriter: FileWriter, args: ProjectWideGenerationArgs) => {
  await Promise.all([
    generateBackDocsSpec(fileWriter, args),
    generateBackDocsConfiguration(fileWriter, args),
    generateBackDocsRestApis(fileWriter, args),
    generateBackDocsIntegrationClients(fileWriter, args),
    generateBackDocsEntities(fileWriter, args),
    generateBackEnums(fileWriter, args),
    generateBackEnumsInit(fileWriter, args),
    generateBackEntityEnum(fileWriter, args),
    generateBackEntitiesEnumInit(fileWriter, args),
    generateBackDevEnums(fileWriter, args),
    generateBackDevEnumsInit(fileWriter, args),
    generateAdminAppDocsConfiguration(fileWriter, args),
  ]);
}

export const generateBack = async (fileWriter: FileWriter, args: ProjectWideGenerationArgs, typesOnly: boolean) => {
  if (!typesOnly) {
    await Promise.all([
      generateBackEnvs(fileWriter, args),
      generateBackDocs(fileWriter, args),
      generateBackElasticBootstrap(fileWriter, args),
    ]);
  }

  generateBackSrc(fileWriter, args, typesOnly);
}

export const generateFrontSrcEntityTranslationsDocs = async (
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Docs.ts`
    )

    fileWriter.write(filePath, uiTranslationsLangDocsTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsCatalogs = async (
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Catalogs.ts`
    )

    fileWriter.write(filePath, uiTranslationsLangCatalogsTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsInfoRegistries = async (
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}InfoRegistries.ts`
    )

    fileWriter.write(filePath, uiTranslationsLangInfoRegistriesTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsSumRegistries = async (
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}SumRegistries.ts`
    )

    fileWriter.write(filePath, uiTranslationsLangSumRegistriesTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsReports = async (
  fileWriter: FileWriter,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Reports.ts`
    )

    fileWriter.write(filePath, uiTranslationsLangReportsTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityIcon = async (
  fileWriter: FileWriter,
  entityWideGenerationArgs: EntityWideGenerationArgs,
) => {
  const {
    entity: { name },
  } = entityWideGenerationArgs

  const filePath = join(
    entityWideGenerationArgs.options.detachedUiProject,
    `src/adm/pages/${name}/${pascalSingular(name)}Icon.tsx`
  )

  fileWriter.write(filePath, uiEntityIconTmpl(entityWideGenerationArgs))
}

export const generateFrontSrcGetEntityValidation = async (
  fileWriter: FileWriter,
  entityWideGenerationArgs: EntityWideGenerationArgs,
) => {
  const {
    entity: { name },
  } = entityWideGenerationArgs

  const filePath = join(
    entityWideGenerationArgs.options.detachedUiProject,
    `src/adm/pages/${name}/get${pascalSingular(name)}Validation.tsx`
  )

  fileWriter.write(filePath, uiGetEntityValidationTmpl(entityWideGenerationArgs))
}

export const generateFrontSrcEntity = async (
  fileWriter: FileWriter,
  entityWideGenerationArgs: EntityWideGenerationArgs,
) => {
  await Promise.all([
    generateFrontSrcEntityIcon(fileWriter, entityWideGenerationArgs),
    generateFrontSrcGetEntityValidation(fileWriter, entityWideGenerationArgs),
  ]);
}

export const generateFrontSrc = async (fileWriter: FileWriter, args: ProjectWideGenerationArgs) => {
  await Promise.all([
    args.entities.map((entity) =>
      generateFrontSrcEntity(fileWriter, prepareEntityWideGenerationArgs(args, entity))
    ),
    generateFrontSrcEntityTranslationsDocs(fileWriter, args),
    generateFrontSrcEntityTranslationsCatalogs(fileWriter, args),
    generateFrontSrcEntityTranslationsSumRegistries(fileWriter, args),
    generateFrontSrcEntityTranslationsInfoRegistries(fileWriter, args),
    generateFrontSrcEntityTranslationsReports(fileWriter, args),
  ]);
}

export const generateFront = async (fileWriter: FileWriter, args: ProjectWideGenerationArgs) => {
  await Promise.all([
    generateFrontSrc(fileWriter, args),
  ]);
}

const generateProject = async (
  system: System,
  initialOpts = defaultBootstrapEntityOptions
) => {
  const {
    filesToWrite,
    reset,
    write,
    writeFileIfNotExists,
  } = createFilesToWriteUtils();

  const fileWriter: FileWriter = {write, writeFileIfNotExists};

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
        fileWriter,
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
        fileWriter,
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
    generateBack(fileWriter, args, true),
  ]);

  writeFiles(filesToWrite);
  reset();

  await genGraphSchemesByLocalGenerator(opts);

  await generateFront(fileWriter, args);

  let prjBackSrcPrefixedDir = '';
  const prjDetachedBackSrcDir = join(opts.detachedBackProject, 'src');

  prjBackSrcPrefixedDir = join(prjDetachedBackSrcDir, 'adm');

  // Full generation
  await Promise.all([
    ...entities.map((entity) =>
      generateEntity(
        fileWriter,
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
        fileWriter,
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
    generateBack(fileWriter, args, false),
  ]);

  // Prisma schema
  const servicesDir = join(prjBackSrcPrefixedDir, 'services')

  // Graph
  const graphDir = join(prjBackSrcPrefixedDir, 'graph')

  // Types
  if (opts.genContext) {
    fileWriter.write(
      join(servicesDir, 'BaseServices.ts'),
      graphBaseServicesTmpl(args)
    )
  }

  // Types
  if (opts.genContext) {
    fileWriter.write(
      join(servicesDir, 'serviceConstrictors.ts'),
      graphServiceConstrictorsTmpl(args)
    )
  }

  fileWriter.write(
    join(servicesDir, 'IntegrationClients.ts'),
    genIntegrationClientsTmpl(args)
  )

  fileWriter.write(
    join(servicesDir, 'integrationClientConstrictors.ts'),
    genIntegrationClientConstrictorsTmpl(args)
  )

  const generatedAdditionalServices = additionalServicesTmpl()
  fileWriter.writeFileIfNotExists(
    join(servicesDir, 'AdditionalServices.ts'),
    generatedAdditionalServices
  )

  fileWriter.write(
    join(graphDir, 'permissionsToGraphql.ts'),
    backPermissionToGraphqlTmpl(args, opts)
  )

  // Root

  const restRouter = restRouterTmpl()
  fileWriter.writeFileIfNotExists(
    join(prjDetachedBackSrcDir, 'rest', 'restRouter.ts'),
    restRouter
  )

  // UI

  let prjUiSrcPrefixedDir = ''
  const prjDetachedUiSrcDir = join(opts.detachedUiProject, 'src')

  prjUiSrcPrefixedDir = join(prjDetachedUiSrcDir, 'adm')

  if (!opts.typesOnly) {
    // Resources
    if (opts.genUiResources) {
      const {resources, resourcesChunk0, resourcesChunk1} = uiResourcesTmpl(args)

      fileWriter.write(join(prjUiSrcPrefixedDir, 'resources.tsx'), resources);
      fileWriter.write(join(prjUiSrcPrefixedDir, 'resourcesChunk0.tsx'), resourcesChunk0);
      fileWriter.write(join(prjUiSrcPrefixedDir, 'resourcesChunk1.tsx'), resourcesChunk1);
    }

    // Resources page
    if (opts.genUiResourcesPage) {
      const generatedResources = uiResourcesPageTmpl(args)

      fileWriter.write(
        join(prjUiSrcPrefixedDir, 'ResourcesPage.tsx'),
        generatedResources
      )
    }

    const generatedUiMetaPage = uiMetaPageTmpl()
    fileWriter.write(join(prjUiSrcPrefixedDir, 'MetaPage.tsx'), generatedUiMetaPage)

    // Resources page
    if (opts.genUiEntityMapping) {
      const generatedResources = uiEntityMappingTmpl(args, opts)

      fileWriter.write(
        join(prjUiSrcPrefixedDir, 'entityMapping.ts'),
        generatedResources
      )
    }

    // Resources page
    if (opts.genUiMenu) {
      const generatedSubMenu = uiGetDefaultMenuTmpl(args)
      const generatedAdditionalMenu = uiGetAdditionalMenuTmpl()

      fileWriter.write(
        join(prjUiSrcPrefixedDir, 'getDefaultMenu.ts'),
        generatedSubMenu
      )
      fileWriter.writeFileIfNotExists(
        join(prjUiSrcPrefixedDir, 'getAdditionalMenu.ts'),
        generatedAdditionalMenu
      )
    }

    // Resources page
    if (opts.genUiRoutes) {
      const generatedResources = uiRoutesTmpl(args)

      fileWriter.write(join(prjUiSrcPrefixedDir, 'routes.tsx'), generatedResources)
    }

    const generatedUiAdditionalRoutesTmpl = uiAdditionalRoutesTmpl()
    fileWriter.writeFileIfNotExists(
      join(prjUiSrcPrefixedDir, 'additionalRoutes.tsx'),
      generatedUiAdditionalRoutesTmpl
    )

    // Functions page
    if (opts.genUiFunctions) {
      const generatedResources = uiFunctionsTmpl(opts)

      const uiFunctionsDir = join(prjUiSrcPrefixedDir, 'functions')

      fileWriter.write(join(uiFunctionsDir, 'Functions.tsx'), generatedResources)
    }

    // Dashboard page
    if (opts.genUiDashboard) {
      const generatedResources = uiDashboardTmpl()

      fileWriter.writeFileIfNotExists(
        join(prjUiSrcPrefixedDir, 'Dashboard.tsx'),
        generatedResources
      )
    }
  }

  await generateEnvironment(fileWriter, args);

  writeFiles(filesToWrite);
  reset();
}

export default generateProject;

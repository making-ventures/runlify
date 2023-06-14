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
import { BootstrapEntityOptions, defaultBootstrapEntityOptions } from './types'
import { generateEntity } from './generateEntity'
import { restRouterTmpl } from './generators/fileTemplates/back/root/restRouter'
import { writeFileIfNotExists } from './utils'
import { uiAdditionalRoutesTmpl } from './generators/fileTemplates/ui/additionalRoutes'
import { uiGetAdditionalMenuTmpl } from './generators/fileTemplates/ui/getAdditionalMenu'
import { uiMetaPageTmpl } from './generators/fileTemplates/ui/MetaPage'
import { graphMetaTypesTmpl } from './generators/fileTemplates/back/graph/meta/typeDefs'
import { graphMetaResolversTmpl } from './generators/fileTemplates/back/graph/meta/resolvers'
import { additionalServicesTmpl } from './generators/fileTemplates/back/services/AdditionalServices'
import { System } from './builders/buildedTypes'
import { uiTranslationsLangDocsTmpl } from './generators/fileTemplates/ui/i18n/lang/uiLangDocsTmpl'
import { write } from 'fs-jetpack'
import { uiTranslationsLangReportsTmpl } from './generators/fileTemplates/ui/i18n/lang/uiLangReportsTmpl'
import { uiEntityIconTmpl } from './generators/fileTemplates/ui/pages/Icon'
import { pascal, pascalSingular } from '../utils/cases'
import { uiTranslationsLangCatalogsTmpl } from './generators/fileTemplates/ui/i18n/lang/uiLangCatalogsTmpl'
import { uiTranslationsLangInfoRegistriesTmpl } from './generators/fileTemplates/ui/i18n/lang/uiLangInfoRegistriesTmpl'
import { uiTranslationsLangSumRegistriesTmpl } from './generators/fileTemplates/ui/i18n/lang/uiLangSumRegistriesTmpl'
import {
  EntityWideGenerationArgs,
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
  ProjectWideGenerationArgs,
} from './args'
import { backDefaultEnv } from './generators/fileTemplates/back/environment/defaultEnv'
import { backDocsConfiguration } from './generators/fileTemplates/back/environment/docs/backDocsConfiguration'
import { adminAppDocsConfiguration } from './generators/fileTemplates/ui/environment/docs/adminAppDocsConfiguration'
import { backDocsRestApi } from './generators/fileTemplates/back/environment/docs/backDocsRestApi'
import { backDocsEntity } from './generators/fileTemplates/back/environment/docs/backDocsEntity'
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

// Бек (generateBack)
//  Исходники бека (generateBackSrc)
//    Исходники бека (generateBackSrcEntity)
//  GitlabCi бека (generateBackGitlabCi)
//  Helm чарты бека (generateBackHelm)
// Фронт (generateFront)
//  Исходники фронта (generateFrontSrc)
//    Исходники фронта (generateFrontSrcEntity)
//  GitlabCi фронта (generateFrontGitlabCi)
//  Helm чарты фронта (generateFrontHelm)

export const generateBackSrcEntity = async (
  _entityWideGenerationArgs: EntityWideGenerationArgs
) => {
  // log.info('generateBackSrcEntity');
  // log.info(typeof entityWideGenerationArgs);
}

const generateHelpService = async (
  args: ProjectWideGenerationArgs,
  typesOnly = false
) => {
  write(
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
    write(
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
    write(
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
    write(
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

export const generateBackSrc = async (args: ProjectWideGenerationArgs) => {
  // log.info('generateBackSrc');

  await Promise.all([
    write(
      join(args.options.detachedBackProject, 'src', 'config', 'config.ts'),
      configItemsTmpl(args)
    ),
    generateHelpService(args, true),
  ])

  await Promise.all(
    args.entities.map((entity) =>
      generateBackSrcEntity(prepareEntityWideGenerationArgs(args, entity))
    )
  )
}

export const generateBackGitlabCi = async (
  _args: ProjectWideGenerationArgs
) => {
  // log.info('generateBackGitlabCi');
  // log.info(typeof args);
}

export const generateBackHelm = async (_args: ProjectWideGenerationArgs) => {
  // log.info('generateBackHelm');
  // log.info(typeof args);
}

export const generateBackEnvs = async (args: ProjectWideGenerationArgs) => {
  const filePath = join(
    args.options.detachedBackProject,
    'config',
    'default.json'
  )

  await write(filePath, backDefaultEnv(args))
}

export const generateBackDocsConfiguration = async (
  args: ProjectWideGenerationArgs
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'docs',
    'configuration.md'
  )

  await write(filePath, backDocsConfiguration(args))
}

export const generateBackDocsRestApis = async (
  args: ProjectWideGenerationArgs
) => {
  for (const restApi of args.system.restApis) {
    const filePath = join(
      args.options.detachedBackProject,
      'docs',
      'restApis',
      `${restApi.name}.md`
    )

    await write(filePath, backDocsRestApi(args, restApi))
  }
}

export const generateBackDocsEntities = async (
  args: ProjectWideGenerationArgs
) => {
  await Promise.all(
    args.entities.map((entity) => {
      const filePath = join(
        args.options.detachedBackProject,
        'docs',
        plural(entity.type),
        `${entity.name}.md`
      )

      return write(
        filePath,
        backDocsEntity(prepareEntityWideGenerationArgs(args, entity))
      )
    })
  )
}

export const generateBackEnums = async (args: ProjectWideGenerationArgs) => {
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

        return write(
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
  args: ProjectWideGenerationArgs
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'src',
    'types',
    'Entity.ts'
  )

  return write(
    filePath,
    Entities({
      entities: args.entities,
      options: args.options,
    } as ProjectWideGenerationArgs)
  )
}

export const generateBackEnumsInit = async (
  args: ProjectWideGenerationArgs
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

        return write(
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
  args: ProjectWideGenerationArgs
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'src',
    'init',
    'common',
    'initEntities.ts'
  )

  return write(filePath, initEntities(args))
}

export const generateBackDevEnums = async (args: ProjectWideGenerationArgs) => {
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

        return write(
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
  args: ProjectWideGenerationArgs
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

        return write(
          filePath,
          initDevEnumTmpl({
            entity,
            options: args.options,
          } as EntityWideGenerationArgs)
        )
      })
  )
}

export const generateAdminAppDocsConfiguration = async (
  args: ProjectWideGenerationArgs
) => {
  const filePath = join(
    args.options.detachedUiProject,
    'docs',
    'configuration.md'
  )

  await write(filePath, adminAppDocsConfiguration(args))
}

export const generateBackDocs = async (args: ProjectWideGenerationArgs) => {
  await Promise.all([
    generateBackDocsConfiguration(args),
    generateBackDocsRestApis(args),
    generateBackDocsEntities(args),
    generateBackEnums(args),
    generateBackEnumsInit(args),
    generateBackEntityEnum(args),
    generateBackEntitiesEnumInit(args),
    generateBackDevEnums(args),
    generateBackDevEnumsInit(args),
    generateAdminAppDocsConfiguration(args),
  ])
}

export const generateBack = async (args: ProjectWideGenerationArgs) => {
  // log.info('generateBack');

  await Promise.all([
    generateBackSrc(args),
    generateBackGitlabCi(args),
    generateBackHelm(args),
    generateBackEnvs(args),
    generateBackDocs(args),
  ])
}

export const generateFrontSrcEntityTranslationsDocs = async (
  args: ProjectWideGenerationArgs
) => {
  // log.info('generateFrontSrcEntityTranslationsDocs');

  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Docs.ts`
    )

    await write(filePath, uiTranslationsLangDocsTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsCatalogs = async (
  args: ProjectWideGenerationArgs
) => {
  // log.info('generateFrontSrcEntityTranslationsCatalogs');

  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Catalogs.ts`
    )

    await write(filePath, uiTranslationsLangCatalogsTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsInfoRegistries = async (
  args: ProjectWideGenerationArgs
) => {
  // log.info('generateFrontSrcEntityTranslationsInfoRegistries');

  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}InfoRegistries.ts`
    )

    await write(filePath, uiTranslationsLangInfoRegistriesTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsSumRegistries = async (
  args: ProjectWideGenerationArgs
) => {
  // log.info('generateFrontSrcEntityTranslationsSumRegistries');

  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}SumRegistries.ts`
    )

    await write(filePath, uiTranslationsLangSumRegistriesTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityTranslationsReports = async (
  args: ProjectWideGenerationArgs
) => {
  // log.info('generateFrontSrcEntityTranslationsReports');

  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Reports.ts`
    )

    await write(filePath, uiTranslationsLangReportsTmpl(args, lang.id))
  }
}

export const generateFrontSrcEntityIcon = async (
  entityWideGenerationArgs: EntityWideGenerationArgs
) => {
  const {
    entity: { name },
  } = entityWideGenerationArgs

  const filePath = join(
    entityWideGenerationArgs.options.detachedUiProject,
    `src/adm/pages/${name}/${pascalSingular(name)}Icon.tsx`
  )

  await write(filePath, uiEntityIconTmpl(entityWideGenerationArgs))
}

export const generateFrontSrcGetEntityValidation = async (
  entityWideGenerationArgs: EntityWideGenerationArgs
) => {
  const {
    entity: { name },
  } = entityWideGenerationArgs

  // src/adm/pages/milesReceivedForFlightsByManagerDocuments/getMilesReceivedForFlightsByManagerDocumentValidation.tsx
  const filePath = join(
    entityWideGenerationArgs.options.detachedUiProject,
    `src/adm/pages/${name}/get${pascalSingular(name)}Validation.tsx`
  )

  await write(filePath, uiGetEntityValidationTmpl(entityWideGenerationArgs))
}

export const generateFrontSrcEntity = async (
  entityWideGenerationArgs: EntityWideGenerationArgs
) => {
  // log.info('generateFrontSrcEntity');
  // log.info(typeof entityWideGenerationArgs);

  await generateFrontSrcEntityIcon(entityWideGenerationArgs)
  await generateFrontSrcGetEntityValidation(entityWideGenerationArgs)
}

export const generateFrontSrc = async (args: ProjectWideGenerationArgs) => {
  await Promise.all(
    args.entities.map((entity) =>
      generateFrontSrcEntity(prepareEntityWideGenerationArgs(args, entity))
    )
  )

  await Promise.all([
    generateFrontSrcEntityTranslationsDocs(args),
    generateFrontSrcEntityTranslationsCatalogs(args),
    generateFrontSrcEntityTranslationsSumRegistries(args),
    generateFrontSrcEntityTranslationsInfoRegistries(args),
    generateFrontSrcEntityTranslationsReports(args),
  ])
}

export const generateFrontGitlabCi = async (
  _args: ProjectWideGenerationArgs
) => {
  // log.info('generateFrontGitlabCi');
  // log.info(typeof args);
}

export const generateFrontHelm = async (_args: ProjectWideGenerationArgs) => {
  // log.info('generateFrontHelm');
  // log.info(typeof args);
}

export const generateFront = async (args: ProjectWideGenerationArgs) => {
  // log.info('generateFront');

  await Promise.all([
    generateFrontSrc(args),
    generateFrontGitlabCi(args),
    generateFrontHelm(args),
  ])
}

const generateProject = async (
  system: System,
  initialOpts: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => {
  const opts = {
    ...defaultBootstrapEntityOptions,
    ...initialOpts,
  }

  const args = prepareProjectWideGenerationArgs(system, opts)

  await generateBack(args)
  await generateFront(args)
  const { entities } = args

  let prjBackSrcPrefixedDir = ''
  const prjDetachedBackSrcDir = join(opts.detachedBackProject, 'src')

  // if (opts.detachedBackProject) {
  prjBackSrcPrefixedDir = join(prjDetachedBackSrcDir, 'adm')

  // } else {
  //   prjBackSrcPrefixedDir = join(__dirname, '..', '..', prefix);
  // }

  // Pre grapgql types compose generation
  await Promise.all(
    entities.map((entity) =>
      generateEntity(
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
    )
  )

  const graphMetaServiceDir = join(
    prjBackSrcPrefixedDir,
    'graph',
    'services',
    'meta'
  )
  await write(`${graphMetaServiceDir}/baseTypeDefs.ts`, graphMetaTypesTmpl())

  await genGraphSchemesByLocalGenerator(opts)

  await generateHelpService(args, false)

  // Full generation
  await Promise.all(
    entities.map((entity) =>
      generateEntity(
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
    )
  )

  // Prisma schema
  const servicesDir = join(prjBackSrcPrefixedDir, 'services')

  // if (opts.genPrismaSchema) {
  //   const prismaSchema = genPrismaSchemaForEntities(args, allLinks);
  //   await write(join(prjBackSrcPrefixedDir, 'schema.prisma'), prismaSchema);
  // }

  // Graph
  const graphDir = join(prjBackSrcPrefixedDir, 'graph')

  await write(
    `${graphMetaServiceDir}/baseResolvers.ts`,
    graphMetaResolversTmpl()
  )

  // // Context
  // // src/dc/services/context.ts
  // if (opts.genContext && !opts.typesOnly) {
  //   await write(join(servicesDir, 'context.ts'), graphContextTmpl(args));
  // }

  // Types
  if (opts.genContext) {
    await write(
      join(servicesDir, 'BaseServices.ts'),
      graphBaseServicesTmpl(args)
    )
  }

  // Types
  if (opts.genContext) {
    await write(
      join(servicesDir, 'serviceConstrictors.ts'),
      graphServiceConstrictorsTmpl(args)
    )
  }

  const generatedAdditionalServices = additionalServicesTmpl()
  await writeFileIfNotExists(
    join(servicesDir, 'AdditionalServices.ts'),
    generatedAdditionalServices
  )

  await write(
    join(graphDir, 'permissionsToGraphql.ts'),
    backPermissionToGraphqlTmpl(args, opts)
  )

  // Root

  // src/restRouter.ts
  const restRouter = restRouterTmpl()
  await writeFileIfNotExists(
    join(prjDetachedBackSrcDir, 'rest', 'restRouter.ts'),
    restRouter
  )

  // // src/meta/metadata.json
  // const genFolder = join(prjDetachedBackSrcDir, 'gen')

  // name: string;
  // prefix: string;
  // needFor: string;
  // configVars: string[];
  // deployEnvironments: string[];
  // catalogs: EntityWithOptions[];
  // documents: EntityWithOptions[];
  // infoRegistries: EntityWithOptions[];
  // sumRegistries: EntityWithOptions[];

  // const metaWithoutOptions = {
  //   ...system,
  //   catalogs: system.catalogs,
  //   documents: system.documents,
  //   infoRegistries: system.infoRegistries,
  //   sumRegistries: system.sumRegistries,
  // }
  // await write(
  //   join(genFolder, 'metadata.json'),
  //   stringify(metaWithoutOptions, undefined, 1)
  // )

  // UI

  let prjUiSrcPrefixedDir = ''
  const prjDetachedUiSrcDir = join(opts.detachedUiProject, 'src')

  // if (opts.detachedBackProject) {
  prjUiSrcPrefixedDir = join(prjDetachedUiSrcDir, 'adm')

  // } else {
  //   prjUiSrcPrefixedDir = join('/home/name/prj/crawler-ui/src', prefix);
  // }

  if (!opts.typesOnly) {
    // Resources
    // src/dc/resources.tsx genUiResources uiResourcesTmpl
    if (opts.genUiResources) {
      const generatedResources = uiResourcesTmpl(args)

      await write(
        join(prjUiSrcPrefixedDir, 'resources.tsx'),
        generatedResources
      )
    }

    // Resources page
    // src/dc/ResourcesPage.tsx genUiResourcesPage uiResourcesPageTmpl
    if (opts.genUiResourcesPage) {
      const generatedResources = uiResourcesPageTmpl(args)

      await write(
        join(prjUiSrcPrefixedDir, 'ResourcesPage.tsx'),
        generatedResources
      )
    }

    const generatedUiMetaPage = uiMetaPageTmpl()
    await write(join(prjUiSrcPrefixedDir, 'MetaPage.tsx'), generatedUiMetaPage)

    // Resources page
    // src/dc/entityMapping.ts genUiEntityMapping uiEntityMappingTmpl
    if (opts.genUiEntityMapping) {
      const generatedResources = uiEntityMappingTmpl(args, opts)

      await write(
        join(prjUiSrcPrefixedDir, 'entityMapping.ts'),
        generatedResources
      )
    }

    // Resources page
    // src/dc/ProjectMenu.tsx genUiMenu uiMenuTmpl
    if (opts.genUiMenu) {
      const generatedSubMenu = uiGetDefaultMenuTmpl(args)
      const generatedAdditionalMenu = uiGetAdditionalMenuTmpl()

      await write(
        join(prjUiSrcPrefixedDir, 'getDefaultMenu.ts'),
        generatedSubMenu
      )
      await writeFileIfNotExists(
        join(prjUiSrcPrefixedDir, 'getAdditionalMenu.ts'),
        generatedAdditionalMenu
      )
    }

    // Resources page
    // src/dc/routes.tsx genUiRoutes uiRoutesTmpl
    if (opts.genUiRoutes) {
      const generatedResources = uiRoutesTmpl(args)

      await write(join(prjUiSrcPrefixedDir, 'routes.tsx'), generatedResources)
    }

    const generatedUiAdditionalRoutesTmpl = uiAdditionalRoutesTmpl()
    await writeFileIfNotExists(
      join(prjUiSrcPrefixedDir, 'additionalRoutes.tsx'),
      generatedUiAdditionalRoutesTmpl
    )

    // Functions page
    // src/dc/functions/Functions.tsx
    if (opts.genUiFunctions) {
      const generatedResources = uiFunctionsTmpl(opts)

      const uiFunctionsDir = join(prjUiSrcPrefixedDir, 'functions')

      await write(join(uiFunctionsDir, 'Functions.tsx'), generatedResources)
    }

    // Dashboard page
    // src/dc/dashboard.tsx
    if (opts.genUiDashboard) {
      const generatedResources = uiDashboardTmpl()

      await writeFileIfNotExists(
        join(prjUiSrcPrefixedDir, 'Dashboard.tsx'),
        generatedResources
      )
    }
  }

  await generateEnvironment(args)
}

export default generateProject;

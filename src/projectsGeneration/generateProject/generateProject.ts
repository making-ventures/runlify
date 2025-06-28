import {join} from 'path'
import {FileCreator} from './types'
import {uiResourcesTmpl} from '../generators/fileTemplates/ui/resources'
import {uiResourcesPageTmpl} from '../generators/fileTemplates/ui/ResourcesPage'
import {backPermissionToGraphqlTmpl} from '../generators/fileTemplates/back/graph/permissionsToGraphql'
import uiRoutesTmpl from '../generators/fileTemplates/ui/environment/src/routes'
import {uiEntityMappingTmpl} from '../generators/fileTemplates/ui/entityMapping'
import uiDashboardTmpl from '../generators/fileTemplates/ui/Dashboard'
import {uiFunctionsTmpl} from '../generators/fileTemplates/ui/functions/Functions'
import {uiGetDefaultMenuTmpl} from '../generators/fileTemplates/ui/getDefaultMenu'
import {generateEnvironment} from './generateEnvironment'
import {configItemsTmpl} from '../generators/fileTemplates/back/root/config/config'
import {genGraphSchemesByLocalGenerator} from './genGraphSchemesByLocalGenerator'
import {BootstrapEntityInnerOptions, defaultBootstrapEntityOptions} from '../types'
import {restRouterTmpl} from '../generators/fileTemplates/back/root/restRouter'
import {createFilesToWriteUtils, writeFiles} from './utils'
import {uiAdditionalRoutesTmpl} from '../generators/fileTemplates/ui/additionalRoutes'
import {uiGetAdditionalMenuTmpl} from '../generators/fileTemplates/ui/getAdditionalMenu'
import {uiMetaPageTmpl} from '../generators/fileTemplates/ui/MetaPage'
import {additionalServicesTmpl} from '../generators/fileTemplates/back/services/AdditionalServices'
import {System} from '../builders/buildedTypes'
import {cwd} from 'fs-jetpack'
import {camelPlural, pascal, pascalPlural} from '../../utils/cases'
import {
  EntityWideGenerationArgs,
  prepareAdditionalServiceWideGenerationArgs,
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
  ProjectWideGenerationArgs,
} from '../args'
import {backDefaultEnv} from '../generators/fileTemplates/back/environment/defaultEnv'
import backDocsConfiguration from '../generators/fileTemplates/back/environment/docs/backDocsConfiguration'
import {adminAppDocsConfiguration} from '../generators/fileTemplates/ui/environment/docs/adminAppDocsConfiguration'
import backDocsRestApi from '../generators/fileTemplates/back/environment/docs/backDocsRestApi'
import backDocsEntity from '../generators/fileTemplates/back/environment/docs/backDocsEntity'
import {plural, singular} from 'pluralize'
import baseResolversTmpl from '../generators/fileTemplates/back/graph/help/baseResolvers'
import helpServiceTmpl from '../generators/fileTemplates/back/services/HelpService/HelpService'
import graphBaseServicesTmpl from '../generators/fileTemplates/back/services/BaseServices'
import baseTypeDefsTmpl from '../generators/fileTemplates/back/graph/help/baseTypeDefs'
import permissionsToGraphqlTmpl from '../generators/fileTemplates/back/graph/help/permissionsToGraphql'
import {enumTmpl} from '../generators/fileTemplates/back/enum'
import {devEnumTmpl} from '../generators/fileTemplates/back/devEnum'
import {initCommonEnumTmpl} from '../generators/fileTemplates/back/initCommon'
import {initDevEnumTmpl} from '../generators/fileTemplates/back/initDev'
import graphServiceConstrictorsTmpl from '../generators/fileTemplates/back/services/serviceConstrictors'
import {backEntitiesEnumTmpl} from '../generators/fileTemplates/back/backEntitiesEnumTmpl'
import {initEntities} from '../generators/fileTemplates/back/initEntities'
import {generateBackElasticBootstrap} from './generateBackElasticBootstrap';
import backDocsIntegrationClient from '../generators/fileTemplates/back/environment/docs/backDocsIntegrationClient'
import backIntegrationClientTmpl from '../generators/fileTemplates/back/environment/src/integrationClients/IntegrationClient'
import {pascalCase} from 'change-case'
import backIntegrationClientTypesTmpl from '../generators/fileTemplates/back/environment/src/integrationClients/types'
import backDocSpec from '../generators/fileTemplates/back/environment/docs/backDocSpec'
import {generateAdditionalService} from './generateAdditionalService'
import genIntegrationClientsTmpl from '../generators/fileTemplates/back/environment/src/integrationClients/IntegrationClients'
import genIntegrationClientConstrictorsTmpl from '../generators/fileTemplates/back/environment/src/integrationClients/integrationClientConstrictors'
import cleanFiles from '../fileCleaners/cleanFiles'
import {backBaseTypesTmpl} from '../generators/fileTemplates/back/graph/types'
import {backBaseResolversTmpl} from '../generators/fileTemplates/back/graph/resolvers'
import {genGraphCrudSchema} from '../generators/graph/genGraphCrudSchema'
import {printSchema} from 'graphql'
import {backAdditionalResolversTmpl} from '../generators/fileTemplates/back/graph/additionalResolvers'
import {backEntityPermissionToGraphqlTmpl} from '../generators/fileTemplates/back/graph/entityPermissionToGraphqlTmpl'
import {backEntityAdditionalPermissionToGraphqlTmpl} from '../generators/fileTemplates/back/graph/entityAdditionalPermissionToGraphqlTmpl'
import {backBasePermissionToGraphqlTmpl} from '../generators/fileTemplates/back/graph/entityBasePermissionToGraphql'
import {backAdditionalTypesTmpl} from '../generators/fileTemplates/back/graph/additionalTypes'
import {additionalOperationsOnCreateTmpl} from '../generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnCreate'
import {additionalOperationsOnDeleteTmpl} from '../generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnDelete'
import {additionalOperationsOnUpdateTmpl} from '../generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnUpdate'
import {afterCreateTmpl} from '../generators/fileTemplates/back/services/entity/hooks/afterCreate'
import {beforeCreateTmpl} from '../generators/fileTemplates/back/services/entity/hooks/beforeCreate'
import {beforeUpdateTmpl} from '../generators/fileTemplates/back/services/entity/hooks/beforeUpdate'
import {afterUpdateTmpl} from '../generators/fileTemplates/back/services/entity/hooks/afterUpdate'
import {afterDeleteTmpl} from '../generators/fileTemplates/back/services/entity/hooks/afterDelete'
import {beforeDeleteTmpl} from '../generators/fileTemplates/back/services/entity/hooks/beforeDelete'
import {beforeUpsertTmpl} from '../generators/fileTemplates/back/services/entity/hooks/beforeUpsert'
import {changeListFilterTmpl} from '../generators/fileTemplates/back/services/entity/hooks/changeListFilter'
import {initUserHooksTmpl} from '../generators/fileTemplates/back/services/entity/initUserHooks'
import {initBuiltInHooksTmpl} from '../generators/fileTemplates/back/services/entity/initBuiltInHooks'
import {tenantIdRequiredHooksTmpl} from '../generators/fileTemplates/back/services/entity/hooks/tenantIdRequiredHooks'
import {configTmpl} from '../generators/fileTemplates/back/services/entity/config'
import {prismaServiceBaseClassTmpl} from '../generators/fileTemplates/back/services/entity/class'
import {prismaAdditionalServiceClassTmpl} from '../generators/fileTemplates/back/services/entity/additionalClass'
import generateFront from './generateFront'

const generateHelpService = (
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

const generateEntityBackServices = (
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

const generateEntityBackGraph = (
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

const generateBackSrc = (fileCreator: FileCreator, args: ProjectWideGenerationArgs, typesOnly: boolean) => {
  if (!typesOnly) {
    fileCreator.create(
      join(args.options.detachedBackProject, 'src', 'config', 'config.ts'),
      configItemsTmpl(args)
    );
    generateBackIntegrationClients(fileCreator, args);
  }

  args.entities.forEach((entity) => {
    generateEntityBackServices(fileCreator, prepareEntityWideGenerationArgs(args, entity));
    generateEntityBackGraph(fileCreator, prepareEntityWideGenerationArgs(args, entity));
  });
  generateHelpService(fileCreator, args, typesOnly);
}

const generateBackIntegrationClients = (
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

const generateBackEnvs = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  const filePath = join(
    args.options.detachedBackProject,
    'config',
    'default.json'
  )

  fileCreator.create(filePath, backDefaultEnv(args))
}

const generateBackDocsConfiguration = (
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

const generateBackDocsSpec = (
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

const generateBackDocsRestApis = (
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

const generateBackDocsIntegrationClients = (
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

const generateBackDocsEntities = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  args.entities.forEach((entity) => {
    const filePath = join(
      args.options.detachedBackProject,
      'docs',
      plural(entity.type),
      `${entity.name}.md`
    )

    fileCreator.create(
      filePath,
      backDocsEntity(prepareEntityWideGenerationArgs(args, entity))
    )
  })
}

const generateBackEnums = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  args.entities
    .filter((e) => e.predefinedElements.length > 0)
    .forEach((entity) => {
      const filePath = join(
        args.options.detachedBackProject,
        'src',
        'types',
        `${pascal(singular(entity.name))}.ts`
      )

      fileCreator.create(
        filePath,
        enumTmpl({
          entity,
          options: args.options,
        } as EntityWideGenerationArgs)
      )
    })
}

const generateBackEntityEnum = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'src',
    'types',
    'Entity.ts'
  )

  fileCreator.create(
    filePath,
    backEntitiesEnumTmpl({
      entities: args.entities,
      options: args.options,
    } as ProjectWideGenerationArgs)
  )
}

const generateBackEnumsInit = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  args.entities
    .filter((e) => e.predefinedElements.length > 0)
    .forEach((entity) => {
      const filePath = join(
        args.options.detachedBackProject,
        'src',
        'init',
        'common',
        `init${pascal(entity.name)}.ts`
      )

      fileCreator.create(
        filePath,
        initCommonEnumTmpl({
          entity,
          options: args.options,
        } as EntityWideGenerationArgs)
      )
  })
}

const generateBackEntitiesEnumInit = (
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

  fileCreator.create(filePath, initEntities(args))
}

const generateBackDevEnums = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  args.entities
    .filter((e) => e.devPerefinedElements.length > 0)
    .forEach((entity) => {
      const filePath = join(
        args.options.detachedBackProject,
        'src',
        'types',
        `Dev${pascal(singular(entity.name))}.ts`
      )

      fileCreator.create(
        filePath,
        devEnumTmpl({
          entity,
          options: args.options,
        } as EntityWideGenerationArgs)
      )
    })
}

const generateBackDevEnumsInit = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  args.entities
    .filter((e) => e.devPerefinedElements.length > 0)
    .forEach((entity) => {
      const filePath = join(
        args.options.detachedBackProject,
        'src',
        'init',
        'dev',
        `init${pascal(entity.name)}.ts`
      )

      fileCreator.create(
        filePath,
        initDevEnumTmpl({
          entity,
          options: args.options,
        } as EntityWideGenerationArgs)
      )
    })
}

const generateAdminAppDocsConfiguration = (
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

const generateBackDocs = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  generateBackDocsSpec(fileCreator, args);
  generateBackDocsConfiguration(fileCreator, args);
  generateBackDocsRestApis(fileCreator, args);
  generateBackDocsIntegrationClients(fileCreator, args);
  generateBackDocsEntities(fileCreator, args);
  generateBackEnums(fileCreator, args);
  generateBackEnumsInit(fileCreator, args);
  generateBackEntityEnum(fileCreator, args);
  generateBackEntitiesEnumInit(fileCreator, args);
  generateBackDevEnums(fileCreator, args);
  generateBackDevEnumsInit(fileCreator, args);
  generateAdminAppDocsConfiguration(fileCreator, args);
}

const generateBack = (fileCreator: FileCreator, args: ProjectWideGenerationArgs, typesOnly: boolean) => {
  if (!typesOnly) {
    generateBackEnvs(fileCreator, args);
    generateBackDocs(fileCreator, args);
    generateBackElasticBootstrap(fileCreator, args);
  }

  generateBackSrc(fileCreator, args, typesOnly);
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

  cleanFiles(args);

  // Pre grapgql types compose generation
  system.additionalServices.forEach((service) =>
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
  );
  generateBack(fileCreator, args, true);

  writeFiles(getFiles());
  reset();

  await genGraphSchemesByLocalGenerator(opts);

  generateFront(fileCreator, args);

  // Full generation
  system.additionalServices.forEach((service) =>
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
  );
  generateBack(fileCreator, args, false);

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

  generateEnvironment(fileCreator, args);

  writeFiles(getFiles());
  reset();
}

export default generateProject;

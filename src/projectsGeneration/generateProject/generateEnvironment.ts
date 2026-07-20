import {join} from 'path'
import {exists, remove} from 'fs-jetpack'
import {FileCreator} from './types'
import {defaultBootstrapEntityOptions} from '../types'
import {prismaGetterTmpl} from '../generators/fileTemplates/back/environment/src/clients/getPrisma'
import {getQueueTmpl} from '../generators/fileTemplates/back/environment/src/clients/queue/getQueue'
import {environmentIndexTmpl} from '../generators/fileTemplates/back/environment/src'
import {chartBackTmpl} from '../generators/fileTemplates/back/environment/chart/templates/back'
import {gitlabCiTmpl} from '../generators/fileTemplates/back/environment/gitlabCi'
import {chartTmpl} from '../generators/fileTemplates/back/environment/chart/Chart'
import {chartValuesTmpl} from '../generators/fileTemplates/back/environment/chart/values'
import {chartIngressTmpl} from '../generators/fileTemplates/back/environment/chart/templates/ingress'
import {uiGitlabCiTmpl} from '../generators/fileTemplates/ui/environment/gitlabCi'
import {uiChartTmpl} from '../generators/fileTemplates/ui/environment/chart/Chart'
import {uiChartValuesTmpl} from '../generators/fileTemplates/ui/environment/chart/values'
import {uiChartIngressTmpl} from '../generators/fileTemplates/ui/environment/chart/templates/ingress'
import {uiChartFrontTmpl} from '../generators/fileTemplates/ui/environment/chart/templates/front'
import {uiAppTmpl} from '../generators/fileTemplates/ui/environment/src/App'
import {uiLayoutMenuTmpl} from '../generators/fileTemplates/ui/environment/src/layout/Menu'
import {uiDataProviderTmpl} from '../generators/fileTemplates/ui/environment/src/dataProvider'
import {uiI18nProviderTmpl} from '../generators/fileTemplates/ui/environment/src/i18nProvider'
import {uiSpacesContextTmpl} from '../generators/fileTemplates/ui/environment/src/contexts/SpacesContext'
import {uiLayoutAppBarTmpl} from '../generators/fileTemplates/ui/environment/src/layout/AppBar'
import {
  genDeployConnectionPrisma,
  genPrismaSchemaForEntitiesWithClientAdnDb,
} from '../generators/prisma/scheme/genPrismaSchemaForEntitiesWithClientAdnDb'
import {
  genExtraDbDeployPrismaConfig,
  genExtraDbPrismaConfig,
  genMainDeployPrismaConfig,
  genMainPrismaConfig,
  genShardsDeployPrismaConfig,
  genShardsPrismaConfig,
} from '../generators/prisma/scheme/genPrismaConfig'
import {createPgPrismaClientTmpl} from '../generators/fileTemplates/back/environment/src/clients/createPgPrismaClient'
import {writeClientPackageStubsTmpl} from '../generators/fileTemplates/back/environment/src/init/prisma/writeClientPackageStubs'
import {detectPrismaMajorVersion} from '../utils/detectPrismaMajorVersion'
import {Entity} from '../builders'
import {ProjectWideGenerationArgs} from '../args'
import {dockerfileTmplUI} from '../generators/fileTemplates/back/environment/dockerfileTmplUI'
import {dockerfileTmplBack} from '../generators/fileTemplates/back/environment/dockerfileTmplBack'
import {uiCiNotifyTmpl} from '../generators/fileTemplates/ui/environment/ciNotify'
import {ciNotifyTmpl} from '../generators/fileTemplates/back/environment/ciNotify'
import {uiGetAdditionalMethodsTmpl} from '../generators/fileTemplates/ui/environment/src/dataProvider/getAdditionalMethods'
import {environmentTracerTmpl} from '../generators/fileTemplates/back/environment/src/tracing'
import {addWarnings} from './fileHandlers'
import {
  GenerationPathCategory,
  GenerationPathVars,
  resolveGenerationPath,
} from '../builders/generationPaths'

export const generateEnvironment = (
  fileCreator: FileCreator,
  projectWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  const { entities, options, system } = projectWideGenerationArgs
  const opts = {
    ...defaultBootstrapEntityOptions,
    ...options,
  }

  const allEntities: Map<string, Entity> = new Map()
  for (const entity of entities) {
    allEntities.set(entity.name, entity)
  }

  const pathsConfig = system?.generationPaths
  const resolveEnvPath = (
    category: GenerationPathCategory,
    vars: GenerationPathVars = {},
  ) =>
    resolveGenerationPath({
      category,
      detachedBackProject: opts.detachedBackProject,
      detachedUiProject: opts.detachedUiProject,
      pathsConfig,
      vars,
    })

  const prismaMajor = detectPrismaMajorVersion(opts.detachedBackProject)
  const isPrisma7 = prismaMajor >= 7

  // corePrismaGetter
  if (opts.corePrismaGetter) {
    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.BackClientsGetPrisma),
      prismaGetterTmpl(projectWideGenerationArgs, prismaMajor),
      addWarnings({options: opts})
    )

    if (isPrisma7) {
      fileCreator.createIfNotExists(
        resolveEnvPath(GenerationPathCategory.BackClientsCreatePgPrismaClient),
        createPgPrismaClientTmpl(),
      )
    }
  }

  if (opts.corePrismaGetter) {
    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.BackClientsGetQueue),
      getQueueTmpl(opts),
      addWarnings({options: opts})
    )
  }

  // coreIndex
  if (opts.coreIndex) {
    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.BackIndex),
      environmentIndexTmpl(opts),
      addWarnings({options: opts})
    )
    fileCreator.createIfNotExists(
      resolveEnvPath(GenerationPathCategory.BackTracing),
      environmentTracerTmpl(opts)
    )
  }

  // schema.prisma (+ shards for main only, + extra databases)
  if (opts.genPrismaSchema) {
    const dbNames = projectWideGenerationArgs.system.dataBases.map((d) => d.name)
    const schemaOpts = {prismaMajor}

    if (isPrisma7) {
      fileCreator.createIfNotExists(
        resolveEnvPath(GenerationPathCategory.BackInitPrismaWriteClientPackageStubs),
        writeClientPackageStubsTmpl(projectWideGenerationArgs),
      )
    }

    for (const database of dbNames) {
      if (database === 'main') {
        fileCreator.create(
          resolveEnvPath(GenerationPathCategory.BackPrismaSchema),
          genPrismaSchemaForEntitiesWithClientAdnDb(projectWideGenerationArgs, {
            database: 'main',
            forShards: false,
            ...schemaOpts,
          }),
          addWarnings({options: opts})
        )

        if (opts.sharding) {
          fileCreator.create(
            resolveEnvPath(GenerationPathCategory.BackPrismaShardsSchema),
            genPrismaSchemaForEntitiesWithClientAdnDb(projectWideGenerationArgs, {
              database: 'main',
              forShards: true,
              ...schemaOpts,
            }),
            addWarnings({options: opts})
          )

          fileCreator.create(
            resolveEnvPath(GenerationPathCategory.BackPrismaShardsDeployConnection),
            genDeployConnectionPrisma('main', prismaMajor),
            addWarnings({options: opts})
          )

          if (isPrisma7) {
            fileCreator.create(
              resolveEnvPath(GenerationPathCategory.BackPrismaShardsConfig),
              genShardsPrismaConfig(),
              addWarnings({options: opts})
            )
            fileCreator.create(
              resolveEnvPath(GenerationPathCategory.BackPrismaShardsDeployConfig),
              genShardsDeployPrismaConfig(),
              addWarnings({options: opts})
            )
          }
        }

        fileCreator.create(
          resolveEnvPath(GenerationPathCategory.BackPrismaDeployConnection),
          genDeployConnectionPrisma('main', prismaMajor),
          addWarnings({options: opts})
        )

        if (isPrisma7) {
          fileCreator.create(
            resolveEnvPath(GenerationPathCategory.BackPrismaConfig),
            genMainPrismaConfig(),
            addWarnings({options: opts})
          )
          fileCreator.create(
            resolveEnvPath(GenerationPathCategory.BackPrismaDeployConfig),
            genMainDeployPrismaConfig(),
            addWarnings({options: opts})
          )
        }
      } else {
        const dbVars = {database}
        const legacyDeployConnection = join(
          opts.detachedBackProject,
          `prisma/deployConnection.${database}.prisma`,
        )
        if (exists(legacyDeployConnection)) {
          remove(legacyDeployConnection)
        }

        fileCreator.create(
          resolveEnvPath(GenerationPathCategory.BackPrismaDatabaseSchema, dbVars),
          genPrismaSchemaForEntitiesWithClientAdnDb(projectWideGenerationArgs, {
            database,
            forShards: false,
            ...schemaOpts,
          }),
          addWarnings({options: opts})
        )

        fileCreator.create(
          resolveEnvPath(GenerationPathCategory.BackPrismaDatabaseDeployConnection, dbVars),
          genDeployConnectionPrisma(database, prismaMajor),
          addWarnings({options: opts})
        )

        if (isPrisma7) {
          fileCreator.create(
            resolveEnvPath(GenerationPathCategory.BackPrismaDatabaseConfig, dbVars),
            genExtraDbPrismaConfig(database),
            addWarnings({options: opts})
          )
          fileCreator.create(
            resolveEnvPath(GenerationPathCategory.BackPrismaDatabaseDeployConfig, dbVars),
            genExtraDbDeployPrismaConfig(database),
            addWarnings({options: opts})
          )
        }

        fileCreator.createIfNotExists(
          resolveEnvPath(GenerationPathCategory.BackPrismaDatabaseMigrationLock, dbVars),
          `# Please do not edit this file manually
# It should be added to your version-control system (e.g. Git)

provider = "postgresql"
`,
        )
      }
    }
  }



  // chart back
  if (opts.genBackChartBack) {
    // chart itself
    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.BackChartChart),
      chartTmpl(projectWideGenerationArgs),
      addWarnings({options: opts, fileType: 'yaml'})
    )
    // chart values
    if (opts.genBackChartValues) {
      fileCreator.create(
        resolveEnvPath(GenerationPathCategory.BackChartValues),
        chartValuesTmpl(projectWideGenerationArgs),
        addWarnings({options: opts, fileType: 'yaml'})
      )
    }

    // chart ingress
    if (opts.genBackChartIngress) {
      fileCreator.create(
        resolveEnvPath(GenerationPathCategory.BackChartIngress),
        chartIngressTmpl(),
        addWarnings({options: opts, fileType: 'yaml'})
      )
    }
    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.BackChartBack),
      chartBackTmpl(projectWideGenerationArgs),
      addWarnings({options: opts, fileType: 'yaml'})
    )
  }

  // gitlab-ci
  if (opts.genBackGitlabCi) {
    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.BackGitlabCi),
      gitlabCiTmpl(projectWideGenerationArgs),
      addWarnings({options: opts, fileType: 'yaml'})
    )
  }

  // ci-notify
  if (opts.genBackCiNotify) {
    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.BackCiNotify),
      ciNotifyTmpl(projectWideGenerationArgs)
    )
  }

  // dockerfileTmplBack
  if (opts.genDockerfileBack) {
  fileCreator.create(
      resolveEnvPath(GenerationPathCategory.BackDockerfile),
      dockerfileTmplBack(projectWideGenerationArgs),
      addWarnings({options: opts, fileType: 'yaml'})
    )
  }

  // UI
  if (opts.genFrontend) {
    if (opts.genUIApp) {
      fileCreator.create(
        resolveEnvPath(GenerationPathCategory.UiApp),
        uiAppTmpl(projectWideGenerationArgs, opts),
        addWarnings({options: opts})
      )
    }

    // layout
    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.UiLayoutMenu),
      uiLayoutMenuTmpl(opts),
      addWarnings({options: opts})
    )

    if (opts.genUiAppBar) {
      fileCreator.create(
        resolveEnvPath(GenerationPathCategory.UiLayoutAppBar),
        uiLayoutAppBarTmpl(opts),
        addWarnings({options: opts})
      )
    }

    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.UiSpacesContext),
      uiSpacesContextTmpl(projectWideGenerationArgs),
      addWarnings({options: opts})
    )

    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.UiDataProvider),
      uiDataProviderTmpl(entities, opts),
      addWarnings({options: opts})
    )

    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.UiDataProviderGetAdditionalMethods),
      uiGetAdditionalMethodsTmpl(projectWideGenerationArgs.system.additionalServices, opts),
      addWarnings({options: opts})
    )

    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.UiI18nProvider),
      uiI18nProviderTmpl(projectWideGenerationArgs, opts),
      addWarnings({options: opts})
    )

    // chart front
    if (opts.genUiChartFront) {
      // chart itself
      fileCreator.create(
        resolveEnvPath(GenerationPathCategory.UiChartChart),
        uiChartTmpl(projectWideGenerationArgs),
        addWarnings({options: opts, fileType: 'yaml'})
      )
      // chart values
      fileCreator.create(
        resolveEnvPath(GenerationPathCategory.UiChartValues),
        uiChartValuesTmpl(projectWideGenerationArgs),
        addWarnings({options: opts, fileType: 'yaml'})
      )

      fileCreator.create(
        resolveEnvPath(GenerationPathCategory.UiChartFront),
        uiChartFrontTmpl(projectWideGenerationArgs),
        addWarnings({options: opts, fileType: 'yaml'})
      ) 
      // chart ingress
      if (opts.genUiChartIngress) {
        fileCreator.create(
          resolveEnvPath(GenerationPathCategory.UiChartIngress),
          uiChartIngressTmpl(),
          addWarnings({options: opts, fileType: 'yaml'})
        )
      }
    }

    // gitlab-ci
    if (opts.genUiGitlabCi) {
      fileCreator.create(
        resolveEnvPath(GenerationPathCategory.UiGitlabCi),
        uiGitlabCiTmpl(projectWideGenerationArgs),
        addWarnings({options: opts, fileType: 'yaml'})
      )
    }

    // ci-notify
    if (opts.genUiCiNotify) {
      fileCreator.create(
        resolveEnvPath(GenerationPathCategory.UiCiNotify),
        uiCiNotifyTmpl(projectWideGenerationArgs)
      )
    }

    // dockerfileTmplUI
    if (opts.genDockerfileUI) {
    fileCreator.create(
      resolveEnvPath(GenerationPathCategory.UiDockerfile),
      dockerfileTmplUI(projectWideGenerationArgs),
        addWarnings({options: opts, fileType: 'yaml'})
      )
    }
  } // end genFrontend
}

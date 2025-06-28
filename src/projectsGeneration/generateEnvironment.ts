import {join} from 'path'
import {defaultBootstrapEntityOptions, FileCreator} from './types'
import {prismaGetterTmpl} from './generators/fileTemplates/back/environment/src/clients/getPrisma'
import {getQueueTmpl} from './generators/fileTemplates/back/environment/src/clients/queue/getQueue'
import {environmentIndexTmpl} from './generators/fileTemplates/back/environment/src'
import {chartBackTmpl} from './generators/fileTemplates/back/environment/chart/templates/back'
import {gitlabCiTmpl} from './generators/fileTemplates/back/environment/gitlabCi'
import {chartTmpl} from './generators/fileTemplates/back/environment/chart/Chart'
import {chartValuesTmpl} from './generators/fileTemplates/back/environment/chart/values'
import {chartIngressTmpl} from './generators/fileTemplates/back/environment/chart/templates/ingress'
import {uiGitlabCiTmpl} from './generators/fileTemplates/ui/environment/gitlabCi'
import {uiChartTmpl} from './generators/fileTemplates/ui/environment/chart/Chart'
import {uiChartValuesTmpl} from './generators/fileTemplates/ui/environment/chart/values'
import {uiChartIngressTmpl} from './generators/fileTemplates/ui/environment/chart/templates/ingress'
import {uiChartFrontTmpl} from './generators/fileTemplates/ui/environment/chart/templates/front'
import {uiAppTmpl} from './generators/fileTemplates/ui/environment/src/App'
import {uiLayoutMenuTmpl} from './generators/fileTemplates/ui/environment/src/layout/Menu'
import {uiDataProviderTmpl} from './generators/fileTemplates/ui/environment/src/dataProvider'
import {uiI18nProviderTmpl} from './generators/fileTemplates/ui/environment/src/i18nProvider'
import {uiSpacesContextTmpl} from './generators/fileTemplates/ui/environment/src/contexts/SpacesContext'
import {uiLayoutAppBarTmpl} from './generators/fileTemplates/ui/environment/src/layout/AppBar'
import {genPrismaSchemaForEntitiesWithClientAdnDb} from './generators/prisma/scheme/genPrismaSchemaForEntitiesWithClientAdnDb'
import {Entity} from './builders'
import {ProjectWideGenerationArgs} from './args'
import {dockerfileTmplUI} from './generators/fileTemplates/back/environment/dockerfileTmplUI'
import {dockerfileTmplBack} from './generators/fileTemplates/back/environment/dockerfileTmplBack'
import {uiCiNotifyTmpl} from './generators/fileTemplates/ui/environment/ciNotify'
import {ciNotifyTmpl} from './generators/fileTemplates/back/environment/ciNotify'
import {uiGetAdditionalMethodsTmpl} from './generators/fileTemplates/ui/environment/src/dataProvider/getAdditionalMethods'

export const generateEnvironment = async (
  fileCreator: FileCreator,
  projectWideGenerationArgs: ProjectWideGenerationArgs,
) => {
  const { entities, options } = projectWideGenerationArgs
  const opts = {
    ...defaultBootstrapEntityOptions,
    ...options,
  }

  const allEntities: Map<string, Entity> = new Map()
  for (const entity of entities) {
    allEntities.set(entity.name, entity)
  }

  if (opts.detachedBackProject) {
    const prjDetachedBackSrcDir = join(opts.detachedBackProject, 'src')

    // corePrismaGetter
    if (opts.corePrismaGetter) {
      const clientsFolderDir = join(prjDetachedBackSrcDir, 'clients')

      fileCreator.create(
        join(clientsFolderDir, 'getPrisma.ts'),
        prismaGetterTmpl(opts)
      )
    }

    if (opts.corePrismaGetter) {
      const queueFolderDir = join(prjDetachedBackSrcDir, 'clients', 'queue')

      fileCreator.create(join(queueFolderDir, 'getQueue.ts'), getQueueTmpl(opts))
    }

    // coreIndex
    if (opts.coreIndex) {
      fileCreator.create(
        join(prjDetachedBackSrcDir, 'index.ts'),
        environmentIndexTmpl(opts)
      )
    }

    // schema.prisma
    if (opts.genPrismaSchema) {
      const prismaFolderDir = join(opts.detachedBackProject, 'prisma')

      const prismaSchema = genPrismaSchemaForEntitiesWithClientAdnDb(
        projectWideGenerationArgs
      )

      fileCreator.create(join(prismaFolderDir, 'schema.prisma'), prismaSchema)

      if (opts.sharding) {
        const prismaSchema = genPrismaSchemaForEntitiesWithClientAdnDb(
          projectWideGenerationArgs,
          true,
        )

        fileCreator.create(join(prismaFolderDir, 'shards', 'schema.prisma'), prismaSchema)
      }
    }

    // chart
    const chartDir = join(opts.detachedBackProject, 'chart')

    // chart itself
    fileCreator.create(
      join(chartDir, 'Chart.yaml'),
      chartTmpl(projectWideGenerationArgs)
    )

    // chart values
    if (opts.genBackChartValues) {
      fileCreator.create(
        join(chartDir, 'values.yaml'),
        chartValuesTmpl(projectWideGenerationArgs)
      )
    }

    // chart templates
    const chartTemplatesDir = join(chartDir, 'templates')

    // chart ingress
    if (opts.genBackChartIngress) {
      fileCreator.create(
        join(chartTemplatesDir, 'ingress.yaml'),
        chartIngressTmpl(projectWideGenerationArgs)
      )
    }

    // chart back
    if (opts.genBackChartBack) {
      fileCreator.create(
        join(chartTemplatesDir, 'back.yaml'),
        chartBackTmpl(projectWideGenerationArgs)
      )
    }

    // gitlab-ci
    if (opts.genBackGitlabCi) {
      fileCreator.create(
        join(opts.detachedBackProject, '.gitlab-ci.yml'),
        gitlabCiTmpl(projectWideGenerationArgs)
      )
    }

    // ci-notify
    if (opts.genBackCiNotify) {
      fileCreator.create(
        join(opts.detachedBackProject, 'ci-notify.sh'),
        ciNotifyTmpl(projectWideGenerationArgs)
      )
    }

    // dockerfileTmplBack
    fileCreator.create(
      join(opts.detachedBackProject, 'Dockerfile'),
      dockerfileTmplBack(projectWideGenerationArgs)
    )

    // UI
    const prjDetachedUiSrcDir = join(opts.detachedUiProject, 'src')

    if (opts.genUIApp) {
      fileCreator.create(
        join(prjDetachedUiSrcDir, 'App.tsx'),
        uiAppTmpl(projectWideGenerationArgs, opts)
      )
    }

    // layout
    const uiLayoutFolder = join(prjDetachedUiSrcDir, 'layout')

    fileCreator.create(join(uiLayoutFolder, 'Menu.tsx'), uiLayoutMenuTmpl(opts))

    if (opts.genUiAppBar) {
      fileCreator.create(join(uiLayoutFolder, 'AppBar.tsx'), uiLayoutAppBarTmpl(opts))
    }

    const uiContextsFolder = join(prjDetachedUiSrcDir, 'contexts')

    fileCreator.create(
      join(uiContextsFolder, 'SpacesContext.tsx'),
      uiSpacesContextTmpl(projectWideGenerationArgs)
    )

    const uiDataProviderFolder = join(prjDetachedUiSrcDir, 'dataProvider')
    fileCreator.create(
      join(uiDataProviderFolder, 'index.ts'),
      uiDataProviderTmpl(entities, opts)
    )

    fileCreator.create(
      join(uiDataProviderFolder, 'getAdditionalMethods.ts'),
      uiGetAdditionalMethodsTmpl(projectWideGenerationArgs.system.additionalServices, opts)
    )

    const uiI18nProviderFolder = join(prjDetachedUiSrcDir, 'i18nProvider')
    fileCreator.create(
      join(uiI18nProviderFolder, 'index.ts'),
      uiI18nProviderTmpl(projectWideGenerationArgs, opts)
    )

    // chart
    const uiChartDir = join(opts.detachedUiProject, 'chart')

    // chart itself
    fileCreator.create(
      join(uiChartDir, 'Chart.yaml'),
      uiChartTmpl(projectWideGenerationArgs)
    )

    // chart values
    fileCreator.create(
      join(uiChartDir, 'values.yaml'),
      uiChartValuesTmpl(projectWideGenerationArgs)
    )

    // chart templates
    const uiChartTemplatesDir = join(uiChartDir, 'templates')

    // chart ingress
    if (opts.genUiChartIngress) {
      fileCreator.create(
        join(uiChartTemplatesDir, 'ingress.yaml'),
        uiChartIngressTmpl(projectWideGenerationArgs)
      )
    }

    // chart front
    if (opts.genUiChartFront) {
      fileCreator.create(
        join(uiChartTemplatesDir, 'front.yaml'),
        uiChartFrontTmpl(projectWideGenerationArgs)
      )
    }

    // gitlab-ci
    if (opts.genUiGitlabCi) {
      fileCreator.create(
        join(opts.detachedUiProject, '.gitlab-ci.yml'),
        uiGitlabCiTmpl(projectWideGenerationArgs)
      )
    }

    // ci-notify
    if (opts.genUiCiNotify) {
      fileCreator.create(
        join(opts.detachedUiProject, 'ci-notify.sh'),
        uiCiNotifyTmpl(projectWideGenerationArgs)
      )
    }

    // dockerfileTmplUI
    fileCreator.create(
      join(opts.detachedUiProject, 'Dockerfile'),
      dockerfileTmplUI(projectWideGenerationArgs)
    )
  }
}

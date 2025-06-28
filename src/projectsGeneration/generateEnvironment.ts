import { join } from 'path'
import { defaultBootstrapEntityOptions, FileWriter } from './types'
import { prismaGetterTmpl } from './generators/fileTemplates/back/environment/src/clients/getPrisma'
import { getQueueTmpl } from './generators/fileTemplates/back/environment/src/clients/queue/getQueue'
import { environmentIndexTmpl } from './generators/fileTemplates/back/environment/src'
import { chartBackTmpl } from './generators/fileTemplates/back/environment/chart/templates/back'
import { gitlabCiTmpl } from './generators/fileTemplates/back/environment/gitlabCi'
import { chartTmpl } from './generators/fileTemplates/back/environment/chart/Chart'
import { chartValuesTmpl } from './generators/fileTemplates/back/environment/chart/values'
import { chartIngressTmpl } from './generators/fileTemplates/back/environment/chart/templates/ingress'
import { uiGitlabCiTmpl } from './generators/fileTemplates/ui/environment/gitlabCi'
import { uiChartTmpl } from './generators/fileTemplates/ui/environment/chart/Chart'
import { uiChartValuesTmpl } from './generators/fileTemplates/ui/environment/chart/values'
import { uiChartIngressTmpl } from './generators/fileTemplates/ui/environment/chart/templates/ingress'
import { uiChartFrontTmpl } from './generators/fileTemplates/ui/environment/chart/templates/front'
import { uiAppTmpl } from './generators/fileTemplates/ui/environment/src/App'
import { uiLayoutMenuTmpl } from './generators/fileTemplates/ui/environment/src/layout/Menu'
import { uiDataProviderTmpl } from './generators/fileTemplates/ui/environment/src/dataProvider'
import { uiI18nProviderTmpl } from './generators/fileTemplates/ui/environment/src/i18nProvider'
import { uiSpacesContextTmpl } from './generators/fileTemplates/ui/environment/src/contexts/SpacesContext'
import { uiLayoutAppBarTmpl } from './generators/fileTemplates/ui/environment/src/layout/AppBar'
import { genPrismaSchemaForEntitiesWithClientAdnDb } from './generators/prisma/scheme/genPrismaSchemaForEntitiesWithClientAdnDb'
import { Entity } from './builders'
import { ProjectWideGenerationArgs } from './args'
import { dockerfileTmplUI } from './generators/fileTemplates/back/environment/dockerfileTmplUI'
import { dockerfileTmplBack } from './generators/fileTemplates/back/environment/dockerfileTmplBack'
import { uiCiNotifyTmpl } from './generators/fileTemplates/ui/environment/ciNotify'
import { ciNotifyTmpl } from './generators/fileTemplates/back/environment/ciNotify'
import { uiGetAdditionalMethodsTmpl } from './generators/fileTemplates/ui/environment/src/dataProvider/getAdditionalMethods'

export const generateEnvironment = async (
  fileWriter: FileWriter,
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

      fileWriter.write(
        join(clientsFolderDir, 'getPrisma.ts'),
        prismaGetterTmpl(opts)
      )
    }

    if (opts.corePrismaGetter) {
      const queueFolderDir = join(prjDetachedBackSrcDir, 'clients', 'queue')

      fileWriter.write(join(queueFolderDir, 'getQueue.ts'), getQueueTmpl(opts))
    }

    // coreIndex
    if (opts.coreIndex) {
      fileWriter.write(
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

      fileWriter.write(join(prismaFolderDir, 'schema.prisma'), prismaSchema)

      if (opts.sharding) {
        const prismaSchema = genPrismaSchemaForEntitiesWithClientAdnDb(
          projectWideGenerationArgs,
          true,
        )

        fileWriter.write(join(prismaFolderDir, 'shards', 'schema.prisma'), prismaSchema)
      }
    }

    // chart
    const chartDir = join(opts.detachedBackProject, 'chart')

    // chart itself
    fileWriter.write(
      join(chartDir, 'Chart.yaml'),
      chartTmpl(projectWideGenerationArgs)
    )

    // chart values
    if (opts.genBackChartValues) {
      fileWriter.write(
        join(chartDir, 'values.yaml'),
        chartValuesTmpl(projectWideGenerationArgs)
      )
    }

    // chart templates
    const chartTemplatesDir = join(chartDir, 'templates')

    // chart ingress
    if (opts.genBackChartIngress) {
      fileWriter.write(
        join(chartTemplatesDir, 'ingress.yaml'),
        chartIngressTmpl(projectWideGenerationArgs)
      )
    }

    // chart back
    if (opts.genBackChartBack) {
      fileWriter.write(
        join(chartTemplatesDir, 'back.yaml'),
        chartBackTmpl(projectWideGenerationArgs)
      )
    }

    // gitlab-ci
    if (opts.genBackGitlabCi) {
      fileWriter.write(
        join(opts.detachedBackProject, '.gitlab-ci.yml'),
        gitlabCiTmpl(projectWideGenerationArgs)
      )
    }

    // ci-notify
    if (opts.genBackCiNotify) {
      fileWriter.write(
        join(opts.detachedBackProject, 'ci-notify.sh'),
        ciNotifyTmpl(projectWideGenerationArgs)
      )
    }

    // dockerfileTmplBack
    fileWriter.write(
      join(opts.detachedBackProject, 'Dockerfile'),
      dockerfileTmplBack(projectWideGenerationArgs)
    )

    // UI
    const prjDetachedUiSrcDir = join(opts.detachedUiProject, 'src')

    if (opts.genUIApp) {
      fileWriter.write(
        join(prjDetachedUiSrcDir, 'App.tsx'),
        uiAppTmpl(projectWideGenerationArgs, opts)
      )
    }

    // layout
    const uiLayoutFolder = join(prjDetachedUiSrcDir, 'layout')

    fileWriter.write(join(uiLayoutFolder, 'Menu.tsx'), uiLayoutMenuTmpl(opts))

    if (opts.genUiAppBar) {
      fileWriter.write(join(uiLayoutFolder, 'AppBar.tsx'), uiLayoutAppBarTmpl(opts))
    }

    const uiContextsFolder = join(prjDetachedUiSrcDir, 'contexts')

    fileWriter.write(
      join(uiContextsFolder, 'SpacesContext.tsx'),
      uiSpacesContextTmpl(projectWideGenerationArgs)
    )

    const uiDataProviderFolder = join(prjDetachedUiSrcDir, 'dataProvider')
    fileWriter.write(
      join(uiDataProviderFolder, 'index.ts'),
      uiDataProviderTmpl(entities, opts)
    )

    fileWriter.write(
      join(uiDataProviderFolder, 'getAdditionalMethods.ts'),
      uiGetAdditionalMethodsTmpl(projectWideGenerationArgs.system.additionalServices, opts)
    )

    const uiI18nProviderFolder = join(prjDetachedUiSrcDir, 'i18nProvider')
    fileWriter.write(
      join(uiI18nProviderFolder, 'index.ts'),
      uiI18nProviderTmpl(projectWideGenerationArgs, opts)
    )

    // chart
    const uiChartDir = join(opts.detachedUiProject, 'chart')

    // chart itself
    fileWriter.write(
      join(uiChartDir, 'Chart.yaml'),
      uiChartTmpl(projectWideGenerationArgs)
    )

    // chart values
    fileWriter.write(
      join(uiChartDir, 'values.yaml'),
      uiChartValuesTmpl(projectWideGenerationArgs)
    )

    // chart templates
    const uiChartTemplatesDir = join(uiChartDir, 'templates')

    // chart ingress
    if (opts.genUiChartIngress) {
      fileWriter.write(
        join(uiChartTemplatesDir, 'ingress.yaml'),
        uiChartIngressTmpl(projectWideGenerationArgs)
      )
    }

    // chart front
    if (opts.genUiChartFront) {
      fileWriter.write(
        join(uiChartTemplatesDir, 'front.yaml'),
        uiChartFrontTmpl(projectWideGenerationArgs)
      )
    }

    // gitlab-ci
    if (opts.genUiGitlabCi) {
      fileWriter.write(
        join(opts.detachedUiProject, '.gitlab-ci.yml'),
        uiGitlabCiTmpl(projectWideGenerationArgs)
      )
    }

    // ci-notify
    if (opts.genUiCiNotify) {
      fileWriter.write(
        join(opts.detachedUiProject, 'ci-notify.sh'),
        uiCiNotifyTmpl(projectWideGenerationArgs)
      )
    }

    // dockerfileTmplUI
    fileWriter.write(
      join(opts.detachedUiProject, 'Dockerfile'),
      dockerfileTmplUI(projectWideGenerationArgs)
    )
  }
}

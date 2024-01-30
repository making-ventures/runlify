import { join } from 'path'
import { defaultBootstrapEntityOptions } from './types'
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
import { write } from 'fs-jetpack'
import { Entity } from './builders'
import { ProjectWideGenerationArgs } from './args'
import { dockerfileTmplUI } from './generators/fileTemplates/back/environment/dockerfileTmplUI'
import { dockerfileTmplBack } from './generators/fileTemplates/back/environment/dockerfileTmplBack'
import { uiCiNotifyTmpl } from './generators/fileTemplates/ui/environment/ciNotify'
import { ciNotifyTmpl } from './generators/fileTemplates/back/environment/ciNotify'
import { uiGetAdditionalMethodsTmpl } from './generators/fileTemplates/ui/environment/src/dataProvider/getAdditionalMethods'

export const generateEnvironment = async (
  projectWideGenerationArgs: ProjectWideGenerationArgs
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
    // src/prisma/prisma.ts
    if (opts.corePrismaGetter) {
      const clientsFolderDir = join(prjDetachedBackSrcDir, 'clients')

      await write(
        join(clientsFolderDir, 'getPrisma.ts'),
        prismaGetterTmpl(opts)
      )
    }

    // src/clients/queue/getQueue.ts
    if (opts.corePrismaGetter) {
      const queueFolderDir = join(prjDetachedBackSrcDir, 'clients', 'queue')

      await write(join(queueFolderDir, 'getQueue.ts'), getQueueTmpl(opts))
    }

    // coreIndex
    // src/index.ts
    if (opts.coreIndex) {
      await write(
        join(prjDetachedBackSrcDir, 'index.ts'),
        environmentIndexTmpl(opts)
      )
    }

    // schema.prisma
    // prisma/schema.prisma
    if (opts.genPrismaSchema) {
      const prismaFolderDir = join(opts.detachedBackProject, 'prisma')

      const prismaSchema = genPrismaSchemaForEntitiesWithClientAdnDb(
        projectWideGenerationArgs
      )

      await write(join(prismaFolderDir, 'schema.prisma'), prismaSchema)

      if (opts.sharding) {
        const prismaSchema = genPrismaSchemaForEntitiesWithClientAdnDb(
          projectWideGenerationArgs,
          true,
        )

        await write(join(prismaFolderDir, 'shards', 'schema.prisma'), prismaSchema)
      }
    }

    // chart
    const chartDir = join(opts.detachedBackProject, 'chart')

    // chart itself
    // chart/Chart.yaml
    await write(
      join(chartDir, 'Chart.yaml'),
      chartTmpl(projectWideGenerationArgs)
    )

    // chart values
    // chart/values.yaml
    if (opts.genBackChartValues) {
      await write(
        join(chartDir, 'values.yaml'),
        chartValuesTmpl(projectWideGenerationArgs)
      )
    }

    // chart templates
    const chartTemplatesDir = join(chartDir, 'templates')

    // chart ingress
    // chart/templates/ingress.yaml
    if (opts.genBackChartIngress) {
      await write(
        join(chartTemplatesDir, 'ingress.yaml'),
        chartIngressTmpl(projectWideGenerationArgs)
      )
    }

    // chart back
    if (opts.genBackChartBack) {
      // chart/templates/back.yaml
      await write(
        join(chartTemplatesDir, 'back.yaml'),
        chartBackTmpl(projectWideGenerationArgs)
      )
    }

    // gitlab-ci
    // .gitlab-ci.yml
    if (opts.genBackGitlabCi) {
      await write(
        join(opts.detachedBackProject, '.gitlab-ci.yml'),
        gitlabCiTmpl(projectWideGenerationArgs)
      )
    }

    // ci-notify
    // ci-notify.sh
    if (opts.genBackCiNotify) {
      await write(
        join(opts.detachedBackProject, 'ci-notify.sh'),
        ciNotifyTmpl(projectWideGenerationArgs)
      )
    }

    // dockerfileTmplBack
    await write(
      join(opts.detachedBackProject, 'Dockerfile'),
      dockerfileTmplBack(projectWideGenerationArgs)
    )

    // UI
    const prjDetachedUiSrcDir = join(opts.detachedUiProject, 'src')

    // src/App.tsx
    if (opts.genUIApp) {
      await write(
        join(prjDetachedUiSrcDir, 'App.tsx'),
        uiAppTmpl(projectWideGenerationArgs, opts)
      )
    }

    // layout
    const uiLayoutFolder = join(prjDetachedUiSrcDir, 'layout')

    // src/layout/Menu.tsx
    await write(join(uiLayoutFolder, 'Menu.tsx'), uiLayoutMenuTmpl(opts))

    // src/layout/AppBar.tsx
    if (opts.genUiAppBar) {
      await write(join(uiLayoutFolder, 'AppBar.tsx'), uiLayoutAppBarTmpl(opts))
    }

    // src/contexts/SpacesContext.tsx
    const uiContextsFolder = join(prjDetachedUiSrcDir, 'contexts')

    await write(
      join(uiContextsFolder, 'SpacesContext.tsx'),
      uiSpacesContextTmpl(projectWideGenerationArgs)
    )

    // src/dataProvider/index.ts
    const uiDataProviderFolder = join(prjDetachedUiSrcDir, 'dataProvider')
    await write(
      join(uiDataProviderFolder, 'index.ts'),
      uiDataProviderTmpl(entities, opts)
    )

    // src/dataProvider/getAdditionalMethods.ts
    await write(
      join(uiDataProviderFolder, 'getAdditionalMethods.ts'),
      uiGetAdditionalMethodsTmpl(projectWideGenerationArgs.system.additionalServices, opts)
    )

    // src/i18nProvider/index.ts
    const uiI18nProviderFolder = join(prjDetachedUiSrcDir, 'i18nProvider')
    await write(
      join(uiI18nProviderFolder, 'index.ts'),
      uiI18nProviderTmpl(projectWideGenerationArgs, opts)
    )

    // chart
    const uiChartDir = join(opts.detachedUiProject, 'chart')

    // chart itself
    // chart/Chart.yaml
    await write(
      join(uiChartDir, 'Chart.yaml'),
      uiChartTmpl(projectWideGenerationArgs)
    )

    // chart values
    // chart/values.yaml
    await write(
      join(uiChartDir, 'values.yaml'),
      uiChartValuesTmpl(projectWideGenerationArgs)
    )

    // chart templates
    const uiChartTemplatesDir = join(uiChartDir, 'templates')

    // chart ingress
    // chart/templates/ingress.yaml
    if (opts.genUiChartIngress) {
      await write(
        join(uiChartTemplatesDir, 'ingress.yaml'),
        uiChartIngressTmpl(projectWideGenerationArgs)
      )
    }

    // chart front
    // chart/templates/front.yaml
    if (opts.genUiChartFront) {
      await write(
        join(uiChartTemplatesDir, 'front.yaml'),
        uiChartFrontTmpl(projectWideGenerationArgs)
      )
    }

    // gitlab-ci
    // .gitlab-ci.yml
    if (opts.genUiGitlabCi) {
      await write(
        join(opts.detachedUiProject, '.gitlab-ci.yml'),
        uiGitlabCiTmpl(projectWideGenerationArgs)
      )
    }

    // ci-notify
    // ci-notify.sh
    if (opts.genUiCiNotify) {
      await write(
        join(opts.detachedUiProject, 'ci-notify.sh'),
        uiCiNotifyTmpl(projectWideGenerationArgs)
      )
    }

    // dockerfileTmplUI
    await write(
      join(opts.detachedUiProject, 'Dockerfile'),
      dockerfileTmplUI(projectWideGenerationArgs)
    )
  }
}

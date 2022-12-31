/* eslint-disable max-len */
import { join } from 'path'
import {
  camelPlural,
  pascal,
  pascalPlural,
  pascalSingular,
} from '../utils/cases'
import { backBaseTypesTmpl } from './generators/fileTemplates/back/graph/types'
import { backBaseResolversTmpl } from './generators/fileTemplates/back/graph/resolvers'
import { uiListWidgetTmpl } from './generators/fileTemplates/ui/widgets/list/ListWidget'
import { uiCountWidgetTmpl } from './generators/fileTemplates/ui/widgets/count/CountWidget'
import { uiEntityShowIndexTmpl } from './generators/fileTemplates/ui/pages/EntityShow'
import { uiDefaultEditTmpl } from './generators/fileTemplates/ui/pages/EntityEdit/DefaultEntityEdit'
import { uiDefaultCreateTmpl } from './generators/fileTemplates/ui/pages/EntityCreate/DefaultEntityCreate'
import { uiDefaultListTmpl } from './generators/fileTemplates/ui/pages/EntityList/DefaultEntityList'
import { uiFilterTmpl } from './generators/fileTemplates/ui/pages/EntityList/EntityFilter'
import { uiEditTmpl } from './generators/fileTemplates/ui/pages/EntityEdit'
import { uiCreateTmpl } from './generators/fileTemplates/ui/pages/EntityCreate'
import { uiListTmpl } from './generators/fileTemplates/ui/pages/EntityList'
import { getLinksFromExternalEntities } from './links/getLinksFromExternalEntities'
import { genGraphCrudSchema } from './generators/graph/genGraphCrudSchema'
import { printSchema } from 'graphql'
import { uiEntityShowMainTabTmpl } from './generators/fileTemplates/ui/pages/EntityShow/MainTab'
import { uiEntityShowDefaultMainTabTmpl } from './generators/fileTemplates/ui/pages/EntityShow/DefaultMainTab'
import { uiEntityShowDependencyTabTmpl } from './generators/fileTemplates/ui/pages/EntityShow/DependencyTab'
import { uiDefaultActionTmpl } from './generators/fileTemplates/ui/pages/EntityShow/DefaultActions'
import { writeFileIfNotExists } from './utils'
import { write } from 'fs-jetpack'
import { uiAdditionalTabsTmpl } from './generators/fileTemplates/ui/pages/EntityShow/additionalTabs'
import { backAdditionalMethodsTmpl } from './generators/fileTemplates/back/services/entity/additionalMethods'
import { backAdditionalResolversTmpl } from './generators/fileTemplates/back/graph/additionalResolvers'
import { backEntityPermissionToGraphqlTmpl } from './generators/fileTemplates/back/graph/entityPermissionToGraphqlTmpl'
import { backEntityAdditionalPermissionToGraphqlTmpl } from './generators/fileTemplates/back/graph/entityAdditionalPermissionToGraphqlTmpl'
import { backBasePermissionToGraphqlTmpl } from './generators/fileTemplates/back/graph/entityBasePermissionToGraphql'
import { backAdditionalTypesTmpl } from './generators/fileTemplates/back/graph/additionalTypes'
import { prismaServiceTmpl } from './generators/fileTemplates/back/services/entity/service'
import { additionalOperationsOnCreateTmpl } from './generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnCreate'
import { additionalOperationsOnDeleteTmpl } from './generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnDelete'
import { additionalOperationsOnUpdateTmpl } from './generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnUpdate'
import { afterCreateTmpl } from './generators/fileTemplates/back/services/entity/hooks/afterCreate'
import { beforeCreateTmpl } from './generators/fileTemplates/back/services/entity/hooks/beforeCreate'
import { beforeUpdateTmpl } from './generators/fileTemplates/back/services/entity/hooks/beforeUpdate'
import { afterUpdateTmpl } from './generators/fileTemplates/back/services/entity/hooks/afterUpdate'
import { afterDeleteTmpl } from './generators/fileTemplates/back/services/entity/hooks/afterDelete'
import { getUnPostOperationsTmpl } from './generators/fileTemplates/back/services/entity/hooks/getUnPostOperations'
import { getRegistryEntriesTmpl } from './generators/fileTemplates/back/services/entity/hooks/getRegistryEntries'
import { getPostOperationsTmpl } from './generators/fileTemplates/back/services/entity/hooks/getPostOperations'
import { beforeDeleteTmpl } from './generators/fileTemplates/back/services/entity/hooks/beforeDelete'
import { beforeUpsertTmpl } from './generators/fileTemplates/back/services/entity/hooks/beforeUpsert'
import { changeListFilterTmpl } from './generators/fileTemplates/back/services/entity/hooks/changeListFilter'
import { uiDefaultShowTmpl } from './generators/fileTemplates/ui/pages/EntityShow/DefaultEntityShow'
import { uiDefaultFilterTmpl } from './generators/fileTemplates/ui/pages/EntityList/DefaultEntityFilter'
import { EntityWideGenerationArgs } from './args'
import { initUserHooksTmpl } from './generators/fileTemplates/back/services/entity/initUserHooks'
import { initBuiltInHooksTmpl } from './generators/fileTemplates/back/services/entity/initBuiltInHooks'
import { tenantIdRequiredHooksTmpl } from './generators/fileTemplates/back/services/entity/hooks/tenantIdRequiredHooks'
import { configTmpl } from './generators/fileTemplates/back/services/entity/config'
import { prismaServiceBaseClassTmpl } from './generators/fileTemplates/back/services/entity/class'
import { prismaServiceClassTmpl } from './generators/fileTemplates/back/services/entity/additionalClass'

export const generateEntity = async (
  entityWideGenerationArgs: EntityWideGenerationArgs
) => {
  const {
    system,
    allEntities,
    allSumRegistries,
    allInfoRegistries,
    entity,
    allLinks,
    options,
  } = entityWideGenerationArgs
  let prjBackSrcPrefixedDir = ''
  const prjDetachedBackSrcDir = join(options.detachedBackProject, 'src')

  // if (options.detachedBackProject) {
  prjBackSrcPrefixedDir = join(prjDetachedBackSrcDir, 'adm')

  // } else {
  //   prjBackSrcPrefixedDir = join(__dirname, '..', '..', prefix);
  // }

  // Prisma service
  if (options.genPrismaServices && !options.typesOnly) {
    const serviceName = `${pascalPlural(entity.name)}Service`
    const serviceDir = join(prjBackSrcPrefixedDir, 'services', serviceName)
    const oldServicePath = join(serviceDir, `${serviceName}.ts`)
    const configPath = join(serviceDir, `config.ts`)
    const baseClassPath = join(serviceDir, `Base${serviceName}Class.ts`)
    const classPath = join(serviceDir, `${serviceName}Class.ts`)

    if (entityWideGenerationArgs.entity.previewFeatures.includes('classService')) {
      const config = configTmpl(entityWideGenerationArgs)
      const baseClassService = prismaServiceBaseClassTmpl(entityWideGenerationArgs)
      const classService = prismaServiceClassTmpl(entityWideGenerationArgs)
      await write(configPath, config)
      await write(baseClassPath, baseClassService)
      await writeFileIfNotExists(classPath, classService)
      // await remove(oldServicePath)
    } else {
      const generatedService = prismaServiceTmpl(entityWideGenerationArgs)

      await write(oldServicePath, generatedService)
      // await remove(configPath)
      // await remove(baseClassPath)
    }

    await writeFileIfNotExists(
      join(serviceDir, 'additionalMethods.ts'),
      backAdditionalMethodsTmpl(entityWideGenerationArgs)
    )
    await writeFileIfNotExists(
      join(serviceDir, 'initUserHooks.ts'),
      initUserHooksTmpl(entityWideGenerationArgs)
    )

    const hooksDir = join(serviceDir, 'hooks')
    if (['optional', 'required'].includes(entity.multitenancy)) {
      if (
        !entityWideGenerationArgs.entities.some(
          (entity) => entity.name === 'tenants'
        )
      ) {
        throw new Error(
          'Only the sprt project supports the multitenancy field!'
        )
      }

      await write(
        join(hooksDir, 'tenantIdRequiredHooks.ts'),
        tenantIdRequiredHooksTmpl(entityWideGenerationArgs)
      )
    }

    await write(
      join(serviceDir, 'initBuiltInHooks.ts'),
      initBuiltInHooksTmpl(entityWideGenerationArgs)
    )

    await writeFileIfNotExists(
      join(hooksDir, 'additionalOperationsOnCreate.ts'),
      additionalOperationsOnCreateTmpl(entityWideGenerationArgs)
    )
    await writeFileIfNotExists(
      join(hooksDir, 'additionalOperationsOnUpdate.ts'),
      additionalOperationsOnUpdateTmpl(entityWideGenerationArgs)
    )
    await writeFileIfNotExists(
      join(hooksDir, 'additionalOperationsOnDelete.ts'),
      additionalOperationsOnDeleteTmpl(entityWideGenerationArgs)
    )

    await writeFileIfNotExists(
      join(hooksDir, 'beforeCreate.ts'),
      beforeCreateTmpl(entityWideGenerationArgs)
    )
    await writeFileIfNotExists(
      join(hooksDir, 'beforeDelete.ts'),
      beforeDeleteTmpl(entityWideGenerationArgs)
    )
    await writeFileIfNotExists(
      join(hooksDir, 'beforeUpdate.ts'),
      beforeUpdateTmpl(entityWideGenerationArgs)
    )
    await writeFileIfNotExists(
      join(hooksDir, 'beforeUpsert.ts'),
      beforeUpsertTmpl(entityWideGenerationArgs)
    )
    await writeFileIfNotExists(
      join(hooksDir, 'afterCreate.ts'),
      afterCreateTmpl(entityWideGenerationArgs)
    )
    await writeFileIfNotExists(
      join(hooksDir, 'afterUpdate.ts'),
      afterUpdateTmpl(entityWideGenerationArgs)
    )
    await writeFileIfNotExists(
      join(hooksDir, 'afterDelete.ts'),
      afterDeleteTmpl(entityWideGenerationArgs)
    )
    await writeFileIfNotExists(
      join(hooksDir, 'changeListFilter.ts'),
      changeListFilterTmpl(entityWideGenerationArgs)
    )

    if (entity.type === 'document') {
      await writeFileIfNotExists(
        join(hooksDir, 'getRegistryEntries.ts'),
        getRegistryEntriesTmpl(system.prefix, entity)
      )
      await write(
        join(hooksDir, 'getPostOperations.ts'),
        getPostOperationsTmpl(
          system.prefix,
          entity,
          allSumRegistries,
          allInfoRegistries,
          options
        )
      )
      await write(
        join(hooksDir, 'getUnPostOperations.ts'),
        getUnPostOperationsTmpl(system.prefix, entity, options)
      )
    }
  }

  // Graph
  const graphServiceDir = join(
    prjBackSrcPrefixedDir,
    'graph',
    'services',
    camelPlural(entity.name)
  )

  // Graph schema
  if (options.genGraphSchema) {
    await write(
      join(graphServiceDir, 'baseTypeDefs.ts'),
      backBaseTypesTmpl(printSchema(genGraphCrudSchema(entity)), options)
    )

    await writeFileIfNotExists(
      join(graphServiceDir, 'additionalTypeDefs.ts'),
      backAdditionalTypesTmpl()
    )
  }

  // Graph resolvers
  if (options.genGraphResolvers && !options.typesOnly) {
    await write(
      `${graphServiceDir}/baseResolvers.ts`,
      backBaseResolversTmpl(entityWideGenerationArgs)
    )
    await writeFileIfNotExists(
      `${graphServiceDir}/additionalResolvers.ts`,
      backAdditionalResolversTmpl()
    )
  }

  // UI

  let prjUiSrcPrefixedDir = ''
  const prjDetachedUiSrcDir = join(options.detachedUiProject, 'src')

  // if (options.detachedBackProject) {
  prjUiSrcPrefixedDir = join(prjDetachedUiSrcDir, 'adm')

  // } else {
  //   prjUiSrcPrefixedDir = join('/home/name/prj/crawler-ui/src', prefix);
  // }

  // const prjUiSrcPrefixedDir = join('/home/name/prj/crawler-ui/src', prefix);

  // const prjUiSrcPrefixedDir = join('/c/prjs/crawler-ui/src', prefix);

  // Widgets
  const widgetsDir = join(prjUiSrcPrefixedDir, 'widgets')

  if (!options.typesOnly) {
    // Permissions
    await write(
      `${graphServiceDir}/permissionsToGraphql.ts`,
      backEntityPermissionToGraphqlTmpl(entityWideGenerationArgs)
    )
    await write(
      `${graphServiceDir}/basePermissionsToGraphql.ts`,
      backBasePermissionToGraphqlTmpl(entityWideGenerationArgs)
    )
    await write(
      `${graphServiceDir}/additionalPermissionsToGraphql.ts`,
      backEntityAdditionalPermissionToGraphqlTmpl(entityWideGenerationArgs)
    )

    // CountWidget
    // src/dc/widgets/count/CountAccountsWidget.tsx genUiCountWidget uiCountWidgetTmpl
    if (options.genUiCountWidget) {
      const countWdgetsDir = join(widgetsDir, 'count')

      const generatedResources = uiCountWidgetTmpl(entityWideGenerationArgs)

      await write(
        join(countWdgetsDir, `Count${pascal(entity.name)}Widget.tsx`),
        generatedResources
      )
    }

    const toLinks = getLinksFromExternalEntities(entity, allLinks)

    // log.info(`To links for entity ${entity.name}`);
    // log.info(toLinks);

    // pages
    const pagesDir = join(prjUiSrcPrefixedDir, 'pages', entity.name)

    // EntityShow
    // src/air/pages/countries/CountryShow
    if (options.forms.show) {
      const entityShowDir = join(pagesDir, `${pascalSingular(entity.name)}Show`)

      // MainTab
      // Do not touch if already exists
      const mainTab = uiEntityShowMainTabTmpl()
      await writeFileIfNotExists(join(entityShowDir, 'MainTab.tsx'), mainTab)

      // DefaultMainTab
      const defaultMainTab = uiEntityShowDefaultMainTabTmpl(
        entityWideGenerationArgs
      )
      await write(join(entityShowDir, 'DefaultMainTab.tsx'), defaultMainTab)

      // // index
      // const index = uiEntityShowIndexTmpl(prefix, allEntities, entity, toLinks, options);
      // await write(join(entityShowDir, 'index.tsx'), index);

      // DefaultEntityShow
      await write(
        join(entityShowDir, `Default${pascalSingular(entity.name)}Show.tsx`),
        uiDefaultShowTmpl(entityWideGenerationArgs)
      )

      // DefaultActions
      // if (entity.type === 'document' && entity.registries.length > 0) {
      await write(
        join(entityShowDir, 'DefaultActions.tsx'),
        uiDefaultActionTmpl(entityWideGenerationArgs)
      )
      // }

      // index
      await writeFileIfNotExists(
        join(entityShowDir, 'index.tsx'),
        uiEntityShowIndexTmpl(entityWideGenerationArgs)
      )

      const additionalTabs = uiAdditionalTabsTmpl()
      await writeFileIfNotExists(
        join(entityShowDir, 'additionalTabs.tsx'),
        additionalTabs
      )

      // DependencyTabs
      for (const link of toLinks) {
        const tabsDir = join(entityShowDir, 'tabs')

        const entity = allEntities.get(link.entityOwnerName)

        if (!entity) {
          throw new Error(`The is no "${link.entityOwnerName}" entity`)
        }

        const componentName = `${pascal(entity.name)}${pascal(
          link.fromField.name
        )}Tab`

        const dependencyTab = uiEntityShowDependencyTabTmpl(
          allEntities,
          entity,
          link,
          options
        )
        await write(join(tabsDir, `${componentName}.tsx`), dependencyTab)
      }
    }

    if (options.forms.create) {
      const entityCreateDir = join(
        pagesDir,
        `${pascalSingular(entity.name)}Create`
      )

      await write(
        join(
          entityCreateDir,
          `Default${pascalSingular(entity.name)}Create.tsx`
        ),
        uiDefaultCreateTmpl(entityWideGenerationArgs)
      )
      await writeFileIfNotExists(
        join(entityCreateDir, 'index.tsx'),
        uiCreateTmpl(entityWideGenerationArgs)
      )
    }

    if (options.forms.edit) {
      const entityEditDir = join(pagesDir, `${pascalSingular(entity.name)}Edit`)

      await write(
        join(entityEditDir, `Default${pascalSingular(entity.name)}Edit.tsx`),
        uiDefaultEditTmpl(entityWideGenerationArgs)
      )
      await writeFileIfNotExists(
        join(entityEditDir, 'index.tsx'),
        uiEditTmpl(entityWideGenerationArgs)
      )
    }

    if (options.forms.list) {
      const entityListDir = join(pagesDir, `${pascalSingular(entity.name)}List`)

      await write(
        join(entityListDir, `Default${pascalSingular(entity.name)}List.tsx`),
        uiDefaultListTmpl(entityWideGenerationArgs)
      )
      await writeFileIfNotExists(
        join(entityListDir, `${pascalSingular(entity.name)}Filter.tsx`),
        uiFilterTmpl(entityWideGenerationArgs)
      )
      await write(
        join(entityListDir, `Default${pascalSingular(entity.name)}Filter.tsx`),
        uiDefaultFilterTmpl(entityWideGenerationArgs)
      )
      await writeFileIfNotExists(
        join(entityListDir, 'index.tsx'),
        uiListTmpl(entityWideGenerationArgs)
      )
    }

    // ListWidget
    // src/dc/widgets/list/ListAccountsWidget.tsx genUiListWidget uiListWidgetTmpl
    if (options.genUiListWidget) {
      const listWdgetsDir = join(widgetsDir, 'list')

      const generatedResources = uiListWidgetTmpl(entityWideGenerationArgs)

      await write(
        join(listWdgetsDir, `List${pascal(entity.name)}Widget.tsx`),
        generatedResources
      )
    }
  }
}

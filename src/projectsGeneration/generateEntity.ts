import {join} from 'path'
import {
  camelPlural,
  pascal,
  pascalPlural,
  pascalSingular,
} from '../utils/cases'
import {backBaseTypesTmpl} from './generators/fileTemplates/back/graph/types'
import {backBaseResolversTmpl} from './generators/fileTemplates/back/graph/resolvers'
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
import {genGraphCrudSchema} from './generators/graph/genGraphCrudSchema'
import {printSchema} from 'graphql'
import {uiEntityShowMainTabTmpl} from './generators/fileTemplates/ui/pages/EntityShow/MainTab'
import {uiEntityShowDefaultMainTabTmpl} from './generators/fileTemplates/ui/pages/EntityShow/DefaultMainTab'
import {uiEntityShowDependencyTabTmpl} from './generators/fileTemplates/ui/pages/EntityShow/DependencyTab'
import {uiDefaultActionTmpl} from './generators/fileTemplates/ui/pages/EntityShow/DefaultActions'
import {uiAdditionalTabsTmpl} from './generators/fileTemplates/ui/pages/EntityShow/additionalTabs'
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
import {uiDefaultShowTmpl} from './generators/fileTemplates/ui/pages/EntityShow/DefaultEntityShow'
import {uiDefaultFilterTmpl} from './generators/fileTemplates/ui/pages/EntityList/DefaultEntityFilter'
import {EntityWideGenerationArgs} from './args'
import {initUserHooksTmpl} from './generators/fileTemplates/back/services/entity/initUserHooks'
import {initBuiltInHooksTmpl} from './generators/fileTemplates/back/services/entity/initBuiltInHooks'
import {tenantIdRequiredHooksTmpl} from './generators/fileTemplates/back/services/entity/hooks/tenantIdRequiredHooks'
import {configTmpl} from './generators/fileTemplates/back/services/entity/config'
import {prismaServiceBaseClassTmpl} from './generators/fileTemplates/back/services/entity/class'
import {prismaAdditionalServiceClassTmpl} from './generators/fileTemplates/back/services/entity/additionalClass'
import {uiListBreadcrumbsTmpl} from './generators/fileTemplates/ui/pages/EntityList/EntityBreadcrumbs'
import {FileCreator} from './types'

export const generateEntity = async (
  fileCreator: FileCreator,
  entityWideGenerationArgs: EntityWideGenerationArgs,
) => {
  const {
    allEntities,
    allSumRegistries,
    allInfoRegistries,
    entity,
    allLinks,
    options,
  } = entityWideGenerationArgs;
  let prjBackSrcPrefixedDir = '';
  const prjDetachedBackSrcDir = join(options.detachedBackProject, 'src');

  prjBackSrcPrefixedDir = join(prjDetachedBackSrcDir, 'adm');

  // Prisma service
  if (options.genPrismaServices && !options.typesOnly) {
    const serviceName = `${pascalPlural(entity.name)}Service`;
    const serviceDir = join(prjBackSrcPrefixedDir, 'services', serviceName);
    const servicePath = join(serviceDir, `${serviceName}.ts`);
    const configPath = join(serviceDir, `config.ts`);
    const additionalServicePath = join(serviceDir, `Additional${serviceName}.ts`);

    const additionalClassService = prismaAdditionalServiceClassTmpl(entityWideGenerationArgs);
    fileCreator.createIfNotExists(additionalServicePath, additionalClassService);

    const generatedClassService = prismaServiceBaseClassTmpl(entityWideGenerationArgs);
    fileCreator.create(servicePath, generatedClassService);

    const config = configTmpl(
      entityWideGenerationArgs,
      allSumRegistries,
      allInfoRegistries,
    );
    fileCreator.create(configPath, config);

    fileCreator.createIfNotExists(
      join(serviceDir, 'initUserHooks.ts'),
      initUserHooksTmpl(entityWideGenerationArgs)
    );

    const hooksDir = join(serviceDir, 'hooks');
    if (['optional', 'required'].includes(entity.multitenancy)) {
      if (
        !entityWideGenerationArgs.entities.some(
          (entity) => entity.name === 'tenants'
        )
      ) {
        throw new Error('Tenants entity not presented, you can\'t use tenants in project');
      }

      fileCreator.create(
        join(hooksDir, 'tenantIdRequiredHooks.ts'),
        tenantIdRequiredHooksTmpl(entityWideGenerationArgs)
      );
    }

    fileCreator.create(
      join(serviceDir, 'initBuiltInHooks.ts'),
      initBuiltInHooksTmpl(entityWideGenerationArgs)
    );

    if (!entity.elasticOnly) {
      fileCreator.createIfNotExists(
        join(hooksDir, 'additionalOperationsOnCreate.ts'),
        additionalOperationsOnCreateTmpl(entityWideGenerationArgs)
      );
      fileCreator.createIfNotExists(
        join(hooksDir, 'additionalOperationsOnUpdate.ts'),
        additionalOperationsOnUpdateTmpl(entityWideGenerationArgs)
      );
      fileCreator.createIfNotExists(
        join(hooksDir, 'additionalOperationsOnDelete.ts'),
        additionalOperationsOnDeleteTmpl(entityWideGenerationArgs)
      );
    }

    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeCreate.ts'),
      beforeCreateTmpl(entityWideGenerationArgs)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeDelete.ts'),
      beforeDeleteTmpl(entityWideGenerationArgs)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeUpdate.ts'),
      beforeUpdateTmpl(entityWideGenerationArgs)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeUpsert.ts'),
      beforeUpsertTmpl(entityWideGenerationArgs)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'afterCreate.ts'),
      afterCreateTmpl(entityWideGenerationArgs)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'afterUpdate.ts'),
      afterUpdateTmpl(entityWideGenerationArgs)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'afterDelete.ts'),
      afterDeleteTmpl(entityWideGenerationArgs)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'changeListFilter.ts'),
      changeListFilterTmpl(entityWideGenerationArgs)
    );
  }

  // Graph
  const graphServiceDir = join(
    prjBackSrcPrefixedDir,
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

  // Graph resolvers
  if (options.genGraphResolvers && !options.typesOnly) {
    fileCreator.create(
      `${graphServiceDir}/baseResolvers.ts`,
      backBaseResolversTmpl(entityWideGenerationArgs)
    );
    fileCreator.createIfNotExists(
      `${graphServiceDir}/additionalResolvers.ts`,
      backAdditionalResolversTmpl()
    );
  }

  // UI

  let prjUiSrcPrefixedDir = '';
  const prjDetachedUiSrcDir = join(options.detachedUiProject, 'src');

  prjUiSrcPrefixedDir = join(prjDetachedUiSrcDir, 'adm');

  // Widgets
  const widgetsDir = join(prjUiSrcPrefixedDir, 'widgets');

  if (!options.typesOnly) {
    // Permissions
    fileCreator.create(
      `${graphServiceDir}/permissionsToGraphql.ts`,
      backEntityPermissionToGraphqlTmpl(entityWideGenerationArgs)
    );
    fileCreator.create(
      `${graphServiceDir}/basePermissionsToGraphql.ts`,
      backBasePermissionToGraphqlTmpl(entityWideGenerationArgs)
    );
    fileCreator.create(
      `${graphServiceDir}/additionalPermissionsToGraphql.ts`,
      backEntityAdditionalPermissionToGraphqlTmpl(entityWideGenerationArgs)
    );

    // CountWidget
    if (options.genUiCountWidget) {
      const countWdgetsDir = join(widgetsDir, 'count');

      const generatedResources = uiCountWidgetTmpl(entityWideGenerationArgs);

      fileCreator.create(
        join(countWdgetsDir, `Count${pascal(entity.name)}Widget.tsx`),
        generatedResources
      );
    }

    const toLinks = getLinksFromExternalEntities(entity, allLinks);

    // pages
    const pagesDir = join(prjUiSrcPrefixedDir, 'pages', entity.name);

    // EntityShow
    if (options.forms.show) {
      const entityShowDir = join(pagesDir, `${pascalSingular(entity.name)}Show`);

      // MainTab
      const mainTab = uiEntityShowMainTabTmpl();
      fileCreator.createIfNotExists(join(entityShowDir, 'MainTab.tsx'), mainTab);

      // DefaultMainTab
      const defaultMainTab = uiEntityShowDefaultMainTabTmpl(
        entityWideGenerationArgs
      );
      fileCreator.create(join(entityShowDir, 'DefaultMainTab.tsx'), defaultMainTab);

      // DefaultEntityShow
      fileCreator.create(
        join(entityShowDir, `Default${pascalSingular(entity.name)}Show.tsx`),
        uiDefaultShowTmpl(entityWideGenerationArgs)
      );

      // DefaultActions
      fileCreator.create(
        join(entityShowDir, 'DefaultActions.tsx'),
        uiDefaultActionTmpl(entityWideGenerationArgs)
      );

      // index
      fileCreator.createIfNotExists(
        join(entityShowDir, 'index.tsx'),
        uiEntityShowIndexTmpl(entityWideGenerationArgs)
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

    if (options.forms.create) {
      const entityCreateDir = join(
        pagesDir,
        `${pascalSingular(entity.name)}Create`
      );

      fileCreator.create(
        join(
          entityCreateDir,
          `Default${pascalSingular(entity.name)}Create.tsx`
        ),
        uiDefaultCreateTmpl(entityWideGenerationArgs)
      );
      fileCreator.createIfNotExists(
        join(entityCreateDir, 'index.tsx'),
        uiCreateTmpl(entityWideGenerationArgs)
      );
    }

    if (options.forms.edit) {
      const entityEditDir = join(pagesDir, `${pascalSingular(entity.name)}Edit`);

      fileCreator.create(
        join(entityEditDir, `Default${pascalSingular(entity.name)}Edit.tsx`),
        uiDefaultEditTmpl(entityWideGenerationArgs)
      );
      fileCreator.createIfNotExists(
        join(entityEditDir, 'index.tsx'),
        uiEditTmpl(entityWideGenerationArgs)
      );
    }

    if (options.forms.list) {
      const entityListDir = join(pagesDir, `${pascalSingular(entity.name)}List`);

      fileCreator.create(
        join(entityListDir, `Default${pascalSingular(entity.name)}List.tsx`),
        uiDefaultListTmpl(entityWideGenerationArgs)
      );
      fileCreator.createIfNotExists(
        join(entityListDir, `${pascalSingular(entity.name)}Filter.tsx`),
        uiFilterTmpl(entityWideGenerationArgs)
      );
      fileCreator.createIfNotExists(
        join(entityListDir, `${pascalSingular(entity.name)}ListBreadcrumbs.tsx`),
        uiListBreadcrumbsTmpl(entityWideGenerationArgs)
      );
      fileCreator.create(
        join(entityListDir, `Default${pascalSingular(entity.name)}Filter.tsx`),
        uiDefaultFilterTmpl(entityWideGenerationArgs)
      );
      fileCreator.createIfNotExists(
        join(entityListDir, 'index.tsx'),
        uiListTmpl(entityWideGenerationArgs)
      );
    }

    // ListWidget
    if (options.genUiListWidget) {
      const listWdgetsDir = join(widgetsDir, 'list');

      const generatedResources = uiListWidgetTmpl(entityWideGenerationArgs);

      fileCreator.create(
        join(listWdgetsDir, `List${pascal(entity.name)}Widget.tsx`),
        generatedResources
      );
    }
  }
}

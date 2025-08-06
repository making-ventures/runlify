import {FileCreator} from '../types'
import {
  prepareEntityWideGenerationArgs,
  ProjectWideGenerationArgs,
} from '../../args'
import generateFrontSrcTranslations from './translations/generateFrontSrcTranslations'
import generateFrontSrcEntity from './entity/generateFrontSrcEntity'
import {join} from 'path'
import uiDashboardTmpl from '../../generators/fileTemplates/ui/Dashboard'
import { uiFunctionsTmpl } from '../../generators/fileTemplates/ui/functions/Functions'
import { uiAdditionalRoutesTmpl } from '../../generators/fileTemplates/ui/additionalRoutes'
import uiRoutesTmpl from '../../generators/fileTemplates/ui/environment/src/routes'
import { uiGetAdditionalMenuTmpl } from '../../generators/fileTemplates/ui/getAdditionalMenu'
import { uiGetDefaultMenuTmpl } from '../../generators/fileTemplates/ui/getDefaultMenu'
import { uiEntityMappingTmpl } from '../../generators/fileTemplates/ui/entityMapping'
import { uiMetaPageTmpl } from '../../generators/fileTemplates/ui/MetaPage'
import { uiResourcesPageTmpl } from '../../generators/fileTemplates/ui/ResourcesPage'
import { uiResourcesTmpl } from '../../generators/fileTemplates/ui/resources'
import {addWarnings} from '../fileHandlers'

const generateFrontSrc = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  args.entities.forEach((entity) => {
    generateFrontSrcEntity(fileCreator, prepareEntityWideGenerationArgs(args, entity));
  });

  generateFrontSrcTranslations(fileCreator, args);

  const prjUiSrcPrefixedDir = join(args.options.detachedUiProject, 'src', 'adm');

  if (!args.options.typesOnly) {
    // Resources
    if (args.options.genUiResources) {
      const {resources, resourcesChunk0, resourcesChunk1} = uiResourcesTmpl(args);

      fileCreator.create(
        join(prjUiSrcPrefixedDir, 'resources.tsx'),
        resources,
        addWarnings({options: args.options})
      );
      fileCreator.create(
        join(prjUiSrcPrefixedDir, 'resourcesChunk0.tsx'),
        resourcesChunk0,
        addWarnings({options: args.options})
      );
      fileCreator.create(
        join(prjUiSrcPrefixedDir, 'resourcesChunk1.tsx'),
        resourcesChunk1,
        addWarnings({options: args.options})
      );
    }

    // Resources page
    if (args.options.genUiResourcesPage) {
      fileCreator.create(
        join(prjUiSrcPrefixedDir, 'ResourcesPage.tsx'),
        uiResourcesPageTmpl(args),
        addWarnings({options: args.options})
      );
    }

    fileCreator.create(
      join(prjUiSrcPrefixedDir, 'MetaPage.tsx'),
      uiMetaPageTmpl(),
      addWarnings({options: args.options})
    );

    // Entity mapping
    if (args.options.genUiEntityMapping) {
      fileCreator.create(
        join(prjUiSrcPrefixedDir, 'entityMapping.ts'),
        uiEntityMappingTmpl(args, args.options),
        addWarnings({options: args.options})
      );
    }

    // Menu
    if (args.options.genUiMenu) {
      fileCreator.create(
        join(prjUiSrcPrefixedDir, 'getDefaultMenu.ts'),
        uiGetDefaultMenuTmpl(args),
        addWarnings({options: args.options})
      );
      fileCreator.createIfNotExists(
        join(prjUiSrcPrefixedDir, 'getAdditionalMenu.ts'),
        uiGetAdditionalMenuTmpl()
      );
    }

    // Routes
    if (args.options.genUiRoutes) {
      fileCreator.create(
        join(prjUiSrcPrefixedDir, 'routes.tsx'),
        uiRoutesTmpl(args),
        addWarnings({options: args.options})
      );
    }

    fileCreator.createIfNotExists(
      join(prjUiSrcPrefixedDir, 'additionalRoutes.tsx'),
      uiAdditionalRoutesTmpl()
    );

    // Functions page
    if (args.options.genUiFunctions) {
      fileCreator.create(
        join(prjUiSrcPrefixedDir, 'functions', 'Functions.tsx'),
        uiFunctionsTmpl(args.options),
        addWarnings({options: args.options})
      );
    }

    // Dashboard page
    if (args.options.genUiDashboard) {
      fileCreator.createIfNotExists(
        join(prjUiSrcPrefixedDir, 'Dashboard.tsx'),
        uiDashboardTmpl()
      );
    }
  }
}

export default generateFrontSrc;

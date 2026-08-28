import {FileCreator} from '../types'
import {
  prepareEntityWideGenerationArgs,
  ProjectWideGenerationArgs,
} from '../../args'
import generateFrontSrcTranslations from './translations/generateFrontSrcTranslations'
import generateFrontSrcEntity from './entity/generateFrontSrcEntity'
import uiDashboardTmpl from '../../generators/fileTemplates/ui/Dashboard'
import uiPermissionPageTmpl from '../../generators/fileTemplates/ui/PermissionPage'
import uiNotFoundPageTmpl from '../../generators/fileTemplates/ui/NotFoundPage'
import uiPermissionsTmpl from '../../generators/fileTemplates/ui/utils/permissions'
import { uiFunctionsTmpl } from '../../generators/fileTemplates/ui/functions/Functions'
import { uiAdditionalRoutesTmpl } from '../../generators/fileTemplates/ui/additionalRoutes'
import uiRoutesTmpl from '../../generators/fileTemplates/ui/environment/src/routes'
import { uiGetAdditionalMenuTmpl } from '../../generators/fileTemplates/ui/getAdditionalMenu'
import { uiGetDefaultMenuTmpl } from '../../generators/fileTemplates/ui/getDefaultMenu'
import { uiEntityMappingTmpl } from '../../generators/fileTemplates/ui/entityMapping'
import { uiMetaPageTmpl } from '../../generators/fileTemplates/ui/MetaPage'
import { uiResourcesPageTmpl } from '../../generators/fileTemplates/ui/ResourcesPage'
import { uiResourcesTmpl } from '../../generators/fileTemplates/ui/resources'
import {addWarnings, addGeneratedOnceNotice} from '../fileHandlers'
import { uiGetMenuIconsTmpl } from '../../generators/fileTemplates/ui/getMenuIconsTmpl'
import { uiGetAdditionalMenuIconsTmpl } from '../../generators/fileTemplates/ui/getAdditionalMenuIconsTmp'
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../builders/generationPaths'

const resolveUiPath = (
  args: ProjectWideGenerationArgs,
  category: GenerationPathCategory,
) =>
  resolveGenerationPath({
    category,
    detachedBackProject: args.options.detachedBackProject,
    detachedUiProject: args.options.detachedUiProject,
    pathsConfig: args.system.generationPaths,
    vars: {},
  })

const generateFrontSrc = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  args.entities.forEach((entity) => {
    generateFrontSrcEntity(fileCreator, prepareEntityWideGenerationArgs(args, entity));
  });

  generateFrontSrcTranslations(fileCreator, args);

  if (!args.options.typesOnly) {
    // Resources
    if (args.options.genUiResources) {
      const {resources, resourcesChunk0, resourcesChunk1} = uiResourcesTmpl(args);

      fileCreator.create(
        resolveUiPath(args, GenerationPathCategory.UiResources),
        resources,
        addWarnings({options: args.options})
      );
      fileCreator.create(
        resolveUiPath(args, GenerationPathCategory.UiResourcesChunk0),
        resourcesChunk0,
        addWarnings({options: args.options})
      );
      fileCreator.create(
        resolveUiPath(args, GenerationPathCategory.UiResourcesChunk1),
        resourcesChunk1,
        addWarnings({options: args.options})
      );
    }

    // Resources page
    if (args.options.genUiResourcesPage) {
      fileCreator.create(
        resolveUiPath(args, GenerationPathCategory.UiResourcesPage),
        uiResourcesPageTmpl(args),
        addWarnings({options: args.options})
      );
    }

    fileCreator.create(
      resolveUiPath(args, GenerationPathCategory.UiMetaPage),
      uiMetaPageTmpl(),
      addWarnings({options: args.options})
    );

    // Entity mapping
    if (args.options.genUiEntityMapping) {
      fileCreator.create(
        resolveUiPath(args, GenerationPathCategory.UiEntityMapping),
        uiEntityMappingTmpl(args, args.options),
        addWarnings({options: args.options})
      );
    }

    // Menu
    if (args.options.genUiMenu) {
      fileCreator.create(
        resolveUiPath(args, GenerationPathCategory.UiGetDefaultMenu),
        uiGetDefaultMenuTmpl(args),
        addWarnings({options: args.options})
      );
      fileCreator.createIfNotExists(
        resolveUiPath(args, GenerationPathCategory.UiGetAdditionalMenu),
        uiGetAdditionalMenuTmpl()
      );
      fileCreator.create(
        resolveUiPath(args, GenerationPathCategory.UiMenuIcons),
        uiGetMenuIconsTmpl(args),
        addWarnings({options: args.options})
      )
      fileCreator.createIfNotExists(
        resolveUiPath(args, GenerationPathCategory.UiAdditionalMenuIcons),
        uiGetAdditionalMenuIconsTmpl()
      );
    }

    // Routes
    if (args.options.genUiRoutes) {
      fileCreator.create(
        resolveUiPath(args, GenerationPathCategory.UiRoutes),
        uiRoutesTmpl(args),
        addWarnings({options: args.options})
      );
    }

    fileCreator.createIfNotExists(
      resolveUiPath(args, GenerationPathCategory.UiAdditionalRoutes),
      uiAdditionalRoutesTmpl()
    );

    // Functions page
    if (args.options.genUiFunctions) {
      fileCreator.create(
        resolveUiPath(args, GenerationPathCategory.UiFunctions),
        uiFunctionsTmpl(args.options),
        addWarnings({options: args.options})
      );
    }

    // Dashboard page
    if (args.options.genUiDashboard) {
      fileCreator.createIfNotExists(
        resolveUiPath(args, GenerationPathCategory.UiDashboard),
        uiDashboardTmpl()
      );
    }

    // Permission fallback page
    fileCreator.createIfNotExists(
      join(prjUiSrcPrefixedDir, 'PermissionPage.tsx'),
      uiPermissionPageTmpl(),
      [addGeneratedOnceNotice]
    );

    // Not found fallback page (action doesn't exist for the entity, e.g. no edit/create)
    fileCreator.createIfNotExists(
      join(prjUiSrcPrefixedDir, 'NotFoundPage.tsx'),
      uiNotFoundPageTmpl(),
      [addGeneratedOnceNotice]
    );

    // Permissions utils
    fileCreator.create(
      join(args.options.detachedUiProject, 'src', 'utils', 'permissions.ts'),
      uiPermissionsTmpl(),
      addWarnings({options: args.options})
    );
  }
}

export default generateFrontSrc;

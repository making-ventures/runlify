import {FileCreator} from '../../types'
import {pascal, pascalSingular} from '../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../args'
import {uiEntityShowIndexTmpl} from '../../../generators/fileTemplates/ui/pages/EntityShow'
import {uiDefaultEditTmpl} from '../../../generators/fileTemplates/ui/pages/EntityEdit/DefaultEntityEdit'
import {uiDefaultCreateTmpl} from '../../../generators/fileTemplates/ui/pages/EntityCreate/DefaultEntityCreate'
import {uiDefaultListTmpl} from '../../../generators/fileTemplates/ui/pages/EntityList/DefaultEntityList'
import {uiFilterTmpl} from '../../../generators/fileTemplates/ui/pages/EntityList/EntityFilter'
import {uiEditTmpl} from '../../../generators/fileTemplates/ui/pages/EntityEdit'
import {uiCreateTmpl} from '../../../generators/fileTemplates/ui/pages/EntityCreate'
import {uiListTmpl} from '../../../generators/fileTemplates/ui/pages/EntityList'
import {getLinksFromExternalEntities} from '../../../links/getLinksFromExternalEntities'
import {uiDefaultShowTmpl} from '../../../generators/fileTemplates/ui/pages/EntityShow/DefaultEntityShow'
import {uiDefaultFilterTmpl} from '../../../generators/fileTemplates/ui/pages/EntityList/DefaultEntityFilter'
import {uiListBreadcrumbsTmpl} from '../../../generators/fileTemplates/ui/pages/EntityList/EntityBreadcrumbs'
import {uiEntityShowMainTabTmpl} from '../../../generators/fileTemplates/ui/pages/EntityShow/MainTab'
import {uiEntityShowDefaultMainTabTmpl} from '../../../generators/fileTemplates/ui/pages/EntityShow/DefaultMainTab'
import {uiEntityShowDependencyTabTmpl} from '../../../generators/fileTemplates/ui/pages/EntityShow/DependencyTab'
import {uiDefaultActionTmpl} from '../../../generators/fileTemplates/ui/pages/EntityShow/DefaultActions'
import {uiAdditionalTabsTmpl} from '../../../generators/fileTemplates/ui/pages/EntityShow/additionalTabs'
import {addWarnings} from '../../fileHandlers'
import {
  GenerationPathCategory,
  GenerationPathVars,
  resolveGenerationPath,
} from '../../../builders/generationPaths'

const resolveUiPagePath = (
  args: EntityWideGenerationArgs,
  category: GenerationPathCategory,
  extraVars: GenerationPathVars = {},
) => {
  const {entity, options, system} = args
  return resolveGenerationPath({
    category,
    detachedBackProject: options.detachedBackProject,
    detachedUiProject: options.detachedUiProject,
    pathsConfig: system.generationPaths,
    vars: {
      entityName: entity.name,
      pascalSingular: pascalSingular(entity.name),
      ...extraVars,
    },
  })
}

const generateEntityUiShow = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    allEntities,
    entity,
    options,
    allLinks,
  } = args;

  if (!options.typesOnly && options.forms.show) {
    const toLinks = getLinksFromExternalEntities(entity, allLinks);

    // MainTab
    const mainTab = uiEntityShowMainTabTmpl();
    fileCreator.createIfNotExists(
      resolveUiPagePath(args, GenerationPathCategory.UiPageShowMainTab),
      mainTab
    );

    // DefaultMainTab
    const defaultMainTab = uiEntityShowDefaultMainTabTmpl(
      args
    );
    fileCreator.create(
      resolveUiPagePath(args, GenerationPathCategory.UiPageShowDefaultMainTab),
      defaultMainTab,
      addWarnings({options: args.options})
    );

    // DefaultEntityShow
    fileCreator.create(
      resolveUiPagePath(args, GenerationPathCategory.UiPageShowDefaultEntityShow),
      uiDefaultShowTmpl(args),
      addWarnings({options: args.options})
    );

    // DefaultActions
    fileCreator.create(
      resolveUiPagePath(args, GenerationPathCategory.UiPageShowDefaultActions),
      uiDefaultActionTmpl(args),
      addWarnings({options: args.options})
    );

    // index
    fileCreator.createIfNotExists(
      resolveUiPagePath(args, GenerationPathCategory.UiPageShowIndex),
      uiEntityShowIndexTmpl(args)
    );

    const additionalTabs = uiAdditionalTabsTmpl();
    fileCreator.createIfNotExists(
      resolveUiPagePath(args, GenerationPathCategory.UiPageShowAdditionalTabs),
      additionalTabs
    );

    // DependencyTabs
    for (const link of toLinks) {
      const ownerEntity = allEntities.get(link.entityOwnerName);

      if (!ownerEntity) {
        throw new Error(`The is no "${link.entityOwnerName}" entity`);
      }

      const dependencyTab = uiEntityShowDependencyTabTmpl(
        allEntities,
        ownerEntity,
        link,
        options
      );
      fileCreator.create(
        resolveUiPagePath(args, GenerationPathCategory.UiPageShowDependencyTab, {
          OwnerPascal: pascal(ownerEntity.name),
          FromFieldPascal: pascal(link.fromField.name),
        }),
        dependencyTab,
        addWarnings({options: args.options})
      );
    }
  }
}

const generateEntityUiCreate = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    options,
  } = args;

  if (!options.typesOnly && options.forms.create) {
    fileCreator.create(
      resolveUiPagePath(args, GenerationPathCategory.UiPageCreateDefault),
      uiDefaultCreateTmpl(args),
      addWarnings({options: args.options})
    );
    fileCreator.createIfNotExists(
      resolveUiPagePath(args, GenerationPathCategory.UiPageCreateIndex),
      uiCreateTmpl(args)
    );
  }
}

const generateEntityUiEdit = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    options,
  } = args;

  if (!options.typesOnly && options.forms.edit) {
    fileCreator.create(
      resolveUiPagePath(args, GenerationPathCategory.UiPageEditDefault),
      uiDefaultEditTmpl(args),
      addWarnings({options: args.options})
    );
    fileCreator.createIfNotExists(
      resolveUiPagePath(args, GenerationPathCategory.UiPageEditIndex),
      uiEditTmpl(args),      
    );
  }
}

const generateEntityUiList = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    options,
  } = args;

  if (!options.typesOnly && options.forms.list) {
    fileCreator.create(
      resolveUiPagePath(args, GenerationPathCategory.UiPageListDefault),
      uiDefaultListTmpl(args),
      addWarnings({options: args.options})
    );
    fileCreator.createIfNotExists(
      resolveUiPagePath(args, GenerationPathCategory.UiPageListFilter),
      uiFilterTmpl(args)
    );
    fileCreator.createIfNotExists(
      resolveUiPagePath(args, GenerationPathCategory.UiPageListBreadcrumbs),
      uiListBreadcrumbsTmpl(args)
    );
    fileCreator.create(
      resolveUiPagePath(args, GenerationPathCategory.UiPageListDefaultFilter),
      uiDefaultFilterTmpl(args),
      addWarnings({options: args.options})
    );
    fileCreator.createIfNotExists(
      resolveUiPagePath(args, GenerationPathCategory.UiPageListIndex),
      uiListTmpl(args)
    );
  }
}

const generateFrontSrcEntityPages = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  generateEntityUiShow(fileCreator, args);
  generateEntityUiCreate(fileCreator, args);
  generateEntityUiEdit(fileCreator, args);
  generateEntityUiList(fileCreator, args);
}

export default generateFrontSrcEntityPages;

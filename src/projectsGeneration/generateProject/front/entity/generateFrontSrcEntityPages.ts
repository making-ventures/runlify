import {join} from 'path'
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

    const entityShowDir = join(
      options.detachedUiProject,
      'src',
      'adm',
      'pages',
      entity.name,
      `${pascalSingular(entity.name)}Show`,
    );

    // MainTab
    const mainTab = uiEntityShowMainTabTmpl();
    fileCreator.createIfNotExists(join(entityShowDir, 'MainTab.tsx'), mainTab);

    // DefaultMainTab
    const defaultMainTab = uiEntityShowDefaultMainTabTmpl(
      args
    );
    fileCreator.create(join(entityShowDir, 'DefaultMainTab.tsx'), defaultMainTab);

    // DefaultEntityShow
    fileCreator.create(
      join(entityShowDir, `Default${pascalSingular(entity.name)}Show.tsx`),
      uiDefaultShowTmpl(args)
    );

    // DefaultActions
    fileCreator.create(
      join(entityShowDir, 'DefaultActions.tsx'),
      uiDefaultActionTmpl(args)
    );

    // index
    fileCreator.createIfNotExists(
      join(entityShowDir, 'index.tsx'),
      uiEntityShowIndexTmpl(args)
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
}

const generateEntityUiCreate = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
  } = args;

  if (!options.typesOnly && options.forms.create) {
    const entityCreateDir = join(
      options.detachedUiProject,
      'src',
      'adm',
      'pages',
      entity.name,
      `${pascalSingular(entity.name)}Create`
    );

    fileCreator.create(
      join(
        entityCreateDir,
        `Default${pascalSingular(entity.name)}Create.tsx`
      ),
      uiDefaultCreateTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(entityCreateDir, 'index.tsx'),
      uiCreateTmpl(args)
    );
  }
}

const generateEntityUiEdit = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
  } = args;

  if (!options.typesOnly && options.forms.edit) {
    const entityEditDir = join(
      options.detachedUiProject,
      'src',
      'adm',
      'pages',
      entity.name,
      `${pascalSingular(entity.name)}Edit`,
    );

    fileCreator.create(
      join(entityEditDir, `Default${pascalSingular(entity.name)}Edit.tsx`),
      uiDefaultEditTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(entityEditDir, 'index.tsx'),
      uiEditTmpl(args)
    );
  }
}

const generateEntityUiList = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    entity,
    options,
  } = args;

  if (!options.typesOnly && options.forms.list) {
    const entityListDir = join(
      options.detachedUiProject,
      'src',
      'adm',
      'pages',
      entity.name,
      `${pascalSingular(entity.name)}List`,
    );

    fileCreator.create(
      join(entityListDir, `Default${pascalSingular(entity.name)}List.tsx`),
      uiDefaultListTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(entityListDir, `${pascalSingular(entity.name)}Filter.tsx`),
      uiFilterTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(entityListDir, `${pascalSingular(entity.name)}ListBreadcrumbs.tsx`),
      uiListBreadcrumbsTmpl(args)
    );
    fileCreator.create(
      join(entityListDir, `Default${pascalSingular(entity.name)}Filter.tsx`),
      uiDefaultFilterTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(entityListDir, 'index.tsx'),
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

/* eslint-disable max-len */
import { defaultBootstrapEntityOptions } from '../../../types'
import { Entity } from '../../../builders/buildedTypes'
import { ProjectWideGenerationArgs } from '../../../args'
import { generatedWarning } from '../../../utils'
import { plural } from 'pluralize'

export const uiGetDefaultMenuTmpl = ({
  system,
  entities,
  options = defaultBootstrapEntityOptions,
}: ProjectWideGenerationArgs) => {
  const entitiesToShow = entities.sort((a, b) =>
    a.title['ru'].plural.localeCompare(
      b.title['ru'].plural,
      'en'
    )
  )

  const infoRegistries = entitiesToShow.filter((m) => m.type === 'infoRegistry')
  const sumRegistries = entitiesToShow.filter((m) => m.type === 'sumRegistry')
  const documents = entitiesToShow.filter((m) => m.type === 'document')
  const catalogs = entitiesToShow.filter((m) => m.type === 'catalog')

  const renderEntity = (entity: Entity) => `    {
      label: '${plural(entity.type)}.${entity.name}.title.plural',
      link: '/${entity.name}',
      icon: 'DetailsOutlined',
      debugOnly: true,
    },`

  return `import {MenuElement} from '../uiLib/menu/MenuItem';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const getDefaultMenu = () => {
  const menuData: MenuElement[] = [
    {
      label: 'app.menu.functions',
      link: '/functions',
      icon: 'DetailsOutlined',
      debugOnly: true,
    },
    {
      label: 'app.menu.resources',
      link: '/resources',
      icon: 'DetailsOutlined',
      debugOnly: true,
    },
    {
      label: 'app.menu.meta',
      link: '/meta',
      icon: 'DetailsOutlined',
      debugOnly: true,
    },
  ];

  const infoRegistriesMenuData: MenuElement[] = [
${infoRegistries.map((entity) => renderEntity(entity)).join('\n')}
  ];

  if (infoRegistriesMenuData.length) {
    menuData.push({
      label: 'app.infoRegistries',
      icon: 'DetailsOutlined',
      debugOnly: true,
      children: infoRegistriesMenuData,
    });
  }

  const sumRegistriesMenuData: MenuElement[] = [
${sumRegistries.map((entity) => renderEntity(entity)).join('\n')}
  ];

  if (sumRegistriesMenuData.length) {
    menuData.push({
      label: 'app.sumRegistries',
      icon: 'DetailsOutlined',
      debugOnly: true,
      children: sumRegistriesMenuData,
    });
  }

  const documentsMenuData: MenuElement[] = [
${documents.map((entity) => renderEntity(entity)).join('\n')}
  ];

  if (documentsMenuData.length) {
    menuData.push({
      label: 'app.documents',
      icon: 'DetailsOutlined',
      debugOnly: true,
      children: documentsMenuData,
    });
  }

  const catalogsMenuData: MenuElement[] = [
${catalogs.map((entity) => renderEntity(entity)).join('\n')}
  ];

  if (catalogsMenuData.length) {
    menuData.push({
      label: 'app.catalogs',
      icon: 'DetailsOutlined',
      debugOnly: true,
      children: catalogsMenuData,
    });
  }

  return menuData;
};

export default getDefaultMenu;
`
}

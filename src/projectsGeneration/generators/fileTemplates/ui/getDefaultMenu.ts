import {Entity, MenuItem, MenuItemType} from '../../../builders/buildedTypes'
import {ProjectWideGenerationArgs} from '../../../args'
import {printWarningIfRequired, pad2} from '../../../utils'
import {plural} from 'pluralize'

const checkHasMenuItemEnv = (item: MenuItem) => {
  switch (item.itemType) {
    case MenuItemType.ExternalEnv:
      return item.env;
    case MenuItemType.Group:
      return item.items.some(checkHasMenuItemEnv);
    default:
      return false;
  }
}

const menuItemTmpl = (item: MenuItem) => {
  switch (item.itemType) {
    case MenuItemType.Group:
      return `{
  label: '${item.label}',
  icon: '${item.materialUiIcon}',
  debugOnly: ${item.debugOnly},
  permissions: ${item.permissions.length ? `[
${item.permissions.map(p => `'${p}',`).map(pad2).join('\n')}
  ]` : '[]'},
  children: ${item.items.length ? `[
${item.items.map(i => `${menuItemTmpl(i)},`).map(pad2).join('\n')}
  ]` : '[]'},
}`;
    case MenuItemType.Internal:
      return `{
  label: '${item.label}',
  link: '${item.link}',
  icon: '${item.materialUiIcon}',
  debugOnly: ${item.debugOnly},
  permissions: [${item.permissions.map(p => `'${p}'`).join(', ')}],
}`;
    case MenuItemType.External:
      return `{
  label: '${item.label}',
  link: '${item.link}',
  icon: '${item.materialUiIcon}',
  debugOnly: ${item.debugOnly},
  permissions: [${item.permissions.map(p => `'${p}'`).join(', ')}],
}`;
    case MenuItemType.ExternalEnv:
      return `{
  label: '${item.label}',
  env: getConfigByName('${item.env}'),
  icon: '${item.materialUiIcon}',
  debugOnly: ${item.debugOnly},
  permissions: [${item.permissions.map(p => `'${p}'`).join(', ')}],
}`;  
  }
}

export const uiGetDefaultMenuTmpl = ({
  system,
  entities,
  options,
}: ProjectWideGenerationArgs) => {
  const entitiesToShow = entities.sort((a, b) =>
    a.title['ru'].plural.localeCompare(
      b.title['ru'].plural,
      'en'
    )
  )

  const getEntitiesByType = (type: string) => 
  entitiesToShow
    .filter((m) => m.type === type)
    .filter((m) => !m.excludeFromMenu)

  const infoRegistries = getEntitiesByType('infoRegistry')
  const sumRegistries = getEntitiesByType('sumRegistry') 
  const documents = getEntitiesByType('document')
  const catalogs = getEntitiesByType('catalog')

  const hasMenuExternalEnv = system.menuItems.some(checkHasMenuItemEnv);

  const renderEntity = (entity: Entity) => `    {
      label: '${plural(entity.type)}.${entity.name}.title.plural',
      link: '/${entity.name}',
      icon: 'DetailsOutlined',
      debugOnly: true,
    },`

  return `import {MenuElement} from '../uiLib/menu/MenuItem';${hasMenuExternalEnv ? "\nimport getConfigByName from '../config/getConfigByName';" : ''}
${printWarningIfRequired(options)}
const getDefaultMenu = () => {
  const menuData: MenuElement[] = [
${system.menuItems.map(i => `${menuItemTmpl(i)},`).map(pad2).join('\n')}${options.showFunctionsInMenu ? `
    {
      label: 'app.menu.functions',
      link: '/functions',
      icon: 'DetailsOutlined',
      debugOnly: true,
    },` : ''}${options.showResourcesInMenu ? `
    {
      label: 'app.menu.resources',
      link: '/resources',
      icon: 'DetailsOutlined',
      debugOnly: true,
    },` : ''}${options.showMetaInMenu ? `
    {
      label: 'app.menu.meta',
      link: '/meta',
      icon: 'DetailsOutlined',
      debugOnly: true,
    },` : ''}
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

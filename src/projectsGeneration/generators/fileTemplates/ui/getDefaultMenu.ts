import {defaultBootstrapEntityOptions} from '../../../types'
import {Entity, MenuItem, MenuItemType} from '../../../builders/buildedTypes'
import {ProjectWideGenerationArgs} from '../../../args'
import {generatedWarning, pad2} from '../../../utils'
import {plural} from 'pluralize'

const menuItemLinks = (item: MenuItem) => {
  switch (item.itemType) {
    case MenuItemType.External:
      return { link: item.envVarConfig ? item.link : '', hasEnvVarConfig: item.envVarConfig };
    case MenuItemType.Group:
      const childData = item.items.map(menuItemLinks);
      const links = childData.filter(data => data.hasEnvVarConfig).map(data => data.link).join(', ');
      const hasEnvVarConfig = childData.some(data => data.hasEnvVarConfig);
      return { link: links, hasEnvVarConfig };
    default:
      return { link: '', hasEnvVarConfig: false };
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
  link: ${item.envVarConfig === true ? item.link : `'${item.link}'`},
  icon: '${item.materialUiIcon}',
  debugOnly: ${item.debugOnly},
  permissions: [${item.permissions.map(p => `'${p}'`).join(', ')}],
}`; 
  }
}

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

  const menuItemData = system.menuItems.map(menuItemLinks);
  const links = menuItemData.map(data => data.link).filter(link => link !== '').join(', ');
  const hasEnvVarConfig = menuItemData.some(data => data.hasEnvVarConfig); 

  const renderEntity = (entity: Entity) => `    {
      label: '${plural(entity.type)}.${entity.name}.title.plural',
      link: '/${entity.name}',
      icon: 'DetailsOutlined',
      debugOnly: true,
    },`

  return `import {MenuElement} from '../uiLib/menu/MenuItem';${hasEnvVarConfig ? "\nimport getConfig from '../config/config';" : ''}
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}${hasEnvVarConfig ? `\nconst {${links}} = await getConfig();\n` : ''}
const getDefaultMenu = () => {
  const menuData: MenuElement[] = [
${system.menuItems.map(i => `${menuItemTmpl(i)},`).map(pad2).join('\n')}
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

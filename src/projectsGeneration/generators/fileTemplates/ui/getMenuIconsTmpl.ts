import { ProjectWideGenerationArgs } from '../../../args'
import { MENU_DEFAULT_ICON, flattenMenuItems } from './builtInIcons'

export const uiGetMenuIconsTmpl = (args: ProjectWideGenerationArgs) => {
  const icons = args.system.menuItems
    .flatMap((menuItem) => flattenMenuItems(menuItem))
    .map(({item}) => item.materialUiIcon)

  const uniqueIcons = [...new Set([...icons, MENU_DEFAULT_ICON])]

  const imports = uniqueIcons
    .map((icon) => `import ${icon} from '@mui/icons-material/${icon}';`)
    .join('\n')

  const iconsObject = uniqueIcons.map((icon) => `\t${icon},`).join('\n')

  return `import {additionalMenuIcons} from '../../adm/additionalMenuIcons';

${imports}
export const menuIcons = {
  ...additionalMenuIcons,
${iconsObject}
} as const

export type MuiMenuIconName = keyof typeof menuIcons;

`
}

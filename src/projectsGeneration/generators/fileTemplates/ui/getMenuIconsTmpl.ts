import { ProjectWideGenerationArgs } from '../../../args'
import { MenuItem, MenuItemType } from '../../../builders'

function resolveMenuItems(item: MenuItem): string[] {
  if (item.itemType === MenuItemType.Group) {
    return [item.materialUiIcon, ...item.items.flatMap(resolveMenuItems)]
  }
  
  return [item.materialUiIcon]
}

export const uiGetMenuIconsTmpl = (args: ProjectWideGenerationArgs) => {
  const icons = args.system.menuItems.flatMap(resolveMenuItems)

  const uniqueIcons = [...new Set([...icons, 'DetailsOutlined'])]

  const imports = uniqueIcons
    .map((icon) => `import ${icon} from '@mui/icons-material/${icon}';`)
    .join('\n')

  const iconsObject = uniqueIcons.map((icon) => `\t${icon},`).join('\n')

  return `import {additionalMenuIcons} from '../../adm/additionalMenuIcons';

import {type SvgIconComponent} from '@mui/icons-material';
${imports}
export const menuIcons = {
  ...additionalMenuIcons,
${iconsObject}
} as const

export type MuiMenuIconName = keyof typeof menuIcons;

`
}

import { ProjectWideGenerationArgs } from '../../../args'
import { MenuItemType } from '../../../builders'

export const uiGetMenuIconsTmpl = (args: ProjectWideGenerationArgs) => {
  const icons = args.system.menuItems
    .flatMap((item) =>
      item.itemType === MenuItemType.Group ? item.items ?? [] : [item]
    )
    .map(({ materialUiIcon }) => materialUiIcon)
    .filter((icon): icon is string => typeof icon === 'string' && !!icon.trim())

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
} as const satisfies Record<string, SvgIconComponent>

export type MuiMenuIconName = keyof typeof menuIcons;

`
}

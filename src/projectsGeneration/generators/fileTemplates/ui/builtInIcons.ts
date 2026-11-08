import {MenuItem, MenuItemType} from '../../../builders/buildedTypes'

/** Icon of menu items the generator adds itself (entity lists in the debug menu, etc.). */
export const MENU_DEFAULT_ICON = 'DetailsOutlined'

/** Icon of the send button on the generated Functions page. */
export const FUNCTIONS_SEND_ICON = 'SendOutlined'

/** Icons the generated UI imports regardless of the meta. */
export const BUILT_IN_ICONS = [MENU_DEFAULT_ICON, FUNCTIONS_SEND_ICON]

export type MenuItemWithPath = {
  item: MenuItem
  /** Labels from the top-level item down to this one. */
  path: string[]
}

/** The menu item and all of its nested items (depth-first). */
export const flattenMenuItems = (item: MenuItem, parents: string[] = []): MenuItemWithPath[] => {
  const path = [...parents, item.label || item.name]

  return item.itemType === MenuItemType.Group
    ? [{item, path}, ...item.items.flatMap((child) => flattenMenuItems(child, path))]
    : [{item, path}]
}

export const uiAdditionalTabsTmpl = () => {
  return `import {FC} from 'react';
import {TabProps} from 'react-admin';

export const additionalTabs: Array<{Tab: FC<Omit<TabProps, 'children'>>, label: string}> = [];
`
}

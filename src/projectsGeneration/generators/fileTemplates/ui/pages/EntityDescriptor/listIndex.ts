import {camelSingular, pascalSingular} from '../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../args'

/**
 * `index.tsx` списка в режиме descriptor: универсальный `EntityList` + дескриптор сущности.
 * Создаётся один раз (`[once]`) — точка переключения на кастомную страницу.
 * Локальный компонент называется `<Pascal>ListPage`, чтобы не затенять импорт `EntityList` у сущности `entities`.
 */
export const uiDescriptorListIndexTmpl = ({entity}: EntityWideGenerationArgs) => {
  const pascal = pascalSingular(entity.name)
  const camel = camelSingular(entity.name)

  return `import React, {FC} from 'react';
import {ListProps} from 'react-admin';
import {EntityList} from '../../../../uiLib/entityPages/EntityList';
import {${camel}Descriptor} from '../${pascal}Descriptor';

const ${pascal}ListPage: FC<ListProps> = (props) => <EntityList descriptor={${camel}Descriptor} {...props} />;

export default ${pascal}ListPage;
`
}

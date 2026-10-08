import {camelSingular, pascalSingular} from '../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../args'

/**
 * `index.tsx` формы редактирования в режиме descriptor: универсальный `EntityEdit` + дескриптор сущности.
 * Создаётся один раз (`[once]`) — точка переключения на кастомную страницу.
 * Локальный компонент называется `<Pascal>EditPage`, чтобы не затенять импорт `EntityEdit` у сущности `entities`.
 */
export const uiDescriptorEditIndexTmpl = ({entity}: EntityWideGenerationArgs) => {
  const pascal = pascalSingular(entity.name)
  const camel = camelSingular(entity.name)

  return `import React, {FC} from 'react';
import {EditProps} from 'react-admin';
import {EntityEdit} from '../../../../uiLib/entityPages/EntityEdit';
import {${camel}Descriptor} from '../${pascal}Descriptor';

const ${pascal}EditPage: FC<EditProps> = (props) => <EntityEdit descriptor={${camel}Descriptor} {...props} />;

export default ${pascal}EditPage;
`
}

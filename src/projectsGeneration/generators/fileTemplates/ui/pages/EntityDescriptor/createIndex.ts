import {camelSingular, pascalSingular} from '../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../args'

/**
 * `index.tsx` формы создания в режиме descriptor: универсальный `EntityCreate` + дескриптор сущности.
 * Создаётся один раз (`[once]`) — точка переключения на кастомную страницу.
 * Локальный компонент называется `<Pascal>CreatePage`, чтобы не затенять импорт `EntityCreate` у сущности `entities`.
 */
export const uiDescriptorCreateIndexTmpl = ({entity}: EntityWideGenerationArgs) => {
  const pascal = pascalSingular(entity.name)
  const camel = camelSingular(entity.name)

  return `import React, {FC} from 'react';
import {CreateProps} from 'react-admin';
import {EntityCreate} from '../../../../uiLib/entityPages/EntityCreate';
import {${camel}Descriptor} from '../${pascal}Descriptor';

const ${pascal}CreatePage: FC<CreateProps> = (props) => <EntityCreate descriptor={${camel}Descriptor} {...props} />;

export default ${pascal}CreatePage;
`
}

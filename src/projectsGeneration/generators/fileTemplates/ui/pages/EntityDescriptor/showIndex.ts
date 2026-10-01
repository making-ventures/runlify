import {camelSingular, pascalSingular} from '../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../args'

/**
 * `index.tsx` карточки в режиме descriptor: универсальный `EntityShow` + дескриптор сущности.
 * Создаётся один раз (`[once]`) — точка переключения на кастомную страницу.
 */
export const uiDescriptorShowIndexTmpl = ({entity}: EntityWideGenerationArgs) => {
  const pascal = pascalSingular(entity.name)
  const camel = camelSingular(entity.name)

  return `import React, {FC} from 'react';
import {ShowProps} from 'react-admin';
import {EntityShow} from '../../../../uiLib/entityPages/EntityShow';
import {${camel}Descriptor} from '../${pascal}Descriptor';

const ${pascal}Show: FC<ShowProps> = (props) => <EntityShow descriptor={${camel}Descriptor} {...props} />;

export default ${pascal}Show;
`
}

import {pascalSingular} from '../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../args'

export const uiListTmpl = ({ entity }: EntityWideGenerationArgs) => {
  return `import React, {FC} from 'react';
import {
  ListProps,
} from 'react-admin';
import Default${pascalSingular(
    entity.name
  )}List from './Default${pascalSingular(entity.name)}List';

const ${pascalSingular(
    entity.name
  )}List: FC<ListProps> = (props: ListProps) => (
  <Default${pascalSingular(entity.name)}List {...props} />
);

export default ${pascalSingular(entity.name)}List;
`
}

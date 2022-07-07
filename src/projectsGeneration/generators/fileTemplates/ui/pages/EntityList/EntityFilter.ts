import { pascalSingular } from '../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../args'

export const uiFilterTmpl = ({ entity }: EntityWideGenerationArgs) => {
  return `import React, {FC} from 'react';
import Default${pascalSingular(
    entity.name
  )}Filter from './Default${pascalSingular(entity.name)}Filter';

const ${pascalSingular(entity.name)}Filter: FC<any> = (props) => (
  <Default${pascalSingular(entity.name)}Filter {...props} />
);

export default ${pascalSingular(entity.name)}Filter;
`
}

import {pascalSingular} from '../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../args'

export const uiEntityShowIndexTmpl = ({ entity }: EntityWideGenerationArgs) => {
  return `import React, {FC} from 'react';
import {
  ShowProps,
} from 'react-admin';
import Default${pascalSingular(
    entity.name
  )}Show from './Default${pascalSingular(entity.name)}Show';

const ${pascalSingular(
    entity.name
  )}Show: FC<ShowProps> = (props: ShowProps) => (
  <Default${pascalSingular(entity.name)}Show {...props} />
);

export default ${pascalSingular(entity.name)}Show;
`
}

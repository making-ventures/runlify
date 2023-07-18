import { pascalSingular } from '../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../args'

export const uiEditTmpl = ({ entity }: EntityWideGenerationArgs) => {
  return `import React, {FC} from 'react';
import {
  EditProps,
} from 'react-admin';
import Default${pascalSingular(
    entity.name
  )}Edit from './Default${pascalSingular(entity.name)}Edit';

const ${pascalSingular(
    entity.name
  )}Edit: FC<EditProps> = (props: EditProps) => (
  <Default${pascalSingular(entity.name)}Edit {...props} />
);

export default ${pascalSingular(entity.name)}Edit;
`
}

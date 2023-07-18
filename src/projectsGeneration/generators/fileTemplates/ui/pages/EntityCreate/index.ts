import { pascalSingular } from '../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../args'

export const uiCreateTmpl = ({ entity }: EntityWideGenerationArgs) => {
  return `import React, {FC} from 'react';
import {
  CreateProps,
} from 'react-admin';
import Default${pascalSingular(
    entity.name
  )}Create from './Default${pascalSingular(entity.name)}Create';

const ${pascalSingular(
    entity.name
  )}Create: FC<CreateProps> = (props: CreateProps) => (
  <Default${pascalSingular(entity.name)}Create {...props} />
);

export default ${pascalSingular(entity.name)}Create;
`
}

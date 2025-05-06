import { pascalSingular, pascalPlural } from '../../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../../args'

export const beforeUpsertTmpl = ({ entity }: EntityWideGenerationArgs) => {
  const contextName = 'Context'

  return `import {${contextName}} from '../../types';
import {
  StrictUpdate${pascalSingular(entity.name)}Args,
  StrictCreate${pascalSingular(entity.name)}Args,
  Reliable${pascalSingular(entity.name)}CreateUserInput,
} from '../${pascalPlural(entity.name)}Service';

type InputData = {
  createData: Reliable${pascalSingular(entity.name)}CreateUserInput,
  updateData: StrictUpdate${pascalSingular(entity.name)}Args,
};
type ReturnData = {
  createData: StrictCreate${pascalSingular(entity.name)}Args,
  updateData: StrictUpdate${pascalSingular(entity.name)}Args,
};

export const beforeUpsert = async (
  _ctx: ${contextName},
  {createData, updateData}: InputData,
): Promise<ReturnData> => {
  return {
    createData,
    updateData,
  };
};
`
}

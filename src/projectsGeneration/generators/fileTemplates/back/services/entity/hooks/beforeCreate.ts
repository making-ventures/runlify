import { pascalPlural, pascalSingular } from '../../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../../args'

export const beforeCreateTmpl = ({ entity }: EntityWideGenerationArgs) => {
  const contextName = 'Context'

  return `import {${contextName}} from '../../types';
import {
  Reliable${pascalSingular(entity.name)}CreateUserInput,
  StrictCreate${pascalSingular(entity.name)}Args,
} from '../${pascalPlural(entity.name)}Service';

export const beforeCreate = async (
  _ctx: ${contextName},
  data: Reliable${pascalSingular(entity.name)}CreateUserInput,
): Promise<StrictCreate${pascalSingular(entity.name)}Args> => data;
`
}

import { pascalPlural, pascalSingular } from '../../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../../args'

export const beforeUpdateTmpl = ({ entity }: EntityWideGenerationArgs) => {
  const contextName = 'Context'

  return `import {
  StrictUpdate${pascalSingular(entity.name)}Args,
} from '../${pascalPlural(entity.name)}Service';
import {${contextName}} from '../../types';

export const beforeUpdate = async (
  _ctx: ${contextName},
  data: StrictUpdate${pascalSingular(entity.name)}Args,
): Promise<StrictUpdate${pascalSingular(entity.name)}Args> => data;
`
}

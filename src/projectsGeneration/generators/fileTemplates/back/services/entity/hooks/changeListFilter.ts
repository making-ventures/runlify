import { pascalPlural } from '../../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../../args'

export const changeListFilterTmpl = ({ entity }: EntityWideGenerationArgs) => {
  const contextName = 'Context'

  return `import {${contextName}} from '../../types';
import {QueryAll${pascalPlural(
    entity.name
  )}Args} from '../../../../generated/graphql';

export const changeListFilter = async <T extends QueryAll${pascalPlural(
    entity.name
  )}Args = QueryAll${pascalPlural(entity.name)}Args>(
  _ctx: ${contextName},
  args: T,
): Promise<T> => {
  return args;
};
`
}

import {pascalSingular} from '../../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../../args'

export const beforeDeleteTmpl = ({ entity }: EntityWideGenerationArgs) => {
  const contextName = 'Context'

  return `import {
  MutationRemove${pascalSingular(entity.name)}Args,
} from '../../../../generated/graphql';
import {${contextName}} from '../../types';

export const beforeDelete = async (
  _ctx: ${contextName},
  _params: MutationRemove${pascalSingular(entity.name)}Args,
// eslint-disable-next-line @typescript-eslint/no-empty-function
): Promise<void> => {};
`
}

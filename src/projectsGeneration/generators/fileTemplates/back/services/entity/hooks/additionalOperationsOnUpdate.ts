import {pascalSingular} from '../../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../../args'

export const additionalOperationsOnUpdateTmpl = ({
  entity,
}: EntityWideGenerationArgs) => {
  const contextName = 'Context'

  return `import {
  MutationUpdate${pascalSingular(entity.name)}Args,
} from '../../../../generated/graphql';
import {${contextName}} from '../../types';

export const additionalOperationsOnUpdate = async (
  _ctx: ${contextName},
  _data: MutationUpdate${pascalSingular(entity.name)}Args,
) => [];
`
}

import { pascalSingular } from '../../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../../args'

export const additionalOperationsOnDeleteTmpl = ({
  entity,
}: EntityWideGenerationArgs) => {
  const contextName = 'Context'

  return `import {
  MutationRemove${pascalSingular(entity.name)}Args,
} from '../../../../generated/graphql';
import {${contextName}} from '../../types';

export const additionalOperationsOnDelete = async (
  _ctx: ${contextName},
  _data: MutationRemove${pascalSingular(entity.name)}Args,
) => [];
`
}

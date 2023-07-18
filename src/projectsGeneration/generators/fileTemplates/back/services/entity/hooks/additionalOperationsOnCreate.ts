import { pascalSingular } from '../../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../../args'

export const additionalOperationsOnCreateTmpl = ({
  entity,
}: EntityWideGenerationArgs) => {
  return `import {
  MutationCreate${pascalSingular(entity.name)}Args,
} from '../../../../generated/graphql';
import {Context} from '../../types';

export const additionalOperationsOnCreate = async (
  _ctx: Context,
  _data: MutationCreate${pascalSingular(entity.name)}Args,
) => [];
`
}

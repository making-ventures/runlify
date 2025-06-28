import {pascalSingular} from '../../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../../args'

export const afterCreateTmpl = ({ entity }: EntityWideGenerationArgs) => {
  const contextName = 'Context'

  return `/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ${pascalSingular(entity.name)},
} from '../../../../generated/graphql';
import {${contextName}} from '../../types';

export const afterCreate = async (
  _ctx: ${contextName},
  _data: ${pascalSingular(entity.name)},
): Promise<void> => {};
`
}

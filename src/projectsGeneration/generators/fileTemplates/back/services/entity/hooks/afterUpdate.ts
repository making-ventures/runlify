import {pascalSingular} from '../../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../../args'

export const afterUpdateTmpl = ({ entity }: EntityWideGenerationArgs) => {
  const contextName = 'Context'

  return `import {
  ${pascalSingular(entity.name)},
} from '../../../../generated/graphql';
import {${contextName}} from '../../types';

export const afterUpdate = async (
  _ctx: ${contextName},
  _data: ${pascalSingular(entity.name)},
): Promise<void> => {};
`
}

import { pascalPlural } from '../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../args'

export const backAdditionalMethodsTmpl = ({
  entity,
}: EntityWideGenerationArgs) => {
  return `import {Context} from '../types';
import {Base${pascalPlural(entity.name)}Methods} from './${pascalPlural(
    entity.name
  )}Service';

export interface Additional${pascalPlural(entity.name)}Methods {}

export const getAdditionalMethods = (_ctx: Context, _baseMethods: Base${pascalPlural(
    entity.name
  )}Methods): Additional${pascalPlural(entity.name)}Methods => ({});
`
}

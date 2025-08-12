import {singular} from 'pluralize'
import {pascal} from '../../../../utils/cases'
import {pad1} from '../../../utils'
import * as R from 'ramda'
import {toTsValue} from './initCommon'
import {BootstrapEntityOptions, Entity} from '../../../../types'

export const initDevEnumTmpl = (entity: Entity, _options: BootstrapEntityOptions) => {
  const contextName = 'Context'

  return `import {${contextName}} from '../../adm/services/types';
import Dev${pascal(singular(entity.name))} from '../../types/Dev${pascal(
    singular(entity.name)
  )}';

const initDev${pascal(entity.name)} = async (ctx: ${contextName}) => {
${entity.devPerefinedElements
  .map(
    (el) => `await ctx.service('${entity.name}').upsert({
  id: Dev${pascal(singular(entity.name))}.Dev${pascal(el.id)},
${R.toPairs(R.omit(['id'], el))
  .map((item) => `${item[0]}: ${toTsValue(item[1])},`)
  .map(pad1)
  .join('\n')}
});`
  )
  .map(pad1)
  .join('\n')}
};

export default initDev${pascal(entity.name)};
`
}

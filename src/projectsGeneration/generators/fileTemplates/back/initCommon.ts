import {singular} from 'pluralize'
import {pascal} from '../../../../utils/cases'
import {pad1, pad2} from '../../../utils'
import * as R from 'ramda'
import {BootstrapEntityOptions, Entity} from '../../../../types'

export const toTsValue = (value: any): string => {
  switch (typeof value) {
    case 'string':
      return `'${value}'`
    default:
      return value.toString()
  }
}

export const initCommonEnumTmpl = (entity: Entity, _options: BootstrapEntityOptions) => {
  const contextName = 'Context'

  return `import {${contextName}} from '../../adm/services/types';
import ${pascal(singular(entity.name))} from '../../types/${pascal(
    singular(entity.name)
  )}';

const init${pascal(entity.name)} = async (ctx: ${contextName}) => {
  await ctx.service('${entity.name}').createMany([
${entity.predefinedElements
  .map(
    (el) => `  {
    id: ${pascal(singular(entity.name))}.${pascal(el.id)},
${R.toPairs(R.omit(['id'], el))
    .map((item) => `${item[0]}: ${toTsValue(item[1])},`)
    .map(pad2)
    .join('\n')}
  },`
  )
  .map(pad1)
  .join('\n')}
  ]);
};

export default init${pascal(entity.name)};
`
}

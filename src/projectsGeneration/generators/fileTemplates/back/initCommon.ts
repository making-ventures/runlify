import { singular } from 'pluralize'
import { pascal } from '../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../args'
import { generatedWarning, pad1 } from '../../../utils'
import * as R from 'ramda'

export const toTsValue = (value: any): string => {
  switch (typeof value) {
    case 'string':
      return `'${value}'`
    default:
      return value.toString()
  }
}

export const initCommonEnumTmpl = ({
  entity,
  options,
}: EntityWideGenerationArgs) => {
  const contextName = 'Context'

  return `import {${contextName}} from '../../adm/services/types';
import ${pascal(singular(entity.name))} from '../../types/${pascal(
    singular(entity.name)
  )}';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const init${pascal(entity.name)} = async (ctx: ${contextName}) => {
${entity.predefinedElements
  .map(
    (el) => `await ctx.service('${entity.name}').upsert({
  id: ${pascal(singular(entity.name))}.${pascal(el.id)},
${R.toPairs(R.omit(['id'], el))
  .map((item) => `${item[0]}: ${toTsValue(item[1])},`)
  .map(pad1)
  .join('\n')}
});`
  )
  .map(pad1)
  .join('\n')}
};

export default init${pascal(entity.name)};
`
}

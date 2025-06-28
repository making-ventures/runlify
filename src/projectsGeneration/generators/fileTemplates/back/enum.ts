import {singular} from 'pluralize'
import {pascal, pascalSingular} from '../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../args'
import {printWarningIfRequired, pad1} from '../../../utils'

export const enumTmpl = ({ entity, options }: EntityWideGenerationArgs) => `${printWarningIfRequired(options)}
enum ${pascalSingular(entity.name)} {
${entity.predefinedElements
  .map((el) => `${pascal(el.id)} = '${el.id}',`)
  .map(pad1)
  .join('\n')}
}

export default ${pascal(singular(entity.name))};
`.trimStart()

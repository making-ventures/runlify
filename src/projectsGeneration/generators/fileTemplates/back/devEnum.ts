import {singular} from 'pluralize'
import {pascal} from '../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../args'
import {printWarningIfRequired, pad1} from '../../../utils'

export const devEnumTmpl = ({
  entity,
  options,
}: EntityWideGenerationArgs) => `${printWarningIfRequired(options)}
enum Dev${pascal(singular(entity.name))} {
${entity.devPerefinedElements
  .map((el) => `Dev${pascal(el.id)} = 'dev${pascal(el.id)}',`)
  .map(pad1)
  .join('\n')}
}

export default Dev${pascal(singular(entity.name))};
`.trimStart()

import {singular} from 'pluralize'
import {pascal} from '../../../../utils/cases'
import {pad1} from '../../../utils'
import {BootstrapEntityOptions, Entity} from '../../../../types'

export const devEnumTmpl = (entity: Entity, _options: BootstrapEntityOptions) => `enum Dev${pascal(singular(entity.name))} {
${entity.devPerefinedElements
  .map((el) => `Dev${pascal(el.id)} = 'dev${pascal(el.id)}',`)
  .map(pad1)
  .join('\n')}
}

export default Dev${pascal(singular(entity.name))};
`.trimStart()

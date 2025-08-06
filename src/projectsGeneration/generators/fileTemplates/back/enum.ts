import {singular} from 'pluralize'
import {pascal, pascalSingular} from '../../../../utils/cases'
import {pad1} from '../../../utils'
import {BootstrapEntityOptions} from '../../../types'
import {Entity} from '../../../../types'

export const enumTmpl = (entity: Entity, _options: BootstrapEntityOptions) => `enum ${pascalSingular(entity.name)} {
${entity.predefinedElements
  .map((el) => `${pascal(el.id)} = '${el.id}',`)
  .map(pad1)
  .join('\n')}
}

export default ${pascal(singular(entity.name))};
`.trimStart()

import { camelSingular, pascalSingular } from '../../../../utils/cases'
import { ProjectWideGenerationArgs } from '../../../args'
import {printWarningIfRequired, pad1} from '../../../utils'

// todo: can delete
export const Entities = ({
  entities,
  options,
}: ProjectWideGenerationArgs) => `${printWarningIfRequired(options)}
enum Entity {
${entities
  .map(
    (entity) =>
      `${pascalSingular(entity.name)} = '${camelSingular(entity.name)}',`
  )
  .map(pad1)
  .join('\n')}
}

export default Entity;
`.trimStart()

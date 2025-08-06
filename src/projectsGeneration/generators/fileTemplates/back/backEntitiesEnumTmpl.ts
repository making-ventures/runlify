import {camelSingular, pascalSingular} from '../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../args'
import {pad1} from '../../../utils'

// todo: can delete
export const backEntitiesEnumTmpl = ({
  entities,
}: ProjectWideGenerationArgs) => `enum Entity {
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

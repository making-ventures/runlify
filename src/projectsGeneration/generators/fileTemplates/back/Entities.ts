import { camelSingular, pascalSingular } from '../../../../utils/cases'
import { ProjectWideGenerationArgs } from '../../../args'
import { generatedWarning, pad1 } from '../../../utils'

// todo: can delete
export const Entities = ({
  entities,
  options,
}: ProjectWideGenerationArgs) => `${
  options.skipWarningThisIsGenerated
    ? ''
    : `// ${generatedWarning}
`
}
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
`

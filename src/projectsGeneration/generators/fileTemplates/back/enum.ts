import { singular } from 'pluralize'
import { pascal, pascalSingular } from '../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../args'
import { generatedWarning, pad1 } from '../../../utils'

export const enumTmpl = ({ entity, options }: EntityWideGenerationArgs) => `${
  options.skipWarningThisIsGenerated
    ? ''
    : `// ${generatedWarning}
`
}
enum ${pascalSingular(entity.name)} {
${entity.predefinedElements
  .map((el) => `${pascal(el.id)} = '${el.id}',`)
  .map(pad1)
  .join('\n')}
}

export default ${pascal(singular(entity.name))};
`

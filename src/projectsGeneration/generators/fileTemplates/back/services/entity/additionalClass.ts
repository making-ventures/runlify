import {pascal, pascalPlural} from '../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../args'

export const prismaAdditionalServiceClassTmpl = ({
  entity,
}: EntityWideGenerationArgs) => {
  return `import {${pascal(entity.name)}Service} from './${pascalPlural(entity.name)}Service';

export class Additional${pascal(entity.name)}Service extends ${pascal(entity.name)}Service {}
`
}

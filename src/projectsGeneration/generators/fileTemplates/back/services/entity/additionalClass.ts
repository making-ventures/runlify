import { pascal } from '../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../args'

export const prismaServiceClassTmpl = ({
                                            entity,
                                          }: EntityWideGenerationArgs) => {
  return `import {Base${pascal(entity.name)}ServiceClass} from './Base${pascal(entity.name)}ServiceClass';

export class ${pascal(entity.name)}ServiceClass extends Base${pascal(entity.name)}ServiceClass {}
`
}

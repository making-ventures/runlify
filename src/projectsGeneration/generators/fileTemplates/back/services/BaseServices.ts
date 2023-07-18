/* eslint-disable max-len */
import { pascal } from '../../../../../utils/cases'
import { ProjectWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

const graphBaseServicesTmpl = ({
  entities,
  options,
}: ProjectWideGenerationArgs) => `${entities.map(
  (m) =>
    `import {Additional${pascal(m.name)}Service} from './${pascal(
      m.name
    )}Service/Additional${pascal(m.name)}Service';`
).join('\n')}
import {HelpService} from './HelpService/HelpService';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
export interface BaseServices {
  help: HelpService;
  ${entities.map((m) => `${m.name}: Additional${pascal(m.name)}Service;`).join('\n  ')}
}
`

export default graphBaseServicesTmpl

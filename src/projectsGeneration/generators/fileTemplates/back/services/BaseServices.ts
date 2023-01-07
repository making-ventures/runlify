/* eslint-disable max-len */
import { pascal } from '../../../../../utils/cases'
import { ProjectWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

const graphBaseServicesTmpl = ({
  entities,
  options,
}: ProjectWideGenerationArgs) => `${entities.map(
  (m) =>
    `import {${m.previewFeatures.includes('classService') ? 'Additional' : ''}${pascal(m.name)}Service} from './${pascal(
      m.name
    )}Service/${m.previewFeatures.includes('classService') ? 'Additional' : ''}${pascal(m.name)}Service';`
).join(`
`)}
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
  ${entities.map((m) => `${m.name}: ${m.previewFeatures.includes('classService') ? 'Additional' : ''}${pascal(m.name)}Service;`).join(`
  `)}
}
`

export default graphBaseServicesTmpl

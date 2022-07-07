/* eslint-disable max-len */
import { pascal } from '../../../../../utils/cases'
import { ProjectWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

const graphServiceConstrictorsTmpl = ({
  entities,
  options,
}: ProjectWideGenerationArgs) => `${entities.map(
  (m) =>
    `import {get${pascal(m.name)}Service} from './${pascal(
      m.name
    )}Service/${pascal(m.name)}Service';`
).join(`
`)}
import {getHelpService} from './HelpService/HelpService';
import {ServiceConstrictors, BaseServiceConstrictors} from './types';
import additionalServiceConstrictors from './additionalServiceConstrictors';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
export const baseServiceConstrictors: BaseServiceConstrictors = {
  help: getHelpService,
  ${entities.map((m) => `${m.name}: get${pascal(m.name)}Service,`).join(`
  `)}
};

const serviceConstrictors: ServiceConstrictors = {
  ...baseServiceConstrictors,
  ...additionalServiceConstrictors,
};

export default serviceConstrictors;
`

export default graphServiceConstrictorsTmpl

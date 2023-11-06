/* eslint-disable max-len */
import { pascal } from '../../../../../utils/cases'
import { ProjectWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

const graphServiceConstrictorsTmpl = ({
  entities,
  options,
}: ProjectWideGenerationArgs) => `${entities.map(
  (m) =>
    `import {Additional${pascal(m.name)}Service} from './${pascal(
      m.name
    )}Service/Additional${pascal(m.name)}Service';`
).join(`
`)}
import {getHelpService} from './HelpService/HelpService';
import {ServiceConstrictors, BaseServiceConstrictors} from './types';
import additionalServiceConstrictors from './additionalServiceConstrictors';
import clientConstrictors from './clientConstrictors';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
export const baseServiceConstrictors: BaseServiceConstrictors = {
  help: getHelpService,
  ${entities.map((m) => `${m.name}: (ctx) => new Additional${pascal(m.name)}Service(ctx),`).join('\n  ')}
};

const serviceConstrictors: ServiceConstrictors = {
  ...baseServiceConstrictors,
  ...additionalServiceConstrictors,
  ...clientConstrictors,
};

export default serviceConstrictors;
`

export default graphServiceConstrictorsTmpl

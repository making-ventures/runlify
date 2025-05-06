import { pascal } from '../../../../../utils/cases'
import { ProjectWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

const graphServiceConstrictorsTmpl = ({
  system: {
    additionalServices,
  },
  entities,
  options,
}: ProjectWideGenerationArgs) => `${entities.map(
  (m) =>
    `import {Additional${pascal(m.name)}Service} from './${pascal(
      m.name
    )}Service/Additional${pascal(m.name)}Service';\n`
).join('')}${additionalServices.map(
  (s) =>
    `import ${pascal(s.name)}Service from './${pascal(s.name)}Service/${pascal(s.name)}Service';\n`
).join('')}import {getHelpService} from './HelpService/HelpService';
import {ServiceConstrictors, BaseServiceConstrictors} from './types';
import additionalServiceConstrictors from './additionalServiceConstrictors';
import integrationClientConstrictors from './integrationClientConstrictors';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
export const baseServiceConstrictors: BaseServiceConstrictors = {
  help: getHelpService,
${entities.map((m) => `  ${m.name}: (ctx) => new Additional${pascal(m.name)}Service(ctx),`).join('\n')}${additionalServices.length ? `
${additionalServices.map((s) => `  ${s.name}: (ctx) => new ${pascal(s.name)}Service(ctx),`).join('\n')}` : ''}
};

const serviceConstrictors: ServiceConstrictors = {
  ...baseServiceConstrictors,
  ...additionalServiceConstrictors,
  ...integrationClientConstrictors,
};

export default serviceConstrictors;
`

export default graphServiceConstrictorsTmpl

/* eslint-disable max-len */
import { pascal } from '../../../../../utils/cases'
import { ProjectWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

const graphServiceConstrictorsTmpl = ({
  entities,
  options,
}: ProjectWideGenerationArgs) => `${entities.map(
  (m) =>
    `import {${m.previewFeatures.includes('classService') ? 'Additional' : 'get'}${pascal(m.name)}Service} from './${pascal(
      m.name
    )}Service/${m.previewFeatures.includes('classService') ? 'Additional' : ''}${pascal(m.name)}Service';`
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
  ${entities.map((m) => m.previewFeatures.includes('classService') ?
  `${m.name}: (ctx) => new Additional${pascal(m.name)}Service(ctx),` :
  `${m.name}: get${pascal(m.name)}Service,`).join('\n  ')}
};

const serviceConstrictors: ServiceConstrictors = {
  ...baseServiceConstrictors,
  ...additionalServiceConstrictors,
};

export default serviceConstrictors;
`

export default graphServiceConstrictorsTmpl

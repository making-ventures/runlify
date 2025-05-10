import {pascal} from '../../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../../args'
import {printWarningIfRequired} from '../../../../utils'

const graphBaseServicesTmpl = ({
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
    `import ${pascal(s.name)}Service from './${pascal(
      s.name
    )}Service/${pascal(s.name)}Service';\n`
).join('')}
import {HelpService} from './HelpService/HelpService';
${printWarningIfRequired(options)}
export interface BaseServices {
  help: HelpService;
  ${[
    ...(entities.length ? entities.map((m) => `${m.name}: Additional${pascal(m.name)}Service;`) : []),
    ...(additionalServices.length ? additionalServices.map((s) => `${s.name}: ${pascal(s.name)}Service;`) : [])
  ].join('\n  ')}
}
`

export default graphBaseServicesTmpl

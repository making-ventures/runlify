import {pascal} from '../../../../../../utils/cases'
import {AdditionalServiceWideGenerationArgs} from '../../../../../args'
import {generatedWarning} from '../../../../../utils'

export const backAdditionalServiceTypesTmpl = ({
  service,
  options,
}: AdditionalServiceWideGenerationArgs) => `${
  options.skipWarningThisIsGenerated
    ? ''
    : `// ${generatedWarning}
`
}
export interface I${pascal(service.name)}Service ${service.methods.filter(m => m.exportedToApi).length ? `{
${service.methods.filter(m => m.exportedToApi).map(method => `  ${method.name}: () => Promise<void>`).join('\n')}
}` : '{}'}

`

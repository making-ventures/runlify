import { pascalCase } from 'change-case'
import {pascal} from '../../../../../../utils/cases'
import {AdditionalServiceWideGenerationArgs} from '../../../../../args'
import {generatedWarning} from '../../../../../utils'
import tsModelTmpl from '../../environment/src/integrationClients/tsModelTmpl'

export const backAdditionalServiceTypesTmpl = ({
  service,
  options,
}: AdditionalServiceWideGenerationArgs) => `${
  options.skipWarningThisIsGenerated
    ? ''
    : `// ${generatedWarning}
`
}
${[
  service.methods.flatMap(q => [q.argsModel, q.returnModel]),
].flat().filter(m => m.fields.length).map(m => tsModelTmpl(m)).join('\n\n')}
${
  service.methods.filter((method) => method.returnModel.fields.length && method.exportedToApi).map(m => `export type ${pascalCase(m.name)}Result = ${pascalCase(m.name)}Model${m.returnModel.array ? '[]' : ''}`).join('\n\n')
}
export interface I${pascal(service.name)}Service ${service.methods.filter(m => m.exportedToApi).length ? `{
${service.methods.filter(m => m.exportedToApi).map(m => `  ${m.name}: (${m.argsModel.fields.length ? `args: ${pascalCase(m.name)}Args` : ''}) => Promise<${m.returnModel.fields.length ? `${pascalCase(m.name)}Result` : 'void'}>`).join('\n')}
}` : '{}'}

`

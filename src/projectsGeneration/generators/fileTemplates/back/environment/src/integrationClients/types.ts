import {pascalCase} from 'change-case'
import {ProjectWideGenerationArgs} from '../../../../../../args'
import {IntegrationClient} from '../../../../../../builders/buildedTypes'
import tsModelTmpl from './tsModelTmpl'
 
const backIntegrationClientTypesTmpl = (
  _args: ProjectWideGenerationArgs,
  client: IntegrationClient
) => {
  return `${[
    client.models,
    client.queryMethods.flatMap(q => [q.argsModel, q.returnModel]),
  ].flat().map(m => tsModelTmpl(m)).join('\n\n')}

${client.queryMethods.map(m => `export type ${pascalCase(m.name)}Result = ${pascalCase(m.name)}Model${m.returnModel.array ? '[]' : ''}`).join('\n\n')}

export interface I${pascalCase(client.name)}Client {
${client.queryMethods.map(m => `  ${m.name}: (args: ${pascalCase(m.name)}Args) =>
    Promise<${pascalCase(m.name)}Result>,`).join('\n')}
}
`
}

export default backIntegrationClientTypesTmpl;

import {pascalCase} from 'change-case'
import {ProjectWideGenerationArgs} from '../../../../../../args'
import {IntegrationClient} from '../../../../../../builders/buildedTypes'

const backIntegrationClientTypesTmpl = (
  {system}: ProjectWideGenerationArgs,
  client: IntegrationClient
) => {
  return `${client.queryMethods.map(m => `export interface ${pascalCase(client.name)}Client${pascalCase(m.name)}Args {
  page: number,
}

export interface ${pascalCase(client.name)}Client${pascalCase(m.name)}Model {
  brandCode: number,
}

export type ${pascalCase(client.name)}Client${pascalCase(m.name)}Result = ${pascalCase(client.name)}Client${pascalCase(m.name)}Model[]`).join('\n\n')}

export interface I${pascalCase(client.name)}Client {
${client.queryMethods.map(m => `  ${m.name}: (args: ${pascalCase(client.name)}Client${pascalCase(m.name)}Args) => Promise<${pascalCase(client.name)}Client${pascalCase(m.name)}Result>,`).join('\n')}
}
`
}

export default backIntegrationClientTypesTmpl;

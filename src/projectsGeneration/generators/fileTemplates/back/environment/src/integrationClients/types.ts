import {pascalCase} from 'change-case'
import {ProjectWideGenerationArgs} from '../../../../../../args'
import {IntegrationClient} from '../../../../../../builders/buildedTypes'

const backIntegrationClientTypesTmpl = (
  {system}: ProjectWideGenerationArgs,
  client: IntegrationClient
) => {
  return `export interface ${pascalCase(client.name)}ClientGetBrandsArgs {
  page: number,
}

export interface ${pascalCase(client.name)}ClientGetBrandsModel {
  brandCode: number,
}

export type ${pascalCase(client.name)}ClientGetBrandsResult = ${pascalCase(client.name)}ClientGetBrandsModel[]

export interface I${pascalCase(client.name)}Client {
${client.queryMethods.map(m => `  ${m.name}: (args: ${pascalCase(client.name)}Client${pascalCase(m.name)}Args) => Promise<${pascalCase(client.name)}Client${pascalCase(m.name)}Result>,`).join('\n\n')}
}
`
}

export default backIntegrationClientTypesTmpl;

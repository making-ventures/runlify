import {pascalCase} from 'change-case'
import {ProjectWideGenerationArgs} from '../../../../../../args'
import {IntegrationClient, ScalarField} from '../../../../../../builders/buildedTypes'
import { fieldTypeToTsType } from '../../../../../fieldTypeToTsType'

const fieldsToTsTypeFields = (fields: ScalarField[]) =>
  fields.map(f => `${f.name}${f.required ? '' : '?'}: ${fieldTypeToTsType(f.type)}`)

const backIntegrationClientTypesTmpl = (
  _args: ProjectWideGenerationArgs,
  client: IntegrationClient
) => {
  return `${client.queryMethods.map(m => `export interface ${pascalCase(client.name)}Client${pascalCase(m.name)}Args ${m.argsModel.fields.length ? `{
${fieldsToTsTypeFields(m.argsModel.fields).map(r => `  ${r},`).join('\n')}
}
` : '{}'}

export interface ${pascalCase(client.name)}Client${pascalCase(m.name)}Model ${m.returnModel.fields.length ? `{
${fieldsToTsTypeFields(m.returnModel.fields).map(r => `  ${r},`).join('\n')}
}`: '{}'}

export type ${pascalCase(client.name)}Client${pascalCase(m.name)}Result = ${pascalCase(client.name)}Client${pascalCase(m.name)}Model${m.returnModel.array ? '[]' : ''}`).join('\n\n')}

export interface I${pascalCase(client.name)}Client {
${client.queryMethods.map(m => `  ${m.name}: (args: ${pascalCase(client.name)}Client${pascalCase(m.name)}Args) => Promise<${pascalCase(client.name)}Client${pascalCase(m.name)}Result>,`).join('\n')}
}
`
}

export default backIntegrationClientTypesTmpl;

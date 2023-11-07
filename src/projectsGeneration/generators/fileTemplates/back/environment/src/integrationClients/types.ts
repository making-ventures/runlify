import {pascalCase} from 'change-case'
import {ProjectWideGenerationArgs} from '../../../../../../args'
import {IntegrationClient, TsModelField} from '../../../../../../builders/buildedTypes'
import { fieldTypeToTsType } from '../../../../../fieldTypeToTsType'

const fieldsToTsTypeFields = (fields: TsModelField[]) =>
  fields.map(f => `${f.name}${f.required ? '' : '?'}: ${f.category === 'model' ? f.model : fieldTypeToTsType(f.type)}`)

const backIntegrationClientTypesTmpl = (
  _args: ProjectWideGenerationArgs,
  client: IntegrationClient
) => {
  return `${client.queryMethods.map(m => `export interface ${pascalCase(m.name)}Args ${m.argsModel.fields.length ? `{
${fieldsToTsTypeFields(m.argsModel.fields).map(r => `  ${r},`).join('\n')}
}` : '{}'}

export interface ${pascalCase(m.name)}Model ${m.returnModel.fields.length ? `{
${fieldsToTsTypeFields(m.returnModel.fields).map(r => `  ${r},`).join('\n')}
}`: '{}'}

export type ${pascalCase(m.name)}Result = ${pascalCase(m.name)}Model${m.returnModel.array ? '[]' : ''}`).join('\n\n')}

export interface I${pascalCase(client.name)}Client {
${client.queryMethods.map(m => `  ${m.name}: (args: ${pascalCase(m.name)}Args) =>
    Promise<${pascalCase(m.name)}Result>,`).join('\n')}
}
`
}

export default backIntegrationClientTypesTmpl;

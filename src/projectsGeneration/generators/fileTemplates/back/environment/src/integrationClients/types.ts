import {pascalCase} from 'change-case'
import {ProjectWideGenerationArgs} from '../../../../../../args'
import {IntegrationClient, TsModel, TsModelField} from '../../../../../../builders/buildedTypes'
import { fieldTypeToTsType } from '../../../../../fieldTypeToTsType'

const fieldsToTsTypeFields = (fields: TsModelField[]) =>
  fields.map(f => `${f.name}${f.required ? '' : '?'}: ${f.category === 'model' ? `${pascalCase(f.model)}${f.array ? '[]' : ''}` : fieldTypeToTsType(f.type)}`)

const tsModelTmpl = (model: TsModel) => `export interface ${pascalCase(model.name)} ${model.fields.length ? `{
${fieldsToTsTypeFields(model.fields).map(r => `  ${r},`).join('\n')}
}` : '{}'}`
 
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

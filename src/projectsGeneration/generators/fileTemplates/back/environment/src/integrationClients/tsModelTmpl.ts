import {pascalCase} from 'change-case'
import {TsModel} from '../../../../../../builders/buildedTypes'
import {fieldsToTsTypeFieldsWithTypes} from './fieldsToTsTypeFieldsWithTypes';

const tsModelTmpl = (model: TsModel) => `export interface ${pascalCase(model.name)} ${model.fields.length ? `{
${fieldsToTsTypeFieldsWithTypes(model.fields).map(r => `  ${r},`).join('\n')}
}` : '{}'}`

export default tsModelTmpl;

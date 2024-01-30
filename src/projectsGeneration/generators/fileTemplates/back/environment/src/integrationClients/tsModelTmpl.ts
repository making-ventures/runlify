import {pascalCase} from 'change-case'
import {TsModel} from '../../../../../../builders/buildedTypes'
import fieldsToTsTypeFields from './fieldsToTsTypeFields';

const tsModelTmpl = (model: TsModel) => `export interface ${pascalCase(model.name)} ${model.fields.length ? `{
${fieldsToTsTypeFields(model.fields).map(r => `  ${r},`).join('\n')}
}` : '{}'}`

export default tsModelTmpl;

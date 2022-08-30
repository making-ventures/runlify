import { pascalSingular } from '../../../../../../utils/cases'
import * as R from 'ramda'
import { getEditComponent } from '../EntityEdit/DefaultEntityEdit'
import { getCompNamesToEditField } from '../../../../ui/componentNames/edit/getCompNamesToEditField'
import { EntityWideGenerationArgs } from '../../../../../args'
import { getEntityField } from '../../../../../builders/utils/accessFunctions'
import { addComma, pad3, generatedWarning } from '../../../../../utils'
import { getFieldLabel } from '../../../../ui/getShowComponent'
import { Field } from '../../../../../builders/buildedTypes'

export const uiDefaultFilterTmpl = ({
  allEntities,
  entity,
  options,
}: EntityWideGenerationArgs) => {
  const fields = entity.forms.listForm.filter.fields
    .filter((f) => !f.hidden)
    // .filter(f => f.showInList) // todo: delete in generation
    .filter((f) => f.name !== 'id' && f.name !== 'photoId')

  const hasSearch = entity.type === 'catalog' || entity.type === 'document'

  const fieldsToImport = fields.map((f) => getEntityField(entity, f.name))
  const dateFieldsToImport = fieldsToImport.filter((f) =>
    ['datetime', 'date'].includes(f.type)
  )
  const notDateFieldsToImport = fieldsToImport.filter(
    (f) => !['datetime', 'date'].includes(f.type)
  )
  const reactAdminImports: string[] = [
    'Filter',
    ...(hasSearch ? ['TextInput'] : []),

    ...R.flatten(
      notDateFieldsToImport.map((f) => getCompNamesToEditField(f, allEntities))
    ),
  ]

  const dateFieldsExceptDocumentDateToImport = dateFieldsToImport.filter(el => entity.type !== 'document' || el.name !== 'date');

  return `import React, {FC} from 'react';
import {
  ${R.uniq(reactAdminImports).map(addComma).join(`
  `)}
  useTranslate,
} from 'react-admin';${
    dateFieldsExceptDocumentDateToImport.some((f) => f.type === 'datetime')
      ? `
import DateTimeInput from '../../../../uiLib/DateTimeInput';`
      : ''
  }${
    dateFieldsExceptDocumentDateToImport.some((f) => f.type === 'date')
      ? `
import DateInput from '../../../../uiLib/DateInput';`
      : ''
  }
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const Default${pascalSingular(entity.name)}Filter: FC<any> = (props) => {
  const translate = useTranslate();

  return (
    <Filter {...props}>${
      hasSearch
        ? `
      <TextInput${
        entity.fields.some((f) => f.name === 'search')
          ? `\n        ${getFieldLabel(
              entity,
              entity.fields.find((f) => f.name === 'search') as Field
            )}`
          : ''
      }
        source='q'
        alwaysOn
        sx={{m: 1}}
      />`
        : ''
    }
${fields
  .filter(el => entity.type !== 'document' || el.name !== 'date')
  .map((f) =>
    getEditComponent(
      entity,
      allEntities,
      getEntityField(entity, f.name),
      'filter',
      [f.alwaysOn ? 'alwaysOn' : undefined].filter(Boolean) as string[]
    )
  )
  .map(pad3)
  .join('\n')}
    </Filter>
  );
};

export default Default${pascalSingular(entity.name)}Filter;
`
}

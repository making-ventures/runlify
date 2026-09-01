import {pascalSingular} from '../../../../../../utils/cases'
import * as R from 'ramda'
import {getEditComponents} from '../EntityEdit/DefaultEntityEdit'
import {getCompNamesToEditField} from '../../../../ui/componentNames/edit/getCompNamesToEditField'
import {EntityWideGenerationArgs} from '../../../../../args'
import {getEntityField} from '../../../../../builders/utils/accessFunctions'
import {addComma, pad3} from '../../../../../utils'
import {isMoneyField} from '../../../../../metaUtils'

export const uiDefaultFilterTmpl = ({
  allEntities,
  entity,
  options,
}: EntityWideGenerationArgs) => {
  const fields = entity.forms.list.filter.fields
    .filter((f) => !f.hidden)
    .filter((f) => f.name !== 'id' && f.name !== 'photoId')

  const hasSearch = entity.type === 'catalog' || entity.type === 'document' || entity.type === 'infoRegistry' && entity.searchEnabled

  const useTranslate = fields.some((f) => {
    const field = getEntityField(entity, f.name);
    return field.filters.some(filter => ['in', 'not_in', 'lt', 'lte', 'gt', 'gte', 'defined', 'not_defined'].includes(filter));
  });
  const useReferenceArray = fields.some((f) => {
    const field = getEntityField(entity, f.name);
    return field.category == 'link' && field.filters.some(filter => ['in', 'not_in'].includes(filter));
  });

  const fieldsToImport = fields.map((f) => getEntityField(entity, f.name))
  const dateFieldsToImport = fieldsToImport.filter((f) =>
    ['datetime', 'date'].includes(f.type)
  )
  const hasMoneyField = fieldsToImport.some(isMoneyField)
  const notDateFieldsToImport = fieldsToImport.filter(
    (f) => !['datetime', 'date'].includes(f.type) && (f.category !== 'link' || ['equal', 'lt', 'lte', 'gt', 'gte', 'defined', 'not_defined'].some(filter => f.filters.some(item => item === filter)))
  )
  const hasLinkField = fields.some((f) => getEntityField(entity, f.name).category === 'link')

  const reactAdminImports: string[] = [
    ...(options.useSortedFilter ? [] : ['Filter']),
    ...(useTranslate ? ['useTranslate'] : []),
    ...(hasSearch ? ['TextInput'] : []),
    ...(useReferenceArray ? ['ReferenceArrayInput', 'AutocompleteArrayInput'] : []),
    ...(hasLinkField ? ['usePermissions'] : []),
    ...R.flatten(
      notDateFieldsToImport.map((f) => getCompNamesToEditField(f, allEntities))
    ),
  ]

  const dateFieldsExceptDocumentDateToImport = dateFieldsToImport.filter(el => entity.type !== 'document' || el.name !== 'date');

  return `import React, {FC} from 'react';
import {
  ${R.uniq(reactAdminImports).map(addComma).join(`
  `)}
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
  }${
    options.useSortedFilter
      ? `
import {SortedFilter} from '../../../../uiLib/SortedFilters';`
      : ''
  }${
    hasMoneyField
      ? `
import {moneyMajorToMinor, moneyMinorToMajor} from '../../../../uiLib/transformations/moneyAmount';`
      : ''
  }${hasLinkField ? `
import {hasPermission} from '../../../../utils/permissions';` : ''}

const Default${pascalSingular(entity.name)}Filter: FC<any> = (props) => {${useTranslate ? `\n  const translate = useTranslate();` : ''}${hasLinkField ? `\n  const {permissions} = usePermissions<string[]>();` : ''}
  return (
    <${options.useSortedFilter ? 'SortedFilter' : 'Filter'} {...props}>${
      hasSearch
        ? `
      <TextInput
        label='ra.action.search'
        source='q'
        alwaysOn
        sx={{m: 1}}
      />`
        : ''
    }
${fields
  .filter(el => entity.type !== 'document' || el.name !== 'date')
  .flatMap((f) => {
    const entityField = getEntityField(entity, f.name)
    const comps = getEditComponents(
      entity,
      allEntities,
      entityField,
      'filter',
      [f.alwaysOn ? 'alwaysOn' : undefined].filter(Boolean) as string[]
    )
    return entityField.category === 'link'
      ? comps.map((comp) => `{hasPermission(permissions, '${entityField.externalEntity}.all') && ${comp}}`)
      : comps
  })
  .map(pad3)
  .join('\n')}
    </${options.useSortedFilter ? 'SortedFilter' : 'Filter'}>
  );
};

export default Default${pascalSingular(entity.name)}Filter;
`
}

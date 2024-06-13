/* eslint-disable max-len */
import {pascalSingular} from '../../../../../../utils/cases';
import {
  getCompNamesToEditField,
} from '../../../../ui/componentNames/edit/getCompNamesToEditField';
import * as R from 'ramda';
import {Entity, Field, LinkField} from '../../../../../builders/buildedTypes';
import {getCompNameToEditScalar} from '../../../../ui/componentNames/edit/getCompNameToEditScalar';
import {EntityWideGenerationArgs} from '../../../../../args';
import { generatedWarning, pad } from '../../../../../utils'
import {isImageFileRef, isMarkdownField, isMoneyField, isMultilineField} from '../../../../../metaUtils';
import {getFieldLabel} from '../../../../ui/getShowComponent';

// 'string' | 'int' | 'bigint' | 'float' | 'bool' | 'datetime' | 'date'

export const getTsDefaultTypeValueExpression = (field: Field): string | undefined => {
  if ('defaultValueExpression' in field && field.defaultValueExpression) {
    return field.defaultValueExpression;
  }

  switch (field.type) {
  // case 'string':
  //   return '\'\'';
  // case 'int':
  //   return '0';
  // case 'bigint':
  //   return '0';
  // case 'float':
  //   return '0';
  case 'bool':
    return 'false';

  // case 'datetime':
  //   return 'new Date()';
  // case 'date':
  //   return 'new Date()';
  default:
    return undefined;

    // throw new Error('Unknown "field.type" type');
  }
};

export const getTrivialEditComponent = (
  entity: Entity,
  field: Field,
  type: 'create' | 'edit' | 'filter',
  additionalProps: string[] = [],
  postfix?: {source: string, label: string}
) => {
  return `<${getCompNameToEditScalar(field.type)}${additionalProps.map(p => `\n  ${p}`).join('')}
  fullWidth
  sx={{m: 1}}
  source='${field.name}${postfix ? postfix.source : ''}'${field.required ? '' : '\n  defaultValue={null}'}${field.required && type !== 'filter' && field.type !== 'bool' && field.requiredOnInput !== false ? `\n  isRequired` : ''}
  ${getFieldLabel(entity, field, postfix?.label)}${isMoneyField(field) ? `
  format={(value) => value / 100}
  parse={(value) => value * 100}` : ''}
/>`;
};

export const getLinkEditComponent = (
  entity: Entity,
  field: LinkField,
  type: 'create' | 'edit' | 'filter',
  additionalProps: string[] = [],
  isDisabled: boolean = false,
) => {
  return `<ReferenceInput${additionalProps.map(p => `\n  ${p}`)}
  source='${field.name}'
  reference='${field.externalEntity}'
  sort={{field: '${entity.sortField}', order: '${entity.sortOrder}'}}
  perPage={100}
  ${getFieldLabel(entity, field)}
>
  <AutocompleteInput
    fullWidth
    sx={{m: 1}}
    size='small'
    ${getFieldLabel(entity, field)}
    defaultValue={null}
    parse={val => val || null}${field.required && type !== 'filter' ? `
    isRequired` : ''}${isDisabled ? `
    disabled`: ''}
    noOptionsText='ra.message.noOptions'
  />
</ReferenceInput>`;
}

export const getLinkArrayEditComponent = (
  entity: Entity,
  field: LinkField,
  type: 'create' | 'edit' | 'filter',
  additionalProps: string[] = [],
  postfix?: {source: string, label: string}
) => {
  return `<ReferenceArrayInput${additionalProps.map(p => `\n  ${p}`)}
  source='${field.name}${postfix ? postfix.source : ''}'
  reference='${field.externalEntity}'
  sort={{field: '${entity.sortField}', order: '${entity.sortOrder}'}}
  ${getFieldLabel(entity, field, postfix?.label)}
>
  <AutocompleteArrayInput
    fullWidth
    sx={{m: 1}}
    size='small'
    ${getFieldLabel(entity, field, postfix?.label)}
    optionText='title'
    parse={val => val || null}${field.required && type !== 'filter' ? `
    isRequired` : ''}
  />
</ReferenceArrayInput>`;
};

export const getEditComponent = (
  entity: Entity,
  allEntities: Map<string, Entity>,
  field: Field,
  type: 'create' | 'edit' | 'filter',
  additionalProps: string[] = [],
) => {
  const isDisabled = field.sharded && type === 'edit'

  if (field.category === 'link' && type !== 'filter') {
    const linkedEntity = allEntities.get(field.externalEntity);
    if (linkedEntity) {
      if (isImageFileRef(field)) {
        return `<FileInput source='${field.name}' type='image' />`;
      }
      return getLinkEditComponent(entity, field, type, additionalProps, isDisabled);
    }
  }

  if (isMarkdownField(field)) {
    additionalProps.push('multiline');
    additionalProps.push('maxRows={24}');
  }

  if (isMultilineField(field)) {
    additionalProps.push('multiline');
    additionalProps.push('maxRows={24}');
  }

  if (isDisabled) {
    additionalProps.push('disabled');
  }

  if (type == 'filter' && field.filters.length > 0) {
    let filters: string[] = [];
    field.filters.forEach((f) => {
      let postfix = {source: '', label: ''};
      if (['in', 'not_in', 'lt', 'lte', 'gt', 'gte', 'defined', 'not_defined'].includes(f)) {
        postfix.source = `_${f}`;
        postfix.label = f;
      }
      if (field.category === 'link') {
        if (['in', 'not_in'].includes(f)) {
          filters.push(getLinkArrayEditComponent(entity, field, type, additionalProps, postfix));
        } else {
          filters.push(getLinkEditComponent(entity, field, type, additionalProps));
        }
      } else {
        filters.push(getTrivialEditComponent(entity, field, type, additionalProps, postfix));
      }
    });
    return filters.join('\n');
  } else if (type == 'filter' && field.filters.length == 0) {
    return '';
  }

  return getTrivialEditComponent(entity, field, type, additionalProps);
};

export const uiDefaultEditTmpl = ({
  allEntities,
  entity,
  options,
}: EntityWideGenerationArgs) => {
  const fileRefFields = entity.fields.filter(isImageFileRef);
  const withFileRef = fileRefFields.length > 0;

  const fieldsToImport = entity
    .fields
    .filter(f => !f.hidden && f.showInEdit)
    .filter(f => !fileRefFields.includes(f))

    // .filter(f => f.requiredOnInput || f.requiredOnInput === null)
    .filter(f => f.name !== 'id');
  const dateFieldsToImport = fieldsToImport
    .filter(f => ['datetime', 'date'].includes(f.type));
  const notDateFieldsToImport = fieldsToImport
    .filter(f => !['datetime', 'date'].includes(f.type));
  const reactAdminImports: string[] = [
    'Edit',
    'SimpleForm',
    'EditProps',
    'ToolbarProps',
    'Toolbar',
    'SaveButton',
    // 'DeleteButton',
    // 'usePermissions',

    ...R.flatten(
      notDateFieldsToImport
        .map(f => getCompNamesToEditField(f, allEntities)),
    ),
  ];

  if (entity.removableByUser) {
    reactAdminImports.push(
      'DeleteButton',
      'usePermissions',
    )
  }

  const hasHidden = entity.fields
    .filter(f => !f.hidden && f.showInEdit)
    .filter(f => f.name !== 'id')
    .some(f => !(f.requiredOnInput || f.requiredOnInput === null));

  const fieldsToWorkWith = entity
    .fields
    .filter(f => !f.hidden && f.showInEdit)

    // .filter(f => f.requiredOnInput || f.requiredOnInput === null)
    .filter(f => f.name !== 'id');

  const initialValues = fieldsToWorkWith.filter(f => getTsDefaultTypeValueExpression(f));
  const isAllowedToChange = entity.allowedToChange;

  const dateFields = fieldsToWorkWith.filter(f => f.requiredOnInput !== false && ['datetime', 'date'].includes(f.type))

  return `/* eslint-disable max-len */
import React, {FC, useMemo, useCallback} from 'react';
import {
  ${R.uniq(reactAdminImports.map(el => `${el},`)).join(`
  `)}
} from 'react-admin';${dateFieldsToImport.some(f => f.type === 'datetime') ? `
import DateTimeInput from '../../../../uiLib/DateTimeInput';` : ''}${dateFieldsToImport.some(f => f.type === 'date') ? `
import DateInput from '../../../../uiLib/DateInput';` : ''}${hasHidden ? `
import {useDebug} from '../../../../contexts/DebugContext';` : ''}
import {Grid} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import get${pascalSingular(entity.name)}Validation from '../get${pascalSingular(
  entity.name
  )}Validation';${entity.removableByUser ? `
import {hasPermission} from '../../../../utils/permissions';` : ''}
import {LoadingContext} from '../../../../contexts/LoadingContext';${withFileRef ? `
import {FileInput} from \'../../../../uiLib/file/FileInput\';` : ''}${isAllowedToChange ? `
import {AllowedToEdit} from '../../../../uiLib/AllowedToEdit';` : ''}${options.breadcrumb ?
    "\nimport {Breadcrumbs} from '../../../../raUiLib/Breadcrumbs';" : ''}
${options.skipWarningThisIsGenerated ? '' : `
// ${generatedWarning}
`}
const DefaultToolbar = (props: ToolbarProps) => {${entity.removableByUser ? `
  const {permissions} = usePermissions<string[]>();
` : ''}
  return (
    <Toolbar
      {...props}
      sx={{display: 'flex', justifyContent: 'space-between'}}
    >
      <SaveButton />${entity.removableByUser ? `
      {hasPermission(permissions, '${entity.name}.delete') && <DeleteButton mutationMode='pessimistic' />}` : ''}
    </Toolbar>
  );
};

const defaultValues = ${initialValues.length === 0 ? '{}' : `{
${initialValues.map(f => `${f.name}: ${getTsDefaultTypeValueExpression(f)},`).map(pad(1)).join('\n')}
}`};

const Default${pascalSingular(entity.name)}Edit: FC<EditProps> = (props: EditProps) => {
${hasHidden ? `  const {debug} = useDebug();
` : ''}  const resolver = useMemo(() => yupResolver(get${pascalSingular(entity.name)}Validation()), []);

  return (
    <Edit
      redirect='show'
      {...props}
      transform={useCallback((data: any, previousData?: { previousData: any }) => {
        const mergedData = {...defaultValues, ...previousData?.previousData, ...data};
        return ${dateFields.length ? `{
          ...mergedData,${dateFields
    .map(f => `
          ${f.name}: mergedData.${f.name} || null,`)
    .join('')}
        }` : 'mergedData'};
      }, [])}
      mutationMode='pessimistic'${
    options.breadcrumb ? '\n      actions={<Breadcrumbs />}' : ''}
    >
      <LoadingContext>${isAllowedToChange ? `
        <AllowedToEdit allowedToEdit={${entity.allowedToChange}} />` : ''}
        <SimpleForm
          defaultValues={defaultValues}
          resolver={resolver}
          toolbar={<DefaultToolbar />}
        >
          <Grid container spacing={2}>
${fieldsToWorkWith.length === 0 ? '            <div />' : fieldsToWorkWith
    .map(f => {
      const comp = `<Grid item ${(isMarkdownField(f) || isMultilineField(f)) ? 'xs={12} sm={12} md={12} lg={12}': 'xs={12} sm={6} md={3} lg={2}'}>
${pad(1)(getEditComponent(entity, allEntities, f, 'edit'))}
</Grid>`;

      const debuggedComp = f.requiredOnInput || f.requiredOnInput === null ? comp : `{debug && ${comp}}`;

      return pad(6)(debuggedComp);
    })
    .join('\n')}
          </Grid>
        </SimpleForm>
      </LoadingContext>
    </Edit>
  );
};

export default Default${pascalSingular(entity.name)}Edit;
`;
};

/* eslint-disable max-len */
import {pascalSingular} from '../../../../../../utils/cases';
import {
  getCompNamesToEditField,
} from '../../../../ui/componentNames/edit/getCompNamesToEditField';
import * as R from 'ramda';
import {Entity, Field} from '../../../../../builders/buildedTypes';
import {getCompNameToEditScalar} from '../../../../ui/componentNames/edit/getCompNameToEditScalar';
import {EntityWideGenerationArgs} from '../../../../../args';
import { generatedWarning, pad6, pad1 } from '../../../../../utils'
import {getFieldByName, isImageFileRef, isMarkdownField, isMultilineField} from '../../../../../metaUtils';
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

export const getTrivialEditComponent = (entity: Entity, field: Field, additionalProps: string[] = []) => {
  return `<${getCompNameToEditScalar(field.type)}${additionalProps.map(p => `\n  ${p}`).join('')}
  fullWidth
  sx={{m: 1}}
  source='${field.name}'${field.required ? '' : '\n  defaultValue={null}'}
  ${getFieldLabel(entity, field)}
/>`;
};

export const getEditComponent = (entity: Entity, allEntities: Map<string, Entity>, field: Field, type: 'create' | 'edit' | 'filter', additionalProps: string[] = []) => {
  if (field.category === 'link') {
    const linkedEntity = allEntities.get(field.externalEntity);
    if (!linkedEntity) {
      return getTrivialEditComponent(entity, field, additionalProps);
    }

    if (isImageFileRef(field)) {
      if (type === 'edit') {
        return `<FileInput source='${field.name}' type='image' />`;
      } else if (type === 'create') {
        return `<FileInput source='${field.name}' type='image' />`;
      }
    }

    const linkedField = getFieldByName(linkedEntity, linkedEntity.titleField);

    return `<ReferenceInput${additionalProps.map(p => `\n  ${p}`)}
  source='${field.name}'
  reference='${field.externalEntity}'
  sort={{field: '${entity.sortField}', order: '${entity.sortOrder}'}}
  ${getFieldLabel(entity, field)}
>
  <AutocompleteInput
    fullWidth
    sx={{m: 1}}
    size='small'
    ${getFieldLabel(entity, field)}
    optionText='${linkedField.name}'
    defaultValue={null}
    parse={val => val || null}
  />
</ReferenceInput>`;
  } else {
    if (isMarkdownField(field)) {
      additionalProps.push('multiline');
      additionalProps.push('maxRows={24}');
    }

    if (isMultilineField(field)) {
      additionalProps.push('multiline');
      additionalProps.push('maxRows={24}');
    }

    return getTrivialEditComponent(entity, field, additionalProps);
  }
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
    .filter(f => !f.hidden)
    .filter(f => !fileRefFields.includes(f))

    // .filter(f => f.requiredOnInput || f.requiredOnInput === null)
    .filter(f => f.name !== 'id');
  const dateFieldsToImport = fieldsToImport
    .filter(f => ['datetime', 'date'].includes(f.type));
  const notDateFieldsToImport = fieldsToImport
    .filter(f => !['datetime', 'date'].includes(f.type));
  const reactAdminImports: string[] = [
    'useTranslate',
    'Edit',
    'SimpleForm',
    'EditProps',
    'ToolbarProps',
    'Toolbar',
    'SaveButton',
    'DeleteButton',
    'usePermissions',

    ...R.flatten(
      notDateFieldsToImport
        .map(f => getCompNamesToEditField(f, allEntities)),
    ),
  ];

  const hasHidden = entity.fields
    .filter(f => !f.hidden)
    .filter(f => f.name !== 'id')
    .some(f => !(f.requiredOnInput || f.requiredOnInput === null));

  const fieldsToWorkWith = entity
    .fields
    .filter(f => !f.hidden)

    // .filter(f => f.requiredOnInput || f.requiredOnInput === null)
    .filter(f => f.name !== 'id');

  const initialValues = fieldsToWorkWith.filter(f => getTsDefaultTypeValueExpression(f));

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
import get${pascalSingular(entity.name)}Validation from '../get${pascalSingular(entity.name)}Validation';
import {hasPermission} from '../../../../utils/permissions';
import {LoadingContext} from '../../../../contexts/LoadingContext';
${withFileRef ? 'import {FileInput} from \'../../../../uiLib/file/FileInput\';\n' : ''}
${options.skipWarningThisIsGenerated ? '' : `// ${generatedWarning}
`}
const DefaultToolbar = (props: ToolbarProps) => {
  const {permissions} = usePermissions<string[]>();

  return (
    <Toolbar
      {...props}
      sx={{display: 'flex', justifyContent: 'space-between'}}
    >
      <SaveButton />
      {hasPermission(permissions, '${entity.name}.delete') && <DeleteButton mutationMode='pessimistic' />}
    </Toolbar>
  );
};

const Default${pascalSingular(entity.name)}Edit: FC<EditProps> = (props: EditProps) => {
${hasHidden ? `  const {debug} = useDebug();
` : ''}  const translate = useTranslate();

  const resolver = useMemo(() => yupResolver(get${pascalSingular(entity.name)}Validation(translate)), [translate]);

  return (
    <Edit
      redirect='show'
      {...props}
      transform={useCallback((data: any) => ({
        ...data,${fieldsToWorkWith
    .filter(f => ['datetime', 'date'].includes(f.type))
    .map(f => `
        ${f.name}: data.${f.name} || null,`)
    .join('')}
      }), [])}
    >
      <LoadingContext>
        <SimpleForm
          defaultValues=${initialValues.length === 0 ? '{{}}' : `{{
${initialValues.map(f => `${f.name}: ${getTsDefaultTypeValueExpression(f)},`).map(pad6).join('\n')}
          }}`}
          resolver={resolver}
          toolbar={<DefaultToolbar />}
        >
          <Grid container spacing={2}>
${fieldsToWorkWith.length === 0 ? '            <div />' : fieldsToWorkWith
    .map(f => {
      const comp = `<Grid item ${(isMarkdownField(f) || isMultilineField(f)) ? 'xs={12} sm={12} md={12} lg={12}': 'xs={12} sm={6} md={3} lg={2}'}>
${pad1(getEditComponent(entity, allEntities, f, 'edit'))}
</Grid>`;

      const debuggedComp = f.requiredOnInput || f.requiredOnInput === null ? comp : `{debug && ${comp}}`;

      return pad6(debuggedComp);
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

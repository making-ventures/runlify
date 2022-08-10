/* eslint-disable max-len */
import { pascalSingular } from '../../../../../../utils/cases'
import { getCompNamesToShowField } from '../../../../ui/componentNames/show/getCompNamesToShowField'
import * as R from 'ramda'
import { getShowComponent } from '../../../../ui/getShowComponent'
import { Entity } from '../../../../../builders/buildedTypes'
import { EntityWideGenerationArgs } from '../../../../../args'
import { generatedWarning, pad4 } from '../../../../../utils'
import { getFieldByName, isImageFileRef, isMarkdownField } from '../../../../../metaUtils'
import { plural } from 'pluralize'

export const uiDefaultListTmpl = ({
  allEntities,
  entity,
  fromLinks,
  options,
}: EntityWideGenerationArgs) => {
  const fileRefFields = entity.fields.filter(isImageFileRef)
  const withFileRef = fileRefFields.length > 0

  const allEntitiesForImport: Entity[] = [entity].filter(Boolean) as Entity[]
  const toEntitiesForImport: Entity[] = fromLinks
    .map((link) => allEntities.get(link.externalEntityName))
    .filter(Boolean) as Entity[]

  const fieldsToImport = [
    ...R.flatten(
      allEntitiesForImport.map((entity) =>
        R.flatten(entity.fields.filter((f) => !f.hidden).filter(f => !isMarkdownField(f)))
      )
    ),
    ...R.flatten(
      toEntitiesForImport.map((entity) =>
        getFieldByName(entity, entity.titleField)
      )
    ),
  ]
  const dateFieldsToImport = fieldsToImport.filter((f) =>
    ['datetime', 'date'].includes(f.type)
  )
  const notDateFieldsToImport = fieldsToImport.filter(
    (f) => !['datetime', 'date'].includes(f.type)
  )
  const reactAdminImports: string[] = [
    'List',
    'Datagrid',
    'ListProps',
    'BulkActionProps',
    'usePermissions',
    'BulkDeleteButton',

    ...R.flatten(
      notDateFieldsToImport.map((f) => getCompNamesToShowField(f, allEntities))
    ),
  ]

  const registrarDepended =
    ['infoRegistry', 'sumRegistry'].includes(entity.type) &&
    'registrarDepended' in entity &&
    entity.registrarDepended

  return `/* eslint-disable max-len */
import React, {FC} from 'react';
import {
  ${R.uniq(reactAdminImports).map((s) => s + ',').join(`
  `)}
  useTranslate,
} from 'react-admin';${
    dateFieldsToImport.some((f) => ['date', 'datetime'].includes(f.type))
      ? `
import DateField from '../../../../uiLib/DateField';`
      : ''
  }${
    registrarDepended
      ? `
import RegistrarField from '../../../../raUiLib/RegistrarField';`
      : ''
  }
import ${pascalSingular(entity.name)}Filter from './${pascalSingular(
    entity.name
  )}Filter';
import {hasPermission} from '../../../../utils/permissions';
${
  withFileRef
    ? "import ImageViewField from '../../../../uiLib/file/ImageViewField';\n"
    : ''
}
${
  options.skipWarningThisIsGenerated
    ? ''
    : `// ${generatedWarning}
`
}
const CustomBulkActionButton = (props: BulkActionProps) => {
  const {permissions} = usePermissions<string[]>();

  return (
    <>
      {hasPermission(permissions, '${entity.name}.delete') && <BulkDeleteButton {...props} />}
    </>
  );
};

const Default${pascalSingular(
    entity.name
  )}List: FC<ListProps> = (props: ListProps) => {
  const translate = useTranslate();

  return (
    <List
      title={translate('${plural(entity.type)}.${
    entity.name
  }.title')}
      exporter={false}
      filters={<${pascalSingular(
    entity.name
  )}Filter />}
      bulkActionButtons={<CustomBulkActionButton />}
      {...props}
    >
      <Datagrid rowClick='show'>
${entity.fields
  .filter((f) => !f.hidden)
  .filter(f => f.showInList)
  .map((f) => getShowComponent(entity, allEntities, f, 'list'))
  .map(pad4)
  .join('\n')}${
    registrarDepended
      ? `
        <RegistrarField label='Registrar' />`
      : ''
  }
      </Datagrid>
    </List>
  );
};

export default Default${pascalSingular(entity.name)}List;
`
}

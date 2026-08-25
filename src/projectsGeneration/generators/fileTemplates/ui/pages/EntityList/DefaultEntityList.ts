import {pascalSingular} from '../../../../../../utils/cases'
import {getCompNamesToShowField} from '../../../../ui/componentNames/show/getCompNamesToShowField'
import * as R from 'ramda'
import {getShowComponent} from '../../../../ui/getShowComponent'
import {Entity} from '../../../../../builders/buildedTypes'
import {EntityWideGenerationArgs} from '../../../../../args'
import {pad5} from '../../../../../utils'
import {isImageFileRef, isMarkdownField} from '../../../../../metaUtils'
import {plural} from 'pluralize'

export const uiDefaultListTmpl = ({
  allEntities,
  entity,
}: EntityWideGenerationArgs) => {
  const fileRefFields = entity.fields.filter(isImageFileRef)
  const withFileRef = fileRefFields.length > 0

  const allEntitiesForImport: Entity[] = [entity].filter(Boolean) as Entity[]

  const fieldsToImport = [
    ...R.flatten(
      allEntitiesForImport.map((entity) =>
        R.flatten(entity.fields.filter((f) => !f.hidden).filter(f => f.showInList).filter(f => !isMarkdownField(f)))
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
    'DatagridConfigurable',
    'ListProps',
    'usePermissions',
    // 'BulkDeleteButton',

    ...R.flatten(
      notDateFieldsToImport.map((f) => getCompNamesToShowField(f))
    ),
  ]

  if (entity.removableByUser) {
    reactAdminImports.push(
      'BulkDeleteButton',
    )
  }

  const registrarDepended =
    ['infoRegistry', 'sumRegistry'].includes(entity.type) &&
    'registrarDepended' in entity &&
    entity.registrarDepended

  return `import React, {FC} from 'react';
import {
  ${R.uniq(reactAdminImports).map((s) => s + ',').join(`
  `)}
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
import ListActions from '../../../../raUiLib/ListActions';
import {BulkActionProps} from "shared/type";
import ${pascalSingular(entity.name)}ListBreadcrumbs from './${pascalSingular(entity.name)}ListBreadcrumbs';${
  withFileRef
    ? "\nimport ImageViewField from '../../../../uiLib/file/ImageViewField';"
    : ''
}
${entity.removableByUser ? `
const DefaultBulkActionButton = (props: BulkActionProps) => {
  const {permissions} = usePermissions<string[]>();

  return (
    <>
      {hasPermission(permissions, '${entity.name}.delete') && <BulkDeleteButton {...props} />}
    </>
  );
};
` : ''}
const Default${pascalSingular(
    entity.name
  )}List: FC<ListProps> = (props: ListProps) => {
  const {permissions} = usePermissions<string[]>();

  return (
    <>
      <${pascalSingular(entity.name)}ListBreadcrumbs />
      <List
        title='${plural(entity.type)}.${
    entity.name
  }.title.plural'
        filters={<${pascalSingular(
    entity.name
  )}Filter />}
        actions={<ListActions />}
        sort={{field: '${entity.sortField}', order: '${entity.sortOrder}'}}${!entity.exportableByUser ? `
        exporter={false}` : ''}
        {...props}
      >
        <DatagridConfigurable
          rowClick={hasPermission(permissions, '${entity.name}.get') ? 'show' : false}
          bulkActionButtons={${entity.removableByUser ? '<DefaultBulkActionButton />' : 'false'}}
        >
${entity.fields
  .filter((f) => !f.hidden)
  .filter(f => f.showInList)
  .map((f) => {
    const comp = getShowComponent(entity, allEntities, f, 'list')
    return f.category === 'link'
      ? `{hasPermission(permissions, '${f.externalEntity}.all') && ${comp}}`
      : comp
  })
  .map(pad5)
  .join('\n')}${
    registrarDepended
      ? `
          <RegistrarField label='Registrar' />`
      : ''
  }
        </DatagridConfigurable>
      </List>
    </>
  );
};

export default Default${pascalSingular(entity.name)}List;
`
}

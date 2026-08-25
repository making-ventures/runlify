import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
  LinkedEntities,
} from '../../../../../types'
import {getCompNamesToShowField} from '../../../../ui/componentNames/show/getCompNamesToShowField'
import * as R from 'ramda'
import {pascal} from '../../../../../../utils/cases'
import {getShowComponent} from '../../../../ui/getShowComponent'
import {Entity} from '../../../../../builders/buildedTypes'
import {addComma, pad4} from '../../../../../utils'
import {isMarkdownField} from "../../../../../metaUtils"

export const uiEntityShowDependencyTabTmpl = (
  allEntities: Map<string, Entity>,
  entity: Entity,
  toLink: LinkedEntities,
  _options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => {
  const allEntitiesForImport: Entity[] = [
    entity,
    allEntities.get(toLink.entityOwnerName),
  ].filter((entity) => entity) as Entity[]

  const fieldsToImport = R.flatten(
    allEntitiesForImport.map((entity) =>
      R.flatten(entity.fields.filter((f) => !f.hidden)).filter(f => !isMarkdownField(f))
    )
  )
  const dateFieldsToImport = fieldsToImport.filter((f) =>
    ['datetime', 'date'].includes(f.type)
  )
  const notDateFieldsToImport = fieldsToImport.filter(
    (f) => !['datetime', 'date'].includes(f.type)
  )
  const reactAdminImports: string[] = [
    'TabProps',
    'Tab',
    'usePermissions',

    ...R.flatten(
      notDateFieldsToImport.map((f) => getCompNamesToShowField(f))
    ),
  ]

  reactAdminImports.push('ReferenceManyField')
  reactAdminImports.push('Pagination')
  reactAdminImports.push('Datagrid')
  reactAdminImports.push('ShowButton')

  const linkedEntity = allEntities.get(toLink.entityOwnerName)

  if (!linkedEntity) {
    throw new Error(`There is no "${toLink.entityOwnerName}" entity`)
  }

  return `import React, {FC} from 'react';
import {
  ${R.uniq(reactAdminImports).map(addComma).join(`
  `)}
} from 'react-admin';${
    dateFieldsToImport.some((f) => ['date', 'datetime'].includes(f.type))
      ? `
import DateField from '../../../../../uiLib/DateField';`
      : ''
  }
import {hasPermission} from '../../../../../utils/permissions';

const ${pascal(entity.name)}${pascal(
    toLink.fromField.name
  )}Tab: FC<Omit<TabProps, 'children'>> = (props) => {
  const {permissions} = usePermissions<string[]>();

  return (<Tab {...props}>
    <ReferenceManyField
      label={false}
      reference='${toLink.entityOwnerName}'
      target='${toLink.fromField.name}'
      pagination={<Pagination />}
    >
      <Datagrid
        bulkActionButtons={false}
        rowClick={hasPermission(permissions, '${toLink.entityOwnerName}.get') ? 'show' : false}
      >
${linkedEntity.fields
  .filter((f) => !f.hidden)
  .filter((f) => !isMarkdownField(f))
  .map((f) => {
    const comp = getShowComponent(entity, allEntities, f)
    return f.category === 'link'
      ? `{hasPermission(permissions, '${f.externalEntity}.all') && ${comp}}`
      : comp
  })
  .map(pad4)
  .join('\n')}
        <ShowButton />
      </Datagrid>
    </ReferenceManyField>
  </Tab>);
};

export default ${pascal(entity.name)}${pascal(toLink.fromField.name)}Tab;
`
}

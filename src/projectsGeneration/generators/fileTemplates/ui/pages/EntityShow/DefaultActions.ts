import {pascalSingular} from '../../../../../../utils/cases'
import {singular} from 'pluralize'
import {EntityWideGenerationArgs} from '../../../../../args'
import {pad5} from '../../../../../utils'

export const uiDefaultActionTmpl = (
  {
    entity,
    allEntities,
  }: EntityWideGenerationArgs,
) => {
  const isUpdatableByUser = entity.updatableByUser;
  const isAllowedToChange = entity.allowedToChange;

  return `import React from 'react';
import {
  TopToolbar,${entity.updatableByUser ? `
  EditButton,
  usePermissions,` : ''}
} from 'react-admin';
// import OpenAudit from '../../../commonActions/OpenAudit';${isUpdatableByUser ? `
import {hasPermission} from '../../../../utils/permissions';` : ''}
// import OpenHelp from '../../../commonActions/OpenHelp';${
    entity && entity.type === 'document' && entity.registries.length > 0
      ? `
import RePost from '../../../commonActions/RePost';
import OpenRegistries from '../../../commonActions/OpenRegistries';`
      : ''
  }${isAllowedToChange && isUpdatableByUser ? `
import {useAllowedToEdit} from '../../../../uiLib/AllowedToEdit';` : ''}

const Default${pascalSingular(entity.name)}Actions = () => {${isUpdatableByUser ? `
  const {permissions} = usePermissions<string[]>();${isAllowedToChange ? `
  const allowedToEdit = useAllowedToEdit(${entity.allowedToChange});`: ''}
` : ''}
  return (
    <TopToolbar sx={{alignItems: 'center'}}>${
      entity && entity.type === 'document' && entity.registries.length > 0
        ? `
      <OpenRegistries
        document='${singular(entity.name)}'
        registries={${
          entity.registries.length
            ? `[
${entity.registries
  .map((r) => `{name: '${r}', type: '${allEntities.get(r)?.type}'},`)
  .map(pad5)
  .join('\n')}
        ]`
            : '[]'
        }}
      />
      <RePost serviceName='${pascalSingular(entity.name)}' />`
        : ''
    }${
    entity &&
    `
      {/* <OpenAudit entityTypeId='${singular(entity.name)}' />
      <OpenHelp entityType='${entity.name}' /> */}${isUpdatableByUser ? `
      {${isAllowedToChange ? 'allowedToEdit && ' : ''}hasPermission(permissions, '${entity.name}.update') && <EditButton />}` : ''}`
  }
    </TopToolbar>
  );
};

export default Default${pascalSingular(entity.name)}Actions;
`
}

import { plural } from 'pluralize'
import { pascalSingular } from '../../../../utils/cases'
import { ProjectWideGenerationArgs } from '../../../args'

export const uiResourcesTmpl = ({
  entities,
}: ProjectWideGenerationArgs) => `/* eslint-disable max-len */
import * as React from 'react';
import {Resource, Translate} from 'react-admin';
import Loadable from '../shared/Loadable';
import {hasPermission} from '../utils/permissions';

${entities.map(
  (m) => `const Loadable${pascalSingular(m.name)}Show = Loadable({
  loader: () => import('./pages/${m.name}/${pascalSingular(m.name)}Show'),
});
const Loadable${pascalSingular(m.name)}Edit = Loadable({
  loader: () => import('./pages/${m.name}/${pascalSingular(m.name)}Edit'),
});
const Loadable${pascalSingular(m.name)}Create = Loadable({
  loader: () => import('./pages/${m.name}/${pascalSingular(m.name)}Create'),
});
const Loadable${pascalSingular(m.name)}List = Loadable({
  loader: () => import('./pages/${m.name}/${pascalSingular(m.name)}List'),
});`
).join(`
`)}

export const getResources = (translate: Translate, permissions: string[]) => (
  permissions ?
    [
${entities.map(
  (entity) => `      <Resource
        key='${entity.name}'
        name='${entity.name}'
        show={hasPermission(permissions, '${
          entity.name
        }.get') ? Loadable${pascalSingular(entity.name)}Show : undefined}
        edit={hasPermission(permissions, '${
          entity.name
        }.update') ? Loadable${pascalSingular(entity.name)}Edit : undefined}
        create={hasPermission(permissions, '${
          entity.name
        }.create') ? Loadable${pascalSingular(entity.name)}Create : undefined}
        list={hasPermission(permissions, '${
          entity.name
        }.all') ? Loadable${pascalSingular(entity.name)}List : undefined}
        options={{label: translate('${plural(entity.type)}.${
    entity.name
  }.title')}}
        recordRepresentation='${entity.titleField}'
      />,`
).join(`
`)}
    ] :
    []
);
`

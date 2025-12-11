import {plural} from "pluralize";
import {pascalSingular} from "../../../../utils/cases";
import {ProjectWideGenerationArgs} from "../../../args";
import {Entity} from "../../../builders";
import {BootstrapEntityInnerOptions} from "../../../../types";

const imports = `import * as React from 'react';
import {Resource} from 'react-admin';
import {Translate} from 'shared/type';
import Loadable from '../shared/Loadable';
import {hasPermission} from '../utils/permissions';`

function uiResources(_options: BootstrapEntityInnerOptions, chunks: number[]) {
  const imports = chunks.map(num => `import {resourcesChunk${num}} from './resourcesChunk${num}';`).join("\n");
  return `import {Translate} from 'shared/type';
${imports}

export function getResources(translate: Translate, permissions: string[]) {
  return permissions ? [
${chunks.map(num => `    ...resourcesChunk${num}(translate, permissions),`).join("\n")}
  ] : [];
}
`.trimStart()
}


export function uiResourcesTmpl({entities, options}: ProjectWideGenerationArgs) {
  const left = entities.slice(0, entities.length / 2);
  const right = entities.slice(entities.length / 2);
  return {
    resources: uiResources(options, [0, 1]),
    resourcesChunk0: genChunk(options, 0, left),
    resourcesChunk1: genChunk(options, 1, right),
  }
}

function genChunk(_options: BootstrapEntityInnerOptions, num: number, entities: Entity[]) {
  return `${imports}

${entities.map((m) => `const Loadable${pascalSingular(m.name)}Show = Loadable(() => import('./pages/${m.name}/${pascalSingular(m.name)}Show'));${m.updatableByUser ? `
const Loadable${pascalSingular(m.name)}Edit = Loadable(() => import('./pages/${m.name}/${pascalSingular(m.name)}Edit'));` : ""}${m.creatableByUser ? `
const Loadable${pascalSingular(m.name)}Create = Loadable(() => import('./pages/${m.name}/${pascalSingular(m.name)}Create'));` : ""}
const Loadable${pascalSingular(m.name)}List = Loadable(() => import('./pages/${m.name}/${pascalSingular(m.name)}List'));`).join(`
`)}

export function resourcesChunk${num}(translate: Translate, permissions: string[]) {
  return [
${entities.map((entity) => `    <Resource
      key='${entity.name}'
      name='${entity.name}'
      show={hasPermission(permissions, '${entity.name}.get') ? Loadable${pascalSingular(entity.name)}Show : undefined}
      edit={${entity.updatableByUser ? `hasPermission(permissions, '${entity.name}.update') ? Loadable${pascalSingular(entity.name)}Edit : undefined` : "undefined"}}
      create={${entity.creatableByUser ? `hasPermission(permissions, '${entity.name}.create') ? Loadable${pascalSingular(entity.name)}Create : undefined` : "undefined"}}
      list={hasPermission(permissions, '${entity.name}.all') ? Loadable${pascalSingular(entity.name)}List : undefined}
      options={{label: translate('${plural(entity.type)}.${entity.name}.title.singular')}}
      recordRepresentation='${entity.titleField}'
    />,`).join('\n')}
  ];
}
`.trimStart();
}

import { pascalCase } from 'change-case'
import { ProjectWideGenerationArgs } from '../../../../../args'
import { generatedWarning } from '../../../../../utils'

const uiRoutesTmpl = ({
  system,
  options,
}: ProjectWideGenerationArgs) => `import * as React from 'react';
import {
  Route,
} from 'react-router-dom';
import Loadable from '../shared/Loadable';
import additionalRoutes from './additionalRoutes';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const LoadableDashboard = Loadable(() => import('./Dashboard'));
const LoadableFunctions = Loadable(() => import('./functions/Functions'));
const LoadableResourcesPage = Loadable(() => import('./ResourcesPage'));
const LoadableMetaPage = Loadable(() => import('./MetaPage'));
const LoadableDebugPage = Loadable(() => import('./utility/DebugPage'));
${system.pages.map(p => `const Loadable${pascalCase(p.name)} = Loadable(() => import('./standalonePages/${pascalCase(p.name)}/${pascalCase(p.name)}'));`).join('\n').trim()}

export const routes = [
  <Route element={<LoadableDashboard />} key='dashboard' path='/dashboard' />,
  <Route element={<LoadableFunctions />} key='functions' path='/functions' />,
  <Route element={<LoadableResourcesPage />} key='resources' path='/resources' />,
  <Route element={<LoadableMetaPage />} key='meta' path='/meta' />,
  <Route element={<LoadableDebugPage />} key='debug' path='/debug' />,
${system.pages.map(p => `  <Route element={<Loadable${pascalCase(p.name)} />} key='${p.name}' path='${p.link}' />,`).join('\n')}
  ...additionalRoutes,
];
`

export default uiRoutesTmpl

import {pascalCase} from 'change-case'
import {ProjectWideGenerationArgs} from '../../../../../args'

const uiRoutesTmpl = ({
  system,
}: ProjectWideGenerationArgs) => `import * as React from 'react';
import {
  Route,
} from 'react-router-dom';
import Loadable from '../shared/Loadable';
import Guard from '../raUiLib/Guard';
import additionalRoutes from './additionalRoutes';

const LoadableDashboard = Loadable(() => import('./Dashboard'));
const LoadableFunctions = Loadable(() => import('./functions/Functions'));
// const LoadableResourcesPage = Loadable(() => import('./ResourcesPage'));
const LoadableMetaPage = Loadable(() => import('./MetaPage'));
const LoadableDebugPage = Loadable(() => import('./utility/DebugPage'));
const LoadableErrorMessage = Loadable(() => import('./utility/ErrorMessage'));${system.pages.length ? `
${system.pages.map(p => `const Loadable${pascalCase(p.name)} = Loadable(() => import('./standalonePages/${pascalCase(p.name)}/${pascalCase(p.name)}'));`).join('\n')}` : ''}

export const routes = [
  <Route element={<Guard shouldHave='ui.dashboard'><LoadableDashboard /></Guard>} key='home' path='/' />,
  <Route element={<Guard shouldHave='ui.dashboard'><LoadableDashboard /></Guard>} key='dashboard' path='/dashboard' />,
  <Route element={<Guard shouldHave='ui.functions'><LoadableFunctions /></Guard>} key='functions' path='/functions' />,
  // <Route element={<Guard shouldHave='ui.resources'><LoadableResourcesPage /></Guard>} key='resources' path='/resources' />,
  <Route element={<Guard shouldHave='ui.meta'><LoadableMetaPage /></Guard>} key='meta' path='/meta' />,
  <Route element={<Guard shouldHave='debug'><LoadableDebugPage /></Guard>} key='debug' path='/debug' />,
  <Route
    element={<LoadableErrorMessage />}
    key='errorMessage'
    path='/errorMessage'
  />,
${system.pages.map(p => `  <Route element={<Loadable${pascalCase(p.name)} />} key='${p.name}' path='${p.link}' />,`).join('\n')}
  ...additionalRoutes,
];
`

export default uiRoutesTmpl

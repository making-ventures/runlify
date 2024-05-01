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
import Guard from '../raUiLib/Guard';
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
// const LoadableResourcesPage = Loadable(() => import('./ResourcesPage'));
const LoadableMetaPage = Loadable(() => import('./MetaPage'));
const LoadableDebugPage = Loadable(() => import('./utility/DebugPage'));${system.pages.length ? `
const LoadableErrorMessage = Loadable(() => import('./utility/ErrorMessage'));
${system.pages.map(p => `const Loadable${pascalCase(p.name)} = Loadable(() => import('./standalonePages/${pascalCase(p.name)}/${pascalCase(p.name)}'));`).join('\n')}` : ''}

export const routes = [
  <Route element={<Guard shouldHave='dashboard'><LoadableDashboard /></Guard>} key='dashboard' path='/dashboard' />,
  <Route element={<Guard shouldHave='functions'><LoadableFunctions /></Guard>} key='functions' path='/functions' />,
  // <Route element={<Guard shouldHave='resources'><LoadableResourcesPage /></Guard>} key='resources' path='/resources' />,
  <Route element={<Guard shouldHave='meta'><LoadableMetaPage /></Guard>} key='meta' path='/meta' />,
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

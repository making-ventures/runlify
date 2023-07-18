import { ProjectWideGenerationArgs } from '../../../../../args'
import { generatedWarning } from '../../../../../utils'

const uiRoutesTmpl = ({
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
const LoadableDashboard = Loadable({
  loader: () => import('./Dashboard'),
});
const LoadableFunctions = Loadable({
  loader: () => import('./functions/Functions'),
});
const LoadableResourcesPage = Loadable({
  loader: () => import('./ResourcesPage'),
});
const LoadableMetaPage = Loadable({
  loader: () => import('./MetaPage'),
});
const LoadableDebugPage = Loadable({
  loader: () => import('./utility/DebugPage'),
});

export const routes = [
  <Route element={<LoadableDashboard />} key='dashboard' path='/dashboard' />,
  <Route element={<LoadableFunctions />} key='functions' path='/functions' />,
  <Route element={<LoadableResourcesPage />} key='resources' path='/resources' />,
  <Route element={<LoadableMetaPage />} key='meta' path='/meta' />,
  <Route element={<LoadableDebugPage />} key='debug' path='/debug' />,
  ...additionalRoutes,
];
`

export default uiRoutesTmpl

import { ProjectWideGenerationArgs } from '../../../../../args'
import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../types'
import { generatedWarning } from '../../../../../utils'

export const uiAppTmpl = (
  { system: { defaultLanguage } }: ProjectWideGenerationArgs,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import {
  Admin,
  AuthProvider,
  useTranslate,
  CustomRoutes,
  localStorageStore,
  DataProvider,
} from 'react-admin';
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from '@apollo/client';
import './App.css';
import Layout from './layout/Layout';
import Login from './layout/Login';
import dataProviderFactory from './dataProvider';
import getConfig from './config/config';
import {getResources} from './adm/resources';
import Dashboard from './adm/Dashboard';
import {DebugProvider} from './contexts/DebugContext';
import getAuthProvider from './authProvider/getAuthProvider';
import {onStart} from './systemHooks';
import getApollo, {updateApolloLinks} from './apollo/getApollo';
import Loader from './shared/Loader';
import {lightTheme} from './layout/themes';
import {routes} from './adm/routes';
import i18nProvider from './i18nProvider';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
onStart();

const App = () => {
  const dataProvider = useRef<DataProvider | undefined>(undefined);
  const authProvider = useRef<AuthProvider | undefined>(undefined);
  // const client = useRef<ApolloClient<NormalizedCacheObject> | undefined>(undefined);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);
  const translate = useTranslate();

  useEffect(() => {
    const fetchDataProvider = async () => {
      const config = await getConfig();
      authProvider.current = getAuthProvider(config.endpoint);

      const client = getApollo(config.endpoint)
      setClient(client);

      dataProvider.current = await dataProviderFactory(client);

      updateApolloLinks(config.endpoint);
    };

    fetchDataProvider();
  }, []);

  if (!dataProvider.current || !client || !authProvider.current) {
    return (
      <Loader />
    );
  }

  return (
    <ApolloProvider client={client}>
      <DebugProvider>
        <Admin
          dashboard={Dashboard}
          dataProvider={dataProvider.current}
          i18nProvider={i18nProvider}
          layout={Layout}
          loading={Loader}
          loginPage={Login}
          authProvider={authProvider.current}
          title=''
          theme={lightTheme}
          store={localStorageStore('3')}
        >
          {permissions => [
            (
              <CustomRoutes key='customRoutes'>
                {routes}
              </CustomRoutes>
            ),
            ...getResources(translate, permissions),
          ]}
        </Admin>
      </DebugProvider>
    </ApolloProvider>
  );
};

export default App;
`

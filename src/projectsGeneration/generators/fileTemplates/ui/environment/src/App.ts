import {ProjectWideGenerationArgs} from '../../../../../args'
import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../types'

export const uiAppTmpl = (
  _: ProjectWideGenerationArgs,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Admin, AuthProvider, CustomRoutes, DataProvider, localStorageStore, useTranslate} from 'react-admin';
import {ApolloClient, ApolloProvider, NormalizedCacheObject} from '@apollo/client';
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
import {lightTheme${options.themesEnabled ? ', darkTheme': ''}} from './layout/themes';
import {routes} from './adm/routes';
import i18nProvider from './i18nProvider';
import {BrowserRouter} from 'react-router-dom';
import {LogoutType} from './authProvider/types';

onStart();

const App = () => {
  const dataProvider = useRef<DataProvider | undefined>(undefined);
  const authProvider = useRef<AuthProvider | undefined>(undefined);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);
  const translate = useTranslate();

  useEffect(() => {
    const fetchDataProvider = async () => {
      const config = await getConfig();

      authProvider.current = getAuthProvider({
        backEndpoint: config.endpoint,
        issuer: config.oidcAdmIssuer,
        clientId: config.oidcAdmClientId,
        loginRedirectUri: \`\${window.location.origin}/auth-callback\`,
        logoutRedirectUri: \`\${window.location.origin}/login\`,
        logout: config.oidcAdmLogoutType as LogoutType,
      });

      const userFromAuthProvider = await authProvider.current.getUser();

      const client = getApollo(config.endpoint, userFromAuthProvider?.access_token ?? '');
      setClient(client);

      dataProvider.current = await dataProviderFactory(client);

      updateApolloLinks(config.endpoint, userFromAuthProvider?.access_token ?? '');
    };

    fetchDataProvider();
  }, []);

  if (!dataProvider.current || !client || !authProvider.current) {
    return (
      <Loader />
    );
  }

  return (
    <React.StrictMode>
      <BrowserRouter>
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
              lightTheme={lightTheme}${options.themesEnabled ? `
              darkTheme={darkTheme}`: ''}${options.telemetry ? '': `
              disableTelemetry`}
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
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
`

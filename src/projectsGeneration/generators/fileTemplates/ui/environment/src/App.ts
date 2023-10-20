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
import Keycloak, {
  KeycloakConfig,
  KeycloakTokenParsed,
  KeycloakInitOptions,
  KeycloakError,
} from 'keycloak-js';
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
import log from './utils/log';
import {BrowserRouter} from 'react-router-dom';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
onStart();

const keycloakInitOptions: KeycloakInitOptions = {onLoad: 'login-required'};

const getPermissions = (decoded: KeycloakTokenParsed) => {
  const roles = decoded?.realm_access?.roles;
  if (!roles) {
    return false;
  }

  if (roles.includes('admin')) {
    return 'admin';
  }

  if (roles.includes('user')) {
    return 'user';
  }

  return false;
};

const App = () => {
  const dataProvider = useRef<DataProvider | undefined>(undefined);
  const authProvider = useRef<AuthProvider | undefined>(undefined);
  // const client = useRef<ApolloClient<NormalizedCacheObject> | undefined>(undefined);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);
  const [keycloak, setKeycloak] = useState<Keycloak | undefined>(undefined);
  const translate = useTranslate();

  useEffect(() => {
    const fetchDataProvider = async () => {
      const config = await getConfig();

      const keycloakConfig: KeycloakConfig = {
        url: config.oidcAdmUrl,
        realm: config.oidcAdmRealm,
        clientId: config.oidcAdmClientId,
      };

      const keycloakClient = new Keycloak(keycloakConfig);

      keycloakClient.onAuthError =
        (errorData: KeycloakError) => log.info(\`onAuthError. error: \${errorData?.error}, description: \${errorData?.error_description}\`);

      keycloakClient.onAuthRefreshError = () => log.info('onAuthRefreshError');
      keycloakClient.onActionUpdate = (status: string) => log.info(\`onActionUpdate. status: \${status}\`);
      keycloakClient.onAuthLogout = () => log.info('onAuthLogout');
      keycloakClient.onAuthRefreshSuccess = () => log.info('onAuthRefreshSuccess');
      keycloakClient.onAuthSuccess = () => log.info('onAuthSuccess');
      keycloakClient.onReady = (authenticated?: boolean) => log.info(\`onReady. authenticated: \${authenticated}\`);

      const refresh = async () => {
        const ok = await keycloakClient.updateToken(3000);
        if (ok) {
          const {endpoint} = await getConfig();
          updateApolloLinks(endpoint, keycloakClient);
        }
      };

      // eslint-disable-next-line require-atomic-updates
      keycloakClient.onTokenExpired = () => {
        refresh().catch(log.warn);
        log.info('onTokenExpired');
      };

      keycloakClient.onAuthRefreshError = () => log.info('onAuthRefreshError');

      await keycloakClient.init(keycloakInitOptions);

      log.info(\`token: \${keycloakClient.token}\`);

      authProvider.current = getAuthProvider(
        config.endpoint,
        keycloakClient,
        {
          onPermissions: getPermissions,
        },
      );

      const client = getApollo(config.endpoint, keycloakClient);
      setClient(client);

      dataProvider.current = await dataProviderFactory(client);

      updateApolloLinks(config.endpoint, keycloakClient);

      setKeycloak(keycloakClient);
    };

    if (!keycloak) {
      fetchDataProvider();
    }
  }, [keycloak]);

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
              darkTheme={darkTheme}`: ''}
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

import { ProjectWideGenerationArgs } from '../../../../../../args'
import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'
import { generatedWarning } from '../../../../../../utils'

export const uiI18nProviderTmpl = (
  { system: { defaultLanguage } }: ProjectWideGenerationArgs,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import * as React from 'react';
import {
  useState, useEffect,
} from 'react';
import {
  Admin,
  AuthProvider,
  useTranslate,
  CustomRoutes,
  localStorageStore,
} from 'react-admin';
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from '@apollo/client';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import './App.css';
import Layout from './layout/Layout';
import Login from './layout/Login';
import defaultMessages from './i18n/${defaultLanguage}';
import dataProviderFactory from './dataProvider';
import getConfig from './config/config';
import {createBrowserHistory} from 'history';
import {getResources} from './adm/resources';
import Dashboard from './adm/Dashboard';
import {DebugProvider} from './contexts/DebugContext';
import getAuthProvider from './authProvider/getAuthProvider';
import {onStart} from './systemHooks';
import getApollo from './apollo/getApollo';
import Loader from './shared/Loader';
import {lightTheme} from './layout/themes';
import {routes} from './adm/routes';
import log from './utils/log';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
onStart();

const history = createBrowserHistory();

const i18nProvider = polyglotI18nProvider(locale => {
  switch (locale) {
  case 'en':
    return import('./i18n/en').then(messages => messages.default);
  case 'ru':
    return defaultMessages;
  default:
    log.error(\`Unknown locale: "\${locale}"\`);
    return defaultMessages;
  }
}, 'ru');

const App = () => {
  const [dataProvider, setDataProvider] = useState<any | null>(null);
  const [authProvider, setAuthProvider] = useState<AuthProvider | null>(null);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);
  const translate = useTranslate();

  useEffect(() => {
    const fetchDataProvider = async () => {
      const config = await getConfig();
      setAuthProvider(getAuthProvider(config.endpoint));

      const client = getApollo(config.endpoint);
      setClient(client);
      const dataProviderInstance = await dataProviderFactory(client);
      setDataProvider(() => dataProviderInstance);
    };

    fetchDataProvider();
  }, []);

  if (!dataProvider || !client || !authProvider) {
    return (
      <Loader />
    );
  }

  return (
    <ApolloProvider client={client}>
      <DebugProvider>
        <Admin
          dashboard={Dashboard}
          dataProvider={dataProvider}
          history={history}
          i18nProvider={i18nProvider}
          layout={Layout}
          loading={Loader}
          loginPage={Login}
          authProvider={authProvider}
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

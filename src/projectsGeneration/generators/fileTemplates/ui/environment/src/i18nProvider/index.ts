import { ProjectWideGenerationArgs } from '../../../../../../args'
import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'
import { generatedWarning } from '../../../../../../utils'

export const uiI18nProviderTmpl = (
  { system: { defaultLanguage, languages } }: ProjectWideGenerationArgs,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import polyglotI18nProvider from 'ra-i18n-polyglot';
import defaultMessages from '../i18n/${defaultLanguage}';
import log from '../utils/log';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const i18nProvider = polyglotI18nProvider(
  locale => {
    switch (locale) {${languages.filter(({id}) => id !== defaultLanguage).map(({id}) => `
    case '${id}':
      return import('../i18n/${id}').then(messages => messages.default);`).join('')}
    case '${defaultLanguage}':
      return defaultMessages;
    default:
      log.error(\`Unknown locale: "\${locale}"\`);
      return defaultMessages;
    }
  },
  'ru',
  [${languages.map(({id, title}) => `
    {locale: '${id}', name: '${title}'}`).join(',')}
  ],
);

export default i18nProvider;
`

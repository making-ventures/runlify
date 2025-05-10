import { ProjectWideGenerationArgs } from '../../../../../../args'
import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'
import {printWarningIfRequired} from '../../../../../../utils'

export const uiI18nProviderTmpl = (
  { system: { defaultLanguage, languages } }: ProjectWideGenerationArgs,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import polyglotI18nProvider from 'ra-i18n-polyglot';
import {Locale} from 'ra-core';
import defaultMessages from '../i18n/${defaultLanguage}';
import log from '../utils/log';
import {ValidationMessages} from '../i18n/types';
import initYupLocale from './initYupLocale';
import {I18nProvider} from './types';
${printWarningIfRequired(options)}
const locales: Locale[] = [${languages.map(({id, title}) => `
  {locale: '${id}', name: '${title}'},`).join('')}
];

const i18nProvider: I18nProvider = ({
  ...polyglotI18nProvider(
    locale => {
      switch (locale) {${languages.filter(({id}) => id !== defaultLanguage).map(({id}) => `
        case '${id}':
          return import('../i18n/${id}')
            .then(messages => {
              initYupLocale(messages.default.validation as ValidationMessages);

              return messages.default;
            });`).join('')}
        case '${defaultLanguage}':
          initYupLocale(defaultMessages.validation as ValidationMessages);

          return defaultMessages;
        default:
          log.error(\`Unknown locale: "\${locale}"\`);

          initYupLocale(defaultMessages.validation as ValidationMessages);

          return defaultMessages;
      }
    },
    '${defaultLanguage}',
    locales,
    {allowMissing: true}, // turned off notifications about missing keys
  ),
  locales,
});

export default i18nProvider;
`

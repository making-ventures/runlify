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
const i18nProvider = polyglotI18nProvider(locale => {
  switch (locale) {
${languages.filter(lang => lang !== defaultLanguage).map(lang => `
  case '${lang}':
    return import('../i18n/${lang}').then(messages => messages.default);`)}
  case '${defaultLanguage}':
    return defaultMessages;
  default:
    log.error(\`Unknown locale: "\${locale}"\`);
    return defaultMessages;
  }
}, 'ru');

export default i18nProvider;
`

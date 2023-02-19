import { ProjectWideGenerationArgs } from '../../../../../../args'
import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'
import { generatedWarning } from '../../../../../../utils'

export const uiI18nProviderTmpl = (
  { system: { defaultLanguage } }: ProjectWideGenerationArgs,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import polyglotI18nProvider from 'ra-i18n-polyglot';
import defaultMessages from '../i18n/ru';
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
  case 'en':
    return import('../i18n/en').then(messages => messages.default);
  case 'ru':
    return defaultMessages;
  default:
    log.error(\`Unknown locale: "\${locale}"\`);
    return defaultMessages;
  }
}, 'ru');

export default i18nProvider;
`

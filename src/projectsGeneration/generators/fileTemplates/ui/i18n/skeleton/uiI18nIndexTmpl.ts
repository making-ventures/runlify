export const uiI18nIndexTmpl = (lang: string) => `import {TranslationMessages} from 'react-admin';
import englishMessages from 'ra-language-english';
import ${lang}Documents from './${lang}Docs';
import ${lang}Catalogs from './${lang}Catalogs';
import ${lang}InfoRegistries from './${lang}InfoRegistries';
import ${lang}SumRegistries from './${lang}SumRegistries';
import ${lang}Reports from './${lang}Reports';
import ${lang}Validation from './${lang}Validation';
import {DeepPartial} from 'utility-types';
import * as R from 'ramda';

const translationMessages: DeepPartial<TranslationMessages> = {
  app: {
    // Rename or remove this key once you have your own translation for
    // 'app.insufficientPermissions' in every language you generate.
    insufficientPermissions: 'Insufficient permissions',
  },
  validation: ${lang}Validation,
  reports: ${lang}Reports,
  documents: ${lang}Documents,
  catalogs: ${lang}Catalogs,
  infoRegistries: ${lang}InfoRegistries,
  sumRegistries: ${lang}SumRegistries,
  entities: {
    ...${lang}Documents,
    ...${lang}Catalogs,
    ...${lang}InfoRegistries,
    ...${lang}SumRegistries,
  },
};

export default R.mergeDeepRight(englishMessages, translationMessages);
`

export default uiI18nIndexTmpl

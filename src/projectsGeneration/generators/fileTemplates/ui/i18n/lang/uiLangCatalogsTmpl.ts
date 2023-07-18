import { ProjectWideGenerationArgs } from '../../../../../args'
import uiTranslationsForServicesOfSavablesTmpl from './uiTranslationsForServicesOfSavablesTmpl'

export const uiTranslationsLangCatalogsTmpl = (
  args: ProjectWideGenerationArgs,
  lang: string
) =>
  uiTranslationsForServicesOfSavablesTmpl(
    args,
    Array.from(args.allCatalogs.values()),
    lang,
    'Catalogs'
  )

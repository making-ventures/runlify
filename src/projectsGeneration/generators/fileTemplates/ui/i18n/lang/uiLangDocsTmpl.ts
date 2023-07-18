import { ProjectWideGenerationArgs } from '../../../../../args'
import uiTranslationsForServicesOfSavablesTmpl from './uiTranslationsForServicesOfSavablesTmpl'

export const uiTranslationsLangDocsTmpl = (
  args: ProjectWideGenerationArgs,
  lang: string
) =>
  uiTranslationsForServicesOfSavablesTmpl(
    args,
    Array.from(args.allDocuments.values()),
    lang,
    'Documents'
  )

import { ProjectWideGenerationArgs } from '../../../../../args'
import uiTranslationsForServicesOfSavablesTmpl from './uiTranslationsForServicesOfSavablesTmpl'

export const uiTranslationsLangInfoRegistriesTmpl = (
  args: ProjectWideGenerationArgs,
  lang: string
) =>
  uiTranslationsForServicesOfSavablesTmpl(
    args,
    Array.from(args.allInfoRegistries.values()),
    lang,
    'InfoRegistries'
  )

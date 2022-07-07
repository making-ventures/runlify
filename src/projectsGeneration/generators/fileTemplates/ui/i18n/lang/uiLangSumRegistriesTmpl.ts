import { ProjectWideGenerationArgs } from '../../../../../args'
import uiTranslationsForServicesOfSavablesTmpl from './uiTranslationsForServicesOfSavablesTmpl'

export const uiTranslationsLangSumRegistriesTmpl = (
  args: ProjectWideGenerationArgs,
  lang: string
) =>
  uiTranslationsForServicesOfSavablesTmpl(
    args,
    Array.from(args.allSumRegistries.values()),
    lang,
    'SumRegistries'
  )

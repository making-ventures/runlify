import { ProjectWideGenerationArgs } from '../../../../../args'
import uiTranslationsLangTmpl from './uiTranslationsLangTmpl'

export const uiTranslationsLangReportsTmpl = (
  args: ProjectWideGenerationArgs,
  lang: string
) => uiTranslationsLangTmpl(args, args.system.reports, lang, 'Reports')

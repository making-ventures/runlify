import {FileCreator} from '../../types'
import {uiTranslationsLangDocsTmpl} from '../../../generators/fileTemplates/ui/i18n/lang/uiLangDocsTmpl'
import {uiTranslationsLangReportsTmpl} from '../../../generators/fileTemplates/ui/i18n/lang/uiLangReportsTmpl'
import {uiTranslationsLangCatalogsTmpl} from '../../../generators/fileTemplates/ui/i18n/lang/uiLangCatalogsTmpl'
import {uiTranslationsLangInfoRegistriesTmpl} from '../../../generators/fileTemplates/ui/i18n/lang/uiLangInfoRegistriesTmpl'
import {uiTranslationsLangSumRegistriesTmpl} from '../../../generators/fileTemplates/ui/i18n/lang/uiLangSumRegistriesTmpl'
import {ProjectWideGenerationArgs} from '../../../args'
import {addWarnings} from '../../fileHandlers'
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../../builders/generationPaths'

const resolveUiI18nPath = (
  args: ProjectWideGenerationArgs,
  category: GenerationPathCategory,
  langId: string,
) =>
  resolveGenerationPath({
    category,
    detachedBackProject: args.options.detachedBackProject,
    detachedUiProject: args.options.detachedUiProject,
    pathsConfig: args.system.generationPaths,
    vars: {langId},
  })

const generateFrontSrcEntityTranslationsDocs = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    fileCreator.create(
      resolveUiI18nPath(args, GenerationPathCategory.UiI18nDocs, lang.id),
      uiTranslationsLangDocsTmpl(args, lang.id),
      addWarnings({options: args.options})
    )
  }
}

const generateFrontSrcEntityTranslationsCatalogs = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    fileCreator.create(
      resolveUiI18nPath(args, GenerationPathCategory.UiI18nCatalogs, lang.id),
      uiTranslationsLangCatalogsTmpl(args, lang.id),
      addWarnings({options: args.options})
    )
  }
}

const generateFrontSrcEntityTranslationsInfoRegistries = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    fileCreator.create(
      resolveUiI18nPath(args, GenerationPathCategory.UiI18nInfoRegistries, lang.id),
      uiTranslationsLangInfoRegistriesTmpl(args, lang.id),
      addWarnings({options: args.options})
    )
  }
}

const generateFrontSrcEntityTranslationsSumRegistries = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    fileCreator.create(
      resolveUiI18nPath(args, GenerationPathCategory.UiI18nSumRegistries, lang.id),
      uiTranslationsLangSumRegistriesTmpl(args, lang.id),
      addWarnings({options: args.options})
    )
  }
}

const generateFrontSrcEntityTranslationsReports = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    fileCreator.create(
      resolveUiI18nPath(args, GenerationPathCategory.UiI18nReports, lang.id),
      uiTranslationsLangReportsTmpl(args, lang.id),
      addWarnings({options: args.options})
    )
  }
}

const generateFrontSrcTranslations = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  generateFrontSrcEntityTranslationsDocs(fileCreator, args);
  generateFrontSrcEntityTranslationsCatalogs(fileCreator, args);
  generateFrontSrcEntityTranslationsSumRegistries(fileCreator, args);
  generateFrontSrcEntityTranslationsInfoRegistries(fileCreator, args);
  generateFrontSrcEntityTranslationsReports(fileCreator, args);
}

export default generateFrontSrcTranslations;

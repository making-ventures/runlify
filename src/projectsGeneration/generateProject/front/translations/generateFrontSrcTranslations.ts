import { FileCreator } from '../../types'
import { uiTranslationsLangDocsTmpl } from '../../../generators/fileTemplates/ui/i18n/lang/uiLangDocsTmpl'
import { uiTranslationsLangReportsTmpl } from '../../../generators/fileTemplates/ui/i18n/lang/uiLangReportsTmpl'
import { uiTranslationsLangCatalogsTmpl } from '../../../generators/fileTemplates/ui/i18n/lang/uiLangCatalogsTmpl'
import { uiTranslationsLangInfoRegistriesTmpl } from '../../../generators/fileTemplates/ui/i18n/lang/uiLangInfoRegistriesTmpl'
import { uiTranslationsLangSumRegistriesTmpl } from '../../../generators/fileTemplates/ui/i18n/lang/uiLangSumRegistriesTmpl'
import { uiI18nTypesTmpl } from '../../../generators/fileTemplates/ui/i18n/skeleton/uiI18nTypesTmpl'
import { uiI18nValidationTmpl } from '../../../generators/fileTemplates/ui/i18n/skeleton/uiI18nValidationTmpl'
import { uiI18nIndexTmpl } from '../../../generators/fileTemplates/ui/i18n/skeleton/uiI18nIndexTmpl'
import { ProjectWideGenerationArgs } from '../../../args'
import { join } from 'path'
import {
  addWarnings,
  addGeneratedOnceNotice,
  disableEslintForCode,
} from '../../fileHandlers'
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
    vars: { langId },
  })

const generateFrontSrcEntityTranslationsDocs = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    fileCreator.create(
      resolveUiI18nPath(args, GenerationPathCategory.UiI18nDocs, lang.id),
      uiTranslationsLangDocsTmpl(args, lang.id),
      addWarnings({ options: args.options }),
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
      addWarnings({ options: args.options }),
    )
  }
}

const generateFrontSrcEntityTranslationsInfoRegistries = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    fileCreator.create(
      resolveUiI18nPath(
        args,
        GenerationPathCategory.UiI18nInfoRegistries,
        lang.id,
      ),
      uiTranslationsLangInfoRegistriesTmpl(args, lang.id),
      addWarnings({ options: args.options }),
    )
  }
}

const generateFrontSrcEntityTranslationsSumRegistries = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    fileCreator.create(
      resolveUiI18nPath(
        args,
        GenerationPathCategory.UiI18nSumRegistries,
        lang.id,
      ),
      uiTranslationsLangSumRegistriesTmpl(args, lang.id),
      addWarnings({ options: args.options }),
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
      addWarnings({ options: args.options }),
    )
  }
}

const generateFrontSrcEntityTranslationsTypes = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(args.options.detachedUiProject, 'src/i18n/types.ts')

  fileCreator.createIfNotExists(filePath, uiI18nTypesTmpl(), [
    addGeneratedOnceNotice,
    disableEslintForCode,
  ])
}

const generateFrontSrcEntityTranslationsValidation = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Validation.ts`,
    )

    fileCreator.createIfNotExists(filePath, uiI18nValidationTmpl(lang.id), [
      addGeneratedOnceNotice,
      disableEslintForCode,
    ])
  }
}

const generateFrontSrcEntityTranslationsIndex = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/index.ts`,
    )

    fileCreator.createIfNotExists(filePath, uiI18nIndexTmpl(lang.id), [
      addGeneratedOnceNotice,
      disableEslintForCode,
    ])
  }
}

const generateFrontSrcTranslations = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  generateFrontSrcEntityTranslationsDocs(fileCreator, args)
  generateFrontSrcEntityTranslationsCatalogs(fileCreator, args)
  generateFrontSrcEntityTranslationsSumRegistries(fileCreator, args)
  generateFrontSrcEntityTranslationsInfoRegistries(fileCreator, args)
  generateFrontSrcEntityTranslationsReports(fileCreator, args)
  generateFrontSrcEntityTranslationsTypes(fileCreator, args)
  generateFrontSrcEntityTranslationsValidation(fileCreator, args)
  generateFrontSrcEntityTranslationsIndex(fileCreator, args)
}

export default generateFrontSrcTranslations

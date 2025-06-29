import {join} from 'path'
import {FileCreator} from '../../types'
import {uiTranslationsLangDocsTmpl} from '../../../generators/fileTemplates/ui/i18n/lang/uiLangDocsTmpl'
import {uiTranslationsLangReportsTmpl} from '../../../generators/fileTemplates/ui/i18n/lang/uiLangReportsTmpl'
import {uiTranslationsLangCatalogsTmpl} from '../../../generators/fileTemplates/ui/i18n/lang/uiLangCatalogsTmpl'
import {uiTranslationsLangInfoRegistriesTmpl} from '../../../generators/fileTemplates/ui/i18n/lang/uiLangInfoRegistriesTmpl'
import {uiTranslationsLangSumRegistriesTmpl} from '../../../generators/fileTemplates/ui/i18n/lang/uiLangSumRegistriesTmpl'
import {ProjectWideGenerationArgs} from '../../../args'

const generateFrontSrcEntityTranslationsDocs = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Docs.ts`
    )

    fileCreator.create(filePath, uiTranslationsLangDocsTmpl(args, lang.id))
  }
}

const generateFrontSrcEntityTranslationsCatalogs = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Catalogs.ts`
    )

    fileCreator.create(filePath, uiTranslationsLangCatalogsTmpl(args, lang.id))
  }
}

const generateFrontSrcEntityTranslationsInfoRegistries = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}InfoRegistries.ts`
    )

    fileCreator.create(filePath, uiTranslationsLangInfoRegistriesTmpl(args, lang.id))
  }
}

const generateFrontSrcEntityTranslationsSumRegistries = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}SumRegistries.ts`
    )

    fileCreator.create(filePath, uiTranslationsLangSumRegistriesTmpl(args, lang.id))
  }
}

const generateFrontSrcEntityTranslationsReports = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  for (const lang of args.system.languages) {
    const filePath = join(
      args.options.detachedUiProject,
      `src/i18n/${lang.id}/${lang.id}Reports.ts`
    )

    fileCreator.create(filePath, uiTranslationsLangReportsTmpl(args, lang.id))
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

import * as R from 'ramda'
import {BaseEntity, PreviewFeature} from './buildedTypes'

// * у каких ролей есть полный доступ к сущности
// * Какие есть воркеры, какие у них есть джобы, с какой периодичностью запускаются, какие методы используют
// * Какие методы можно запускать через очередь, какие воркеры за это отвечают
// * У каких сервисов есть какие доп методы
// * У каких сервисов какие есть мапперы, из какой модели а какую
// * Отображение карточки, списка, фильтров

// * Какие есть интеграционные клиенты
// * Какие есть рест апи

class BaseBuilder {
  defaultLanguage: string
  name: string
  title: Record<string, {singular: string}> = {}
  needFor: Record<string, string> = {}
  materialUiIcon = 'Brightness1Outlined'
  previewFeatures: PreviewFeature[] = []

  constructor(name: string, defaultLanguage: string, title?: {singular?: string}) {
    this.defaultLanguage = defaultLanguage
    this.name = name
    this.setName(name)
    this.setTitle({singular: title?.singular ?? name})
  }

  build (): BaseEntity {
    return R.pick<BaseBuilder, keyof BaseBuilder>(['name', 'title', 'needFor', 'materialUiIcon', 'previewFeatures'], this);
  }

  setName(name: string) {
    this.name = name

    return this
  }

  setNeedFor(needFor: string, language?: string) {
    const resultedLangiage = language ? language : this.defaultLanguage
    this.needFor[resultedLangiage] = needFor

    return this
  }

  setTitle(title: {singular: string}, language?: string) {
    const resultedLangiage = language ? language : this.defaultLanguage
    this.title[resultedLangiage] = title

    return this
  }

  setTitles(title: Record<string, {singular: string, plural: string}>) {
    this.title = R.fromPairs(
      R.toPairs(title).map(([key, value]) => [
        key,
        {
          singular: value.singular.replaceAll("'", "\\'"),
          plural: value.plural.replaceAll("'", "\\'"),
        },
      ])
    )

    return this
  }

  setMaterialUiIcon(materialUiIcon: string) {
    // The name is interpolated into `import … from '@mui/icons-material/<name>'`, so only allow
    // an icon-shaped identifier here. Whether the icon exists is checked on regen against the
    // UI project's installed @mui/icons-material (see validateMaterialUiIcons).
    if (!/^[A-Z][A-Za-z0-9]*$/.test(materialUiIcon)) {
      throw new Error(`"${materialUiIcon}" is not a valid Material UI icon name (expected PascalCase, e.g. "HelpOutlined")`)
    }

    this.materialUiIcon = materialUiIcon

    return this
  }

  setPreviewFeature(
    previewFeatures: PreviewFeature,
  ) {
    this.previewFeatures.push(previewFeatures)

    return this;
  }
}

export default BaseBuilder

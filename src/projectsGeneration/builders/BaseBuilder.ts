import * as R from 'ramda'
import materialUiIcons from './materialUiIcons'
import { BaseEntity, PreviewFeature } from './buildedTypes'

class BaseBuilder {
  defaultLanguage: string
  name = 'notSet'
  title: Record<string, {singular: string}> = {}
  needFor: Record<string, string> = {}
  materialUiIcon = 'Brightness1Outlined'
  previewFeatures: PreviewFeature[] = []

  constructor(name: string, defaultLanguage: string, title?: {singular?: string}) {
    this.defaultLanguage = defaultLanguage
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
    if (!materialUiIcons.includes(materialUiIcon)) {
      throw new Error(`THere is no "${materialUiIcon}" material ui icon`)
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

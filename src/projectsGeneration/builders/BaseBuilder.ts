import * as R from 'ramda'
import materialUiIcons from './materialUiIcons'

class BaseBuilder {
  defaultLanguage: string
  name = 'notSet'
  title: Record<string, string> = {}
  needFor: Record<string, string> = {}
  materialUiIcon = 'Brightness1Outlined'

  constructor(name: string, defaultLanguage: string, title?: string) {
    this.defaultLanguage = defaultLanguage
    this.setName(name)
    this.setTitle(title ? title : name)
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

  setTitle(title: string, language?: string) {
    const resultedLangiage = language ? language : this.defaultLanguage
    this.title[resultedLangiage] = title

    return this
  }

  setTitles(title: Record<string, string>) {
    this.title = R.fromPairs(
      R.toPairs(title).map(([key, value]) => [
        key,
        value.replaceAll("'", "\\'"),
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
}

export default BaseBuilder

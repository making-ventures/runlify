import SystemMetaBuilder from '../builders/SystemMetaBuilder'
import CatalogBuilder from '../builders/CatalogBuilder'

const name = 'files'

export const addFilesCatalog = (system: SystemMetaBuilder): CatalogBuilder => {
  const files = system.addCatalog(name)
  files.setTitles({
    en: {singular: 'File', plural: 'Files'},
    ru: {singular: 'Файл', plural: 'Файлы'},
  })
  files.addField('originalName', undefined, {isTitleField: true}).setType('string').setRequired()
  files.addField('url').setType('string').setRequired()
  files.addField('mimetype').setType('string').setRequired() // contentType
  files.addField('s3Key').setType('string').setRequired()
  files.addField('eTag').setType('string').setRequired()

  return files
}

export const getFilesCatalog = (system: SystemMetaBuilder): CatalogBuilder => {
  const fileCatalog = system.catalogs.find(
    (catalog) => catalog.entity.name === name
  )?.entity

  if (!fileCatalog) {
    return addFilesCatalog(system)
  }

  return fileCatalog
}

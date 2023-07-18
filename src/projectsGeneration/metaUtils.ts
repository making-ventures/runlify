import {
  Entity,
  Field,
  IdField,
  LinkField,
  ScalarField,
} from './builders/buildedTypes'

export const getLinkFields = (entity: Entity) =>
  entity.fields.filter((f) => f.category === 'link') as LinkField[]

export const getFieldByName = (entity: Entity, name: string) => {
  const field = entity.fields.find((f) => f.name === name)

  if (!field) {
    throw new Error(`There is no "${name}" field in "${entity.name}" entity`)
  }

  return field
}

export const getKeyField = (entity: Entity) => {
  const field = entity.fields.find((f) => f.name === entity.keyField)

  if (!field) {
    throw new Error(
      `There is no "${entity.keyField}" field in "${entity.name}" entity`
    )
  }

  return field as IdField
}

export const getTitleField = (entity: Entity) => {
  const field = entity.fields.find((f) => f.name === entity.titleField)

  if (!field) {
    throw new Error(
      `There is no "${entity.titleField}" field in "${entity.name}" entity`
    )
  }

  return field as ScalarField
}

export const isImageFileRef = (f: Field) =>
  'fileType' in f && f.fileType === 'image';

export const isMarkdownField = (f: Field) => f.type === 'string' && 'stringType' in f && f.stringType === 'markdown';

export const isMultilineField = (f: Field) => f.type === 'string' && 'stringType' in f && f.stringType === 'multiline';

export const isRequiredField = (f: Field) => f.required;

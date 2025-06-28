import CatalogBuilder from './CatalogBuilder'
import {fieldTypeToTsType} from '../generators/fieldTypeToTsType'
import {TsTypes} from './buildedTypes'

export const tsFilterFields = (entity: CatalogBuilder): string => {
  const filterField: Array<{ name: string; type: TsTypes }> = []

  filterField.push({ name: 'q', type: TsTypes.String })

  for (const field of entity.getFileds()) {
    if (!field.hidden) {
      filterField.push({
        name: field.name,
        type: fieldTypeToTsType(field.type),
      })

      if (field.type === 'datetime') {
        filterField.push({
          name: `${field.name}_lte`,
          type: fieldTypeToTsType(field.type),
        })
        filterField.push({
          name: `${field.name}_gte`,
          type: fieldTypeToTsType(field.type),
        })
        filterField.push({
          name: `${field.name}_lt`,
          type: fieldTypeToTsType(field.type),
        })
        filterField.push({
          name: `${field.name}_gt`,
          type: fieldTypeToTsType(field.type),
        })
      }
    }
  }

  return filterField.map((fild) => `${fild.name}: ${fild.type};`).join('\n')
}

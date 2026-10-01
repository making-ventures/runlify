import {plural, singular} from 'pluralize'
import {pascalSingular} from '../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../args'
import {Entity, Field} from '../../../../../builders/buildedTypes'
import {LinkedEntities} from '../../../../../types'
import {isImageFileRef, isMarkdownField} from '../../../../../metaUtils'

/**
 * Зеркало типов из шаблона `descriptorTypes.ts` (см. `uiDescriptorTypesTmpl`).
 * Держать синхронно: `descriptorTypes.spec.ts` сверяет наборы ключей.
 */
export type EntityPageType = 'catalog' | 'document' | 'infoRegistry' | 'sumRegistry'
export type DescriptorFieldType = 'string' | 'int' | 'bigint' | 'float' | 'bool' | 'datetime' | 'date'
export type DescriptorFilterOp =
  | 'equal'
  | 'defined'
  | 'not_defined'
  | 'in'
  | 'not_in'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'

export interface DescriptorField {
  name: string
  type: DescriptorFieldType
  category: 'scalar' | 'link' | 'id'
  labelKey: string
  hidden: boolean
  required: boolean
  showInList: boolean
  showInShow: boolean
  showInFilter: boolean
  filters: DescriptorFilterOp[]
  stringType?: 'plain' | 'multiline' | 'markdown' | 'number' | 'richEdit' | 'json'
  numberType?: 'base' | 'money'
  link?: {
    entity: string
    isImage: boolean
    sort: {field: string; order: 'ASC' | 'DESC'}
    permissions: {all: string; get: string}
  }
}

export interface DescriptorFilterField {
  name: string
  hidden: boolean
  alwaysOn: boolean
}

export interface DescriptorDependencyTab {
  ownerEntity: string
  ownerType: EntityPageType
  fromField: string
  path: string
  labelKey: string
  permissions: {get: string}
  fields: DescriptorField[]
}

export interface EntityDescriptorData {
  name: string
  type: EntityPageType
  names: {singular: string; pascalSingular: string}
  i18n: {titlePlural: string; titleSingular: string}
  sort: {field: string; order: 'ASC' | 'DESC'}
  removableByUser: boolean
  updatableByUser: boolean
  exportableByUser: boolean
  hasSearch: boolean
  registrarDepended: boolean
  registries: Array<{name: string; type: 'infoRegistry' | 'sumRegistry'}>
  permissions: {get: string; update: string; delete: string; all: string}
  filterFields: DescriptorFilterField[]
  fields: DescriptorField[]
  dependencyTabs: DescriptorDependencyTab[]
}

/** Тот же ключ лейбла, что и у `getFieldLabel` (`getShowComponent.ts`). */
const getFieldLabelKey = (entity: Entity, field: Field) =>
  `${plural(entity.type)}.${entity.name}.fields.${field.name}`

const buildDescriptorField = (
  entity: Entity,
  field: Field,
  allEntities: Map<string, Entity>,
): DescriptorField => {
  const result: DescriptorField = {
    name: field.name,
    type: field.type as DescriptorFieldType,
    category: field.category,
    labelKey: getFieldLabelKey(entity, field),
    hidden: !!field.hidden,
    required: field.required,
    showInList: field.showInList,
    showInShow: field.showInShow,
    showInFilter: field.showInFilter,
    filters: [...field.filters] as DescriptorFilterOp[],
  }

  if ('stringType' in field && field.stringType) {
    result.stringType = field.stringType as DescriptorField['stringType']
  }

  if ('numberType' in field && field.numberType) {
    result.numberType = field.numberType as DescriptorField['numberType']
  }

  if (field.category === 'link') {
    const linkedEntity = allEntities.get(field.externalEntity)

    if (!linkedEntity) {
      throw new Error(
        `There is no "${field.externalEntity}" entity, linked from "${entity.name}.${field.name}"`,
      )
    }

    result.link = {
      entity: field.externalEntity,
      isImage: isImageFileRef(field),
      sort: {field: linkedEntity.sortField, order: linkedEntity.sortOrder},
      permissions: {
        all: `${field.externalEntity}.all`,
        get: `${field.externalEntity}.get`,
      },
    }
  }

  return result
}

/** Копия фильтра `DefaultEntityShow` по `forms.show.ignoredLinkedEntities`. */
const getDependencyLinks = (entity: Entity, toLinks: LinkedEntities[]): LinkedEntities[] => {
  const ignoredLinkedEntitiesFull = entity.forms.show.ignoredLinkedEntities
    .filter((e) => !e.field)
    .map((e) => e.entity)
  const ignoredLinkedEntitiesByFormField = entity.forms.show.ignoredLinkedEntities.filter(
    (e) => e.field !== undefined,
  )

  return toLinks
    .filter((l) => !ignoredLinkedEntitiesFull.includes(l.entityOwnerName))
    .filter(
      (l) =>
        !ignoredLinkedEntitiesByFormField.some(
          (i) => i.entity === l.entityOwnerName && i.field === l.fromField.name,
        ),
    )
}

const buildDependencyTab = (
  ownerEntity: Entity,
  link: LinkedEntities,
  allEntities: Map<string, Entity>,
): DescriptorDependencyTab => ({
  ownerEntity: ownerEntity.name,
  ownerType: ownerEntity.type,
  fromField: link.fromField.name,
  path: `${ownerEntity.name}-${link.fromField.name}`,
  labelKey: `${plural(ownerEntity.type)}.${ownerEntity.name}.title.plural`,
  permissions: {get: `${ownerEntity.name}.get`},
  fields: ownerEntity.fields
    .filter((f) => !f.hidden)
    .filter((f) => !isMarkdownField(f))
    .map((f) => buildDescriptorField(ownerEntity, f, allEntities)),
})

const buildRegistries = (
  entity: Entity,
  allEntities: Map<string, Entity>,
): EntityDescriptorData['registries'] => {
  if (entity.type !== 'document') {
    return []
  }

  return entity.registries.map((name) => {
    const registry = allEntities.get(name)

    if (!registry || (registry.type !== 'infoRegistry' && registry.type !== 'sumRegistry')) {
      throw new Error(
        `There is no "${name}" registry of "${entity.name}" document`,
      )
    }

    return {name, type: registry.type}
  })
}

/**
 * Данные дескриптора сущности (режим `uiPagesMode: 'descriptor'`).
 * Чистая функция: по мете сущности отдаёт JSON-сериализуемую структуру `EntityDescriptorData`.
 */
export const buildEntityDescriptorData = ({
  allEntities,
  entity,
  toLinks,
}: EntityWideGenerationArgs): EntityDescriptorData => {
  if (entity.allowedToChange) {
    throw new Error(
      `Entity "${entity.name}" has "allowedToChange" and cannot be generated in the "descriptor" ui pages mode`,
    )
  }

  const hasSearch =
    entity.type === 'catalog' ||
    entity.type === 'document' ||
    (entity.type === 'infoRegistry' && entity.searchEnabled)

  const registrarDepended =
    ['infoRegistry', 'sumRegistry'].includes(entity.type) &&
    'registrarDepended' in entity &&
    entity.registrarDepended

  return {
    name: entity.name,
    type: entity.type,
    names: {
      singular: singular(entity.name),
      pascalSingular: pascalSingular(entity.name),
    },
    i18n: {
      titlePlural: `${plural(entity.type)}.${entity.name}.title.plural`,
      titleSingular: `${plural(entity.type)}.${entity.name}.title.singular`,
    },
    sort: {field: entity.sortField, order: entity.sortOrder},
    removableByUser: entity.removableByUser,
    updatableByUser: entity.updatableByUser,
    exportableByUser: entity.exportableByUser,
    hasSearch,
    registrarDepended,
    registries: buildRegistries(entity, allEntities),
    permissions: {
      get: `${entity.name}.get`,
      update: `${entity.name}.update`,
      delete: `${entity.name}.delete`,
      all: `${entity.name}.all`,
    },
    filterFields: entity.forms.list.filter.fields.map((f) => ({
      name: f.name,
      hidden: f.hidden,
      alwaysOn: f.alwaysOn,
    })),
    fields: entity.fields.map((f) => buildDescriptorField(entity, f, allEntities)),
    dependencyTabs: getDependencyLinks(entity, toLinks).map((link) => {
      const ownerEntity = allEntities.get(link.entityOwnerName)

      if (!ownerEntity) {
        throw new Error(`The is no "${link.entityOwnerName}" entity`)
      }

      return buildDependencyTab(ownerEntity, link, allEntities)
    }),
  }
}

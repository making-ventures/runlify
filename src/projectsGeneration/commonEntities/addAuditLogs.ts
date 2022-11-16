import SystemMetaBuilder from '../builders/SystemMetaBuilder'

const addAuditLogs = (system: SystemMetaBuilder) => {
  // auditLogActionTypes
  const auditLogActionTypes = system.addCatalog('auditLogActionTypes')
  auditLogActionTypes.setTitles({
    en: 'Audit action types',
    ru: 'Типы событий аудита',
  })
  auditLogActionTypes.setNeedFor('Учета типов событий аудита')
  auditLogActionTypes.getKey().setType('string')
  auditLogActionTypes
    .addField('title', undefined, { isTitleField: true })
    .setType('string')
  auditLogActionTypes.setAuditable(false)
  auditLogActionTypes.addPredefinedElements([
    {
      id: 'create',
      title: 'Создание сущности',
    },
    {
      id: 'update',
      title: 'Изменение сущности',
    },
    {
      id: 'delete',
      title: 'Удаление сущности',
    },
  ])

  // auditLogs
  const auditLogs = system.addCatalog('auditLogs')
  auditLogs.setTitles({
    en: 'Audit',
    ru: 'Аудит',
  })
  auditLogs.setNeedFor('Аудит системы')
  auditLogs.addField('date').setType('datetime').setRequired()
  auditLogs
    .addField('title', undefined, { isTitleField: true })
    .setType('string')
    .setRequired()
  auditLogs.addField('success').setType('bool') // make required
  auditLogs.addField('error').setType('string')

  auditLogs
    .addLinkField('entities', 'entityTypeId', 'Сущность')
    .setType('string')
    .setRequired()
  auditLogs.addField('entityId', 'ID сущности').setType('string').setRequired()
  auditLogs
    .addLinkField('auditLogActionTypes', 'actionTypeId', 'Тип операции')
    .setType('string')
    .setRequired()
  auditLogs.addLinkField('managers', 'managerId')
  auditLogs.addLinkField('users', 'userId')
  auditLogs.addField('foreign').setType('bool')
  auditLogs.addField('foreignEntityType').setType('string')
  auditLogs.addField('foreignEntityId').setType('string')
  auditLogs.addField('actionData').setType('string')
  auditLogs.setAuditable(false)

  // entities
  const entities = system.addCatalog('entities')
  entities.setTitles({
    en: 'Entities',
    ru: 'Сущности',
  })
  entities.setNeedFor('Список всех сущностей проекта')
  entities.getKey().setType('string')
  entities
    .addField('title', undefined, { isTitleField: true })
    .setType('string')
  entities.setAuditable(false)
}

export default addAuditLogs

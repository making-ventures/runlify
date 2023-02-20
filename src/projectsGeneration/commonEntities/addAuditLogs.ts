import SystemMetaBuilder from '../builders/SystemMetaBuilder'

const addAuditLogs = (system: SystemMetaBuilder) => {
  // auditLogActionTypes
  const auditLogActionTypes = system.addCatalog('auditLogActionTypes')
  auditLogActionTypes.setTitles({
    en: {
      singular: 'Audit action type',
      plural: 'Audit action types',
    },
    ru: {
      singular: 'Тип события аудита',
      plural: 'Типы событий аудита',
    },
  })
  auditLogActionTypes.setNeedFor('Учета типов событий аудита')
  auditLogActionTypes.getKey().setType('string')
  auditLogActionTypes
    .addField('title', 'Название', {isTitleField: true})
    .setTitles({
      en: 'Title',
      ru: 'Название',
    })
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
    en: {
      singular: 'Audit log',
      plural: 'Audit logs',
    },
    ru: {
      singular: 'Аудит',
      plural: 'Аудит',
    },
  })
  auditLogs.setNeedFor('Аудит системы')
  auditLogs.addField('date', 'Дата')
  .setTitles({
    en: 'Date',
    ru: 'Дата',
  })
  .setType('datetime').setRequired()
  auditLogs
    .addField('title', 'Название', {isTitleField: true})
    .setTitles({
      en: 'Title',
      ru: 'Название',
    })
    .setType('string')
    .setRequired()
  auditLogs.addField('success', 'Успешно')
    .setTitles({
      en: 'Success',
      ru: 'Успешно',
    })
    .setType('bool')
  auditLogs.addField('error', 'Ошибка')
    .setTitles({
      en: 'Error',
      ru: 'Ошибка',
    })
    .setType('string')
  auditLogs
    .addLinkField('entities', 'entityTypeId', 'Сущность')
    .setTitles({
      en: 'Entity type',
      ru: 'Сущность',
    })
    .setType('string')
    .setRequired()
  auditLogs.addField('entityId', 'ID сущности')
    .setTitles({
      en: 'Entity Id',
      ru: 'ID сущности',
    })
    .setType('string')
    .setRequired()
  auditLogs
    .addLinkField('auditLogActionTypes', 'actionTypeId', 'Тип операции')
    .setTitles({
      en: 'Action Type',
      ru: 'Тип операции',
    })
    .setType('string')
    .setRequired()
  auditLogs.addLinkField('managers', 'managerId', 'Менеджер')
    .setTitles({
      en: 'Manager',
      ru: 'Менеджер',
    })
  auditLogs.addField('managerLogin', 'Логин').setType('string');
  auditLogs.addLinkField('users', 'userId', 'Пользователь')
    .setTitles({
      en: 'User',
      ru: 'Пользователь',
    })
  auditLogs.addField('foreign', 'Внешняя сущность')
    .setTitles({
      en: 'Foreign',
      ru: 'Внешняя сущность',
    })
    .setType('bool')
  auditLogs.addField('foreignEntityType', 'Тип внешней сущности ')
    .setTitles({
      en: 'Foreign entity type',
      ru: 'Тип внешней сущности',
    })
    .setType('string')
  auditLogs.addField('foreignEntityId', 'ID внешней сущности')
    .setTitles({
      en: 'Foreign entity Id',
      ru: 'ID внешней сущности',
    })
    .setType('string')
  auditLogs.addField('actionData')
    .setTitles({
      en: 'Action data',
      ru: 'Данные о действии',
    })
    .setType('string')
  auditLogs.setAuditable(false)

  // entities
  const entities = system.addCatalog('entities')
  entities.setTitles({
    en: {
      singular: 'Entity',
      plural: 'Entities',
    },
    ru: {
      singular: 'Сущность',
      plural: 'Сущности',
    },
  })
  entities.setNeedFor('Список всех сущностей проекта')
  entities.getKey().setType('string')
  entities
    .addField('title', 'Название', {isTitleField: true})
    .setTitles({
      en: 'Title',
      ru: 'Название',
    })
    .setType('string')
  entities.setAuditable(false)
}

export default addAuditLogs

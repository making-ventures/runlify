/* eslint-disable max-len */
import SystemMetaBuilder from '../builders/SystemMetaBuilder'

export const addAutogeneration = (system: SystemMetaBuilder) => {
  // autogenerationRules
  const autogenerationRules = system.addCatalog('autogenerationRules')
  autogenerationRules.setTitles({
    en: {
      singular: 'Autogeneration Rule',
      plural: 'Autogeneration Rules',
    },
    ru: {
      singular: 'Правила автогенерации',
      plural: 'Правило автогенерации',
    },
  })
  autogenerationRules.setNeedFor('Правила автогенерации сущностей')
  autogenerationRules.getKey().setType('string')
  autogenerationRules
    .addField('title', undefined, { isTitleField: true })
    .setType('string')
    .setRequired()
    .setTitle('Название правила')
  autogenerationRules
    .addField('version')
    .setType('date')
    .setTitle('Дата последнего изменения правила')
  autogenerationRules
    .addField('originalEntityType')
    .setType('string')
    .setRequired()
    .setTitle('На основе какой сущности производится генерация')
  autogenerationRules
    .addField('generatingEntityType')
    .setType('string')
    .setRequired()
    .setTitle('Какую сущность генерируем')
  autogenerationRules
    .addField('originalEntityFilter')
    .setType('string')
    .setRequired()
    .setTitle(
      'Объект с информацией, как отобрать среди первоначальных сущностей те, по которым следует произвести генерацию'
    )
  autogenerationRules
    .addField('generatingEntityConstructionRules')
    .setType('string')
    .setRequired()
    .setTitle(
      'Объект с информацией, как заполнить поля генерируемой сущности. На основе полей исходной сущности, констант или выражений'
    )
  autogenerationRules
    .addField('ignoreVersionOnHistory')
    .setType('bool')
    .setRequired()
    .setTitle(
      'Нужно ли учитывать версию при поиске сущностей ещё не обработанных правилом'
    )

  // autogenerationHistoryEntries
  const autogenerationHistoryEntries = system.addCatalog(
    'autogenerationHistoryEntries',
  )
  autogenerationHistoryEntries.setTitles({
    en: {
      singular: 'Autogeneration History',
      plural: 'Autogeneration History',
    },
    ru: {
      singular: 'История автогенерации',
      plural: 'Истории автогенерации',
    },
  })
  autogenerationHistoryEntries.setNeedFor(
    'История применения правил автогенерации к сущностям'
  )
  autogenerationHistoryEntries
    .addField('date')
    .setType('datetime')
    .setRequired()
    .setTitle('Дату проверки')
  autogenerationHistoryEntries
    .addField('originalEntityType')
    .setType('string')
    .setRequired()
    .setTitle('Тип сущности, на которой запускалось правило')
  autogenerationHistoryEntries
    .addField('originalEntityId')
    .setType('string')
    .setRequired()
    .setTitle('Идентификатор сущности, на котором запускалось правило')
  autogenerationHistoryEntries
    .addLinkField('autogenerationRules', 'autogenerationRuleId')
    .setType('string')
    .setRequired()
    .setTitle('Правило автогенерации, которое запускалось')
  autogenerationHistoryEntries
    .addField('version')
    .setType('date')
    .setRequired()
    .setTitle('Версия запускаемого правила')
  autogenerationHistoryEntries
    .addField('errorOccurred')
    .setType('bool')
    .setRequired()
    .setTitle('Произошла ли ошибка')
  autogenerationHistoryEntries
    .addField('error')
    .setType('string')
    .setTitle('Текст ошибки')
}

export default addAutogeneration

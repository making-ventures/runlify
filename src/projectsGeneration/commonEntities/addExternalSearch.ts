import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addExternalSearch = (system: SystemMetaBuilder) => {
  // externalSearchTrackings
  const externalSearchTrackings = system.addInfoRegistry('externalSearchTrackings', false, {singular: 'External search tracking', plural: 'External search trackings'});
  externalSearchTrackings.setNeedFor('Данные на основе которых можно понять, какие сущности нужно обновитьво внешней базе для поиска');
  externalSearchTrackings.addDimensionLinkField('entities', 'entityTypeId')
    .setTitles({
      en: 'Entity type',
      ru: 'Тип сущности',
    })
    .setType('string')
    .setRequired();
  externalSearchTrackings.addDimension('entityId')
    .setTitles({
      en: 'Entity',
      ru: 'Сущность',
    })
    .setType('string')
    .setRequired();
  externalSearchTrackings.addResource('lastUpdated')
    .setTitles({
      en: 'Last updated',
      ru: 'Последнее обновление',
    })
    .setType('datetime')
    .setRequired();
  externalSearchTrackings.addResource('lastSynced')
    .setTitles({
      en: 'Last synced',
      ru: 'Последняя синхронизация',
    })
    .setType('datetime')
    .setRequired();
};

export default addExternalSearch;

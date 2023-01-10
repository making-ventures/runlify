import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addExternalSearch = (system: SystemMetaBuilder) => {
  // externalSearchTrackings
  const externalSearchTrackings = system.addInfoRegistry('externalSearchTrackings', false, {singular: 'External search tracking', plural: 'External search trackings'});
  externalSearchTrackings.setNeedFor('Данные на основе которых можно понять, какие сущности нужно обновитьво внешней базе для поиска');
  externalSearchTrackings.addDimensionLinkField('entities', 'entityTypeId').setType('string').setRequired();
  externalSearchTrackings.addDimension('entityId').setType('string').setRequired();
  externalSearchTrackings.addResource('lastUpdated').setType('datetime').setRequired();
  externalSearchTrackings.addResource('lastSynced').setType('datetime').setRequired();
};

export default addExternalSearch;

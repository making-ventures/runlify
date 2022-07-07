import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addAggregateTrackings = (system: SystemMetaBuilder) => {
  // aggregateTrackings
  const aggregateTrackings = system.addInfoRegistry('aggregateTrackings', false, 'Aggregate Trackings');
  aggregateTrackings.setNeedFor('Данные на основе которых можно понять, для каких сущностей нужно пересчитать агрегаты');
  aggregateTrackings.addDimensionLinkField('entities', 'entityTypeId', 'Тип сущности').setType('string').setRequired();
  aggregateTrackings.addDimension('entityId', 'Сущность').setType('string').setRequired();
  aggregateTrackings.addResource('lastAggregatesComputed', 'Агрегаты последний раз вычислены ').setType('datetime').setRequired();
  aggregateTrackings.addResource('lastEntityUpdate', 'Последнее обновление сущности').setType('datetime').setRequired();
  aggregateTrackings.addResource('aggregateVersion', 'Версия агрегата').setType('int').setRequired();
};

export default addAggregateTrackings;

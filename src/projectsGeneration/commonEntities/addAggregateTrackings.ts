import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addAggregateTrackings = (system: SystemMetaBuilder) => {
  // aggregateTrackings
  const aggregateTrackings = system.addInfoRegistry('aggregateTrackings', false, {singular: 'Aggregate Tracking', plural: 'Aggregate Trackings'});
  aggregateTrackings.setNeedFor('Данные на основе которых можно понять, для каких сущностей нужно пересчитать агрегаты');
  aggregateTrackings.addDimensionLinkField('entities', 'entityTypeId', 'Тип сущности').setType('string').setRequired();
  aggregateTrackings.addDimension('entityId', 'Сущность').setType('string').setRequired();
  aggregateTrackings.addResource('lastAggregatesComputed', 'Агрегаты последний раз вычислены ').setType('datetime').setRequired();
  aggregateTrackings.addResource('lastAggregatesScheduled', 'Последний раз было добавлено в очередь на обработку').setType('datetime');
  aggregateTrackings.addResource('lastEntityUpdate', 'Последнее обновление сущности').setType('datetime').setRequired();
  aggregateTrackings.addResource('aggregateVersion', 'Версия агрегата').setType('int').setRequired();
};

export default addAggregateTrackings;

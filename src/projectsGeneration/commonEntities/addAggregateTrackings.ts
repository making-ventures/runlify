import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addAggregateTrackings = (system: SystemMetaBuilder) => {
  // aggregateTrackings
  const aggregateTrackings = system.addInfoRegistry('aggregateTrackings', false);
  aggregateTrackings.setTitles({
    en: {
      singular: 'Aggregate Tracking',
      plural: 'Aggregate Trackings',
    },
    ru: {
      singular: 'Отслеживание агрегата',
      plural: 'Отслеживание агрегатов',
    },
  });
  aggregateTrackings.setNeedFor('Данные на основе которых можно понять, для каких сущностей нужно пересчитать агрегаты');
  aggregateTrackings.addDimensionLinkField('entities', 'entityTypeId')
    .setTitles({
      en: 'Entity type',
      ru: 'Тип сущности',
    })
    .setType('string')
    .setRequired();
  aggregateTrackings.addDimension('entityId')
    .setTitles({
      en: 'Entity',
      ru: 'Сущность',
    })
    .setType('string').setRequired();
  aggregateTrackings.addResource('lastAggregatesComputed')
    .setTitles({
      en: 'Last aggregates computed',
      ru: 'Агрегаты последний раз вычислены',
    })
    .setType('datetime')
    .setRequired();
  aggregateTrackings.addResource('lastAggregatesScheduled')
    .setTitles({
      en: 'Last aggregates scheduled',
      ru: 'Последний раз было добавлено в очередь на обработку',
    })
    .setType('datetime');
  aggregateTrackings.addResource('lastEntityUpdate')
    .setTitles({
      en: 'Last entity update',
      ru: 'Последнее обновление сущности',
    })
    .setType('datetime')
    .setRequired();
  aggregateTrackings.addResource('aggregateVersion')
    .setTitles({
      en: 'Aggregate version',
      ru: 'Версия агрегата',
    })
    .setType('int')
    .setRequired();
};

export default addAggregateTrackings;

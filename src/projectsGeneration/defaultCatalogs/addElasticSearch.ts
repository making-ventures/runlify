import SystemMetaBuilder from '../builders/SystemMetaBuilder';

export const addElasticSearch = (system: SystemMetaBuilder) => {
  const externalSearchFields = system.getExternalSearchFields();

  for (const field of externalSearchFields) {
    if (!field.externalSearchName) {
      continue;
    }

    if (field.getKey().type !== 'string') {
      throw new Error(`Entity ${field.name} with external search have to be with string type in id field`);
    }

    const registrarDepended = field.name === 'spendings';

    const externalSearchTrackings = system.addInfoRegistry(field.externalSearchName, false, {plural: `External ${field.name} search tracking`, singular: `External ${field.name} search tracking`})
    externalSearchTrackings
      .setNeedFor(`Данные на основе которых можно понять, какие ${field.name} нужно обновить во внешней базе для поиска`)
    if (registrarDepended) {
      externalSearchTrackings.addDimensionLinkField('entities', 'registrarTypeId')
        .setTitles({ ru: 'Тип регистратора', en: 'Registrar type' })
        .setType('string')
        .setRequired()
      externalSearchTrackings.addDimension('registrarId')
        .setType('string') // todo: fix
        .setTitles({ ru: 'Ид регистратора', en: 'Registrar id' })
        .setRequired()
      externalSearchTrackings.addDimension('row')
        .setType('int')
        .setRequired()
        .setDefaultDbValue('1')
    } else {
      externalSearchTrackings
        .addDimension('entityId')
        .setTitles({
          en: 'Entity id',
          ru: 'ИД сущности',
        })
        .setType(field.getKey().type)
        .setRequired()
    }
    externalSearchTrackings
      .addResource('lastUpdated')
      .setTitles({
        en: 'Last updated',
        ru: 'Последнее обновление',
      })
      .setType('datetime')
      .setRequired()
    externalSearchTrackings
      .addResource('lastSynced')
      .setTitles({
        en: 'Last synced',
        ru: 'Последняя синхронизация',
      })
      .setType('datetime')
      .setRequired()
  }
}
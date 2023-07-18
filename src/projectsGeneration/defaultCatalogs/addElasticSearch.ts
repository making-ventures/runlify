import SystemMetaBuilder from '../builders/SystemMetaBuilder';

export const addElasticSearch = (system: SystemMetaBuilder) => {
  const externalSearchEntities = system.getExternalSearchEntities();

  for (const externalSearchEntity of externalSearchEntities) {
    if (!externalSearchEntity.externalSearchName) {
      continue;
    }

    if (externalSearchEntity.getKey().type !== 'string') {
      throw new Error(`Entity ${externalSearchEntity.name} with external search have to be with string type in id field`);
    }

    const registrarDepended = externalSearchEntity.name === 'spendings';

    const externalSearchTrackings = system.addInfoRegistry(externalSearchEntity.externalSearchName, false, {plural: `External ${externalSearchEntity.name} search tracking`, singular: `External ${externalSearchEntity.name} search tracking`})
    externalSearchTrackings.setTitles({
      en: {
        singular: `External '${externalSearchEntity.title.en.singular ?? externalSearchEntity.name}' search tracking`,
        plural: `External '${externalSearchEntity.title.en.plural ?? externalSearchEntity.name}' search tracking`,
      },
      ru: {
        singular: `Отслеживание '${externalSearchEntity.title.ru.singular ?? externalSearchEntity.name}' для внешнего поиска`,
        plural: `Отслеживание '${externalSearchEntity.title.ru.plural ?? externalSearchEntity.name}' для внешнего поиска`,
      },
    })
    externalSearchTrackings
      .setNeedFor(`Данные на основе которых можно понять, какие ${externalSearchEntity.title.plural} нужно обновить во внешней базе для поиска`)
    if (externalSearchEntity.sharded) {
      externalSearchTrackings.setSharded();
      externalSearchTrackings.getKey().setType(externalSearchEntity.getKey().type)
    }
    externalSearchTrackings.setIsExternalTable();
    if (registrarDepended) {
      externalSearchTrackings.addDimensionViewLinkField('entities', 'registrarTypeId')
        .setTitles({ ru: 'Тип регистратора', en: 'Registrar type' })
        .setType('string')
        .setRequired()
      externalSearchTrackings.addDimension('registrarId')
        .setType('string') // todo: I will use it from
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
        .setType(externalSearchEntity.getKey().type)
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
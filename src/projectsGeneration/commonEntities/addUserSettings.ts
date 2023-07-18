import SystemMetaBuilder from '../builders/SystemMetaBuilder';
import pluralize from 'pluralize'
import {StringType} from '../builders';

const addUserSettings = (system: SystemMetaBuilder, userTable: string) => {
  const singularUserTable = pluralize(userTable, 1);
  // user settings saving
  const userSettings = system.addCatalog(`${singularUserTable}Settings`);
  userSettings.setTitles({
    en: {
      singular: 'User setting',
      plural: 'User settings',
    },
    ru: {
      singular: 'Настройка пользователя',
      plural: 'Настройки пользователя',
    },
  });
  userSettings.setNeedFor('Используется для сохранения настроек пользователя');
  userSettings.addField('type', 'Тип настройки')
    .setTitles({
      en: 'Setting type',
      ru: 'Тип настройки',
    })
    .setType('string')
    .setRequired();
  userSettings.addField('subtype', 'Подтип настройки')
    .setTitles({
      en: 'Setting subtype',
      ru: 'Подтип настройки',
    })
    .setType('string')
    .setRequired();
  userSettings.addField('data', 'Настройки в формате JSON')
    .setTitles({
      en: 'Setting in JSON type',
      ru: 'Настройки в формате JSON',
    })
    .setType('string')
    .setStringType(StringType.Json)
    .setRequired();
  const singularUserTableId = `${singularUserTable}Id`;
  userSettings.addLinkField(userTable, singularUserTableId, 'Пользователь')
    .setTitles({
      en: 'User',
      ru: 'Пользователь',
    });

  userSettings.addUniqueConstraint(['type', 'subtype', singularUserTableId]);

  return userSettings;
};

export default addUserSettings;

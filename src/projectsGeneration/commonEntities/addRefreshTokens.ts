import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addRefreshTokens = (system: SystemMetaBuilder) => {
  const appRefreshTokens = system.addCatalog('appRefreshTokens', {singular: 'App refresh token', plural: 'App refresh tokens'});
  appRefreshTokens.setNeedFor('Хранилище рефреш токенов для app');
  appRefreshTokens.addField('create')
    .setTitles({
      en: 'Create',
      ru: 'Создать',
    })
    .setType('datetime')
    .setRequired();
  appRefreshTokens.addLinkField('users', 'userId')
    .setTitles({
      en: 'User',
      ru: 'Пользователь',
    })
    .setType('int')
    .setRequired();
  appRefreshTokens.addField('token')
  .setTitles({
    en: 'Token',
    ru: 'Токен',
  })
  .setType('string')
  .setRequired();

  const uiRefreshTokens = system.addCatalog('admRefreshTokens');
  uiRefreshTokens.setTitles({
    en: {
      singular: 'Ui refresh token',
      plural: 'Ui refresh tokens',
    },
    ru: {
      singular: 'UI Токен обновления',
      plural: 'UI Токены обновления',
    },
  });
  uiRefreshTokens.setNeedFor('Хранилище рефреш токенов для админа');
  uiRefreshTokens.addField('create')
    .setTitles({
      en: 'Create',
      ru: 'Создать',
    })
    .setType('datetime')
    .setRequired();
  uiRefreshTokens.addLinkField('managers', 'managerId')
    .setTitles({
      en: 'Manager',
      ru: 'Менеджер',
    })
    .setRequired();
  uiRefreshTokens.addField('token')
  .setTitles({
    en: 'Token',
    ru: 'Токен',
  })
  .setType('string')
  .setRequired();
};

export default addRefreshTokens;

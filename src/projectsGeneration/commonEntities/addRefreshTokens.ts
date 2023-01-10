import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addRefreshTokens = (system: SystemMetaBuilder) => {
  const appRefreshTokens = system.addCatalog('appRefreshTokens', {singular: 'App refresh token', plural: 'App refresh tokens'});
  appRefreshTokens.setNeedFor('Хранилище рефреш токенов для app');
  appRefreshTokens.addField('create').setType('datetime').setRequired();
  appRefreshTokens.addLinkField('users', 'userId').setType('int').setRequired();
  appRefreshTokens.addField('token').setType('string').setRequired();

  const uiRefreshTokens = system.addCatalog('admRefreshTokens', {singular: 'Ui refresh token', plural: 'Ui refresh tokens'});
  uiRefreshTokens.setNeedFor('Хранилище рефреш токенов для админа');
  uiRefreshTokens.addField('create').setType('datetime').setRequired();
  uiRefreshTokens.addLinkField('managers', 'managerId').setRequired();
  uiRefreshTokens.addField('token').setType('string').setRequired();
};

export default addRefreshTokens;

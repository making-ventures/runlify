import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addUsers = (system: SystemMetaBuilder) => {
  // users
  const users = system.addCatalog('users');
  users.setTitles({
    en: {
      singular: 'User',
      plural: 'Users',
    },
    ru: {
      singular: 'Пользовател',
      plural: 'Пользователи',
    },
  });
  users.addField('title', undefined, {isTitleField: true}).setType('string');
  users.addField('lastname').setType('string').setRequired();
  users.addField('firstname').setType('string').setRequired();
  users.addField('email').setType('string').setRequired();
  users.setMultitenancy('optional');

  // appLogins
  const appLogins = system.addCatalog('appLogins');
  appLogins.setTitles({
    en: {
      singular: 'Login of user',
      plural: 'Logins of users',
    },
    ru: {
      singular: 'Логин пользователей',
      plural: 'Логины пользователей',
    },
  });
  appLogins.setNeedFor('Аккаунты (информация по логинам) обычных пользователей (не админов)');
  appLogins.addField('login')
    .setTitles({
      en: 'Login',
      ru: 'Логин',
    })
    .setType('string')
    .setRequired();
  appLogins.addField('passwordHash').setTitles({
      en: 'Password',
      ru: 'Пароль',
    })
    .setType('string')
    .setRequired();
  appLogins.addLinkField('users', 'userId')
    .setTitles({
      en: 'User',
      ru: 'Пользователь',
    })
    .setType('int')
    .setRequired();
  appLogins.addUniqueConstraint(['login']);
};

export default addUsers;

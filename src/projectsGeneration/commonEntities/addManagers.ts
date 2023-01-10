import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addManagers = (system: SystemMetaBuilder) => {
  // managers
  const managers = system.addCatalog('managers');
  managers.setTitles({
    en: {
      singular: 'Manager',
      plural: 'Managers',
    },
    ru: {
      singular: 'Менеджер',
      plural: 'Менеджеры',
    },
  });
  managers.setNeedFor('Менеджерские (административные) аккаунты');
  managers.addField('title', undefined, {isTitleField: true}).setType('string');
  managers.addField('lastName', 'Фамилия').setType('string').setRequired();
  managers.addField('firstName', 'Имя').setType('string').setRequired();
  managers.addLinkField('languages', 'languageId', 'Язык').setType('string');
  managers.addField('email', 'Email').setType('string').setRequired(true);
  managers.addField('phone', 'Телефон').setType('string');
  managers.addImageField('photoId', 'Фото');
  managers.addField('telegramLogin', 'Логин в Telegram').setType('string');
  managers.addLinkField('units', 'unitId', 'Подразделение');
  managers.addField('headOfUnit', 'Глава подразделения').setType('bool').setDefaultValueExpression('false').setRequired();
  managers.addField('active', 'Активный').setType('bool').setDefaultValueExpression('true').setRequired();
  managers.addUniqueConstraint(['email']);
  managers.setMultitenancy('optional', false);

  // managerLogins
  const managerLogins = system.addCatalog('managerLogins');
  managerLogins.setTitles({
    en: {
      singular: 'Manager login',
      plural: 'Manager logins',
    },
    ru: {
      singular: 'Логин менеджера',
      plural: 'Логины менеджеров',
    },
  });
  managerLogins.setNeedFor('Аккаунты (информация по логинам) пользователей бек-офиса (админы, менеджеры)');
  managerLogins.addField('login').setType('string').setRequired();
  managerLogins.addField('passwordHash').setType('string').setRequired();
  managerLogins.addField('emailVerified').setType('bool').setRequired();
  managerLogins.addField('initialPasswordChanged').setType('bool').setRequired();
  managerLogins.addField('locked').setType('bool').setRequired();
  managerLogins.addLinkField('managers', 'managerId').setRequired();
  managerLogins.addUniqueConstraint(['login']);

  // units
  const units = system.addCatalog('units');
  units.setTitles({
    en: {
      singular: 'Unit',
      plural: 'Units',
    },
    ru: {
      singular: 'Подразделение',
      plural: 'Подразделения',
    },
  });
  units.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  units.addLinkField('units', 'parentId').setType('int');
};

export default addManagers;

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
  managers.addField('title', undefined, {isTitleField: true})
    .setTitles({
      en: 'Title',
      ru: 'Название',
    })
    .setType('string');
  managers.addField('lastName', 'Фамилия')
  .setTitles({
      en: 'Lastname',
      ru: 'Фамилия',
    })
    .setType('string')
    .setRequired();
  managers.addField('firstName', 'Имя')
    .setTitles({
      en: 'Firstname',
      ru: 'Имя',
    })
    .setType('string')
    .setRequired();
  managers.addLinkField('languages', 'languageId', 'Язык')
    .setTitles({
      en: 'Language',
      ru: 'Язык',
    })
    .setType('string');
  managers.addField('email', 'Email')
    .setTitles({
      en: 'Email',
      ru: 'Email',
    })
    .setType('string')
    .setRequired(true);
  managers.addField('phone', 'Телефон').setTitles({
      en: 'Phone',
      ru: 'Телефон',
    })
    .setType('string');
  managers.addImageField('photoId', 'Фото');
  managers.addField('telegramLogin', 'Логин в Telegram')
    .setTitles({
      en: 'Telegram login',
      ru: 'Логин в Telegram',
    })
    .setType('string');
  managers.addLinkField('units', 'unitId', 'Подразделение')
  .setTitles({
    en: 'Units',
    ru: 'Подразделение',
  });
  managers.addField('headOfUnit', 'Глава подразделения')
    .setTitles({
      en: 'Head of unit',
      ru: 'Глава подразделения',
    })
    .setType('bool')
    .setDefaultValueExpression('false')
    .setRequired();
  managers.addField('active', 'Активный')
  .setTitles({
      en: 'Active',
      ru: 'Активный',
    })
    .setType('bool')
    .setDefaultValueExpression('true')
    .setRequired();
  managers.addUniqueConstraint(['email']);
  managers.setMultitenancy('optional', false);

  // managerLoginTypes
  const managerLoginTypes = system.addCatalog('managerLoginTypes', {singular: 'Manager login type', plural: 'Manager login types'});
  managerLoginTypes.getKey().setType('string');
  managerLoginTypes.addField('title', undefined, {isTitleField: true}).setTitles({en: 'Title', ru: 'Название'}).setType('string');
  managerLoginTypes.addPredefinedElements([
    {id: 'internal', title: 'Internal'},
    {id: 'oidc', title: 'Open Id Connect'},
  ]);

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
  managerLogins.addLinkField('managerLoginTypes', 'managerLoginTypeId').setTitles({en: 'Login type', ru: 'Тил логина'}).setType('string').setRequired();
  managerLogins.addField('login').setTitles({en: 'Login', ru: 'Логин'}).setType('string').setRequired();
  managerLogins.addField('passwordHash').setTitles({en: 'Password hash', ru: 'Хэш пароля'}).setType('string');
  managerLogins.addField('emailVerified').setTitles({en: 'Email verified', ru: 'Email подтвержден'}).setType('bool');
  managerLogins.addField('locked') .setTitles({en: 'Locked', ru: 'Заблокирован'}).setType('bool').setRequired();
  managerLogins.addLinkField('managers', 'managerId').setTitles({en: 'Managers', ru: 'Менеджеры'}).setRequired();
  managerLogins.addUniqueConstraint(['managerLoginTypeId', 'login']);

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
  units.addField('title', undefined, {isTitleField: true})
    .setTitles({
      en: 'Title',
      ru: 'Название',
    })
    .setType('string')
    .setRequired();
  units.addLinkField('units', 'parentId')
  .setTitles({
      en: 'Parent id',
      ru: 'Родительское подразделение',
    })
    .setType('int');
};

export default addManagers;

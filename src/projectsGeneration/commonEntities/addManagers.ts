import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addManagers = (system: SystemMetaBuilder) => {
  // managers
  const managers = system.addCatalog('managers');
  managers.setTitles({
    en: 'Managers',
    ru: 'Менеджеры',
  });
  managers.setNeedFor('Менеджерские (административные) аккаунты');
  managers.addField('title', undefined, {isTitleField: true}).setType('string');
  managers.addField('lastName').setType('string').setRequired();
  managers.addField('firstName').setType('string').setRequired();
  managers.addLinkField('languages', 'languageId').setType('string');
  managers.addField('email').setType('string').setRequired(true);
  managers.addField('phone').setType('string');
  managers.addField('photo').setType('string');
  managers.addField('telegramLogin').setType('string');
  managers.addLinkField('units', 'unitId');
  managers.addField('headOfUnit').setType('bool').setDefaultValueExpression('false').setRequired();
  managers.addField('active').setType('bool').setDefaultValueExpression('true').setRequired();
  managers.addUniqueConstraint(['email']);
  managers.setMultitenancy('optional', false);

  // managerLogins
  const managerLogins = system.addCatalog('managerLogins');
  managerLogins.setTitles({
    en: 'Manager logins',
    ru: 'Логины менеджеров',
  });
  managerLogins.setNeedFor('Аккаунты (информация по логинам) пользователей бек-офиса (админы, менеджеры)');
  managerLogins.addField('login').setType('string').setRequired();
  managerLogins.addField('passwordHash').setType('string').setRequired();
  managerLogins.addField('role').setType('string').setRequired();
  managerLogins.addField('emailVerified').setType('bool').setRequired();
  managerLogins.addField('initialPasswordChanged').setType('bool').setRequired();
  managerLogins.addField('locked').setType('bool').setRequired();
  managerLogins.addLinkField('managers', 'managerId').setRequired();
  managerLogins.addUniqueConstraint(['login']);

  // units
  const units = system.addCatalog('units', 'Units');
  units.addField('title', undefined, {isTitleField: true}).setType('string');
  units.addLinkField('units', 'parentId').setType('int');
};

export default addManagers;

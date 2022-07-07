import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addRoles = (system: SystemMetaBuilder) => {
  // roles
  const roles = system.addCatalog('roles');
  roles.setTitles({
    en: 'Roles',
    ru: 'Роли',
  });
  roles.setNeedFor('Роли, определющие права на те или иные операции');
  roles.getKey().setType('string');
  roles.addField('title', undefined, {isTitleField: true}).setType('string');
  roles.addField('hasAllPermissions').setType('bool').setRequired();
  roles.addField('allTenantsAvailable').setType('bool').setRequired();
  roles.addPredefinedElements([
    {
      id: 'admin',
      title: 'Админ',
      hasAllPermissions: true,
      allTenantsAvailable: true,
    },
    {
      id: 'manager',
      title: 'Менеджер',
      hasAllPermissions: false,
      allTenantsAvailable: false,
    },
  ]);

  // permissions
  const permissions = system.addCatalog('permissions');
  permissions.setTitles({
    en: 'Permissions',
    ru: 'Разрешения',
  });
  permissions.setNeedFor('Разрешение на совершение той или иной операции');
  permissions.getKey().setType('string');
  permissions.addField('title', undefined, {isTitleField: true}).setType('string');

  // rolesToPermissions
  const rolesToPermissions = system.addManyToManyRelation('rolesToPermissions');
  rolesToPermissions.setTitles({
    en: 'Roles To Permissions',
    ru: 'Разрешения ролей',
  });
  rolesToPermissions.setNeedFor('Соединение, которым в роли наполняются разрешениями на те или иные операции');
  rolesToPermissions.addLinkField('roles', 'roleId').setType('string').setRequired();
  rolesToPermissions.addLinkField('permissions', 'permissionId').setType('string').setRequired();
  rolesToPermissions.addUniqueConstraint(['roleId', 'permissionId']);

  // managersToRoles
  const managersToRoles = system.addManyToManyRelation('managersToRoles');
  managersToRoles.setTitles({
    en: 'Managers To Roles',
    ru: 'Роли менеджеров',
  });
  managersToRoles.setNeedFor('Соединение, которым менеджерам назначаются роли');
  managersToRoles.addLinkField('managers', 'managerId').setRequired();
  managersToRoles.addLinkField('roles', 'roleId').setType('string').setRequired();
  managersToRoles.addUniqueConstraint(['managerId', 'roleId']);

  // managersToPermissions
  const managersToPermissions = system.addManyToManyRelation('managersToPermissions');
  managersToPermissions.setTitles({
    en: 'Managers To Permissions',
    ru: 'Разрешения менеджеров',
  });
  managersToPermissions.setNeedFor('Соединение, которым менеджерам назначаются пермишны в обход ролей');
  managersToPermissions.addLinkField('managers', 'managerId').setRequired();
  managersToPermissions.addLinkField('permissions', 'permissionId').setType('string').setRequired();

  // delegations
  const delegations = system.addManyToManyRelation('delegations', 'Delegations');
  delegations.setTitles({
    en: 'Delegations',
    ru: 'Делегирование',
  });
  delegations.setNeedFor('Делегирование прав между пользователями');
  delegations.addLinkField('managers', 'fromId').setRequired();
  delegations.addLinkField('managers', 'toId').setRequired();
  delegations.addField('expiresAt').setType('date');
  delegations.addField('active').setType('bool').setRequired();
};

export default addRoles;

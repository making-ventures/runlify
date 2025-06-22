import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addRoles = (system: SystemMetaBuilder) => {
  // roles
  const roles = system.addCatalog('roles');
  roles.setCreatableByUser(false);
  roles.setTitles({
    en: {
      singular: 'Role',
      plural: 'Roles',
    },
    ru: {
      singular: 'Роль',
      plural: 'Роли',
    },
  });
  roles.setNeedFor('Роли, определющие права на те или иные операции');
  roles.getKey().setType('string');
  roles.addField('title', 'Название', {isTitleField: true})
    .setTitles({
      en: 'Title',
      ru: 'Название',
    })
    .setType('string');
  roles.addField('hasAllPermissions', 'Доступны все разрешения')
    .setTitles({
      en: 'Has all permissions',
      ru: 'Доступны все разрешения',
    })
    .setType('bool')
    .setRequired();
  roles.addField('allTenantsAvailable', 'Доступны все арендаторы')
  .setTitles({
    en: 'All tenants available',
    ru: 'Доступны все арендаторы',
  })
  .setType('bool')
  .setRequired();
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
    en: {
      singular: 'Permission',
      plural: 'Permissions',
    },
    ru: {
      singular: 'Разрешение',
      plural: 'Разрешения',
    },
  });
  permissions.setNeedFor('Разрешение на совершение той или иной операции');
  permissions.getKey().setType('string');
  permissions.addField('title', undefined, {isTitleField: true})
    .setTitles({
      en: 'Title',
      ru: 'Название',
    })
    .setType('string');

  // rolesToPermissions
  const rolesToPermissions = system.addManyToManyRelation('rolesToPermissions');
  rolesToPermissions.setTitles({
    en: {
      singular: 'Role To Permission',
      plural: 'Roles To Permissions',
    },
    ru: {
      singular: 'Разрешение роли',
      plural: 'Разрешения ролей',
    },
  });
  rolesToPermissions.setNeedFor('Соединение, которым в роли наполняются разрешениями на те или иные операции');
  rolesToPermissions.addLinkField('roles', 'roleId')
  .setTitles({
    en: 'Roles',
    ru: 'Роль',
  })
  .setType('string')
  .setRequired();
  rolesToPermissions.addLinkField('permissions', 'permissionId')
    .setTitles({
      en: 'Permission',
      ru: 'Разрешение',
    })
    .setType('string')
    .setRequired();
  rolesToPermissions.addUniqueConstraint(['roleId', 'permissionId']);

  // managersToRoles
  const managersToRoles = system.addManyToManyRelation('managersToRoles');
  managersToRoles.setTitles({
    en: {
      singular: 'Manager To Role',
      plural: 'Managers To Roles',
    },
    ru: {
      singular: 'Роль менеджера',
      plural: 'Роли менеджеров',
    },
  });
  managersToRoles.setNeedFor('Соединение, которым менеджерам назначаются роли');
  managersToRoles.addLinkField('managers', 'managerId')
    .setTitles({
      en: 'Manager',
      ru: 'Менеджер',
    })
    .setRequired();
  managersToRoles.addLinkField('roles', 'roleId')
  .setTitles({
    en: 'Role',
    ru: 'Роль',
  })
  .setType('string')
  .setRequired();
  managersToRoles.addField('expiresAt')
    .setTitles({
      en: 'Expires at',
      ru: 'Истекает',
    })
    .setType('date');
  managersToRoles.addUniqueConstraint(['managerId', 'roleId', 'expiresAt']);

  // managersToPermissions
  const managersToPermissions = system.addManyToManyRelation('managersToPermissions');
  managersToPermissions.setTitles({
    en: {
      singular: 'Manager To Permission',
      plural: 'Managers To Permissions',
    },
    ru: {
      singular: 'Разрешение менеджера',
      plural: 'Разрешения менеджеров',
    },
  });
  managersToPermissions.setNeedFor('Соединение, которым менеджерам назначаются пермишны в обход ролей');
  managersToPermissions.addLinkField('managers', 'managerId')
  .setTitles({
      en: 'Manager',
      ru: 'Менеджер',
    })
    .setRequired();
  managersToPermissions.addLinkField('permissions', 'permissionId')
    .setTitles({
      en: 'Permission',
      ru: 'Разрешение',
    })
    .setType('string')
    .setRequired();
  managersToPermissions.addField('expiresAt')
    .setTitles({
      en: 'Expires at',
      ru: 'Истекает',
    })
    .setType('date');

  // delegations
  const delegations = system.addManyToManyRelation('delegations');
  delegations.setTitles({
    en: {
      singular: 'Delegation',
      plural: 'Delegations',
    },
    ru: {
      singular: 'Делегирование',
      plural: 'Делегирования',
    },
  });
  delegations.setNeedFor('Делегирование прав между пользователями');
  delegations.addLinkField('managers', 'fromId')
    .setTitles({
      en: 'From',
      ru: 'От',
    })
    .setRequired();
  delegations.addLinkField('managers', 'toId')
    .setTitles({
      en: 'To',
      ru: 'К',
    })
    .setRequired();
  delegations.addField('expiresAt')
    .setTitles({
      en: 'Expires at',
      ru: 'Истекает',
    })
    .setType('date');
  delegations.addField('active')
    .setTitles({
      en: 'Active',
      ru: 'Активно',
    })
    .setType('bool')
    .setRequired();
};

export default addRoles;

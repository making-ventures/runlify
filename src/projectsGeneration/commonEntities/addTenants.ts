import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addTenants = (system: SystemMetaBuilder) => {
  const tenants = system.addCatalog('tenants');
  tenants.setTitles({
    en: {
      singular: 'Tenant',
      plural: 'Tenants',
    },
    ru: {
      singular: 'Тенант',
      plural: 'Тенанты',
    },
  });
  tenants.addField('title', undefined, {isTitleField: true})
    .setTitles({
      en: 'Title',
      ru: 'Название',
    })
    .setType('string');
  tenants.addField('utcOffset')
    .setTitles({
      en: 'UTC offset',
      ru: 'Смещение по UTC',
    })
    .setType('int')
    .setRequired()
    .setDefaultDbValue('0');
};

export default addTenants;

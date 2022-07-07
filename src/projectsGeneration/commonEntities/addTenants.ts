import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addTenants = (system: SystemMetaBuilder) => {
  const tenants = system.addCatalog('tenants');
  tenants.setTitles({
    en: 'Tenants',
    ru: 'Тенанты',
  });
  tenants.addField('title', undefined, {isTitleField: true}).setType('string');
  tenants.addField('utcOffset').setType('int').setRequired().setDefaultDbValue('0');
};

export default addTenants;

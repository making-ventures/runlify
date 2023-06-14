import SystemMetaBuilder from '../builders/SystemMetaBuilder';
import {StringType} from '../builders';

const addConfigurationVariables = (system: SystemMetaBuilder) => {
  // configurationVariables
  const configurationVariables = system.addCatalog(
    'configurationVariables',
    {singular: 'Конфигурационная переменная', plural: 'Конфигурационные переменные'},
  );
  configurationVariables.getKey().setType('string');
  configurationVariables.setSearchEnabled(false);
  configurationVariables.addField('value', 'Значение')
    .setType('string')
    .setStringType(StringType.Json)
    .setRequired();
};

export default addConfigurationVariables;

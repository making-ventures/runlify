import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addMessageTemplates = (system: SystemMetaBuilder) => {
  // messageTypes
  const messageTypes = system.addCatalog('messageTypes');
  messageTypes.setTitles({
    en: 'Message types',
    ru: 'Типы сообщений',
  });
  messageTypes.setNeedFor('Типы сообщений');
  messageTypes.getKey().setType('string');
  messageTypes.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  messageTypes.addField('description').setType('string');
  messageTypes.addPredefinedElements([
    {
      id: 'plain',
      title: 'Plain',
    },
  ]);

  // messageTemplates
  const messageTemplates = system.addCatalog('messageTemplates');
  messageTemplates.setTitles({
    en: 'Message templates',
    ru: 'Шаблоны сообщений',
  });
  messageTemplates.setNeedFor('Шаблоны сообщений');
  messageTemplates.getKey().setType('string');
  messageTemplates.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  messageTemplates.addField('secretData').setType('bool').setRequired();
  messageTemplates.addLinkField('messageTypes', 'messageTypeId').setType('string').setRequired();
};

export default addMessageTemplates;

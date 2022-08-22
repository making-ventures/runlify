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

  // templateStyles
  const templateStyles = system.addCatalog('templateStyles');
  templateStyles.setTitles({
    en: 'Template styles',
    ru: 'Стили шаблонов',
  });
  templateStyles.setNeedFor('Стили шаблонов');
  templateStyles.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  templateStyles.addField('style').setType('string').setRequired();

  // messageTemplates
  const messageTemplates = system.addCatalog('messageTemplates');
  messageTemplates.setTitles({
    en: 'Message templates',
    ru: 'Шаблоны сообщений',
  });
  messageTemplates.setNeedFor('Шаблоны сообщений');
  messageTemplates.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  messageTemplates.addField('secretData').setType('bool').setRequired();
  messageTemplates.addLinkField('messageTypes', 'messageTypeId').setType('string').setRequired();
  messageTemplates.addField('bodyTemplate').setType('string');
  messageTemplates.addField('subjectTemplate').setType('string');
  messageTemplates.addLinkField('templateStyles', 'templateStyleId').setType('int');
};

export default addMessageTemplates;

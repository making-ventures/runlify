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
  messageTemplates.addLinkField('templateStyles', 'templateStyleId').setType('int');

  // messageTemplateLangVariants
  const messageTemplateLangVariants = system.addCatalog('messageTemplateLangVariants');
  messageTemplateLangVariants.setTitles({
    en: 'Message template lang variant',
    ru: 'Языковой вариант шаблона сообщения',
  });
  messageTemplateLangVariants.setNeedFor('Языковой вариант шаблона сообщения');
  messageTemplateLangVariants.addField('subjectTemplate').setType('string').setRequired();
  messageTemplateLangVariants.addField('bodyTemplate').setType('string').setRequired();
  messageTemplateLangVariants.addLinkField('messageTemplates', 'messageTemplateId').setRequired();
  messageTemplateLangVariants.addLinkField('languages', 'languageId').setRequired();
  messageTemplateLangVariants.addField('additionalStyle').setType('string');
  messageTemplateLangVariants.addUniqueConstraint(['messageTemplateId', 'languageId']);
};

export default addMessageTemplates;

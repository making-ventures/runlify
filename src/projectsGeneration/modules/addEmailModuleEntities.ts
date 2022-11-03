import SystemMetaBuilder from '../../projectsGeneration/builders/SystemMetaBuilder';

const addEmailModuleEntities = (system: SystemMetaBuilder) => {
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

  // mailingCampaignStatuses
  const mailingCampaignStatuses = system.addCatalog('mailingCampaignStatuses');
  mailingCampaignStatuses.setTitles({
    en: 'Mailing campaign statuses',
    ru: 'Статусы рассылок',
  });
  mailingCampaignStatuses.setNeedFor('Статусы рассылок');
  mailingCampaignStatuses.getKey().setType('string');
  mailingCampaignStatuses.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  mailingCampaignStatuses.addPredefinedElements([
    {
      id: 'draft',
      title: 'Draft',
    },
    {
      id: 'prearing',
      title: 'Prearing',
    },
    {
      id: 'sending',
      title: 'Sending',
    },
    {
      id: 'finished',
      title: 'Finished',
    },
  ]);

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
  messageTemplateLangVariants.addField('title', undefined, {isTitleField: true}).setType('string');
  messageTemplateLangVariants.addField('subjectTemplate').setType('string').setRequired();
  messageTemplateLangVariants.addField('bodyTemplate').setType('string').setRequired();
  messageTemplateLangVariants.addLinkField('messageTemplates', 'messageTemplateId').setRequired();
  messageTemplateLangVariants.addLinkField('languages', 'languageId').setType('string').setRequired();
  messageTemplateLangVariants.addField('additionalStyle').setType('string');
  messageTemplateLangVariants.addUniqueConstraint(['messageTemplateId', 'languageId']);

  // mailingMessageStatuses
  const mailingMessageStatuses = system.addCatalog('mailingMessageStatuses');
  mailingMessageStatuses.setTitles({
    en: 'Mailing message statuses',
    ru: 'Статусы сообщений массовой рассылки',
  });
  mailingMessageStatuses.getKey().setType('string').setRequired();
  mailingMessageStatuses.addField('title', undefined, {isTitleField: true}).setType('string');
  mailingMessageStatuses.addField('final').setType('bool').setRequired();
  mailingMessageStatuses.addPredefinedElements([
    {id: 'draft', title: 'Draft', final: false},
    {id: 'stopped', title: 'Stopped', final: false},
    {id: 'pending', title: 'Pending', final: false},
    {id: 'sent', title: 'Sent', final: true},
    {id: 'canceled', title: 'Canceled', final: true},
    {id: 'errored', title: 'Errored', final: true},
  ]);

  // mailingTypes
  const mailingTypes = system.addCatalog('mailingTypes');
  mailingTypes.setTitles({
    en: 'Mailing types',
    ru: 'Типы рассылок',
  });
  mailingTypes.getKey().setType('string');
  mailingTypes.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  mailingTypes.addPredefinedElements([
    {id: 'email', title: 'Email'},
  ]);

  // mailingCampaigns
  const mailingCampaigns = system.addCatalog('mailingCampaigns');
  mailingCampaigns.setTitles({
    en: 'Mailing campaigns',
    ru: 'Рассылки',
  });
  mailingCampaigns.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  mailingCampaigns.addLinkField('mailingTypes', 'mailingTypeId').setType('string').setRequired();
  mailingCampaigns.addField('priority').setType('int').setRequired();
  mailingCampaigns.addField('date').setType('date');
  mailingCampaigns.addLinkField('mailingCampaignStatuses', 'mailingCampaignStatusId').setType('string');
  mailingCampaigns.addLinkField('messageTemplates', 'messageTemplateId').setRequired();

  // mailingMessages
  const mailingMessages = system.addCatalog('mailingMessages');
  mailingMessages.setTitles({
    en: 'Mailing messages',
    ru: 'Сообщения рассылки',
  });
  mailingMessages.addLinkField('mailingCampaigns', 'mailingCampaignId').setRequired();
  mailingMessages.addLinkField('messageTemplates', 'templateId').setType('int').setRequired();
  mailingMessages.addLinkField('languages', 'languageId').setType('string').setRequired();
  mailingMessages.addField('to').setType('string').setRequired();
  mailingMessages.addField('locals').setType('string').setRequired();
  mailingMessages.addField('localsHash').setType('string').setRequired();
  mailingMessages.addField('priority').setType('int').setRequired();
  mailingMessages.addField('dateCreated').setType('datetime').setRequired();
  mailingMessages.addField('dateSent').setType('datetime');
  mailingMessages.addField('error').setType('string');
  mailingMessages.addField('html').setType('string');
  mailingMessages.addField('text').setType('string');
  mailingMessages.addField('uniqueKey').setType('string');
  mailingMessages.addField('subject').setType('string');
  mailingMessages.addLinkField('mailingMessageStatuses', 'mailingMessageStatusId').setType('string').setRequired();
  mailingMessages.addLinkField('messageTemplateLangVariants', 'messageTemplateLangVariantId').setType('int').setRequired();
  mailingMessages.addUniqueConstraint(['mailingCampaignId', 'to', 'uniqueKey']);
};

export default addEmailModuleEntities;

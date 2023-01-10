import SystemMetaBuilder from '../../projectsGeneration/builders/SystemMetaBuilder';

const addEmailModuleEntities = (system: SystemMetaBuilder) => {
  // messageTypes
  const messageTypes = system.addCatalog('messageTypes');
  messageTypes.setTitles({
    en: {
      singular: 'Message type',
      plural: 'Message types',
    },
    ru: {
      singular: 'Тип сообщений',
      plural: 'Типы сообщений',
    },
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
    en: {
      singular: 'Template style',
      plural: 'Template styles',
    },
    ru: {
      singular: 'Стили шаблона',
      plural: 'Стили шаблонов',
    },
  });
  templateStyles.setNeedFor('Стили шаблонов');
  templateStyles.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  templateStyles.addField('style').setType('string').setRequired();

  // mailingCampaignStatuses
  const mailingCampaignStatuses = system.addCatalog('mailingCampaignStatuses');
  mailingCampaignStatuses.setTitles({
    en: {
      singular: 'Mailing campaign statuse',
      plural: 'Mailing campaign statuses',
    },
    ru: {
      singular: 'Статус рассылок',
      plural: 'Статус рассылок',
    },
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
      id: 'preparing',
      title: 'Preparing',
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
    en: {
      singular: 'Message template',
      plural: 'Message templates',
    },
    ru: {
      singular: 'Шаблон сообщения',
      plural: 'Шаблоны сообщений',
    },
  });
  messageTemplates.setNeedFor('Шаблоны сообщений');
  messageTemplates.getKey().setType('string').setRequired();
  messageTemplates.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  messageTemplates.addField('secretData').setType('bool').setRequired();
  messageTemplates.addLinkField('messageTypes', 'messageTypeId').setType('string').setRequired();
  messageTemplates.addField('dataExample').setType('string');
  messageTemplates.addLinkField('templateStyles', 'templateStyleId').setType('int');

  // messageTemplateLangVariants
  const messageTemplateLangVariants = system.addCatalog('messageTemplateLangVariants');
  messageTemplateLangVariants.setTitles({
    en: {
      singular: 'Message template lang variant',
      plural: 'Message template lang variants',
    },
    ru: {
      singular: 'Языковой вариант шаблона сообщения',
      plural: 'Языковые варианты шаблонов сообщений',
    },
  });
  messageTemplateLangVariants.setNeedFor('Языковой вариант шаблона сообщения');
  messageTemplateLangVariants.addField('title', undefined, {isTitleField: true}).setType('string');
  messageTemplateLangVariants.addField('subjectTemplate').setType('string').setRequired();
  messageTemplateLangVariants.addField('bodyTemplate').setType('string').setRequired();
  messageTemplateLangVariants.addLinkField('messageTemplates', 'messageTemplateId').setType('string').setRequired();
  messageTemplateLangVariants.addLinkField('languages', 'languageId').setType('string').setRequired();
  messageTemplateLangVariants.addField('additionalStyle').setType('string');
  messageTemplateLangVariants.addUniqueConstraint([
    'messageTemplateId',
    'languageId',
  ]);

  // mailingMessageStatuses
  const mailingMessageStatuses = system.addCatalog('mailingMessageStatuses');
  mailingMessageStatuses.setTitles({
    en: {
      singular: 'Mailing message statuse',
      plural: 'Mailing message statuses',
    },
    ru: {
      singular: 'Статус сообщений массовой рассылки',
      plural: 'Статусы сообщений массовой рассылки',
    },
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
    en: {
      singular: 'Mailing type',
      plural: 'Mailing types',
    },
    ru: {
      singular: 'Тип рассылок',
      plural: 'Типы рассылок',
    },
  });
  mailingTypes.getKey().setType('string');
  mailingTypes.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  mailingTypes.addPredefinedElements([
    {id: 'email', title: 'Email'},
  ]);

  // mailingCampaigns
  const mailingCampaigns = system.addCatalog('mailingCampaigns');
  mailingCampaigns.setTitles({
    en: {
      singular: 'Mailing campaign',
      plural: 'Mailing campaigns',
    },
    ru: {
      singular: 'Рассылка',
      plural: 'Рассылки',
    },
  });
  mailingCampaigns.addField('title', undefined, {isTitleField: true}).setType('string').setRequired();
  mailingCampaigns.addLinkField('mailingTypes', 'mailingTypeId').setType('string').setRequired();
  mailingCampaigns.addField('priority').setType('int').setRequired();
  mailingCampaigns.addField('date').setType('date');
  mailingCampaigns.addLinkField('mailingCampaignStatuses', 'mailingCampaignStatusId').setType('string');
  mailingCampaigns.addLinkField('messageTemplates', 'messageTemplateId').setType('string').setRequired();

  // mailingMessages
  const mailingMessages = system.addCatalog('mailingMessages');
  mailingMessages.setTitles({
    en: {
      singular: 'Mailing message',
      plural: 'Mailing messages',
    },
    ru: {
      singular: 'Сообщение рассылки',
      plural: 'Сообщения рассылки',
    },
  });
  mailingMessages.addLinkField('mailingCampaigns', 'mailingCampaignId').setRequired();
  mailingMessages.addLinkField('messageTemplates', 'templateId').setType('string').setRequired();
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

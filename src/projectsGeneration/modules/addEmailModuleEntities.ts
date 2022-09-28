import SystemMetaBuilder from '../../projectsGeneration/builders/SystemMetaBuilder';

const addEmailModuleEntities = (system: SystemMetaBuilder) => {
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

  // mailingMessages
  const mailingMessages = system.addCatalog('mailingMessages');
  mailingMessages.setTitles({
    en: 'Mailing messages',
    ru: 'Сообщения рассылки',
  });
  mailingMessages.addLinkField('mailingCampaigns', 'mailingCampaignId').setRequired();
  mailingMessages.addField('template').setType('string').setRequired();
  mailingMessages.addLinkField('messageTemplates', 'newTemplateId').setType('int');
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
  mailingMessages.addField('subject').setType('string');
  mailingMessages.addLinkField('mailingMessageStatuses', 'mailingMessageStatusId').setType('string').setRequired();
  mailingMessages.addLinkField('messageTemplateLangVariants', 'messageTemplateLangVariantId').setType('int');
  mailingMessages.addUniqueConstraint(['mailingCampaignId', 'to']);
};

export default addEmailModuleEntities;

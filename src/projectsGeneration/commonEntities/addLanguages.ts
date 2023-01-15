import SystemMetaBuilder from '../builders/SystemMetaBuilder';

const addLanguages = (system: SystemMetaBuilder) => {
  // languages
  const languages = system.addCatalog('languages', {singular: 'Language', plural: 'Languages'});
  languages.getKey().setType('string');
  languages.addField('title', undefined, {isTitleField: true})
    .setTitles({
      en: 'Title',
      ru: 'Название',
    })
    .setType('string');
  languages.addPredefinedElements([
    {id: 'ru', title: 'Russian'},
    {id: 'en', title: 'English'},
  ]);
};

export default addLanguages;

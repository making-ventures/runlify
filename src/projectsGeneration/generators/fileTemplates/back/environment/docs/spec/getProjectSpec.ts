import markdownTable from 'markdown-table';
import {
  BaseEntity,
  BaseSavableEntity,
  Catalog,
  Document,
  Entity,
  IntegrationClient,
  MenuItem,
  MenuItemType,
  RestApi,
  SumRegistry,
  System,
  Report,
} from '../../../../../../builders/buildedTypes';
import findLinksToEntities from './findLinksToEntities';
import getAllSavableEntities from './getAllSavableEntities';
import {titleMd1, titleMd2, titleMd3} from './titleMd';

const toUrl = (source: string) => source.toLowerCase().replaceAll(' ', '-').replaceAll('.', '');
const getLink = (title: string, link: string) => `[${title}](#${toUrl(link)})`;
const getSimpleLink = (title: string) => getLink(title, title);
const getEntityLink = (lang: string, entity: BaseSavableEntity) => getLink(`\`${entity.title[lang].plural}\``, entity.title[lang].plural);
const getToCLink = (title: string, link: string, level: number) => `${'  '.repeat(level - 1)}* ${getLink(title, link)}\n`;
const getToCSimpleLink = (title: string, level: number) => `${'  '.repeat(level - 1)}* ${getSimpleLink(title)}\n`;

const getEntityHeaderSpec = (
  lang: string,
  entity: BaseEntity,
) => {
  let docs = '';

  docs += titleMd2(`${entity.title[lang].singular}`);
  docs += `\`${entity.name}\`\n\n`;

  if (entity.needFor[lang]) {
    docs += `Нужен для: ${entity.needFor[lang]}\n\n`;
  }

  return docs;
};

const getSavableEntityHeaderSpec = (
  lang: string,
  entity: BaseSavableEntity,
) => {
  let docs = '';

  docs += titleMd2(`${entity.title[lang].plural}`);
  docs += `\`${entity.name}\`\n\n`;

  if (entity.needFor[lang]) {
    docs += `Нужен для: ${entity.needFor[lang]}\n\n`;
  }

  return docs;
};

const getEntityLinksToEntitySpec = (
  lang: string,
  links: BaseSavableEntity[],
) => {
  let docs = '';

  if (links.length) {
    docs += `На сущность ссылаются: ${links.map(entity => `${getEntityLink(lang, entity)}`).join(', ')}\n`;
  } else {
    docs += 'На сущность нет ссылок\n';
  }

  return docs;
};

const getEntityFieldsSpec = (
  lang: string,
  entity: BaseSavableEntity,
  entities: Entity[],
) => {
  let docs = '';

  docs += `${markdownTable([
    ['Имя поля', 'Наименование', 'Тип данных', 'Обязательное', 'Справочник'],
    ...entity.fields
      .filter(f => !f.hidden)
      .map((f) => [
        f.name,
        f.title[lang],
        f.type,
        f.required ? 'Обязательное' : 'Не обязательное',
        f.category === 'link' ? `ссылается на ${getEntityLink(lang, entities.find(c => c.name === f.externalEntity) as Catalog)}` : '',
      ]),
  ])}`;

  docs += '\n';

  return docs;
};

const getSavableEntityMethodsSpec = (
  entity: BaseSavableEntity,
) => {
  let docs = '';

  if (entity.methods.length) {
    docs += '\n';

    docs += titleMd3(`Методы`);

    docs += entity.methods.map(method => `* ${method}\n`).join('');
  }

  return docs;
};

const getSavableEntityLabelsSpec = (
  entity: BaseSavableEntity,
) => {
  let docs = '';

  if (entity.labels.length) {
    docs += '\n';

    docs += titleMd3(`Лейблы`);

    docs += entity.labels.map(label => `* ${label}\n`).join('');
  }

  return docs;
};

const getReportLabelsSpec = (
  entity: Report,
) => {
  let docs = '';

  if (entity.labels.length) {
    docs += '\n';

    docs += titleMd3(`Лейблы`);

    docs += entity.labels.map(label => `* ${label}\n`).join('');
  }

  return docs;
};

const getEntityPredefinedSpec = (entity: BaseSavableEntity) => {
  let docs = '';

  if (entity.predefinedElements.length) {
    docs += '\n';

    docs += titleMd3(`Предопределенные элементы`);

    docs += `${markdownTable([
      entity.fields.filter(f => !f.hidden).map(f => f.name),
      ...entity.predefinedElements.map(
        (f) => entity.fields.filter(f => !f.hidden).map(field => f[field.name]),
      ),
    ])}`;
  }

  return docs;
};

const getEntityUniqueConstraintsSpec = (entity: BaseSavableEntity) => {
  let docs = '';

  if (entity.uniqueConstraints.length) {
    docs += '\n';

    docs += titleMd3(`Ограничения уникальности`);

    docs += entity.uniqueConstraints.map(с => `* ${с.map(c => `\`${c}\``).join(', ')}\n`).join('');
  }

  return docs;
};

const getDocRegistriesSpec = (
  lang: string,
  entity: Document,
  entities: Entity[],
) => {
  let docs = '';

  if (entity.registries.length) {
    docs += '\n';

    docs += titleMd3(`Связанные регистры`);

    docs += `${entity.registries.map(name => `${getEntityLink(lang, entities.find(r => r.name === name) as SumRegistry)}`).join(', ')}\n`;
  }

  return docs;
};

const getSumRegistryRegistrarsSpec = (
  lang: string,
  entity: SumRegistry,
  documents: Document[],
) => {
  let docs = '';

  const registrars = documents.filter(d => d.registries.includes(entity.name));

  if (registrars.length) {
    docs += '\n';

    docs += titleMd3(`Регистраторы`);

    docs += `${registrars.map(registrar => `${getEntityLink(lang, registrar)}`).join(', ')}\n`;
  }

  return docs;
};

const getEntitySpec = (
  lang: string,
  entity: BaseSavableEntity,
  entities: Entity[],
  links: BaseSavableEntity[],
) => {
  let docs = '';

  docs += getSavableEntityHeaderSpec(lang, entity);
  docs += getEntityLinksToEntitySpec(lang, links);
  docs += '\n';
  docs += getEntityFieldsSpec(lang, entity, entities);
  docs += getEntityPredefinedSpec(entity);
  docs += getEntityUniqueConstraintsSpec(entity);
  docs += getSavableEntityMethodsSpec(entity);
  docs += getSavableEntityLabelsSpec(entity);

  return docs;
};

const getDocSpec = (
  lang: string,
  entity: Document,
  entities: Entity[],
  links: BaseSavableEntity[],
) => {
  let docs = '';

  docs += getSavableEntityHeaderSpec(lang, entity);
  docs += getEntityLinksToEntitySpec(lang, links);
  docs += '\n';
  docs += getEntityFieldsSpec(lang, entity, entities);
  docs += getEntityPredefinedSpec(entity);
  docs += getEntityUniqueConstraintsSpec(entity);
  docs += getDocRegistriesSpec(lang, entity, entities);
  docs += getSavableEntityMethodsSpec(entity);
  docs += getSavableEntityLabelsSpec(entity);

  return docs;
};

const getSumRegistrySpec = (
  lang: string,
  entity: SumRegistry,
  entities: Entity[],
  documents: Document[],
  links: BaseSavableEntity[],
) => {
  let docs = '';

  docs += getSavableEntityHeaderSpec(lang, entity);
  docs += getEntityLinksToEntitySpec(lang, links);
  docs += '\n';
  docs += getEntityFieldsSpec(lang, entity, entities);
  docs += getEntityPredefinedSpec(entity);
  docs += getEntityUniqueConstraintsSpec(entity);
  docs += getSumRegistryRegistrarsSpec(lang, entity, documents);
  docs += getSavableEntityMethodsSpec(entity);
  docs += getSavableEntityLabelsSpec(entity);

  return docs;
};

const getEntitiesToCLinks = (lang: string, title: string, entities: BaseEntity[]) => {
  let text = '';
  
  text += getToCSimpleLink(title, 1);
  text += entities.map(m => getToCSimpleLink(m.title[lang].singular, 2)).join('')

  return text;
};

const getRestApisToCLinks = (lang: string, title: string, apis: RestApi[]) => {
  let text = '';
  
  text += getToCSimpleLink(title, 1);
  text += apis.map(api => [
    getToCSimpleLink(api.title[lang].singular, 2),
    ...api.methods.map(m => getToCLink(m.name, `${api.name}.${m.name}`, 3)),
  ]).flat().join('')

  return text;
};

const getIntegrationClientsToCLinks = (lang: string, title: string, cleints: IntegrationClient[]) => {
  let text = '';
  
  text += getToCSimpleLink(title, 1);
  text += cleints.map(cleint => [
    getToCSimpleLink(cleint.title[lang].singular, 2),
    ...cleint.queryMethods.map(m => getToCLink(m.name, `${cleint.name}.${m.name}`, 3)),
  ]).flat().join('')

  return text;
};

const getSavableEntityToCLinks = (lang: string, title: string, entities: BaseSavableEntity[]) => {
  let text = '';
  
  text += getToCSimpleLink(title, 1);
  text += entities.map(m => getToCSimpleLink(m.title[lang].plural, 2)).join('')

  return text;
};

const getTableOfContentsSpec = (meta: System) => {
  let text = '';
  
  text += titleMd1('Оглавление');

  if (meta.catalogs.length) {
    text += getSavableEntityToCLinks(meta.defaultLanguage, 'Каталоги', meta.catalogs);
  }

  if (meta.menuItems.length) {
    text += getToCSimpleLink('Меню', 1);
  }
  
  if (meta.documents.length) {
    text += getSavableEntityToCLinks(meta.defaultLanguage, 'Документы', meta.documents);
  }
  
  if (meta.infoRegistries.length) {
    text += getSavableEntityToCLinks(meta.defaultLanguage, 'Информационные регистры', meta.infoRegistries);
  }
  
  if (meta.sumRegistries.length) {
    text += getSavableEntityToCLinks(meta.defaultLanguage, 'Регистры накопления', meta.sumRegistries);
  }
  
  if (meta.languages.length) {
    text += getToCSimpleLink('Языки', 1);
  }
  
  if (meta.roles.length) {
    text += getToCSimpleLink('Роли', 1);
  }
  
  if (meta.reports.length) {
    text += getEntitiesToCLinks(meta.defaultLanguage, 'Отчеты', meta.reports);
  }
  
  if (meta.restApis.length) {
    text += getRestApisToCLinks(meta.defaultLanguage, 'Апи', meta.restApis);
  }
  
  if (meta.integrationClients.length) {
    text += getIntegrationClientsToCLinks(meta.defaultLanguage, 'Интеграционные клиенты', meta.integrationClients);
  }

  return text;
};

const getCommonInfoSpec = (meta: System) => {
  let text = '';

  text += titleMd1('Общие сведения');
  text += `* Название: ${meta.name}\n`;
  text += `* Нужен для: ${meta.needFor}\n`;
  text += `* Префикс: ${meta.prefix}\n`;

  return text;
};

const getMenuItemSpec = (item: MenuItem, level: number) => {  
  switch (item.itemType) {
    case MenuItemType.Group:
      return item.items.map(i => getMenuItemSpec(i, level + 1)).join('')
    case MenuItemType.Internal:
      return `${'  '.repeat(level - 1)}* ${item.name} (${item.link})\n`;
    case MenuItemType.External:
      return `${'  '.repeat(level - 1)}* ${item.name} (${item.link})\n`;
  }
};

const getMethodsSpec = (meta: System) => {
  if (!meta.methods.length) {
    return;
  }

  let text = '';

  text += titleMd1('Доп методы');
  
  for (const method of meta.methods) {
    let docs = '';
    
    docs += `* ${method}\n`;
  
    return docs;
  }

  text += '\n';

  return text;
};

const getLabelsSpec = (meta: System) => {
  if (!meta.labels.length) {
    return;
  }

  let text = '';

  text += titleMd1('Доп лейблы');
  
  for (const label of meta.labels) {
    let docs = '';
    
    docs += `* ${label}\n`;
  
    return docs;
  }

  text += '\n';

  return text;
};

const getMenuSpec = (meta: System) => {
  if (!meta.menuItems.length) {
    return;
  }

  let text = '';

  text += titleMd1('Меню');
  
  for (const item of meta.menuItems) {
    text += getMenuItemSpec(item, 1);
  }

  return text;
};

const getGlosarySpec = (meta: System) => {
  if (!meta.glossary.length) {
    return;
  }

  let text = '';

  text += titleMd1('Глоссарий');
  text += `${markdownTable([
    ['Термин', 'Расшифровка'],
    ...meta.glossary.map((f) => [
      f.term,
      f.definition,
    ]),
  ])}`;

  text += '\n';

  return text;
};

const getDocumentsSpec = (meta: System) => {
  if (!meta.documents.length) {
    return;
  }

  let text = '';

  text += titleMd1('Документы');

  const entities = getAllSavableEntities(meta);

  text += meta.documents.map(entity => {
    const links = findLinksToEntities(entities, entity.name);

    return getDocSpec(meta.defaultLanguage, entity, entities, links);
  }).join('\n');

  return text;
};

const getCatalogsSpec = (meta: System) => {
  if (!meta.catalogs.length) {
    return;
  }

  let text = '';

  text += titleMd1('Каталоги');

  const entities = getAllSavableEntities(meta);

  text += meta.catalogs.map(entity => {
    const links = findLinksToEntities(entities, entity.name);

    return getEntitySpec(meta.defaultLanguage, entity, entities, links);
  }).join('\n');

  text += '\n';

  return text;
};

const getInfoRegistriesSpec = (meta: System) => {
  if (!meta.infoRegistries.length) {
    return;
  }

  let text = '';

  text += titleMd1('Информационные регистры');

  const entities = getAllSavableEntities(meta);

  text += meta.infoRegistries.map(entity => {
    const links = findLinksToEntities(entities, entity.name);

    return getEntitySpec(meta.defaultLanguage, entity, entities, links);
  }).join('\n');

  return text;
};

const getSumRegistriesSpec = (meta: System) => {
  if (!meta.sumRegistries.length) {
    return;
  }

  let text = '';

  text += titleMd1('Регистры накопления');

  const entities = getAllSavableEntities(meta);

  text += meta.sumRegistries.map(entity => {
    const links = findLinksToEntities(entities, entity.name);

    return getSumRegistrySpec(meta.defaultLanguage, entity, entities, meta.documents, links);
  }).join('\n');

  return text;
};

const getLanguagesSpec = (meta: System) => {
  if (!meta.languages.length) {
    return;
  }

  let text = '';

  text += titleMd1('Языки');
  text += meta.languages.map(l => `* ${l.title} (${l.id})\n`).join('');

  return text;
};

const getRolesSpec = (meta: System) => {
  if (!meta.roles.length) {
    return;
  }

  let text = '';

  text += titleMd1('Роли');
  text += meta.roles.map(r => `* ${r.name} ${r.title[meta.defaultLanguage].singular} (${r.needFor[meta.defaultLanguage]})\n`).join('');

  return text;
};

const getReportsSpec = (meta: System) => {
  if (!meta.reports.length) {
    return;
  }

  let text = '';

  text += titleMd1('Отчеты');

  text += meta.reports.map(report => {
    let docs = '';

    docs += getEntityHeaderSpec(meta.defaultLanguage, report);
    docs += getReportLabelsSpec(report);

    return docs;
  }).join('\n');

  return text;
};

const getRestApisSpec = (meta: System) => {
  if (!meta.restApis.length) {
    return;
  }

  let text = '';

  text += titleMd1('Апи');

  text += meta.restApis.map(entity => {
    let docs = '';

    docs += getEntityHeaderSpec(meta.defaultLanguage, entity);

    for (const method of entity.methods) {
      
      docs += titleMd3(`${entity.name}.${method.name}`);
      docs += `${method.title[meta.defaultLanguage].singular}. \`${method.httpMethod}\`\n\n`;

      if (method.urlExample) {
        docs += `Пример урла: \`${method.urlExample}\`\n\n`;
      }

      if (method.needFor[meta.defaultLanguage]) {
        docs += `Нужен для: ${method.needFor[meta.defaultLanguage]}\n\n`;
      }
    }

    return docs;
  }).join('\n');

  return text;
};

const getIntegrationClientsSpec = (meta: System) => {
  if (!meta.integrationClients.length) {
    return;
  }

  let text = '';

  text += titleMd1('Интеграционные клиенты');

  text += `Используются дли запросов во внешние системы\n\n`;

  text += meta.integrationClients.map(entity => {
    if (!entity.queryMethods.length) {
      return;
    }

    let docs = '';

    docs += getEntityHeaderSpec(meta.defaultLanguage, entity);

    for (const queryMethod of entity.queryMethods) {
      
      docs += titleMd3(`${entity.name}.${queryMethod.name}`);
      docs += `${queryMethod.title[meta.defaultLanguage].singular}\n\n`;

      if (queryMethod.needFor[meta.defaultLanguage]) {
        docs += `Нужен для: ${queryMethod.needFor[meta.defaultLanguage]}\n\n`;
      }
    }

    return docs;
  }).filter(Boolean).join('\n');

  return text;
};

const getSystemAdditionalPagesSpec = (meta: System) => {
  if (!meta.pages.length) {
    return;
  }

  let text = '';

  text += titleMd1('Доп старницы');

  text += meta.pages.map(page => {
    let docs = '';
    
    docs += titleMd3(`${page.title[meta.defaultLanguage].singular}`);

    return docs;
  }).filter(Boolean).join('\n');

  return text;
};

const getProjectSpec = (meta: System) => {
  let spec = '\n';

  spec +=  [
    getCommonInfoSpec(meta),
    getTableOfContentsSpec(meta),
    getMenuSpec(meta),
    getGlosarySpec(meta),
    getCatalogsSpec(meta),
    getDocumentsSpec(meta),
    getInfoRegistriesSpec(meta),
    getSumRegistriesSpec(meta),
    getLanguagesSpec(meta),
    getRolesSpec(meta),
    getReportsSpec(meta),
    getRestApisSpec(meta),
    getIntegrationClientsSpec(meta),
    getSystemAdditionalPagesSpec(meta),
    getMethodsSpec(meta),
    getLabelsSpec(meta),
  ]
    .filter(Boolean)
    .join('\n');

  return spec;
};

export default getProjectSpec;

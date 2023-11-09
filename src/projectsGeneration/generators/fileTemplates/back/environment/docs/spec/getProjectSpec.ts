import markdownTable from 'markdown-table';
import {BaseSavableEntity, Entity, System} from '../../../../../../builders/buildedTypes';
import findLinksToEntities from './findLinksToEntities';
import getAllSavableEntities from './getAllSavableEntities';
import {titleMd1, titleMd2, titleMd3} from './titleMd';

const getEntityHeaderSpec = (
  lang: string,
  entity: Entity,
) => {
  let docs = '';

  docs += titleMd2(`${entity.title[lang].plural}`);
  docs += `\`${entity.name}\`\n\n`;

  return docs;
};

const getEntityLinksToEntitySpec = (
  links: BaseSavableEntity[],
) => {
  let docs = '';

  if (links.length) {
    docs += `На сущность ссылаются: ${links.map(entity => `\`${entity.name}\``)}\n`;
  } else {
    docs += 'На сущность нет ссылок\n';
  }

  return docs;
};

const getEntityFieldsSpec = (
  lang: string,
  entity: Entity,
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
        f.category === 'link' ? `ссылается на \`${f.externalEntity}\`` : '',
      ]),
  ])}`;

  return docs;
};

const getEntityPredefinedSpec = (entity: Entity) => {
  let docs = '';

  if (entity.predefinedElements.length) {
    docs += '\n\n';

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

const getEntityUniqueConstraintsSpec = (entity: Entity) => {
  let docs = '';

  if (entity.uniqueConstraints.length) {
    docs += '\n\n';

    docs += titleMd3(`Ограничения уникальности`);

    docs += entity.uniqueConstraints.map(с => `* ${с.map(c => `\`${c}\``).join(', ')}\n`).join('');
  }

  return docs;
};

const getEntitySpec = (
  lang: string,
  entity: Entity,
  links: BaseSavableEntity[],
) => {
  let docs = '';

  docs += getEntityHeaderSpec(lang, entity);
  docs += getEntityLinksToEntitySpec(links);
  docs += '\n';
  docs += getEntityFieldsSpec(lang, entity);
  docs += getEntityPredefinedSpec(entity);
  docs += getEntityUniqueConstraintsSpec(entity);

  return docs;
};

const getDocSpec = (
  lang: string,
  entity: Entity,
  links: BaseSavableEntity[],
) => {
  let docs = '';

  docs += getEntityHeaderSpec(lang, entity);

  docs += getEntityLinksToEntitySpec(links);

  docs += '\n';

  docs += getEntityFieldsSpec(lang, entity);

  docs += getEntityPredefinedSpec(entity);

  return docs;
};

const paramCase = (source: string) => source.toLowerCase().replaceAll(' ', '-');
const getLink = (title: string) => `[${title}](#${paramCase(title)})`;
// const getEntityLink = (lang: string, entity: BaseSavableEntity) => getLink(entity.title[lang].plural);
const getToCLink = (title: string, level: number) => `${'  '.repeat(level - 1)}* ${getLink(title)}\n`;

const getEntityToCLinks = (lang: string, title: string, entities: BaseSavableEntity[]) => {
  let text = '';
  
  text += getToCLink(title, 1);
  text += entities.map(m => getToCLink(m.title[lang].plural, 2)).join('')

  return text;
};

const getProjectSpec = (meta: System) => {
  let spec = '\n';

  const getTableOfContentsSpec = (meta: System) => {
    let text = '';
    
    text += titleMd1('Оглавление');

    if (meta.catalogs) {
      text += getEntityToCLinks(meta.defaultLanguage, 'Каталоги', meta.catalogs);
    }
    
    if (meta.documents) {
      text += getEntityToCLinks(meta.defaultLanguage, 'Документы', meta.documents);
    }
    
    if (meta.infoRegistries) {
      text += getEntityToCLinks(meta.defaultLanguage, 'Информационные регистры', meta.infoRegistries);
    }
    
    if (meta.sumRegistries) {
      text += getEntityToCLinks(meta.defaultLanguage, 'Регистры накопления', meta.sumRegistries);
    }
    
    if (meta.languages) {
      text += getToCLink('Языки', 1);
    }
    
    if (meta.roles) {
      text += getToCLink('Роли', 1);
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

      return getDocSpec(meta.defaultLanguage, entity, links);
    }).join('\n\n');

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

      return getEntitySpec(meta.defaultLanguage, entity, links);
    }).join('\n\n');

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

      return getEntitySpec(meta.defaultLanguage, entity, links);
    }).join('\n\n');

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

      return getEntitySpec(meta.defaultLanguage, entity, links);
    }).join('\n\n');

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

  spec +=  [
    getCommonInfoSpec(meta),
    getTableOfContentsSpec(meta),
    getGlosarySpec(meta),
    getCatalogsSpec(meta),
    getDocumentsSpec(meta),
    getInfoRegistriesSpec(meta),
    getSumRegistriesSpec(meta),
    getLanguagesSpec(meta),
    getRolesSpec(meta),
  ]
    .filter(Boolean)
    .join('\n');

  return spec;
};

export default getProjectSpec;

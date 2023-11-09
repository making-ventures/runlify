import markdownTable from 'markdown-table';
import {BaseSavableEntity, Entity, System} from '../../../../../../builders/buildedTypes';
import findLinksToEntities from './findLinksToEntities';
import getAllSavableEntities from './getAllSavableEntities';
import {titleMd1, titleMd2} from './titleMd';

interface FieldData {
  fieldName: string,
  fieldTitle: string,
  fieldType: string,
  required: boolean,
  catalog: string,
}

const getEntitySpec = (
  lang: string,
  entity: Entity,
  links: BaseSavableEntity[],
) => {
  let docs = '';

  docs += titleMd2(`${entity.title[lang].plural}`);
  docs += `\`${entity.name}\`\n\n`;

  if (links.length) {
    docs += `На сущность ссылаются: ${links.map(entity => `\`${entity.name}\``)}\n`;
  } else {
    docs += 'На сущность нет ссылок\n';
  }

  docs += '\n';

  const fieldsData: FieldData[] = [];

  for (const field of entity.fields) {
    if (field.hidden) {
      continue;
    }

    fieldsData.push({
      fieldName: field.name,
      fieldTitle: field.title[lang],
      fieldType: field.type,
      required: field.required,
      catalog: field.category === 'link' ? `ссылается на \`${field.externalEntity}\`` : '',
    });
  }

  docs += `${markdownTable([
    ['Имя поля', 'Наименование', 'Тип данных', 'Обязательное', 'Справочник'],
    ...fieldsData.map((f) => [
      f.fieldName,
      f.fieldTitle,
      f.fieldType,
      f.required ? 'Обязательное' : 'Не обязательное',
      f.catalog,
    ]),
  ])}`;

  return docs;
};

const getProjectSpec = (meta: System) => {
  let spec = '\n';

  const getCommonInfoSpec = (meta: System) => {
    let text = '';

    text += titleMd1('Общие сведения');
    text += `* Название: ${meta.name}\n`;
    text += `* Нужен для: ${meta.needFor}\n`;
    text += `* Префикс: ${meta.prefix}\n`;

    return text;
  };

  const getGlosarySpec = (meta: System) => {
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
    let text = '';

    text += titleMd1('Документы');
    text += `documents: ${meta.documents}\n`;

    return text;
  };

  const getCatalogsSpec = (meta: System) => {
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
    let text = '';

    text += titleMd1('Информационные регистры');
    text += `infoRegistries: ${meta.infoRegistries}\n`;

    return text;
  };

  const getSumRegistriesSpec = (meta: System) => {
    let text = '';

    text += titleMd1('Регистры накопления');
    text += `sumRegistries: ${meta.sumRegistries}\n`;

    return text;
  };

  const getLanguagesSpec = (meta: System) => {
    let text = '';

    text += titleMd1('Языки');
    text += meta.languages.map(l => `* ${l.title} (${l.id})\n`).join('');

    return text;
  };

  const getRolesSpec = (meta: System) => {
    let text = '';

    text += titleMd1('Роли');
    text += meta.roles.map(r => `* ${r.name} ${r.title[meta.defaultLanguage].singular} (${r.needFor[meta.defaultLanguage]})\n`).join('');

    return text;
  };

  const chapters = [
    getCommonInfoSpec(meta),
    getGlosarySpec(meta),
    getDocumentsSpec(meta),
    getCatalogsSpec(meta),
    getInfoRegistriesSpec(meta),
    getSumRegistriesSpec(meta),
    getLanguagesSpec(meta),
    getRolesSpec(meta),
  ];

  spec += chapters.join('\n');

  return spec;
};

export default getProjectSpec;

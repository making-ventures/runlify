import {ProjectWideGenerationArgs} from '../../../../../args'
import {BaseSavableEntity} from '../../../../../builders/buildedTypes'
import {printWarningIfRequired} from '../../../../../utils'

const uiTranslationsForServicesOfSavablesTmpl = (
  { options, system: { defaultLanguage } }: ProjectWideGenerationArgs,
  entities: BaseSavableEntity[],
  lang: string,
  postfix: string
) => `/* eslint-disable max-len */
${printWarningIfRequired(options)}
const ${lang}${postfix} = ${
  entities.length > 0
    ? `{
${entities
  .map(
    (entity) =>
      `  ${entity.name}: {
    title: {
      plural: '${entity.title[lang]?.plural ? entity.title[lang].plural : entity.title[defaultLanguage].plural}',
      singular: '${entity.title[lang]?.singular ? entity.title[lang].singular : entity.title[defaultLanguage].singular}',
    },
    fields: ${
      entity.fields.length > 0
        ? `{
${entity.fields
  .map(
    (field) =>
      `      ${field.name}: '${
        field.title[lang] ? field.title[lang] : field.title[defaultLanguage]
      }',`
  )
  .join('\n')}
    }`
        : '{}'
    },
  },`
  )
  .join('\n')}
}`
    : '{}'
};

export default ${lang}${postfix};
`

export default uiTranslationsForServicesOfSavablesTmpl

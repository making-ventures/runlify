/* eslint-disable max-len */
import { ProjectWideGenerationArgs } from '../../../../../args'
import { BaseSavableEntity } from '../../../../../builders/buildedTypes'
import { generatedWarning } from '../../../../../utils'

const uiTranslationsForServicesOfSavablesTmpl = (
  { options, system: { defaultLanguage } }: ProjectWideGenerationArgs,
  entities: BaseSavableEntity[],
  lang: string,
  postfix: string
) => `/* eslint-disable max-len */
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const ${lang}${postfix} = ${
  entities.length > 0
    ? `{
${entities
  .map(
    (entity) =>
      `  ${entity.name}: {
    title: '${
      entity.title.plural[lang] ? entity.title.plural[lang] : entity.title.plural[defaultLanguage]
    }',
    fields: ${
      entity.fields.length > 0
        ? `{
${entity.fields
  .map(
    (field) =>
      `      ${field.name}: '${
        field.title.plural[lang] ? field.title.plural[lang] : field.title.plural[defaultLanguage]
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

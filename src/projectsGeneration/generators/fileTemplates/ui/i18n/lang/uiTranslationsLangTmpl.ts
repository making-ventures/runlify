import { ProjectWideGenerationArgs } from '../../../../../args'
import { generatedWarning } from '../../../../../utils'

const uiTranslationsLangTmpl = (
  { options, system: { defaultLanguage } }: ProjectWideGenerationArgs,
  entities: { name: string; title: Record<string, {singular: string, plural?: string}> }[],
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
      entity.title[lang]?.singular ? entity.title[lang].singular : entity.title[defaultLanguage].singular
    }',
  },`
  )
  .join('\n')}
}`
    : '{}'
};

export default ${lang}${postfix};
`

export default uiTranslationsLangTmpl

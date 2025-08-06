import {ProjectWideGenerationArgs} from '../../../../../args'

const uiTranslationsLangTmpl = (
  {system: {defaultLanguage}}: ProjectWideGenerationArgs,
  entities: { name: string; title: Record<string, {singular: string, plural?: string}> }[],
  lang: string,
  postfix: string
) => `const ${lang}${postfix} = ${
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

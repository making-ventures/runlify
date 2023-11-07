import {paramCase, pascalCase} from 'change-case'
import markdownTable from 'markdown-table';
import {ProjectWideGenerationArgs} from '../../../../../args'
import {IntegrationClient} from '../../../../../builders/buildedTypes'

const backDocsIntegrationClient = (
  { system }: ProjectWideGenerationArgs,
  integrationClient: IntegrationClient
) => {
  return `
# ${integrationClient.title[system.defaultLanguage].singular}
${integrationClient.needFor[system.defaultLanguage]}

## Методы
${integrationClient.queryMethods.map(m => `* [${m.title[system.defaultLanguage].singular}](#${paramCase(m.name)})`).join('\n')}

${integrationClient.queryMethods.map(m => `## ${m.title[system.defaultLanguage].singular}
**${m.needFor[system.defaultLanguage]}**

Тип: Запрос на чтение

### Параметры

${markdownTable([
  ['Имя поля', 'Наименование', 'Тип данных', 'Обязательное'],
  ...m.argsModel.fields.map((f) => [
    f.name,
    f.title[system.defaultLanguage],
    'type' in f ? f.type : pascalCase(f.model),
    f.required ? 'Обязательное' : 'Не обязательное',
  ]),
])}

### Результат

В результате приходит массив: ${m.returnModel.array ? 'да' : 'нет'}

Поля:

${markdownTable([
  ['Имя поля', 'Наименование', 'Тип данных', 'Обязательное'],
  ...m.returnModel.fields.map((f) => [
    f.name,
    f.title[system.defaultLanguage],
    'type' in f ? f.type : pascalCase(f.model),
    f.required ? 'Обязательное' : 'Не обязательное',
  ]),
])}
`).join('\n')}`
}

export default backDocsIntegrationClient;

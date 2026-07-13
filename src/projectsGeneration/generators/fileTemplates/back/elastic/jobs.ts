import {Entity, Field} from '../../../../builders'
import * as R from 'ramda'
import {pascalSingular} from '../../../../../utils/cases';
import {defaultBootstrapEntityOptions} from '../../../../types';
import {isMoneyField} from '../../../../metaUtils';

type ElasticFieldType = Field['type'] | 'keyword' | 'long'
type GroupedByType = Partial<Record<ElasticFieldType, string[]>>

const getElasticFieldType = (field: Field): ElasticFieldType => {
  const isIdField = ['id', 'link'].includes(field.category)
  let type: ElasticFieldType = isIdField ? 'keyword' : field.type

  if (type === 'datetime') {
    type = 'date'
  }

  if (type === 'bigint' || isMoneyField(field)) {
    type = 'long'
  }

  return type
}

const getGroupedByType = (e: Entity) => e.fields.reduce<GroupedByType>((acc, field) => {
  const type = getElasticFieldType(field)

  if(!R.is(Array, acc[type])) {
    acc[type] = []
  }

  (acc[type] as string[]).push(field.name)

  return acc
}, {})

const getConstructor = (g: string) => {
  switch (g) {
    case 'keyword':
      return 'keywordFields'
    case 'datetime':
    case 'date':
      return 'dateFields'
    case 'bool':
      return 'booleanFields'
    case 'int':
      return 'integerFields'
    case 'long':
      return 'longFields'
    case 'string':
      return 'textFields'
    default:
      throw new Error(`Unknown group identifier ${g}`)
  }
}

const getUsedUtilsImports = (entities: Entity[]) => {
  const used = new Set<string>()

  for (const entity of entities) {
    for (const type of Object.keys(getGroupedByType(entity))) {
      used.add(getConstructor(type))
    }
  }

  return [...used].sort()
}

const genJobsBlankTmpl = (_options = defaultBootstrapEntityOptions) => {
  return `import {ElasticJobs} from './type';

export const genJobs: ElasticJobs = {};
`;
}

export const genJobsDataTmpl = (entities: Entity[], _options = defaultBootstrapEntityOptions) => {
  const utilsImports = getUsedUtilsImports(entities)
  const utilsImportLine = utilsImports.length > 0
    ? `import {${utilsImports.join(', ')}} from './utils';\n`
    : ''

  return `import Entity from '../../types/Entity';
${utilsImportLine}import {ElasticJobs} from './type';

export const genJobs: ElasticJobs = {
  ${entities.map((e) => `[Entity.${pascalSingular(e.name)}]: {
    ${Object.entries(getGroupedByType(e)).map(([type, fields]) => `...${getConstructor(type)}([
      ${fields.map(f => `'${f}',`).join('\n      ')}
    ]),`).join('\n    ')}
  },`).join('\n  ')}
};
`;
}

export const genJobsTmpl = (entities: Entity[], options = defaultBootstrapEntityOptions) => 
  entities.length ? genJobsDataTmpl(entities, options) : genJobsBlankTmpl(options)

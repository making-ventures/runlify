import {Entity, Field} from '../../../../builders'
import * as R from 'ramda'
import {pascalSingular} from '../../../../../utils/cases';
import {defaultBootstrapEntityOptions} from '../../../../types';
import {generatedWarning} from '../../../../utils';

type GroupedByType = Partial<Record<Field['type'] | 'keyword', string[]>>

const getGroupedByType = (e: Entity) => e.fields.reduce<GroupedByType>((acc, field) => {
  const isIdField = ['id', 'link'].includes(field.category)
  let type = isIdField ? 'keyword' : field.type

  if (type === 'datetime') {
    type = 'date'
  }

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
    case 'string':
      return 'textFields'
    default:
      throw new Error(`Unknown group identifier ${g}`)
  }
}

const genJobsBlankTmpl = (options = defaultBootstrapEntityOptions) => {
  return `import {ElasticJobs} from './type';
${options.skipWarningThisIsGenerated
      ? ''
      : `
// ${generatedWarning}
`}
export const genJobs: ElasticJobs = {};
`;
}

export const genJobsDataTmpl = (entities: Entity[], options = defaultBootstrapEntityOptions) => {
  return `import Entity from '../../types/Entity';
import {textFields, keywordFields, integerFields, dateFields, booleanFields} from './utils';
import {ElasticJobs} from './type';
${options.skipWarningThisIsGenerated
      ? ''
      : `
// ${generatedWarning}
`}
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

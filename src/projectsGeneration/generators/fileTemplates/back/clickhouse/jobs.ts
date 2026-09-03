import {Entity, Field} from '../../../../builders'
import * as R from 'ramda'
import {pascalSingular} from '../../../../../utils/cases';
import {defaultBootstrapEntityOptions} from '../../../../types';
import {isMoneyField} from '../../../../metaUtils';

type ClickHouseFieldType = Field['type'] | 'keyword' | 'long'
type GroupedByType = Partial<Record<string, string[]>>

// Unlike Elasticsearch (schema-flexible, no NOT NULL enforcement at the mapping level),
// ClickHouse errors ("attempt to write null into not nullable column") if a Postgres-optional
// field is declared without Nullable(...) and a CDC-only table (no app writer to backfill a
// default) ever replicates an actual NULL — which, for any non-trivial entity, some field
// eventually will. Every bucket therefore needs a nullable variant, not just keyword/link ids
// (found empirically cutting bsProfiles over to ClickHouse — many of its own optional fields
// besides passengerId hit this once real data flowed through).
const getClickHouseFieldType = (field: Field): string => {
  const isIdField = ['id', 'link'].includes(field.category)
  // id/link fields can have a non-string underlying key (IntLinkField/BigIntLinkField, e.g. a
  // link to a catalog keyed by Int) — field.type already reflects the *real* key type
  // correctly in that case. Forcing 'keyword' unconditionally (as elastic/jobs.ts does, safely,
  // since ES coerces numbers into keyword fields) made the ClickHouse Kafka Connect sink fail
  // with "cannot convert Kafka value of type INT32 ... to ClickHouse type STRING" — found
  // empirically cutting bsProfiles over (countryId, an Int-keyed link). Only string-keyed
  // id/link fields should actually become 'keyword'.
  const isStringIdField = isIdField && field.type === 'string'
  let type: ClickHouseFieldType = isStringIdField ? 'keyword' : field.type

  if (type === 'datetime') {
    type = 'date'
  }

  if (type === 'bigint' || isMoneyField(field)) {
    type = 'long'
  }

  return field.required ? type : `nullable-${type}`
}

const getGroupedByType = (e: Entity) => e.fields.reduce<GroupedByType>((acc, field) => {
  const type = getClickHouseFieldType(field)

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
    case 'nullable-keyword':
      return 'nullableKeywordFields'
    case 'datetime':
    case 'date':
      return 'dateFields'
    case 'nullable-date':
      return 'nullableDateFields'
    case 'bool':
      return 'booleanFields'
    case 'nullable-bool':
      return 'nullableBooleanFields'
    case 'int':
      return 'integerFields'
    case 'nullable-int':
      return 'nullableIntegerFields'
    case 'long':
      return 'longFields'
    case 'nullable-long':
      return 'nullableLongFields'
    case 'string':
      return 'textFields'
    case 'nullable-string':
      return 'nullableTextFields'
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
  return `import {ClickHouseJobs} from './type';

export const genJobs: ClickHouseJobs = {};
`;
}

export const genClickHouseJobsDataTmpl = (entities: Entity[], _options = defaultBootstrapEntityOptions) => {
  const utilsImports = getUsedUtilsImports(entities)
  const utilsImportLine = utilsImports.length > 0
    ? `import {${utilsImports.join(', ')}} from './utils';\n`
    : ''

  return `import Entity from '../../types/Entity';
${utilsImportLine}import {ClickHouseJobs} from './type';

export const genJobs: ClickHouseJobs = {
  ${entities.map((e) => `[Entity.${pascalSingular(e.name)}]: {
    ${Object.entries(getGroupedByType(e)).map(([type, fields]) => `...${getConstructor(type)}([
      ${(fields ?? []).map(f => `'${f}',`).join('\n      ')}
    ]),`).join('\n    ')}
  },`).join('\n  ')}
};
`;
}

export const genClickHouseJobsTmpl = (entities: Entity[], options = defaultBootstrapEntityOptions) =>
  entities.length ? genClickHouseJobsDataTmpl(entities, options) : genJobsBlankTmpl(options)

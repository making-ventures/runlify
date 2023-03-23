/* eslint-disable max-len */
import {
  pascalPlural,
  pascalSingular,
  camelSingular,
  pascal,
} from '../../../../../../utils/cases'
import { singular } from 'pluralize'
import { EntityWideGenerationArgs } from '../../../../../args'
import { addComma, generatedWarning, pad } from '../../../../../utils'
import { Document } from '../../../../../builders'

export const prismaServiceBaseClassTmpl = ({
  entity,
  options,
}: EntityWideGenerationArgs) => {
  const contextName = 'Context'

  const forbiddenForUserFields = entity.fields.filter(
    (f) => !f.updatableByUser && f.name !== 'search'
  )
  const requiredForDbButNotForUserFields = entity.fields.filter(
    (f) => f.required && !f.requiredOnInput && f.name !== 'id'
  )

  const getDefaultableFields = () =>
    entity.fields
      .filter((f) => f.defaultBackendValueExpression)
      .filter((f) => !f.hidden)

  const isSharded = !!entity.shardUniqKeys;
  const isExternalSearch = entity.externalSearch;
  const isDocument = entity.type === 'document';
  const isSumRegistry = entity.type === 'sumRegistry';
  const isInfoRegistry = entity.type === 'infoRegistry';

  let extendedType = 'BaseService';
  if (isExternalSearch) {
    extendedType = 'ElasticBaseSearch';
  }
  if (isSharded) {
    extendedType = 'ShardsService';
  }

  if (isDocument) {
    extendedType = 'DocumentBaseService';
    if (isExternalSearch) {
      extendedType = 'ElasticDocumentBaseService';
    }
  }

  if (isSumRegistry) {
    extendedType = 'SumRegistryService';
    if (isExternalSearch) {
      extendedType = 'ElasticSumRegistryService';
    }
  }

  if (isInfoRegistry) {
    extendedType = 'InfoRegistryService';
    if (isExternalSearch) {
      extendedType = 'ElasticInfoRegistryService';
    }
  }

  if (isSharded) {
    extendedType = 'ShardsService';
    if (isExternalSearch) {
      extendedType = 'ElasticShardsService';
    }
    if (isDocument) {
      extendedType = 'DocumentShardsService';
    }
  }

  let registriesImports = '';
  let registries = '';

  if (isDocument) {
    const document = entity as Document;

    registriesImports = document.registries.map(
      (registry) => `\nimport {StrictCreate${pascalSingular(registry)}Args} from '../${pascalPlural(registry)}Service/${pascalPlural(registry)}Service';`
    ).join('');

    registries = `
export interface ${pascalSingular(document.name)}RegistryEntries {${
      document.registries.length > 0
        ? document.registries
          .map(
            (registry) => `
  ${singular(registry)}: StrictCreate${pascalSingular(registry)}Args[];`
          )
          .join('')
        : ''
    }
}
`;
  }

  return `import {
  MutationCreate${pascalSingular(entity.name)}Args,
  MutationUpdate${pascalSingular(entity.name)}Args,
  MutationRemove${pascalSingular(entity.name)}Args,
  QueryAll${pascalPlural(entity.name)}Args,
  ${pascalSingular(entity.name)},${isExternalSearch ? `
  External${pascal(entity.name)}SearchTracking,` : ''}
} from '../../../generated/graphql';
import {${contextName}} from '../types';
import initUserHooks from './initUserHooks';
import initBuiltInHooks from './initBuiltInHooks';
import {${extendedType}} from '../utils/class/${extendedType}';${getDefaultableFields().length ? `
import * as R from 'ramda';` : ''}
import config from './config';
import {DefinedFieldsInRecord, DefinedRecord, PartialFieldsInRecord} from '../../../types/utils';${registriesImports}
${
    options.skipWarningThisIsGenerated
      ? ''
      : `
// ${generatedWarning}
`
  }${
    entity.type === 'infoRegistry' && entity.period !== 'notPeriodic'
      ? `
export type Slice${pascalPlural(entity.name)}Filter = QueryAll${pascalPlural(
        entity.name
      )}Args['filter'];
`
      : ''
  }
export type Autodefinable${pascalSingular(entity.name)}Keys = ${
    getDefaultableFields().length > 0
      ? `${getDefaultableFields()
        .map((f) => `'${f.name}'`)
        .join(' | ')}`
      : 'never'
  };
export type ForbidenForUser${pascalSingular(entity.name)}Keys = ${
    forbiddenForUserFields.length > 0
      ? `${forbiddenForUserFields.map((f) => `'${f.name}'`).join(' | ')}`
      : 'never'
  };
export type RequiredDbNotUser${pascalSingular(entity.name)}Keys = ${
    requiredForDbButNotForUserFields.length > 0
      ? `${requiredForDbButNotForUserFields
        .map((f) => `'${f.name}'`)
        .join(' | ')}`
      : 'never'
  };

export type Autodefinable${pascalSingular(
    entity.name
  )}Part = DefinedRecord<Pick<MutationCreate${pascalSingular(
    entity.name
  )}Args, Autodefinable${pascalSingular(entity.name)}Keys>>;

export type Reliable${pascalSingular(entity.name)}CreateUserInput =
  Omit<MutationCreate${pascalSingular(
    entity.name
  )}Args, ForbidenForUser${pascalSingular(entity.name)}Keys>
  & Autodefinable${pascalSingular(entity.name)}Part;

export type Allowed${pascalSingular(
    entity.name
  )}ForUserCreateInput = Omit<MutationCreate${pascalSingular(
    entity.name
  )}Args, ForbidenForUser${pascalSingular(entity.name)}Keys>;

export type StrictCreate${pascalSingular(
    entity.name
  )}Args = DefinedFieldsInRecord<MutationCreate${pascalSingular(
    entity.name
  )}Args, RequiredDbNotUser${pascalSingular(
    entity.name
  )}Keys> & Autodefinable${pascalSingular(entity.name)}Part;
export type StrictUpdate${pascalSingular(
    entity.name
  )}Args = DefinedFieldsInRecord<MutationUpdate${pascalSingular(
    entity.name
  )}Args, RequiredDbNotUser${pascalSingular(
    entity.name
  )}Keys> & Autodefinable${pascalSingular(entity.name)}Part;

export type StrictCreate${pascalSingular(
    entity.name
  )}ArgsWithoutAutodefinable = PartialFieldsInRecord<StrictCreate${pascalSingular(
    entity.name
  )}Args, Autodefinable${pascalSingular(entity.name)}Keys>;
export type MutationCreate${pascalSingular(
    entity.name
  )}ArgsWithoutAutodefinable = PartialFieldsInRecord<MutationCreate${pascalSingular(
    entity.name
  )}Args, Autodefinable${pascalSingular(entity.name)}Keys>;
export type MutationUpdate${pascalSingular(
    entity.name
  )}ArgsWithoutAutodefinable = PartialFieldsInRecord<MutationUpdate${pascalSingular(
    entity.name
  )}Args, Autodefinable${pascalSingular(entity.name)}Keys>;
${registries}
export class ${pascal(entity.name)}Service extends ${extendedType}<
  ${pascalSingular(entity.name)},
  MutationCreate${pascalSingular(entity.name)}Args,
  MutationUpdate${pascalSingular(entity.name)}Args,
  MutationRemove${pascalSingular(entity.name)}Args,
  QueryAll${pascalPlural(entity.name)}Args,
  Autodefinable${pascalSingular(entity.name)}Keys,
  ForbidenForUser${pascalSingular(entity.name)}Keys,
  RequiredDbNotUser${pascalSingular(entity.name)}Keys${isExternalSearch ? `,
  External${pascal(entity.name)}SearchTracking` : ''}${isDocument ? `,
  ${pascalSingular(entity.name)}RegistryEntries` : ''}
> {
  constructor(public ctx: Context) {
    super(ctx, ${isSharded ? `'${camelSingular(entity.name)}'${entity.externalSearchName ? `, 'external${pascal(entity.name)}SearchTracking'` : ''},`
    : `ctx.prisma.${camelSingular(entity.name)},${isExternalSearch ? ` ctx.prisma.external${pascal(entity.name)}SearchTracking,` : ''}`} config);
    initBuiltInHooks(this);
    initUserHooks(this);${getDefaultableFields().length > 0 ? `

    this.augmentByDefault = async <T>(
      currentData: Record<string, any>,
    ): Promise<T & Autodefinable${pascalSingular(entity.name)}Part> => {
      const defaultFieldConstructors = {
${pad(4)(
          getDefaultableFields()
            .map((f) => `${f.name}: async () => ${f.defaultBackendValueExpression}`)
            .map(addComma)
            .join('\n')
        )}
      };

      const pairedConstructors = R.toPairs(defaultFieldConstructors);

      const resultedPairs: R.KeyValuePair<string, any>[] = [];
      for (const [key, constructor] of pairedConstructors) {
        resultedPairs.push([key, key in currentData && currentData[key] ? currentData[key] : await constructor()]);
      }

      return R.mergeLeft(currentData, R.fromPairs(resultedPairs)) as T & Autodefinable${pascalSingular(
          entity.name
        )}Part;
    };` : ''}
  }
}
`
};

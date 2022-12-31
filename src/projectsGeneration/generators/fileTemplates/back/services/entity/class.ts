/* eslint-disable max-len */
import { fieldTypeToTsType } from '../../../../fieldTypeToTsType'
import {
  pascalPlural,
  pascalSingular,
  camelSingular, pascal
} from '../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../args'
import { addComma, generatedWarning, pad3 } from '../../../../../utils'
import { getKeyField } from '../../../../../metaUtils'

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

  return `import {
  ListMetadata,
  MutationCreate${pascalSingular(entity.name)}Args,
  MutationUpdate${pascalSingular(entity.name)}Args,
  MutationRemove${pascalSingular(entity.name)}Args,
  QueryAll${pascalPlural(entity.name)}Args,
  Query_All${pascalPlural(entity.name)}MetaArgs,
  ${pascalSingular(entity.name)},
  ${pascalSingular(entity.name)}Filter,
} from '../../../generated/graphql';
import {${contextName}} from '../types';${
    entity.type === 'document'
      ? `
import {Prisma, PrismaPromise} from '@prisma/client';`
      : `
import {Prisma} from '@prisma/client';`
  }
import initUserHooks from './initUserHooks';
import initBuiltInHooks from './initBuiltInHooks';
import {BaseService} from '../utils/class/BaseService';${getDefaultableFields().length ? `
import * as R from 'ramda';` : ''}
import {DefinedFieldsInRecord, DefinedRecord, PartialFieldsInRecord} from '../../../types/utils';
import config from './config';
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

export interface Base${pascalPlural(entity.name)}Methods {
  get: (id: ${fieldTypeToTsType(getKeyField(entity).type)}) =>
    Promise<${pascalSingular(entity.name)} | null>;
  getRequired: (id: ${fieldTypeToTsType(getKeyField(entity).type)}) =>
    Promise<${pascalSingular(entity.name)}>;
  all: (params?: QueryAll${pascalPlural(entity.name)}Args) =>
    Promise<${pascalSingular(entity.name)}[]>;
  findOne: (params?: QueryAll${pascalPlural(entity.name)}Args) =>
    Promise<${pascalSingular(entity.name)} | null>;
  findOneRequired: (params?: QueryAll${pascalPlural(entity.name)}Args) =>
    Promise<${pascalSingular(entity.name)}>;${
    entity.type === 'infoRegistry' && entity.period !== 'notPeriodic'
      ? `
  sliceOfTheLast: (date?: Date, filter?: Slice${pascalPlural(
        entity.name
      )}Filter) =>
    Promise<${pascalSingular(entity.name)} | null>;
  sliceOfTheFirst: (date?: Date, filter?: Slice${pascalPlural(
        entity.name
      )}Filter) =>
    Promise<${pascalSingular(entity.name)} | null>;`
      : ''
  }
  count: (params?: Query_All${pascalPlural(entity.name)}MetaArgs) =>
    Promise<number>;
  meta: (params?: Query_All${pascalPlural(entity.name)}MetaArgs) =>
    Promise<ListMetadata>;
  create: (data: MutationCreate${pascalSingular(
    entity.name
  )}ArgsWithoutAutodefinable, byUser?: boolean) =>
    Promise<${pascalSingular(entity.name)}>;
  createMany: (data: StrictCreate${pascalSingular(
    entity.name
  )}ArgsWithoutAutodefinable[], byUser?: boolean) =>
    Promise<Prisma.BatchPayload>;
  update: ({id, ...rest}: MutationUpdate${pascalSingular(
    entity.name
  )}ArgsWithoutAutodefinable, byUser?: boolean) =>
    Promise<${pascalSingular(entity.name)}>;
  upsert: (
    data: PartialFieldsInRecord<MutationUpdate${pascalSingular(entity.name)}ArgsWithoutAutodefinable, 'id'>,
    byUser?: boolean,
  ) =>
    Promise<${pascalSingular(entity.name)}>;
  upsertAdvanced: (
    filter: ${pascalSingular(entity.name)}Filter,
    data: MutationCreate${pascalSingular(entity.name)}ArgsWithoutAutodefinable,
    byUser?: boolean,
  ) =>
    Promise<${pascalSingular(entity.name)}>;
  delete: (params: MutationRemove${pascalSingular(entity.name)}Args) =>
    Promise<${pascalSingular(entity.name)}>;${
    entity.type === 'document'
      ? `

  rePost: (id: ${fieldTypeToTsType(getKeyField(entity).type)}) =>
    Promise<void>;
  getRegistryEntries: (data: ${pascalSingular(entity.name)}) =>
    Promise<${pascalSingular(entity.name)}RegistryEntries>;
  getPostOperations: (data: ${pascalSingular(entity.name)}) =>
    Promise<PrismaPromise<any>[]>;
  getUnPostOperations: (id: ${fieldTypeToTsType(getKeyField(entity).type)}) =>
    Promise<PrismaPromise<any>[]>;`
      : ''
  }
}

export class Base${pascal(entity.name)}ServiceClass extends BaseService<
  ${pascalSingular(entity.name)},
  QueryAll${pascalPlural(entity.name)}Args,
  Reliable${pascalSingular(entity.name)}CreateUserInput,
  MutationUpdate${pascalSingular(entity.name)}Args,
  MutationRemove${pascalSingular(entity.name)}Args,
  StrictCreate${pascalSingular(entity.name)}Args,
  StrictUpdate${pascalSingular(entity.name)}Args,
  Autodefinable${pascalSingular(entity.name)}Part,
  MutationCreate${pascalSingular(entity.name)}ArgsWithoutAutodefinable,
  MutationUpdate${pascalSingular(entity.name)}ArgsWithoutAutodefinable,
  StrictCreate${pascalSingular(entity.name)}ArgsWithoutAutodefinable
> implements Base${pascalPlural(entity.name)}Methods {
  constructor(public ctx: Context) {
    super(ctx, ctx.prisma.${camelSingular(entity.name)}, config);
    initBuiltInHooks(this as any); // todo: fix
    initUserHooks(this as any); // todo: fix
  }

  augmentByDefault = async <T>(
    currentData: Record<string, any>,
  ): Promise<T & Autodefinable${pascalSingular(entity.name)}Part> => ${
    getDefaultableFields().length
      ? `{
    const defaultFieldConstructors = {
${pad3(
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
  }`
      : `currentData as T & Autodefinable${pascalSingular(entity.name)}Part`
  };
}
`
};

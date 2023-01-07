/* eslint-disable max-len */
import {
  pascalPlural,
  pascalSingular,
  camelSingular,
  pascal,
} from '../../../../../../utils/cases'
import { singular } from 'pluralize'
import { EntityWideGenerationArgs } from '../../../../../args'
import { generatedWarning } from '../../../../../utils'
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

  let extendedType = 'BaseService';

  if (['document'].includes(entity.type)) {
    extendedType = 'DocumentBaseService';
  }

  const isDocument = entity.type === 'document';
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
  ${pascalSingular(entity.name)},
} from '../../../generated/graphql';
import {${contextName}} from '../types';
import initUserHooks from './initUserHooks';
import initBuiltInHooks from './initBuiltInHooks';
import {${extendedType}} from '../utils/class/${extendedType}';
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
  RequiredDbNotUser${pascalSingular(entity.name)}Keys${isDocument ? `,
  ${pascalSingular(entity.name)}RegistryEntries` : ''}
> {
  constructor(public ctx: Context) {
    super(ctx, ctx.prisma.${camelSingular(entity.name)}, config);
    initBuiltInHooks(this);
    initUserHooks(this);
  }
}
`
};

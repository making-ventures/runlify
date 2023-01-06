/* eslint-disable max-len */
import {
  pascalPlural,
  pascalSingular,
  camelSingular,
  pascal,
} from '../../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../../args'

export const prismaServiceBaseClassTmpl = ({
  entity,
}: EntityWideGenerationArgs,
  importsText = '',
  beforeFromAdditionalMethods = '',
  codeFromAdditionalMethods = '',
) => {
  const contextName = 'Context'

  let extendedType = 'BaseService';

  if (['document', 'infoRegistry', 'sumRegistry'].includes(entity.type)) {
    extendedType = 'DocumentBaseService';
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
import {
  TStrictUpdateArgs,
  TStrictCreateArgs,
  TReliableCreateUserInput,
  TStrictCreateArgsWithoutAutodefinable,
  TMutationCreateArgsWithoutAutodefinable,
  TMutationUpdateArgsWithoutAutodefinable,
} from '../utils/class/types';
import config, {${pascalPlural(entity.name)}Types} from './config';
${importsText}
export type Reliable${pascalSingular(entity.name)}CreateUserInput = TReliableCreateUserInput<MutationCreate${pascalSingular(entity.name)}Args, ${pascalPlural(entity.name)}Types>;
export type StrictCreate${pascalSingular(entity.name)}Args = TStrictCreateArgs<MutationCreate${pascalSingular(entity.name)}Args, ${pascalPlural(entity.name)}Types>;
export type StrictUpdate${pascalSingular(entity.name)}Args = TStrictUpdateArgs<MutationCreate${pascalSingular(entity.name)}Args, MutationUpdate${pascalSingular(entity.name)}Args, ${pascalPlural(entity.name)}Types>;
export type StrictCreate${pascalSingular(entity.name)}ArgsWithoutAutodefinable = TStrictCreateArgsWithoutAutodefinable<MutationCreate${pascalSingular(entity.name)}Args, ${pascalPlural(entity.name)}Types>;
export type MutationCreate${pascalSingular(entity.name)}ArgsWithoutAutodefinable = TMutationCreateArgsWithoutAutodefinable<MutationCreate${pascalSingular(entity.name)}Args, ${pascalPlural(entity.name)}Types>;
export type MutationUpdate${pascalSingular(entity.name)}ArgsWithoutAutodefinable = TMutationUpdateArgsWithoutAutodefinable<MutationUpdate${pascalSingular(entity.name)}Args, ${pascalPlural(entity.name)}Types>;
${beforeFromAdditionalMethods ? '\n' + beforeFromAdditionalMethods + '\n': ''}
export class ${pascal(entity.name)}Service extends ${extendedType}<
  ${pascalSingular(entity.name)},
  MutationCreate${pascalSingular(entity.name)}Args,
  MutationUpdate${pascalSingular(entity.name)}Args,
  MutationRemove${pascalSingular(entity.name)}Args,
  QueryAll${pascalPlural(entity.name)}Args,
  ${pascalPlural(entity.name)}Types
> {
  constructor(public ctx: Context) {
    super(ctx, ctx.prisma.${camelSingular(entity.name)}, config);
    initBuiltInHooks(this);
    initUserHooks(this);
  }${codeFromAdditionalMethods ? '\n\n  ' + codeFromAdditionalMethods : ''}
}
`
};

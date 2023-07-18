import {
  pascalPlural,
  pascalSingular,
  camelPlural,
} from '../../../../../utils/cases'
import { EntityWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

export const backBaseResolversTmpl = ({
  entity,
  options,
}: EntityWideGenerationArgs) => `import {
  QueryAll${pascalPlural(entity.name)}Args,
  Query_All${pascalPlural(entity.name)}MetaArgs,
  Resolvers,
  MutationCreate${pascalSingular(entity.name)}Args,
  MutationUpdate${pascalSingular(entity.name)}Args,
  MutationRemove${pascalSingular(entity.name)}Args,${
  entity.type === 'document'
    ? `
  MutationRePost${pascalSingular(entity.name)}Args,
`
    : ''
}
} from '../../../../generated/graphql';
import {Context} from '../../../services/types';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const queryResolvers: Resolvers = {
  Query: {
    ${pascalSingular(entity.name)}: (_, {id}, {context}: {context: Context}) =>
      context.service('${camelPlural(entity.name)}').get(id),
    all${pascalPlural(entity.name)}:
      (_, params: QueryAll${pascalPlural(
    entity.name
  )}Args, {context}: {context: Context}) =>
        context.service('${camelPlural(entity.name)}').all(params),
    _all${pascalPlural(entity.name)}Meta:
      (_, params: Query_All${pascalPlural(
    entity.name
  )}MetaArgs, {context}: {context: Context}) =>
        context.service('${camelPlural(entity.name)}').meta(params),
  },
  Mutation: {
    create${pascalSingular(
      entity.name
    )}:
      (_, params: MutationCreate${pascalSingular(
    entity.name
  )}Args, {context}: {context: Context}) =>
        context.service('${camelPlural(entity.name)}').create(params, true),
    update${pascalSingular(
      entity.name
    )}:
      (_, params: MutationUpdate${pascalSingular(
    entity.name
  )}Args, {context}: {context: Context}) =>
        context.service('${camelPlural(entity.name)}').update(params, true),
    remove${pascalSingular(
      entity.name
    )}:
      (_, params: MutationRemove${pascalSingular(
    entity.name
  )}Args, {context}: {context: Context}) =>
        context.service('${camelPlural(entity.name)}').delete(params),${
  entity.type === 'document'
    ? `
    rePost${pascalSingular(
      entity.name
    )}:
      (_, params: MutationRePost${pascalSingular(
          entity.name
        )}Args, {context}: {context: Context}) =>
        context.service('${camelPlural(entity.name)}').rePost(params.id),`
    : ''
}
  },
};

export default queryResolvers;
`

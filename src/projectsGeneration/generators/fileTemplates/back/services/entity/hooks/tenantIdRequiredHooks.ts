import {EntityWideGenerationArgs} from '../../../../../../args'
import {pascalPlural, pascalSingular} from '../../../../../../../utils/cases'
import {printWarningIfRequired} from '../../../../../../utils'

export const tenantIdRequiredHooksTmpl = ({
  options,
  entity,
}: EntityWideGenerationArgs): string => {
  if (!['optional', 'required'].includes(entity.multitenancy)) {
    throw new Error(
      'Render this file only with optional or required multitenancy value'
    )
  }

  return `import {Context} from '../../types';
import {
  MutationRemove${pascalSingular(entity.name)}Args,
  QueryAll${pascalPlural(entity.name)}Args,
} from '../../../../generated/graphql';
import {
  StrictCreate${pascalSingular(entity.name)}Args,
  StrictUpdate${pascalSingular(entity.name)}Args,
} from '../${pascalPlural(entity.name)}Service';
${printWarningIfRequired(options)}
export const changeListFilter = async (
  ctx: Context,
  args: QueryAll${pascalPlural(entity.name)}Args,
): Promise<QueryAll${pascalPlural(entity.name)}Args> => {
  const tenantIds = await ctx.service('profile').getAllowedTenantIds();

  if (tenantIds.length) {
    if (!args.filter) {
      args.filter = {};
    }

    args.filter.tenantId_in = ${
      entity.multitenancy === 'required' || !entity.commonElementsVisibleToAll
        ? 'tenantIds'
        : '[null, ...tenantIds]'
    };
  }

  return args;
};

type Data = {createData: StrictCreate${pascalSingular(
    entity.name
  )}Args, updateData: StrictUpdate${pascalSingular(entity.name)}Args};

export const beforeUpsertStrict = async (
  ctx: Context,
  {createData, updateData}: Data,
): Promise<Data> => {
  const tenantIds = await ctx.service('profile').getAllowedTenantIds();
  if (tenantIds.length > 0 && (
    (createData.tenantId && !tenantIds.includes(createData.tenantId)) ||
    (updateData.tenantId && !tenantIds.includes(updateData.tenantId)))
  ) {
    throw new Error('Permission denied!');
  }

  return {createData, updateData};
};

export const beforeUpdate = async (
  ctx: Context,
  data: StrictUpdate${pascalSingular(entity.name)}Args,
): Promise<StrictUpdate${pascalSingular(entity.name)}Args> => {
  const tenantIds = await ctx.service('profile').getAllowedTenantIds();

  if (tenantIds.length > 0 && data.tenantId && !tenantIds.includes(data.tenantId)) {
    throw new Error('Permission denied!');
  }

  return data;
};

export const beforeDelete = async (
  ctx: Context,
  params: MutationRemove${pascalSingular(entity.name)}Args,
): Promise<void> => {
  const tenantIds = await ctx.service('profile').getAllowedTenantIds();
  if (!tenantIds.length) {
    return;
  }

  const entity = await ctx.service('${entity.name}').get(params.id);

  if (entity?.tenantId && !tenantIds.includes(entity.tenantId)) {
    throw new Error(\`Access to Master with id \${params.id} denied!\`);
  }
};
`
}

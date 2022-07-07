/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
import {
  Document,
  InfoRegistry,
  SumRegistry,
} from '../../../../../../builders/buildedTypes'
import { pascalPlural, pascalSingular } from '../../../../../../../utils/cases'
import { singular } from 'pluralize'
import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'
import { generatedWarning } from '../../../../../../utils'

export const getPostOperationsTmpl = (
  prefix: string,
  document: Document,
  allSumRegistries: Map<string, SumRegistry>,
  allInfoRegistries: Map<string, InfoRegistry>,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => {
  const docRegistries = document.registries.map((r) => {
    const sumRegistry = allSumRegistries.get(r)

    if (sumRegistry) {
      return sumRegistry
    }

    const infoRegistry = allInfoRegistries.get(r)

    if (!infoRegistry) {
      throw new Error(`There is no "${r}" registry`)
    }

    return infoRegistry
  })

  if (docRegistries.length > 0) {
    return getPostOperationsWithRegistriesTmpl(
      prefix,
      document,
      docRegistries,
      options
    )
  } else {
    return getPostOperationsBlankTmpl(prefix, document, options)
  }
}

const getPostOperationsWithRegistriesTmpl = (
  _prefix: string,
  document: Document,
  docRegistries: Array<SumRegistry | InfoRegistry>,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => {
  const contextName = 'Context'

  return `import {PrismaPromise} from '@prisma/client';
import {${contextName}} from '../../types';
import {getRegistryEntries} from './getRegistryEntries';
import {getUnPostOperations} from './getUnPostOperations';
import Entity from '../../../../types/Entity';
import {StrictUpdate${pascalSingular(
    document.name
  )}Args} from '../${pascalPlural(document.name)}Service';${
    document.registries.length > 0
      ? document.registries.map(
          (registry) => `
import {StrictCreate${pascalSingular(registry)}Args} from '../../${pascalPlural(
            registry
          )}Service/${pascalPlural(registry)}Service';`
        ).join(`
`)
      : ''
  }
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
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

export const getPostOperations = async (
  ctx: ${contextName},
  data: StrictUpdate${pascalSingular(document.name)}Args,
): Promise<PrismaPromise<any>[]> => {
  const cus = await getRegistryEntries(ctx, data);

  const customOps: PrismaPromise<any>[] = [];

  ${docRegistries
    .filter((r) => r.registrarDepended)
    .map(
      (r) => `customOps.push(
    ctx.prisma.${singular(r.name)}.deleteMany({
      where: {
        registrarTypeId: Entity.${pascalSingular(document.name)},
        registrarId: data.id,
      },
    }),
    ctx.prisma.${singular(r.name)}.createMany({
      data: cus.${singular(r.name)}.map(en => ({
        ...en,
        registrarTypeId: Entity.${pascalSingular(document.name)},
        registrarId: data.id,
      })),
    }),
  );`
    ).join(`
  `)}

  return Promise.all([
    getUnPostOperations(ctx, data.id),
    customOps,
  ]).then(ops => [...ops[0], ...ops[1]]);
};
`
}

const getPostOperationsBlankTmpl = (
  _prefix: string,
  document: Document,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => {
  const contextName = 'Context'

  return `import {PrismaPromise} from '@prisma/client';
import {
  MutationUpdate${pascalSingular(document.name)}Args,
} from '../../../../generated/graphql';
import {${contextName}} from '../../types';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
export interface ${pascalSingular(document.name)}RegistryEntries {
}

export const getPostOperations = async (
  _ctx: ${contextName},
  _data: MutationUpdate${pascalSingular(document.name)}Args,
): Promise<PrismaPromise<any>[]> => {
  return [];
};
`
}

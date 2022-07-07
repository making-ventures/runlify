import { Document } from '../../../../../../builders/buildedTypes'
import { singular } from 'pluralize'
import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'
import { generatedWarning } from '../../../../../../utils'

export const getUnPostOperationsTmpl = (
  _prefix: string,
  document: Document,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => {
  const contextName = 'Context'

  return `import {PrismaPromise} from '@prisma/client';
import {${contextName}} from '../../types';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
export const getUnPostOperations = async (ctx: ${contextName}, id: number): Promise<PrismaPromise<any>[]> => {
  const registries: any[] = [${document.registries
    .map((registry) => `\n    '${singular(registry)}',`)
    .join('')}
  ];

  return registries.map(registry => ctx.prisma[registry].deleteMany({
    where: {
      registrarTypeId: '${singular(document.name)}',
      registrarId: id,
    },
  }));
};
`
}

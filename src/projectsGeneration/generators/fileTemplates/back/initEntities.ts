import { pascalSingular } from '../../../../utils/cases'
import { ProjectWideGenerationArgs } from '../../../args'
import { generatedWarning, pad1 } from '../../../utils'

export const initEntities = ({
  system: { defaultLanguage },
  entities,
  options,
}: ProjectWideGenerationArgs) => {
  const contextName = 'Context'

  return `import {${contextName}} from '../../adm/services/types';
import Entity from '../../types/Entity';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const initEntities = async (ctx: ${contextName}) => {
  await ctx.service('entities').createMany([
${entities
  .map(
    (entity) => `  {
    id: Entity.${pascalSingular(entity.name)},
    title: '${entity.title[defaultLanguage].plural}',
  },`
  )
  .map(pad1)
  .join('\n')}
  ]);
};

export default initEntities;
`
}

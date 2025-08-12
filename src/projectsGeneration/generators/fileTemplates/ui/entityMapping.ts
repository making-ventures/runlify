import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../types'
import {camelPlural, pascalSingular} from '../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../args'

export const uiEntityMappingTmpl = (
  { entities }: ProjectWideGenerationArgs,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `export const mapping = {
  ${entities.map((m) => `${camelPlural(m.name)}: '${pascalSingular(m.name)}',`)
    .join(`
  `)}${options.projectPrefix === 'rlw' ? `\n  elasticMailingMessages: 'ElasticMailingMessage',`: ''}
};
`.trimStart()

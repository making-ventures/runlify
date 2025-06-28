import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../types'
import {camelPlural, pascalSingular} from '../../../../utils/cases'
import {printWarningIfRequired} from '../../../utils'
import {ProjectWideGenerationArgs} from '../../../args'

export const uiEntityMappingTmpl = (
  { entities }: ProjectWideGenerationArgs,
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `${printWarningIfRequired(options)}
export const mapping = {
  ${entities.map((m) => `${camelPlural(m.name)}: '${pascalSingular(m.name)}',`)
    .join(`
  `)}${options.projectPrefix === 'rlw' ? `\n  elasticMailingMessages: 'ElasticMailingMessage',`: ''}
};
`.trimStart()

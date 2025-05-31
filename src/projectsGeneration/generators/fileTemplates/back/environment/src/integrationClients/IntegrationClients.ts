import {pascal} from '../../../../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../../../../args'
import {printWarningIfRequired} from '../../../../../../utils'

const genIntegrationClientsTmpl = ({
  system: {
    integrationClients,
  },
  options,
}: ProjectWideGenerationArgs) => `${printWarningIfRequired(options)}
interface IntegrationClients ${integrationClients.length ? `{
${integrationClients.map(client => `  ${client.name}: ${pascal(client.name)}Client;`).join('\n')}
}` : '{}'}

export default IntegrationClients;
`.trimStart()

export default genIntegrationClientsTmpl;
import {pascal} from '../../../../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../../../../args'
import {printWarningIfRequired} from '../../../../../../utils'

const genIntegrationClientsTmpl = ({
  system: {
    integrationClients,
  },
  options,
}: ProjectWideGenerationArgs) => `${integrationClients.map(client => `import ${pascal(client.name)}Client from '../../integrationClients/${client.name}/${pascal(client.name)}Client';\n`).join('')}${printWarningIfRequired(options)}
interface IntegrationClients ${integrationClients.length ? `{
${integrationClients.map(client => `  ${client.name}: ${pascal(client.name)}Client;`).join('\n')}
}` : '{}'}

export default IntegrationClients;
`.trimStart()

export default genIntegrationClientsTmpl;
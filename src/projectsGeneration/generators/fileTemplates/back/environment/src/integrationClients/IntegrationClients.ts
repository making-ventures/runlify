import {pascal} from '../../../../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../../../../args'

const genIntegrationClientsTmpl = ({
  system: {integrationClients},
}: ProjectWideGenerationArgs) => `${integrationClients.map(client => `import ${pascal(client.name)}Client from '../../integrationClients/${client.name}/${pascal(client.name)}Client';\n`).join('')}
interface IntegrationClients ${integrationClients.length ? `{
${integrationClients.map(client => `  ${client.name}: ${pascal(client.name)}Client;`).join('\n')}
}` : '{}'}

export default IntegrationClients;
`.trimStart()

export default genIntegrationClientsTmpl;
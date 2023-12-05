import {pascal} from '../../../../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../../../../args'
import {generatedWarning} from '../../../../../../utils'

const genIntegrationClientConstrictorsTmpl = ({
  system: {
    integrationClients,
  },
  options,
}: ProjectWideGenerationArgs) => `import {IntegrationClientsConstrictors${integrationClients.length ? ', Context' : '' }} from './types';
${integrationClients.map(client => `import ${pascal(client.name)}Client from '../../integrationClients/${client.name}/${pascal(client.name)}Client';\n`).join('')}${
  options.skipWarningThisIsGenerated
    ? '\n'
    : `\n// ${generatedWarning}\n`
}
const integrationClientConstrictors: IntegrationClientsConstrictors = ${integrationClients.length ? `{
${integrationClients.map(client => `  ${client.name}: (context: Context) => new ${pascal(client.name)}Client(context),`).join('\n')}
};` : '{};'}

export default integrationClientConstrictors;
`

export default genIntegrationClientConstrictorsTmpl;

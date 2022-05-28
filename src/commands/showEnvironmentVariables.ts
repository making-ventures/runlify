import { GluegunToolbox } from 'gluegun'
import getEnvService from '../services/getEnvService'

module.exports = {
  name: 'showEnvironmentVariables',
  // alias: ['a'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const { getEnvVariables } = getEnvService(toolbox)

    const projectId = 'prj'
    const environmentId = 'anna_laznia'
    const scopes = ['back', 'worker', 'telegramBot']

    const variables = await getEnvVariables(projectId, environmentId, scopes)

    info(variables)
  },
}

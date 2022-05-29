import { GluegunToolbox } from 'gluegun'
import getEnvService from '../services/getEnvService'
import getLocalConfigService from '../services/getLocalConfigService'

module.exports = {
  name: 'showEnvironmentVariables',
  // alias: ['a'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const { getEnvVariables, getAvailableEnvironments } = getEnvService(toolbox)
    const { getConfig } = getLocalConfigService(toolbox)

    const config = getConfig()
    info(config)

    const projectId = config.main.projectName
    const scopes = ['back', 'worker', 'telegramBot']

    const availableEnvironments = await getAvailableEnvironments(
      config.main.projectName
      // [
      //   'back',
      //   'worker',
      //   'telegramBot',
      // ]
    )
    for (const env of availableEnvironments) {
      const variables = await getEnvVariables(projectId, env, scopes)

      info(variables)
      info(env)

      toolbox.filesystem.write(`./config/${env}.json`, variables)
    }
  },
}

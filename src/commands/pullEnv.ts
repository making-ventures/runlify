import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'pullEnv',
  // alias: ['a'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const { getAvailableEnvironments, getEnvVariables } = toolbox.cloudEnv
    const { getConfig } = toolbox.localConfig

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
    info(availableEnvironments)

    for (const env of availableEnvironments) {
      const variables = await getEnvVariables(projectId, env, scopes)

      // info(variables)
      info(env)

      toolbox.filesystem.write(`./config/${env}.json`, variables)
    }
  },
}

import {GluegunToolbox} from 'gluegun'

module.exports = {
  name: 'availableEnvironments',
  alias: ['a'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const { getAvailableEnvironments } = toolbox.cloudEnv
    // /environmentVariables
    const { getConfig } = toolbox.localConfig

    const config = getConfig()

    const availableEnvironments = await getAvailableEnvironments(
      config.main.projectName
      // [
      //   'back',
      //   'worker',
      //   'telegramBot',
      // ]
    )
    info(availableEnvironments)
  },
}

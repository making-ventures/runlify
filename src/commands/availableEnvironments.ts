import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'availableEnvironments',
  alias: ['a'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    info(`writeToken`)

    const envName = parameters.first
    info(`envName: ${envName}`)

    const command = parameters.second ?? ''
    info(`command: ${command}`)

    const commandArgs = parameters.array?.splice(2) ?? []
    info(`commandArgs`)
    info(commandArgs)

    const { getAvailableEnvironments } = toolbox.cloudEnv
    // /environmentVariables
    const { getConfig } = toolbox.localConfig

    const config = getConfig()
    info(config)

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

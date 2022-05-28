import { GluegunToolbox } from 'gluegun'
import getEnvService from '../services/getEnvService'

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

    const { getAvailableEnvironments } = getEnvService(toolbox)
    // /environmentVariables

    const varialbles = await getAvailableEnvironments(
      'prj'
      // [
      //   'back',
      //   'worker',
      //   'telegramBot',
      // ]
    )
    info(varialbles)
  },
}

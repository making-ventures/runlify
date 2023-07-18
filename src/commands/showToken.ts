import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'showToken',
  alias: ['s'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    info(`showToken`)

    const envName = parameters.first
    info(`envName: ${envName}`)

    const command = parameters.second ?? ''
    info(`command: ${command}`)

    const commandArgs = parameters.array?.splice(2) ?? []
    info(`commandArgs`)
    info(commandArgs)

    const { getConfigValue } = toolbox.globalConfig

    console.log(getConfigValue('token'))
  },
}

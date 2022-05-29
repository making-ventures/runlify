import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'logout',
  alias: ['o'],
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

    const { logout } = toolbox.auth

    await logout()
  },
}

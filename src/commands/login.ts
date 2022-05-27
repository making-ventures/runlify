import { GluegunToolbox } from 'gluegun'
import getAuth from '../utils/getAuth'

module.exports = {
  name: 'login',
  alias: ['l'],
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

    const { login } = getAuth(toolbox)

    await login()
  },
}

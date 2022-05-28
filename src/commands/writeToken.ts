import { GluegunToolbox } from 'gluegun'
import getConfigService from '../services/getConfigService'

module.exports = {
  name: 'writeToken',
  alias: ['w'],
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

    const { getConfig, getConfigValue, getConfigPath } =
      getConfigService(toolbox)

    console.log(getConfig())

    console.log(getConfig())

    console.log(getConfigValue('token'))

    console.log(getConfigPath())

    const { login } = await toolbox.prompt.ask({
      name: 'login',
      type: 'input',
      message: 'login',
    })
    console.log(login)

    const { password } = await toolbox.prompt.ask({
      name: 'password',
      type: 'password',
      message: 'password',
    })
    console.log(password)

    const endpoint = 'http://localhost:3000/'
    console.log(endpoint)
  },
}

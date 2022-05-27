import { GluegunToolbox } from 'gluegun'
import getConfigAccess from '../utils/getConfigAccess'

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

    const { getConfigValue } = getConfigAccess(toolbox)

    console.log(getConfigValue('token'))
  },
}

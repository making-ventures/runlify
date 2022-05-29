import { spawn } from 'cross-spawn'
import { GluegunToolbox } from 'gluegun'
import TermSignals from '../utils/TermSignals'
import { constantCase } from 'change-case'
import * as nconf from 'nconf'
import * as R from 'ramda'
import getLocalConfigService from '../services/getLocalConfigService'

nconf.env()

module.exports = {
  name: 'env',
  alias: ['e'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const { getConfig } = getLocalConfigService(toolbox)

    const config = getConfig()
    info(config)

    const envName = parameters.first || config.developer.defaultEnvironment
    info(`envName: ${envName}`)

    nconf.file({
      file: `./config/${envName}.json`,
      format: {
        stringify: JSON.stringify,
        parse: (str: string) =>
          R.fromPairs(
            R.toPairs(JSON.parse(str)).map(([key, value]) => [
              constantCase(key),
              value,
            ])
          ),
      },
    })

    const command = parameters.second ?? ''

    const commandArgs = parameters.array?.splice(2) ?? []

    // Execute the command with the given environment variables
    const proc = spawn(command, commandArgs, {
      stdio: 'inherit',
      shell: true,
      env: nconf.get(),
    })

    // Handle any termination signals for parent and child proceses
    const signals = new TermSignals()
    signals.handleUncaughtExceptions()
    signals.handleTermSignals(proc)
  },
}

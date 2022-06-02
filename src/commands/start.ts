import { spawn } from 'cross-spawn'
import { GluegunToolbox } from 'gluegun'
import TermSignals from '../utils/TermSignals'
import { constantCase } from 'change-case'
import * as nconf from 'nconf'
import * as R from 'ramda'

nconf.env()

module.exports = {
  name: 'start',
  alias: ['e'],
  run: async (toolbox: GluegunToolbox) => {
    const { parameters } = toolbox

    const { getConfig } = toolbox.localConfig

    const config = getConfig()

    const envDefined = parameters.first.startsWith('env=')
    const envName = envDefined
      ? parameters.first.replace('env', '')
      : config.developer.defaultEnvironment

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
    // toolbox.print.info('command')
    // toolbox.print.info(command)

    const commandArgs = parameters.argv?.splice(5) ?? []
    // toolbox.print.info('commandArgs')
    // toolbox.print.info(commandArgs)

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

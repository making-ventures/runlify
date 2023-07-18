import { spawn } from 'cross-spawn'
import { GluegunToolbox } from 'gluegun'
import TermSignals from '../utils/TermSignals'
import { constantCase } from 'change-case'
import nconf from 'nconf'
import * as R from 'ramda'

nconf.env()

module.exports = {
  name: 'start',
  alias: ['e'],
  run: async (toolbox: GluegunToolbox) => {
    const { parameters } = toolbox

    const { getConfig } = toolbox.localConfig

    const config = getConfig()

    const envDefined = parameters.first?.startsWith('env=')
    // toolbox.print.info('envDefined')
    // toolbox.print.info(envDefined)
    const envName = envDefined
      ? parameters.first?.replaceAll('env=', '')
      : config?.developer?.defaultEnvironment
    // toolbox.print.info('envName')
    // toolbox.print.info(envName)

    if (envName) {
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
    }

    const command = (envDefined ? parameters.second : parameters.first) ?? ''
    // toolbox.print.info('command')
    // toolbox.print.info(command)

    // toolbox.print.info('parameters.argv')
    // toolbox.print.info(parameters.argv)

    // toolbox.print.info('parameters.raw')
    // toolbox.print.info(parameters.raw)

    const commandArgs = parameters.argv?.slice(envDefined ? 5 : 4) ?? []
    // toolbox.print.info('commandArgs')
    // toolbox.print.info(commandArgs)

    // toolbox.print.info('parameters.argv?.slice(5)')
    // toolbox.print.info(parameters.argv?.slice(5))

    // toolbox.print.info('parameters.argv?.slice(4)')
    // toolbox.print.info(parameters.argv?.slice(4))

    // toolbox.print.info('parameters.argv?.slice(3)')
    // toolbox.print.info(parameters.argv?.slice(3))

    // toolbox.print.info('parameters.argv?.slice(2)')
    // toolbox.print.info(parameters.argv?.slice(2))

    // Execute the command with the given environment variables
    const proc = spawn(command, commandArgs, {
      stdio: 'inherit',
      shell: true,
      env: {
        ...nconf.get(),
        ...(envName ? {ENV: envName} : {}),
      },
    })

    // Handle any termination signals for parent and child proceses
    const signals = new TermSignals()
    signals.handleUncaughtExceptions()
    signals.handleTermSignals(proc)
  },
}

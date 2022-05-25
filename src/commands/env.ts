import { spawn } from 'cross-spawn'
import { GluegunToolbox } from 'gluegun'
import { TermSignals } from '../signal-termination'
import { constantCase } from 'change-case'
import * as nconf from 'nconf'
import * as R from 'ramda'

nconf.env()

module.exports = {
  name: 'env',
  alias: ['e'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    // const name = parameters.first

    // await generate({
    //   template: 'model.ts.ejs',
    //   target: `models/${name}-model.ts`,
    //   props: { name },
    // })

    // // echo $SOME
    // const env: Record<string, string> = {
    //   ...process.env,
    //   SOME: '000',
    // }
    // info(`env`)
    // info(env)

    // // info(JSON.stringify())
    info(parameters)
    // info(`Generated file at models/${name}-model.ts`)

    const envName = parameters.first
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
    info(`get`)
    info(nconf.get())

    // const withoutEnv = parameters.string.replace(`${envName} `, '')
    // // info(`withoutEnv: ${withoutEnv}`)

    const command = parameters.second
    info(`command: ${command}`)

    const commandArgs = parameters.array.splice(2)
    info(`commandArgs`)
    info(commandArgs)

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

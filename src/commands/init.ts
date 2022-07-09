import { GluegunToolbox } from 'gluegun'
import * as path from 'path'
import * as os from 'os'

module.exports = {
  name: 'init',
  alias: ['i'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info, warning },
    } = toolbox

    const projectName = parameters.first
    const projectCategory = parameters.second

    if (!toolbox.filesystem.exists('runlify.developer.example.json')) {
      await generate({
        template: 'runlify.developer.example.json.ejs',
        target: 'runlify.developer.example.json',
      })
      info('Generated runlify.developer.example.json')
    }

    if (!toolbox.filesystem.exists('runlify.json')) {
      await generate({
        template: 'runlify.json.ejs',
        target: 'runlify.json',
        props: { projectName, projectCategory },
      })
      info('Generated runlify.json')
    }

    if (
      !(await toolbox.patching.exists('.gitignore', 'runlify.developer.json'))
    ) {
      info(
        '.gitignore does not contains "runlify.developer.json", appending it'
      )
      await toolbox.patching.append('.gitignore', '\nrunlify.developer.json\n')
    }

    if (!toolbox.filesystem.exists('runlify.developer.json')) {
      toolbox.filesystem.copy(
        'runlify.developer.example.json',
        'runlify.developer.json'
      )
      info('Copied runlify.developer.example.json to runlify.developer.json')
    }

    const hasYarn = toolbox.packageManager.hasYarn()
    info(`hasYarn: ${hasYarn}`)
    if (hasYarn) {
      const pathEnv = process.env.PATH
      info(`pathEnv: ${pathEnv}`)

      const yarnBin = await toolbox.system.exec('yarn global bin')

      const hasYarnBinInPath = pathEnv?.includes(yarnBin)
      info(`hasYarnBinInPath: ${hasYarnBinInPath}`)

      if (!hasYarnBinInPath) {
        const tryToAddToProfile = async (pathEnv: string) => {
          info(`tryToAddToProfile, pathEnv: ${pathEnv}`)
          info(
            `toolbox.filesystem.exists(pathEnv): ${toolbox.filesystem.exists(
              pathEnv
            )}`
          )
          if (!toolbox.filesystem.exists(pathEnv)) {
            return
          }

          const hasYarnBinInProfile = await toolbox.patching.exists(
            pathEnv,
            'yarn global bin'
          )
          info(`hasYarnBinInProfile: ${hasYarnBinInProfile}`)

          if (hasYarnBinInProfile) {
            return
          }

          const { addYarnBinToProfile } = await toolbox.prompt.ask({
            name: 'addYarnBinToProfile',
            message: `Would you like to add yarn bin to ${pathEnv}?`,
            type: 'confirm',
            initial: true,
          })
          info(`addYarnBinToProfile: ${addYarnBinToProfile}`)

          if (addYarnBinToProfile) {
            await toolbox.filesystem.append(
              pathEnv,
              '\nexport PATH="$(yarn global bin):$PATH"\n'
            )
          }
        }

        if (os.platform() === 'win32') {
          warning(`You should add "${await toolbox.system.exec(
            'yarn global bin'
          )}" to your Path environment variable.
How-to in eng: https://helpdeskgeek.com/windows-10/add-windows-path-environment-variable/
How-to in ru: https://remontka.pro/environment-variables-windows/
Then restart your computer.
After restart double check that Path environment variable was updated by you.`)
        } else {
          // toolbox.filesystem.file(
          //   path.join(toolbox.filesystem.homedir(), '.bashrc')
          // )
          await tryToAddToProfile(
            path.join(toolbox.filesystem.homedir(), '.bashrc')
          )
          // await tryToAddToProfile(`${toolbox.filesystem.homedir}/.bash_profile
          await tryToAddToProfile(
            path.join(toolbox.filesystem.homedir(), '.zshrc')
          )
        }
      }
    }
  },
}

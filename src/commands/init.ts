import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'init',
  alias: ['i'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info },
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
    if (hasYarn) {
      const path = process.env.PATH

      const yarnBin = await toolbox.system.exec('yarn global bin')

      const hasYarnBinInPath = path.includes(yarnBin)

      if (!hasYarnBinInPath) {
        const profile = `${toolbox.filesystem.homedir}/.profile`

        if (!toolbox.filesystem.exists(profile)) {
          return
        }

        const hasYarnBinInProfile = await toolbox.patching.exists(
          profile,
          'yarn global bin'
        )

        if (hasYarnBinInProfile) {
          return
        }

        const { addYarnBinToProfile } = await toolbox.prompt.ask({
          name: 'addYarnBinToProfile',
          message: 'Would you like to add yarn bin to profile?',
          type: 'confirm',
          initial: true,
        })

        if (addYarnBinToProfile) {
          await toolbox.filesystem.append(
            profile,
            '\nexport PATH="$(yarn global bin):$PATH"\n'
          )
        }
      }
    }
  },
}

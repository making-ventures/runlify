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
      info(`Copied runlify.developer.example.json to runlify.developer.json`)
    }
  },
}

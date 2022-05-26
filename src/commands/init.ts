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

    await generate({
      template: 'runlify.developer.example.json.ejs',
      target: `runlify.developer.example.json`,
    })
    info(`Generated runlify.developer.example.json`)

    await generate({
      template: 'runlify.json.ejs',
      target: `runlify.json`,
      props: { projectName, projectCategory },
    })
    info(`Generated runlify.json`)
  },
}

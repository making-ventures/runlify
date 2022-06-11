import { GluegunToolbox } from 'gluegun'

module.exports = async (toolbox: GluegunToolbox) => {
  const getConfig = () => {
    const runlifyConfig = toolbox.filesystem.read('./runlify.json', 'json')
    const developerRunlifyConfig = toolbox.filesystem.read(
      './runlify.developer.json',
      'json'
    )
    // toolbox.print.info(runlifyConfig)
    // toolbox.print.info(developerRunlifyConfig)

    return {
      main: runlifyConfig,
      developer: developerRunlifyConfig,
    }
  }

  toolbox.localConfig = {
    getConfig,
  }
}

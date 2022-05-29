import { GluegunToolbox } from 'gluegun'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getLocalConfigService = (toolbox: GluegunToolbox) => {
  const getConfig = () => {
    const runlifyConfig = toolbox.filesystem.read('./runlify.json', 'json')
    const developerRunlifyConfig = toolbox.filesystem.read(
      './runlify.developer.example.json',
      'json'
    )
    // toolbox.print.info(runlifyConfig)
    // toolbox.print.info(developerRunlifyConfig)

    return {
      main: runlifyConfig,
      developer: developerRunlifyConfig,
    }
  }

  return {
    getConfig,
  }
}

export default getLocalConfigService

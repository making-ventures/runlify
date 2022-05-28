import { GluegunToolbox } from 'gluegun'
import getMetaService from '../services/getMetaService'

module.exports = {
  name: 'tryGetMeta',
  alias: ['m'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const { getMeta } = getMetaService(toolbox)

    const res = await getMeta('prj')
    info(res)
  },
}

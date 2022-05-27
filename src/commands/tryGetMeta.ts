import { GluegunToolbox } from 'gluegun'
import getMetaAccess from '../utils/getMetaAccess'

module.exports = {
  name: 'tryGetMeta',
  alias: ['m'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const { getMeta } = getMetaAccess(toolbox)

    const res = await getMeta('prj')
    info(res)
  },
}

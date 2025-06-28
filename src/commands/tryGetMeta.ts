import {GluegunToolbox} from 'gluegun'

module.exports = {
  name: 'tryGetMeta',
  alias: ['m'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const { getMeta } = toolbox.cloudMeta

    const res = await getMeta('prj')
    info(res)
  },
}

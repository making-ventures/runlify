import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'readEnv',
  alias: ['r'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      // parameters,
      print: { info },
    } = toolbox

    // echo $SOME

    // info(JSON.stringify())
    // info(process.env)
    info('readEnv')
    info('SOME')
    info(process.env.SOME)
    info('DATABASE_URI')
    info(process.env.DATABASE_URI)
    info('database.uri')
    info(process.env['database.uri'])
  },
}

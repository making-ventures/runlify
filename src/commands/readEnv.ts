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
    info('DATABASE_MAIN_WRITE_URI')
    info(process.env.DATABASE_MAIN_WRITE_URI)
    info('database.main.write.uri')
    info(process.env['database.main.write.uri'])
  },
}

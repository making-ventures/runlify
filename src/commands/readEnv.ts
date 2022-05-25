import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'readEnv',
  alias: ['r'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      // parameters,
      print: { info },
    } = toolbox

    // const name = parameters.first

    // await generate({
    //   template: 'model.ts.ejs',
    //   target: `models/${name}-model.ts`,
    //   props: { name },
    // })

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

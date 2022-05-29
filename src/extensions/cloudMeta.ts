import { GluegunToolbox } from 'gluegun'

module.exports = async (toolbox: GluegunToolbox) => {
  const {
    print: { info, error, warning },
  } = toolbox

  const getMeta = async (project: string) => {
    const { removeToken } = toolbox.auth
    const { getConfigValue } = toolbox.globalConfig

    const token = getConfigValue('token')
    info(`token: ${token}`)

    if (!token) {
      warning(`
You should login first:

    runlify login
`)
      process.exit()
    }

    const endpoint = 'http://localhost:3000'
    const http = await toolbox.http.create({ baseURL: endpoint })
    const res = await http.get<any>(
      `/rest/cli/projectMeta/${project}`,
      {},
      {
        headers: {
          authorization: token,
        },
      }
    )
    info(res)
    if (res.status === 401) {
      removeToken()
      error('Unauthorized')
      process.exit()
    }
  }

  toolbox.cloudMeta = { getMeta }
}

import { GluegunToolbox } from 'gluegun'

module.exports = async (toolbox: GluegunToolbox) => {
  const {
    print: { info, error, warning },
  } = toolbox
  const endpoint = 'https://prj-ep.prod.apps.stage01.making.ventures'

  const getMeta = async (project: string) => {
    const { removeToken } = toolbox.auth
    const { getConfigValue } = toolbox.globalConfig

    const token = getConfigValue('token')

    if (!token) {
      warning(`
You should login first:

    runlify login
`)
      process.exit()
    }
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

    if (!res.ok) {
      error(`Error. Status: ${res.status}`)
      error(res.data)
      process.exit()
    }
  }

  toolbox.cloudMeta = { getMeta }
}

import { GluegunToolbox } from 'gluegun'
import getAuth from '../utils/getAuth'
import getConfigService from './getConfigService'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getMetaService = (toolbox: GluegunToolbox) => {
  const { removeToken } = getAuth(toolbox)
  const { getConfigValue } = getConfigService(toolbox)
  const {
    print: { info, error, warning },
  } = toolbox

  const getMeta = async (project: string) => {
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

  return {
    getMeta,
  }
}

export default getMetaService

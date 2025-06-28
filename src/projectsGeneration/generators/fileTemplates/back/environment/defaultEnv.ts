import * as R from 'ramda'
import {ProjectWideGenerationArgs} from '../../../../args'

export const backDefaultEnv = ({ system }: ProjectWideGenerationArgs) =>
  JSON.stringify(
    R.fromPairs(
      system.configVars
        .filter((v) => v.scopes.includes('back'))
        .map((v) => [v.name, v.default])
    ),
    null,
    2
  )

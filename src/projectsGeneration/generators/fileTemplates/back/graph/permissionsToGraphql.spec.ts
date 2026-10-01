import {expect} from 'jest-without-globals'
import {ProjectWideGenerationArgs} from '../../../../args'
import {defaultBootstrapEntityOptions} from '../../../../types'
import {backPermissionToGraphqlTmpl} from './permissionsToGraphql'

// yarn test --testPathPattern "back/graph/permissionsToGraphql"

const makeArgs = (graphSchemaMode: 'files' | 'runtime_meta'): ProjectWideGenerationArgs =>
  ({
    entities: [{name: 'cards'}, {name: 'boxes'}],
    options: {
      ...defaultBootstrapEntityOptions,
      graphSchemaMode,
    },
  } as unknown as ProjectWideGenerationArgs)

describe('backPermissionToGraphqlTmpl', () => {
  test("'files' mode (default): still imports and maps every entity's permissionsToGraphql", () => {
    const src = backPermissionToGraphqlTmpl(makeArgs('files'))

    expect(src).toContain(
      "import cardsPermissionToGraphql from './services/cards/permissionsToGraphql';"
    )
    expect(src).toContain(
      "import boxesPermissionToGraphql from './services/boxes/permissionsToGraphql';"
    )
    expect(src).toContain('cards: cardsPermissionToGraphql')
    expect(src).toContain('boxes: boxesPermissionToGraphql')
  })

  test("'runtime_meta' mode: drops entity imports/map entries, keeps help + additionalServices", () => {
    const src = backPermissionToGraphqlTmpl(makeArgs('runtime_meta'))

    expect(src).not.toContain('cardsPermissionToGraphql')
    expect(src).not.toContain('boxesPermissionToGraphql')
    expect(src).toContain('...additionalServicesPermissionToGraphql')
    expect(src).toContain('help: helpPermissionToGraphql')
  })
})

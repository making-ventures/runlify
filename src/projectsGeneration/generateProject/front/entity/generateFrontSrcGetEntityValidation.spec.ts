import {expect} from 'jest-without-globals'
import SystemMetaBuilder from '../../../builders/SystemMetaBuilder'
import {
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
} from '../../../args'
import {defaultBootstrapEntityOptions} from '../../../types'
import {FileCreator} from '../../types'
import generateFrontSrcGetEntityValidation from './generateFrontSrcGetEntityValidation'

// yarn test --testPathPattern generateFrontSrcGetEntityValidation

const uiProject = '/ui'

const generateFor = (uiPagesMode: 'legacy' | 'descriptor') => {
  const system = new SystemMetaBuilder('test')

  const accountLevels = system.addCatalog('accountLevels')
  accountLevels.addField('title').setType('string')

  if (uiPagesMode === 'descriptor') {
    accountLevels.getForms().setUiPagesMode(uiPagesMode)
  }

  const projectArgs = prepareProjectWideGenerationArgs(system.build(), {
    ...defaultBootstrapEntityOptions,
    detachedBackProject: '/back',
    detachedUiProject: uiProject,
  })

  const created: string[] = []
  const fileCreator: FileCreator = {
    create: (path) => {
      created.push(path.slice(`${uiProject}/`.length))
    },
    createIfNotExists: (path) => {
      created.push(path.slice(`${uiProject}/`.length))
    },
  }

  generateFrontSrcGetEntityValidation(
    fileCreator,
    prepareEntityWideGenerationArgs(projectArgs, projectArgs.allEntities.get('accountLevels')!),
  )

  return created
}

describe('generateFrontSrcGetEntityValidation', () => {
  test('legacy mode writes the validation file', () => {
    expect(generateFor('legacy')).toEqual([
      'src/adm/pages/accountLevels/getAccountLevelValidation.tsx',
    ])
  })

  test('descriptor mode writes nothing — the schema is built at runtime', () => {
    expect(generateFor('descriptor')).toEqual([])
  })
})

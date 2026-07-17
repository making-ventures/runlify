import {expect} from 'jest-without-globals'
import {join} from 'path'
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from './generationPaths'
import {GenerationPathsBuilder} from './GenerationPathsBuilder'

// yarn test --testPathPattern generationPaths

describe('resolveGenerationPath', () => {
  const detachedBackProject = 'D:/work/rlw-back'
  const detachedUiProject = 'D:/work/rlw-ui'

  test('default back hook path matches legacy join layout', () => {
    const path = resolveGenerationPath({
      category: GenerationPathCategory.BackHookBeforeCreate,
      detachedBackProject,
      detachedUiProject,
      pathsConfig: null,
      vars: {ServiceName: 'UsersService'},
    })

    expect(path).toBe(
      join(detachedBackProject, 'src/adm/services/UsersService/hooks/beforeCreate.ts'),
    )
  })

  test('override changes only the overridden category', () => {
    const pathsConfig = new GenerationPathsBuilder()
      .setPath(
        GenerationPathCategory.BackHookBeforeCreate,
        'src/custom/hooks/{ServiceName}/beforeCreate.ts',
      )
      .build()

    const overridden = resolveGenerationPath({
      category: GenerationPathCategory.BackHookBeforeCreate,
      detachedBackProject,
      detachedUiProject,
      pathsConfig,
      vars: {ServiceName: 'UsersService'},
    })
    const defaultPath = resolveGenerationPath({
      category: GenerationPathCategory.BackHookAfterCreate,
      detachedBackProject,
      detachedUiProject,
      pathsConfig,
      vars: {ServiceName: 'UsersService'},
    })

    expect(overridden).toBe(
      join(detachedBackProject, 'src/custom/hooks/UsersService/beforeCreate.ts'),
    )
    expect(defaultPath).toBe(
      join(detachedBackProject, 'src/adm/services/UsersService/hooks/afterCreate.ts'),
    )
  })

  test('rejects unknown placeholder in template', () => {
    expect(() =>
      new GenerationPathsBuilder().setPath(
        GenerationPathCategory.BackHookBeforeCreate,
        'src/{unknownParam}/beforeCreate.ts',
      ),
    ).toThrow('Unknown generation path placeholder "{unknownParam}"')
  })

  test('rejects missing vars on resolve', () => {
    expect(() =>
      resolveGenerationPath({
        category: GenerationPathCategory.BackHookBeforeCreate,
        detachedBackProject,
        detachedUiProject,
        pathsConfig: null,
        vars: {},
      }),
    ).toThrow(
      'Missing generation path variable "{ServiceName}" for category "back.hook.beforeCreate"',
    )
  })
})

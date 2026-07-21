import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'fs'
import {tmpdir} from 'os'
import {join} from 'path'
import {expect} from 'jest-without-globals'
import {findConfigUp} from './localConfig'

describe('findConfigUp', () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'runlify-local-config-'))
  })

  afterEach(() => {
    rmSync(root, {recursive: true, force: true})
  })

  test('finds runlify.json in parent directories', () => {
    const repoRoot = join(root, 'rlw')
    const backDir = join(repoRoot, 'apps', 'back')

    mkdirSync(backDir, {recursive: true})
    writeFileSync(join(repoRoot, 'runlify.json'), '{"monorepo":true}')

    expect(findConfigUp(backDir, 'runlify.json')).toBe(
      join(repoRoot, 'runlify.json'),
    )
  })

  test('returns null when config does not exist', () => {
    const backDir = join(root, 'apps', 'back')
    mkdirSync(backDir, {recursive: true})

    expect(findConfigUp(backDir, 'runlify.json')).toBeNull()
  })
})

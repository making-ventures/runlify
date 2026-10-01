import {expect} from 'jest-without-globals'
import SystemMetaBuilder from '../../../../../builders/SystemMetaBuilder'
import {
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
} from '../../../../../args'
import {defaultBootstrapEntityOptions} from '../../../../../types'
import {buildEntityDescriptorData} from './buildEntityDescriptorData'
import {uiDescriptorTypesTmpl} from './descriptorTypes'

// yarn test --testPathPattern descriptorTypes

/** Ключи верхнего уровня интерфейса из текста шаблона (вложенные объекты не считаются). */
const getInterfaceKeys = (text: string, name: string): string[] => {
  const marker = `export interface ${name} {`
  const start = text.indexOf(marker)

  if (start < 0) {
    throw new Error(`There is no "${name}" interface in the template`)
  }

  const keys: string[] = []
  let depth = 0
  let buffer = ''
  let index = start + marker.length

  const flush = () => {
    const matched = /^\s*(\w+)\??\s*:/.exec(buffer)

    if (matched) {
      keys.push(matched[1])
    }

    buffer = ''
  }

  while (index < text.length) {
    const char = text[index]

    if (char === '/' && text[index + 1] === '/') {
      index = text.indexOf('\n', index)

      if (index < 0) {
        break
      }

      continue
    }

    if (char === '{') {
      depth += 1
    }

    if (char === '}') {
      if (depth === 0) {
        flush()
        break
      }

      depth -= 1
    }

    if (depth === 0 && (char === ';' || char === '\n')) {
      flush()
    } else {
      buffer += char
    }

    index += 1
  }

  return keys
}

const getData = () => {
  const system = new SystemMetaBuilder('test')

  const cities = system.addCatalog('cities')
  cities.addField('title').setType('string')

  const accountLevels = system.addCatalog('accountLevels')
  accountLevels.addLinkField('cities', 'cityId')
  accountLevels.getForms().setUiPagesMode('descriptor')

  const profiles = system.addCatalog('mdProfiles')
  profiles.addLinkField('accountLevels', 'accountLevelId')

  const projectArgs = prepareProjectWideGenerationArgs(system.build(), {
    ...defaultBootstrapEntityOptions,
  })

  return buildEntityDescriptorData(
    prepareEntityWideGenerationArgs(projectArgs, projectArgs.allEntities.get('accountLevels')!),
  )
}

describe('uiDescriptorTypesTmpl', () => {
  const template = uiDescriptorTypesTmpl()

  test('exports all descriptor types', () => {
    expect(template).toContain('export type EntityPageType =')
    expect(template).toContain('export type DescriptorFieldType =')
    expect(template).toContain('export type DescriptorFilterOp =')
    expect(template).toContain('export interface DescriptorField {')
    expect(template).toContain('export interface DescriptorFilterField {')
    expect(template).toContain('export interface DescriptorDependencyTab {')
    expect(template).toContain('export interface EntityDescriptorData {')
    expect(template).toContain(
      'export type EntityDescriptor<TSlots = Record<string, unknown>> = EntityDescriptorData & {slots: TSlots};',
    )
  })

  test('EntityDescriptorData keys match the built data', () => {
    expect(getInterfaceKeys(template, 'EntityDescriptorData').sort()).toEqual(
      Object.keys(getData()).sort(),
    )
  })

  test('DescriptorField keys match the built fields', () => {
    const data = getData()
    const interfaceKeys = getInterfaceKeys(template, 'DescriptorField')
    const builtKeys = new Set(data.fields.flatMap((field) => Object.keys(field)))

    for (const key of builtKeys) {
      expect(interfaceKeys).toContain(key)
    }

    // all the non-optional keys are filled for every field
    const requiredKeys = interfaceKeys.filter((key) => !template.includes(`  ${key}?:`))

    for (const field of data.fields) {
      expect(Object.keys(field).sort()).toEqual(
        expect.arrayContaining(requiredKeys.sort()),
      )
    }

    // link is filled for link fields only
    expect(interfaceKeys).toContain('link')
    expect(Object.keys(data.fields.find((f) => f.category === 'link')!)).toContain('link')
  })

  test('DescriptorFilterField keys match the built filter fields', () => {
    const data = getData()

    expect(getInterfaceKeys(template, 'DescriptorFilterField').sort()).toEqual(
      Object.keys(data.filterFields[0]).sort(),
    )
  })

  test('DescriptorDependencyTab keys match the built tabs', () => {
    const data = getData()

    expect(getInterfaceKeys(template, 'DescriptorDependencyTab').sort()).toEqual(
      Object.keys(data.dependencyTabs[0]).sort(),
    )
  })
})

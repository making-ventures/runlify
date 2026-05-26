import {expect} from 'jest-without-globals'
import CatalogBuilder from '../../../builders/CatalogBuilder'
import {
  genDeployConnectionPrisma,
  genPrismaSchemaForEntitiesWithClientAdnDb,
} from './genPrismaSchemaForEntitiesWithClientAdnDb'
import {ProjectWideGenerationArgs} from '../../../args'
import {defaultBootstrapEntityOptions} from '../../../types'
import {System} from '../../../builders/buildedTypes'

const minimalArgs = (entities: ProjectWideGenerationArgs['entities']): ProjectWideGenerationArgs => ({
  system: {
    name: 'test',
    prefix: 'test',
    dataBases: [{name: 'main'}, {name: 'bsDocuments'}],
    commands: [],
    configVars: [],
    catalogs: [],
    documents: [],
    infoRegistries: [],
    sumRegistries: [],
    languages: [],
    defaultLanguage: 'ru',
    deployEnvironments: [],
    glossary: [],
    telegramBots: [],
    reports: [],
    restApis: [],
    integrationClients: [],
    workers: [],
    roles: [],
    menuItems: [],
    pages: [],
    additionalServices: [],
    labels: [],
    generalModels: [],
    inputModels: [],
    outputModels: [],
    methods: [],
    back: {} as System['back'],
  } as System,
  entities,
  allEntities: new Map(entities.map((e) => [e.name, e])),
  allSumRegistries: new Map(),
  allInfoRegistries: new Map(),
  allDocuments: new Map(),
  allCatalogs: new Map(),
  allLinks: [],
  additionalServices: [],
  options: defaultBootstrapEntityOptions,
})

describe('genPrismaSchemaForEntitiesWithClientAdnDb', () => {
  const cards = new CatalogBuilder('cards', 'ru')
  cards.addField('name').setType('string').setRequired()
  const cardEntity = cards.build()

  it('legacy main schema uses prisma-client-js and datasource url', () => {
    const result = genPrismaSchemaForEntitiesWithClientAdnDb(minimalArgs([cardEntity]), {
      database: 'main',
      forShards: false,
      prismaMajor: 6,
    })
    expect(result).toContain('provider = "prisma-client-js"')
    expect(result).toContain('previewFeatures = ["metrics"]')
    expect(result).toContain('url      = env("DATABASE_MAIN_WRITE_URI")')
    expect(result).not.toContain('output   = "./generated/client"')
  })

  it('P7 main schema uses prisma-client and generated output', () => {
    const result = genPrismaSchemaForEntitiesWithClientAdnDb(minimalArgs([cardEntity]), {
      database: 'main',
      forShards: false,
      prismaMajor: 7,
    })
    expect(result).toContain('provider = "prisma-client"')
    expect(result).not.toContain('previewFeatures')
    expect(result).not.toContain('url      = env(')
    expect(result).toContain('output   = "./generated/client"')
  })

  it('P7 extra DB schema uses ./client output', () => {
    const docEntity = {...cardEntity, database: 'bsDocuments'}
    const result = genPrismaSchemaForEntitiesWithClientAdnDb(minimalArgs([docEntity]), {
      database: 'bsDocuments',
      forShards: false,
      prismaMajor: 7,
    })
    expect(result).toContain('output   = "./client"')
  })

  it('legacy deploy schema includes generator', () => {
    const result = genDeployConnectionPrisma('main', 6)
    expect(result).toContain('generator client')
    expect(result).toContain('url      = env("DATABASE_MAIN_MIGRATION_URI")')
  })

  it('P7 deploy schema is datasource-only', () => {
    const result = genDeployConnectionPrisma('main', 7)
    expect(result).toBe(`datasource db {
  provider = "postgresql"
}
`)
  })
})

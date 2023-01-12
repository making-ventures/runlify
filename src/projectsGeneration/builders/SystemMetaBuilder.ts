import {
  BootstrapEntityOptions,
  EntityWithOptions,
  EntityBuilderWithOptions,
  defaultBootstrapEntityOptions,
} from '../types'
import CatalogBuilder from './CatalogBuilder'
import DocumentBuilder from './DocumentBuilder'
import { InfoRegistryBuilder } from './InfoRegistryBuilder'
import SumRegistryBuilder, { RegistryOptions } from './SumRegistryBuilder'
import {
  Command,
  ConfigValue,
  ConfigVar,
  ConfigVarScope,
  DeployEnvironment,
  FieldType,
  Glossary,
  MemoryAndCpu,
  ProjectCategory,
  System,
} from './buildedTypes'
import { addFilesCatalog } from '../defaultCatalogs/files'
import * as R from 'ramda'
import ReportBuilder from './ReportBuilder'
import RestApiBuilder from './RestApiBuilder'
import WorkerBuilder from './WorkerBuilder'
import RoleBuilder from './RoleBuilder'
import TelegramBotBuilder from './TelegramBotBuilder'

export const defaultConfigVar: Omit<ConfigVar, 'name' | 'type'> = {
  needFor: '',
  default: '',
  required: true,
  scopes: ['back', 'worker', 'telegramBot'],
}

class SystemMetaBuilder {
  catalogs: EntityBuilderWithOptions<CatalogBuilder>[] = []
  reports: EntityBuilderWithOptions<ReportBuilder>[] = []
  documents: EntityBuilderWithOptions<DocumentBuilder>[] = []
  infoRegistries: EntityBuilderWithOptions<InfoRegistryBuilder>[] = []
  sumRegistries: EntityBuilderWithOptions<SumRegistryBuilder>[] = []
  configVars: ConfigVar[] = []
  glossary: Glossary[] = []
  commands: Command[] = []
  deployEnvironments: DeployEnvironment[] = []
  telegramBots: TelegramBotBuilder[] = []
  languages: string[] = []
  restApis: RestApiBuilder[] = []
  workers: WorkerBuilder[] = []
  roles: RoleBuilder[] = []
  defaultLanguage: string
  defOpts: BootstrapEntityOptions

  name = 'notSet'
  prefix = 'notSet'
  needFor = 'notSet'

  requests: MemoryAndCpu = { memory: '128Mi', cpu: '0.15' }
  limits: MemoryAndCpu = { memory: '256Mi', cpu: '1' }

  // space = '';
  constructor(
    prefix: string,
    defOpts: BootstrapEntityOptions = defaultBootstrapEntityOptions,
    defaultLanguage = 'ru'
  ) {
    this.defOpts = defOpts
    this.setPrefix(prefix)
    this.setName(prefix)
    this.addConfigVar(
      'app.name',
      'string',
      true,
      this.defOpts.projectPrefix,
      'Техническое название приложения'
    )
    this.addConfigVar(
      'app.title',
      'string',
      false,
      this.defOpts.projectName,
      'Человеческое название приложения'
    )
    this.addConfigVar(
      'app.environment',
      'string',
      true,
      'dev',
      'Название окружения'
    )

    this.addConfigVar(
      'database.uri',
      'string',
      true,
      'postgresql://postgres:password@localhost:5432',
      'Строка подключения к основной базе данных'
    )

    this.addConfigVar(
      'adm.jwt.secret',
      'string',
      false,
      'admSecret',
      'Секрет для подписи JWT-токенов приложения админки'
    )
    this.addConfigVar(
      'app.jwt.secret',
      'string',
      false,
      'appSecret',
      'Секрет для подписи JWT-токенов приложения пользователей'
    )

    this.addConfigVar(
      's3.accessKeyId',
      'string',
      false,
      '',
      'Идентификатор доступа для авторизации в S3'
    )
    this.addConfigVar(
      's3.secretAccessKey',
      'string',
      false,
      '',
      'Секретный ключ для авторизации в S3'
    )

    this.addConfigVar(
      'admin.recaptcha.secretKey',
      'string',
      false,
      '',
      'Секретный токен рекапчи приложения админки'
    )
    this.addConfigVar(
      'admin.recaptcha.requiredScore',
      'float',
      false,
      0.7,
      'Требуемый уровень доверия к пользователю'
    )
    this.addConfigVar(
      'admin.recaptcha.publicKey',
      'string',
      false,
      '',
      'Публичный токен рекапчи приложения админки',
      ['admin-app']
    )

    this.addConfigVar(
      'customer.recaptcha.secretKey',
      'string',
      false,
      '',
      'Секретный токен рекапчи приложения пользователя'
    )
    this.addConfigVar(
      'customer.recaptcha.requiredScore',
      'string',
      false,
      '0.7',
      'Требуемый уровень доверия к пользователю'
    )
    this.addConfigVar(
      'customer.recaptcha.publicKey',
      'string',
      false,
      '',
      'Публичный токен рекапчи приложения пользователя',
      ['cutomer-app']
    )

    this.addConfigVar(
      'loki.url',
      'string',
      false,
      '',
      'Урл для доступа в Loki. Используется для запроса бизнес-логов'
    )

    this.addConfigVar(
      'logs.format',
      'string',
      false,
      'plain',
      'Формат логов (plain | json)'
    )

    this.addConfigVar(
      'graphql.playground.enabled',
      'bool',
      false,
      true,
      'Включение graphql playground (true | false)'
    )

    // kafka
    this.addConfigVar('kafka.enabled', 'bool', false, false, 'Кафка включена');
    this.addConfigVar('kafka.brokers', 'string', false, 'localhost:29092;localhost:29094', 'Список kafka блокеров');
    this.addConfigVar('kafka.username', 'string', false, '', 'Username доступа в kafka');
    this.addConfigVar('kafka.password', 'string', false, '', 'Пароль доступа в kafka');
    this.addConfigVar('kafka.queue.maxAttemptsSize', 'int', false, 10, 'Максимальное количество попыток обработки ошибки на сообщение');
    this.addConfigVar('kafka.queue.defaultRetryTime', 'int', false, 20000, 'Время паузы после первой ошибки, например 20000 мс, потом оно увеличывается экспоненциально с мультипликатором 1.5');
    this.addConfigVar('kafka.queue.waitingInterruptTime', 'int', false, 60000, 'Время паузы в очереди ожидания, когда она прошла все сообщения, это чтобы она не крутила сообщения покругу без остановки ');
    this.addConfigVar('kafka.queue.stackSize', 'int', false, 3, 'Количество сообщений, обрабатываемых параллельно');
    this.addConfigVar('kafka.queue.supportedVersion', 'string', false, '1;2', 'Поддерживаемые версии сообщения');
    // this.addConfigVar('kafka.queue.autoCommitInterval', 'int', false, 10000, 'Потребитель будет фиксировать смещения по истечении заданного периода, например, пяти секунд. Значение в миллисекундах  ');
    // this.addConfigVar('kafka.queue.autoCommitThreshold', 'int', false, 1000, 'Потребитель будет фиксировать смещения после разрешения заданного количества сообщений, например тысячи сообщений');
    this.addConfigVar('kafka.queue.acks', 'int', false, 1, '`-1`(all) все несинхронизированные реплики должны подтвердить (по умолчанию), `0` нет подтверждений, `1` только ждет подтверждения лидера');
    this.addConfigVar('kafka.ssl.rejectUnauthorized', 'bool', false, false, 'Запрещать невалидный ssl сертификат');

    // es
    this.addConfigVar('es.enabled', 'bool', false, false, 'Эластик включен');
    this.addConfigVar('es.cloudId', 'string', false, '', 'Идентификатор аккаунта в облачном сервисе ElasticSearch');
    this.addConfigVar('es.username', 'string', false, '', 'Пользователь для авторизации в облачном сервисе ElasticSearch');
    this.addConfigVar('es.password', 'string', false, '', 'Пароль для авторизации в облачном сервисе ElasticSearch');
    this.addConfigVar('es.node', 'string', false, 'http://localhost:9200', 'Нода эластика');
    this.addConfigVar('es.tls.rejectUnauthorized', 'bool', false, false, 'Запрещать невалидный ssl сертификат');

    this.addDeployEnvironment('stage', 'stage')
    this.addDeployEnvironment('prod', 'stage')
    this.addLanguage('en')
    this.addLanguage('ru')
    if (defaultLanguage !== 'defaultLanguage') {
      this.addLanguage(defaultLanguage)
    }

    this.defaultLanguage = defaultLanguage

    // this.addTelegramBot('hello');

    this.initDefaultCatalogs()

    // this
    //   .addWorker('general', 'Таски общего назначения')
    //   .setNeedFor('Для выполнения тасков общего назначения');

    // this
    //   .addWorker('emails', 'Отправка почты')
    //   .setNeedFor('Для отправки почты');
  }

  setName(name: string) {
    this.name = name

    return this
  }

  setNeedFor(needFor: string) {
    this.needFor = needFor

    return this
  }

  setPrefix(prefix: string) {
    this.prefix = prefix

    return this
  }


  // | 'string'
  // | 'int'
  // | 'bigint'
  // | 'float'
  // | 'bool'
  // | 'datetime'
  // | 'date'

  addConfigVar<T extends FieldType>(
    name: string,
    type: T,
    required: boolean,
    def: ConfigValue<T> | undefined,
    needFor: string,
    scopes: ConfigVarScope[] = ['back', 'worker', 'telegramBot']
  ) {
    if (this.configVars.some((v) => v.name === name)) {
      throw new Error(`"${name}" config var already exists`)
    }

    this.configVars.push(
      R.mergeDeepLeft(
        {
          name,
          type,
          required,
          default: def,
          needFor,
          scopes,
        } as ConfigVar,
        defaultConfigVar
      ) as ConfigVar
    )

    return this
  }

  setConfigVarDefaultValue<T extends FieldType>(
    name: string,
    def: ConfigValue<T> | undefined,
  ) {
    if (!this.configVars.some((v) => v.name === name)) {
      throw new Error(`There is no "${name}" config var`)
    }

    this.configVars = this.configVars.map(el => el.name === name ? {...el, default: def} as ConfigVar : el)

    return this
  }

  setDefaultValueForConfigVar(name: string, def: string) {
    const variable = this.configVars.find((v) => v.name === name)

    if (!variable) {
      throw new Error(`There is no "${name}" config var`)
    }

    this.configVars = [
      ...this.configVars.filter((v) => v.name !== name),
      {
        ...variable,
        default: def,
      },
    ]

    return this
  }

  addLanguage(language: string) {
    if (!this.languages.includes(language)) {
      this.languages.push(language)
    }
  }

  setDefailtLanguage(language: string) {
    if (!this.languages.includes(language)) {
      throw new Error(`There is no "${language}" langiage`)
    }

    this.defaultLanguage = language
  }

  addDeployEnvironment(name: string, clusterName: string) {
    this.deployEnvironments.push({ name, clusterName })

    return this
  }

  addTelegramBot(name: string, title?: string) {
    if (this.telegramBots.some((f) => f.name === name)) {
      throw new Error(`There is already telegramBot with name "${name}"`)
    }

    const telegramBot = new TelegramBotBuilder(
      name,
      this.defaultLanguage,
      title
    )

    this.telegramBots.push(telegramBot)

    return telegramBot
  }

  // catalogs
  getCatalogs(): EntityBuilderWithOptions[] {
    return this.catalogs
  }

  addCatalog(
    name: string,
    title?: {
      singular?: string,
      plural?: string,
    },
    options = this ? this.defOpts : ({} as any)
  ) {
    if (
      [...this.catalogs, ...this.documents].some((f) => f.entity.name === name)
    ) {
      throw new Error(`There is already entity with name "${name}"`)
    }

    const catalog = new CatalogBuilder(name, this.defaultLanguage, title)
    // if (['aloyal'].includes(options.projectPrefix)) {
    catalog.setPreviewFeature('classService');
    // }

    this.catalogs.push({ entity: catalog, options })

    return catalog
  }

  getCatalogByName(name: string) {
    const catalog = this.catalogs.find((c) => c.entity.name === name)

    if (!catalog) {
      throw new Error(`There is no "${name}" catalog`)
    }

    return catalog.entity
  }

  getInfoRegistryByName(name: string) {
    const infoRegistry = this.infoRegistries.find((c) => c.entity.name === name)

    if (!infoRegistry) {
      throw new Error(`There is no "${name}" infoRegistry`)
    }

    return infoRegistry.entity
  }

  addRestApi(name: string, path: string, title?: string) {
    if (this.restApis.some((f) => f.name === name)) {
      throw new Error(`There is already rest api with name "${name}"`)
    }

    if (this.restApis.some((f) => f.path === path)) {
      throw new Error(`There is already rest api with path "${path}"`)
    }

    const restApi = new RestApiBuilder(name, path, this.defaultLanguage, title)

    this.restApis.push(restApi)

    return restApi
  }

  addWorker(name: string, title?: string) {
    if (this.workers.some((f) => f.name === name)) {
      throw new Error(`There is already rest api with name "${name}"`)
    }

    const worker = new WorkerBuilder(name, this.defaultLanguage, title)

    this.workers.push(worker)

    return worker
  }

  addManyToManyRelation(
    name: string,
    title?: {
      singular?: string,
      plural?: string,
    },
    options = this ? this.defOpts : ({} as any)
  ) {
    if (
      [...this.catalogs, ...this.documents].some((f) => f.entity.name === name)
    ) {
      throw new Error(
        `There is already entity with name "${name}". Entity ${this.name}`
      )
    }

    const catalog = new CatalogBuilder(name, this.defaultLanguage, title)

    this.catalogs.push({ entity: catalog, options })

    return catalog
  }

  // documents
  getDocuments(): EntityBuilderWithOptions<DocumentBuilder>[] {
    return this.documents
  }

  addDocument(
    name: string,
    title?: {
      singular?: string,
      plural?: string,
    },
    options = this ? this.defOpts : ({} as any)
  ) {
    if (
      [...this.catalogs, ...this.documents].some((f) => f.entity.name === name)
    ) {
      throw new Error(
        `There is already entity with name "${name}". Entity ${this.name}`
      )
    }

    const document = new DocumentBuilder(name, this.defaultLanguage, title)
    // if (['aloyal'].includes(options.projectPrefix)) {
      document.setPreviewFeature('classService');
    // }

    this.documents.push({ entity: document, options })

    return document
  }

  addReport(
    name: string,
    title?: string,
    options = this ? this.defOpts : ({} as any)
  ) {
    if (this.reports.some((f) => f.entity.name === name)) {
      throw new Error(
        `There is already report with name "${name}". Entity ${this.name}`
      )
    }

    const report = new ReportBuilder(name, this.defaultLanguage, title)

    this.reports.push({ entity: report, options })

    return report
  }

  addInfoRegistry(
    name: string,
    registrarDepended: boolean,
    title?: {
      singular?: string,
      plural?: string,
    },
    options = this ? this.defOpts : ({} as any)
  ) {
    if (
      [...this.catalogs, ...this.documents].some((f) => f.entity.name === name)
    ) {
      throw new Error(
        `There is already entity with name "${name}". Entity ${this.name}`
      )
    }

    const infoRegistry = new InfoRegistryBuilder(
      name,
      registrarDepended,
      this.defaultLanguage,
      title
    )

    this.infoRegistries.push({ entity: infoRegistry, options })

    return infoRegistry
  }

  addSumRegistry(
    name: string,
    registrarDepended: boolean,
    title?: {
      singular?: string,
      plural?: string,
    },
    options?: RegistryOptions,
  ) {
    if (
      [...this.catalogs, ...this.documents].some((f) => f.entity.name === name)
    ) {
      throw new Error(
        `There is already entity with name "${name}". Entity ${this.name}`
      )
    }

    const sumRegistry = new SumRegistryBuilder(
      name,
      registrarDepended,
      this.defaultLanguage,
      title,
      options,
    )

    this.sumRegistries.push({ entity: sumRegistry, options: this.defOpts })

    return sumRegistry
  }

  addGlossaryTerm(term: string, definition: string) {
    if (this.glossary.some((g) => g.term === term)) {
      throw new Error(`There is already term "${term}" in glossary`)
    }

    this.glossary.push({ term, definition })

    return this
  }

  addCommnad(
    projectCategory: ProjectCategory,
    name: string,
    command: string,
    needFor: string
  ) {
    if (this.commands.some((g) => g.name === name)) {
      throw new Error(`There is already "${name}" command`)
    }

    this.commands.push({
      projectCategory,
      name,
      command,
      needFor,
    })

    return this
  }

  getEntities(): EntityWithOptions[] {
    return [...this.catalogs, ...this.documents].map((el) => ({
      entity: el.entity.build(),
      options: el.options,
    }))
  }

  setMemory(request: string, limit?: string) {
    this.requests.memory = request

    if (limit) {
      this.limits.memory = limit
    } else {
      this.limits.memory = request
    }

    return this
  }

  setCpu(request: string, limit?: string) {
    this.requests.cpu = request

    if (limit) {
      this.limits.cpu = limit
    } else {
      this.limits.cpu = request
    }

    return this
  }

  build(): System {
    const sortByName = <T extends { entity: { name: string } }>(entries: T[]) =>
      R.sortBy(
        R.compose(R.prop('name') as any, R.prop('entity')),
        entries
      ) as T[]

    return {
      name: this.name,
      prefix: this.prefix,
      needFor: this.needFor,
      deployEnvironments: this.deployEnvironments,
      glossary: R.sortBy(R.prop('term'), this.glossary),
      commands: R.sortBy(R.prop('command'), this.commands),
      telegramBots: R.sortBy(R.prop('name'), this.telegramBots).map((el) =>
        el.build()
      ),
      configVars: R.sortBy(R.prop('name'), this.configVars),
      catalogs: sortByName(this.catalogs).map((el) => el.entity.build()),
      documents: sortByName(this.documents).map((el) => el.entity.build()),
      infoRegistries: sortByName(this.infoRegistries).map((el) =>
        el.entity.build()
      ),
      sumRegistries: sortByName(this.sumRegistries).map((el) =>
        el.entity.build()
      ),
      languages: this.languages.sort(),
      defaultLanguage: this.defaultLanguage,
      reports: sortByName(this.reports).map(({ entity }) => entity.build()),
      restApis: R.sortBy(R.prop('name'), this.restApis).map((api) =>
        api.build()
      ),
      workers: R.sortBy(R.prop('name'), this.workers).map((worker) =>
        worker.build()
      ),
      roles: R.sortBy(R.prop('name'), this.roles).map((role) => role.build()),
      back: {
        requests: this.requests,
        limits: this.limits,
      },
    }
  }

  initDefaultCatalogs(): EntityBuilderWithOptions<CatalogBuilder>[] {
    addFilesCatalog(this)

    return this.catalogs
  }
}

export default SystemMetaBuilder

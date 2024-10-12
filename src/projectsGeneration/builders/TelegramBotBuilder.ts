import { MemoryAndCpu, TelegramBot } from './buildedTypes'
import BaseBuilder from './BaseBuilder'

class TelegramBotBuilder extends BaseBuilder {
  replicas: number = 1
  requests: MemoryAndCpu = { memory: '192Mi', cpu: '0.15', maxOldSpaceSize: 173 }
  limits: MemoryAndCpu = { memory: '192Mi', cpu: '0.15', maxOldSpaceSize: 173 }
  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})
  }

  build(): TelegramBot {
    return {
      ...super.build(),
      type: 'telegramBot',
      replicas: this.replicas,
      requests: this.requests,
      limits: this.limits,
    }
  }

  setReplicas(replicas: number) {
    this.replicas = replicas

    return this
  }

  setMemory(request: string, limit?: string) {
    this.requests.memory = request

    if (limit) {
      this.limits.memory = limit
    } else {
      this.limits.memory = request
    }

    this.limits.maxOldSpaceSize = Math.ceil(Number.parseInt(this.limits.memory.replace('Mi', ''), 10) * 0.9)
    this.requests.maxOldSpaceSize = Math.ceil(Number.parseInt(this.requests.memory.replace('Mi', ''), 10) * 0.9)

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
}

export default TelegramBotBuilder

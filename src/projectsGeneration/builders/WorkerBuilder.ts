import { MemoryAndCpu, Worker } from './buildedTypes'
import BaseBuilder from './BaseBuilder'

class WorkerBuilder extends BaseBuilder {
  requests: MemoryAndCpu = { memory: '64Mi', cpu: '0.15' }
  limits: MemoryAndCpu = { memory: '64Mi', cpu: '0.15' }

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, title)
  }

  build(): Worker {
    return {
      name: this.name,
      title: this.title,
      needFor: this.needFor,
      materialUiIcon: this.materialUiIcon,
      requests: this.requests,
      limits: this.limits,
    }
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
}

export default WorkerBuilder

import { MemoryAndCpu, Worker } from './buildedTypes'
import BaseBuilder from './BaseBuilder'

class DeploymentBuilder extends BaseBuilder {
  replicas: number = 1
  requests: MemoryAndCpu = { memory: '64Mi', cpu: '0.15' }
  limits: MemoryAndCpu = { memory: '64Mi', cpu: '0.15' }

  constructor(name: string, defaultLanguage: string, title?: string) {
    super(name, defaultLanguage, {singular: title})
  }

  build(): Worker {
    return {
      ...super.build(),
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

export default DeploymentBuilder

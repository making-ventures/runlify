import {
  validateGenerationPathTemplate,
  type GenerationPathCategory,
  type GenerationPathTemplate,
  type GenerationPathsConfig,
} from './generationPaths'

export class GenerationPathsBuilder {
  private overrides: GenerationPathsConfig['overrides'] = {}

  setPath(
    category: GenerationPathCategory,
    template: GenerationPathTemplate,
  ): this {
    validateGenerationPathTemplate(template)
    this.overrides[category] = template
    return this
  }

  build(): GenerationPathsConfig {
    return {overrides: {...this.overrides}}
  }
}

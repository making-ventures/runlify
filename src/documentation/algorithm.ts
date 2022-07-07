export interface AlgorithmStepDocumentation {
  description: string
  steps?: AlgorithmStepDocumentation[]
}

export interface AlgorithmDocumentation {
  title: string
  steps: AlgorithmStepDocumentation[]
}

import { AlgorithmDocumentation, AlgorithmStepDocumentation } from './algorithm'
import { Doc, DocListElement } from './doc'

const algoritmToDoc = (algorithm: AlgorithmDocumentation): Doc => {
  const stepToDocListElement = (
    step: AlgorithmStepDocumentation
  ): DocListElement => ({
    text: step.description,
    list: step.steps ? step.steps.map(stepToDocListElement) : [],
  })

  return {
    rootGroup: {
      title: algorithm.title,
      children: [
        {
          block: {
            type: 'orderedList',
            list: algorithm.steps.map(stepToDocListElement),
          },
          children: [],
        },
      ],
    },
  }
}

export default algoritmToDoc

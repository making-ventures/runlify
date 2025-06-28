import {AdditionalService, AdditionalServiceObjectReturnModel, ServiceReturnType} from '../../../../builders/buildedTypes'

const getObjectModelsFromMethodReturns = (service: AdditionalService): AdditionalServiceObjectReturnModel[] =>
  service.methods
    .map(m => m.returnModel)
    .filter(m => m.returnType === ServiceReturnType.Object) as AdditionalServiceObjectReturnModel[]

export default getObjectModelsFromMethodReturns;

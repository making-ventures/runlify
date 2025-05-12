import {pascalCase} from 'change-case'
import {pascal} from '../../../../../../utils/cases'
import tsModelTmpl from '../../environment/src/integrationClients/tsModelTmpl'
import {AdditionalService, AdditionalServiceObjectReturnModel, ServiceReturnType, TsModel} from '../../../../../builders/buildedTypes'
import {getMethodTypeForService} from './getMethodTypeForService'

export const backAdditionalServiceTypesTmplInner =
  (service: AdditionalService) =>
    `${service.methods
      .flatMap(q => [q.argsModel, q.returnModel.returnType === ServiceReturnType.Object ? q.returnModel : undefined])
      .filter(Boolean)
      .map(m => tsModelTmpl(m as TsModel)).join('\n\n')}
${
  service.methods.filter((method) => method.returnModel.returnType === ServiceReturnType.Object).map(m => `// export type ${pascalCase(m.name)}Result = ${pascalCase(m.name)}Model${(m.returnModel as AdditionalServiceObjectReturnModel).array ? '[]' : ''}`).join('\n\n')
}
export interface I${pascal(service.name)}Service ${service.methods.length ? `{
${service.methods.map(m => `  ${getMethodTypeForService(m)}`).join('\n')}
}` : '{}'}`.trimStart()

import {ServiceMethod} from '../../../../../builders/buildedTypes'
import {fieldToTsTypeFieldWithType} from '../../environment/src/integrationClients/fieldToTsTypeFieldWithType'
import {getMethodTypeForServiceReturn} from './getMethodTypeForServiceReturn'

export const getMethodTypeForService = (method: ServiceMethod) =>
  `${method.name}: (${method.argsModel.fields.map(fieldToTsTypeFieldWithType).join(', ')}) => ${getMethodTypeForServiceReturn(method)}`

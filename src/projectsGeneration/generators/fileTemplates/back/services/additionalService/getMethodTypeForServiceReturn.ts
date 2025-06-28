import {pascal} from '../../../../../../utils/cases';
import {ServiceMethod, ServiceReturnType} from '../../../../../builders/buildedTypes'

export const getMethodTypeForServiceReturn = (method: ServiceMethod) => {
  const returnModel = method.returnModel;
  let baseReturn: string;

  switch (returnModel.returnType) {
    case ServiceReturnType.Void:
      baseReturn = 'void';
      break;
    case ServiceReturnType.Object:
      if (returnModel.array) {
        baseReturn = `${pascal(returnModel.name)}[]`;
      } else {
        baseReturn = pascal(returnModel.name);
      }
      break;
    case ServiceReturnType.Scalar:
      if (returnModel.array) {
        baseReturn = `${returnModel.type}[]`;
      } else {
        baseReturn = returnModel.type;
      }
      break;
  }

  return method.async ?  `Promise<${baseReturn}>` : baseReturn;
}

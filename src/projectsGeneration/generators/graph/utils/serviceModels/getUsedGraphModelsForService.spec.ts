import { expect } from 'jest-without-globals'
import { getUsedGraphModelsForService } from './getUsedGraphModelsForService'
import { MethodType } from '../../../../builders/buildedTypes';
import AdditionalServiceBuilder from '../../../../builders/AdditionalServiceBuilder';

// yarn test --testPathPattern getUsedGraphModelsForService

describe('getUsedGraphModelsForService', () => {
  describe('for args model', () => {
    it('it doesn\'t returns method arg models', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someGerenalModel', 'objectField').setRequired();

      const {inputModels} = getUsedGraphModelsForService(service.build());

      expect(inputModels).toIncludeSameMembers([someGerenalModel.build()]);
    });
  });
});

import { expect } from 'jest-without-globals'
import { getUsedModelsForService } from './getUsedModelsForService'
import { MethodType } from '../../../../builders/buildedTypes';
import AdditionalServiceBuilder from '../../../../builders/AdditionalServiceBuilder';

// yarn test --testPathPattern getUsedModelsForService

const addUnusedModels = (service: AdditionalServiceBuilder) => {
  const unusedGeneralModel = service.createGeneralModel('unusedGeneralModel');
  unusedGeneralModel.addField('fieldOfModel').setType('string').setRequired();

  const unusedInputModel = service.createInputModel('unusedInputModel');
  unusedInputModel.addField('fieldOfModel').setType('string').setRequired();

  const unusedOutputModel = service.createOutputModel('unusedOutputModel');
  unusedOutputModel.addField('fieldOfModel').setType('string').setRequired();
}

describe('getUsedModelsForService', () => {
  describe('for args model', () => {
    it('returns args and general model for args model with link to general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someGerenalModel', 'objectField').setRequired();

      const {inputModels} = getUsedModelsForService(service.build());

      expect(inputModels).toIncludeSameMembers([someGerenalModel.build(), someMethodArgs.build()]);
    });

    it('returns args and input model for args model with link to input model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someInputModel', 'objectField').setRequired();

      const {inputModels} = getUsedModelsForService(service.build());

      expect(inputModels).toIncludeSameMembers([someInputModel.build(), someMethodArgs.build()]);
    });

    it('returns args and two general models for args model with link to general model that itself has link to another general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someSecondGerenalModel = service.createGeneralModel('someSecondGerenalModel');
      someSecondGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addModelField('someSecondGerenalModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someGerenalModel', 'objectField').setRequired();

      const {inputModels} = getUsedModelsForService(service.build());

      expect(inputModels).toIncludeSameMembers([someGerenalModel.build(), someSecondGerenalModel.build(), someMethodArgs.build()]);
    });

    it('returns args, general and input models for args model with link to general model that itself has link to another input model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addField('fieldOfModel').setType('string').setRequired();

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addModelField('someInputModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someGerenalModel', 'objectField').setRequired();

      const {inputModels} = getUsedModelsForService(service.build());

      expect(inputModels).toIncludeSameMembers([someGerenalModel.build(), someInputModel.build(), someMethodArgs.build()]);
    });

    it('returns args, general and input models for args model with link to input model that itself has link to general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addModelField('someGerenalModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someInputModel', 'objectField').setRequired();

      const {inputModels} = getUsedModelsForService(service.build());

      expect(inputModels).toIncludeSameMembers([someGerenalModel.build(), someInputModel.build(), someMethodArgs.build()]);
    });

    it('returns args and two input models for args model with link to input model that itself has link to another input model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someSecondInputModel = service.createInputModel('someSecondInputModel');
      someSecondInputModel.addField('fieldOfModel').setType('string').setRequired();

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addModelField('someSecondInputModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someInputModel', 'objectField').setRequired();

      const {inputModels} = getUsedModelsForService(service.build());

      expect(inputModels).toIncludeSameMembers([someSecondInputModel.build(), someInputModel.build(), someMethodArgs.build()]);
    });

    it('throws if args model has link to output model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someOutputModel = service.createOutputModel('someOutputModel');
      someOutputModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someOutputModel', 'objectField').setRequired();

      expect(() => getUsedModelsForService(service.build()))
        .toThrow(new Error('Can\'t find model "someOutputModel", models: unusedGeneralModel, unusedInputModel, someMethodArgs'));
    });
  });

  describe('for return model', () => {
    it('returns return model and general model for return model with link to general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someGerenalModel', 'objectField').setRequired();

      const {outputModels} = getUsedModelsForService(service.build());

      expect(outputModels).toIncludeSameMembers([someGerenalModel.build(), someMethodReturn.build()]);
    });

    it('returns return model and output model for return model with link to output model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someOutputModel = service.createOutputModel('someOutputModel');
      someOutputModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someOutputModel', 'objectField').setRequired();

      const {outputModels} = getUsedModelsForService(service.build());

      expect(outputModels).toIncludeSameMembers([someOutputModel.build(), someMethodReturn.build()]);
    });

    it('returns return model and two general models for return model with link to general model that itself has link to another general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someSecondGerenalModel = service.createGeneralModel('someSecondGerenalModel');
      someSecondGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addModelField('someSecondGerenalModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someGerenalModel', 'objectField').setRequired();

      const {outputModels} = getUsedModelsForService(service.build());

      expect(outputModels).toIncludeSameMembers([someGerenalModel.build(), someSecondGerenalModel.build(), someMethodReturn.build()]);
    });

    it('returns return model, general and output models for return model with link to general model that itself has link to another output model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someOutputModel = service.createOutputModel('someOutputModel');
      someOutputModel.addField('fieldOfModel').setType('string').setRequired();

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addModelField('someOutputModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someGerenalModel', 'objectField').setRequired();

      const {outputModels} = getUsedModelsForService(service.build());

      expect(outputModels).toIncludeSameMembers([someGerenalModel.build(), someOutputModel.build(), someMethodReturn.build()]);
    });

    it('returns return model, general and output models for return model with link to output model that itself has link to general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someOutputModel = service.createOutputModel('someOutputModel');
      someOutputModel.addModelField('someGerenalModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someOutputModel', 'objectField').setRequired();

      const {outputModels} = getUsedModelsForService(service.build());

      expect(outputModels).toIncludeSameMembers([someGerenalModel.build(), someOutputModel.build(), someMethodReturn.build()]);
    });

    it('returns return model and two output models for return model with link to output model that itself has link to another output model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someSecondOutputModel = service.createOutputModel('someSecondOutputModel');
      someSecondOutputModel.addField('fieldOfModel').setType('string').setRequired();

      const someOutputModel = service.createOutputModel('someOutputModel');
      someOutputModel.addModelField('someSecondOutputModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someOutputModel', 'objectField').setRequired();

      const {outputModels} = getUsedModelsForService(service.build());

      expect(outputModels).toIncludeSameMembers([someSecondOutputModel.build(), someOutputModel.build(), someMethodReturn.build()]);
    });

    it('throws if return model has link to input model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someInputModel', 'objectField').setRequired();

      expect(() => getUsedModelsForService(service.build()))
        .toThrow(new Error('Can\'t find model "someInputModel", models: unusedGeneralModel, unusedOutputModel, someMethodResult'));
    });
  });

  describe('handling general models', () => {
    it('returns general model for return model with link to general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someGerenalModel', 'objectField').setRequired();

      const {generalModels} = getUsedModelsForService(service.build());

      expect(generalModels).toIncludeSameMembers([someGerenalModel.build()]);
    });

    it('returns empty array for return model with link to output model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someOutputModel = service.createOutputModel('someOutputModel');
      someOutputModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someOutputModel', 'objectField').setRequired();

      const {generalModels} = getUsedModelsForService(service.build());

      expect(generalModels).toBeEmpty();
    });

    it('returns two general models for return model with link to general model that itself has link to another general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someSecondGerenalModel = service.createGeneralModel('someSecondGerenalModel');
      someSecondGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addModelField('someSecondGerenalModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someGerenalModel', 'objectField').setRequired();

      const {generalModels} = getUsedModelsForService(service.build());

      expect(generalModels).toIncludeSameMembers([someGerenalModel.build(), someSecondGerenalModel.build()]);
    });

    it('returns general model for return model with link to general model that itself has link to another output model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someOutputModel = service.createOutputModel('someOutputModel');
      someOutputModel.addField('fieldOfModel').setType('string').setRequired();

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addModelField('someOutputModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someGerenalModel', 'objectField').setRequired();

      const {generalModels} = getUsedModelsForService(service.build());

      expect(generalModels).toIncludeSameMembers([someGerenalModel.build()]);
    });

    it('returns general model for return model with link to output model that itself has link to general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someOutputModel = service.createOutputModel('someOutputModel');
      someOutputModel.addModelField('someGerenalModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someOutputModel', 'objectField').setRequired();

      const {generalModels} = getUsedModelsForService(service.build());

      expect(generalModels).toIncludeSameMembers([someGerenalModel.build()]);
    });

    it('returns empty array for return model with link to output model that itself has link to another output model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someSecondOutputModel = service.createOutputModel('someSecondOutputModel');
      someSecondOutputModel.addField('fieldOfModel').setType('string').setRequired();

      const someOutputModel = service.createOutputModel('someOutputModel');
      someOutputModel.addModelField('someSecondOutputModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someOutputModel', 'objectField').setRequired();

      const {generalModels} = getUsedModelsForService(service.build());

      expect(generalModels).toBeEmpty();
    });
  });

  describe('for return and args model', () => {
    it('returns return model and general model for return model with link to general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      addUnusedModels(service);

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodReturn = someMethod.setReturnObjectModel('result');
      someMethodReturn.addModelField('someGerenalModel', 'objectField').setRequired();

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someGerenalModel', 'objectField').setRequired();

      const {
        inputModels,
        outputModels,
      } = getUsedModelsForService(service.build());

      expect(inputModels).toIncludeSameMembers([someGerenalModel.build(), someMethodArgs.build()]);
      expect(outputModels).toIncludeSameMembers([someGerenalModel.build(), someMethodReturn.build()]);
    });
  });
});

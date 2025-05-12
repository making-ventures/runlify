import { expect } from 'jest-without-globals'
import { prefixServiceModelsWithServiceName } from './prefixServiceModelsWithServiceName'
import { MethodType } from '../../../../builders/buildedTypes';
import AdditionalServiceBuilder from '../../../../builders/AdditionalServiceBuilder';
import { pascal } from '../../../../../utils/cases';
import { getServiceModels } from './getServiceModels';

// yarn test --testPathPattern prefixServiceModelsWithServiceName

describe('prefixServiceModelsWithServiceName', () => {
  describe('from args', () => {
    it('prefixes general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someGerenalModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = prefixServiceModelsWithServiceName(service.name, models);

      expect(inputModels).toPartiallyContain({name: `${pascal(service.name)}${pascal(someGerenalModel.name)}`});
    });

    it('prefixes input model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someInputModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = prefixServiceModelsWithServiceName(service.name, models);

      expect(inputModels).toPartiallyContain({name: `${pascal(service.name)}${pascal(someInputModel.name)}`});
    });

    it('prefixes general model and next general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someSecondGerenalModel = service.createGeneralModel('someSecondGerenalModel');
      someSecondGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addModelField('someSecondGerenalModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someGerenalModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = prefixServiceModelsWithServiceName(service.name, models);

      const mappedSomeGerenalModelName = `${pascal(service.name)}${pascal(someGerenalModel.name)}`;
      const mappedSomeSecondGerenalModelName = `${pascal(service.name)}${pascal(someSecondGerenalModel.name)}`;

      expect(inputModels).toPartiallyContain({name: mappedSomeSecondGerenalModelName});
      expect(inputModels).toPartiallyContain({name: mappedSomeGerenalModelName});

      const mappedSomeGerenalModel = inputModels.find(m => m.name === mappedSomeGerenalModelName);
      expect(mappedSomeGerenalModel!.fields).toPartiallyContain({model: mappedSomeSecondGerenalModelName});
    });

    it('prefixes general model and doesn\'t prefix next input model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addField('fieldOfModel').setType('string').setRequired();

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addModelField('someInputModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someGerenalModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = prefixServiceModelsWithServiceName(service.name, models);

      const mappedSomeGerenalModelName = `${pascal(service.name)}${pascal(someGerenalModel.name)}`;
      const mappedSomeInputModelName = `${pascal(service.name)}${pascal(someInputModel.name)}`;

      expect(inputModels).toPartiallyContain({name: mappedSomeInputModelName});
      expect(inputModels).toPartiallyContain({name: mappedSomeGerenalModelName});

      const mappedSomeGerenalModel = inputModels.find(m => m.name === mappedSomeGerenalModelName);
      expect(mappedSomeGerenalModel!.fields).toPartiallyContain({model: mappedSomeInputModelName});
    });

    it('prefixes input model and prefixes next general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someGeneralModel = service.createGeneralModel('someGeneralModel');
      someGeneralModel.addField('fieldOfModel').setType('string').setRequired();

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addModelField('someGeneralModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someInputModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = prefixServiceModelsWithServiceName(service.name, models);

      const mappedSomeInputMModelName = `${pascal(service.name)}${pascal(someInputModel.name)}`;
      const mappedSomeSecondInputModelName = `${pascal(service.name)}${pascal(someGeneralModel.name)}`;

      expect(inputModels).toPartiallyContain({name: mappedSomeSecondInputModelName});
      expect(inputModels).toPartiallyContain({name: mappedSomeInputMModelName});

      const mappedSomeGerenalModel = inputModels.find(m => m.name === mappedSomeInputMModelName);
      expect(mappedSomeGerenalModel!.fields).toPartiallyContain({model: mappedSomeSecondInputModelName});
    });

    it('prefixes input model and next input model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someSecondInputModel = service.createInputModel('someSecondInputModel');
      someSecondInputModel.addField('fieldOfModel').setType('string').setRequired();

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addModelField('someSecondInputModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someInputModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = prefixServiceModelsWithServiceName(service.name, models);

      const mappedSomeInputMModelName = `${pascal(service.name)}${pascal(someInputModel.name)}`;
      const mappedSomeSecondInputModelName = `${pascal(service.name)}${pascal(someSecondInputModel.name)}`;

      expect(inputModels).toPartiallyContain({name: mappedSomeSecondInputModelName});
      expect(inputModels).toPartiallyContain({name: mappedSomeInputMModelName});

      const mappedSomeGerenalModel = inputModels.find(m => m.name === mappedSomeInputMModelName);
      expect(mappedSomeGerenalModel!.fields).toPartiallyContain({model: mappedSomeSecondInputModelName});
    });
  });
});

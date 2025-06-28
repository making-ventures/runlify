import {expect} from 'jest-without-globals'
import {augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput} from './augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput'
import {MethodType} from '../../../../builders/buildedTypes';
import AdditionalServiceBuilder from '../../../../builders/AdditionalServiceBuilder';
import {getServiceModels} from './getServiceModels';

// yarn test --testPathPattern augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput

describe('augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput', () => {
  describe('from args', () => {
    it('postfixes general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someGerenalModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput(models);

      expect(inputModels).toPartiallyContain({name: `${someGerenalModel.name}Input`});
    });

    it('doesn\'t prefix input model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someInputModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput(models);

      expect(inputModels).not.toPartiallyContain({name: `${someInputModel.name}Input`});
      expect(inputModels).toPartiallyContain({name: someInputModel.name});
    });

    it('postfixes general model and next general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someSecondGerenalModel = service.createGeneralModel('someSecondGerenalModel');
      someSecondGerenalModel.addField('fieldOfModel').setType('string').setRequired();

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addModelField('someSecondGerenalModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someGerenalModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput(models);

      const mappedSomeGerenalModelName = `${someGerenalModel.name}Input`;
      const mappedSomeSecondGerenalModelName = `${someSecondGerenalModel.name}Input`;

      expect(inputModels).toPartiallyContain({name: mappedSomeSecondGerenalModelName});
      expect(inputModels).toPartiallyContain({name: mappedSomeGerenalModelName});

      const mappedSomeGerenalModel = inputModels.find(m => m.name === mappedSomeGerenalModelName);
      expect(mappedSomeGerenalModel!.fields).toPartiallyContain({model: mappedSomeSecondGerenalModelName});
    });

    it('postfixes general model and doesn\'t prefix next input model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addField('fieldOfModel').setType('string').setRequired();

      const someGerenalModel = service.createGeneralModel('someGerenalModel');
      someGerenalModel.addModelField('someInputModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someGerenalModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput(models);

      const mappedSomeGerenalModelName = `${someGerenalModel.name}Input`;
      const someInputModelName = someInputModel.name;

      expect(inputModels).toPartiallyContain({name: someInputModelName});
      expect(inputModels).toPartiallyContain({name: mappedSomeGerenalModelName});

      const mappedSomeGerenalModel = inputModels.find(m => m.name === mappedSomeGerenalModelName);
      expect(mappedSomeGerenalModel!.fields).toPartiallyContain({model: someInputModelName});
    });

    it('doesn\'t prefix input model and postfixes next general model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someGeneralModel = service.createGeneralModel('someGeneralModel');
      someGeneralModel.addField('fieldOfModel').setType('string').setRequired();

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addModelField('someGeneralModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someInputModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput(models);

      const someInputMModelName = someInputModel.name;
      const mappedSomeSecondInputModelName = `${someGeneralModel.name}Input`;

      expect(inputModels).toPartiallyContain({name: mappedSomeSecondInputModelName});
      expect(inputModels).toPartiallyContain({name: someInputMModelName});

      const mappedSomeGerenalModel = inputModels.find(m => m.name === someInputMModelName);
      expect(mappedSomeGerenalModel!.fields).toPartiallyContain({model: mappedSomeSecondInputModelName});
    });

    it('doesn\'t prefix input model and next input model', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someSecondInputModel = service.createInputModel('someSecondInputModel');
      someSecondInputModel.addField('fieldOfModel').setType('string').setRequired();

      const someInputModel = service.createInputModel('someInputModel');
      someInputModel.addModelField('someSecondInputModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someInputModel', 'objectField').setRequired();

      const models = getServiceModels(service.build());

      const {inputModels} = augmentInputModelsByUsedAsInputGeneralModelsAndPostfixThemByInput(models);

      const someInputMModelName = someInputModel.name;
      const someSecondInputModelName = someSecondInputModel.name;

      expect(inputModels).toPartiallyContain({name: someSecondInputModelName});
      expect(inputModels).toPartiallyContain({name: someInputMModelName});

      const mappedSomeGerenalModel = inputModels.find(m => m.name === someInputMModelName);
      expect(mappedSomeGerenalModel!.fields).toPartiallyContain({model: someSecondInputModelName});
    });
  });
});

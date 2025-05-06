/* eslint-disable max-len */
import { expect } from 'jest-without-globals'
import { getPreparedModelsForGraph } from './getPreparedModelsForGraph'
import AdditionalServiceBuilder from '../../../../builders/AdditionalServiceBuilder'
import { MethodType } from '../../../../../types'

// yarn test --testPathPattern getPreparedModelsForGraph
// yarn test --testPathPattern getPreparedModelsForGraph -t 'without args and return'
// yarn test --testPathPattern getPreparedModelsForGraph -t 'with simple args and no return'

describe('getPreparedModelsForGraph', () => {
  describe('returns types', () => {
    it('without args and return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
      someMethod.setExportedToApi();

      const {inputModels, outputModels, args} = getPreparedModelsForGraph(service.build());

      expect(inputModels).toBeEmpty();
      expect(outputModels).toBeEmpty();

      expect(args).toBeArrayOfSize(1);
      expect(args).toPartiallyContain({name: 'SomeServiceSomeMethodArgs'});
    });

    it('with simple args and no return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
      someMethod.setExportedToApi();

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addField('someString').setType('string').setRequired();

      const {inputModels, outputModels, args} = getPreparedModelsForGraph(service.build());

      expect(inputModels).toBeEmpty();
      expect(outputModels).toBeEmpty();

      expect(args).toBeArrayOfSize(1);
      expect(args).toPartiallyContain({name: 'SomeServiceSomeMethodArgs'});
    });

    it('with no args and simple return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
      someMethod.setExportedToApi();

      const someMethodResult = someMethod.getReturnModel();
      someMethodResult.addField('someString').setType('string').setRequired();

      const {inputModels, outputModels, args} = getPreparedModelsForGraph(service.build());

      expect(inputModels).toBeEmpty();

      expect(outputModels).toBeArrayOfSize(1);
      expect(outputModels).toPartiallyContain({name: 'SomeServiceSomeMethodResult'});

      expect(args).toBeArrayOfSize(1);
      expect(args).toPartiallyContain({name: 'SomeServiceSomeMethodArgs'});
    });

    it('with simple args and simple return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
      someMethod.setExportedToApi();

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addField('someString').setType('string').setRequired();

      const someMethodResult = someMethod.getReturnModel();
      someMethodResult.addField('someString').setType('string').setRequired();

      const {inputModels, outputModels, args} = getPreparedModelsForGraph(service.build());

      expect(inputModels).toBeEmpty();

      expect(outputModels).toBeArrayOfSize(1);
      expect(outputModels).toPartiallyContain({name: 'SomeServiceSomeMethodResult'});

      expect(args).toBeArrayOfSize(1);
      expect(args).toPartiallyContain({name: 'SomeServiceSomeMethodArgs'});
    });

    it('with simple args and with inner object someModel in return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someModel = service.addGeneralModel('someModel');
      someModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
      someMethod.setExportedToApi();

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addField('someString').setType('string').setRequired();

      const someMethodResult = someMethod.getReturnModel();
      someMethodResult.addModelField('someModel', 'objectField').setRequired();

      const {inputModels, outputModels, args} = getPreparedModelsForGraph(service.build());

      expect(inputModels).toBeEmpty();

      expect(outputModels).toBeArrayOfSize(2);
      expect(outputModels).toPartiallyContain({name: 'SomeServiceSomeModel'});
      expect(outputModels).toPartiallyContain({name: 'SomeServiceSomeMethodResult'});

      expect(args).toBeArrayOfSize(1);
      expect(args).toPartiallyContain({name: 'SomeServiceSomeMethodArgs'});
    });

    it('with inner object someModel in args and simple return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someModel = service.addGeneralModel('someModel');
      someModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
      someMethod.setExportedToApi();

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someModel', 'objectField').setRequired();

      const someMethodResult = someMethod.getReturnModel();
      someMethodResult.addField('someString').setType('string').setRequired();

      const {inputModels, outputModels, args} = getPreparedModelsForGraph(service.build());

      expect(inputModels).toBeArrayOfSize(1);
      expect(inputModels).toPartiallyContain({name: 'SomeServiceSomeModelInput'});

      expect(outputModels).toBeArrayOfSize(1);
      expect(outputModels).toPartiallyContain({name: 'SomeServiceSomeMethodResult'});

      expect(args).toBeArrayOfSize(1);
      expect(args).toPartiallyContain({name: 'SomeServiceSomeMethodArgs'});
    });

    it('without args and double level nested fields in return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const anotherModel = service.addGeneralModel('anotherModel');
      anotherModel.addField('fieldOfModel').setType('string').setRequired();

      const someModel = service.addGeneralModel('someModel');
      someModel.addModelField('anotherModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
      someMethod.setExportedToApi();

      const someMethodResult = someMethod.getReturnModel();
      someMethodResult.addModelField('someModel', 'objectField').setRequired();

      const {inputModels, outputModels, args} = getPreparedModelsForGraph(service.build());

      expect(inputModels).toBeEmpty();

      expect(outputModels).toBeArrayOfSize(3);
      expect(outputModels).toPartiallyContain({name: 'SomeServiceAnotherModel'});
      expect(outputModels).toPartiallyContain({name: 'SomeServiceSomeModel'});
      expect(outputModels).toPartiallyContain({name: 'SomeServiceSomeMethodResult'});

      expect(args).toBeArrayOfSize(1);
      expect(args).toPartiallyContain({name: 'SomeServiceSomeMethodArgs'});
    });
  });
});

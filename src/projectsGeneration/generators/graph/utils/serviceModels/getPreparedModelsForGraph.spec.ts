import {expect} from 'jest-without-globals'
import {getPreparedModelsForGraph} from './getPreparedModelsForGraph'
import AdditionalServiceBuilder from '../../../../builders/AdditionalServiceBuilder'
import {MethodType} from '../../../../../types'
import log from '../../../../../log';

// yarn test --testPathPattern getPreparedModelsForGraph
// yarn test --testPathPattern getPreparedModelsForGraph -t 'without args and return'
// yarn test --testPathPattern getPreparedModelsForGraph -t 'with simple args and no return'
// yarn test --testPathPattern getPreparedModelsForGraph -t 'without args and double level nested fields in return'

describe('getPreparedModelsForGraph', () => {
  describe('returns types', () => {
    it('without args and return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      service.addMethod('someMethod', MethodType.Query, 'Some method');

      const {inputModels, outputModels, args} = getPreparedModelsForGraph(service.build());

      expect(inputModels).toBeEmpty();
      expect(outputModels).toBeEmpty();

      expect(args).toBeArrayOfSize(1);
      expect(args).toPartiallyContain({name: 'SomeServiceSomeMethodArgs'});
    });

    it('with simple args and no return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

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

      const someMethodResult = someMethod.setReturnObjectModel('result');
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

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addField('someString').setType('string').setRequired();

      const someMethodResult = someMethod.setReturnObjectModel('result');
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

      const someModel = service.createGeneralModel('someModel');
      someModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addField('someString').setType('string').setRequired();

      const someMethodResult = someMethod.setReturnObjectModel('result');
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

      const someModel = service.createGeneralModel('someModel');
      someModel.addField('fieldOfModel').setType('string').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addModelField('someModel', 'objectField').setRequired();

      const someMethodResult = someMethod.setReturnObjectModel('result');
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

      const anotherModel = service.createGeneralModel('anotherModel');
      anotherModel.addField('fieldOfModel').setType('string').setRequired();

      const someModel = service.createGeneralModel('someModel');
      someModel.addModelField('anotherModel', 'objectField').setRequired();

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');

      const someMethodResult = someMethod.setReturnObjectModel('result');
      someMethodResult.addModelField('someModel', 'objectField').setRequired();

      const {inputModels, outputModels, args} = getPreparedModelsForGraph(service.build());

      expect(inputModels).toBeEmpty();

      log.info(`outputModels: ${outputModels.map(m => m.name).join(', ')}`);
      log.info(`outputModels: ${outputModels.map(m => m.name).join(', ')}`);
      log.info(`outputModels: ${outputModels.map(m => m.name).join(', ')}`);
      log.info(`outputModels: ${outputModels.map(m => m.name).join(', ')}`);
      log.info(`outputModels: ${outputModels.map(m => m.name).join(', ')}`);
      log.info(`outputModels: ${outputModels.map(m => m.name).join(', ')}`);

      expect(outputModels).toBeArrayOfSize(3);
      expect(outputModels).toPartiallyContain({name: 'SomeServiceAnotherModel'});
      expect(outputModels).toPartiallyContain({name: 'SomeServiceSomeModel'});
      expect(outputModels).toPartiallyContain({name: 'SomeServiceSomeMethodResult'});

      expect(args).toBeArrayOfSize(1);
      expect(args).toPartiallyContain({name: 'SomeServiceSomeMethodArgs'});
    });
  });
});

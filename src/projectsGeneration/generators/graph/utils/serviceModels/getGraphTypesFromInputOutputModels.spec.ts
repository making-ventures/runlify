/* eslint-disable max-len */
import { expect } from 'jest-without-globals'
import { GraphQLNamedType, GraphQLSchema, printSchema } from 'graphql'
import { getGraphTypesFromInputOutputModels } from './getGraphTypesFromInputOutputModels'
import AdditionalServiceBuilder from '../../../../builders/AdditionalServiceBuilder'
import { MethodType } from '../../../../../types'
import { getPreparedModelsForGraph } from './getPreparedModelsForGraph'

// yarn test --testPathPattern getGraphTypesFromInputOutputModels
// yarn test --testPathPattern getGraphTypesFromInputOutputModels -t 'with simple args and no return'

const serviceTypesToGraphSchema = (types: GraphQLNamedType[]) => new GraphQLSchema({
  types: types,
})

const printSchemaForTypes = (types: GraphQLNamedType[]) =>
  printSchema(serviceTypesToGraphSchema(types))

describe('getGraphTypesFromInputOutputModels', () => {
  describe('returns types', () => {
    it('without args and return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
      someMethod.setExportedToApi();

      const models = getPreparedModelsForGraph(service.build());

      expect(printSchemaForTypes(getGraphTypesFromInputOutputModels(models))).toBeEmpty()
    });

    it('with simple args and no return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
      someMethod.setExportedToApi();

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addField('someString').setType('string').setRequired();

      const models = getPreparedModelsForGraph(service.build());

      expect(printSchemaForTypes(getGraphTypesFromInputOutputModels(models))).toBeEmpty()
    });

    it('with no args and simple return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
      someMethod.setExportedToApi();

      const someMethodResult = someMethod.getReturnModel();
      someMethodResult.addField('someString').setType('string').setRequired();

      const models = getPreparedModelsForGraph(service.build());

      expect(printSchemaForTypes(getGraphTypesFromInputOutputModels(models))).toBe(`type SomeServiceSomeMethodResult {
  someString: String!
}`)
    });

    it('with simple args and simple return', () => {
      const service = new AdditionalServiceBuilder('someService', 'ru');

      const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
      someMethod.setExportedToApi();

      const someMethodArgs = someMethod.getArgsModel();
      someMethodArgs.addField('someString').setType('string').setRequired();

      const someMethodResult = someMethod.getReturnModel();
      someMethodResult.addField('someString').setType('string').setRequired();

      const models = getPreparedModelsForGraph(service.build());

      expect(printSchemaForTypes(getGraphTypesFromInputOutputModels(models))).toBe(`type SomeServiceSomeMethodResult {
  someString: String!
}`)
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

      const models = getPreparedModelsForGraph(service.build());

      expect(printSchemaForTypes(getGraphTypesFromInputOutputModels(models))).toBe(`type SomeServiceSomeModel {
  fieldOfModel: String!
}

type SomeServiceSomeMethodResult {
  objectField: SomeServiceSomeModel!
}`)
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

      const models = getPreparedModelsForGraph(service.build());

      const result = getGraphTypesFromInputOutputModels(models);

      expect(printSchemaForTypes(result)).toBe(`input SomeServiceSomeModelInput {
  fieldOfModel: String!
}

type SomeServiceSomeMethodResult {
  someString: String!
}`)
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

      const models = getPreparedModelsForGraph(service.build());

      expect(printSchemaForTypes(getGraphTypesFromInputOutputModels(models))).toBe(`type SomeServiceAnotherModel {
  fieldOfModel: String!
}

type SomeServiceSomeModel {
  objectField: SomeServiceAnotherModel!
}

type SomeServiceSomeMethodResult {
  objectField: SomeServiceSomeModel!
}`)
    });
  });
});

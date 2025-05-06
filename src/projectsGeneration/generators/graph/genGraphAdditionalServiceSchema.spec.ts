/* eslint-disable max-len */
import { expect } from 'jest-without-globals'
import { printSchema } from 'graphql'
import { genGraphAdditionalServiceSchema } from './genGraphAdditionalServiceSchema'
import AdditionalServiceBuilder from '../../builders/AdditionalServiceBuilder'
import { MethodType } from '../../../types'

// yarn test --testPathPattern genGraphAdditionalServiceSchema
// yarn test --testPathPattern genGraphAdditionalServiceSchema -t 'with simple args and simple return'
// yarn test --testPathPattern genGraphAdditionalServiceSchema -t 'with inner object model in args and simple return'

describe('genGraphAdditionalServiceSchema', () => {
  describe('generates schema for', () => {
    describe('service with query method', () => {
      it('without args and return', () => {
        const service = new AdditionalServiceBuilder('someService', 'ru');

        const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
        someMethod.setExportedToApi();

        expect(printSchema(genGraphAdditionalServiceSchema(service.build()))).toBe(`type Query {
  someServiceSomeMethod: Void
}

"""Represents NULL values"""
scalar Void

type Mutation`)
      });

      it('with simple args and no return', () => {
        const service = new AdditionalServiceBuilder('someService', 'ru');

        const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
        someMethod.setExportedToApi();

        const someMethodArgs = someMethod.getArgsModel();
        someMethodArgs.addField('someString').setType('string').setRequired();

        expect(printSchema(genGraphAdditionalServiceSchema(service.build()))).toBe(`type Query {
  someServiceSomeMethod(someString: String!): Void
}

"""Represents NULL values"""
scalar Void

type Mutation`)
      });

      it('with no args and simple return', () => {
        const service = new AdditionalServiceBuilder('someService', 'ru');

        const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
        someMethod.setExportedToApi();

        const someMethodResult = someMethod.getReturnModel();
        someMethodResult.addField('someString').setType('string').setRequired();

        expect(printSchema(genGraphAdditionalServiceSchema(service.build()))).toBe(`type SomeServiceSomeMethodResult {
  someString: String!
}

type Query {
  someServiceSomeMethod: SomeServiceSomeMethodResult
}

type Mutation`)
      });

      it('with simple args and simple return', () => {
        const service = new AdditionalServiceBuilder('someService', 'ru');

        const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
        someMethod.setExportedToApi();

        const someMethodArgs = someMethod.getArgsModel();
        someMethodArgs.addField('someString').setType('string').setRequired();

        const someMethodResult = someMethod.getReturnModel();
        someMethodResult.addField('someString').setType('string').setRequired();

        expect(printSchema(genGraphAdditionalServiceSchema(service.build()))).toBe(`type SomeServiceSomeMethodResult {
  someString: String!
}

type Query {
  someServiceSomeMethod(someString: String!): SomeServiceSomeMethodResult
}

type Mutation`)
      });

      it('with simple args and with inner object model in return', () => {
        const service = new AdditionalServiceBuilder('someService', 'ru');

        const model = service.addGeneralModel('someModel');
        model.addField('fieldOfModel').setType('string').setRequired();

        const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
        someMethod.setExportedToApi();

        const someMethodArgs = someMethod.getArgsModel();
        someMethodArgs.addField('someString').setType('string').setRequired();

        const someMethodResult = someMethod.getReturnModel();
        someMethodResult.addModelField('someModel', 'objectField').setRequired();

        expect(printSchema(genGraphAdditionalServiceSchema(service.build()))).toBe(`type SomeServiceSomeModel {
  fieldOfModel: String!
}

type SomeServiceSomeMethodResult {
  objectField: SomeServiceSomeModel!
}

type Query {
  someServiceSomeMethod(someString: String!): SomeServiceSomeMethodResult
}

type Mutation`)
      });

      it('with inner object model in args and simple return', () => {
        const service = new AdditionalServiceBuilder('someService', 'ru');

        const model = service.addGeneralModel('someModel');
        model.addField('fieldOfModel').setType('string').setRequired();

        const someMethod = service.addMethod('someMethod', MethodType.Query, 'Some method');
        someMethod.setExportedToApi();

        const someMethodArgs = someMethod.getArgsModel();
        someMethodArgs.addModelField('someModel', 'objectField').setRequired();

        const someMethodResult = someMethod.getReturnModel();
        someMethodResult.addField('someString').setType('string').setRequired();

        expect(printSchema(genGraphAdditionalServiceSchema(service.build()))).toBe(`input SomeServiceSomeModelInput {
  fieldOfModel: String!
}

type SomeServiceSomeMethodResult {
  someString: String!
}

type Query {
  someServiceSomeMethod(objectField: SomeServiceSomeModelInput!): SomeServiceSomeMethodResult
}

type Mutation`)
      });
    });

    describe('service with mutation method', () => {
      it('without args and return', () => {
        const service = new AdditionalServiceBuilder('someService', 'ru');

        const someMethod = service.addMethod('someMethod', MethodType.Mutation, 'Some method');
        someMethod.setExportedToApi();

        expect(printSchema(genGraphAdditionalServiceSchema(service.build()))).toBe(`type Query

type Mutation {
  someServiceSomeMethod: Void
}

"""Represents NULL values"""
scalar Void`)
      });

      it('with simple args and no return', () => {
        const service = new AdditionalServiceBuilder('someService', 'ru');

        const someMethod = service.addMethod('someMethod', MethodType.Mutation, 'Some method');
        someMethod.setExportedToApi();

        const someMethodArgs = someMethod.getArgsModel();
        someMethodArgs.addField('someString').setType('string').setRequired();

        expect(printSchema(genGraphAdditionalServiceSchema(service.build()))).toBe(`type Query

type Mutation {
  someServiceSomeMethod(someString: String!): Void
}

"""Represents NULL values"""
scalar Void`)
      });

      it('with no args and simple return', () => {
        const service = new AdditionalServiceBuilder('someService', 'ru');

        const someMethod = service.addMethod('someMethod', MethodType.Mutation, 'Some method');
        someMethod.setExportedToApi();

        const someMethodResult = someMethod.getReturnModel();
        someMethodResult.addField('someString').setType('string').setRequired();

        expect(printSchema(genGraphAdditionalServiceSchema(service.build()))).toBe(`type SomeServiceSomeMethodResult {
  someString: String!
}

type Query

type Mutation {
  someServiceSomeMethod: SomeServiceSomeMethodResult
}`)
      });

      it('with simple args and simple return', () => {
        const service = new AdditionalServiceBuilder('someService', 'ru');

        const someMethod = service.addMethod('someMethod', MethodType.Mutation, 'Some method');
        someMethod.setExportedToApi();

        const someMethodArgs = someMethod.getArgsModel();
        someMethodArgs.addField('someString').setType('string').setRequired();

        const someMethodResult = someMethod.getReturnModel();
        someMethodResult.addField('someString').setType('string').setRequired();

        expect(printSchema(genGraphAdditionalServiceSchema(service.build()))).toBe(`type SomeServiceSomeMethodResult {
  someString: String!
}

type Query

type Mutation {
  someServiceSomeMethod(someString: String!): SomeServiceSomeMethodResult
}`)
      });
    });
  });
});

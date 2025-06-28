import {expect} from 'jest-without-globals'
import AdditionalServiceBuilder from '../../../../../builders/AdditionalServiceBuilder';
import {getMethodTypeForServiceReturn} from './getMethodTypeForServiceReturn';

// yarn test --testPathPattern getMethodTypeForServiceReturn
// yarn test --testPathPattern getMethodTypeForServiceReturn -t 'generates for method with scalar return'

describe('getMethodTypeForServiceReturn', () => {
  it('generates for method without return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    service.addMethod('someMethod');

    expect(getMethodTypeForServiceReturn(service.build().methods[0]))
      .toEqual('void');
  });

  it('generates for method with scalar return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    const someMethodReturn = someMethod.setReturnScalarModel();
    someMethodReturn.setType('string').setRequired();

    expect(getMethodTypeForServiceReturn(service.build().methods[0]))
      .toEqual('string');
  });

  it('generates for method with scalar async return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod').setAsync();

    const someMethodReturn = someMethod.setReturnScalarModel();
    someMethodReturn.setType('string').setRequired();

    expect(getMethodTypeForServiceReturn(service.build().methods[0]))
      .toEqual('Promise<string>');
  });

  it('generates for method with scalar array return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    const someMethodReturn = someMethod.setReturnScalarModel();
    someMethodReturn.setType('string').setRequired().setArray();

    expect(getMethodTypeForServiceReturn(service.build().methods[0]))
      .toEqual('string[]');
  });

  it('generates for method with object return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    someMethod.setReturnObjectModel('someModel');

    expect(getMethodTypeForServiceReturn(service.build().methods[0]))
      .toEqual('SomeMethodSomeModel');
  });

  it('generates for method with object array return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    const someMethodReturn = someMethod.setReturnObjectModel('someModel');
    someMethodReturn.setArray();

    expect(getMethodTypeForServiceReturn(service.build().methods[0]))
      .toEqual('SomeMethodSomeModel[]');
  });
})

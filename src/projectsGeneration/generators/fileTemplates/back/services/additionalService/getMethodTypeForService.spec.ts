import {expect} from 'jest-without-globals'
import AdditionalServiceBuilder from '../../../../../builders/AdditionalServiceBuilder';
import {getMethodTypeForService} from './getMethodTypeForService';

// yarn test --testPathPattern getMethodTypeForService
// yarn test --testPathPattern getMethodTypeForService -t 'generates for method without args and return'
// yarn test --testPathPattern getMethodTypeForService -t 'generates for method with scalar return'

describe('getMethodTypeForService', () => {
  it('generates for method without args and return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    service.addMethod('someMethod');

    expect(getMethodTypeForService(service.build().methods[0]))
      .toEqual('someMethod: () => void');
  });

  it('generates for async method without args and return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    service.addMethod('someMethod').setAsync();

    expect(getMethodTypeForService(service.build().methods[0]))
      .toEqual('someMethod: () => Promise<void>');
  });

  it('generates for method with scalar arg', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    const someMethodArgs = someMethod.getArgsModel();
    someMethodArgs.addField('someString').setType('string').setRequired();

    expect(getMethodTypeForService(service.build().methods[0]))
      .toEqual('someMethod: (someString: string) => void');
  });

  it('generates for method with two scalar args', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    const someMethodArgs = someMethod.getArgsModel();
    someMethodArgs.addField('someString').setType('string').setRequired();
    someMethodArgs.addField('someOtherString').setType('string').setRequired();

    expect(getMethodTypeForService(service.build().methods[0]))
      .toEqual('someMethod: (someString: string, someOtherString: string) => void');
  });

  it('generates for method with optional scalar arg', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    const someMethodArgs = someMethod.getArgsModel();
    someMethodArgs.addField('someString').setType('string');

    expect(getMethodTypeForService(service.build().methods[0]))
      .toEqual('someMethod: (someString?: string) => void');
  });

  it('generates for method with scalar array arg', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    const someMethodArgs = someMethod.getArgsModel();
    someMethodArgs.addField('someString').setType('string').setRequired().setArray();

    expect(getMethodTypeForService(service.build().methods[0]))
      .toEqual('someMethod: (someString: string[]) => void');
  });

  it('generates for method with object in args', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    service.createGeneralModel('someModel');

    const someMethodArgs = someMethod.getArgsModel();
    someMethodArgs.addModelField('someModel', 'someModelArg').setType('string').setRequired();

    expect(getMethodTypeForService(service.build().methods[0]))
      .toEqual('someMethod: (someModelArg: SomeModel) => void');
  });

  it('generates for method with optional object array in args', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    service.createGeneralModel('someModel');

    const someMethodArgs = someMethod.getArgsModel();
    someMethodArgs.addModelField('someModel', 'someModelArg').setType('string').setArray();

    expect(getMethodTypeForService(service.build().methods[0]))
      .toEqual('someMethod: (someModelArg?: SomeModel[]) => void');
  });

  it('generates for method with scalar return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    const someMethodReturn = someMethod.setReturnScalarModel();
    someMethodReturn.setType('string').setRequired();

    expect(getMethodTypeForService(service.build().methods[0]))
      .toEqual('someMethod: () => string');
  });

  it('generates for method with object return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    someMethod.setReturnObjectModel('someModel');

    expect(getMethodTypeForService(service.build().methods[0]))
      .toEqual('someMethod: () => SomeMethodSomeModel');
  });

  it('generates for method with object array return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    const someMethodReturn = someMethod.setReturnObjectModel('someModel');
    someMethodReturn.setArray();

    expect(getMethodTypeForService(service.build().methods[0]))
      .toEqual('someMethod: () => SomeMethodSomeModel[]');
  });
})

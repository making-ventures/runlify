import { expect } from 'jest-without-globals'
import AdditionalServiceBuilder from '../../../../../builders/AdditionalServiceBuilder';
import { backAdditionalServiceTypesTmplInner } from './backAdditionalServiceTypesTmplInner';

// yarn test --testPathPattern backAdditionalServiceTypesTmplInner

describe('backAdditionalServiceTypesTmplInner', () => {
  it('generates for method without methods', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    expect(backAdditionalServiceTypesTmplInner(service.build())).toEqual(`export interface IDebugService {}`);
  });

  it('generates for method without args and return', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    service.addMethod('someMethod');

    expect(backAdditionalServiceTypesTmplInner(service.build())).toEqual(`export interface IDebugService {
  someMethod: () => void
}`);
  });

  it('generates for method with scalar arg', () => {
    const service = new AdditionalServiceBuilder('debug', 'ru');

    const someMethod = service.addMethod('someMethod');

    const someMethodArgs = someMethod.getArgsModel();
    someMethodArgs.addField('someString').setType('string').setRequired();

    expect(backAdditionalServiceTypesTmplInner(service.build())).toEqual(`export interface IDebugService {
  someMethod: (someString: string) => void
}`);
  });
  // with scalar array arg

  // with scalar args
  // with scalar array args

  // with general object in args
  // with general object array in args
  // with input object in args
  // with input object array in args

  // with general object with inner general object in args
  // with general object with inner input object in args
  // with general object array with inner general object in args
  // with general object array with inner input object in args
  // with general object array with inner general object array in args
  // with general object array with inner input object array in args

  // with input object with inner general object in args
  // with input object with inner input object in args
  // with input object array with inner general object in args
  // with input object array with inner input object in args
  // with input object array with inner general object array in args
  // with input object array with inner input object array in args

  // with scalar return
  // with scalar array in return

  // with general object in return
  // with general object array in return
  // with output object in return
  // with output object array in return

  // with general object with inner general object in return
  // with general object with inner output object in return
  // with general object array with inner general object in return
  // with general object array with inner output object in return
  // with general object array with inner general object array in return
  // with general object array with inner output object array in return

  // with output object with inner general object in return
  // with output object with inner output object in return
  // with output object array with inner general object in return
  // with output object array with inner output object in return
  // with output object array with inner general object array in return
  // with output object array with inner output object array in return
})

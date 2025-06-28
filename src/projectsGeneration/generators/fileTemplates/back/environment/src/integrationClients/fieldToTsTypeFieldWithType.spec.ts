import {expect} from 'jest-without-globals'
import {fieldToTsTypeFieldWithType} from './fieldToTsTypeFieldWithType';
import {TsModelField} from '../../../../../../builders/buildedTypes';

// yarn test --testPathPattern fieldToTsTypeFieldWithType
// yarn test --testPathPattern fieldToTsTypeFieldWithType -t 'generates for scalar field array'

const defaultStringField: TsModelField = {
  name: 'someString',
  title: {ru: 'Some string'},
  needFor: '',
  updatable: false,
  required: false,
  requiredOnInput: null,
  updatableByUser: false,
  showInList: false,
  showInCreate: false,
  showInEdit: false,
  showInFilter: false,
  showInShow: false,
  defaultDbValue: undefined,
  sharded: false,
  category: 'scalar',
  type: 'string',
  filters: [],
  stringType: 'plain',

  array: false,
};

const defaultModelField: TsModelField = {
  name: 'someString',
  title: {ru: 'Some string'},
  needFor: '',
  updatable: false,
  required: false,
  requiredOnInput: null,
  updatableByUser: false,
  showInList: false,
  showInCreate: false,
  showInEdit: false,
  showInFilter: false,
  showInShow: false,
  defaultDbValue: undefined,
  sharded: false,

  category: 'model',
  model: '',

  array: false,
};

describe('fieldToTsTypeFieldWithType', () => {
  it('generates for scalar field', () => {
    expect(fieldToTsTypeFieldWithType({
      ...defaultStringField,
      name: 'someString',
      required: true,
      array: false,
    }))
      .toEqual('someString: string');
  });

  it('generates for optional scalar field', () => {
    expect(fieldToTsTypeFieldWithType({
      ...defaultStringField,
      name: 'someString',
      required: false,
      array: false,
    }))
      .toEqual('someString?: string');
  });

  it('generates for scalar field array', () => {
    expect(fieldToTsTypeFieldWithType({
      ...defaultStringField,
      name: 'someString',
      required: true,
      array: true,
    }))
      .toEqual('someString: string[]');
  });

  it('generates for optional scalar field array', () => {
    expect(fieldToTsTypeFieldWithType({
      ...defaultStringField,
      name: 'someString',
      required: false,
      array: true,
    }))
      .toEqual('someString?: string[]');
  });

  it('generates for model field', () => {
    expect(fieldToTsTypeFieldWithType({
      ...defaultModelField,
      name: 'someModelField',
      model: 'someModel',
      required: true,
      array: false,
    }))
      .toEqual('someModelField: SomeModel');
  });

  it('generates for optional model field', () => {
    expect(fieldToTsTypeFieldWithType({
      ...defaultModelField,
      name: 'someModelField',
      model: 'someModel',
      required: false,
      array: false,
    }))
      .toEqual('someModelField?: SomeModel');
  });

  it('generates for model field array', () => {
    expect(fieldToTsTypeFieldWithType({
      ...defaultModelField,
      name: 'someModelField',
      model: 'someModel',
      required: true,
      array: true,
    }))
      .toEqual('someModelField: SomeModel[]');
  });

  it('generates for optional model field array', () => {
    expect(fieldToTsTypeFieldWithType({
      ...defaultModelField,
      name: 'someModelField',
      model: 'someModel',
      required: false,
      array: true,
    }))
      .toEqual('someModelField?: SomeModel[]');
  });
})

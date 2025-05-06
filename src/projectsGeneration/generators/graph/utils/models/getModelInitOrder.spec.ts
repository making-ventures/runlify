import { expect } from 'jest-without-globals'
import { getModelInitOrder } from './getModelInitOrder'

// yarn test --testPathPattern getModelInitOrder

describe('getModelInitOrder', () => {
  describe('returns order for', () => {
    it('one model without object fields', () => {
      expect(
        getModelInitOrder([
          {name: 'firstModel', fields: []},
        ])
      ).toEqual([
        'firstModel',
      ]);
    });

    it('two models without object fields', () => {
      expect(
        getModelInitOrder([
          {name: 'firstModel', fields: []},
          {name: 'secondModel', fields: []},
        ])
      ).toEqual([
        'firstModel',
        'secondModel',
      ]);
    });

    it('one model refers to another', () => {
      expect(
        getModelInitOrder([
          {name: 'firstModel', fields: ['secondModel']},
          {name: 'secondModel', fields: []},
        ])
      ).toEqual([
        'secondModel',
        'firstModel',
      ]);
    });

    it('two models refer to another', () => {
      expect(
        getModelInitOrder([
          {name: 'firstModel', fields: ['thirdModel']},
          {name: 'secondModel', fields: ['thirdModel']},
          {name: 'thirdModel', fields: []},
        ])
      ).toEqual([
        'thirdModel',
        'firstModel',
        'secondModel',
      ]);
    });

    it('three models that linked one to another', () => {
      expect(
        getModelInitOrder([
          {name: 'firstModel', fields: ['secondModel']},
          {name: 'secondModel', fields: ['thirdModel']},
          {name: 'thirdModel', fields: []},
        ])
      ).toEqual([
        'thirdModel',
        'secondModel',
        'firstModel',
      ]);
    });

    it('one model that links to itself', () => {
      expect(
        getModelInitOrder([
          {name: 'firstModel', fields: ['firstModel']},
        ])
      ).toEqual([
        'firstModel',
      ]);
    });
  });

  describe('throws for', () => {
    it('two models lineked each other', () => {
      expect(
        () => getModelInitOrder([
          {name: 'firstModel', fields: ['secondModel']},
          {name: 'secondModel', fields: ['firstModel']},
        ])
      ).toThrow(new Error('Circular dependency detected. Models: "firstModel": [secondModel], "secondModel": [firstModel]'));
    });

    it('model with link to not presented model', () => {
      expect(
        () => getModelInitOrder([
          {name: 'firstModel', fields: ['secondModel']},
        ])
      ).toThrow(new Error('Field of "firstModel" model has link to "secondModel" model that not presented. Models: firstModel'));
    });
  });
});

import {expect} from 'jest-without-globals'
import {getUniqModels} from './getUniqModels'
import {TsModel} from '../../../../builders/buildedTypes';

// yarn test --testPathPattern getUniqModels

const defalutModel: TsModel = {
  name: '',
  title: {ru: {singular: ''}},
  needFor: {ru: ''},
  materialUiIcon: '',
  previewFeatures: [],
  fields: [],
}

describe('getUniqModels', () => {
  describe('returns', () => {
    it('empty array when no models presented', () => {
      expect(getUniqModels([])).toBeEmpty();
    });

    it('model when one model passed', () => {
      expect(getUniqModels([defalutModel])).toEqual([defalutModel]);
    });

    it('all models when uniq list of models passed', () => {

      const models = [
        {...defalutModel, name: 'firstModel'},
        {...defalutModel, name: 'secondModel'},
        {...defalutModel, name: 'thirdModel'},
      ];
      expect(getUniqModels(models)).toEqual(models);
    });

    it('one model when list of two models with the same names passed', () => {

      const models = [
        {...defalutModel, name: 'firstModel'},
        {...defalutModel, name: 'firstModel'},
      ];
      expect(getUniqModels(models)).toEqual([models[0]]);
    });
  });
});

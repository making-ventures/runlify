import {expect} from 'jest-without-globals'
import {getUsedModels} from './getUsedModels'
import {BaseField, StringField, TsModel, TsModelField} from '../../../../builders/buildedTypes';

// yarn test --testPathPattern getUsedModels

const baseField: BaseField = {
  name: '',
  title: {ru: ''},
  needFor: '',
  updatable: false,
  required: false,
  requiredOnInput: false,
  updatableByUser: false,
  showInList: false,
  showInCreate: false,
  showInEdit: false,
  showInFilter: false,
  showInShow: false,
  defaultDbValue: false,
  sharded: false,
  array: false,
}

const defalutModelField: TsModelField = {
  ...baseField,
  category: 'model',
  service: '',
  model: '',
}

const defalutStringField: StringField = {
  ...baseField,
  category: 'scalar',
  type: 'string',
  filters: [],
  stringType: 'plain',
}

const defalutModel: TsModel = {
  name: '',
  title: {ru: {singular: ''}},
  needFor: {ru: ''},
  materialUiIcon: '',
  previewFeatures: [],
  fields: [],
}

const defaultFirstModel: TsModel = {
  ...defalutModel,
  name: 'firstModel',
}

const defaultSecondModel: TsModel = {
  ...defalutModel,
  name: 'secondModel',
}

const defaultThirdModel: TsModel = {
  ...defalutModel,
  name: 'thirdModel',
}

describe('getUsedModels', () => {
  describe('returns', () => {
    it('startingModel when only one model passed', () => {
      const firstModel: TsModel = {
        ...defaultFirstModel,
        fields: [
          defalutStringField,
        ]
      };

      expect(getUsedModels(firstModel, [firstModel])).toEqual([firstModel]);
    });

    it('startingModel when it does not have fields', () => {
      expect(getUsedModels(defaultFirstModel, [defaultFirstModel, defaultSecondModel, defaultThirdModel]))
        .toEqual([defaultFirstModel]);
    });

    it('startingModel when it does not have model fields', () => {
      const firstModel = {
        ...defaultFirstModel,
        fields: [
          defalutStringField,
        ]
      };

      expect(getUsedModels(firstModel, [firstModel, defaultSecondModel, defaultThirdModel]))
        .toEqual([firstModel]);
    });

    it('two models when one has link to another', () => {
      const firstModel = {
        ...defaultFirstModel,
        fields: [
          defalutStringField,
          {
            ...defalutModelField,
            model: 'secondModel',
          },
        ]
      };

      const secondModel = {
        ...defaultSecondModel,
        fields: [
          defalutStringField,
        ]
      };

      expect(getUsedModels(firstModel, [firstModel, secondModel, defaultThirdModel]))
        .toEqual([firstModel, secondModel]);
    });

    it('startingModel when it has link to itself', () => {
      const firstModel = {
        ...defaultFirstModel,
        fields: [
          defalutStringField,
          {
            ...defalutModelField,
            model: 'firstModel',
          },
        ]
      };

      expect(getUsedModels(firstModel, [firstModel, defaultSecondModel, defaultThirdModel]))
        .toEqual([firstModel]);
    });

    it('two models when they have links one to another', () => {
      const firstModel = {
        ...defaultFirstModel,
        fields: [
          defalutStringField,
          {
            ...defalutModelField,
            model: 'secondModel',
          },
        ]
      };

      const secondModel = {
        ...defaultSecondModel,
        fields: [
          defalutStringField,
          {
            ...defalutModelField,
            model: 'firstModel',
          },
        ]
      };

      expect(getUsedModels(firstModel, [firstModel, secondModel, defaultThirdModel]))
        .toEqual([firstModel, secondModel]);
    });

    it('three models when first has link to second, and second to third', () => {
      const firstModel = {
        ...defaultFirstModel,
        fields: [
          defalutStringField,
          {
            ...defalutModelField,
            model: 'secondModel',
          },
        ]
      };

      const secondModel = {
        ...defaultSecondModel,
        fields: [
          defalutStringField,
          {
            ...defalutModelField,
            model: 'thirdModel',
          },
        ]
      };

      const thirdModel = {
        ...defaultThirdModel,
        fields: [
          defalutStringField,
        ]
      };

      expect(getUsedModels(firstModel, [firstModel, secondModel, thirdModel]))
        .toEqual([firstModel, secondModel, thirdModel]);
    });
  });

  describe('throws', () => {
    it('when model has link to not presented another model', () => {
      const firstModel = {
        ...defaultFirstModel,
        fields: [
          defalutStringField,
          {
            ...defalutModelField,
            model: 'secondModel',
          },
        ]
      };

      expect(() => getUsedModels(firstModel, [firstModel]))
        .toThrow(new Error('Can\'t find model "secondModel", models: firstModel'));
    });
  });
});

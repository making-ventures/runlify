import {TsModel} from '../../../../builders/buildedTypes'
import * as R from 'ramda';

export const getUniqModels = (models: TsModel[]): TsModel[] => R.uniqBy(m => m.name, models);

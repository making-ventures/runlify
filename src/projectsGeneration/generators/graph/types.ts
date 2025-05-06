import {TsModel} from '../../builders/buildedTypes'

export interface ServiceModels {
  inputModels: TsModel[];
  outputModels: TsModel[];
  generalModels: TsModel[];
}

export interface InputOutputServiceModels {
  inputModels: TsModel[];
  outputModels: TsModel[];
}

export interface InputOutputArgsServiceModels extends InputOutputServiceModels {
  args: TsModel[];
}

export interface MappedName {
  original: string;
  mapped: string;
}

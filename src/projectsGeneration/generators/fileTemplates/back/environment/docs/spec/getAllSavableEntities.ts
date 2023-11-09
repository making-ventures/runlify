import {Entity, System} from '../../../../../../builders/buildedTypes';

const getAllSavableEntities = (meta: System): Entity[] => [
  ...meta.catalogs,
  ...meta.documents,
  ...meta.sumRegistries,
  ...meta.infoRegistries,
];

export default getAllSavableEntities;

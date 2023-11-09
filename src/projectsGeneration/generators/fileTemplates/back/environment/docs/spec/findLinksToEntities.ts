import {BaseSavableEntity} from '../../../../../../builders/buildedTypes';

const findLinksToEntities = (entities: BaseSavableEntity[], enitityName: string): BaseSavableEntity[] =>
  entities.filter(el => el.fields.some(f => f.category === 'link' && f.externalEntity === enitityName));

export default findLinksToEntities;

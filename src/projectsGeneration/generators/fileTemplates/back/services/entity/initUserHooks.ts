import {EntityWideGenerationArgs} from '../../../../../args'
import {pascalPlural} from '../../../../../../utils/cases'

export const initUserHooksTmpl = ({
  entity,
}: EntityWideGenerationArgs) => `import {beforeCreate} from './hooks/beforeCreate';
import {beforeUpdate} from './hooks/beforeUpdate';
import {afterCreate} from './hooks/afterCreate';
import {afterUpdate} from './hooks/afterUpdate';
import {afterDelete} from './hooks/afterDelete';
import {beforeDelete} from './hooks/beforeDelete';
import {beforeUpsert} from './hooks/beforeUpsert';
import {changeListFilter} from './hooks/changeListFilter';
import {additionalOperationsOnCreate} from './hooks/additionalOperationsOnCreate';
import {additionalOperationsOnUpdate} from './hooks/additionalOperationsOnUpdate';
import {additionalOperationsOnDelete} from './hooks/additionalOperationsOnDelete';
import {${pascalPlural(entity.name)}Service} from './${pascalPlural(
  entity.name
)}Service';

const initUserHooks = ({hooksAdd}: ${pascalPlural(entity.name)}Service) => {
  hooksAdd.changeListFilter(changeListFilter);
  hooksAdd.beforeCreate(beforeCreate);
  hooksAdd.afterCreate(afterCreate);
  hooksAdd.beforeUpdate(beforeUpdate);
  hooksAdd.afterUpdate(afterUpdate);
  hooksAdd.beforeDelete(beforeDelete);
  hooksAdd.afterDelete(afterDelete);
  hooksAdd.beforeUpsert(beforeUpsert);
  hooksAdd.additionalOperationsOnCreate(additionalOperationsOnCreate);
  hooksAdd.additionalOperationsOnUpdate(additionalOperationsOnUpdate);
  hooksAdd.additionalOperationsOnDelete(additionalOperationsOnDelete);
};

export default initUserHooks;
`

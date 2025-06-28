import {pascalSingular} from '../../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../../args'

export const uiListBreadcrumbsTmpl = ({ entity }: EntityWideGenerationArgs) => {
  return `import {FC} from 'react';
// import {Breadcrumbs} from '../../../../raUiLib/Breadcrumbs';

const ${pascalSingular(entity.name)}ListBreadcrumbs: FC = () => null;

// const ${pascalSingular(entity.name)}ListBreadcrumbs: FC = () => (
//   <Breadcrumbs />
// );

export default ${pascalSingular(entity.name)}ListBreadcrumbs;
`
}

const uiDashboardTmpl = () => `import React, {
  FC,
} from 'react';
import ResourcesPage from './ResourcesPage';

const Dashboard: FC = () => {
  return (
    <ResourcesPage />
  );
};

export default Dashboard;
`

export default uiDashboardTmpl

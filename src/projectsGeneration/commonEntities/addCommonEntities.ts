import SystemMetaBuilder from '../builders/SystemMetaBuilder';
import addAuditLogs from './addAuditLogs';
import addRefreshTokens from './addRefreshTokens';
import addCommonCommands from './addCommonCommands';
import addLanguages from './addLanguages';
import addManagers from './addManagers';
import addRoles from './addRoles';
import addUsers from './addUsers';
import addAutogeneration from './addAutogeneration';
import addTenants from './addTenants';
import addAggregateTrackings from './addAggregateTrackings';
import {addEmailModuleEntities} from '../modules';
import {addConfigurationVariables} from '.';

const addCommonEntities = (system: SystemMetaBuilder) => {
  addLanguages(system);
  addTenants(system);
  addManagers(system);
  addUsers(system);
  addAuditLogs(system);
  addRoles(system);
  addCommonCommands(system);
  addAutogeneration(system);
  addRefreshTokens(system);
  addAggregateTrackings(system);

  // Modules
  addEmailModuleEntities(system);

  // configurationVariables
  addConfigurationVariables(system);
};

export default addCommonEntities;

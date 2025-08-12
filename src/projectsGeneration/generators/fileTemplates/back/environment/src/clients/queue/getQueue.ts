import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../../types'

export const getQueueTmpl = (
  _options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import {getConfig} from '../../config';
import {makeWorkerUtils, WorkerUtils} from 'graphile-worker';
import log from '../../log';
import {addParamsToDatabaseUri} from '../../utils/addParamsToPgUri';

let queue: WorkerUtils | null = null;

const getQueue = async () => {
  if (!queue) {
    const {databaseMainWriteUri} = await getConfig();

    log.info(typeof addParamsToDatabaseUri);

    // const url = addParamsToDatabaseUri(databaseMainWriteUri, {
    //   application_name: appName,
    //   ...(process.env.NODE_ENV === 'production' ? {} : {connection_limit: '1'}),
    // });

    const workerUtils = await makeWorkerUtils({
      connectionString: databaseMainWriteUri,
      noPreparedStatements: true,
    });

    if (queue) {
      workerUtils.release();
    } else {
      queue = workerUtils;
    }
  }

  return queue;
};

export default getQueue;
`

import {pascalCase} from 'change-case'
import {ProjectWideGenerationArgs} from '../../../../../../args'
import {IntegrationClient} from '../../../../../../builders/buildedTypes'

const backIntegrationClientTmpl = (
  {system}: ProjectWideGenerationArgs,
  client: IntegrationClient
) => {
  return `import axios, {AxiosInstance} from 'axios';
import log from '../../log';
import {
  ${pascalCase(client.name)}ClientGetBrandsArgs,
  ${pascalCase(client.name)}ClientGetBrandsResult,
  I${pascalCase(client.name)}Client,
} from './types';
import {
  ClientAfterRequestArgs,
  ClientBeforeRequestArgs,
  ClientOnErrorArgs,
} from '../hooksTypes';
import {Context} from '../../adm/services/types';
import IntegrationClient from '../IntegrationClient';

class ${pascalCase(client.name)}Client extends IntegrationClient implements I${pascalCase(client.name)}Client {
  protected ax: AxiosInstance;

  constructor(ctx: Context) {
    super(ctx);

    this.ax = axios.create();
  }

  async beforeRequest(_args: ClientBeforeRequestArgs) {
    log.info(\`!!!!!! beforeRequest, managers count: \${await this.ctx.service('managers').count()}\`);
    // log.info(args);
  }

  async afterRequest(_args: ClientAfterRequestArgs) {
    log.info(\`!!!!!! afterRequest, managers count: \${await this.ctx.service('managers').count()}\`);
    // log.info(args);
  }

  async onError(_args: ClientOnErrorArgs) {
    log.info(\`!!!!!! onError, managers count: \${await this.ctx.service('managers').count()}\`);
    // log.info(args);
  }

${client.queryMethods.map(m => `  async ${m.name}(args: ${pascalCase(client.name)}ClientGetBrandsArgs) {
    log.info(args);

    if (Math.random() < 0.5) {
      throw new Error('Some error');
    }

    return this.ax.get('https://jsonplaceholder.typicode.com/users').then(result => result.data as ${pascalCase(client.name)}ClientGetBrandsResult);
  }`).join('\n\n')}
}

export default ${pascalCase(client.name)}Client;
`
}

export default backIntegrationClientTmpl;

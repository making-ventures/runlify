import {pascalCase} from 'change-case'
import {ProjectWideGenerationArgs} from '../../../../../../args'
import {IntegrationClient} from '../../../../../../builders/buildedTypes'

const backIntegrationClientTmpl = (
  _: ProjectWideGenerationArgs,
  client: IntegrationClient
) => {
  return `import axios, {AxiosInstance} from 'axios';
import log from '../../log';
import {
${client.queryMethods.map(m => `  ${pascalCase(m.name)}Args,
  ${pascalCase(m.name)}Result,`).join('\n')}
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

  protected async beforeRequest(_args: ClientBeforeRequestArgs) {
    log.info(\`!!!!!! beforeRequest, managers count: \${await this.ctx.service('managers').count()}\`);
  }

  protected async afterRequest(_args: ClientAfterRequestArgs) {
    log.info(\`!!!!!! afterRequest, managers count: \${await this.ctx.service('managers').count()}\`);
  }

  protected async onError(_args: ClientOnErrorArgs) {
    log.info(\`!!!!!! onError, managers count: \${await this.ctx.service('managers').count()}\`);
  }

${client.queryMethods.map(m => `  async ${m.name}(args: ${pascalCase(m.name)}Args): Promise<${pascalCase(m.name)}Result> {
    log.info(args);

    if (Math.random() < 0.5) {
      throw new Error('Some error');
    }

    return this.ax.get('https://jsonplaceholder.typicode.com/users')
      .then(result => result.data as ${pascalCase(m.name)}Result);
  }`).join('\n\n')}
}

export default ${pascalCase(client.name)}Client;
`
}

export default backIntegrationClientTmpl;

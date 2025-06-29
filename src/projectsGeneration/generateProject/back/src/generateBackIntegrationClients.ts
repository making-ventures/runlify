import {join} from 'path'
import {FileCreator} from '../../types'
import {ProjectWideGenerationArgs} from '../../../args'
import backIntegrationClientTmpl from '../../../generators/fileTemplates/back/environment/src/integrationClients/IntegrationClient'
import {pascalCase} from 'change-case'
import backIntegrationClientTypesTmpl from '../../../generators/fileTemplates/back/environment/src/integrationClients/types'
import genIntegrationClientConstrictorsTmpl from '../../../generators/fileTemplates/back/environment/src/integrationClients/integrationClientConstrictors'
import genIntegrationClientsTmpl from '../../../generators/fileTemplates/back/environment/src/integrationClients/IntegrationClients'

const generateBackIntegrationClients = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const prjDetachedBackSrcDir = join(args.options.detachedBackProject, 'src');
  const servicesDir = join(prjDetachedBackSrcDir, 'adm', 'services');

  for (const client of args.system.integrationClients) {
    const clientFolder = join(prjDetachedBackSrcDir, 'integrationClients', `${client.name}`);

    if (!args.options.typesOnly) {
      fileCreator.createIfNotExists(join(clientFolder, `${pascalCase(client.name)}Client.ts`), backIntegrationClientTmpl(args, client));
    }
    fileCreator.create(join(clientFolder, `types.ts`), backIntegrationClientTypesTmpl(args, client));
  }

  if (!args.options.typesOnly) {
    fileCreator.create(join(servicesDir, 'integrationClientConstrictors.ts'), genIntegrationClientConstrictorsTmpl(args));
  }

  fileCreator.create(join(servicesDir, 'IntegrationClients.ts'), genIntegrationClientsTmpl(args));
}

export default generateBackIntegrationClients;

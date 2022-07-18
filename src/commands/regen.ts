import { GluegunToolbox } from 'gluegun'
import { generateProject } from '../projectsGeneration';

module.exports = {
  name: 'regenerate',
  alias: ['regen'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      // parameters,
      // print: { info },
      filesystem,
    } = toolbox


    const metaPath = 'src/meta/metadata.json';
    const optionsPath = 'src/meta/options.json';

    const metaJson = filesystem.read(metaPath) || '{}';
    const optionsJson = filesystem.read(optionsPath) || '{}';

    const meta = JSON.parse(metaJson);
    const options = JSON.parse(optionsJson);

    // info(meta);
    // info(options);

    // info(`detachedBackProject: ${options.detachedBackProject}`);
    // info(`detachedUiProject: ${options.detachedUiProject}`);

    generateProject(meta, options);
  },
}

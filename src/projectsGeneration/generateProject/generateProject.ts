import {FileCreator} from './types'
import {generateEnvironment} from './generateEnvironment'
import {genGraphSchemesByLocalGenerator} from './genGraphSchemesByLocalGenerator'
import {BootstrapEntityOptions} from '../types'
import {createFilesToWriteUtils, writeFiles} from './utils'
import {System} from '../builders/buildedTypes'
import {prepareProjectWideGenerationArgs} from '../args'
import cleanFiles from '../fileCleaners/cleanFiles'
import generateFront from './front/generateFront'
import generateBack from './back/generateBack'

const generateProject = async (
  system: System,
  opts: BootstrapEntityOptions
) => {
  const {
    getFiles,
    reset,
    create,
    createIfNotExists,
  } = createFilesToWriteUtils();

  const fileCreator: FileCreator = {create, createIfNotExists};

  const args = prepareProjectWideGenerationArgs(system, opts);

  if (opts.genFrontend) {
    cleanFiles(args);
  }

  // Pre grapgql types compose generation
  generateBack(fileCreator, {...args, options: {...args.options, typesOnly: true}});

  writeFiles(getFiles());
  reset();

  await genGraphSchemesByLocalGenerator(opts);

  // Full generation
  generateBack(fileCreator, args);

  if (opts.genFrontend) {
    generateFront(fileCreator, args);
  }

  generateEnvironment(fileCreator, args);

  writeFiles(getFiles());
  reset();
}

export default generateProject;

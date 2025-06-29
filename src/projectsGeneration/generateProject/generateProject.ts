import {join} from 'path'
import {FileCreator} from './types'
import {generateEnvironment} from './generateEnvironment'
import {genGraphSchemesByLocalGenerator} from './genGraphSchemesByLocalGenerator'
import {BootstrapEntityInnerOptions, defaultBootstrapEntityOptions} from '../types'
import {createFilesToWriteUtils, writeFiles} from './utils'
import {System} from '../builders/buildedTypes'
import {cwd} from 'fs-jetpack'
import {prepareProjectWideGenerationArgs} from '../args'
import cleanFiles from '../fileCleaners/cleanFiles'
import generateFront from './front/generateFront'
import generateBack from './back/generateBack'

const generateProject = async (
  system: System,
  initialOpts = defaultBootstrapEntityOptions
) => {
  const {
    getFiles,
    reset,
    create,
    createIfNotExists,
  } = createFilesToWriteUtils();

  const fileCreator: FileCreator = {create, createIfNotExists};

  const dir = cwd('..').cwd();

  const detachedBackProject = join(dir, `${initialOpts.projectPrefix}-back`);
  const detachedUiProject = join(dir, `${initialOpts.projectPrefix}-ui`);;

  const opts: BootstrapEntityInnerOptions = {
    ...defaultBootstrapEntityOptions,
    ...initialOpts,
    detachedBackProject,
    detachedUiProject,
  }

  const args = prepareProjectWideGenerationArgs(system, opts);

  cleanFiles(args);

  // Pre grapgql types compose generation
  generateBack(fileCreator, {...args, options: {...args.options, typesOnly: true}});

  writeFiles(getFiles());
  reset();

  await genGraphSchemesByLocalGenerator(opts);

  // Full generation
  generateBack(fileCreator, args);

  generateFront(fileCreator, args);

  generateEnvironment(fileCreator, args);

  writeFiles(getFiles());
  reset();
}

export default generateProject;

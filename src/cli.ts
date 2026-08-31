import {build} from 'gluegun'

/**
 * Create the cli and kick it off
 */
async function run(argv: any) {
  // create a CLI runtime
  const cli = build()
    .brand('runlify')
    .src(__dirname, {
      // gluegun's default only excludes *.test.{js,ts}; this project's
      // convention is *.spec.ts, so exclude that too, otherwise a spec
      // file colocated in src/extensions/ gets auto-loaded as an extension.
      commandFilePattern: ['*.{js,ts}', '!*.test.{js,ts}', '!*.spec.{js,ts}'],
      extensionFilePattern: ['*.{js,ts}', '!*.test.{js,ts}', '!*.spec.{js,ts}'],
    })
    .plugins('./node_modules', { matching: 'runlify-*', hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .checkForUpdates(100)
    .create()
  // enable the following method if you'd like to skip loading one of these core extensions
  // this can improve performance if they're not necessary for your project:
  // .exclude(['meta', 'strings', 'print', 'filesystem', 'semver', 'system', 'prompt', 'http', 'template', 'patching', 'package-manager'])
  // and run it

  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}

module.exports = { run }

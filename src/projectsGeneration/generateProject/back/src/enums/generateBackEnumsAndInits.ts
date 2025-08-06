import {join} from 'path'
import {FileCreator} from '../../../types'
import {pascal} from '../../../../../utils/cases'
import {ProjectWideGenerationArgs} from '../../../../args'
import {singular} from 'pluralize'
import {enumTmpl} from '../../../../generators/fileTemplates/back/enum'
import {devEnumTmpl} from '../../../../generators/fileTemplates/back/devEnum'
import {initCommonEnumTmpl} from '../../../../generators/fileTemplates/back/initCommon'
import {initDevEnumTmpl} from '../../../../generators/fileTemplates/back/initDev'
import {backEntitiesEnumTmpl} from '../../../../generators/fileTemplates/back/backEntitiesEnumTmpl'
import {initEntities} from '../../../../generators/fileTemplates/back/initEntities'
import {addWarnings} from '../../../fileHandlers'

const generateBackEnums = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  args.entities
    .filter((e) => e.predefinedElements.length > 0)
    .forEach((entity) => {
      const filePath = join(
        args.options.detachedBackProject,
        'src',
        'types',
        `${pascal(singular(entity.name))}.ts`
      )

      fileCreator.create(
        filePath,
        enumTmpl(entity, args.options),
        addWarnings({options: args.options})
      )
    })
}

const generateBackEntityEnum = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'src',
    'types',
    'Entity.ts'
  )

  fileCreator.create(
    filePath,
    backEntitiesEnumTmpl(args),
    addWarnings({options: args.options})
  )
}

const generateBackEnumsInit = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  args.entities
    .filter((e) => e.predefinedElements.length > 0)
    .forEach((entity) => {
      const filePath = join(
        args.options.detachedBackProject,
        'src',
        'init',
        'common',
        `init${pascal(entity.name)}.ts`
      )

      fileCreator.create(
        filePath,
        initCommonEnumTmpl(entity, args.options),
        addWarnings({options: args.options})
      )
  })
}

const generateBackEntitiesEnumInit = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  const filePath = join(
    args.options.detachedBackProject,
    'src',
    'init',
    'common',
    'initEntities.ts'
  )

  fileCreator.create(
    filePath,
    initEntities(args),
    addWarnings({options: args.options})
  )
}

const generateBackDevEnums = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  args.entities
    .filter((e) => e.devPerefinedElements.length > 0)
    .forEach((entity) => {
      const filePath = join(
        args.options.detachedBackProject,
        'src',
        'types',
        `Dev${pascal(singular(entity.name))}.ts`
      )

      fileCreator.create(
        filePath,
        devEnumTmpl(entity, args.options),
        addWarnings({options: args.options})
      )
    })
}

const generateBackDevEnumsInit = (
  fileCreator: FileCreator,
  args: ProjectWideGenerationArgs,
) => {
  args.entities
    .filter((e) => e.devPerefinedElements.length > 0)
    .forEach((entity) => {
      const filePath = join(
        args.options.detachedBackProject,
        'src',
        'init',
        'dev',
        `init${pascal(entity.name)}.ts`
      )

      fileCreator.create(
        filePath,
        initDevEnumTmpl(entity, args.options),
        addWarnings({options: args.options})
      )
    })
}

const generateBackEnumsAndInits = (fileCreator: FileCreator, args: ProjectWideGenerationArgs) => {
  generateBackEnums(fileCreator, args);
  generateBackEnumsInit(fileCreator, args);
  generateBackEntityEnum(fileCreator, args);
  generateBackEntitiesEnumInit(fileCreator, args);
  generateBackDevEnums(fileCreator, args);
  generateBackDevEnumsInit(fileCreator, args);
}

export default generateBackEnumsAndInits;

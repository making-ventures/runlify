import {join} from 'path'
import {FileCreator} from '../../../types'
import {pascal} from '../../../../../utils/cases'
import {
  EntityWideGenerationArgs,
  ProjectWideGenerationArgs,
} from '../../../../args'
import {singular} from 'pluralize'
import {enumTmpl} from '../../../../generators/fileTemplates/back/enum'
import {devEnumTmpl} from '../../../../generators/fileTemplates/back/devEnum'
import {initCommonEnumTmpl} from '../../../../generators/fileTemplates/back/initCommon'
import {initDevEnumTmpl} from '../../../../generators/fileTemplates/back/initDev'
import {backEntitiesEnumTmpl} from '../../../../generators/fileTemplates/back/backEntitiesEnumTmpl'
import {initEntities} from '../../../../generators/fileTemplates/back/initEntities'

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
        enumTmpl({
          entity,
          options: args.options,
        } as EntityWideGenerationArgs)
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
    backEntitiesEnumTmpl({
      entities: args.entities,
      options: args.options,
    } as ProjectWideGenerationArgs)
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
        initCommonEnumTmpl({
          entity,
          options: args.options,
        } as EntityWideGenerationArgs)
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

  fileCreator.create(filePath, initEntities(args))
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
        devEnumTmpl({
          entity,
          options: args.options,
        } as EntityWideGenerationArgs)
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
        initDevEnumTmpl({
          entity,
          options: args.options,
        } as EntityWideGenerationArgs)
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

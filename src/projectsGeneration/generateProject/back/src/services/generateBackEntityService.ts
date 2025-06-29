import {join} from 'path'
import {FileCreator} from '../../../types'
import {pascalPlural} from '../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../args'
import {additionalOperationsOnCreateTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnCreate'
import {additionalOperationsOnDeleteTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnDelete'
import {additionalOperationsOnUpdateTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/additionalOperationsOnUpdate'
import {afterCreateTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/afterCreate'
import {beforeCreateTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/beforeCreate'
import {beforeUpdateTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/beforeUpdate'
import {afterUpdateTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/afterUpdate'
import {afterDeleteTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/afterDelete'
import {beforeDeleteTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/beforeDelete'
import {beforeUpsertTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/beforeUpsert'
import {changeListFilterTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/changeListFilter'
import {initUserHooksTmpl} from '../../../../generators/fileTemplates/back/services/entity/initUserHooks'
import {initBuiltInHooksTmpl} from '../../../../generators/fileTemplates/back/services/entity/initBuiltInHooks'
import {tenantIdRequiredHooksTmpl} from '../../../../generators/fileTemplates/back/services/entity/hooks/tenantIdRequiredHooks'
import {configTmpl} from '../../../../generators/fileTemplates/back/services/entity/config'
import {prismaServiceBaseClassTmpl} from '../../../../generators/fileTemplates/back/services/entity/class'
import {prismaAdditionalServiceClassTmpl} from '../../../../generators/fileTemplates/back/services/entity/additionalClass'

const generateBackEntityService = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    allSumRegistries,
    allInfoRegistries,
    entity,
    options,
  } = args;

  if (options.genPrismaServices && !options.typesOnly) {
    const serviceName = `${pascalPlural(entity.name)}Service`;
    const serviceDir = join(options.detachedBackProject, 'src', 'adm', 'services', serviceName);
    const servicePath = join(serviceDir, `${serviceName}.ts`);
    const configPath = join(serviceDir, `config.ts`);
    const additionalServicePath = join(serviceDir, `Additional${serviceName}.ts`);

    const additionalClassService = prismaAdditionalServiceClassTmpl(args);
    fileCreator.createIfNotExists(additionalServicePath, additionalClassService);

    const generatedClassService = prismaServiceBaseClassTmpl(args);
    fileCreator.create(servicePath, generatedClassService);

    const config = configTmpl(
      args,
      allSumRegistries,
      allInfoRegistries,
    );
    fileCreator.create(configPath, config);

    fileCreator.createIfNotExists(
      join(serviceDir, 'initUserHooks.ts'),
      initUserHooksTmpl(args)
    );

    const hooksDir = join(serviceDir, 'hooks');
    if (['optional', 'required'].includes(entity.multitenancy)) {
      if (
        !args.entities.some(
          (entity) => entity.name === 'tenants'
        )
      ) {
        throw new Error('Tenants entity not presented, you can\'t use tenants in project');
      }

      fileCreator.create(
        join(hooksDir, 'tenantIdRequiredHooks.ts'),
        tenantIdRequiredHooksTmpl(args)
      );
    }

    fileCreator.create(
      join(serviceDir, 'initBuiltInHooks.ts'),
      initBuiltInHooksTmpl(args)
    );

    if (!entity.elasticOnly) {
      fileCreator.createIfNotExists(
        join(hooksDir, 'additionalOperationsOnCreate.ts'),
        additionalOperationsOnCreateTmpl(args)
      );
      fileCreator.createIfNotExists(
        join(hooksDir, 'additionalOperationsOnUpdate.ts'),
        additionalOperationsOnUpdateTmpl(args)
      );
      fileCreator.createIfNotExists(
        join(hooksDir, 'additionalOperationsOnDelete.ts'),
        additionalOperationsOnDeleteTmpl(args)
      );
    }

    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeCreate.ts'),
      beforeCreateTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeDelete.ts'),
      beforeDeleteTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeUpdate.ts'),
      beforeUpdateTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'beforeUpsert.ts'),
      beforeUpsertTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'afterCreate.ts'),
      afterCreateTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'afterUpdate.ts'),
      afterUpdateTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'afterDelete.ts'),
      afterDeleteTmpl(args)
    );
    fileCreator.createIfNotExists(
      join(hooksDir, 'changeListFilter.ts'),
      changeListFilterTmpl(args)
    );
  }
}

export default generateBackEntityService;

import {join} from 'path'
import {FileCreator} from '../../../types'
import {pascalPlural} from '../../../../../utils/cases'
import {EntityWideGenerationArgs} from '../../../../args'
import {
  GenerationPathCategory,
  resolveGenerationPath,
} from '../../../../builders/generationPaths'
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
import {addWarnings} from '../../../fileHandlers'

const generateBackEntityService = (
  fileCreator: FileCreator,
  args: EntityWideGenerationArgs,
) => {
  const {
    allSumRegistries,
    allInfoRegistries,
    entity,
    options,
    system,
  } = args;

  if (options.genPrismaServices && !options.typesOnly) {
    const serviceName = `${pascalPlural(entity.name)}Service`;
    const serviceDir = join(options.detachedBackProject, 'src', 'adm', 'services', serviceName);
    const servicePath = join(serviceDir, `${serviceName}.ts`);
    const configPath = join(serviceDir, `config.ts`);
    const additionalServicePath = join(serviceDir, `Additional${serviceName}.ts`);
    const resolveBackPath = (category: GenerationPathCategory) =>
      resolveGenerationPath({
        category,
        detachedBackProject: options.detachedBackProject,
        detachedUiProject: options.detachedUiProject,
        pathsConfig: system.generationPaths,
        vars: {ServiceName: serviceName},
      });

    const additionalClassService = prismaAdditionalServiceClassTmpl(args);
    fileCreator.createIfNotExists(
      additionalServicePath,
      additionalClassService
    );

    const generatedClassService = prismaServiceBaseClassTmpl(args);
    fileCreator.create(
      servicePath,
      generatedClassService,
      addWarnings({options: args.options})
    );

    const config = configTmpl(
      args,
      allSumRegistries,
      allInfoRegistries,
    );
    fileCreator.create(
      configPath,
      config,
      addWarnings({options: args.options})
    );

    fileCreator.createIfNotExists(
      resolveBackPath(GenerationPathCategory.BackHookInitUserHooks),
      initUserHooksTmpl(args)
    );

    if (['optional', 'required'].includes(entity.multitenancy)) {
      if (
        !args.entities.some(
          (entity) => entity.name === 'tenants'
        )
      ) {
        throw new Error('Tenants entity not presented, you can\'t use tenants in project');
      }

      fileCreator.create(
        resolveBackPath(GenerationPathCategory.BackHookTenantIdRequiredHooks),
        tenantIdRequiredHooksTmpl(args),
        addWarnings({options: args.options})
      );
    }

    fileCreator.create(
      resolveBackPath(GenerationPathCategory.BackHookInitBuiltInHooks),
      initBuiltInHooksTmpl(args),
      addWarnings({options: args.options})
    );

    if (entity.storage !== 'elastic' && entity.storage !== 'clickhouse') {
      fileCreator.createIfNotExists(
        resolveBackPath(GenerationPathCategory.BackHookAdditionalOperationsOnCreate),
        additionalOperationsOnCreateTmpl(args)
      );
      fileCreator.createIfNotExists(
        resolveBackPath(GenerationPathCategory.BackHookAdditionalOperationsOnUpdate),
        additionalOperationsOnUpdateTmpl(args)
      );
      fileCreator.createIfNotExists(
        resolveBackPath(GenerationPathCategory.BackHookAdditionalOperationsOnDelete),
        additionalOperationsOnDeleteTmpl(args),
      );
    }

    fileCreator.createIfNotExists(
      resolveBackPath(GenerationPathCategory.BackHookBeforeCreate),
      beforeCreateTmpl(args)
    );
    fileCreator.createIfNotExists(
      resolveBackPath(GenerationPathCategory.BackHookBeforeDelete),
      beforeDeleteTmpl(args)
    );
    fileCreator.createIfNotExists(
      resolveBackPath(GenerationPathCategory.BackHookBeforeUpdate),
      beforeUpdateTmpl(args)
    );
    fileCreator.createIfNotExists(
      resolveBackPath(GenerationPathCategory.BackHookBeforeUpsert),
      beforeUpsertTmpl(args)
    );
    fileCreator.createIfNotExists(
      resolveBackPath(GenerationPathCategory.BackHookAfterCreate),
      afterCreateTmpl(args)
    );
    fileCreator.createIfNotExists(
      resolveBackPath(GenerationPathCategory.BackHookAfterUpdate),
      afterUpdateTmpl(args)
    );
    fileCreator.createIfNotExists(
      resolveBackPath(GenerationPathCategory.BackHookAfterDelete),
      afterDeleteTmpl(args)
    );
    fileCreator.createIfNotExists(
      resolveBackPath(GenerationPathCategory.BackHookChangeListFilter),
      changeListFilterTmpl(args)
    );
  }
}

export default generateBackEntityService;

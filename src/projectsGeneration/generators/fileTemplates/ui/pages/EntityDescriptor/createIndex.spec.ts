import {expect} from 'jest-without-globals'
import SystemMetaBuilder from '../../../../../builders/SystemMetaBuilder'
import {
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
} from '../../../../../args'
import {defaultBootstrapEntityOptions} from '../../../../../types'
import {uiDescriptorCreateIndexTmpl} from './createIndex'

// yarn test --testPathPattern EntityDescriptor/createIndex

const getArgs = (entityName: string) => {
  const system = new SystemMetaBuilder('test')
  system.addCatalog(entityName).getForms().setUiPagesMode('descriptor')

  const projectArgs = prepareProjectWideGenerationArgs(system.build(), {
    ...defaultBootstrapEntityOptions,
  })

  return prepareEntityWideGenerationArgs(projectArgs, projectArgs.allEntities.get(entityName)!)
}

describe('uiDescriptorCreateIndexTmpl', () => {
  test('renders EntityCreate with the entity descriptor', () => {
    expect(uiDescriptorCreateIndexTmpl(getArgs('accountLevels'))).toBe(`import React, {FC} from 'react';
import {CreateProps} from 'react-admin';
import {EntityCreate} from '../../../../uiLib/entityPages/EntityCreate';
import {accountLevelDescriptor} from '../AccountLevelDescriptor';

const AccountLevelCreatePage: FC<CreateProps> = (props) => <EntityCreate descriptor={accountLevelDescriptor} {...props} />;

export default AccountLevelCreatePage;
`)
  })

  test('does not shadow the universal EntityCreate import for an entity named "entities"', () => {
    const out = uiDescriptorCreateIndexTmpl(getArgs('entities'))
    expect(out).toContain(`import {EntityCreate} from '../../../../uiLib/entityPages/EntityCreate';`)
    expect(out).toContain(`const EntityCreatePage: FC<`)
    expect(out).not.toMatch(/const EntityCreate: FC</)
    expect(out).toContain('export default EntityCreatePage;')
  })
})

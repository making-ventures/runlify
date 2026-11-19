import {expect} from 'jest-without-globals'
import SystemMetaBuilder from '../../../../../builders/SystemMetaBuilder'
import {
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
} from '../../../../../args'
import {defaultBootstrapEntityOptions} from '../../../../../types'
import {uiDescriptorListIndexTmpl} from './listIndex'

// yarn test --testPathPattern EntityDescriptor/listIndex

const getArgs = (entityName: string) => {
  const system = new SystemMetaBuilder('test')
  system.addCatalog(entityName).getForms().setUiPagesMode('descriptor')

  const projectArgs = prepareProjectWideGenerationArgs(system.build(), {
    ...defaultBootstrapEntityOptions,
  })

  return prepareEntityWideGenerationArgs(projectArgs, projectArgs.allEntities.get(entityName)!)
}

describe('uiDescriptorListIndexTmpl', () => {
  test('renders EntityList with the entity descriptor', () => {
    expect(uiDescriptorListIndexTmpl(getArgs('accountLevels'))).toBe(`import React, {FC} from 'react';
import {ListProps} from 'react-admin';
import {EntityList} from '../../../../uiLib/entityPages/EntityList';
import {accountLevelDescriptor} from '../AccountLevelDescriptor';

const AccountLevelListPage: FC<ListProps> = (props) => <EntityList descriptor={accountLevelDescriptor} {...props} />;

export default AccountLevelListPage;
`)
  })

  test('does not shadow the universal EntityList import for an entity named "entities"', () => {
    const out = uiDescriptorListIndexTmpl(getArgs('entities'))
    expect(out).toContain(`import {EntityList} from '../../../../uiLib/entityPages/EntityList';`)
    expect(out).toContain(`const EntityListPage: FC<`)
    expect(out).not.toMatch(/const EntityList: FC</)
    expect(out).toContain('export default EntityListPage;')
  })
})

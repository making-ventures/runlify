import {expect} from 'jest-without-globals'
import SystemMetaBuilder from '../../../../../builders/SystemMetaBuilder'
import {
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
} from '../../../../../args'
import {defaultBootstrapEntityOptions} from '../../../../../types'
import {uiDescriptorEditIndexTmpl} from './editIndex'

// yarn test --testPathPattern EntityDescriptor/editIndex

const getArgs = (entityName: string) => {
  const system = new SystemMetaBuilder('test')
  system.addCatalog(entityName).getForms().setUiPagesMode('descriptor')

  const projectArgs = prepareProjectWideGenerationArgs(system.build(), {
    ...defaultBootstrapEntityOptions,
  })

  return prepareEntityWideGenerationArgs(projectArgs, projectArgs.allEntities.get(entityName)!)
}

describe('uiDescriptorEditIndexTmpl', () => {
  test('renders EntityEdit with the entity descriptor', () => {
    expect(uiDescriptorEditIndexTmpl(getArgs('accountLevels'))).toBe(`import React, {FC} from 'react';
import {EditProps} from 'react-admin';
import {EntityEdit} from '../../../../uiLib/entityPages/EntityEdit';
import {accountLevelDescriptor} from '../AccountLevelDescriptor';

const AccountLevelEditPage: FC<EditProps> = (props) => <EntityEdit descriptor={accountLevelDescriptor} {...props} />;

export default AccountLevelEditPage;
`)
  })

  test('does not shadow the universal EntityEdit import for an entity named "entities"', () => {
    const out = uiDescriptorEditIndexTmpl(getArgs('entities'))
    expect(out).toContain(`import {EntityEdit} from '../../../../uiLib/entityPages/EntityEdit';`)
    expect(out).toContain(`const EntityEditPage: FC<`)
    expect(out).not.toMatch(/const EntityEdit: FC</)
    expect(out).toContain('export default EntityEditPage;')
  })
})

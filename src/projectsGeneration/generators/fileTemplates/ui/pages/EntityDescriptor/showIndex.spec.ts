import {expect} from 'jest-without-globals'
import SystemMetaBuilder from '../../../../../builders/SystemMetaBuilder'
import {
  prepareEntityWideGenerationArgs,
  prepareProjectWideGenerationArgs,
} from '../../../../../args'
import {defaultBootstrapEntityOptions} from '../../../../../types'
import {uiDescriptorShowIndexTmpl} from './showIndex'

// yarn test --testPathPattern EntityDescriptor/showIndex

const getArgs = (entityName: string) => {
  const system = new SystemMetaBuilder('test')
  system.addCatalog(entityName).getForms().setUiPagesMode('descriptor')

  const projectArgs = prepareProjectWideGenerationArgs(system.build(), {
    ...defaultBootstrapEntityOptions,
  })

  return prepareEntityWideGenerationArgs(projectArgs, projectArgs.allEntities.get(entityName)!)
}

describe('uiDescriptorShowIndexTmpl', () => {
  test('renders EntityShow with the entity descriptor', () => {
    expect(uiDescriptorShowIndexTmpl(getArgs('accountLevels'))).toBe(`import React, {FC} from 'react';
import {ShowProps} from 'react-admin';
import {EntityShow} from '../../../../uiLib/entityPages/EntityShow';
import {accountLevelDescriptor} from '../AccountLevelDescriptor';

const AccountLevelShow: FC<ShowProps> = (props) => <EntityShow descriptor={accountLevelDescriptor} {...props} />;

export default AccountLevelShow;
`)
  })
})

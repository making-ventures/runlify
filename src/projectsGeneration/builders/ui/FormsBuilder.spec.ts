import {expect} from 'jest-without-globals'
import CatalogBuilder from '../CatalogBuilder'

// yarn test --testPathPattern FormsBuilder

describe('FormsBuilder', () => {
  test('uiPagesMode is legacy by default', () => {
    const cards = new CatalogBuilder('cards', 'ru')

    expect(cards.getForms().getUiPagesMode()).toBe('legacy')
    expect(cards.getForms().build().uiPagesMode).toBe('legacy')
    expect(cards.build().forms.uiPagesMode).toBe('legacy')
  })

  test('setUiPagesMode is chainable and serialized to the entity meta', () => {
    const cards = new CatalogBuilder('cards', 'ru')

    expect(cards.getForms().setUiPagesMode('descriptor')).toBe(cards.getForms())
    expect(cards.getForms().getUiPagesMode()).toBe('descriptor')
    expect(cards.build().forms.uiPagesMode).toBe('descriptor')
  })

  test('uiPagesMode does not affect list and show forms', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getForms().setUiPagesMode('descriptor')
    cards.getForms().getShowForm().addIgnoredLinkedEntity('orders')

    const forms = cards.getForms().build()

    expect(Object.keys(forms).sort()).toEqual(['list', 'show', 'uiPagesMode'])
    expect(forms.show.ignoredLinkedEntities).toEqual([{entity: 'orders', field: undefined}])
    expect(forms.list.filter.fields.length).toBeGreaterThan(0)
  })
})

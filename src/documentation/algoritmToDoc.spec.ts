import { describe, expect } from 'jest-without-globals'
import algoritmToDoc from './algoritmToDoc'

// yarn test -t 'algoritmToDoc'

describe('algoritmToDoc', () => {
  it('handles nested algorithm', () => {
    expect(
      algoritmToDoc({
        title: 'Very important nested algorithm',
        steps: [
          { description: 'Step 1' },
          {
            description: 'Step 2',
            steps: [{ description: 'Step 2.1' }, { description: 'Step 2.2' }],
          },
          { description: 'Step 3' },
        ],
      })
    ).toEqual({
      rootGroup: {
        title: 'Very important nested algorithm',
        children: [
          {
            block: {
              type: 'orderedList',
              list: [
                {
                  text: 'Step 1',
                  list: [],
                },
                {
                  text: 'Step 2',
                  list: [
                    {
                      text: 'Step 2.1',
                      list: [],
                    },
                    {
                      text: 'Step 2.2',
                      list: [],
                    },
                  ],
                },
                {
                  text: 'Step 3',
                  list: [],
                },
              ],
            },
            children: [],
          },
        ],
      },
    })
  })
})

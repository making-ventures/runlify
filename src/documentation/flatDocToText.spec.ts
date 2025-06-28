import {describe, expect} from 'jest-without-globals'
import flatDocToText from './flatDocToText'

// yarn test -t 'flatDocToText'

describe('flatDocToText', () => {
  it('converts simple example', () => {
    expect(
      flatDocToText({
        blocks: [
          {
            type: 'header',
            size: 1,
            title: 'Title',
          },
          {
            type: 'paragraph',
            text: 'text',
          },
        ],
      })
    ).toBe(`Title

text`)
  })

  it('converts nested algorithm', () => {
    expect(
      flatDocToText({
        blocks: [
          {
            type: 'header',
            title: 'Very important nested algorithm',
            size: 1,
          },
          {
            type: 'orderedListElement',
            number: 1,
            depth: 1,
            text: 'Step 1',
            path: '1',
          },
          {
            type: 'orderedListElement',
            number: 2,
            depth: 1,
            text: 'Step 2',
            path: '2',
          },
          {
            type: 'orderedListElement',
            number: 1,
            depth: 2,
            text: 'Step 2.1',
            path: '2.1',
          },
          {
            type: 'orderedListElement',
            number: 2,
            depth: 2,
            text: 'Step 2.2',
            path: '2.2',
          },
          {
            type: 'orderedListElement',
            number: 3,
            depth: 1,
            text: 'Step 3',
            path: '3',
          },
        ],
      })
    ).toBe(`Very important nested algorithm

1. Step 1

2. Step 2

  2.1. Step 2.1

  2.2. Step 2.2

3. Step 3`)
  })
})

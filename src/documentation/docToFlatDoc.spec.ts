import { describe, expect } from 'jest-without-globals'
import docToFlatDoc from './docToFlatDoc'

// yarn test -t 'docToFlatDoc'

describe('docToFlatDoc', () => {
  it('handles title', () => {
    expect(
      docToFlatDoc({
        rootGroup: {
          title: 'Title 1',
          children: [],
        },
      })
    ).toEqual({
      blocks: [
        {
          type: 'header',
          title: 'Title 1',
          size: 1,
        },
      ],
    })
  })

  it('handles title with parapraph', () => {
    expect(
      docToFlatDoc({
        rootGroup: {
          title: 'Title 1',
          block: {
            type: 'paragraph',
            text: 'text 1',
          },
          children: [],
        },
      })
    ).toEqual({
      blocks: [
        {
          type: 'header',
          title: 'Title 1',
          size: 1,
        },
        {
          type: 'paragraph',
          text: 'text 1',
        },
      ],
    })
  })

  it('handles paragraph', () => {
    expect(
      docToFlatDoc({
        rootGroup: {
          block: {
            type: 'paragraph',
            text: 'text 1',
          },
          children: [],
        },
      })
    ).toEqual({
      blocks: [
        {
          type: 'paragraph',
          text: 'text 1',
        },
      ],
    })
  })

  it('handles ordered list', () => {
    expect(
      docToFlatDoc({
        rootGroup: {
          block: {
            type: 'orderedList',
            list: [
              {
                text: 'el 1',
              },
              {
                text: 'el 2',
                list: [
                  {
                    text: 'el 2.1',
                  },
                  {
                    text: 'el 2.2',
                  },
                ],
              },
              {
                text: 'el 3',
              },
            ],
          },
          children: [],
        },
      })
    ).toEqual({
      blocks: [
        {
          type: 'orderedListElement',
          text: 'el 1',
          depth: 1,
          number: 1,
          path: '1',
        },
        {
          type: 'orderedListElement',
          text: 'el 2',
          depth: 1,
          number: 2,
          path: '2',
        },
        {
          type: 'orderedListElement',
          text: 'el 2.1',
          depth: 2,
          number: 1,
          path: '2.1',
        },
        {
          type: 'orderedListElement',
          text: 'el 2.2',
          depth: 2,
          number: 2,
          path: '2.2',
        },
        {
          type: 'orderedListElement',
          text: 'el 3',
          depth: 1,
          number: 3,
          path: '3',
        },
      ],
    })
  })

  it('handles complex example', () => {
    expect(
      docToFlatDoc({
        rootGroup: {
          title: 'Title 1',
          block: {
            type: 'paragraph',
            text: 'text 1',
          },
          children: [
            {
              title: 'Title 2',
              children: [
                {
                  title: 'Title 3',
                  block: {
                    type: 'paragraph',
                    text: 'text 3',
                  },
                  children: [],
                },
                {
                  title: 'Title 4',
                  block: {
                    type: 'paragraph',
                    text: 'text 4',
                  },
                  children: [],
                },
              ],
            },
            {
              title: 'Title 5',
              block: {
                type: 'paragraph',
                text: 'text 5',
              },
              children: [],
            },
          ],
        },
      })
    ).toEqual({
      blocks: [
        {
          type: 'header',
          title: 'Title 1',
          size: 1,
        },
        {
          type: 'paragraph',
          text: 'text 1',
        },
        {
          type: 'header',
          title: 'Title 2',
          size: 2,
        },
        {
          type: 'header',
          title: 'Title 3',
          size: 3,
        },
        {
          type: 'paragraph',
          text: 'text 3',
        },
        {
          type: 'header',
          title: 'Title 4',
          size: 3,
        },
        {
          type: 'paragraph',
          text: 'text 4',
        },
        {
          type: 'header',
          title: 'Title 5',
          size: 2,
        },
        {
          type: 'paragraph',
          text: 'text 5',
        },
      ],
    })
  })
})

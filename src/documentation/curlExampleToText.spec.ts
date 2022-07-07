import { describe, expect } from 'jest-without-globals'
import curlExampleToText from './curlExampleToText'

// yarn test -t 'curlExampleToText'

describe('curlExampleToText', () => {
  it('handles simple get request', () => {
    expect(
      curlExampleToText({
        baseUrl: 'https://ya.ru/',
        path: 'method-name',
        method: 'GET',
      })
    ).toBe('curl https://ya.ru/method-name')
  })

  it('handles simple post request', () => {
    expect(
      curlExampleToText({
        baseUrl: 'https://ya.ru/',
        path: 'method-name',
        method: 'POST',
      })
    ).toBe(`curl -i -X POST \\
  https://ya.ru/method-name`)
  })

  it('handles request with bearer athorithation', () => {
    expect(
      curlExampleToText({
        baseUrl: 'https://ya.ru/',
        path: 'method-name',
        method: 'POST',
        auth: {
          type: 'headerToken',
          token: 'someToken',
        },
      })
    ).toBe(`curl -i -X POST \\
  --header "authorization: someToken" \\
  https://ya.ru/method-name`)
  })

  it('handles request with data', () => {
    expect(
      curlExampleToText({
        baseUrl: 'https://ya.ru/',
        path: 'method-name',
        method: 'POST',
        data: {
          firstName: 'Ivan',
          lastName: 'Dorchenko',
        },
      })
    ).toBe(`curl -i -X POST \\
  --header "Content-Type: application/json" \\
  --data '{
    "firstName": "Ivan",
    "lastName": "Dorchenko"
  }' \\
  https://ya.ru/method-name`)
  })

  it('handles complex request', () => {
    expect(
      curlExampleToText({
        baseUrl: 'https://ya.ru/',
        path: 'method-name',
        method: 'POST',
        auth: {
          type: 'headerToken',
          token: 'someToken',
        },
        data: {
          firstName: 'Ivan',
          lastName: 'Dorchenko',
        },
      })
    ).toBe(`curl -i -X POST \\
  --header "Content-Type: application/json" \\
  --header "authorization: someToken" \\
  --data '{
    "firstName": "Ivan",
    "lastName": "Dorchenko"
  }' \\
  https://ya.ru/method-name`)
  })
})

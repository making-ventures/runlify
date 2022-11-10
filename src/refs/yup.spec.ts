// создаем схему, в первом схема валидирует объект, в котором есть ошибка, и ожидаем ошибку из теста
// второй тест, в котором тоже валидируем объект, но валидация проходит

import { describe, expect } from 'jest-without-globals'
import * as Yup from 'yup';

// yarn test -t 'yup'

const schema = Yup.object({
	name: Yup.string().required(),
	age: Yup.number().positive(),
	birthDate: Yup.date().min(new Date('1900-01-01')).max(new Date()).required(),
});

describe('yup', () => {
  it('validation error', () => {
		expect(
			schema.validate({
			name: 'Name',
			age: -1,
			birthDate: new Date('2000-01-01')
		}))
		.rejects
		.toEqual(
			expect.objectContaining({
				errors: ['age must be a positive number'],
			})
		)
  })

  it('validation passes', () => {
    expect(
      schema.validateSync({
				name: 'Name',
				age: 22,
				birthDate: new Date('2000-01-01')
			})
    ).toStrictEqual({
			name: 'Name',
			age: 22,
			birthDate: new Date('2000-01-01')
		})
  })
})

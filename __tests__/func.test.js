import { Table, Schema, Func } from '../src';
import cases from 'jest-in-case';

const func = new Func('add_tags', {
  id: 'text',
  tags: 'text[]'
});

it('select', () => {
  expect(
    func.call(['id', 'email'], {
      id: 'pyramation',
      tags: ['pyramation@gmail.com']
    })
  ).toMatchSnapshot();
  expect(
    func.call(['*'], {
      id: 'pyramation',
      tags: ['pyramation@gmail.com']
    })
  ).toMatchSnapshot();
  expect(
    func.call([], {
      id: 'pyramation',
      tags: ['pyramation@gmail.com']
    })
  ).toMatchSnapshot();
  expect(
    func.call({
      id: 'pyramation',
      tags: ['pyramation@gmail.com']
    })
  ).toMatchSnapshot();
});

import { Table } from '../src';
import cases from 'jest-in-case';

const table = new Table('users', {
  id: 'uuid',
  username: 'text',
  email: 'email',
  password: 'password',
  active: 'boolean',
  github: 'githublink',
  facebook: 'fblink',
  myspace: 'myslink'
});

it('select via class', () => {
  expect(
    table.select(['id', 'email'], {
      username: 'pyramation',
      email: 'pyramation@gmail.com'
    })
  ).toMatchSnapshot();
});

it('selectOne via class', () => {
  expect(
    table.selectOne(['id', 'email'], {
      username: 'pyramation',
      email: 'pyramation@gmail.com'
    })
  ).toMatchSnapshot();
});

it('insert via class', () => {
  expect(
    table.insert({ username: 'pyramation', email: 'pyramation@gmail.com' })
  ).toMatchSnapshot();
});
it('update via class', () => {
  expect(
    table.update(
      {
        username: 'pyramation',
        email: 'pyramation@gmail.com'
      },
      {
        email: 'pyramation@gmail.com'
      }
    )
  ).toMatchSnapshot();
});

it('update many fields via class', () => {
  expect(
    table.update(
      {
        email: 'cheerios@gmail.com',
        username: 'pyramation',
        active: true,
        password: 'secure',
        avatar: 'http://some.link',
        github: 'pyramation',
        launchql: 'yes',
        facebook: 'danlynch',
        myspace: 'forgot',
        tags: 'pyramation'
      },
      {
        email: 'pyramation@gmail.com'
      }
    )
  ).toMatchSnapshot();
});

it('delete via a class', () => {
  expect(
    table.delete({ username: 'pyramation', email: 'pyramation@gmail.com' })
  ).toMatchSnapshot();
  expect(
    table.delete({ username: 'pyramation', email: 'pyramation@gmail.com' }, 2)
  ).toMatchSnapshot();
});

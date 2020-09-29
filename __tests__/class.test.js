import { Table, Schema } from '../src';
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

const schema1 = new Schema('myschema');
const schema2 = new Schema('my-schema');
const table2 = schema1.table('users');
const table3 = schema2.table('users');

it('select', () => {
  expect(
    table.select(['id', 'email'], {
      username: 'pyramation',
      email: 'pyramation@gmail.com'
    })
  ).toMatchSnapshot();
  expect(
    table2.select(['id', 'email'], {
      username: 'pyramation',
      email: 'pyramation@gmail.com'
    })
  ).toMatchSnapshot();
  expect(
    table3.select(['id', 'email'], {
      username: 'pyramation',
      email: 'pyramation@gmail.com'
    })
  ).toMatchSnapshot();
});

it('selectOne', () => {
  expect(
    table.selectOne(['id', 'email'], {
      username: 'pyramation',
      email: 'pyramation@gmail.com'
    })
  ).toMatchSnapshot();
});

it('selectOne by id', () => {
  expect(
    table.selectOne([], {
      id: 'boom'
    })
  ).toMatchSnapshot();
});

it('insert', () => {
  expect(
    table.insert({ username: 'pyramation', email: 'pyramation@gmail.com' })
  ).toMatchSnapshot();
  expect(
    table.insert(
      { username: 'pyramation', email: 'pyramation@gmail.com' },
      false
    )
  ).toMatchSnapshot();
  expect(
    table.insert({ username: 'pyramation', email: 'pyramation@gmail.com' }, [
      'id',
      'username'
    ])
  ).toMatchSnapshot();
});
it('update', () => {
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

it('update many fields', () => {
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

it('test', () => {
  const schema = new Schema('public');
  const table = schema.table('users', {
    id: 'uuid',
    username: 'text',
    email: 'email',
    password: 'password',
    active: 'boolean',
    tags: 'text[]'
  });

  expect(
    table.update(
      {
        active: true,
        tags: ['pyramation']
      },
      {
        id: 1
      }
    )
  ).toMatchSnapshot();
});

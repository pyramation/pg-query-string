import squel from '../src';

it('select', () => {
  expect(
    squel
      .select()
      .field('id')
      .from('students')
      .where(
        squel
          .expr()
          .and("name = 'Thomas'")
          .or('age > 18')
      )
      .toParam()
  ).toMatchSnapshot();
});

it('insert', () => {
  expect(
    squel
      .insert()
      .into('users')
      .set('username', 'pyramation', 'type1')
      .set('email', 'pyramation@gmail.com', 'type2')
      .returning('*')
      .toParam({ casts: { username: 'int' } })
  ).toMatchSnapshot();
});

it('update', () => {
  expect(
    squel
      .update()
      .table('students')
      .set('name', 'Fred', 'text')
      .set('age', 29)
      .set('data', { a: 1, b: 2 }, 'jsonb')
      .set('score', 1.2, 'numeric')
      .set('graduate', false, 'boolean')
      .set(
        'level',
        squel
          .select()
          .field('MAX(level)')
          .from('levels')
      )
      .toParam()
  ).toMatchSnapshot();
});

it('where', () => {
  expect(
    squel
      .select()
      .field('id')
      .from('students')
      .where(
        squel
          .expr()
          .and('name = ?', 'dude')
          .or('age > ?', 18)
      )
      .limit(2)
      .toParam()
  ).toMatchSnapshot();
});

it('delete', () => {
  expect(
    squel
      .delete()
      .from('students')
      .where('id > ?', 1)
      .where('id < ?', 100)
      .order('id', false)
      .limit(5)
      .toParam()
  ).toMatchSnapshot();
});

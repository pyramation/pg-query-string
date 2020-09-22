# sql-query

```sh
npm install pg-query-string
```

Thanks to https://github.com/hiddentao/squel

This is essentially squel, however a few changes:

* built with babel instead of gulp
* hard-coded to postgres 
* added type coersions 
* classes handy for testing

```js
import { Table, Schema } from 'pg-query-string';

const schema = new Schema('public');
const table = schema.table('users', {
  id: 'uuid',
  username: 'text',
  email: 'email',
  password: 'password',
  active: 'boolean',
  tags: 'text[]'
});

table.update(
  {
    active: true,
    tags: ['pyramation']
  },
  {
    id: 1
  }
);
```

Which produces the following object

```
Object {
  "text": "UPDATE \\"my-schema\\".users SET active = $1::boolean, tags = ($2::text[]) WHERE (id = $3::uuid)",
  "values": Array [
    true,
    Array [
      "pyramation",
    ],
    1,
  ],
}
```
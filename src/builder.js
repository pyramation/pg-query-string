import squel from './squel';
import escape from 'pg-escape';

// 0 = pg
// 1 = pg-promise

export class Query {
  constructor({ client, type = 0 }) {
    this.client = client;
    this.type = type;
  }
  async query(asParamsObj) {
    if (!this.type) {
      return await this.client.query(asParamsObj);
    } else {
      return await this.client.any(asParamsObj.text, asParamsObj.values);
    }
  }
}

export class Schema {
  constructor(name) {
    this.name = name;
  }
  table(name, structure) {
    return new Table(name, structure, this.name);
  }
  function(name, structure) {
    return new Func(name, structure, this.name);
  }
}

export class Table {
  constructor(name, structure = {}, schema) {
    if (name.includes('.')) {
      const parts = name.split('.');
      name = parts[1];
      schema = parts[0];
    }
    this.name = name;
    this.qualified = schema ? escape('%I.%I', schema, name) : name;

    this.structure = Object.entries(structure).reduce((m, [k, v]) => {
      m[k] = {
        type: v,
        isArray: v.replace(/[\s]/g, '').endsWith('[]')
      };
      return m;
    }, {});
  }
  insert(opts, returning = ['*']) {
    const builder = Object.entries(opts).reduce((m, v) => {
      const [field, value] = v;
      if (this.structure[field]) {
        if (this.structure[field].isArray) {
          return m.set(field, [value], this.structure[field].type);
        } else {
          return m.set(field, value, this.structure[field].type);
        }
      } else {
        return m.set(field, value);
      }
    }, squel.insert().into(this.qualified));
    if (returning && returning.length) {
      return builder.returning(returning.join(',')).toParam();
    }
    return builder.toParam();
  }
  update(fields, condition = {}) {
    const casts = [];
    const values = [];

    const builder = Object.entries(fields).reduce((m, v) => {
      const [field, value] = v;
      casts.push(this.structure[field]?.type);
      values.push(value);

      if (this.structure[field]) {
        return m.set(field, value, this.structure[field].type);
      } else {
        return m.set(field, value);
      }
    }, squel.update().table(this.qualified));

    const entries = Object.entries(condition);
    if (!entries.length) return builder.toParam();

    const where = entries.reduce((m, v) => {
      const [field, value] = v;
      casts.push(this.structure[field]?.type);
      values.push(value);
      return m.and(`${field} = ?`);
    }, squel.expr());

    const params = builder.where(where).toParam();

    const str = values.reduce((m, v, i) => {
      const n = i + 1;
      if (typeof casts[i] === 'undefined') return m;
      // if it's already cast, leave it alone...
      const reg = new RegExp(`\\$${n}::`);
      if (reg.test(m)) return m;
      // cast it
      return m.replace('$' + n, '$' + n + '::' + casts[i]);
    }, params.text);

    return {
      text: str,
      values
    };
  }
  selectOne(fields = [], opts = {}) {
    return this.select(fields, opts, 1);
  }
  select(fields = [], opts = {}, limit = 0) {
    const selection = fields.reduce((m, v) => {
      if (v === '*') return m;
      return m.field(v);
    }, squel.select().from(this.qualified));

    const entries = Object.entries(opts);

    const builder = limit > 0 ? selection.limit(limit) : selection;

    if (!entries.length) return builder.toParam();

    const casts = [];
    const values = [];

    const where = entries.reduce((m, v) => {
      const [field, value] = v;
      casts.push(this.structure[field]?.type);
      values.push(value);
      return m.and(`${field} = ?`);
    }, squel.expr());

    if (limit > 0 && builder.toParam().values.length) {
      casts.push();
      values.push(builder.toParam().values[0]);
    }

    const a = builder.where(where).toParam();

    const str = values.reduce((m, v, i) => {
      const n = i + 1;
      if (typeof casts[i] === 'undefined') return m;
      return m.replace('$' + n, '$' + n + '::' + casts[i]);
    }, a.text);

    return {
      text: str,
      values
    };
  }
  delete(opts = {}, limit = 0) {
    const deletion = squel.delete().from(this.qualified);

    const entries = Object.entries(opts);

    const builder = limit > 0 ? deletion.limit(limit) : deletion;

    if (!entries.length) return builder.toParam();

    const casts = [];
    const values = [];

    const where = entries.reduce((m, v) => {
      const [field, value] = v;
      casts.push(this.structure[field]?.type);
      values.push(value);
      return m.and(`${field} = ?`);
    }, squel.expr());

    if (limit > 0 && builder.toParam().values.length) {
      casts.push();
      values.push(builder.toParam().values[0]);
    }

    const a = builder.where(where).toParam();

    const str = values.reduce((m, v, i) => {
      const n = i + 1;
      if (typeof casts[i] === 'undefined') return m;
      return m.replace('$' + n, '$' + n + '::' + casts[i]);
    }, a.text);

    return {
      text: str,
      values
    };
  }
}

export class Func {
  constructor(name, structure = {}, schema) {
    if (name.includes('.')) {
      const parts = name.split('.');
      name = parts[1];
      schema = parts[0];
    }
    this.name = name;
    this.qualified = schema ? escape('%I.%I', schema, name) : name;

    this.structure = Object.entries(structure).reduce((m, [k, v]) => {
      m[k] = {
        type: v,
        isArray: v.replace(/[\s]/g, '').endsWith('[]')
      };
      return m;
    }, {});
  }
  call(fields = [], params) {
    if (!Array.isArray(fields)) {
      params = fields;
      fields = [];
    }
    if (!params && !fields.length) {
      params = {};
      fields = [];
    }

    const entries = Object.entries(params);
    const casts = [];
    const values = [];
    entries.forEach(v => {
      const [field, value] = v;
      casts.push(this.structure[field]?.type);
      values.push(value);
    });

    const builder = fields.reduce((m, v) => {
      if (v === '*') return m;
      return m.field(v);
    }, squel.select().from(`${this.qualified}(${values.map(v => '?').join(',')})`));

    const a = builder.toParam();

    const str = values.reduce((m, v, i) => {
      const n = i + 1;
      if (typeof casts[i] === 'undefined') return m;
      return m.replace('$' + n, '$' + n + '::' + casts[i]);
    }, a.text);

    return {
      text: str,
      values
    };
  }
}

const test = require('tape');
const jsonappy = require('./');
const redis = require('redis');
const provider = redis.createClient({ return_buffers: true, prefix: 'jsonappy:test:' });

test('encode and decode', t => {
  t.plan(2);

  jsonappy({ foo: 'bar' }).then(buffer => {
    t.equal(Buffer.isBuffer(buffer), true);
    jsonappy(buffer).then(data => t.equal(data.foo, 'bar'));
  });
});

test('do not decode invalid values', { timeout: 3000 }, t => {
  t.plan(3);
  jsonappy(null).then(data => t.equal(data, null, 'null'));
  jsonappy(false).then(data => t.equal(data, false, 'false'));
  jsonappy(undefined).then(data => t.equal(data, undefined, 'undefined'));
});

test('provider set and get', { timeout: 3000 }, t => {
  const expected = { foo: 'bar' };

  t.plan(1);

  jsonappy(provider).set('foobar', expected).then(() => {
    jsonappy(provider).get('foobar').then(data => t.equal(data.foo, 'bar'));
    provider.del('foobar');
  });
});

test('send provider empty values', { timeout: 3000 }, t => {
  t.plan(1);
  jsonappy(provider).get('ajsipdjaisopdja').then(data => t.equal(data, null));
});

test.onFinish(() => process.exit(0));

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

test('provider set and get', t => {
  const expected = { foo: 'bar' };

  t.plan(1);

  jsonappy(provider).set('foobar', expected).then(() => {
    jsonappy(provider).get('foobar').then(data => t.equal(data.foo, 'bar'));
    provider.del('foobar');
  });
});

test.onFinish(() => process.exit(0));

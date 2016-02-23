# jsonappy
[Snappy](http://google.github.io/snappy/) compress JSON for Redis and other providers.

[![Build Status](https://travis-ci.org/chefsplate/jsonappy.svg?branch=master)](http://travis-ci.org/chefsplate/jsonappy)

## Getting started
`npm i jsonappy --save`

```js
const jsonappy = require('jsonappy');
let buffer = null;

jsonappy({ foo: 'bar' })
  .then(snappy => { buffer = snappy });
  // <Buffer ...>

jsonappy(buffer)
  .then(data => console.log(data));
  // { foo: 'bar' }
```

## Redis and other providers
Supposing your provider follow getter and setter format as [node-redis](https://github.com/NodeRedis/node_redis).

```js
const jsonappy = require('jsonappy');
const redis = require('redis');
const client = jsonappy(redis.createClient({ return_buffers: true }));

client.set('mykey', { foo: 'bar' }).then();

client.get('mykey')
  .then(data => console.log(data));
  // { foo: 'bar' }
```
## Develop
For test proposes, please make sure to have **redis-server** running.

```shell
npm start
```

## Requirements
Node.js 4+

MIT License
(c) [Chef's Plate](http://chefsplate.com)

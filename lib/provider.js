const parser = require('./parser');

const providerPromise = (provider, method, key, value) => (resolve, reject) => {
  const callback = (err, data) => err ? reject(err) : resolve(data);

  if (value) {
    provider[method](key, value, callback);
  } else {
    provider[method](key, callback);
  }
};

const wrapProvider = provider => (method, key, value) =>
  new Promise(providerPromise(provider, method, key, value));

module.exports = (targetProvider) => {
  const provider = wrapProvider(targetProvider);

  return {
    get(key) {
      return provider('get', key).then(buffer => parser.decode(buffer));
    },
    set(key, value) {
      return parser.encode(value).then(buffer => provider('set', key, buffer));
    }
  };
};

const parser = require('./parser');

const providerPromise = (provider, key, value) => (resolve, reject) => {
  const callback = (err, data) => (!err && data) ? resolve(data) : reject(err);

  if (value) {
    provider.set(key, value, callback);
  } else {
    provider.get(key, callback);
  }
};

const wrapProvider = provider => (key, value) =>
  new Promise(providerPromise(provider, key, value));

module.exports = (targetProvider) => {
  const provider = wrapProvider(targetProvider);

  return {
    get(key) {
      return provider(key).then(buffer => parser.decode(buffer));
    },
    set(key, value) {
      return parser.encode(value).then(buffer => provider(key, buffer));
    }
  };
};

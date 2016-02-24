module.exports = (config) =>
  (config && !Buffer.isBuffer(config) && config.get && typeof config.get === 'function') ?
    require('./lib/provider')(config) : require('./lib/parser')(config);

const snappy = require('snappy');
const snappyFactory = (method, input, config) => (resolve, reject) => {
  const configArg = config ? [config] : [];
  const callbackArg = [(err, data) => err ? reject(err) : resolve(data)];

  snappy[method].apply(null, [input].concat(configArg, callbackArg));
};

const compressor = (method, input, config) => new Promise(snappyFactory(method, input, config));
const decodePromise = input => (resolve, reject) =>
  compressor('uncompress', input, { asBuffer: true })
    .then(buffer => {
      const stringData = buffer.toString('utf8');
      const data = stringData ? JSON.parse(stringData) : stringData;

      resolve(data);
    })
    .catch(reject);

const parser = input => {
  if (!input) {
    return new Promise(resolve => resolve(input));
  }

  return parser[Buffer.isBuffer(input) ? 'decode' : 'encode'](input);
};

parser.encode = input => compressor('compress', JSON.stringify(input));
parser.decode = input => new Promise(decodePromise(input));
module.exports = parser;

const querystring = require('querystring');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/**
 * Формирует строку коннекта к MongoDB
 * @param  {Object} config Объект конфига
 * @return {String}        Строка коннекта к БД
 */
function getConnectionUri(config) {
  let connectionUri = 'mongodb://';
  if (config.username) connectionUri = connectionUri + config.username + ':' + config.password + '@';
  connectionUri = connectionUri + config.host;
  if (config.port) connectionUri = connectionUri + ':' + config.port;
  connectionUri = connectionUri + '/' + config.database;
  if (config.options) {
    connectionUri = connectionUri + '?' + querystring.stringify(config.options);
  }
  return connectionUri;
}

/**
 * Конектит mongoose к монге
 * @param  {Object} config объект с параметрами соединения mongoose
 * @return {Promise}       resolve => Объект соединения к MongoDB, reject => ошибка подключения к MongoDB
 */
function connect(config) {
  return new Promise((resolve, reject) => {
    mongoose.connect(getConnectionUri(config.connection), config.options);
    const db = mongoose.connection;
    const onError = err => {
      reject(err);
      db.removeListener('open', onOpen);
    };
    const onOpen = () => {
      resolve(db);
      db.removeListener('error', onError);
    };
    db.once('error', onError);
    db.once('open', onOpen);
  });
}

module.exports = connect;

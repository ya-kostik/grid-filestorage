const isObject = require('lodash/isObject');
const FilestorageError = require('./FilestorageError');

class Filestorage {
  constructor(connection, options = {}) {
    if (!connection) throw new FilestorageError('connection is not defined');
    this.connection = connection;
    this.options = { title: '' };

    if (isObject(options)) {
      Object.assign(this.options, options);
    }
  }
}

module.exports = Filestorage;

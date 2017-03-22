const mongodb = require('mongodb');
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

  write(file, filename = new mongodb.ObjectID(), meta = {}) {
    if (this.options.title) {
      filename = `${this.options.title}-${filename}`;
    }
    const gs = new mongodb.GridStore(this.connection.db, filename, 'w', meta);
    return gs.open().
    then(() => {
      return new Promise((resolve, reject) => {
        file.on('data', chunk => gs.write(chunk));
        file.once('end', () => resolve());
        file.once('close', () => resolve());
        file.once('error', err => reject(err));
      });
    }).
    then(() => gs.close());
  }
}

module.exports = Filestorage;

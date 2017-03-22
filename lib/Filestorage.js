const mongodb = require('mongodb');
const isObject = require('lodash/isObject');
const FileStorageError = require('./FileStorageError');

class FileStorage {
  constructor(connection, options = {}) {
    if (!connection) throw new FileStorageError('connection is not defined');
    this.connection = connection;
    this.options = { title: '' };
    if (isObject(options)) {
      Object.assign(this.options, options);
    }
  }

  getFileName(filename) {
    if (this.options.title) {
      filename = `${this.options.title}-${filename}`;
    }
    return filename;
  }

  write(file, filename = new mongodb.ObjectID(), meta = {}) {
    filename = this.getFileName(filename);
    const gs = new mongodb.GridStore(this.connection, filename, 'w', meta);
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

  read(filename, isExists = true) {
    filename = this.getFileName(filename);
    let promise;
    if (isExists) {
      promise = mongodb.GridStore.exist(this.connection, filename);
    } else {
      promise = Promise.resolve(true);
    }
    return promise.then((exists) => {
      if (!exists) return null;
      const gs = new mongodb.GridStore(this.connection, filename, 'r');
      return gs.stream(true);
    });
  }

  remove(filename, isExists = true) {
    filename = this.getFileName(filename);
    let promise;
    if (isExists) {
      promise = mongodb.GridStore.exist(this.connection, filename);
    } else {
      promise = Promise.resolve(true);
    }
    return promise.then((exists) => {
      if (!exists) throw new FileStorageError('File is not exists');
      const gs = new mongodb.GridStore(this.connection, filename, 'w');
      return gs.open().then(() => gs.unlink());
    });
  }
}

module.exports = FileStorage;

const mongodb = require('mongodb');
const isObject = require('lodash/isObject');
const FileStorageError = require('./FileStorageError');


/**
 * Simple GridFS FileStorage with simple API
 * @class FileStorage
 */
class FileStorage {
  /**
   * @constructor
   * @param {mongodb.Db} connection    is the native db connection to mongodb
   * @param {Object}     options       options of filestorage
   * @param {String}     options.title title of FileStorage
   */
  constructor(connection, options = {}) {
    if (!connection) throw new FileStorageError('connection is not defined');
    this.connection = connection;
    this.options = { title: '' };
    if (isObject(options)) {
      Object.assign(this.options, options);
    }
  }

  /**
   * Set title prefix before filename if this.options.tile exist
   * @param  {String} filename name of file
   * @return {String}          modified filename
   */
  getFileName(filename) {
    if (this.options.title) {
      filename = `${this.options.title}-${filename}`;
    }
    return filename;
  }

  /**
   * streams stream into GridFS with filename and meta
   * @param  {Stream} file     readable stream
   * @param  {String} filename name of file, optional. If filename does not exist, filestorage will auto-generate it
   * @param  {Object} meta     meta information about file for GridFS, optional
   * @return {Promise}         resolve {String} — inserted filename
   */
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
    then(() => gs.close()).
    then(() => filename);
  }

  /**
   * read file from GridFS by filename
   * @param  {String}  filename name of file to read. If filestorage has title, filename must exclude `title + '-'` part
   * @param  {Boolean} isExists if this flag is true, method will check file before read
   * @return {Promise}          resolve {Stream|null} — Readable Stream or null, if file does not exist
   */
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

  /**
   * remove file from GridFS by filename
   * @param  {String}  filename name of file to remove. If filestorage has title, filename must exclude `title + '-'` part
   * @param  {Boolean} isExists if this flag is true, method will check file before remove
   * @return {Promise}          reject {FileStorageError} — File does not exist if it does not exist
   */
  remove(filename, isExists = true) {
    filename = this.getFileName(filename);
    let promise;
    if (isExists) {
      promise = mongodb.GridStore.exist(this.connection, filename);
    } else {
      promise = Promise.resolve(true);
    }
    return promise.then((exists) => {
      if (!exists) throw new FileStorageError('File does not exist');
      const gs = new mongodb.GridStore(this.connection, filename, 'w');
      return gs.open().then(() => gs.unlink());
    });
  }
}

module.exports = FileStorage;

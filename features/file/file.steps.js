const { defineSupportCode } = require('cucumber');
const fs = require('fs');
const path = require('path');
const mongodb = require('mongodb');

const Filestorage = require('../../lib/Filestorage');

defineSupportCode(function({ Given, Then }) {
  // write
  Given('есть файл {stringInDoubleQuotes}', function (filename, callback) {
    this.payload.filestream = fs.createReadStream(path.join(__dirname, filename));
    callback(null);
  });

  Given('мы его запишем его через метод {stringInDoubleQuotes} в хранилище {stringInDoubleQuotes}, имя файла {stringInDoubleQuotes}', function (method, title, filename) {
    this.payload.filestorage = new Filestorage(this.connection, { title });
    return this.payload.filestorage[method](this.payload.filestream, filename);
  });

  Then('в Grid появляется файл {stringInDoubleQuotes}', function (filename, callback) {
    mongodb.GridStore.exist(this.connection.db, filename, (err, exists) => {
      callback(!exists);
    });
  });

  // read
  Given('в Grid есть файл {stringInDoubleQuotes}', function(filename, callback) {
    mongodb.GridStore.exist(this.connection.db, filename, (err, exists) => {
      callback(!exists);
    });
  });

  Given('мы прочитаем {stringInDoubleQuotes} его через метод {stringInDoubleQuotes}', function(filename, method) {
    this.payload.filestorage[method](filename).
    then((stream) => {
      this.payload.filestream = stream;
    });
  });

  Then('нам вернется поток и из него мы прочитаем {stringInDoubleQuotes}', function(text, callback) {
    if (!this.payload.filestream) throw new Error('Stream is not defined');
    let data = '';
    this.payload.filestream.on('data', chunk => data += chunk);
    this.payload.filestream.on('end', () => callback(data !== text));
    this.payload.filestream.on('error', err => callback(err));
  });

  // remove
});

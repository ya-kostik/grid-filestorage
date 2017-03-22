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


  // remove
});

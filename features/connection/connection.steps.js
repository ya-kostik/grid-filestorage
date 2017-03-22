const FileStorage = require('../../lib/FileStorage');

const { defineSupportCode } = require('cucumber');

defineSupportCode(function({ Given, Then }) {
  Given('в конструктор передали объект соединения и заголовок {stringInDoubleQuotes} вторым параметром', function (title, callback) {
    this.payload.filestorage = new FileStorage(this.connection, { title });
    callback();
  });
  Then('соединение сохранится в поле {stringInDoubleQuotes}', function (field, callback) {
    callback(!this.payload.filestorage.connection);
  });
  Then('заголовок попадет в поле {stringInDoubleQuotes} и оно будет равно {stringInDoubleQuotes}', function (field, title, callback) {
    callback(!(this.payload.filestorage.options.title === title));
  });
});

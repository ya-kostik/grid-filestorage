const Filestorage = require('../../lib/Filestorage');

const { defineSupportCode } = require('cucumber');

let filestorage;

defineSupportCode(function({ Before, After, Given, Then }) {
  Given(/^в конструктор передали объект соединения$/, function (callback) {
    filestorage = new Filestorage({});
    callback();
  });
  Then('оно сохранится в поле {stringInDoubleQuotes}', function (field, callback) {
    callback(!filestorage.connection);
  });
});

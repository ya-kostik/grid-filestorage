const { defineSupportCode } = require('cucumber');

defineSupportCode(function({ After }) {
  After(function() {
    this.payload = {};
  });
});

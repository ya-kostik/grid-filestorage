const { defineSupportCode } = require('cucumber');

defineSupportCode(function({ After }) {
  After(function() {
    this.payload = {};
    if (!this.connection) return;
    return this.connection.close();
  });
});

const { defineSupportCode } = require('cucumber');

defineSupportCode(function({ Before }) {
  Before(function() {
    this.payload = {};
  });
});

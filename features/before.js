const { defineSupportCode } = require('cucumber');
const connect = require('./connect');
const connectConfig = require('./connect.config');

defineSupportCode(function({ Before }) {
  Before(function() {
    this.payload = {};
    if (!this.connection) {
      return connect(connectConfig).
      then((connection) => {
        this.connection = connection;
      });
    }
  });
});

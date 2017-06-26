

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');


mongoose.connect(config.db);
var db = mongoose.connection;

db.on("error", function (error) {
  console.log("数据库连接失败：" + error + config.db);
});

db.on("open", function () {
  console.log("数据库连接成功");
})

db.on('disconnected', function () {
  console.log('数据库连接断开');
})

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

module.exports = require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});


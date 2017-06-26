var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  users = require('../models/users');

//跳转到角色页面
module.exports = function (app) {
  app.use('/passwordUpdate', router);
};

//渲染角色页面
router.get('/', function (req, res, next) {
  res.render('passwordUpdate', {});
});


//渲染角色页面
router.post('/updatePwd', function (req, res, next) {
  var datas = req.body;
  users.find({}).where('id').equals(datas.id).update('password').equals(datas.passwordNow).exec(function (err, rs) {
    if (err) return next(err);
    res.json({
      status: 1000,
      msg: "操作成功"
    });
  });
});

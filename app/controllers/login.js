var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Roles = mongoose.model('Roles'),
  Users = mongoose.model('Users');

module.exports = function (app) {
  app.use('/login', router);
};

  router.get('/', function (req, res, next) {

    Roles.find(function (err, rolesList) {
      if (err) return next(err);
      res.render('login', {
        rolesList: rolesList
      });
    });
  });

  router.post('/login', function (req, res, next) {

    var _conditions = {};

    _conditions.loginName = req.body.loginName;
    _conditions.password = req.body.password;
    //_conditions.roleId = req.body.roleId;

    if(_conditions.loginName && _conditions.password) {

      Users.find(_conditions,function (err, docs) {
        if (err) return next(err);
        console.log('docs ==========' +docs);
        if(docs.length > 0) {
          //存储session到mongodb里面去
          req.session.userInfo = docs;
          return res.json({
            status: 1000,
            msg: "操作成功",
            data: docs
          });
        }else {
          res.json({
            status: 1000,
            msg: "查询失败，当前用户不存在!"

          })
        }

      });
    }else {
      if(!_conditions.loginName) {
        res.json({
          status: 1001,
          msg: "操作失败,user参数异常！"

        })
      }else if(!_conditions.password){
        res.json({
          status: 1001,
          msg: "操作失败,password参数异常!"

        })
      }

    }

});

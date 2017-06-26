var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  users = require('../models/users');

//跳转到角色页面
module.exports = function (app) {
  app.use('/userList', router);
};

//渲染角色页面
router.get('/', function (req, res, next) {
  res.render('userList', {});
});


//角色列表-查询接口
router.post('/list', function (req, res, next) {

  var conditions = {};

  var _body = req.body;

  var pageSize = _body.pageSize,
    currPage = _body.currPage;

  if(_body.data) {

    _body.data = JSON.parse(_body.data);

    if(_body.data.loginName) {
      //正则表达式，进行模糊匹配。


      var str = new RegExp("^"+_body.data.loginName);

      conditions.loginName = {'$regex': str,$options: 'imxs' };
    }
    if(_body.data.userType ) {
      conditions.userType =_body.data.userType;
    }
    if(_body.data.status ) {
      conditions.status =_body.data.status;
    }

  }

    users.find(conditions)
          .select({ __v:0,password: 0})
          .skip((currPage-1)*pageSize)
          .limit(pageSize)
          .sort({'loginName':1})
          .exec(function(err, rs) {
          if(err) {
            res.send(err);
          }else {
            users.find(conditions,function (err, docs) {
             if (err) return next(err);
               return res.json({
               status: 1000,
               msg: "操作成功",
               data:{
                 data: {
                   sumPage: Math.ceil(docs.length/pageSize) ? Math.ceil(docs.length/pageSize) : 1,
                   countData: docs.length,
                   currPage: currPage,
                   pageSize: pageSize,
                   result: rs
                 }

               }
               });
             });
          }
        });

});


//角色列表-增加接口
router.post('/add', function (req, res, next) {

  var body = req.body;
  var data = {
    loginName: body.loginName,
    password: body.password,
    nickName: body.nickName,
    userType: body.userType,
    rfId: body.rfId,
    inpatientAreaId: body.inpatientAreaId,
    status: body.status
  };

  //后台也需要验证参数是否填充了。否则返回错误码。
  if(data.loginName && data.password && data.nickName && data.userType && data.rfId && data.inpatientAreaId && data.status) {
    users.create(data,function (err, docs) {
      if (err) {
        return next(err);
      }else {
        return res.json({
          status: 1000,
          msg: "操作成功"
        });
      }
    });
  }else {
    return res.json({
      status: 1001,
      msg: "操作失败,参数异常"
    });
  }


});

//角色列表-删除接口
router.post('/delete', function (req, res, next) {

  var body = req.body;
  var _id = body.id;

  if(_id) {
    users.remove({_id: _id},function (err, docs) {
      if (err) {
        return next(err);
      }else {
        return res.json({
          status: 1000,
          msg: "操作成功"
        });
      }

    });
  }else {
    return res.json({
      status: 10001,
      msg: "操作失败，_id字段异常。"
    });
  }


});



//角色列表-编辑接口
router.post('/update', function (req, res, next) {

  //调用函数异常
  function failBack(param) {
    return res.json({
      status: 1001,
      msg: "操作失败,"+ param +'字段存在异常'
    });
  }

  var body = req.body;

  var data = {
    id: body.id,
    loginName: body.loginName,
    nickName: body.nickName,
    userType: body.userType,
    rfId: body.rfId,
    inpatientAreaId: body.inpatientAreaId,
    status: body.status
  }

  if(data.id && data.loginName && data.nickName && data.userType && data.rfId && data.inpatientAreaId && data.status ) {
    users.update({_id: data['id']},{loginName: data['loginName'],nickName: data['nickName'],
      userType: data['userType'],rfId: data['rfId'],inpatientAreaId: data['inpatientAreaId'],status: data['status']},function (err, docs) {
      if (err) {
        return next(err);
      }else {
        return res.json({
          status: 1000,
          msg: "操作成功"
        });
      }
    });
  }else {
    if(!data['id']) {
      failBack('id');
    }else if(!data['loginName']){
      failBack('loginName');
    }else if(!data['nickName']){
      failBack('nickName');
    }else if(!data['userType']){
      failBack('userType');
    }else if(!data['rfId']){
      failBack('rfId');
    }else if(!data['inpatientAreaId']){
      failBack('inpatientAreaId');
    }else if(!data['status']){
      failBack('status');
    }
  }


});

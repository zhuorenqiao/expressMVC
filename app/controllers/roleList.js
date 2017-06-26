var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Roles = require('../models/roles');

//跳转到角色页面
module.exports = function (app) {
  app.use('/roleList', router);
};

//渲染角色页面
router.get('/', function (req, res, next) {
  res.render('roleList', {});
});


//角色列表-查询接口
router.post('/role/list', function (req, res, next) {

  var conditions = {};

  var _body = req.body;

  var pageSize = _body.pageSize,
    currPage = _body.currPage;

  if(_body.data) {

    _body.data = JSON.parse(_body.data);

    if(_body.data.roleName) {
      //正则表达式，进行模糊匹配。


      var str = new RegExp("^"+_body.data.roleName);

      conditions.roleName = {'$regex': str,$options: 'imxs' };
    }
    if(_body.data.status ) {
      conditions.status =_body.data.status;
    }

  }

    Roles.find(conditions)
          .select({createTime: 0, __v:0})
          .skip((currPage-1)*pageSize)
          .limit(pageSize)
          .sort({'roleName':1})
          .exec(function(err, rs) {
          if(err) {
            res.send(err);
          }else {
            Roles.find(conditions,function (err, docs) {
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
router.post('/role/add', function (req, res, next) {

  var body = req.body;

  var data = {
    roleName: body.roleName,
    status: body.status,
    remark: body.remark,
  }

  //后台也需要验证参数是否填充了。否则返回错误码。
  if(data.roleName && data.status && data.remark) {
    Roles.create(data,function (err, docs) {
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
router.post('/role/delete', function (req, res, next) {

  var body = req.body;
  var _id = body.id;

  if(_id) {
    Roles.remove({_id: _id},function (err, docs) {
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
router.post('/role/update', function (req, res, next) {

  //调用函数异常
  function failBack(param) {
    return res.json({
      status: 1001,
      msg: "操作失败,"+ param +'字段存在异常'
    });
  }

  var body = req.body;

  var data = {

     _id: body.id,
    _roleName: body.roleName,
    _status: body.status,
    _remark: body.remark,
  }

  if(data['_id'] && data['_roleName'] && data['_status'] && data['_remark']) {
    Roles.update({_id: data['_id']},{roleName: data['_roleName'],status: data['_status'],remark: data['_remark']},function (err, docs) {
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
    if(!data['_id']) {
      failBack('_id');

    }else if(!data['_roleName']){
      failBack('roleName');

    }else if(!data['_status']) {
      failBack('status');

    }else if(!data['_remark']){
      failBack('remark');
    }
  }


});

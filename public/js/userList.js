"use strict";

$(function () {


  /*********************************************************************************************************************
   ********************************************    表单验证      ********************************************************
   *********************************************************************************************************************/
  function validateFile(selector, options, fn) {

    selector.validate({
      "rules": {
        "loginName": {
          "required": true
        },
        "password": {
          "required": true
        },
        "nickName": {
          "required": true
        },
        "rfId": {
          "required": true
        },
        "inpatientAreaId": {
          "required": true,
          "min": 0
        }
      },
      "messages": {
        "loginName": {
          "required": "该字段必填！"
        },
        "password": {
          "required": "该字段必填！"
        },
        "nickName": {
          "required": "该字段必填！"
        },
        "rfId": {
          "required": "该字段必填！"
        },
        "inpatientAreaId": {
          "required": "该字段必填！",
          "min": "请选择科室ID！"
        }
      }
    });

    if (selector.valid()) {
      $.ajax(options).done(fn).fail(function (err) {
        console.log(err);
      });
    }
  }


  //数组去重复
  Array.prototype.unique = function(){
    var res = [];
    var json = {};
    for(var i = 0; i < this.length; i++){
      if(!json[this[i]]){
        res.push(this[i]);
        json[this[i]] = 1;
      }
    }
    return res;
  }


  //查询所有科室
  function renderInpatientAreaIdDom(_inpatientAreaId) {

    var body = {};
    body.currPage = 1;
    body.pageSize = 999;

    body.data = JSON.stringify({"keyWord":""});


    $.ajax({
      type:"post",
      dataType: "json",
      url: "/userList/search.do",
      contentType : "application/json",
      data: JSON.stringify(body)
    }).done(function (data) {
      if (data.status === 1000) {

        //数据拼接，过滤重复的科室id(worldId);

        var worldIds = [];

        var datas = data.data.result;

        for(var i = 0 ; i < datas.length; i++) {
          worldIds.push(datas[i].wardId);
        }

        worldIds =  worldIds.unique();

        var thisWorldIds = [];


        worldIds.forEach(function(item) {
          thisWorldIds.push({'value': item});
        });

        if(_inpatientAreaId) {
          data.editStatus = true;
          for(var j = 0; j < thisWorldIds.length;j++) {
            if(_inpatientAreaId == thisWorldIds[j].value) {
              thisWorldIds[j].selected = 'selected';
              break;
            }
          }
        }

        data.data.worldIds = thisWorldIds;

        $('#inpatientAreaId').html(template('inpatientAreaIdTemplate',data));

      }
    }).fail(function (err) {
      console.log(err);
    });
  }



  //事件处理方法
  function bindEvents() {

    /*********************************************************************************************************************
     ********************************************    新建操作      ********************************************************
     *********************************************************************************************************************/
    $("#newBtn").on('click', function () {

      layer.open({
        title: "新建用户",
        area: ['1200px', '500px'],
        type: 0,
        btn: ["确定", "取消"],
        content:
        '<form class="container" id="newUserDom">' +
        '<div class="row">' +
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">用户名:</label>' +
        '<div class="col-sm-10"><input type="text" class="form-control loginName" name="loginName" /></div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">密码:</label>' +
        '<div class="col-sm-10"><input type="text" class="form-control password" name="password" /></div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">用户姓名:</label>' +
        '<div class="col-sm-10"><input type="text" class="form-control nickName" name="nickName" /></div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">设备ID:</label>' +
        '<div class="col-sm-10"><input type="text" class="form-control rfId" name="rfId" /></div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label" for="inpatientAreaId">科室ID:</label>' +
        '<div class="col-sm-10"><input type="text" class="form-control inpatientAreaId" name="inpatientAreaId" id="inpatientAreaId" /></div>' +
        '</div>' +
/*        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">科室ID:</label>' +
        '<div class="col-sm-10">'+
        '<select class="form-control inpatientAreaId" name="inpatientAreaId" id="inpatientAreaId">'+

        '</select>'+
        '</div>' +
        '</div>' +*/
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">用户类型:</label>' +
        '<div class="col-sm-10">' +
        '<select name="userType" class="form-control userType">' +
        '<option value="1">护士</option>' +
        '<option value="2">医生</option>'+
        '</select>' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">状态:</label>' +
        '<div class="col-sm-10">' +
        '<select name="status" class="form-control status">' +
        '<option value="1">正常</option>' +
        '<option value="2">停用</option>'+
        '</select>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</form>',
        success: function() {
          //renderInpatientAreaIdDom();
        },
        yes: function yes() {

          //获取参数
          var _params = {
            "loginName": $('#newUserDom').find('.loginName').val(),
            "password": $('#newUserDom').find('.password').val(),
            "nickName": $('#newUserDom').find('.nickName').val(),
            "userType": $('#newUserDom').find('.userType').val(),
            "rfId": $('#newUserDom').find('.rfId').val(),
            "inpatientAreaId": $('#newUserDom').find('.inpatientAreaId').val(),
            "status": $('#newUserDom').find('.status').val()
          };
          debugger;

          //表单验证
          //参数形式  selector, ajax - options ,  successCallback
          validateFile($('#newUserDom'), {
            type:"post",
            dataType: "json",
            url: "/userList/add",
            contentType : "application/json",
            data: JSON.stringify(_params)
          }, function (data) {
            if(data.status == 1000 ) {
              layer.msg("操作成功", {icon: 1}, renderTabDom({page:1}));
            }else {
              layer.msg("操作失败。"+data.status + ':' + data.msg, {
                icon: 2
              });
            }
          });
        }
      });
    });

    /*********************************************************************************************************************
     ********************************************    编辑操作      ********************************************************
     *********************************************************************************************************************/
    $("#table").on("click", ".edit", function () {

      var parentTrDom = $(this).closest('tr'),
        _id = parentTrDom.data('id') || '',
        _loginName = parentTrDom.data('loginname') || '',
        _nickName = parentTrDom.data('nickname') || '',
        _userType = parentTrDom.data('usertype') || '',
        _rfId = parentTrDom.data('rfid') || '',
        _inpatientAreaId = parentTrDom.data('inpatientareaid') || '',
        _status = parentTrDom.data('status') || '';

      var userTypeFn = function userTypeFn() {

        var userTypeDom = '';

        if (_userType == 1) {
          userTypeDom += '<option value="1" selected = "selected">护士</option>';
        } else {
          userTypeDom += '<option value="1">护士</option>';
        }
        if (_userType == 2) {
          userTypeDom += '<option value="2" selected = "selected">医生</option>';
        } else {
          userTypeDom += '<option value="2">医生</option>';
        }
        return userTypeDom;
      };

      var statusFn = function statusFn() {

        var statusDom = '';

        if (_status == 1) {
          statusDom += '<option value="1" selected = "selected">正常</option>';
        } else {
          statusDom += '<option value="1">正常</option>';
        }
        if (_status == 2) {
          statusDom += '<option value="2" selected = "selected">停用</option>';
        } else {
          statusDom += '<option value="2">停用</option>';
        }
        return statusDom;
      };

      layer.open({
        title: "编辑",
        area: ['1200px', '500px'],
        type: 0,
        btn: ["确定","取消"],
        content:
        '<form class="container" id="editUseDom">' +
        '<div class="row">' +
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">用户名:</label>' +
        '<div class="col-sm-10"><input type="text" value="'+ _loginName +'" class="form-control loginName" name="loginName" /></div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">用户姓名:</label>' +
        '<div class="col-sm-10"><input type="text" value="'+ _nickName +'" class="form-control nickName" name="nickName" /></div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">设备ID:</label>' +
        '<div class="col-sm-10"><input type="text" value="'+ _rfId +'" class="form-control rfId" name="rfId" /></div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label" for="inpatientAreaId">科室ID:</label>' +
        '<div class="col-sm-10"><input type="text" value="'+ _inpatientAreaId +'" class="form-control inpatientAreaId" name="inpatientAreaId" id="inpatientAreaId" /></div>' +
        '</div>' +
/*        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">科室ID:</label>' +
        '<div class="col-sm-10">'+
        '<select class="form-control inpatientAreaId" name="inpatientAreaId" id="inpatientAreaId">'+

        '</select>'+
        '</div>' +
        '</div>' +*/
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">用户类型:</label>' +
        '<div class="col-sm-10">' +
        '<select name="userType" class="form-control userType">' +
        userTypeFn() +
        '</select>' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="col-sm-2 control-label">状态:</label>' +
        '<div class="col-sm-10">' +
        '<select name="status" class="form-control status">' +
        statusFn() +
        '</select>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</form>',
        success: function() {
          //renderInpatientAreaIdDom(_inpatientAreaId);



        },
        yes: function yes() {

          //获取参数
          var _params = {
            "id": _id + '',
            "loginName": $('#editUseDom').find('.loginName').val(),
            "nickName": $('#editUseDom').find('.nickName').val(),
            "userType": $('#editUseDom').find('.userType').val(),
            "rfId": $('#editUseDom').find('.rfId').val(),
            "inpatientAreaId": $('#editUseDom').find('.inpatientAreaId').val(),
            "status": $('#editUseDom').find('.status').val()
          };

          //表单验证
          //参数形式  selector, ajax - options ,  successCallback
          validateFile($('#editUseDom'), {
            type:"post",
            dataType: "json",
            url: "/userList/update",
            contentType : "application/json",
            data: JSON.stringify(_params)
          }, function (data) {
            if(data.status == 1000 ) {
              layer.msg("操作成功", {icon: 1},renderTabDom({page:1}));
            }else {
              layer.msg("操作失败。"+data.status + ':' + data.msg, {
                icon: 2
              });
            }
          });
        }
      });
    });


    /*********************************************************************************************************************
     ********************************************    关联角色      ********************************************************
     *********************************************************************************************************************/

    $("#table").on("click", ".relevance", function () {

      //获取用户表id
      var parentTrDom = $(this).closest('tr'),
        _userId = parentTrDom.data('id') || '',
        _hasRoleId = parentTrDom.data('hasroleid').replace(/\s/g,'');

      if(_hasRoleId) {

        _hasRoleId=_hasRoleId.split(',');
      }else {
        _hasRoleId = [];
      }
      //获取角色表的信息
      var body = {'pageSize': 9999,'currPage':1};
      var data = {};
      body.data = JSON.stringify({

      });

      //生成关联角色dom
      $.ajax({
        type:"post",
        dataType: "json",
        url: project + "/role/list.do",
        contentType : "application/json",
        data: JSON.stringify(body)
      })
        .done(function(data) {
          if (data.status === 1000) {

            //拼装json,更好的遍历已经被选中的选项。
            var d=[];
            for(var i in data.data.data.result){

              var ii={};
              ii.id=data.data.data.result[i].id;
              ii.roleName=data.data.data.result[i].roleName;
              for( var f in _hasRoleId){
                if(_hasRoleId[f]==data.data.data.result[i].id){
                  ii.checked='checked';
                }
              }
              d[i]=ii;
            }
            var dd={data:{data:{result:d}}};
            $("#relevanceRole").html(template("relevanceRoleTemplate", dd));


            //添加点击图标事件
            $('#relevanceRole').on('click', '.menuItem', function() {
              $(this).toggleClass('checked').children('i').toggleClass('glyphicon-check').toggleClass('glyphicon-unchecked');
            });
          }
        })
        .fail(function() {
          console.log("error");
        });


      layer.open({
        title: "关联角色",
        area: ['1200px', '500px'],
        type: 0,
        btn: ["确定","取消"],
        content:
          '<div class="container" id="relevanceRole"></div>',
        yes: function yes() {
          var body = {};
          var data = {};

          var itemLis = $('.menuItem'),
            _idArr = [];

          for (var i = 0; i < itemLis.length; i++) {
            if(itemLis.eq(i).hasClass('checked')) {
              _idArr.push(itemLis.eq(i).data('menuid'));
            }

          }

          //获取参数
          var _params = {
            userId: _userId + '',
            roleId: _idArr.join(',')
          };


          body.data = JSON.stringify(_params);


          $.ajax({
            type:"post",
            dataType: "json",
            url: project + "/userRole/add.do",
            contentType : "application/json",
            data: JSON.stringify(body)
          })
            .done(function(data) {
              if(data.status == 1000 ) {
                layer.msg("操作成功", {icon: 1},renderTabDom({page:1}));
              }else {
                layer.msg("操作失败。"+data.status + ':' + data.msg, {
                  icon: 2
                });
              }
            })
            .fail(function() {
              console.log("error");
            });

        }
      });
    });

    /*********************************************************************************************************************
     ********************************************    关联分组      ********************************************************
     *********************************************************************************************************************/

    $("#table").on("click", ".group", function () {

      //获取用户表id
      var parentTrDom = $(this).closest('tr'),
        _userId = parentTrDom.data('id') || '',
        _rgUserType = parentTrDom.data('rgusertype').replace(/\s/g,''),
        _groupId = parentTrDom.data('hasgroupid').replace(/\s/g,'').replace(',','');

      //获取角色表的信息
      var body = {'pageSize': 9999,'currPage':1};
      var data = {};
      body.data = JSON.stringify({

      });

      //生成关联分组dom
      $.ajax({
        type:"post",
        dataType: "json",
        url: project + "/group/list.do",
        contentType : "application/json",
        data: JSON.stringify(body)
      })
        .done(function(data) {
          if (data.status === 1000) {
            var d=[];
            for(var i in data.data.data.result){
              var ii={};
              ii.id=data.data.data.result[i].id;
              ii.groupName=data.data.data.result[i].groupName;

              if(_groupId==data.data.data.result[i].id){
                ii.checked='checked';
              }
              d[i]=ii;
            }
            var dd={data:{data:{result:d}}};

            $("#relevanceGroup").html(template("relevanceGroupTemplate", dd));



            //关联的用户类型
            $("#rgUserType").html(template("relevanceUserType", {"userType":_rgUserType}));


            //添加点击图标事件
            $('#relevanceGroup').on('click', '.groupItem', function() {
              $(this).toggleClass('checked').children('i').toggleClass('glyphicon-check').toggleClass('glyphicon-unchecked');
              if($(this).hasClass('checked')) {
                $(this).siblings('a').removeClass('checked').children('i').addClass('glyphicon-unchecked').removeClass('glyphicon-check');
              }
            });
          }
        })
        .fail(function() {
          console.log("error");
        });


      layer.open({
        title: "关联分组",
        area: ['1200px', '500px'],
        type: 0,
        btn: ["确定","取消"],
        content:
        '<div class="container" id="relevanceGroupWrapper">'+
        '<div id="rgUserType"></div>'+
        '<div id="relevanceGroup"></div>'+
        '</div>',
        yes: function yes() {
          var body = {};
          var data = {};

          var itemLis = $('.groupItem'),
            _idArr = [];

          for (var i = 0; i < itemLis.length; i++) {

            if(itemLis.eq(i).hasClass('checked')) {
              _idArr.push(itemLis.eq(i).data('menuid'));
            }

          }

          //获取参数
          var _params = {
            userId: _userId + '',
            groupId: _idArr.join(','),
            userType: $('#rgUserTypeSelect').val()

          };

          body.data = JSON.stringify(_params);


          $.ajax({
            type:"post",
            dataType: "json",
            url: project + "/userGroup/add.do",
            contentType : "application/json",
            data: JSON.stringify(body)
          })
            .done(function(data) {
              if(data.status == 1000 ) {
                layer.msg("操作成功", {icon: 1},renderTabDom({page:1}));
              }else {
                layer.msg("操作失败。"+data.status + ':' + data.msg, {
                  icon: 2
                });
              }
            })
            .fail(function() {
              console.log("error");
            });

        }
      });
    });

    /*********************************************************************************************************************
     ********************************************    删除操作      ********************************************************
     *********************************************************************************************************************/
    $("#table").on("click", ".del", function () {

      var parentTrDom = $(this).closest('tr');

      //获取参数
      var _params = {
        "id": parentTrDom.data('id') + ''
      };


      //询问框
      layer.confirm("确定要删除吗？", {
        btn: ["确定", "取消"] //按钮
      }, function () {
        $.ajax({
          type:"post",
          dataType: "json",
          url: project + "/userList/delete",
          data: JSON.stringify(_params),
          contentType : "application/json",
        }).done(function (data) {
          if(data.status == 1000) {
            layer.msg("删除成功", {
              icon: 1
            }, renderTabDom({page:1}));
          }else {
            layer.msg("删除失败。"+data.status + ':' + data.msg, {
              icon: 2
            });
          }
        }).fail(function () {
          console.log(err);
        });
      });
    });



    /*********************************************************************************************************************
     ********************************************    查询操作      ********************************************************
     *********************************************************************************************************************/
    $(".ibox-content").on("click", "#search", function () {

      //获取参数
      var _params = {
        "loginName": $("#loginName").val(),
        "userType": $("#userType").val(),
        "nickName": '',
        "rfId": '',
        "inpatientAreaId": ''
      };

      if($('#status').val()) {
        _params.status = $('#status').val()
      }

      _queryBody.data = JSON.stringify(_params);
      _queryBody.currPage= 1;
      renderTabDom({page:1})

    });
  }



  //初始化表单头部字段，当前以json格式从前端取出。
  function initTableHead() {
    $.ajax({
      "url": "/mock/userInfoListcolumns.json",
      "method": "GET"
    }).done(function (data) {
      if (data.status === "1000") {
        var datas = data.list;
        var dom = "<tr>";
        for (var i = 0; i < datas.length; i++) {
          dom += "<th class='col-sm-1'>" + datas[i].title + "</th>";
        }
        dom += "</tr>";
        $("#theadDom").html(dom);
      }
    }).fail(function (err) {
      console.log(err);
    });
  }


  /*********************************************************************************************************************
   ********************************************    分页，全局变量      **************************************************
   *********************************************************************************************************************/
  var _queryBody = {};
  var _pageCount;
  _queryBody.pageSize= 10;
  _queryBody.currPage= 1;
  _queryBody.data = JSON.stringify({

  });


  //初始化表内容
  function renderTabDom(v) {
    if(v){
      _queryBody.currPage= v.page;
    }
    $.ajax({
      type:"post",
      dataType: "json",
      url: "/userList/list",
      contentType : "application/json",
      data: JSON.stringify(_queryBody)
    }).done(function (data) {
      if (data.status === 1000) {
        $("#tbodyDom").html(template("rows", data));
        _pageCount=data.data.data.sumPage
        pageInit();
      }
    }).fail(function (err) {
      console.log(err);
    });
  }


  //分页组件初始化
  function pageInit() {
    $("#pageLimit").bootstrapPaginator({
      currentPage: _queryBody.currPage,
      totalPages:  _pageCount,
      size: "normal",
      bootstrapMajorVersion: 3,
      alignment: "right",
      numberOfPages: 5,
      itemTexts: function(type, page, current) {
        switch (type) {
          case "first":
            return "首页";
          case "prev":
            return "上一页";
          case "next":
            return "下一页";
          case "last":
            return "末页";
          case "page":
            return page;
        }
      },
      onPageClicked: function(event, originalEvent, type,page) {

        //避免重复点击相同页面再次渲染
        if(page!=_queryBody.currPage){
          renderTabDom({page:page});
        }
      }

    });


  }

  /*********************************************************************************************************************
   ********************************************    入口调用      ********************************************************
   *********************************************************************************************************************/
  function init() {

    initTableHead();

    renderTabDom({page:1});

    bindEvents();
  }

  init();
});

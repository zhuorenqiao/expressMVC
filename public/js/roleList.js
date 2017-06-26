"use strict";

$(function () {

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


  //表单验证
  function validateFile(selector, options, fn) {

    selector.validate({
      "rules": {
        "roleName": {
          "required": true
        },
        "remark": {
          "required": true
        }
      },
      messages: {
        "roleName": {
          "required": "该字段必填！"
        },
        "remark": {
          "required": "该字段必填！"
        }
      }
    });

    if (selector.valid()) {
      $.ajax(options).done(fn).fail(function (err) {
        console.log(err);
      });
    }
  }

  //事件处理方法
  function bindEvents() {

    //新建角色
    $("#newBtn").on('click', function () {

      layer.open({
        title: "新建角色",
        area: ['1200px', '500px'],
        type: 0,
        btn: ["确定", "取消"],
        content:
        '<form class="container" id="newRoleDom">' +
          '<div class="row">' +
            '<div class="form-group">' +
              '<label class="col-sm-2 control-label">名称:</label>' +
              '<div class="col-sm-10"><input type="text" class="form-control roleName" name="roleName" /></div>' +
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
            '<div class="form-group">' +
              '<label class="col-sm-2 control-label">备注:</label>' +
              '<div class="col-sm-10"><textarea class="form-control remark" name="remark" ></textarea></div>' +
            '</div>' +
          '</div>' +
        '</form>',
        yes: function yes() {

        	var body = {};
        	var data = {};

          //获取参数
          var _params = {
            "roleName": $('#newRoleDom').find('.roleName').val(),
            "status": $('#newRoleDom').find('.status').val(),
            "remark": $('#newRoleDom').find('.remark').val()
          };

          //表单验证
          //参数形式  selector, ajax - options ,  successCallback
          validateFile($('#newRoleDom'), {
              type:"post",
              dataType: "json",
              url: "/roleList/role/add",
              data: JSON.stringify(_params)
          }, function (data) {
        	  if(data.status == 1000 ) {
                  layer.msg("添加成功", {icon: 1}, renderTabDom({page:1}));
        	  }else {
        		layer.msg("操作失败。"+data.status + ':' + data.msg, {
        			icon: 2
        		});
        	}
          });
        }
      });
    });

    //编辑
    $("#table").on("click", ".edit", function () {

      var parentTrDom = $(this).closest('tr'),
      	  _id = parentTrDom.data('id') || '',
          _roleName = parentTrDom.data('rolename') || '',
          _status = parentTrDom.data('status') || '',
          _remark = parentTrDom.data('remark') || '';

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
          '<form class="container" id="editRoleDom">' +
            '<div class="row">' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">名称:</label>' +
                '<div class="col-sm-10"><input type="text" value="' + _roleName + '" class="form-control roleName" name="roleName" /></div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">状态:</label>' +
                '<div class="col-sm-10">' +
                  '<select name="status" class="form-control status">' +
                    statusFn() +
                  '</select>' +
                '</div>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="col-sm-2 control-label">备注:</label>' +
                '<div class="col-sm-10"><textarea class="form-control remark" name="remark" >' +
                  _remark +
                '</textarea></div>' +
              '</div>' +
            '</div>' +
          '</form>',
        yes: function yes() {


          //获取参数
          var _params = {
        	"id": _id + '',
            "roleName": $('#editRoleDom').find('.roleName').val(),
            "status": $('#editRoleDom').find('.status').val(),
            "remark": $('#editRoleDom').find('.remark').val()
          };



          //表单验证
          //参数形式  selector, ajax - options ,  successCallback
          validateFile($('#editRoleDom'), {
              type:"post",
              dataType: "json",
              url: "/roleList/role/update",
              contentType : "application/json",
              data: JSON.stringify(_params)
          }, function (data) {
        	  if(data.status == 1000 ) {
                  layer.msg("添加成功", {icon: 1},renderTabDom({page:1}));
        	  }else {
        		layer.msg("操作失败。"+data.status + ':' + data.msg, {
        			icon: 2
        		});
        	}
          });
        }
      });
    });

    //删除事件
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
              url: "/roleList/role/delete",
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



    //点击查询列表事件
    $(".ibox-content").on("click", "#search", function () {

      //获取参数
      var _params = {
        "roleName": $("#product_name").val(),
        "status": $('#status').val()
      };

      _queryBody.data = JSON.stringify(_params);
      _queryBody.currPage= 1;
      renderTabDom({page:1})

    });


    //关联菜单项
    $(".ibox-content").on("click", ".relevance", function () {

      //获取用户表id
      var parentTrDom = $(this).closest('tr'),
          _roleId = parentTrDom.data('id') || '',
          _hasMenuId = parentTrDom.data('hasmenuid').replace(/\s/g,'');
          if(_hasMenuId) {

              _hasMenuId=_hasMenuId.split(',');
          }else {
            _hasMenuId = [];
          }

          //获取角色表的信息
          var body = {'pageSize': 9999,'currPage':1};
          var data = {};
          body.data = JSON.stringify({

          });

          //生成关联菜单dom
          $.ajax({
            type:"post",
            dataType: "json",
            url: project + "/menu/listAll.do",
            contentType : "application/json",
            data: JSON.stringify(body)
          })
          .done(function(data) {
            if (data.status === 1000) {

              //拼装json,更好的遍历已经被选中的选项。
              var d=[];

              var datas = data.data.result;

            for(var i in datas){

              var ii={};
              ii.child=datas[i].child;
              ii.id=datas[i].id;
              ii.menuImg=datas[i].menuImg;
              ii.menuLevel=datas[i].menuLevel;
              ii.menuName=datas[i].menuName;
              ii.menuUrl=datas[i].menuUrl;
              ii.parentId=datas[i].parentId;
              ii.remark=datas[i].remark;
              ii.sort=datas[i].sort;
              ii.status=datas[i].status;
              for( var f in _hasMenuId){
                if(_hasMenuId[f]==datas[i].id){
                  ii.checked='checked';
                }
              }
              d[i]=ii;
            }
            var dd={data:{data:{result:d}}};
              renderTDom(dd,_hasMenuId);

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
        title: "关联菜单树",
        area: ['1200px', '700px'],
        type: 0,
        btn: ["确定","取消"],
        content:
            '<div class="container tree"><div class="rootUL"></div></div>',
        yes: function yes() {
          var body = {};
          var data = {};

          var itemLis = $('.menuItem'),
          _idArr = [];

          for (var i = 0; i < itemLis.length; i++) {
            if(itemLis.eq(i).hasClass('checked')) {
              var parentsDom = itemLis.eq(i).parents('li');
              for(var j = 0 ; j < parentsDom.length; j++) {
                _idArr.push($(parentsDom[j]).data('id'));
              }

            }

          }

          //获取参数
          var _params = {
            roleId: _roleId + '',
            menuId: _idArr.unique().join(',')
          };


          body.data = JSON.stringify(_params);


          $.ajax({
            type:"post",
            dataType: "json",
            url: project + "/roleMenu/add.do",
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

  }



    //初始化表内容
    function renderTDom(dd,_hasMenuId) {

      $(".rootUL").html('');

      var body = {};
      var data = {};

        body.data = JSON.stringify({
          menuLevel: '1'
        });


      $.ajax({
        type:"post",
        dataType: "json",
        url: project + "/menu/list.do",
        contentType : "application/json",
        data: JSON.stringify(body)
      }).done(function (data) {
        if (data.status === 1000) {
          $(".tree").html(tree(dd.data.data.result,_hasMenuId));
          treeOpera();
        }
      }).fail(function (err) {
        console.log(err);
      });
    }

    //遍历菜单
    function tree(data,_hasMenuId) {
      for (var i = 0; i < data.length; i++) {
        var data2 = data[i];
        if (data[i].menuLevel == "1") {
          if(data[i].child.length == 0 ) {
            $(".rootUL").append("<li data-id='" + data[i].id + "' data-status='" + data[i].status + "' data-menuName='" + data[i].menuName + "' data-menuLevel='" + data[i].menuLevel + "' data-menuUrl='" + data[i].menuUrl + "' data-menuImg='" + data[i].menuImg + "' data-sort='" + data[i].sort + "' data-remark='" + data[i].remark + "'><span><div class='treeOper'><a class='menuItem col-sm-1' href='javascript:;'><i class='glyphicon glyphicon-unchecked'></i></a></div><i class='" + data[i].menuImg + "'></i> " + data[i].menuName + "</span></li>");
            for (var k = 0; k < _hasMenuId.length; k++) {
            	if(_hasMenuId[k] == '') continue;
            	if(data[i].id == _hasMenuId[k]) {
            		$("li[data-id='" + data[i].id + "']").find('a').addClass("checked");
                    $("li[data-id='" + data[i].id + "']").find('a').find('i').removeClass("glyphicon-unchecked");
                    $("li[data-id='" + data[i].id + "']").find('a').find('i').addClass("glyphicon-check");
            	}
    		}
          }else {
            $(".rootUL").append("<li data-id='" + data[i].id + "' data-status='" + data[i].status + "' data-menuName='" + data[i].menuName + "' data-menuLevel='" + data[i].menuLevel + "' data-menuUrl='" + data[i].menuUrl + "' data-menuImg='" + data[i].menuImg + "' data-sort='" + data[i].sort + "' data-remark='" + data[i].remark + "'><span><i class='" + data[i].menuImg + "'></i> " + data[i].menuName + "</span></li>");
          }
        }

        for (var j = 0; j < data[i].child.length; j++) {
          var child = data[i].child[j];
          var children = $("li[data-id='" + child.parentId + "']").children("ul");
          if (children.length == 0) {
            $("li[data-id='" + child.parentId + "']").append("<ul></ul>");
          }

          var child2 = data[i].child[j].child || [];
          if(child2.length > 0) {
            $("li[data-id='" + child.parentId + "'] > ul").append("<li data-id='" + child.id + "' data-status='" + data[i].child[j].status + "' data-menuName='" + data[i].child[j].menuName + "' data-parentId='" + data[i].child[j].parentId + "' data-menuLevel='" + data[i].child[j].menuLevel + "' data-menuUrl='" + data[i].child[j].menuUrl + "' data-menuImg='" + data[i].child[j].menuImg + "' data-sort='" + data[i].child[j].sort + "' data-remark='" + data[i].child[j].remark + "'>" + "<span>" + "<i class='" + child.menuImg + "'></i> " + child.menuName + "</span></li>");

          }else {
            $("li[data-id='" + child.parentId + "'] > ul").append("<li data-id='" + child.id + "' data-status='" + data[i].child[j].status + "' data-menuName='" + data[i].child[j].menuName + "' data-parentId='" + data[i].child[j].parentId + "' data-menuLevel='" + data[i].child[j].menuLevel + "' data-menuUrl='" + data[i].child[j].menuUrl + "' data-menuImg='" + data[i].child[j].menuImg + "' data-sort='" + data[i].child[j].sort + "' data-remark='" + data[i].child[j].remark + "'>" + "<span>" + "<div class='treeOper'><a class='menuItem col-sm-1' href='javascript:;'><i class='glyphicon glyphicon-unchecked'></i></a></div><i class='" + child.menuImg + "'></i> " + child.menuName + "</span></li>");
            for (var k = 0; k < _hasMenuId.length; k++) {
            	if(_hasMenuId[k] == '') continue;
            	if(child.id == _hasMenuId[k]) {
            		$("li[data-id='" + child.id + "']").find('a').addClass("checked");
                    $("li[data-id='" + child.id + "']").find('a').find('i').removeClass("glyphicon-unchecked");
                    $("li[data-id='" + child.id + "']").find('a').find('i').addClass("glyphicon-check");
            	}
    		}
          }
        }
      }
    }

    //树事件绑定
    function treeOpera() {
      $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', '关闭');
      $('.tree li.parent_li > span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
          children.hide('fast');
          $(this).attr('title', '展开').find(' > i').addClass('fa fa-plus-square').removeClass('fa-minus-square');
        } else {
          children.show('fast');
          $(this).attr('title', '关闭').find(' > i').addClass('fa fa-minus-square').removeClass('fa-plus-square');
        }
        e.stopPropagation();
      });

      //添加点击图标事件
      $('.tree').on('click', '.menuItem', function() {
        $(this).toggleClass('checked').children('i').toggleClass('glyphicon-check').toggleClass('glyphicon-unchecked');
      });
    }



  //初始化表单头部字段，当前以json格式从前端取出。
  function initTableHead() {
    $.ajax({
      "type": "GET",
      "url": "/mock/roleListcolumns.json"
    }).done(function (data) {
      if (data.status === "1000") {
        var datas = data.list;
        var dom = "<tr>";
        for (var i = 0; i < datas.length; i++) {
          dom += "<th class='col-sm-3'>" + datas[i].title + "</th>";
        }
        dom += "</tr>";
        $("#theadDom").html(dom);
      }
    }).fail(function (err) {
      console.log(err);
    });
  }


  //====全局变量：分页======
  var _queryBody = {};
  var _pageCount;
  _queryBody.pageSize= 10;
  _queryBody.currPage= 1;


  //初始化表内容
  function renderTabDom(v) {
	if(v){
		_queryBody.currPage= v.page;
	}
    $.ajax({
        type:"post",
        url: "/roleList/role/list",
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

  //入口函数
  function init() {

    initTableHead();

    renderTabDom({page:1});

    bindEvents();
  }

  init();
});

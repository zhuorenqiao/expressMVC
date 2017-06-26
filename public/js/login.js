"use strict";

$(function () {

	//表单验证
	function validateFile(selector, options, fn) {

	  selector.validate({
	    "rules": {
	      "user": {
	        "required": true
	      },
	      "password": {
	        "required": true
	      },
	      "chooseRole": {
	        "required":true
	      }
	    },
	    "messages": {
	      "user": {
	        "required": "该字段必填！"
	      },
	      "password": {
	        "required": "该字段必填！"
	      },
	      "chooseRole": {
	        "required":"请选择您的角色！"
	      }
	    }
	  });

	  if (selector.valid()) {
	    $.ajax(options).done(fn).fail(function (err) {
	      console.log(err);
	    });
	  }
	}

	function loginOper() {

	  //获取参数
	  var _params = {
	    "loginName": $('#user').val(),
	    "password": $('#password').val(),
	    'roleId': $('#chooseRole').val()
	  };


	  validateFile($('#loginPageForm'), {
	      type:"post",
	      dataType: "json",
	      url: "/login/login",
	      contentType : "application/json",
	      data: JSON.stringify(_params)
	  }, function (data) {

		  if(data.status == 1000 && data.msg == '操作成功' ) {

		    window.location.href = 'userList';

/*		  	var datas = data.data;

		  	if(datas.result == "true") {

		  		//存储数据到sessionStorage

		  		var _userInfo = {};

		  		_userInfo.userInfo = datas.userInfo;
		  		_userInfo.loginRoleId = datas.roleId;
		  		_userInfo.loginRoleName = $('#chooseRole').find('option:selected').text();

		  		sessionStorage.setItem('YTuserInfo',JSON.stringify(_userInfo));

		  		window.location.href = 'dist/index.jsp';
		  	}else {
		  		layer.msg("操作失败: "+ datas.msg, {
		  			icon: 2
		  		});
		  	}*/

		  }else {
        layer.msg("操作失败: "+ data.msg, {
          icon: 2
        });
      }
	  });
	}



	function bindEvents() {

		$('.loginscreen').on('click', '.login-submit', loginOper);
	}


	//入口函数
	function init() {

		sessionStorage.removeItem('YTuserInfo');

		bindEvents();
	}

	init();
});

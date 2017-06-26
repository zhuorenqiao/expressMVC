"use strict";


$(function() {

  //var _id = getUserInfo('userInfo').id ;
  var _id = '592e8fda19bf2515d4d00b62';
  function bindEvent() {
    //表单验证
    $('#editPwdBtn').on('click', function() {

      $('#editPwdDom').validate({
        rules: {
          passwordNow: "required",
          passwordNew: "required",
          passwordCheck: {
            required: true,
            equalTo: "#passwordNew"
          }
        },
        messages: {
          passwordNow: "该字段必填！",
          passwordNew: "该字段必填！",
          passwordCheck: {
            required: "该字段必填！",
            equalTo: "验证密码与新输入的密码不一致！"
          }
        }
      });

      if ($('#editPwdDom').valid()) {

        var body = {};

        //获取参数
        var _params = {
          "id": _id + '',
          "passwordNow": $('#editPwdDom').find('.passwordNow').val(),
          "passwordNew": $('#editPwdDom').find('.passwordNew').val(),
        };

        $.ajax({
          type: "post",
          dataType: "json",
          url: "/passwordUpdate/updatePwd",
          contentType: "application/json",
          data: JSON.stringify(_params)
        }).done(function(data) {
          debugger;
          if (data.status === 1000) {
            if (datas.result === "true") {
              layer.msg("操作成功", {
                icon: 1
              }, function() {
                window.location.href = 'userList';
              });
            } else {
              layer.msg("操作失败: " + datas.msg, {
                icon: 2
              });
            }

          }
        })

      };

    });
  }


  function init() {

    bindEvent();

  }

  init();
});

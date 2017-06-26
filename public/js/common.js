


/*********************************************************************************************************************
********************************************    公用代码配置      ****************************************************
*********************************************************************************************************************/


//系统根目录
var project = "";


//显示加载数据
function loading(selector) {
selector.html('<div id="loading">'+
	'<div id="loading-center">'+
		'<div id="loading-center-absolute">'+
			'<div id="object"></div>'+
			'<p class="loadTip">数据正在加载中,请稍后...</p>'+
		'</div>'+
	'</div>'+
'</div>');
}


//js获取url中的中文参数出现乱码
function getQueryString(key){
  var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
  var result = window.location.search.substr(1).match(reg);
  return result?decodeURIComponent(result[2]):null;
}

$.ajaxSetup({
    type:"post",
    dataType:"json",
    cache:false,
    contentType:"application/json",
    complete:function(xhr,status){
        if(xhr.status>0 && status == "error"){
            layer.alert("程序出错了，请赶紧联系程序员GG");
        }else if(xhr.getResponseHeader('sessionstatus')=='timeout'){
            layer.confirm('登录超时了，请重新登录!', {
                  icon: 8,
                  title:'提示',
            	  btn: ['知道了'],
                  closeBtn: false,
            	}, function(index){
                    layer.close(index);
                    //top.location.href = '../login';
            	});
        }else if(status == "success"){
            try{
                var data = JSON.parse(xhr.responseText);
                if(data.status && data.status != "1000"){
                    layer.alert("程序出错了，请赶紧联系程序员GG！错误代码:"+data.status);
                }
            }catch(e){
                console.log("非标准格式的ajax请求");
            }
        }
    }
});

function setPages(currPage,sumPage,callback){
	$('#pageLimit').bootstrapPaginator({
        currentPage: currPage,
        totalPages: sumPage,
        size:'normal',
        bootstrapMajorVersion: 3,
        itemTexts: function (type, page, current) {
            switch (type) {
            case "first":
                return "首页";
            case "prev":
                return "上一页";
            case "next":
                return "下一页";
            case "last":
                return "尾页";
            case "page":
                return page;
            }
        },
        onPageClicked: function(e,originalEvent,type,page){
        	if(typeof callback === 'function'){
        		callback(page);
        	}
        }
    });
}

function getUserInfo(key){
    if(sessionStorage.getItem('YTuserInfo')) {
        return JSON.parse(sessionStorage.getItem('YTuserInfo'))[key];
    }else {
        //top.location.href = '../login';
    }

}

var sessionStorageKey = {
	wardId:"inpatientAreaId",
	id:"id"
}

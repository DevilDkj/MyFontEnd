//选择符封装
function myquery(str,b){
	return window == this? new myquery(str,b):this.getEById(str);
}

var $ = myquery;

myquery.fn = myquery.prototype = {
	css:function(){
		alert(css);
	},
	getEById:function(str){
		return document.getElementById(str);
	}
};

myquery.extend = myquery.fn.extend = function(obj,prop) {
	if ( !prop ) { prop = obj; obj = this; }
	for ( var i in prop ) obj[i] = prop[i];
	return obj;
};

myquery.extend({
	css:function(){
		alert("css");
	}
});

//js鼠标键盘事件兼容封装
var eventutil = {
	//添加事件
	addHandler:function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type] = handler;
		}
	},
	//删除事件
	removeHandler:function(element,type,handler){
		if(element.addEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type] = null;
		}
	},
	//获取event
	getEvent:function(event){
		return event?event:window.event;
	},
	//获取节点类型
	getType:function(event){
		return event.type;
	},
	//获取event的节点
	getElement:function (event){
		return event.target || event.srcElement;
	},
	//取消默认事件，即阻止A标签跳转页面
	preventDefault:function (event) {
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue=false;
		}
	},
	//阻止冒泡
	stopPropagetion:function (event) {
		if(event.stopPropagetion){
			event.stopPropagetion();
		}else{
			event.cancelBubble = true;
		}
	}
};
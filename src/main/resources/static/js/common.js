$.fn.setCursorPosition = function(position){
    if(this.lengh == 0) return this;
    return $(this).setSelection(position, position);
}

$.fn.setSelection = function(selectionStart, selectionEnd) {
    if(this.lengh == 0) return this;
    input = this[0];

    if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    } else if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }

    return this;
}

$.fn.focusEnd = function(){
    this.setCursorPosition(this.val().length);
}

Date.prototype.format=function(fmt) {        
    var o = {        
    "M+" : this.getMonth()+1,
    "d+" : this.getDate(),
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12,
    "H+" : this.getHours(),
    "m+" : this.getMinutes(),
    "s+" : this.getSeconds(), 
    "q+" : Math.floor((this.getMonth()+3)/3),
    "S" : this.getMilliseconds()
    };        
    var week = {        
    "0" : "\u65e5",        
    "1" : "\u4e00",        
    "2" : "\u4e8c",        
    "3" : "\u4e09",        
    "4" : "\u56db",        
    "5" : "\u4e94",        
    "6" : "\u516d"       
    };        
    if(/(y+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));        
    }        
    if(/(E+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);        
    }        
    for(var k in o){        
        if(new RegExp("("+ k +")").test(fmt)){        
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));        
        }        
    }        
    return fmt;        
}  

function   chineseFromUtf8Url(strUtf8)    
{ 
var   bstr   =   ""; 
var   nOffset   =   0; //   processing   point   on   strUtf8 
   
if(   strUtf8   ==   ""   ) 
      return   ""; 
   
strUtf8   =   strUtf8.toLowerCase(); 
nOffset   =   strUtf8.indexOf("%e"); 
if(   nOffset   ==   -1   ) 
      return   strUtf8; 
       
while(   nOffset   !=   -1   ) 
{ 
      bstr   +=   strUtf8.substr(0,   nOffset); 
      strUtf8   =   strUtf8.substr(nOffset,   strUtf8.length   -   nOffset); 
      if(   strUtf8   ==   ""   ||   strUtf8.length   <   9   )       //   bad   string 
          return   bstr; 
       
      bstr   +=   utf8CodeToChineseChar(strUtf8.substr(0,   9)); 
      strUtf8   =   strUtf8.substr(9,   strUtf8.length   -   9); 
      nOffset   =   strUtf8.indexOf("%e"); 
} 
   
return   bstr   +   strUtf8; 
}

function commonAjaxRequest(url, data, handlerFunc, isASync, failTitle){
    var result = true;

    $.ajax({
        type : "POST",
        url : url,
        timeout : 60000,
        data : JSON.stringify(data),
        dataType : 'json',
        async :isASync,
        contentType: 'application/json',
        success : function(resu) {
            if(resu.response.error_code != 0){
                switch (resu.response.error_code){
                    case 422:
                        handlerErrorStatusCode(resu.response.error_code, resu);
                        break;
                    default :
                        gritterError(failTitle, resu.response);
                        break;
                }
                result = false;
            }else{
                result = handlerFunc(resu);
            }
        },
        error :function (jqXHR, textStatus, errorThrown) {
            switch (jqXHR.status){
                case 422:
                    handlerErrorStatusCode(422, jqXHR.responseText);
                    break;
            }
        },
        statusCode: {
            404: function() {
                handlerErrorStatusCode(404);
            },
            500: function() {
                handlerErrorStatusCode(500);
            }
        }
    });

    return result;
}

function handlerErrorStatusCode(errorStatus, resu){
    switch (errorStatus){
        case 500:
            $.gritter.add({
                title : '呀呀的:',
                text : '服务自己500了，你叫我怎么办',
                class_name : 'gritter-error gritter-center'
            });
            break;
        case 404:
            $.gritter.add({
                title : '呵呵:',
                text : '你确认你的请求url配置正确了？',
                class_name : 'gritter-error gritter-center'
            });
            break;
        case 422:
            var response = JSON.parse(resu);
            $.gritter.add({
                title : '咋了:',
                text : '请求参数出错了,服务器返回：' +  response.response.error_message,
                class_name : 'gritter-error gritter-center'
            });
            break;
    }
}

function gritterError(title, response){
    var msg = response.hint_message;
    if(msg == null || "" == msg){
        msg = response.error_message;
    }
    $.gritter.add({
        title : title,
        text : msg,
        class_name : 'gritter-error gritter-center'
    });
}

function deleteEmptyProperty(object){
    for (var i in object) {
        var value = object[i];
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                if (value.length == 0) {
                    delete object[i];
                    continue;
                }
            }
            this.deleteEmptyProperty(value);
            if (this.isEmpty(value)) {
                delete object[i];
            }
        } else {
            if (value === '' || value === null || value === undefined) {
                delete object[i];
            } else {
            }
        }
    }
}

function isEmpty(object) {
    for (var name in object) {
        return false;
    }
    return true;
}
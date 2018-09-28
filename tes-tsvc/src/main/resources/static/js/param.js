$.fn.editable.defaults.mode = 'inline';
$.fn.editableform.loading = "<div class='editableform-loading'><i class='light-blue icon-2x icon-spinner icon-spin'></i></div>";
$.fn.editableform.buttons = '<button type="submit" class="btn btn-info editable-submit"><i class="icon-ok icon-white"></i></button>'+
'<button type="button" class="btn editable-cancel"><i class="icon-remove"></i></button>';

function cloneInput(){
    var inputClone = $(this).parent().parent().clone();
    inputClone.children("div .addInputDiv").remove();
    var newAltParent = $(this).parent().parent().parent().attr("alt");
    var newAltParent = incAlt(newAltParent);
    var firstAltParent = firstAlt(newAltParent);

    $(this).parent().parent().parent().attr("alt", newAltParent);
    inputClone.find("input").each(function(index,element){
        var nowAlt = $(element).attr("alt");
        var newAlt= nowAlt.replace(firstAltParent, newAltParent);
        $(element).attr("alt", newAlt);
    });
    $(this).parent().parent().parent().append(inputClone);

    editableInit();
}

function incAlt(alt){
    var newAlt = "";

    var splitArr = alt.split("-");
    for(var idx in splitArr){
        var altItem = splitArr[idx];
        if(idx == splitArr.length - 1){
            altItem = new Number(altItem) + 1;
        }
        newAlt += newAlt ==""? altItem : "-" + altItem;
    }

    return newAlt;
}

function firstAlt(alt){
    var newAlt = "";

    var splitArr = alt.split("-");
    for(var idx in splitArr){
        var altItem = splitArr[idx];
        if(idx == splitArr.length - 1){
            altItem = 0;
        }
        newAlt += newAlt ==""? altItem : "-" + altItem;
    }

    return newAlt;
}

function removeInput(){
    $(this).parent().parent().remove();
}

var paramInfo = new Object();
function initHtml(parentKey, params){
    if(parentKey != ''){
        parentKey += "-";
    }

    for(var paramIdx in params) {
        var param = params[paramIdx];
        var isMulti = Array.isArray(param);
        if(isMulti){
            param = param[0];
        }

        var paramKey = parentKey + param.key;
        paramInfo[paramKey] = new Object();
        paramInfo[paramKey]["isMulti"] = isMulti;

        if(param.detail != null){
            initHtml(paramKey, param.detail);
        }else{
            var defaultName = "";
            var defaultValue = "";
            if(param.defaultValue != null){
                if(param.defaultValue.name != null){
                    defaultName = param.defaultValue.name;
                    defaultValue =  param.defaultValue.value;
                }else{
                    defaultName = param.defaultValue;
                    defaultValue = param.defaultValue;
                }
            }

            if(param.selectable != null){
                var options = [];
                for(var secIdx in param.selectable){
                    var sec = param.selectable[secIdx];
                    options.push({id: sec.value, text: sec.name});
                }

                paramInfo[paramKey]["options"] = options;
                paramInfo[paramKey]["is_selectable"] = true;
                paramInfo[paramKey]["selectable"] = param.selectable;
            }else{
                paramInfo[paramKey]["is_selectable"] = false;
            }

            paramInfo[paramKey]["type"] = Object.prototype.toString.call(defaultValue);
            paramInfo[paramKey]["class"] = param.class;
        }
    }

    editableInit();
}

function editableInit(){
    for(var prop in paramInfo){
        if(paramInfo[prop]["is_selectable"]){
            var options = paramInfo[prop]["options"];
            $('.' + prop + "_label").editable({
                type: 'select2',
                value : options[0].text,
                source: options,
                success: function(response, newValue) {
                    $(this).prev("input").val(newValue);
                }
            });
        }

        if(paramInfo[prop]["isMulti"]){
            $("div ." + prop).removeClass("hide");
            $("div ." + prop).removeClass("hide");
            $("." + prop + "_label").css("display", "block");
        }
    }

    $(document).find(".date_editable").each(function(key,value){
        $(value).editable({
            type: 'date',
            format: 'yyyy-mm-dd',
            viewformat: 'yyyy-mm-dd',
            datepicker: {
                weekStart: 1
            },
            success: function(response, newValue) {
                $(this).prev("input").val(newValue.getTime());
                $(this).prev("input").trigger("change");
            }
        });
    });

    $(document).find(".input_editable").each(function(key,value){
        $(value).editable({
            type: 'text',
            success: function(response, newValue) {
                $(this).prev("input").val(newValue);
                $(this).prev("input").trigger("change");
            }
        });
    });
}

var input_editable_html_edit = "<div class=\"profile-info-row\" alt=\"{alt}\"><div class=\"profile-info-name\"> <input key=\"{key}\" class=\"qing_editable\" type=\"hidden\" id=\"{key}--name\" alt=\"{alt}\" value=\"{name}\"/><span class=\"editable input_editable input_label\">{name}</span> </div><div class=\"profile-info-value\"><input key=\"{key}\" class=\"qing_editable\" type=\"hidden\" name=\"{key}\" alt=\"{alt}\" isMulti=\"{isMulti}\" value=\"{defaultValue}\"/><span class=\"editable input_label {key}_label {class}\">{defaultName}</span></div></div>";
var sub_editable_html_edit = "<div class=\"profile-info-row\" alt=\"{alt}\"><div class=\"profile-info-name\">  <input key=\"{key}\" class=\"qing_editable\" type=\"hidden\" id=\"{key}--name\" isMulti=\"{isMulti}\" alt=\"{alt}\" value=\"{name}\"/><span class=\"editable input_editable input_label\">{name}</span>  </div><div class=\"profile-info-value\">{paramList}</div></div>";

var input_editable_html = "<div class=\"profile-info-row\" alt=\"{alt}\"><div class=\"profile-info-name\"> {name} </div><div class=\"profile-info-value\"><div class=\"spinner-buttons input-group-btn delInputDiv {multiClass}\" style=\"display: inline-block;margin-right: 25px;\"><button class=\"btn spinner-down btn-xs btn-danger delInputBtn\" type=\"button\"><i class=\"icon-minus smaller-75\"></i></button></div><div class=\"spinner-buttons input-group-btn addInputDiv {multiClass}\" style=\"display: inline-block;\"><button class=\"btn spinner-up btn-xs btn-success addInputBtn\"  type=\"button\"><i class=\"icon-plus smaller-75\"></i></button></div><input key=\"{key}\" type=\"hidden\" name=\"{key}\" alt=\"{alt}\" value=\"{defaultValue}\"/><span class=\"editable input_label {key}_label {class}\">{defaultName}</span></div></div>";
var editable_table_html = "<div class=\"profile-user-info profile-user-info-striped\" id = \"{id}\">{paramList}</div>";
var sub_editable_html = "<div class=\"profile-info-row\" alt=\"{alt}\"><div class=\"profile-info-name\"> {name} </div><div class=\"profile-info-value\"><div class=\"spinner-buttons input-group-btn delInputDiv {multiClass}\" style=\"display: inline-block;\"><button class=\"btn spinner-down btn-xs btn-danger delInputBtn\" type=\"button\"><i class=\"icon-minus smaller-75\"></i></button></div><div class=\"spinner-buttons input-group-btn addInputDiv {multiClass}\" style=\"display: inline-block;margin-left: 25px\"><button class=\"btn spinner-up btn-xs btn-success addInputBtn\" type=\"button\"><i class=\"icon-plus smaller-75\"></i></button></div>{paramList}</div></div>";
function genHtml(parentKey, params, paramAlt){
    return genHtml(parentKey, params, paramAlt, false);
}

function genHtml(parentKey, params, paramAlt, isEditStatus){
    if(parentKey != ''){
        parentKey += "-";
    }

    var paramHtmls = "";
    for(var paramIdx in params){
        var param = params[paramIdx];
        var paramHtml = "";
        var isArray = Array.isArray(param);
        if(isArray){
            param = param[0];
        }
        if(param.detail != null){
            var subTableHtml = genHtml(parentKey + param.key, param.detail, paramAlt + "-0",isEditStatus);

            var subHtml = isEditStatus? sub_editable_html_edit:sub_editable_html;
            paramHtml = subHtml.replace(new RegExp("{key}","gm"), parentKey + param.key);
            paramHtml = paramHtml.replace(new RegExp("{name}","gm"), param.name);
            paramHtml = paramHtml.replace(new RegExp("{alt}","gm"), paramAlt);
            if(!isArray){
                paramHtml = paramHtml.replace(new RegExp("{multiClass}","gm"), "hide");
                paramHtml = paramHtml.replace(new RegExp("{isMulti}","gm"), "false");
            }else{
                paramHtml = paramHtml.replace(new RegExp("{isMulti}","gm"), "true");
            }
            paramHtml = paramHtml.replace(new RegExp("{paramList}","gm"), subTableHtml);
        }else{
            paramHtml = initInput(parentKey, param, paramAlt, isArray, isEditStatus);
        }
        paramHtmls += paramHtml;
    }

    var tableHtml = editable_table_html;
    tableHtml = tableHtml.replace(new RegExp("{id}","gm"), parentKey);
    tableHtml = tableHtml.replace(new RegExp("{paramList}","gm"), paramHtmls);

    return tableHtml;
}

function initInput(paramKey, param, paramAlt, isArray, isEditStatus){
    var html = isEditStatus? input_editable_html_edit:input_editable_html;
    var paramHtml = html.replace(new RegExp("{name}","gm"), param.name);
    paramHtml = paramHtml.replace(new RegExp("{key}","gm"), paramKey + param.key);
    paramHtml = paramHtml.replace(new RegExp("{alt}","gm"), paramAlt);
    var defaultName = "";
    var defaultValue = "";
    if(param.defaultValue != null){
        if(param.defaultValue.name != null){
            defaultName = param.defaultValue.name;
            defaultValue =  param.defaultValue.value;
        }else{
            defaultName = param.defaultValue;
            defaultValue = param.defaultValue;
        }
    }
    var classes = "";
    if(param.selectable == null){
        if(param.class != null){
            classes = param.class;
        }else{
            classes = "input_editable";
        }
    }
    paramHtml = paramHtml.replace(new RegExp("{class}","gm"), classes);

    paramHtml = paramHtml.replace(new RegExp("{defaultName}","gm"), defaultName);
    paramHtml = paramHtml.replace(new RegExp("{defaultValue}","gm"), defaultValue);
    if(!isArray){
        paramHtml = paramHtml.replace(new RegExp("{multiClass}","gm"), "hide");
        paramHtml = paramHtml.replace(new RegExp("{isMulti}","gm"), "false");
    }else{
        paramHtml = paramHtml.replace(new RegExp("{isMulti}","gm"), "true");
    }

    return paramHtml;
}

function generateJsonParam(localtion){
    var param = new Object();
    fromIdxInfo = new Object();
    destIdxInfo = new Object();

    $("" + localtion).each(function(key,value){
        var paramNameArr = value.name.split("-");
        var altArr = value.alt.split("-");

        formatParam(paramInfo, fromIdxInfo, destIdxInfo, param, "", paramNameArr, altArr, 0, value);
    });

    return param;
}

function formatParam(paramInfo, fromIdxInfo,destIdxInfo, paramObj, paramName, paramNameArr, altArr, arrIdx, value){
    var propName = paramNameArr[arrIdx];
    paramName = paramName == ""? propName:paramName + "-" + propName;
    if(paramInfo[paramName]["isMulti"]){ // 数组形式
        if(paramObj[propName] == null){
            paramObj[propName] = new Array();
        }

        var idx = altArr[arrIdx];
        if(arrIdx == paramNameArr.length -1){
            paramObj[propName].push(formatValue(paramInfo, value.name, value.value));
            return;
        }else{
            var obj;
            if(fromIdxInfo[paramName] != null && fromIdxInfo[paramName] == idx){
                idx = destIdxInfo[paramName];
            }else{
                if(idx > 0){
                    if(paramObj[propName][idx-1] == null){
                        fromIdxInfo[paramName] = idx;
                        while(paramObj[propName][idx-1] == null){
                            idx --;
                        }
                        destIdxInfo[paramName] = idx;
                    }
                }
            }

            if(paramObj[propName][idx] == null){
                obj = new Object();
                paramObj[propName][idx] = obj;
            }else{
                obj = paramObj[propName][idx];
            }

            formatParam(paramInfo, fromIdxInfo,destIdxInfo, obj, paramName, paramNameArr, altArr, arrIdx + 1, value);
        }
    }else{
        if(arrIdx == paramNameArr.length -1){
            paramObj[propName] = formatValue(paramInfo, value.name, value.value);
            return;
        }else{
            if(paramObj[propName] == null){
                paramObj[propName] = new Object();
            }

            formatParam(paramInfo, fromIdxInfo,destIdxInfo, paramObj[propName], paramName, paramNameArr, altArr, arrIdx + 1, value);
        }
    }
}

function formatValue(paramInfo, paramKey, value){
    if(paramInfo[paramKey]["type"] == "[object Number]"){
        return new Number(value);
    }

    return  value;
}

function showParam(paramData, isEditStatus){
    if(paramData != null && paramData != "") {
        var params = JSON.parse(paramData);
        var paramHtmls = genHtml("", params, "0", isEditStatus);
        $("#paramListDiv").html(paramHtmls);

        initHtml("", params);
        $("#paramDiv").removeClass("hide");
    }
}

function generateEditParam(localtion){
    var param = new Array();
    var allObject = new Object();

    $("" + localtion).each(function(key,value){
        if(value.name.indexOf("--name") >= 0 || value.name == ""){
            return;
        }

        var paramNameArr = value.name.split("-");
        formatEditParam(param, "", paramNameArr, 0, value, allObject);
    });

    return JSON.stringify(param);
}

function formatEditParam(paramObj, paramName, paramNameArr, arrIdx, value, allObject){
    var propName = paramNameArr[arrIdx];
    //console.log(value.name + "->" + propName);
    paramName = paramName == ""? propName:paramName + "-" + propName;

    var obj;
    if(allObject[paramName] == null){
        obj = new Object();
        obj.key = propName;
        obj.name = $("#" + paramName + "--name").val();
        if($("#" + paramName + "--name").attr("isMulti") == "true"){
            var objArr = new Array();
            objArr.push(obj);
            paramObj.push(objArr);
        }else{
            paramObj.push(obj);
        }
    }else{
        obj = allObject[paramName];
    }

    if(arrIdx == paramNameArr.length -1){
        if(paramInfo[paramName]["selectable"] != null){
            obj.selectable = paramInfo[paramName]["selectable"];
            var defaultObj = new Object();
            defaultObj.name = value.value;
            defaultObj.value = value.value;
            obj.defaultValue = defaultObj;
        }else{
            obj.defaultValue = value.value;
        }
        return;
    }else{
        var detailArr = allObject[paramName];
        if(detailArr == null){
            detailArr = new Array();

            obj.detail = detailArr;
            allObject[paramName] =detailArr;
        }

        formatEditParam(detailArr, paramName, paramNameArr, arrIdx + 1, value, allObject);
    }
}

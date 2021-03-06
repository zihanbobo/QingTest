$.fn.editable.defaults.mode = 'inline';
$.fn.editableform.loading = "<div class='editableform-loading'><i class='light-blue icon-2x icon-spinner icon-spin'></i></div>";
$.fn.editableform.buttons = '<button type="submit" class="btn btn-info editable-submit"><i class="icon-ok icon-white"></i></button>'+
'<button type="button" class="btn editable-cancel"><i class="icon-remove"></i></button>';

function replaceLast(alt, lastNum){
    var newAlt = "";

    var splitArr = alt.split("-");
    for(var idx in splitArr){
        var altItem = splitArr[idx];
        if(idx == splitArr.length - 1){
            altItem = lastNum;
        }
        newAlt += newAlt ==""? altItem : "-" + altItem;
    }

    return newAlt;
}

function cloneInput(){
    var inputClone = $(this).parent().parent().parent().clone();
    inputClone.children("div .addInputDiv").remove();
    var nowParent = $(this).parent().parent().parent();
    var nowParentAlt = $(nowParent).attr("alt");
    var childCnt = $(nowParent).parent().children(".profile-info-value").length;
    var newAltParent = replaceLast(nowParentAlt, childCnt);

    $(inputClone).attr("alt", newAltParent);
    inputClone.find("[alt]").each(function(index,element){
        var nowAlt = $(element).attr("alt");
        var newAlt= nowAlt.replace(nowParentAlt, newAltParent);
        $(element).attr("alt", newAlt);
    });
    $(nowParent).parent().append(inputClone);

    editableInit();

    notifyParamChanged($(this).parent().parent().parent().children("input").attr("trig"));
}

function removeInput(){
    var valueParent = $(this).parent().parent();
    var valueParentParent = valueParent.parent();

    var valueChangeTrig = $(valueParent).children("input").attr("trig");
    valueParent.remove();
    if(valueParentParent.children("div.profile-info-name").length > 0 && valueParentParent.children("div.profile-info-value").length == 0){
        valueParentParent.remove();
    }

    notifyParamChanged(valueChangeTrig);
}

function initHtml_ret(parentKey, params, valueChangedNotifyId){
    var paramInfo = new Object();
    initHtml(parentKey, params, valueChangedNotifyId, paramInfo);

    return paramInfo;
}

function initHtml(parentKey, params, valueChangedNotifyId, paramInfo){
    initParamInfo(parentKey, params, valueChangedNotifyId, paramInfo);

    editableInit(paramInfo);

    return paramInfo;
}

function initParamInfo(parentKey, params, valueChangedNotifyId, paramInfo){
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
        paramInfo["valueChangedNotifyId"] = valueChangedNotifyId;

        if(param.detail != null){
            if(isMulti){
                initHtml(paramKey, param.detail[0], valueChangedNotifyId, paramInfo);
            }else{
                initHtml(paramKey, param.detail, valueChangedNotifyId, paramInfo);
            }
        }else{
            var defaultName = "";
            var defaultValue = "";
            if(param.defaultValue != null){
                var defaultParam = param.defaultValue;
                if(Array.isArray(defaultParam)){
                    defaultParam = defaultParam[0];
                }
                if(defaultParam.name != null){
                    defaultName = defaultParam.name;
                    defaultValue =  defaultParam.value;
                }else{
                    defaultName = defaultParam;
                    defaultValue = defaultParam;
                }
            }

            if(param.selectable != null){
                var options = [];
                for(var secIdx in param.selectable){
                    var sec = param.selectable[secIdx];
                    options.push({value: sec.value, text: sec.name});
                }

                paramInfo[paramKey]["options"] = options;
                paramInfo[paramKey]["is_selectable"] = true;
                paramInfo[paramKey]["selectable"] = param.selectable;
                paramInfo[paramKey]["defaultValue"] = param.defaultValue.value;
                paramInfo[paramKey]["isBoolean"] = isBoolean(param.defaultValue.value);
            }else{
                paramInfo[paramKey]["is_selectable"] = false;
            }

            paramInfo[paramKey]["type"] = Object.prototype.toString.call(defaultValue);
            paramInfo[paramKey]["class"] = param.class;
        }
    }

    return paramInfo;
}

function isNumber(value){
    return Object.prototype.toString.call(value) == "[object Number]";
}

function isBoolean(value){
    return Object.prototype.toString.call(value) == "[object Boolean]";
}

var notParamPropertiesArr = ["valueChangedNotifyId"];
function editableInit(paramInfo){
    for(var prop in paramInfo){
        if($.inArray(prop, notParamPropertiesArr) != -1){
            continue;
        }

        if(paramInfo[prop]["is_selectable"]){
            var options = paramInfo[prop]["options"];
            $('.' + prop + "_label").editable({
                type: 'select2',
                value : paramInfo[prop]["defaultValue"],
                source: options,
                // mode: "popup",
                disabled : getEditDisableStatus("#editBtnSwitch"),
                success: function(response, newValue) {
                    $(this).prev("input").val(newValue);
                    notifyParamChanged($(this).prev("input").attr("trig"));
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
            disabled : getEditDisableStatus("#editBtnSwitch"),
            datepicker: {
                weekStart: 1
            },
            success: function(response, newValue) {
                $(this).prev("input").val(newValue.getTime());
                notifyParamChanged($(this).prev("input").attr("trig"));
            }
        });

        var key = $(this).prev("input").attr("name");
        $("span[key='" + key + "']").removeClass("label-primary");
        $("span[key='" + key + "'][clazz='date_editable']").addClass("label-primary");
    });

    $(document).find(".input_editable").each(function(key,value){
        var valueText = $(value).text();

        if(valueText.length > 100){
            $(value).editable({
                mode: 'inline',
                type: 'wysihtml5',
                name : 'about',
                disabled : getEditDisableStatus("#editBtnSwitch"),
                wysiwyg : {
                    css : {'width':'1000px'}
                },
                success: function(response, newValue) {
                    $(this).prev("input").val(newValue);
                    notifyParamChanged($(this).prev("input").attr("trig"));
                }
            });
        }else{
            $(value).editable({
                type: 'text',
                disabled : getEditDisableStatus("#editBtnSwitch"),
                success: function(response, newValue) {
                    $(this).prev("input").val(newValue);
                    notifyParamChanged($(this).prev("input").attr("trig"));
                }
            });
        }
    });

    $(document).find(".switch_editable").each(function(key,value){
        var selected = $(value).val();
        if(selected == "true"){
            $(value).attr("checked", "checked");
        }
    });
}

function notifyParamChanged(notifyId){
    $("#" + notifyId).trigger("change");
}

function getEditDisableStatus(statusLocation){
    var editable = $(statusLocation).val();
    return editable != "1";
}

var del_btn_html = "<div class='spinner-buttons input-group-btn delInputDiv' style='display: inline-block;margin-right: 25px;'><button class='btn spinner-down btn-xs btn-danger delInputBtn' type='button'><i class='icon-minus smaller-75'></i></button></div>";
var add_btn_html = "<div class='spinner-buttons input-group-btn addInputDiv' style='display: inline-block;'><button class='btn spinner-up btn-xs btn-success addInputBtn'  type='button'><i class='icon-plus smaller-75'></i></button></div>";
del_btn_html = "<div class='pull-right action-buttons'><a class='red delInputBtn hide qing_param_edit' isMulti='{isMulti}' href='###'><i class='icon-trash bigger-130'></i></a></div>";
add_btn_html = "<div style='margin-bottom: 22px;' class='qing_param_edit hide'><div class='pull-right action-buttons'><a class='blue addInputBtn' href='###'><i class='icon-plus bigger-130'></i></a></div></div>";

var input_editable_html = "<div class='profile-info-row' alt='{alt}'><div class='profile-info-name'> <input key='{key}' class='qing_editable' isMulti='{isMulti}' trig='{notifyId}' type='hidden' id='{key}--name' alt='{alt}' value='{name}'/>{name} </div>{value}</div>";
var input_editable_value = "<div class='profile-info-value' alt='{alt}'>{editable}" + del_btn_html + "{br}<input key='{key}' type='hidden' name='{key}' alt='{alt}' trig='{notifyId}' value='{defaultValue}'/><span class='editable input_label {key}_label {class}' style='word-break: break-all;' alt='{alt}'>{defaultName}</span></div>";
var editable_table_html = "<div class='profile-info-value' alt='{alt}'>{editable}" + del_btn_html + "<div style='margin-right: 13px;'><div class='profile-user-info profile-user-info-striped' id = '{id}'>{br}{paramList}</div></div></div>";
var first_editable_table_html =  del_btn_html + "<div style='margin-right: 13px;'><div class='profile-user-info profile-user-info-striped' id = '{id}'>{paramList}</div></div>";
var sub_editable_html = "<div class='profile-info-row' alt='{alt}'><div class='profile-info-name'> <input trig='{notifyId}' key='{key}' class='qing_editable' type='hidden' id='{key}--name' isMulti='{isMulti}' alt='{alt}' value='{name}'/>{name} </div>{paramList}</div>";
var switch_editable_html = "<div class='profile-info-value' alt='{alt}' style='height: 34px;'>" + del_btn_html + "<label class='pull-left inline' title='' data-rel='tooltip' clazz='switch_editable' data-original-title='{name}'><input  key='{key}' type='checkbox' clazz='switch_editable' name='{key}' alt='{alt}' trig='{notifyId}' value='{defaultValue}' class='ace ace-switch ace-switch-5 {class}'><span class='lbl'></span></label></div>";

var number_type_html = "<span class='col-xs-9 pull-right qing_param_edit_1 hide'><span class='pull-right inline'><span href='#' key='{key}' clazz='input_editable' class='label label-large label-primary arrowed-in arrowed-right qing_value_type'>数值</span> <span href='#' key='{key}' clazz='date_editable' class='label label-large arrowed-in arrowed-right qing_value_type'>日期毫秒值</span><span href='#' key='{key}' clazz='datetime_editable' class='label label-large arrowed-in arrowed-right qing_value_type'>日期+时间毫秒值</span></span></span><!-- /span -->";
number_type_html = "<span class='col-xs-9 pull-right qing_param_edit hide'><span class='pull-right inline'><span href='#' key='{key}' trig='{notifyId}' clazz='input_editable' class='label label-large label-primary arrowed-in arrowed-right qing_value_type'>数值</span> <span href='#' key='{key}' trig='{notifyId}' clazz='date_editable' class='label label-large arrowed-in arrowed-right qing_value_type'>日期毫秒值</span></span></span><!-- /span -->";

var input_editable_html_edit = "<div class='profile-info-row' alt='{alt}'><div class='profile-info-name'> <input trig='{notifyId}' key='{key}' class='qing_editable' isMulti='{isMulti}' type='hidden' id='{key}--name' alt='{alt}' value='{name}'/><span class='editable input_editable input_label'>{name}</span> </div>{value}</div>";
var input_editable_value_edit = "<div class='profile-info-value' alt='{alt}'>" + del_btn_html + "<input trig='{notifyId}' key='{key}' type='hidden' name='{key}' alt='{alt}' value='{defaultValue}'/><span class='editable input_label {key}_label {class}' style='word-break: break-all;'alt='{alt}'>{defaultName}</span>{valueType}</div>";
var sub_editable_html_edit = "<div class='profile-info-row' alt='{alt}'><div class='profile-info-name'>  <input trig='{notifyId}' key='{key}' class='qing_editable' type='hidden' id='{key}--name' isMulti='{isMulti}' alt='{alt}' value='{name}'/><span class='editable input_editable input_label'>{name}</span>  </div><div class='profile-info-value'>" + del_btn_html + "<div style='margin-right: 13px;'>{paramList}</div></div></div>";
sub_editable_html_edit = "<div class='profile-info-row' alt='{alt}'><div class='profile-info-name'> <input trig='{notifyId}' key='{key}' class='qing_editable' type='hidden' id='{key}--name' isMulti='{isMulti}' alt='{alt}' value='{name}'/><span class='editable input_editable input_label'>{name}</span>  </div>{paramList}</div>";

function genHtml(parentKey, params, parentAlt, isEditStatus, isTableArr, paramKey, notifyId){
    if(parentKey != ''){
        parentKey += "-";
    }
    if(isTableArr == null){
        isTableArr = false;
    }
    var parentAlt_;
    if(parentAlt == null){
        parentAlt = "";
        parentAlt_ = "";
    }else{
        parentAlt_ = parentAlt + "-";
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
            var subTableHtml = "";
            if(isArray){
                for(var detailItemIndex in param.detail){
                    subTableHtml += genHtml(parentKey + param.key, param.detail[detailItemIndex], parentAlt_ + detailItemIndex, isEditStatus, isArray, param.name, notifyId);
                }
            }else{
                subTableHtml += genHtml(parentKey + param.key, param.detail, parentAlt_ +  "0", isEditStatus, isArray, param.name, notifyId);
            }

            var br = getBr(param.name);

            var subHtml = isEditStatus? sub_editable_html_edit:sub_editable_html;
            paramHtml = subHtml.replace(new RegExp("{key}","gm"), parentKey + param.key);
            paramHtml = paramHtml.replace(new RegExp("{name}","gm"), param.name);
            paramHtml = paramHtml.replace(new RegExp("{alt}","gm"), parentAlt);
            paramHtml = paramHtml.replace(new RegExp("{br}","gm"), br);
            if(!isArray){
                paramHtml = paramHtml.replace(new RegExp("{editable}","gm"), "");
                paramHtml = paramHtml.replace(new RegExp("{isMulti}","gm"), "false");
            }else{
                paramHtml = paramHtml.replace(new RegExp("{editable}","gm"), add_btn_html);
                paramHtml = paramHtml.replace(new RegExp("{isMulti}","gm"), "true");
            }
            paramHtml = paramHtml.replace(new RegExp("{paramList}","gm"), subTableHtml);
            paramHtml = paramHtml.replace(new RegExp("{notifyId}","gm"), notifyId);
        }else{
            paramHtml = initInput(parentKey, param, parentAlt, isArray, isEditStatus, notifyId);
        }
        paramHtmls += paramHtml;
    }

    var br = getBr(paramKey);

    var tableHtml = parentKey == ""? first_editable_table_html : editable_table_html;
    tableHtml = tableHtml.replace(new RegExp("{id}","gm"), parentKey);
    tableHtml = tableHtml.replace(new RegExp("{alt}","gm"), parentAlt);
    tableHtml = tableHtml.replace(new RegExp("{paramList}","gm"), paramHtmls);
    tableHtml = tableHtml.replace(new RegExp("{br}","gm"), br);
    if(isTableArr){
        tableHtml = tableHtml.replace(new RegExp("{editable}","gm"), add_btn_html);
        tableHtml = tableHtml.replace(new RegExp("{isMulti}","gm"), "true");
    }else{
        tableHtml = tableHtml.replace(new RegExp("{editable}","gm"), "");
        tableHtml = tableHtml.replace(new RegExp("{isMulti}","gm"), "false");
    }

    return tableHtml;
}

function getBr(key){
    var br = "";
    if(key != null && key.length > 17){
        br = '<br /><div class="hr hr-dotted"></div>';
    }

    return br;
}

function initInput(paramKey, param, parentAlt, isArray, isEditStatus, notifyId){
    if(parentAlt != null){
        parentAlt = parentAlt + "-";
    }else{
        parentAlt = "";
    }

    var key = paramKey + param.key;
    var valueHtml = "";
    if(isArray){
        for(var defaultIndex in param.defaultValue){
            valueHtml += genValueInput(key, param, param.defaultValue[defaultIndex], isArray, parentAlt + defaultIndex, isEditStatus, param.name, notifyId);
        }
    }else{
        valueHtml += genValueInput(key, param, param.defaultValue, isArray, parentAlt + "0", isEditStatus, param.name, notifyId);
    }

    var br = getBr(param.name);

    var html = isEditStatus? input_editable_html_edit:input_editable_html;
    var paramHtml = html.replace(new RegExp("{name}","gm"), param.name);
    //paramHtml = paramHtml.replace(new RegExp("{alt}","gm"), paramAlt);
    paramHtml = paramHtml.replace(new RegExp("{value}","gm"), valueHtml);
    paramHtml = paramHtml.replace(new RegExp("{key}","gm"), key);
    paramHtml = paramHtml.replace(new RegExp("{isMulti}","gm"), isArray);
    paramHtml = paramHtml.replace(new RegExp("{br}","gm"), br);
    paramHtml = paramHtml.replace(new RegExp("{notifyId}","gm"), notifyId);

    return paramHtml;
}

function genValueInput(key, param, defaultValue, isArray, alt, isEditStatus, paramName, notifyId){
    var valueName = "";
    var value = "";
    var valueType = "";
    if(defaultValue != null){
        if(defaultValue.name != null){
            valueName = defaultValue.name;
            value =  defaultValue.value;
        }else{
            valueName = defaultValue;
            value = defaultValue;
        }

        if(isNumber(value)){
            valueType = number_type_html.replace(new RegExp("{key}","gm"), key);;
        }
    }
    var classes = "";
    if(param.class != null){
        classes = param.class;
    }else{
        if(param.selectable == null){
            classes = "input_editable";
        }else{
            classes = "select_editable";
        }
    }

    var valueHtml = getValueInputTemplate(isEditStatus, classes);
    valueHtml = valueHtml.replace(new RegExp("{key}","gm"), key);
    valueHtml = valueHtml.replace(new RegExp("{name}","gm"), param.name);
    valueHtml = valueHtml.replace(new RegExp("{alt}","gm"), alt);
    valueHtml = valueHtml.replace(new RegExp("{class}","gm"), classes);
    valueHtml = valueHtml.replace(new RegExp("{valueType}","gm"), valueType);
    valueHtml = valueHtml.replace(new RegExp("{defaultName}","gm"), valueName);
    valueHtml = valueHtml.replace(new RegExp("{defaultValue}","gm"), value);
    valueHtml = valueHtml.replace(new RegExp("{br}","gm"), getBr(paramName));
    if(!isArray){
        valueHtml = valueHtml.replace(new RegExp("{editable}","gm"), "");
    }else{
        valueHtml = valueHtml.replace(new RegExp("{editable}","gm"), add_btn_html);
    }
    valueHtml = valueHtml.replace(new RegExp("{isMulti}","gm"), isArray);
    valueHtml = valueHtml.replace(new RegExp("{notifyId}","gm"), notifyId);

    return valueHtml;
}

function getValueInputTemplate(isEditStatus, calsses){
    var templateHtml;
    if("switch_editable" == calsses){
        templateHtml = switch_editable_html;
    }else{
        templateHtml = isEditStatus? input_editable_value_edit:input_editable_value;
    }

    return templateHtml;
}

function generateJsonParam(localtion, paramInfo){
    var param = new Object();
    fromIdxInfo = new Object();
    destIdxInfo = new Object();

    $("" + localtion).each(function(key,value){
        if(value.id.indexOf("--name") >= 0 || value.name == ""){
            return;
        }

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
                        while(idx > 0 && paramObj[propName][idx-1] == null){
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
        if(value == "" || value == null){
            return null;
        }else{
            return new Number(value);
        }
    }else{
        if(value=="true"){
            return true;
        }else if(value == "false"){
            return false;
        }
    }

    return  value;
}

function showParam(options){
    var paramData = options.paramData;
    var isEditStatus = false;
    if("isEditStatus" in options){
        isEditStatus = options.isEditStatus;
    }
    var valueChangedNotifyId = "";
    if("valueChangedNotifyId" in options){
        valueChangedNotifyId = options.valueChangedNotifyId;
    }
    var htmlDiv = "paramListDiv";
    if("htmlDiv" in options){
        htmlDiv = options.htmlDiv;
    }

    var hideDiv = "paramDiv";
    if("hideDiv" in options){
        hideDiv = options.hideDiv;
    }

    var paramInfo;
    if(paramData != null && paramData != "") {
        var params = JSON.parse(paramData);
        var paramHtmls = genHtml("", params, null, isEditStatus, false, "", valueChangedNotifyId);
        $("#" + htmlDiv).html(paramHtmls);

        paramInfo = initHtml_ret("", params, valueChangedNotifyId);
        $("#" + hideDiv).removeClass("hide");
    }

    return paramInfo;
}

function generateEditParam(localtion, paramInfo){
    var param = new Array();
    var allObject = new Object();

    $("" + localtion).each(function(key,value){
        if(value.id.indexOf("--name") >= 0 || value.name == ""){
            return;
        }

        var paramNameArr = value.name.split("-");
        var altArr = value.alt.split("-");
        formatEditParam(param, "", paramNameArr, 0, value, allObject, altArr, paramInfo);
    });

    return JSON.stringify(param);
}

function formatEditParam(paramObj, paramName, paramNameArr, arrIdx, value, allObject, altArr, paramInfo){
    var propName = paramNameArr[arrIdx];
    //console.log(value.name + "->" + propName);
    paramName = paramName == ""? propName:paramName + "-" + propName;

    var isArray = $("#" + paramName + "--name").attr("isMulti") == "true";
    var isLast = arrIdx == paramNameArr.length -1;
    var idx = altArr[arrIdx];

    if(isLast){
        var obj = formatEditParamObject(propName, paramName, value, allObject, paramInfo);
        if(obj != null){
            if(isArray){
                var objArr = new Array();
                objArr.push(obj);

                paramObj.push(objArr);
            }else{
                paramObj.push(obj);
            }
        }
        return;
    }else{
        var  obj = allObject[paramName];
        if(obj == null){
            obj = new Object();
            obj.key = propName;
            obj.name = $("#" + paramName + "--name").val();
            if(isArray){
                var objArr = new Array();
                objArr.push(obj);
                paramObj.push(objArr);

                allObject[paramName] = obj;
            }else{
                paramObj.push(obj);
                allObject[paramName] = obj;
            }
        }

        var detailArr = obj.detail;
        if(detailArr == null){
            detailArr = new Array();
            obj.detail = detailArr;
        }

        if(isArray){
            if(detailArr[idx] == null){
                detailArr[idx] = new Array();
                clearSubItem(allObject, paramName);
            }
            detailArr = detailArr[idx];
        }

        formatEditParam(detailArr, paramName, paramNameArr, arrIdx + 1, value, allObject, altArr, paramInfo);
    }
}

function clearSubItem(allObject, paramName){
    paramName = paramName + "-";
    for (var i in allObject) {
        if (allObject.hasOwnProperty(i)) {
            if(i.indexOf(paramName) == 0){
                allObject[i] = null;
            }
        }
    }
}

function formatEditParamObject(propName, paramName, value, allObject, paramInfo){
    var newInit = false;
    var isArray = $("#" + paramName + "--name").attr("isMulti") == "true";

    var obj = allObject[paramName];
    if(obj == null){
        obj = new Object();
        obj.key = propName;
        obj.name = $("#" + paramName + "--name").val();
        if(paramInfo[paramName]["selectable"] != null) {
            obj.selectable = paramInfo[paramName]["selectable"];
            if(paramInfo[paramName]["isBoolean"]){
                obj.class = "switch_editable";
            }else{
                obj.class = "select_editable";
            }

        }else{
            obj.class = $(value).attr("clazz");
        }
        if(isArray){
            obj.defaultValue = new Array();
        }else{
            obj.defaultValue = new Object();
        }

        allObject[paramName] = obj;
        newInit = true;
    }

    var defaultName = $("." + paramName + "_label[alt='" + value.alt + "']").text();
    if(obj.class == "switch_editable"){
        defaultName = value.value;
    }
    if(isArray){
        var defaultObj = new Object();
        defaultObj.name = defaultName;
        defaultObj.value = formatValue(paramInfo, paramName, value.value);

        obj.defaultValue.push(defaultObj);
    }else{
        obj.defaultValue.name = defaultName;
        obj.defaultValue.value = formatValue(paramInfo, paramName, value.value);
    }

    return newInit? obj:null;
}

$(document).on("change", "#editBtnSwitch", function(){
    if($(this).val() == 0){
        $(".qing_param_edit").removeClass("hide");
        $(this).val(1);
    }else{
        $(".qing_param_edit").addClass("hide");
        $(this).val(0);
    }
    editableOff();
});

$(document).on("change", "#selfParamSwitch", function(){
    if($(this).val() == 0){
        showFull();
        $(this).val(1);
    }else{
        showFormat();
        $(this).val(0);
    }
});

function showFull(){
    $("#paramListDiv").addClass("hide");
    $("#selfParamDiv").removeClass("hide");
}

function showFormat(){
    $("#paramListDiv").removeClass("hide");
    $("#selfParamDiv").addClass("hide");
}

$(document).on("change", "#isLocalDebug", function(){
    if($(this).val() == 0){
        $(".isLocalDebug").removeClass("hide");
        $(this).val(1);
    }else{
        $(".isLocalDebug").addClass("hide");
        $(this).val(0);
    }
});

$(document).on("change", ".qing_select", function(){
    if($(this).val() == 0){
        $(this).val(1);
    }else{
        $(this).val(0);
    }
});

function editableOff(){
    $(document).find(".date_editable").each(function(key,value){
        $(value).editable('toggleDisabled');
    });

    $(document).find(".input_editable").each(function(key,value){
        $(value).editable('toggleDisabled');
    });

    $(document).find(".select_editable").each(function(key,value){
        $(value).editable('toggleDisabled');
    });
}

$(document).on("click", ".qing_value_type", function(){
    var key = $(this).attr("key");
    var clazz = $(this).attr("clazz");

    $(".qing_value_type[key='" + key + "']").removeClass("label-primary");
    $(this).addClass("label-primary");
    $("input[name='" + key + "']").attr("clazz", clazz);

    changeDefaultValue(key, clazz);
    notifyParamChanged($(this).attr("trig"));
});

$(document).on("click", ".switch_editable", function(){
    if($(this).val() == "true"){
        $(this).val("false");
    }else{
        $(this).val("true");
    }

    notifyParamChanged($(this).attr("trig"));
});

function changeDefaultValue(key, clazz){
    var keyLabel = $("." + key + "_label");
    var newKeyLabel = keyLabel.clone();
    $(newKeyLabel).removeClass("input_editable");
    $(newKeyLabel).removeClass("date_editable");
    $(keyLabel).replaceWith(newKeyLabel);

    var defaultName = "";
    var defaultValue = 1;
    switch (clazz){
        case "input_editable":
            defaultName = 1;
            defaultValue = 1;

            $("." + key + "_label").editable({
                type: 'text',
                disabled : getEditDisableStatus("#editBtnSwitch"),
                success: function(response, newValue) {
                    $(this).prev("input").val(newValue);
                    notifyParamChanged($(this).prev("input").attr("trig"));
                }
            });

            break;
        case "date_editable":
            defaultName = getyyyyMMdd();
            defaultValue = Date.now();
            defaultValue = defaultValue - defaultValue%100000;

            $("." + key + "_label").editable({
                type: 'date',
                format: 'yyyy-mm-dd',
                viewformat: 'yyyy-mm-dd',
                disabled : getEditDisableStatus("#editBtnSwitch"),
                datepicker: {
                    weekStart: 1
                },
                success: function(response, newValue) {
                    $(this).prev("input").val(newValue.getTime());
                    notifyParamChanged($(this).prev("input").attr("trig"));
                }
            });
            break;
    }

    $(newKeyLabel).text(defaultName);
    $(newKeyLabel).prev("input").val(defaultValue);;
}

function fillDefaultValueWithDefault(paramObj, defaultObj){
    if(paramObj == null || defaultObj == null){
        return;
    }

    for(var paramIdx in paramObj){
        var param = paramObj[paramIdx];
        if(param instanceof Array){
            if(param[0].defaultValue && param[0].defaultValue instanceof Array){
                var defaultValueArr = defaultObj[param[0].key];
                if(defaultValueArr == null){
                    return paramObj;
                }
                param[0].defaultValue = [];
                var defaultValueArrIdx = 0;
                while(defaultValueArrIdx < defaultValueArr.length){
                    param[0].defaultValue[defaultValueArrIdx] = {name:defaultValueArr[defaultValueArrIdx],value:defaultValueArr[defaultValueArrIdx]};
                    defaultValueArrIdx++;
                }
            }else{
                var detailResultArr = [];
                var detailDefaults = defaultObj[param[0].key];
                if(detailDefaults == null){
                    return paramObj;
                }
                var detailDefaultIdx = 0;
                while(detailDefaultIdx < detailDefaults.length){
                    detailResultArr[detailDefaultIdx] = fillDefaultValueWithDefault(param[0].detail[0], detailDefaults[detailDefaultIdx]);
                    detailDefaultIdx++;
                }
                param[0].detail = detailResultArr;
            }

            return paramObj;
        }

        for(var propName in defaultObj){
            if(param.key == propName){
                if(param.defaultValue == null){
                    fillDefaultValueWithDefault(param.detail, defaultObj[propName]);
                }else{
                    if(param.defaultValue instanceof Array){
                        var defaultValueArr = defaultObj[propName];
                        var valueArrIdx = 0;
                        param.defaultValue = [];
                        while(valueArrIdx < defaultValueArr.length){
                            var defaultValue = defaultValueArr[valueArrIdx];
                            param.defaultValue[valueArrIdx] = {name:formatDefaultName(defaultValue, param.class),value:defaultValue};
                            valueArrIdx++;
                        }
                    }else{
                        var defaultValue = defaultObj[propName];
                        param.defaultValue.name = formatDefaultName(defaultValue, param.class);
                        param.defaultValue.value = defaultObj[propName];
                    }
                }

                break;
            }
        }
    }

    return paramObj;
}

function formatDefaultName(defaultValue, clazz){
    if(clazz == "date_editable"){
        return formatDate_yyyyMMDD(defaultValue);
    }

    return defaultValue;
}

function generateTemplate(jsonObj){
    var itemArr = [];
    var itemIndex = 0;
    if(jsonObj instanceof Array){
        var arrItem = [];
        var arrIdx = 0;
        var arrLength = jsonObj.length;
        while(arrIdx < arrLength){
            arrItem[arrIdx] = generateTemplate(jsonObj[arrIdx]);
            arrIdx++;
        }
        itemArr[itemIndex++] = arrItem;
    }else{
        for(var propName in jsonObj){
            var item;
            var propValue = jsonObj[propName];
            if(propValue instanceof Array){
                var arrItem = {key: propName, name:propName};

                var valueIsObj = Object.prototype.toString.call(propValue[0]) == "[object Object]";
                var arrItemDetail = [];
                var arrIdx = 0;
                var arrLength = propValue.length;
                while(arrIdx < arrLength){
                    if(valueIsObj){
                        arrItemDetail[arrIdx] = generateTemplate(propValue[arrIdx]);
                    }else{
                        arrItemDetail[arrIdx] = {name : propValue[arrIdx],value:propValue[arrIdx]};
                    }
                    arrIdx++;
                }

                if(valueIsObj){
                    arrItem.detail = arrItemDetail;
                }else{
                    arrItem.defaultValue = arrItemDetail;
                }

                item = [];
                item[0] = arrItem;
            }else{
                item = {key: propName, name:propName};
                if(Object.prototype.toString.call(propValue) == "[object Object]"){
                    item.detail = generateTemplate(propValue);
                }else{
                    item.defaultValue = {name : propValue,value:propValue};
                    if(Object.prototype.toString.call(propValue) == "[object Boolean]"){
                        item.class = "switch_editable";
                    }
                }
            }
            itemArr[itemIndex++] = item;
        }
    }

    return itemArr;
}
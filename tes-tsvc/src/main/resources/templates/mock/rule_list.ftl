<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3" xmlns="http://www.w3.org/1999/html">
<head>
    <title>Mock规则集合</title>
    <#include "/include/resource.ftl" />
    <link href="${base}/static/css/json/base.css" rel="stylesheet">
    <link href="${base}/static/css/json/jquery.numberedtextarea.css" rel="stylesheet">

    <script src="${base}/static/js/json/jquery.message.js"></script>
    <script src="${base}/static/js/json/jquery.json.js"></script>
    <script src="${base}/static/js/json/json2.js"></script>
    <script src="${base}/static/js/json/jsonlint.js"></script>
    <script src="${base}/static/js/json/jquery.numberedtextarea.js"></script>
    <script src="${base}/static/js/param.js"></script>

</head>
<body>
    <#include "/include/topbar.ftl" />
    <div class="main-container" id="main-container">
        <script type="text/javascript">
            try{ace.settings.check('main-container' , 'fixed')}catch(e){}
        </script>

        <div class="main-container-inner">
            <a class="menu-toggler" id="menu-toggler" href="#">
                <span class="menu-text"></span>
            </a>

            <#include "/include/sidebar.ftl" />

            <div class="main-content">
                <div class="breadcrumbs" id="breadcrumbs">
                    <script type="text/javascript">
                        try{ace.settings.check('breadcrumbs' , 'fixed')}catch(e){}
                    </script>

                    <ul class="breadcrumb">
                        <li>
                            <i class="icon-home home-icon"></i>
                            <a href="#">系统设置</a>
                        </li>
                        <li class="active"><a href="${base}/v1/mock/type?catelogIndex=3-8">mock配置</a></li>
                        <li class="active">mock规则</li>
                    </ul><!-- .breadcrumb -->

                    <div class="nav-search" id="nav-search">
                        <span class="input-icon">
                            <input type="text" placeholder="Search ..." class="nav-search-input" id="task_search" autocomplete="off" value="${search!""}" />
                            <i class="icon-search nav-search-icon"></i>
                        </span>
                    </div><!-- #nav-search -->
                </div>

                <div class="page-content">
                    <div class="page-header">
                        <h1>
                            Mock规则列表
                            <small>
                                <i class="icon-double-angle-right"></i>
                                <label id = "interfaceNameDiv">目前支持的Mock规则列表</label>
                            </small>
                        </h1>
                    </div><!-- /.page-header -->

                    <div class="row">
                        <div class="col-xs-12">
                            <div class="table-responsive">
                                <input type="hidden" id="mockType" />

                                <div class="form-group">
                                    <label class="control-label col-xs-12 col-sm-3 no-padding-right" style="text-align: right;" for="env">环境开关:</label>

                                    <div class="col-xs-12 col-sm-9">
                                        <div class="clearfix">
                                            <button type="button" value="0" env="dev" style="border-radius: 8px" class="btn qing_mock_enable">开发环境</button>
                                            <button type="button" value="0" env="fws" style="border-radius: 8px" class="btn qing_mock_enable">接口测试环境</button>
                                            <button type="button" value="0" env="tst" style="border-radius: 8px" class="btn qing_mock_enable">测试环境</button>
                                        </div>
                                    </div>
                                </div>

                                <span class="col-sm-12" style="margin-bottom: 10px;">
                                    <a class="btn btn-link" target="_blank" href="${base}/v1/mock/rule/edit?catelogIndex=3-8&mockType=${mockType}">
                                        <i class="icon-plus-sign bigger-220 green"></i>
                                    </a>
                                    <label class="pull-right inline"  title="开启时可显示未启用的规则" data-rel="tooltip" >
                                        <small class="muted">显示未启用:</small>

                                        <input id="showDeletedBtn" type="checkbox" class="ace ace-switch ace-switch-5" value="0" />
                                        <span class="lbl"></span>
                                    </label>
                                </span><!-- /span -->

                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>mock_type</th>
                                            <th>规则描述</th>
                                            <th>规则类型</th>
                                            <th>规则</th>
                                            <th>规则优先级</th>
                                            <th>延迟毫秒数</th>
                                            <th>返回值</th>
                                            <th>是否是默认</th>
                                            <th>是否启用</th>
                                            <th>走原代码逻辑</th>
                                            <th>操作</th>
                                            </tr>
                                    </thead>

                                    <tbody  id= "ruleListBody">

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                </div>

            <#include "/include/righttool-sidebar.ftl" />

<script type="text/javascript">
    var allEnv = ["dev","tst","fws"];
    $(document).ready(function(){
        $("#mockType").val('${mockType}');
        refreshPage();

        for(var envIdx in allEnv){
            var env = allEnv[envIdx];
            initConfig(env);
        }
    });

    document.addEventListener('visibilitychange',function(){ //浏览器切换事件
        if(document.visibilityState!='hidden') { //状态判断
            refreshPage();
        }
    });

    function refreshPage(){
        var request = {
            url : "${base}/v1/mock/rule/list.json",
            data : {"data":'${mockType}'},
            handlerFunc : handlerInterface,
            isASync : true,
            failTitle :"获取信息失败:"
        };

        commonAjaxRequest(request);
    }

    var cacheResult;
    var template_HTML = '<tr class="ruleLine {ruleClass}">' +
            '<td><a href="#">{mockType}</a></td>' +
            '<td>{remark}</td>' +
            '<td>{ruleType}</td>' +
            '<td>{ruleValue}</td>' +
            '<td>{ruleOrderNum}</td>' +
            '<td>{delayMs}</td>' +
            '<td>{resp}</td>' +
            '<td><label><input id="{id}" class="ace ace-switch ace-switch-6 default_rule" type="checkbox" value="{isDefault}" {default_checked} />    <span class="lbl"></span>    </label></td>' +
            '<td class="hidden-480"><label><input id="{id}" class="ace ace-switch ace-switch-6 enable_rule" type="checkbox" value="{isEnable}" {enable_checked} />    <span class="lbl"></span>    </label></td>' +
            '<td><label><input id="{id}" class="ace ace-switch ace-switch-6 notMock_rule" type="checkbox" value="{notMock}" {notMock_checked} />    <span class="lbl"></span>    </label></td>' +
            '<td>' +
                '<input type="hidden" id = "id" value="{id}"/> ' +
                '<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons">' +
                    '<a class="green" target="_blank" href="${base}/v1/mock/rule/edit?catelogIndex=3-8&id={id}"><i class="icon-pencil bigger-130"></i></a>' +
                '</div>' +
            '</td></tr>';
    function handlerInterface(resu) {
        var resultList = resu.resultList;
        cacheResult = resultList;
        if (resu.resultList != null && resu.resultList.length > 0) {
            $("#ruleListBody").html("");
            var showDeleted = $("#showDeletedBtn").val() == "1";
            for (var resultIdx in resultList) {
                var result = resultList[resultIdx];

                var html = template_HTML;
                html = html.replace(new RegExp("{id}", "gm"), result.id);
                html = html.replace(new RegExp("{mockType}", "gm"), result.mockType);
                html = html.replace(new RegExp("{remark}", "gm"), result.remark);
                html = html.replace(new RegExp("{ruleType}", "gm"), ruleTypeDesc(result.ruleType));
                html = html.replace(new RegExp("{ruleValue}", "gm"), ruleValueDesc(result.ruleType, result.ruleValue));
                html = html.replace(new RegExp("{ruleOrderNum}", "gm"), result.ruleOrderNum);
                html = html.replace(new RegExp("{delayMs}", "gm"), result.delayMs);
                var resp = result.resp;
                if(resp.length < 20){
                    html = html.replace(new RegExp("{resp}", "gm"), resp);
                }else{
                    var href = '<a href="#" class="respContent tooltip-info" qing_id="' + result.id + '" title="">' + resp.substring(0, 18) + '...</a>';
                    html = html.replace(new RegExp("{resp}", "gm"), href);
                }

                html = html.replace(new RegExp("{isDefault}", "gm"), result.default ? "1" : "0");
                var defaultChecked = "";
                if(result.default){
                    defaultChecked = 'checked="checked"';
                }
                html = html.replace(new RegExp("{default_checked}", "gm"), defaultChecked);
                if(result.deleted){
                    if(showDeleted){
                        html = html.replace(new RegExp("{ruleClass}", "gm"), "rule_deleted");
                    }else{
                        html = html.replace(new RegExp("{ruleClass}", "gm"), "hide rule_deleted");
                    }
                    html = html.replace(new RegExp("{enable_checked}", "gm"),  '');
                    html = html.replace(new RegExp("{isEnable}", "gm"), "0");
                }else{
                    html = html.replace(new RegExp("{ruleClass}", "gm"), "");
                    html = html.replace(new RegExp("{enable_checked}", "gm"),  'checked="checked"');
                    html = html.replace(new RegExp("{isEnable}", "gm"), "1");
                }
                var notMockChecked = "";
                var notMock = "0";
                if(result.notMock){
                    notMockChecked = 'checked="checked"';
                    notMock = "1";
                }
                html = html.replace(new RegExp("{notMock}", "gm"), notMock);
                html = html.replace(new RegExp("{notMock_checked}", "gm"), notMockChecked);

                $("#ruleListBody").append(html);
            }
        }
    };

    function ruleTypeDesc(ruleType){
        if(ruleType == "VALUE_MATCH"){
            return "值匹配";
        }else if(ruleType == "NUMBER_RANGE"){
            return "数值范围匹配";
        }

        return "";
    }

    function ruleValueDesc(ruleType, ruleValue){
        ruleValue = JSON.parse(ruleValue);
        if(ruleType == "VALUE_MATCH"){
            return "值为：" + ruleValue.value;
        }else if(ruleType == "NUMBER_RANGE"){
            var desc = "";
            if(ruleValue.start != null){
                desc += "大于等于" + ruleValue.start;
            }
            if(ruleValue.end != null){
                if(ruleValue.start != null){
                    desc += "&&";
                }
                desc += "小于" + ruleValue.end;
            }
            return desc;
        }

        return "";
    }

    $(document).on("click", '.default_rule', function(){
        var id = $(this).attr("id");
        var defaultValue;

        var isDefault = $(this).val();
        if(isDefault == 0){
            defaultValue = true;
            $(this).val(1);
        }else{
            defaultValue = false;
            $(this).val(0);
        }

        var data = {
            id : id,
            bool : defaultValue
        };

        var request = {
            url : "${base}/v1/mock/rule/set_default.json",
            data : data,
            handlerFunc : handleDefaultResult,
            isASync : true,
            failTitle :"保存出错:"
        };

        commonAjaxRequest(request);
    });

    $(document).on("click", '.notMock_rule', function(){
        var id = $(this).attr("id");
        var defaultValue;

        var isDefault = $(this).val();
        if(isDefault == 0){
            defaultValue = true;
            $(this).val(1);
        }else{
            defaultValue = false;
            $(this).val(0);
        }

        var data = {
            id : id,
            bool : defaultValue
        };

        var request = {
            url : "${base}/v1/mock/rule/set_notMock.json",
            data : data,
            handlerFunc : handleDefaultResult,
            isASync : true,
            failTitle :"保存出错:"
        };

        commonAjaxRequest(request);
    });

    function handleDefaultResult(){
        refreshPage();
    }

    $(document).on("click", '.enable_rule', function(){
        var id = $(this).attr("id");
        var defaultValue;

        var isEnable = $(this).val();
        if(isEnable == 0){
            defaultValue = false;
            $(this).val(1);
        }else{
            defaultValue = true;
            $(this).val(0);
        }

        var data = {
            id : id,
            bool : defaultValue
        };

        var request = {
            url : "${base}/v1/mock/rule/set_deleted.json",
            data : data,
            handlerFunc : handleDefaultResult,
            isASync : true,
            failTitle :"保存出错:"
        };

        commonAjaxRequest(request);
    });

    $("#showDeletedBtn").click(function(){
        var nowValue = $(this).val();
        if(nowValue == 0){
            $(this).val(1);

            $(".rule_deleted").removeClass("hide");
        }else{
            $(this).val(0);
            $(".rule_deleted").addClass("hide");
        }
    });

    $(document).on("click", ".respContent", function(){
        $.gritter.add({
            title: '',
            text: getRespById($(this).attr("qing_id")),
            class_name: 'gritter-warning gritter-center'
        });

        return false;
    });

    function getRespById(id){
        for (var resultIdx in cacheResult) {
            var result = cacheResult[resultIdx];
            if(result.id == id){
                return result.resp;
//                try{
//                    JSON.parse(result.resp);
//                    return toFormatJson(result.resp);
//                }catch(e){
//                    return result.resp;
//                }
            }
        }

        return "";
    }

    function initConfig(env){
        var data = {
            url : "/svc/api/pi/v1/test/common/config/list.json",
            param:"",
            userId:22367,
            userType : 'student'
        };

        var otherData = {
            env : env
        }

        var request = {
            url : "${base}/v1/common/pi.json",
            data : data,
            handlerFunc : initResult,
            isASync : true,
            failTitle :"获取通用配置信息:",
            guid : "test-api-config",
            env : env,
            otherData : otherData
        };

        commonAjaxRequest(request);
    }

    var dbConfigKey = "api_mock_enable_${mockType}";
    function initResult(resu, otherData) {
        for (var idx in resu.resultList) {
            var config = resu.resultList[idx];
            if(dbConfigKey == config.key){
                if(config.value == "true" || config.value == "TRUE"){
                    $(".qing_mock_enable[env='" + otherData.env + "']").addClass("btn-primary");
                    $(".qing_mock_enable[env='" + otherData.env + "']").val("1");
                }
                break;
            }
        }
    }

    $(document).on("click", ".qing_mock_enable", function(){
        var env = $(this).attr("env");
        var value = $(this).val();
        if(value == "0"){ // 取开启
            setConfig(env, dbConfigKey, "true");
        }else{
            setConfig(env, dbConfigKey, "false");
        }
    });

    function setConfig(env, configKey, configValue){
        if(configKey == "" || configKey == null){
            return;
        }

        var obj = new Object();
        obj.configKey = configKey;
        obj.configValue = configValue;
        obj.configScope = "common";
        obj.operateUserId = 1;
        obj.operateUserType = "system";

        var data = {
            url : "/svc/api/pi/v1/test/common/config/reset.json",
            param: JSON.stringify(obj),
            userId:22367,
            userType : 'student'
        };

        var request = {
            url : "${base}/v1/common/pi.json",
            data : data,
            handlerFunc : handleSetConfig,
            isASync : true,
            failTitle :"设置通用配置失败:",
            guid : "test-api-config",
            env : env,
            otherData:{"env":env, "newValue": (configValue == "true"? "1":"0")}
        };

        commonAjaxRequest(request);
    }

    function handleSetConfig(resu, otherData){
        if(otherData.newValue == "1"){
            $(".qing_mock_enable[env='" + otherData.env + "']").addClass("btn-primary");
            $(".qing_mock_enable[env='" + otherData.env + "']").val("1");
        }else{
            $(".qing_mock_enable[env='" + otherData.env + "']").removeClass("btn-primary");
            $(".qing_mock_enable[env='" + otherData.env + "']").val("0");
        }

        // 刷新对应环境配置
        // piSingleRequest("${base}", otherData.env, "/svc/api/crontab/v1/sync?syncType=app_common");
    }

    jQuery(function($) {
        $(".chosen-select").chosen();
        $('[data-rel=tooltip]').tooltip();
    });
</script>
    </div>
</body>
</html>
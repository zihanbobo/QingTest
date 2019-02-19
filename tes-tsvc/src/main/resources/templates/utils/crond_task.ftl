<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3" xmlns="http://www.w3.org/1999/html">
<head>
    <title>Hello World!</title>
    <#include "/include/resource.ftl" />
    <link href="${base}/static/css/json/base.css" rel="stylesheet">
    <link href="${base}/static/css/json/jquery.numberedtextarea.css" rel="stylesheet">

    <script src="${base}/static/js/json/hm.js"></script>
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
                            <a href="#">Home</a>
                        </li>
                        <li class="active">Dashboard</li>
                    </ul><!-- .breadcrumb -->

                    <div class="nav-search" id="nav-search">
                        <span class="input-icon">
                            <input type="text" placeholder="Search ..." class="nav-search-input" id="task_search" autocomplete="off" />
                            <i class="icon-search nav-search-icon"></i>
                        </span>
                    </div><!-- #nav-search -->
                </div>

                <div class="page-content">
                    <div class="page-header">
                        <h1>
                            定时任务
                            <small>
                                <i class="icon-double-angle-right"></i>
                                <label id = "interfaceNameDiv">手动触发定时任务执行</label>
                            </small>
                        </h1>
                    </div><!-- /.page-header -->

                    <div class = "row" style="height: 100px">

                        <#include "/include/env.ftl" />
                    </div>

                    <div class="row" id="taskList">
                    </div>
                </div>
                </div>

            <#include "/include/righttool-sidebar.ftl" />

<script type="text/javascript">
    var cronTaskArr = [
        {url:"/svc/api/crontab/v1/sync_app_config_immediately", description:"同步通用配置"},
        {url:"/svc/api/crontab/v1/sync_city_rule_config_immediately", description:"同步城市配置"},
        {url:"/svc/api/crontab/v1/auto_off_shelf_teacher", description:"下架超过100天未登录的老师"},
        {url:"/svc/api/crontab/v1/sync_installment_backward_refund_status", description:"同步分期退款申请状态"},
        {url:"/svc/api/crontab/v1/upgrade_teach_plan_v3", description:"教学计划数据迁移V3"},
        ];

    var task_html = '<div class="col-xs-2 col-sm-3 qing_task" id="task_{idx}"><div class="widget-box"><div class="widget-header" style="text-align: center"><h4 class="smaller">{desc}</h4></div><div class="widget-body"><div class="widget-main" style="text-align: center"><button class="btn btn-xs btn-danger" onclick="cronTaskIdx({idx})"><i class="icon-bolt bigger-110"></i>执行<i class="icon-arrow-right icon-on-right"></i></button></div><div id="link_{idx}" class="hide" style="text-align: center;margin-top: 5px;margin-bottom: 5px;" ><hr style="margin-bottom: 0px;margin-top: 0px;" /><a href="" target="_blank"> 查看日志</a></div></div></div></div>';
    $(document).ready(function(){
        for(var taskIdx in cronTaskArr){
            var task = cronTaskArr[taskIdx];
            var html = task_html;
            html = html.replace(new RegExp("{idx}","gm"), taskIdx);
            html = html.replace(new RegExp("{desc}","gm"), task.description);

            $("#taskList").append(html);
        }
    });

    function cronTaskIdx(idx){
        cronTask(idx, cronTaskArr[idx].url);
    }

    function cronTask(idx, url){
        var data = {
            data : url
        }

        var isLocalDebug = $("#isLocalDebug").val();
        var localPort = $("#localDebugPort").val();
        var env = $("#env").val();
        var guid = generateGuid();
        var targetData = {
            idx: idx,
            guid : guid,
            env :env
        }

        commonAjaxRequest("${base}/v1/common/crond_task.json?is_local=" + isLocalDebug + "&local_port=" + localPort, data, handlerCorndSucc, true, "定时任务执行:", env, targetData, guid);

        var logTargetUrl = logUrl.replace("{env}", targetData.env);
        logTargetUrl = logTargetUrl.replace("{guid}", targetData.guid);

        var idx = targetData.idx;
        var logEle = $("#link_" + idx);
        $(logEle).removeClass("hide");
        $(logEle).children("a:first")[0].href = logTargetUrl;
    }

    var logUrl = "http://172.22.12.14:5601/app/logtrail#/?q=env_type:%20%22{env}%22%20%26%26%20guid:%20%22{guid}%22&t=Now&i=rsyslog-app*&_g=()";
    function handlerCorndSucc(resu, data){
        $.gritter.add({
            title : '提示:',
            text : "接口调用成功",
            class_name : 'gritter-info gritter-center'
        });
    }

    jQuery(function($) {
        $(".chosen-select").chosen();
        $('[data-rel=tooltip]').tooltip();

        $(".env").click(function(){
            $(".env.btn-primary").removeClass("btn-primary");
            $(this).addClass("btn-primary");
            $("#env").val($(this).val());
        });

        $("#task_search").change(function(){
            var search = $(this).val();
            $(".qing_task").removeClass("hide");

            for(var taskIdx in cronTaskArr){
                var task = cronTaskArr[taskIdx];
                var id = "task_" + taskIdx;

                if(search != "" && task.description.indexOf(search) == -1){
                    $("#" + id).fadeOut(500);
                }else{
                    $("#" + id).fadeIn(1000);
                }
            }
        });

    });
</script>
    </div>
</body>
</html>
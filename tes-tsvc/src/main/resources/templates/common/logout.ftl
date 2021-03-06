<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3">
<head>
    <title>俺是过滤器</title>
    <#include "/include/resource.ftl" />
    <link href="${base}/static/css/json/base.css" rel="stylesheet">
    <link href="${base}/static/css/json/jquery.numberedtextarea.css" rel="stylesheet">

    <script src="${base}/static/js/json/jquery.message.js"></script>
    <script src="${base}/static/js/json/jquery.json.js"></script>
    <script src="${base}/static/js/json/json2.js"></script>
    <script src="${base}/static/js/json/jsonlint.js"></script>
    <script src="${base}/static/js/json/jquery.numberedtextarea.js"></script>

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
                <div class="page-content">
                    <div class="row">
                        <div class="col-xs-12">
                            <!-- PAGE CONTENT BEGINS -->

                            <div class="error-container">
                                <div class="well">
                                    <h1 class="grey lighter smaller">
											<span class="blue bigger-125">
												<i class="icon-sitemap"></i>
												403
											</span>
                                        Request forbidden
                                    </h1>

                                    <hr />
                                    <#if (inBlack!0) gt 0>
                                        <h3 class="lighter smaller">你已被加入黑名单，请上传用户名，通过审核之后才能使用</h3>
                                    <#else>
                                        <h3 class="lighter smaller">不要再试了，非验证用户无法使用该系统</h3>
                                    </#if>
                                    <hr />
                                    <div class="space"></div>
                                </div>
                            </div><!-- PAGE CONTENT ENDS -->
                        </div><!-- /.col -->
                    </div><!-- /.row -->
                </div><!-- /.page-content -->
            </div><!-- /.main-container -->

        <#include "/include/righttool-sidebar.ftl" />
        </div>
</body>
<script type="text/javascript">
    $(document).ready(function(){
<#if (inBlack!0) gt 0>
    upIpWithTitle("你已被加入黑名单，请上传用户名，通过审核之后才能使用");
<#else>
    upIp();
</#if>

    });
</script>
</html>
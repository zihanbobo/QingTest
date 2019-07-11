<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3" xmlns="http://www.w3.org/1999/html">
<head>
    <title>老师AttributeTag设置</title>
    <#include "/include/resource.ftl" />
    <link href="${base}/static/css/json/base.css" rel="stylesheet">
    <link href="${base}/static/css/json/jquery.numberedtextarea.css" rel="stylesheet">

    <script src="${base}/static/js/json/hm.js"></script>
    <script src="${base}/static/js/json/jquery.message.js"></script>
    <script src="${base}/static/js/json/jquery.json.js"></script>
    <script src="${base}/static/js/json/json2.js"></script>
    <script src="${base}/static/js/json/jsonlint.js"></script>
    <script src="${base}/static/js/json/jquery.numberedtextarea.js"></script>
    <script src="${base}/static/assets/js/jquery.maskedinput.min.js"></script>
    <script src="${base}/static/assets/js/bootstrap-tag.min.js"></script>
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
                <div class="page-content">
                    <div class="page-header">
                        <div class="row">
                            <div class="col-xs-12">

                            <#include "/include/param.ftl" />

                                <div class="clearfix form-actions">
                                    <div class="col-md-offset-3 col-md-9">
                                        <button class="btn btn-info" style="border-radius: 8px" type="button" id = "teacherIdBtn">
                                            <i class="icon-ok bigger-110"></i>
                                            Submit
                                        </button>

                                        &nbsp; &nbsp; &nbsp;
                                        <button class="btn" style="border-radius: 8px" type="reset" id="resetBtn">
                                            <i class="icon-undo bigger-110"></i>
                                            Save Example
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- 开关类 -->
                            <div class="col-xs-12 col-sm-6 widget-container-span">
                                <div class="widget-box">
                                    <div class="widget-header header-color-blue">
                                        <h5 class="bigger lighter">
                                            <i class="icon-table"></i>
                                            开关类
                                        </h5>

                                        <div class="widget-toolbar widget-toolbar-light no-border">
                                            <select id="simple-colorpicker-1" class="hide">
                                                <option selected="" data-class="blue" value="#307ECC">#307ECC</option>
                                                <option data-class="blue2" value="#5090C1">#5090C1</option>
                                                <option data-class="blue3" value="#6379AA">#6379AA</option>
                                                <option data-class="green" value="#82AF6F">#82AF6F</option>
                                                <option data-class="green2" value="#2E8965">#2E8965</option>
                                                <option data-class="green3" value="#5FBC47">#5FBC47</option>
                                                <option data-class="red" value="#E2755F">#E2755F</option>
                                                <option data-class="red2" value="#E04141">#E04141</option>
                                                <option data-class="red3" value="#D15B47">#D15B47</option>
                                                <option data-class="orange" value="#FFC657">#FFC657</option>
                                                <option data-class="purple" value="#7E6EB0">#7E6EB0</option>
                                                <option data-class="pink" value="#CE6F9E">#CE6F9E</option>
                                                <option data-class="dark" value="#404040">#404040</option>
                                                <option data-class="grey" value="#848484">#848484</option>
                                                <option data-class="default" value="#EEE">#EEE</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="widget-body">
                                        <div class="widget-main no-padding">
                                            <table class="table table-striped table-bordered table-hover">
                                                <thead class="thin-border-bottom">
                                                <tr>
                                                    <th>
                                                        tag_type
                                                    </th>

                                                    <th>
                                                        <i class="icon-user"></i>
                                                        属性名
                                                    </th>

                                                    <th>
                                                        <i>@</i>
                                                        开关状态
                                                    </th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                <tr>
                                                    <td class="">34</td>
                                                    <td class="">是否是严选老师</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch is_selective_teacher"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="is_selective_teacher" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">32</td>
                                                    <td class="">是否是专职老师</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch is_full_time_teacher"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="is_full_time_teacher" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">30</td>
                                                    <td class="">是否是特邀老师</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch is_special_teacher"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="is_special_teacher" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">8</td>
                                                    <td class="">是否上架</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch is_on_shelf"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="is_on_shelf" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">13</td>
                                                    <td class="">是否禁止上架</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch tad_not_allow_teacher_on_shelf"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="tad_not_allow_teacher_on_shelf" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">19</td>
                                                    <td class="">支持在线1对1</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch teacher_living_course"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="teacher_living_course" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">24</td>
                                                    <td class="">是否支持在线小组课</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch support_live_class"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="support_live_class" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">20</td>
                                                    <td class="">是否支持在线旁听</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch teacher_online_listen"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="teacher_online_listen" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">7</td>
                                                    <td class="">是否允许实名搜索</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch teacher_allow_realname_search"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="teacher_allow_realname_search" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">9</td>
                                                    <td class="">是否允许手机号搜索</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch teacher_allow_telephone_search"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="teacher_allow_telephone_search" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">10</td>
                                                    <td class="">是否观看了培训视频</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch training_video_watched"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="training_video_watched" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">11</td>
                                                    <td class="">是否阅读了平台规则</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch platform_rule_readed"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="platform_rule_readed" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">25</td>
                                                    <td class="">是否多账号用户</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch is_multiple_accounts"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="is_multiple_accounts" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td class="">33</td>
                                                    <td class="">是否是首课任务白名单</td>

                                                    <td>
                                                        <label class="pull-left inline qing_tag_switch is_first_course_task_white_list"  title="开启会调本地接口" data-rel="tooltip" >
                                                            <input type="checkbox" id="is_first_course_task_white_list" class="ace ace-switch ace-switch-5" value="0" />
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 在线授课工具 -->
                            <div class="col-xs-12 col-sm-3 widget-container-span">
                                <div class="widget-box">
                                    <div class="widget-header">
                                        <h5 class="smaller">在线授课工具</h5>

                                        <div class="widget-toolbar">
													<span class="label label-success">
														16%
														<i class="icon-arrow-up"></i>
													</span>
                                        </div>
                                    </div>

                                    <div class="widget-body">
                                        <div class="widget-main padding-6">
                                            <div class="alert alert-info">
                                                <input type="hidden" id="use_live_tool" />
                                                <button type="button" value="-1" style="border-radius: 8px" class="btn use_live_tool btn-primary"> 未  知 </button>
                                                <button type="button" value="1" style="border-radius: 8px" class="btn use_live_tool"> 直播云 </button>
                                                <button type="button" value="2" style="border-radius: 8px" class="btn use_live_tool">轻轻课堂</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 限制的上门方式 -->
                            <div class="col-xs-12 col-sm-3 widget-container-span">
                                <div class="widget-box">
                                    <div class="widget-header">
                                        <h5 class="smaller">被限制的上门方式</h5>

                                        <div class="widget-toolbar">
													<span class="label label-success">
														16%
														<i class="icon-arrow-up"></i>
													</span>
                                        </div>
                                    </div>

                                    <div class="widget-body">
                                        <div class="widget-main padding-6">
                                            <div class="alert alert-info">
                                                <input type="hidden" id="teacher_limited_site_types" />
                                                <button type="button" value="1" sel = "0" style="border-radius: 8px" class="btn teacher_limited_site_types"> 老师上门 </button>
                                                <button type="button" value="2" sel = "0" style="border-radius: 8px" class="btn teacher_limited_site_types"> 家长上门 </button>
                                                <button type="button" value="8" sel = "0" style="border-radius: 8px" class="btn teacher_limited_site_types"> 在线授课 </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 最大可授课学生数 -->
                            <div class="col-xs-12 col-sm-3 widget-container-span">
                                <div class="widget-box">
                                    <div class="widget-header">
                                        <h5 class="smaller">最大可授课学生数</h5>

                                        <div class="widget-toolbar">
													<span class="label label-success">
														16%
														<i class="icon-arrow-up"></i>
													</span>
                                        </div>
                                    </div>

                                    <div class="widget-body">
                                        <div class="widget-main padding-6">
                                            <div class="alert alert-info center">
                                                <input type="text" class="input-mini" id="teacher_max_teachable_student_count" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div><!-- /.row -->
                    </div><!-- /.page-header -->
                </div>
                </div>

            <#include "/include/righttool-sidebar.ftl" />

<script type="text/javascript">
    jQuery(function($) {
        $(".chosen-select").chosen();
        $('[data-rel=tooltip]').tooltip();
        $('#teacher_max_teachable_student_count').ace_spinner({value:0,min:0,max:1000,step:1, on_sides: true, icon_up:'icon-plus smaller-75', icon_down:'icon-minus smaller-75', btn_up_class:'btn-success' , btn_down_class:'btn-danger'});

        $(document).ready(function(){
            var paramDetail = '[{"key":"teacher_id","name":"老师ID","defaultValue":{"name":"3856","value":3856}}]';
            showParam({paramData:paramDetail});

            getTag(3856);
        });

        function getTag(teacherId){
            var data = {
                data:teacherId
            };

            commonAjaxRequest("${base}/v1/teacher/tag/list.json", data, init, true, "查询失败", $("#env").val(), null, "test-api-tag");
        }

        function init(resu){
            for( var idx in resu.resultList){
                var tag = resu.resultList[idx];

                var ele = $(".qing_tag_switch." + tag.tagType).children("input").first();
                $(ele).val(tag.tagValue);
                if(tag.tagValue == 1){
                    $(ele).attr("checked", "checked")
                }

                if("use_live_tool" == tag.tagType){
                    $("#use_live_tool").val(tag.tagValue);
                    $(".use_live_tool.btn-primary").removeClass("btn-primary");
                    $(".use_live_tool[value='" + tag.tagValue + "']").addClass("btn-primary");
                }
                if("teacher_limited_site_types" == tag.tagType){
                    $("#teacher_limited_site_types").val(tag.tagValue);
                    var eles = $(".teacher_limited_site_types");
                    if(eles){
                        var siteTypeNum = new Number(tag.tagValue);
                        var idx = 0;
                        while(idx < eles.length){
                            var siteTypeEleNum = new Number($(eles[idx]).val());
                            if((siteTypeEleNum&siteTypeNum) == siteTypeEleNum){
                                $(eles[idx]).addClass("btn-primary");
                                $(eles[idx]).attr("sel", 1);
                            }else{
                                $(eles[idx]).removeClass("btn-primary");
                                $(eles[idx]).attr("sel", 0);
                            }
                            idx++;
                        }
                    }
                }

                if("teacher_max_teachable_student_count" == tag.tagType){
                    $("#teacher_max_teachable_student_count").val(tag.tagValue);
                }
            }
        }

       $(".qing_tag_switch").click(function(){
           var inputEle = $(this).children("input").first();
           var switchValue = $(inputEle).val();
           var newValue;
           if(switchValue == 1){
               newValue = 0;
           }else{
               newValue = 1;
           }
           $(inputEle).val(newValue);

           setTag(3856, $(inputEle).attr("id"), newValue);
       });

        function setTag(teacherId, tagType, tagValue){
            var data = {
                teacherId : teacherId,
                tagType : tagType,
                tagValue : tagValue + ""
            }

            commonAjaxRequest("${base}/v1/teacher/tag/set.json", data, emptyM, true, "设置失败", $("#env").val(), null, "test-api-tag");
        }

       function emptyM(){

       }

        $(".use_live_tool").click(function(){
            var newValue = $(this).val();
            $(".use_live_tool.btn-primary").removeClass("btn-primary");
            $(this).addClass("btn-primary");
            $("#use_live_tool").val(newValue);

            setTag(3856, "use_live_tool", newValue);
        });

        $(".teacher_limited_site_types").click(function() {
            if($(this).attr("sel") == 0){
                $(this).attr("sel", 1);
                $(this).addClass("btn-primary");
            }else{
                $(this).attr("sel", 0);
                $(this).removeClass("btn-primary");
            }
            var finalValue = 0;
            var eles = $(".teacher_limited_site_types.btn-primary");
            if(eles){
                var idx = 0;
                while(idx < eles.length){
                    finalValue = finalValue + new Number($(eles[idx++]).val());
                }
            }
            setTag(3856, "teacher_limited_site_types", finalValue);
        });

        $('#teacher_max_teachable_student_count').change(function(){
            setTag(3856, "teacher_max_teachable_student_count", $(this).val());
        });

        $(".env").click(function(){
            $(".env.btn-primary").removeClass("btn-primary");
            $(this).addClass("btn-primary");
            $("#env").val($(this).val());
        });

        $("#teacherIdBtn").click(function(){
            var param = generateJsonParam("#paramListDiv input");

            getTag(param.teacher_id)
        });
    });
</script>
    </div>
</body>
</html>
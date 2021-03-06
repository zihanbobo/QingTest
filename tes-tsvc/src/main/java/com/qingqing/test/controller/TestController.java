package com.qingqing.test.controller;

import com.qingqing.api.proto.v1.ProtoBufResponse.SimpleDataResponse;
import com.qingqing.api.proto.v1.ProtoBufResponse.SimpleResponse;
import com.qingqing.api.proto.v1.UserProto;
import com.qingqing.api.proto.v1.util.Common.SimpleLongRequest;
import com.qingqing.api.proto.v1.util.Common.SimpleStringRequest;
import com.qingqing.common.auth.domain.UserType;
import com.qingqing.common.exception.ErrorCodeException;
import com.qingqing.common.exception.RequestValidateException;
import com.qingqing.common.util.CollectionsUtil;
import com.qingqing.common.util.JsonUtil;
import com.qingqing.common.util.StringUtils;
import com.qingqing.common.web.protobuf.ProtoRequestBody;
import com.qingqing.common.web.protobuf.ProtoRespGenerator;
import com.qingqing.common.web.protobuf.ProtoResponseBody;
import com.qingqing.test.aspect.validate.IpLoginValid;
import com.qingqing.test.bean.base.BaseResponse;
import com.qingqing.test.bean.base.KeyAndValue;
import com.qingqing.test.bean.common.response.ListResponse;
import com.qingqing.test.bean.common.response.SingleResponse;
import com.qingqing.test.bean.inter.CatelogBean;
import com.qingqing.test.bean.inter.SaveCatelogBean;
import com.qingqing.test.bean.inter.SaveInterfaceBean;
import com.qingqing.test.bean.inter.UserRequestParam;
import com.qingqing.test.bean.inter.request.InterfaceInvokeRequest;
import com.qingqing.test.bean.inter.response.TestInterfaceBean;
import com.qingqing.test.bean.inter.response.TestInterfaceResponse;
import com.qingqing.test.controller.errorcode.SimpleErrorCode;
import com.qingqing.test.controller.errorcode.TestInterfaceErrorCode;
import com.qingqing.test.dao.es.BiStudentEsMapper;
import com.qingqing.test.domain.inter.CatelogRefType;
import com.qingqing.test.domain.inter.TestInterface;
import com.qingqing.test.domain.inter.TestInterfaceCatelog;
import com.qingqing.test.domain.inter.TestInterfaceCatelog.CatelogRef;
import com.qingqing.test.domain.inter.TestInterfaceParam;
import com.qingqing.test.manager.*;
import com.qingqing.test.manager.mock.MyMockTestManager;
import com.qingqing.test.service.inter.TestInterfaceCatelogService;
import com.qingqing.test.service.inter.TestInterfaceParamService;
import com.qingqing.test.service.inter.TestInterfaceService;
import com.qingqing.test.spring.filter.IpFilter;
import com.qingqing.test.util.QingParamUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * Created by zhujianxing on 2018/2/4.
 */
@Controller
@RequestMapping("/v1/test")
public class TestController {

    @Autowired
    private TestInterfaceManager testInterfaceManager;
    @Autowired
    private TestInterfaceCatelogService catelogService;
    @Autowired
    private TestInterfaceParamService testInterfaceParamService;
    @Autowired
    private TestInterfaceService testInterfaceService;
    @Autowired
    private PassportManager passportManager;
    @Autowired
    private WxNotifyManager wxNotifyManager;
    @Autowired
    private UserIpManager userIpManager;
    @Autowired
    private TestProtoClassNameManager testProtoClassNameManager;

    @RequestMapping("test")
    @ResponseBody
    public String show( Model model, @RequestParam(value = "aa", required = false) List<Long> teacherIds){
//        UrlAndParam url = new UrlAndParam();
//        url.setUrl("abc");
//        url.setParam("param");
//        UserWithDataBean user = new UserWithDataBean();
//
//        String result = JsonUtil.format(myMockTestManager.c(url, user));
//
//        url.setUrl("ammm");
        return JsonUtil.format(teacherIds);
    }

    @RequestMapping("json_format")
    public String show(@RequestParam("id") Long interfaceId,
                       @RequestParam(value = "paramId", defaultValue = "-1") Long paramId,
                       @RequestParam(value = "env", defaultValue = "dev") String env,
                       @RequestParam(value = "cross", defaultValue = "1") int isCross,
                       @RequestParam(value = "full", defaultValue = "0") int isFull,
                       @RequestParam(value = "inv", defaultValue = "0") int inv,
                       @RequestParam(value = "def", defaultValue = "{}") String defaultObj,
                       @RequestParam(value = "uid", defaultValue = "0") Long userId,
                       @RequestParam(value = "uty", defaultValue = "") String userType,
                       @RequestParam(value = "gnp", defaultValue = "0") int goToNextPage,
                       Model model){
        model.addAttribute("interfaceId", interfaceId);
        model.addAttribute("paramExampleId", paramId);
        model.addAttribute("env", env);
        model.addAttribute("cross", isCross);
        model.addAttribute("defaultObj", defaultObj);
        model.addAttribute("full", isFull);
        model.addAttribute("inv", inv);
        model.addAttribute("userId", userId);
        model.addAttribute("userType", userType);
        model.addAttribute("goToNextPage", goToNextPage);

        return "interface/jsonformat";
    }

    @RequestMapping("invoke_page")
    public String invokePage(@RequestParam("id") Long id, Model model){
        model.addAttribute("interfaceId", id);
        return "interface/invoke";
    }

    @RequestMapping("/interface/edit")
    @IpLoginValid
    public String edit(@RequestParam(value="id", defaultValue = "0") Long interfaceId, Model model){
        if(interfaceId > 0){
            TestInterfaceBean interfaceBean = testInterfaceManager.getInterfaceBean(interfaceId);
            model.addAttribute("interfaceBean", interfaceBean);
            model.addAttribute("id", interfaceId);
        }
        return "interface/editInterface";
     }

    @RequestMapping("/interface/save")
    @ProtoResponseBody
    @IpLoginValid
    public SimpleDataResponse save(@RequestBody SaveInterfaceBean saveBean){
        Long parentCatelogId = saveBean.getParentCatelogId();
        TestInterfaceCatelog testInterfaceCatelog = catelogService.findById(parentCatelogId);
        if(testInterfaceCatelog == null){
            throw new ErrorCodeException(new SimpleErrorCode("未能找到对应所属目录"), "cannot found parent catelog");
        }

        Long interfaceId = testInterfaceManager.saveTestInterface(saveBean, testInterfaceCatelog);
        wxNotifyManager.markdown("有用户新增了接口", new KeyAndValue("用户", userIpManager.getUserNameByIp(IpFilter.getRequestUserIp())), new KeyAndValue("接口名称", saveBean.getInter().getInterfaceName()));

        return SimpleDataResponse.newBuilder().setResponse(ProtoRespGenerator.SUCC_BASE_RESP)
                .setData(String.valueOf(interfaceId)).build();
    }

    @RequestMapping("/interface/param/save")
    @ProtoResponseBody
    @IpLoginValid
    public SimpleDataResponse saveParam(@RequestBody TestInterfaceParam param){
        testInterfaceParamService.save(param);
        wxNotifyManager.markdown("有用户新增了参数示例", new KeyAndValue("用户", userIpManager.getUserNameByIp(IpFilter.getRequestUserIp())), new KeyAndValue("示例名称", param.getParamName()));

        return SimpleDataResponse.newBuilder().setResponse(ProtoRespGenerator.SUCC_BASE_RESP)
                .setData(String.valueOf(param.getId())).build();
    }

    @RequestMapping("/interface/param/delete")
    @ProtoResponseBody
    @IpLoginValid
    public SimpleResponse deleteParam(@RequestBody SimpleLongRequest request){
        testInterfaceParamService.deleteById(request.getData());

        return ProtoRespGenerator.SIMPLE_SUCC_RESP;
    }

    @RequestMapping("/interface/param/default/set")
    @ProtoResponseBody
    @IpLoginValid
    public SimpleResponse setParamDefault(@RequestBody SimpleLongRequest request){
        TestInterfaceParam param = testInterfaceParamService.findById(request.getData());
        if(param != null){
            testInterfaceParamService.resetDefault(param.getInterfaceId());
            testInterfaceParamService.setDefault(param.getId());
        }

        return ProtoRespGenerator.SIMPLE_SUCC_RESP;
    }

    @RequestMapping("/catelog/edit")
    public String editCatelog(@RequestParam(value="id", defaultValue = "0") Long catelogId, Model model){
        if(catelogId > 0){
//            TestInterfaceBean interfaceBean = testInterfaceManager.getInterfaceBean(interfaceId);
//            model.addAttribute("interfaceBean", interfaceBean);
        }
        return "interface/editCatelog";
    }

    @RequestMapping("/catelog/save")
    @ResponseBody
    @IpLoginValid
    public SingleResponse saveCatelog(@RequestBody SaveCatelogBean saveBean){
        Long parentCatelogId = saveBean.getParentCatelogId();

        TestInterfaceCatelog parentCatelog = null;
        if(parentCatelogId != null){
            parentCatelog = catelogService.findById(parentCatelogId);
            if(parentCatelog == null){
                throw new ErrorCodeException(new SimpleErrorCode("未能找到对应所属目录"), "cannot found parent catelog");
            }
        }

        TestInterfaceCatelog catelog = testInterfaceManager.saveCatelog(saveBean, parentCatelog);
        wxNotifyManager.markdown("有用户新增了目录", new KeyAndValue("用户", userIpManager.getUserNameByIp(IpFilter.getRequestUserIp())), new KeyAndValue("目录名称", saveBean.getCatelogName()));

        SingleResponse<TestInterfaceCatelog> result = new SingleResponse<>();
        result.setResponse(BaseResponse.SUCC_RESP);
        result.setResultList(catelog);
        return result;
    }

    @RequestMapping("/interface")
    @ResponseBody
    public TestInterfaceResponse testInterface(@ProtoRequestBody SimpleLongRequest request){
        Long interfaceId = request.getData();
        TestInterfaceBean interfaceBean = testInterfaceManager.getInterfaceBean(interfaceId);
        if(interfaceBean.getInter() == null){
            throw new ErrorCodeException(TestInterfaceErrorCode.unknown_test_interface, "unknown test interface, interfaceId:" + interfaceId);
        }

        TestInterfaceResponse interfaceResponse = new TestInterfaceResponse();
        interfaceResponse.setResponse(BaseResponse.SUCC_RESP);
        interfaceResponse.setInterfaceInfo(interfaceBean);
        return interfaceResponse;
    }

    @RequestMapping("/interface/{id}")
    @ResponseBody
    public TestInterfaceResponse testInterface(@PathVariable("id") Long interfaceId){
        TestInterfaceBean interfaceBean = testInterfaceManager.getInterfaceBean(interfaceId);
        if(interfaceBean.getInter() == null){
            throw new ErrorCodeException(TestInterfaceErrorCode.unknown_test_interface, "unknown ytest interface, interfaceId:" + interfaceId);
        }

        TestInterfaceResponse interfaceResponse = new TestInterfaceResponse();
        interfaceResponse.setResponse(BaseResponse.SUCC_RESP);
        interfaceResponse.setInterfaceInfo(interfaceBean);
        return interfaceResponse;
    }

    @RequestMapping("/catelog")
    @ResponseBody
//    @QingSwitch(key = "false")
    public ListResponse<CatelogBean> catelog(){
        List<CatelogBean> dataList = testInterfaceManager.getCatelogList();

        ListResponse<CatelogBean> resultList = new ListResponse<>();
        resultList.setResponse(BaseResponse.SUCC_RESP);
        resultList.setResultList(dataList);
        return resultList;
    }

    @RequestMapping("/interface/invoke")
    @ProtoResponseBody
    public com.qingqing.api.proto.v1.ProtoBufResponse.SimpleDataResponse invoke(@RequestBody InterfaceInvokeRequest request) {
        String result =  testInterfaceManager.invoke(request);
        return com.qingqing.api.proto.v1.ProtoBufResponse.SimpleDataResponse.newBuilder()
                .setData(result)
                .setResponse(ProtoRespGenerator.SUCC_BASE_RESP)
                .build();
    }

    @RequestMapping("/interface/request/convert")
    @ResponseBody
    public SimpleDataResponse convertParam(@ProtoRequestBody SimpleStringRequest request) {
        if(!request.hasData()){
            throw new RequestValidateException("need param className", "need param className");
        }

        String fullClassName = request.getData();
        List<String> fullClassInDB = testProtoClassNameManager.getFullClassName(fullClassName);
        if(!CollectionsUtil.isNullOrEmpty(fullClassInDB)){
            fullClassName = fullClassInDB.get(0);
        }

        String data = QingParamUtil.generateParamJson(fullClassName);
        return SimpleDataResponse.newBuilder().setResponse(ProtoRespGenerator.SUCC_BASE_RESP)
                .setData(data).build();
    }

    @RequestMapping("/interface/all")
    @ResponseBody
    public ListResponse<TestInterface> allTestInterface(){
        List<TestInterface> allInterfaceList = testInterfaceService.findAll();
        List<TestInterfaceCatelog> allCatelogList = catelogService.selectAll();
        Map<CatelogRef, TestInterfaceCatelog> refMap = CollectionsUtil.mapComposerId(allCatelogList, TestInterfaceCatelog.REF_COMPOSER);
        for (TestInterface testInterface : allInterfaceList) {
            TestInterfaceCatelog catelog = refMap.get(new CatelogRef(CatelogRefType.inter, String.valueOf(testInterface.getId())));
            if(catelog != null){
                testInterface.setCatelogIndex(catelog.getCacheCatelogIndex());
            }
        }

        ListResponse<TestInterface> interfaceResponse = new ListResponse<>();
        interfaceResponse.setResponse(BaseResponse.SUCC_RESP);
        interfaceResponse.setResultList(allInterfaceList);
        return interfaceResponse;
    }

    @RequestMapping("/user/token")
    @ResponseBody
    public SingleResponse<UserRequestParam> getToken(@ProtoRequestBody UserProto.User request){
        SingleResponse<UserRequestParam> response = new SingleResponse<>();
        response.setResponse(BaseResponse.SUCC_RESP);
        response.setResultList(passportManager.getToken(request.getUserId(), UserType.valueOf(request.getUserType().getNumber())));
        return response;
    }

    @RequestMapping("grid")
    public String grid(){
        return "test/grid";
    }

    @RequestMapping("param/template")
    public String paramTemplate(){
        return "utils/param_template";
    }
}
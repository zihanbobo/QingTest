package com.qingqing.test.config.feign.exception;

import com.qingqing.api.proto.v1.ProtoBufResponse;
import com.qingqing.common.exception.QingQingRuntimeException;
import com.qingqing.common.exception.RequestValidateException;
import com.qingqing.common.util.JsonUtil;
import com.qingqing.test.bean.base.SimpleResponse;
import com.qingqing.test.controller.converter.BaseConverter;
import feign.FeignException;
import feign.Response;
import feign.Util;
import feign.codec.ErrorDecoder;
import org.apache.commons.httpclient.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Created by zhujianxing on 2018/8/30.
 */
@Component
public class MyErrorDecoder implements ErrorDecoder {

    @Override
    public Exception decode(String methodKey, Response response) {
        SimpleResponse result = null;
        try {
            result = genSimpleResponse(response);
        } catch (IOException e) {
            return new QingQingRuntimeException("parse exception, value:" + response.body().toString());
        }
        switch (response.status()){
            case HttpStatus.SC_UNPROCESSABLE_ENTITY:
                return new RequestValidateException(result.getResponse().getError_message(), result.getResponse().getError_message());
        }

        return FeignException.errorStatus(methodKey, response);
    }

    private SimpleResponse genSimpleResponse(Response response) throws IOException {
        boolean isProto = response.request().headers().get("Content-Type").contains("application/x-protobuf;charset=UTF-8");
        if(isProto){
            ProtoBufResponse.SimpleResponse proto = ProtoBufResponse.SimpleResponse.parseFrom(response.body().asInputStream());
            return new SimpleResponse(BaseConverter.convertBaseResponse(proto.getResponse()));
        }else{
            String responseValue = "";
            responseValue = Util.toString(response.body().asReader());
            return JsonUtil.getObjectFromJson(responseValue, SimpleResponse.class);
        }
    }
}

package com.qingqing.test.client;

import com.qingqing.api.passort.proto.PassportLoginProto.PassportLoginResponse;
import com.qingqing.api.passort.proto.PassportLoginProto.PassportTkLoginRequestV2;
import com.qingqing.common.web.protobuf.ProtoResponseBody;
import com.qingqing.test.config.feign.MyPiFeignConfiguration;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * Created by zhujianxing on 2017/8/15.
 */
@FeignClient(value = "passportPiClient", url = "${passport.host}/api", configuration = MyPiFeignConfiguration.class)
public interface PassportPiClient {

    /*
    protobuf
     */
    @PostMapping(value = "/pi/v2/auth/refresh", consumes="application/x-protobuf", produces = "application/x-protobuf")
    @ProtoResponseBody
    PassportLoginResponse getTokenAndSession(PassportTkLoginRequestV2 request);

}

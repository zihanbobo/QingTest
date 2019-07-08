package com.qingqing.test.service.user.impl;

import com.qingqing.test.dao.test.user.TestUserIpMapper;
import com.qingqing.test.domain.user.TestUserIp;
import com.qingqing.test.service.user.TestUserIpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by zhujianxing on 2019/7/8.
 */
@Component
public class TestUserIpServiceImpl implements TestUserIpService {

    @Autowired
    private TestUserIpMapper mapper;

    @Override
    public List<TestUserIp> selectAll() {
        return mapper.selectAll();
    }
}

package com.qingqing.test.service.inter;

import com.qingqing.test.domain.inter.TestInterface;

/**
 * Created by zhujianxing on 2018/8/30.
 */
public interface TestInterfaceService {

    void save(TestInterface testInterface);

    void update(TestInterface testInterface);

    TestInterface findById(Long id);
}

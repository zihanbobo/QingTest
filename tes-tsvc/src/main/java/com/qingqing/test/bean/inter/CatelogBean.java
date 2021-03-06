package com.qingqing.test.bean.inter;

import com.qingqing.test.domain.inter.TestInterface;
import com.qingqing.test.domain.inter.TestInterfaceCatelog;

import java.util.List;

/**
 * Created by zhujianxing on 2018/8/30.
 */
public class CatelogBean {
    private TestInterfaceCatelog catelog;
    private String catelogIndex;
    private List<CatelogBean> subCategoryList;

    public TestInterfaceCatelog getCatelog() {
        return catelog;
    }

    public void setCatelog(TestInterfaceCatelog catelog) {
        this.catelog = catelog;
    }

    public String getCatelogIndex() {
        return catelogIndex;
    }

    public void setCatelogIndex(String catelogIndex) {
        this.catelogIndex = catelogIndex;
    }

    public List<CatelogBean> getSubCategoryList() {
        return subCategoryList;
    }

    public void setSubCategoryList(List<CatelogBean> subCategoryList) {
        this.subCategoryList = subCategoryList;
    }
}

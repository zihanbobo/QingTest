package com.qingqing.test.bean.project;

import java.util.List;
import java.util.Map;

/**
 * Created by zhujianxing on 2019/1/31.
 */
public class ProjectCustomBean {
  // java代码package
  private String basePackage;
  // 服务名
  private String svcName;
  // 服务池Code
  private String poolCode;
  // jar包版本
  private Map<String, Object> jarVersionMap;
  // 创建人
  private String createUser;
  // 定制后需要新增的配置
  private Map<String, Object> customMap;
  // 生成项目的目录
  private String destProjectDir;
  // 定制化选线
  private List<ProjectCustomItem> customItemList;

  public String getBasePackage() {
    return basePackage;
  }

  public void setBasePackage(String basePackage) {
    this.basePackage = basePackage;
  }

  public String getSvcName() {
    return svcName;
  }

  public void setSvcName(String svcName) {
    this.svcName = svcName;
  }

  public String getPoolCode() {
    return poolCode;
  }

  public void setPoolCode(String poolCode) {
    this.poolCode = poolCode;
  }

  public Map<String, Object> getJarVersionMap() {
    return jarVersionMap;
  }

  public void setJarVersionMap(Map<String, Object> jarVersionMap) {
    this.jarVersionMap = jarVersionMap;
  }

  public String getCreateUser() {
    return createUser;
  }

  public void setCreateUser(String createUser) {
    this.createUser = createUser;
  }

  public Map<String, Object> getCustomMap() {
    return customMap;
  }

  public void setCustomMap(Map<String, Object> customMap) {
    this.customMap = customMap;
  }

  public String getDestProjectDir() {
    return destProjectDir;
  }

  public void setDestProjectDir(String destProjectDir) {
    this.destProjectDir = destProjectDir;
  }

  public List<ProjectCustomItem> getCustomItemList() {
    return customItemList;
  }

  public void setCustomItemList(List<ProjectCustomItem> customItemList) {
    this.customItemList = customItemList;
  }
}

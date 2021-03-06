package ${basePackage}.config.db;

import com.qingqing.springboot.config.helper.MybatisDataSourceConfigHelper;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import com.qingqing.common.util.StringUtils;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;

/**
* Created by ${user!'test-api'} on ${date}
*/
@Configuration
@MapperScan(basePackages = {DataSource${simpleDbName?cap_first}${type?cap_first}Config.PACKAGE_PATH, DataSource${simpleDbName?cap_first}${type?cap_first}Config.PACKAGE_PATH}, sqlSessionFactoryRef = DataSource${simpleDbName?cap_first}${type?cap_first}Config.SQL_SESSION_FACTORY)
public class DataSource${simpleDbName?cap_first}${type?cap_first}Config {
    private static final String SIMPLE_DB_NAME = "${simpleDbName}${type?cap_first}";

    public static final String PACKAGE_PATH = "${basePackage}.dao.mybatis.${simpleDbName}";
    public static final String SQL_SESSION_FACTORY = SIMPLE_DB_NAME + "SqlSessionFactory";
    public static final String DATA_SOURCE_NAME = SIMPLE_DB_NAME + "DataSource";
    public static final String TX_MANAGER = SIMPLE_DB_NAME + "TransactionManager";
    public final static List<String> XML_PATHS = new ArrayList<>(3);
    static {
        XML_PATHS.add("classpath:${basePackagePath}/dao/mybatis/${simpleDbName}/*.xml");
    }

    @Value("${"$"}{mysql.${dbName}.${type!'master'}.url}")
    private String url;
    @Value("${"$"}{mysql.${dbName}.${type!'master'}.username}")
    private String username;
    @Value("${"$"}{mysql.${dbName}.${type!'master'}.password}")
    private String password;

    @Value("${"$"}{mysql.${dbName}.${type!'master'}.url.param:characterEncoding=UTF-8&useAffectedRows=true}")
    private String urlParam;
    //按需添加
    @Value("${"$"}{mybatis.config.path:mybatis/mybatis-config.xml}")
    private String configPath;

    @Bean(name = DATA_SOURCE_NAME)
    public DataSource getDataSource() {
        String finalUrl = url;
        if(StringUtils.isEmpty(urlParam)){
            if(finalUrl.indexOf("?") != -1){
                finalUrl += "&" + urlParam;
            }else{
                finalUrl += "?" + urlParam;
            }
        }
        return MybatisDataSourceConfigHelper.createDruidDataSource(finalUrl, username, password);
    }

    @Bean(name = TX_MANAGER)
    public DataSourceTransactionManager getTransactionManager(@Qualifier(DATA_SOURCE_NAME) DataSource dataSource) {
        return MybatisDataSourceConfigHelper.getTransactionManager(dataSource);
    }

    @Bean(name = SQL_SESSION_FACTORY)
    public SqlSessionFactory getSqlSessionFactoryData(@Qualifier(DATA_SOURCE_NAME) DataSource dataSource) {
        return MybatisDataSourceConfigHelper.getSqlSessionFactoryData(XML_PATHS, configPath, dataSource);
    }
}

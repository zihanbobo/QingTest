package com.qingqing.test.util;

import com.csvreader.CsvReader;
import com.qingqing.common.exception.QingQingRuntimeException;
import com.qingqing.common.intf.Composer;
import com.qingqing.common.util.CollectionsUtil;
import com.qingqing.common.util.JsonUtil;
import com.qingqing.common.util.StringUtils;
import com.qingqing.test.util.DirSearchUtils.FileHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

/**
 * Created by zhujianxing on 2019/1/21.
 */
public class QingFileUtils {
    private static final Logger logger = LoggerFactory.getLogger(QingFileUtils.class);

    public static final List<String> readLines(InputStream in) throws IOException {
        List<String> resultList = new ArrayList<>(50);
        BufferedReader reader = new BufferedReader(new InputStreamReader(in, "utf-8"));

        String line = null;
        while((line = reader.readLine()) != null){
            resultList.add(line);
        }

        return resultList;
    }

    public static final String readAll(File file) throws IOException {
        InputStream inputStream = null;
        try{
            inputStream = new FileInputStream(file);

            return readAll(inputStream);
        }catch(Exception e){
            throw new QingQingRuntimeException("read file fail, filePath:" + file.getAbsolutePath());
        }finally {
            if(inputStream != null){
                try{
                    inputStream.close();
                }catch(Exception e){
                    // ignore
                }
            }
        }
    }

    public static final String readAll(InputStream in) throws IOException {
        StringBuilder result = new StringBuilder();
        BufferedReader reader = new BufferedReader(new InputStreamReader(in, "utf-8"));

        String line = null;
        while((line = reader.readLine()) != null){
            result.append(line).append("\r\n");
        }

        return result.toString();
    }

    public static final byte[] readBytes(InputStream in) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        byte[] tmp = new byte[1024];
        int readLen = -1;
        while((readLen = in.read(tmp)) != -1){
            output.write(tmp, 0, readLen);
        }

        return output.toByteArray();
    }

    public static final List<String> readLines(String fileName) throws IOException {
        InputStream in = null;
        try{
            in = new FileInputStream(fileName);
            return readLines(in);
        }finally {
            if(in != null){
                try {
                    in.close();
                } catch (IOException e) {
                    // ignore
                }
            }
        }
    }

    public static final <T> List<T> readLines(String fileName, QingTypeConverter<T> converter) throws IOException {
        List<String> lines =  readLines(fileName);
        if(CollectionsUtil.isNullOrEmpty(lines)){
            return Collections.emptyList();
        }

        List<T> resultList = new ArrayList<>(lines.size());
        for (String line : lines) {
            if(!StringUtils.isEmpty(line.trim())){
                T result = converter.convert(line);
                if(result != null){
                    resultList.add(result);
                }
            }
        }

        return resultList;
    }

    public static void main(String[] args) throws IOException {
        List<QingCSVBean> inDBLines = readLines("D:\\分成有问题的数据.csv", new QingCSVBeanConverter("\t"));
        CsvReader reader = new CsvReader("D:\\分成有问题的数据.csv", '\t');
        while(reader.readRecord()){
            System.out.println(reader.getRawRecord());
        }
    }

    public static void main1(String[] args) throws IOException {
        List<QingCSVBean> inDBLines = QingFileUtils.readLines("D:\\sql\\in_db.csv", new QingCSVBeanConverter(","));
        List<QingCSVBean> patchLines = QingFileUtils.readLines("D:\\sql\\分隔测试.txt", new QingCSVBeanConverter("\t"));

        Map<String, QingCSVBean> inDbMap = CollectionsUtil.mapComposerId(inDBLines, new QingCSVBeanComposer(1));
        Map<String, QingCSVBean> patchMap = CollectionsUtil.mapComposerId(patchLines, new QingCSVBeanComposer(1));

        String logTemplate1= "({db_1},1,1,null,null,1,ifnull({db_5}, 5),ifnull({db_4}, 1),now(),now(),'{db_3}',ifnull({db_4}, 1),ifnull({db_5}, 5)),";
        String logTemplate2= "({db_1},2,1,null,null,0,ifnull({db_9}, 5),ifnull({db_8}, 1),now(),now(),'{db_7}',ifnull({db_8}, 1),ifnull({db_9}, 5)),";
        for (Entry<String, QingCSVBean> stringQingCSVBeanEntry : inDbMap.entrySet()) {
            QingCSVBean inDB = stringQingCSVBeanEntry.getValue();

            String finalValue;
            String db2Value = QingCSVBean.getValueNotNull(inDB, 2);
            String db6Value = QingCSVBean.getValueNotNull(inDB, 6);
            if("1".equals(db2Value)){
                finalValue = logTemplate1;
                for (int i = 1; i < 11; i++){
                    finalValue = finalValue.replaceAll("\\{db_" + i + "\\}", QingCSVBean.getValueNotNull(inDB, i));
                }
                System.out.println(finalValue);
            }

            if("1".equals(db6Value)) {
                finalValue = logTemplate2;
                for (int i = 1; i < 11; i++){
                    finalValue = finalValue.replaceAll("\\{db_" + i + "\\}", QingCSVBean.getValueNotNull(inDB, i));
                }
                System.out.println(finalValue);
            }
        }
    }

    private static void searchCommonProperties() throws IOException {
        File dir = new File("D:\\all-project");
        DirSearchUtils.checkDir(dir, new FileHandler() {
            @Override
            public void handle(File file) {
                if("common.properties".equals(file.getName())){
                    try {
                        List<String> lines = readLines(new FileInputStream(file));
                        for (String line : lines) {
                            if(line.contains("mongo")){
                                System.out.println(file.getAbsolutePath() + ": has mongodb config");
                                break;
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void doAfterFileChecked(File dir) {

            }
        });
    }

    public static interface QingTypeConverter<T>{
        T convert(String line);
    }

    public static class QingCSVBeanConverter implements QingTypeConverter<QingCSVBean>{

        private final String split;

        public QingCSVBeanConverter(String split) {
            this.split = split;
        }

        @Override
        public QingCSVBean convert(String line) {
            if(StringUtils.isEmpty(line.trim())){
                return null;
            }

            QingCSVBean result = new QingCSVBean();
            String[] numValues = line.split(split);
            int num = 1;
            for (String numValue : numValues) {
                QingCSVBean.setValue(result, num++, numValue);
            }

            return result;
        }
    }

    public static class QingCSVBean{
        private String _1;
        private String _2;
        private String _3;
        private String _4;
        private String _5;
        private String _6;
        private String _7;
        private String _8;
        private String _9;
        private String _10;

        public String get_1() {
            return _1;
        }

        public void set_1(String _1) {
            this._1 = _1;
        }

        public String get_2() {
            return _2;
        }

        public void set_2(String _2) {
            this._2 = _2;
        }

        public String get_3() {
            return _3;
        }

        public void set_3(String _3) {
            this._3 = _3;
        }

        public String get_4() {
            return _4;
        }

        public void set_4(String _4) {
            this._4 = _4;
        }

        public String get_5() {
            return _5;
        }

        public void set_5(String _5) {
            this._5 = _5;
        }

        public String get_6() {
            return _6;
        }

        public void set_6(String _6) {
            this._6 = _6;
        }

        public String get_7() {
            return _7;
        }

        public void set_7(String _7) {
            this._7 = _7;
        }

        public String get_8() {
            return _8;
        }

        public void set_8(String _8) {
            this._8 = _8;
        }

        public String get_9() {
            return _9;
        }

        public void set_9(String _9) {
            this._9 = _9;
        }

        public String get_10() {
            return _10;
        }

        public void set_10(String _10) {
            this._10 = _10;
        }

        public static void setValue(QingCSVBean bean, int num, String value){
            if(bean == null){
                throw new NullPointerException("QingCSVBean cannot be null");
            }

            if(value != null){
                value = value.trim();
            }
            switch (num){
                case 1:
                    bean.set_1(value);
                    break;
                case 2:
                    bean.set_2(value);
                    break;
                case 3:
                    bean.set_3(value);
                    break;
                case 4:
                    bean.set_4(value);
                    break;
                case 5:
                    bean.set_5(value);
                    break;
                case 6:
                    bean.set_6(value);
                    break;
                case 7:
                    bean.set_7(value);
                    break;
                case 8:
                    bean.set_8(value);
                    break;
                case 9:
                    bean.set_9(value);
                    break;
                case 10:
                    bean.set_10(value);
                    break;
                default:
                    break;
            }
        }

        public static String getValueNotNull(QingCSVBean bean, int num){
            String result = getValue(bean, num);

            return StringUtils.isEmpty(result)? "null":result;
        }

        public static String getValue(QingCSVBean bean, int num){
            if(bean == null){
                return null;
            }

            String value = null;
            switch (num){
                case 1:
                    value = bean.get_1();
                    break;
                case 2:
                    value = bean.get_2();
                    break;
                case 3:
                    value = bean.get_3();
                    break;
                case 4:
                    value = bean.get_4();
                    break;
                case 5:
                    value = bean.get_5();
                    break;
                case 6:
                    value = bean.get_6();
                    break;
                case 7:
                    value = bean.get_7();
                    break;
                case 8:
                    value = bean.get_8();
                    break;
                case 9:
                    value = bean.get_9();
                    break;
                case 10:
                    value = bean.get_10();
                    break;
                default:
                    break;
            }

            return value;
        }
    }

    public static class QingCSVBeanComposer implements Composer<String, QingCSVBean>{

        private final int num;

        public QingCSVBeanComposer(int num) {
            this.num = num;
        }

        @Override
        public String getComposerId(QingCSVBean qingCSVBean) {
            return QingCSVBean.getValue(qingCSVBean, num);
        }
    }
}

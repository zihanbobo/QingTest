package com.qingqing.test.util;

import com.qingqing.test.util.QingParamUtil.QingProtoFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.beans.IntrospectionException;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by zhujianxing on 2019/8/1.
 */
public class QingProtoClassNameUtil {
    private static final Logger logger = LoggerFactory.getLogger(QingProtoClassNameUtil.class);

    public static void main(String[] args) throws ClassNotFoundException, IntrospectionException, IOException {
        String outFilePath = "D:\\sql\\full-proto.sql";
        if(args.length > 0){
            outFilePath = args[0];
        }
        genProtoClassName("F:\\work\\student_pool_svc\\protobean\\src\\main\\resources\\proto-sub", outFilePath);
    }

    private static void genProtoClassName(String dirPath, String outputFileName) throws IOException {
        List<QingProtoFile> qingProtoFiles = parseProtoDir(new File(dirPath));

        BufferedWriter writer = new BufferedWriter(new FileWriter(outputFileName));
        writer.write("delete from `t_proto_class_name`;");
        for (QingProtoFile qingProtoFile : qingProtoFiles) {
            String fullOuterClassName = qingProtoFile.getPackageName() + "." + qingProtoFile.getOutterClassName();
            for (String innerClassName : qingProtoFile.getInnerClassNames()) {
                writer.newLine();
                writer.write(String.format("insert into t_proto_class_name(simple_name, full_class_name, is_deleted, create_time) values('%s', '%s', 0, now());", innerClassName, fullOuterClassName + "$" + innerClassName));
            }
        }

        writer.close();
    }

    private static final Pattern JAVA_PACKAGE_FORMAT = Pattern.compile("\\s*option\\s+java_package\\s*=\\s*\"([^\"]+)\".*");
    private static final Pattern OUTER_CLASS_FORMAT = Pattern.compile("\\s*option\\s+java_outer_classname\\s*=\\s*\"([^\"]+)\".*");
    private static final Pattern INNER_CLASS_FORMAT = Pattern.compile("\\s*message\\s+([^{]+)\\{.*");

    public static List<QingProtoFile> parseProtoDir(File director) throws IOException{
        List<QingProtoFile> resultList = new LinkedList<>();

        File[] fileList = director.listFiles();
        for(File file : fileList){
            if(file.isDirectory()){
                resultList.addAll(parseProtoDir(file));
            }else if(file.getName().endsWith(".proto")){
                resultList.add(parseProtoFile(file));
            }
        }

        return resultList;
    }

    public static QingProtoFile parseProtoFile(File file) throws IOException{
        QingProtoFile result = new QingProtoFile();

        BufferedReader reader = null;
        try{
            reader = new BufferedReader(new FileReader(file));
            String line = null;

            List<String> innerClassNameList = new ArrayList<>(100);
            while((line = reader.readLine()) != null){
                if(result.getPackageName() == null){
                    Matcher matchResult = JAVA_PACKAGE_FORMAT.matcher(line);
                    if(matchResult.matches()){
                        result.setPackageName(matchResult.group(1).trim());
                    }
                }

                if(result.getOutterClassName() == null){
                    Matcher matchResult = OUTER_CLASS_FORMAT.matcher(line);
                    if(matchResult.matches()){
                        result.setOutterClassName(matchResult.group(1).trim());
                    }
                }

                Matcher matchResult = INNER_CLASS_FORMAT.matcher(line);
                if(matchResult.matches()){
                    innerClassNameList.add(matchResult.group(1).trim());
                }
            }

            result.setInnerClassNames(innerClassNameList);
        }finally {
            if(reader != null){
                try{
                    reader.close();
                }catch (IOException e){
                    // ignore
                }
            }
        }

        return result;
    }
}

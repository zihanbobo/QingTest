package com.qingqing.test.bean.index;

/**
 * Created by zhujianxing on 2019/1/31.
 */
public class StudentTeacherIndexBean {
    private Long studentId;
    private Long teacherId;
    private String indexName;
    private String data;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getIndexName() {
        return indexName;
    }

    public void setIndexName(String indexName) {
        this.indexName = indexName;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}

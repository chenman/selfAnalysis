package org.cola.dao;

import java.sql.SQLException;
import java.util.List;

import org.cola.util.db.DBResult;
import org.cola.util.db.DBUtil;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:BaseDao <br/>
 * Date:2014年3月21日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class DaoImpl {
    private DBUtil dbUtil = null;

    private final static int DEFAULT_TIME_OUT = 1000;

    public DaoImpl() {
        dbUtil = new DBUtil();
    }

    public DBResult executeBatch(List<String> sqlList) throws SQLException {
        return dbUtil.executeBatch(sqlList, DEFAULT_TIME_OUT);
    }

    public DBResult executeBatch(List<String> sqlList, int timeOut) throws SQLException {
        return dbUtil.executeBatch(sqlList, timeOut);
    }

    public DBResult executeQuery(String sql) throws SQLException {
        return dbUtil.executeQuery(sql, DEFAULT_TIME_OUT);
    }

    public DBResult executeQuery(String sql, int timeOut) throws SQLException {
        return dbUtil.executeQuery(sql, timeOut);
    }

    public DBResult executeQueryByPage(String sql, int start, int rowCnt)
            throws SQLException {
        if (start < 0 || rowCnt < 0) {
            return dbUtil.executeQuery(sql, DEFAULT_TIME_OUT);
        } else {
            return dbUtil.executeQueryByPage(sql, DEFAULT_TIME_OUT, start,
                    rowCnt);
        }
    }

    public DBResult executeQueryByPage(String sql, int timeOut, int start,
            int rowCnt) throws SQLException {
        if (start < 0 || rowCnt < 0) {
            return dbUtil.executeQuery(sql, timeOut);
        } else {
            return dbUtil.executeQueryByPage(sql, timeOut, start, rowCnt);
        }
    }

    public DBResult executeSql(String sql) throws SQLException {
        return dbUtil.executeSql(sql, DEFAULT_TIME_OUT);
    }

    public DBResult executeSql(String sql, int timeOut) throws SQLException {
        return dbUtil.executeSql(sql, timeOut);
    }
}

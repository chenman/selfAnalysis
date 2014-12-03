package org.cola.util.db;

import java.beans.PropertyVetoException;
import java.sql.SQLException;
import java.util.Iterator;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:DBUtilTest
 * <br/>Date:2014年3月17日
 * @author	ChenMan
 * @version	1.0
 */
public class DBUtilTest {

    public static void main(String[] args) throws PropertyVetoException,
            SQLException {
        DBUtil dbUtil = new DBUtil();

        String sql = "select msisdn 用户号码, user_id 用户编码, to_char(create_time, 'yyyy/mm/dd hh24:mi:ss') 开打日期  from test01 where rownum < 10";
        int timeOut = 300;

        DBResult dbResult = dbUtil.executeQuery(sql, timeOut);
        if (dbResult.iErrorCode == 0) {
            Iterator<String> it = dbResult.titleList.iterator();
            while (it.hasNext()) {
                System.out.print(it.next() + " ");
            }
            System.out.println();
            for (int i = 0; i < dbResult.iRowsCnt; ++i) {
                for (int j = 0; j < dbResult.iColsCnt; ++j) {
                    System.out.print(dbResult.aaRes[i][j] + " ");
                }
                System.out.println();
            }
        }
    }
}

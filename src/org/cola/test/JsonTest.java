package org.cola.test;

import java.sql.SQLException;
import java.util.List;
import java.util.Vector;

import org.cola.dao.DaoImpl;
import org.cola.util.db.DBResult;

import com.alibaba.fastjson.JSON;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:JsonTest
 * <br/>Date:2014年4月1日
 * @author	ChenMan
 * @version	1.0
 */
public class JsonTest {

    public static void main(String[] args) throws SQLException {
        DaoImpl dao = new DaoImpl();
        String sql = "select staff_id, staff_name from cfg_supp_staff_info";
        DBResult result = dao.executeQuery(sql);
        List resultList = new Vector();
        List rowData = null;
        for (int row = 0; row < result.iRowsCnt; row++) {
            rowData = new Vector();

            for (int col = 0; col < result.iColsCnt; col++) {
                rowData.add(result.aaRes[row][col]);
            }
            resultList.add(rowData);
        }
        System.out.println(JSON.toJSONString(resultList));
    }
}


class Staff {
    private String staff_id;
    private String staff_name;
}
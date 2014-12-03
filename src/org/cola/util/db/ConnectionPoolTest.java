package org.cola.util.db;

import java.beans.PropertyVetoException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import java.util.HashMap;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:ConnectionPoolTest
 * <br/>Date:2014年3月17日
 * @author	ChenMan
 * @version	1.0
 */
public class ConnectionPoolTest {

    /**
     * @param args
     * @throws PropertyVetoException
     * @throws SQLException
     */
    public static void main(String[] args) throws PropertyVetoException,
            SQLException {
        ConnectionPool dbPool = ConnectionPool.getConnectionPoolInstance();
        System.out.println("使用连接池................................");
        // for (int i = 0; i < 20; i++) {
        // long beginTime = System.currentTimeMillis();
        Connection conn = dbPool.getConnection();
        try {
            PreparedStatement pstmt = (PreparedStatement) conn
                    .prepareStatement("SELECT * FROM TEST01",
                            ResultSet.TYPE_SCROLL_INSENSITIVE,
                            ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = pstmt.executeQuery();
            ResultSetMetaData rsmd = (ResultSetMetaData) rs.getMetaData();
            HashMap<String, String> hashMap = new HashMap<String, String>();

            int cols = rsmd.getColumnCount();
            for (int j = 1; j <= cols; ++j) {
                String colName = rsmd.getColumnName(j);
                String colType = rsmd.getColumnTypeName(j);
                hashMap.put(colName, colType);

                System.out.println(colName + ":" + colType);
            }
            pstmt.setFetchSize(1000);
            rs.last();
            System.out.println(rs.getRow());
            rs.beforeFirst();
            // while (rs.next()) {
            // for (int j = 1; j <= cols; ++j) {
            // System.out.print(rs.getString(j));
            // }
            //
            // System.out.println();
            // }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        // long endTime = System.currentTimeMillis();
        // System.out.println("访问" + (i + 1) + "次，花费时间:" + (endTime -
        // beginTime));
        // }

        // System.out.println("不适用连接池................................");
        // for (int i = 0; i < 20; i++) {
        // long beginTime = System.currentTimeMillis();
        // OracleDataSource ods = new OracleDataSource();
        // ods.setUser("chenman");
        // ods.setPassword("cm#1985");
        // ods.setURL("jdbc:oracle:thin:@10.51.4.68:1521:getdb");
        // Connection conn = ods.getConnection();
        // try {
        // PreparedStatement pstmt = (PreparedStatement)
        // conn.prepareStatement("SELECT * FROM TEST01");
        // ResultSet rs = pstmt.executeQuery();
        // while (rs.next()) {
        // // do nothing...
        // }
        // } catch (SQLException e) {
        // e.printStackTrace();
        // } finally {
        // try {
        // conn.close();
        // } catch (SQLException e) {
        // e.printStackTrace();
        // }
        // }
        // long endTime = System.currentTimeMillis();
        // System.out.println("访问" + (i + 1) + "次，花费时间:"
        // + (endTime - beginTime));
        // }

    }

}

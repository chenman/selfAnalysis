package org.cola.util.db;

import java.beans.PropertyVetoException;
import java.sql.Connection;
import java.sql.SQLException;

import com.mchange.v2.c3p0.ComboPooledDataSource;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:ConnectionPool <br/>
 * Date:2013年10月17日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class ConnectionPool {
    private String driverClass = "oracle.jdbc.driver.OracleDriver";
    private String dbUrl = "jdbc:oracle:thin:@192.168.152.131:1521:orcl";
    private String user = "chenman";
    private String password = "860307";
//    private String driverClass = "com.mysql.jdbc.Driver";
//    private String dbUrl = "jdbc:mysql://localhost:3306/cola?useUnicode=true&characterEncoding=UTF-8&useOldAliasMetadataBehavior=true";
//    private String user = "cola";
//    private String password = "123456";
    private int maxIdleTime = 60;
    private int maxPoolSize = 80;
    private int minPoolSize = 20;
    private int maxStatements = 60;
    private ComboPooledDataSource cpd;
    
    private static ConnectionPool pool;

    private ConnectionPool() {
        try {
            cpd = new ComboPooledDataSource();
            cpd.setDriverClass(driverClass);
            cpd.setJdbcUrl(dbUrl);
            cpd.setUser(user);
            cpd.setPassword(password);
            cpd.setMaxIdleTime(maxIdleTime);
            cpd.setMaxPoolSize(maxPoolSize);
            cpd.setMinPoolSize(minPoolSize);
            cpd.setMaxStatements(maxStatements);
        } catch (PropertyVetoException e) {
            
        }
    }

    private ConnectionPool(String driverClass, String dbUrl, String user,
            String password) throws PropertyVetoException {
        cpd = new ComboPooledDataSource();
        cpd.setDriverClass(driverClass);
        cpd.setJdbcUrl(dbUrl);
        cpd.setUser(user);
        cpd.setPassword(password);
        cpd.setMaxIdleTime(maxIdleTime);
        cpd.setMaxPoolSize(maxPoolSize);
        cpd.setMinPoolSize(minPoolSize);
    }
    
    public static ConnectionPool getConnectionPoolInstance () {
        if (pool == null) {
            pool = new ConnectionPool();
        }
        return pool;
    }

    public synchronized Connection getConnection() throws SQLException {
        Connection conn = null;
        try {
            conn = cpd.getConnection();

        } catch (Exception ex) {
            throw new SQLException(ex.getMessage());
        }
        return conn;
    }
}
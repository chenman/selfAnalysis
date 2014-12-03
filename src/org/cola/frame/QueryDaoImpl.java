package org.cola.frame;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.cola.dao.DaoImpl;
import org.cola.util.db.DBResult;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:QueryMgtProvider <br/>
 * Date:2014年3月26日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class QueryDaoImpl extends DaoImpl implements QueryDao {

    protected static Map queryMgtPool = new HashMap();

    public Object getQueryMgtInstance(String privId)
            throws InstantiationException, IllegalAccessException,
            ClassNotFoundException, SQLException {
        DBResult result = executeQuery("select class_name from qr_query_conf where priv_id = "
                + privId);
        if (result.iRowsCnt > 0) {
            String className = result.aaRes[0][0];

            synchronized (this) {
                if (!queryMgtPool.containsKey(privId)) {
                    Class queryMgt = getClass(className);
                    queryMgtPool.put(privId, queryMgt);
                    return queryMgt.newInstance();
                } else {
                    Class queryMgt = (Class)queryMgtPool.get(privId);
                    return queryMgt.newInstance();
                }
            }
        } else {
            return null;
        }
    }

    protected Class getClass(String className) {
        ClassLoader classLoader = Thread.currentThread()
                .getContextClassLoader();

        if (classLoader == null) {
            classLoader = super.getClass().getClassLoader();
        }
        try {
            return classLoader.loadClass(className);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}

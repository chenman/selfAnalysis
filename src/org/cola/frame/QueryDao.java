package org.cola.frame;

import java.sql.SQLException;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:QueryDao <br/>
 * Date:2014年3月26日
 * 
 * @author ChenMan
 * @version 1.0
 */
public interface QueryDao {
    public Object getQueryMgtInstance(String privId)
            throws InstantiationException, IllegalAccessException,
            ClassNotFoundException, SQLException;
}

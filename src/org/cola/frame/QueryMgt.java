package org.cola.frame;

import java.sql.SQLException;
import java.util.Map;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:QueryReportMgt
 * <br/>Date:2014年3月26日
 * @author	ChenMan
 * @version	1.0
 */
public interface QueryMgt {

    public abstract Map getData(QueryBean queryBean, ServiceRequest reqObj, String start, String pageCount) throws SQLException, IllegalArgumentException;
}

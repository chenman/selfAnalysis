package org.cola.sa.dao;

import java.sql.SQLException;
import java.util.List;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:SelfAnalysisDao
 * <br/>Date:2014年12月8日
 * @author	ChenMan
 * @version	1.0
 */
public interface SelfAnalysisDao {
	public abstract List queryFrameList() throws SQLException;
	public abstract List queryAttrClassList() throws SQLException;
}

package org.cola.sa;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.cola.sa.bean.AttrBean;
import org.cola.sa.bean.QryAttrBean;

import com.alibaba.fastjson.JSON;
import org.cola.sa.dao.SelfAnalysisDao;
import org.cola.sa.dao.SelfAnalysisDaoImpl;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:SelfAnalysisClient <br/>
 * Date:2014年12月8日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class SelfAnalysisClient {

	SelfAnalysisDao dao = new SelfAnalysisDaoImpl();

	public String queryAttrList(QryAttrBean qryBean) {
		List<AttrBean> list = new ArrayList<AttrBean>();
		AttrBean bean = new AttrBean();
		list.add(bean);
		return JSON.toJSONString(list);
	}

	public List queryFrameList() {
		List list = null;
		try {
			list = dao.queryFrameList();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}

	public List queryAttrClassList() {
		List list = null;
		try {
			list = dao.queryAttrClassList();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}
}

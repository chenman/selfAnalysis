package org.cola.sa;

import java.util.ArrayList;
import java.util.List;

import org.cola.sa.bean.AttrClassBean;
import org.cola.sa.bean.AttrBean;
import org.cola.sa.bean.FrameBean;
import org.cola.sa.bean.QryAttrBean;

import com.alibaba.fastjson.JSON;

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

	public String queryAttrList(QryAttrBean qryBean) {
		List<AttrBean> list = new ArrayList<AttrBean>();
		AttrBean bean = new AttrBean();
		list.add(bean);
		return JSON.toJSONString(list);
	}

	public String queryFrameList() {
		List<FrameBean> list = new ArrayList<FrameBean>();

		return JSON.toJSONString(list);
	}

	public String getAttrClassList(String frameId) {
		List<AttrClassBean> list = new ArrayList<AttrClassBean>();

		return JSON.toJSONString(list);
	}
}

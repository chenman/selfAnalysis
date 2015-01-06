package org.cola.sa.dao;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.cola.dao.DaoImpl;
import org.cola.sa.bean.AttrClassBean;
import org.cola.sa.bean.FrameBean;
import org.cola.util.db.DBResult;

public class SelfAnalysisDaoImpl extends DaoImpl implements SelfAnalysisDao {
	public List queryAttrList () {

		return null;
	}

	public List<FrameBean> queryFrameList() throws SQLException {
		StringBuffer sb = new StringBuffer();
		sb.append("select frame_id, frame_name from sa_cfg_frame");
		DBResult result = executeSql(sb.toString());
		List<FrameBean> list = new ArrayList<FrameBean>();
		for (int i = 0; i < result.iTotalCnt; i++) {
			FrameBean bean = new FrameBean();
			bean.setFrameId(result.aaRes[i][0]);
			bean.setFrameName(result.aaRes[i][1]);
			list.add(bean);
		}
		return list;
	}

	public List<AttrClassBean> queryAttrClassList() throws SQLException {
		StringBuffer sb = new StringBuffer();
		sb.append("select frame_id, attr_class_id, attr_class_name from sa_cfg_attr_class");
		DBResult result = executeSql(sb.toString());
		List<AttrClassBean>  list = new ArrayList<AttrClassBean>();
		for (int i = 0; i < result.iTotalCnt; i++) {
			AttrClassBean bean = new AttrClassBean();
			bean.setFrameId(result.aaRes[i][0]);
			bean.setAttrClassId(result.aaRes[i][1]);
			bean.setAttrClassName(result.aaRes[i][2]);
			list.add(bean);
		}
		return list;
	}
}

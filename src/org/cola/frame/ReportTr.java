package org.cola.frame;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;

import org.cola.bean.UserInfoBean;
import org.cola.util.common.Constants;
import org.cola.util.common.ExportUtil;
import org.cola.util.common.JsfUtil;
import org.cola.util.common.JxlUtil;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:ReportTr <br/>
 * Date:2014年3月25日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class ReportTr {
    public Map queryProcessReport(String privId, QueryBean reqBean,
            String start, String pageCount) throws InstantiationException,
            IllegalAccessException, ClassNotFoundException, SQLException {

        ServiceRequest reqObj = new ServiceRequest();
        reqObj.setUserInfoBean((UserInfoBean) JsfUtil
                .getSessionAttr("userInfoBean"));

        QueryDao queryDao = new QueryDaoImpl();

        QueryMgt queryMgt = (QueryMgt) queryDao.getQueryMgtInstance(privId);

        return queryMgt.getData(reqBean, reqObj, start, pageCount);
    }

    public Map queryExcelReport(String privId, QueryBean reqBean,
            HttpServletResponse response) throws InstantiationException,
            IllegalAccessException, ClassNotFoundException, SQLException, IOException, RowsExceededException, WriteException {
        ServiceRequest reqObj = new ServiceRequest();
        reqObj.setUserInfoBean((UserInfoBean) JsfUtil
                .getSessionAttr("userInfoBean"));

        QueryDao queryDao = new QueryDaoImpl();
        QueryMgt queryMgt = (QueryMgt) queryDao.getQueryMgtInstance(privId);
        Map map = queryMgt.getData(reqBean, reqObj, "-1", "-1");
        List list = (List) map.get(Constants.DATA_LIST);
        if (list.size() < 1) {
            ServletOutputStream out = response.getOutputStream();
            response.setContentType("text/html; charset=UTF-8");
            out.println("<script>alert('查询内容为空！')</script>");
        } else {
            String fileName = ExportUtil.createFileName();
            JxlUtil.exportExcel(list, fileName, response);
        }
        return map;
    }
}

package org.cola.frame;

import java.io.Serializable;
import java.util.List;
import java.util.Vector;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:BaseBean
 * <br/>Date:2014年3月26日
 * @author	ChenMan
 * @version	1.0
 */
public class QueryBean implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private String start = null;
    
    private String pageCnt = null;
    
    private String rowCnt = null;
    
    private String srilId = null;
    
    private String isExport = null;
    
    private List rowList = null;

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getPageCnt() {
        return pageCnt;
    }

    public void setPageCnt(String pageCnt) {
        this.pageCnt = pageCnt;
    }

    public String getRowCnt() {
        return rowCnt;
    }

    public void setRowCnt(String rowCnt) {
        this.rowCnt = rowCnt;
    }

    public String getSrilId() {
        return srilId;
    }

    public void setSrilId(String srilId) {
        this.srilId = srilId;
    }

    public String getIsExport() {
        return isExport;
    }

    public void setIsExport(String isExport) {
        this.isExport = isExport;
    }

    public List getRowList() {
        return rowList;
    }

    public void setRowList(List rowList) {
        this.rowList = rowList;
    }
    
}

package org.cola.util.common;

import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:ExportUtil
 * <br/>Date:2014年3月31日
 * @author	ChenMan
 * @version	1.0
 */
public class ExportUtil {
    
    private static DateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
    private static int seq = 1000;
    public static synchronized String createFileName () {
        if (seq >  9999) {
            seq = 1000;
        }
        return "报表" + format.format(new Date(System.currentTimeMillis())) + (seq++);
    }
}

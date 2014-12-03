package org.cola.util.common;

import java.io.UnsupportedEncodingException;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:StringEncode
 * <br/>Date:2014年3月24日
 * @author	ChenMan
 * @version	1.0
 */
public class StringEncode {

    /**
     * @param string
     * @return
     */
    public static String jsToJspEncode(String string) {
        String returnValue =  null;
        try {
            returnValue = new String(string.getBytes("UTF8"));
          } catch (UnsupportedEncodingException e) {
            System.out.println("转码失败");
          }
        return returnValue;
    }
    
}

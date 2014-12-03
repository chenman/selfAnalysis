package org.cola.util.common;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:Function <br/>
 * Date:2014年3月24日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class Function {

    public static String getParameterValue(Map map, String key) {
        Object obj = map.get(key);
        if (obj != null) {
            if (obj instanceof String) {
                return StringEncode.jsToJspEncode(obj.toString());
            }
            String[] paramValue = (String[]) obj;
            String returnValue = "";
            for (int i = 0; i < paramValue.length; ++i) {
                if ((i == 0) || (equalsNull(returnValue))) {
                    returnValue = StringEncode.jsToJspEncode(paramValue[i]);
                } else {
                    returnValue = returnValue + ","
                            + StringEncode.jsToJspEncode(paramValue[i]);
                }
            }
            return returnValue;
        }
        return null;
    }

    /**
     * @param returnValue
     * @return
     */
    public static boolean equalsNull(Object value) {
        return ((value == null) || (value.toString().equals("null")) || (value
                .toString().equals("")));
    }

    public static Object setBeanProperty(Map<Object, Object> valueMap,
            Object beanObj) throws IllegalAccessException,
            InvocationTargetException {
        Field[] allFields = beanObj.getClass().getDeclaredFields();

        for (int i = 0; i < allFields.length; ++i) {
            String fieldName = allFields[i].getName();
            if (fieldName.equals("serialVersionUID")) {
                continue;
            }

            String propertyValue = getParameterValue(valueMap, fieldName);
            if (!(equalsNull(propertyValue))) {
                BeanUtils.setProperty(beanObj, fieldName, propertyValue);
            }
        }
        return beanObj;
    }
}

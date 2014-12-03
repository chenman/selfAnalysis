package org.cola.manage;

import org.cola.bean.UserInfoBean;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:UserLoginMgt
 * <br/>Date:2014年3月21日
 * @author	ChenMan
 * @version	1.0
 */
public interface UserMgt {
    public UserInfoBean findUserById(String userId);
}

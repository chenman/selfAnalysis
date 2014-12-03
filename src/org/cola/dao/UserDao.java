package org.cola.dao;

import java.sql.SQLException;

import org.cola.bean.UserInfoBean;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:UserDao
 * <br/>Date:2014年3月21日
 * @author	ChenMan
 * @version	1.0
 */
public interface UserDao {
    public UserInfoBean findUserById (String userId) throws SQLException;
    
    public boolean updateUserPasswd(String userId, String newPasswd) throws SQLException;
}

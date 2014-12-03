package org.cola.manage;

import java.sql.SQLException;

import org.cola.bean.UserInfoBean;
import org.cola.dao.UserDao;
import org.cola.dao.UserDaoImpl;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:UserMgtImpl
 * <br/>Date:2014年3月21日
 * @author	ChenMan
 * @version	1.0
 */
public class UserMgtImpl implements UserMgt {
    
    private UserDao userDao = new UserDaoImpl();

    /* (non-Javadoc)
     * @see org.cola.manage.UserMgt#findUserById(java.lang.String)
     */
    public UserInfoBean findUserById(String userId) {
        try {
            return userDao.findUserById(userId);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    
}

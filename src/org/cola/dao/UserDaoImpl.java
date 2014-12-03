package org.cola.dao;

import java.sql.SQLException;

import org.cola.bean.UserInfoBean;
import org.cola.util.db.DBResult;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:UserDaoImpl <br/>
 * Date:2014年3月21日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class UserDaoImpl extends DaoImpl implements UserDao {

    /*
     * (non-Javadoc)
     * 
     * @see org.cola.dao.UserDao#findUserById(java.lang.String)
     */
    public UserInfoBean findUserById(String userId) throws SQLException {
        UserInfoBean infoBean = null;
        DBResult result = executeQuery("select staff_id, staff_name, staff_type, passwd, org_id from CFG_SUPP_STAFF_INFO where staff_id = "
                + userId);
        if (result.iRowsCnt > 0) {
            infoBean = new UserInfoBean();
            infoBean.setUserId(userId);
            infoBean.setUserName(result.aaRes[0][1]);
            infoBean.setUserType(result.aaRes[0][2]);
            infoBean.setPassword(result.aaRes[0][3]);
            infoBean.setOrgId(result.aaRes[0][4]);
        }
        return infoBean;
    }
    
    public boolean updateUserPasswd (String userId, String newPasswd) throws SQLException {
        StringBuffer sb = new StringBuffer();
        sb.append("update cfg_supp_staff_info set passwd = '" + newPasswd + "' where staff_id = " + userId);
        DBResult result = executeSql(sb.toString());
        return (result.iErrorCode == 0) ? true : false;
    }

}

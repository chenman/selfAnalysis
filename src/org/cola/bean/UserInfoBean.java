package org.cola.bean;

import java.io.Serializable;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:UserInfoBean
 * <br/>Date:2014年3月20日
 * @author	ChenMan
 * @version	1.0
 */
public class UserInfoBean implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    private String userId = null;

    private String userName = null;
    
    private String userType = null;
    
    private String orgId = null;
    
    private String orgName = null;
    
    private String password = null;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
}

package org.cola.frame;

import org.cola.bean.UserInfoBean;

/**
 * Description:
 * <br/>Copyright (C), 2001-2014, Jason Chan
 * <br/>This program is protected by copyright laws.
 * <br/>Program Name:ServiceRequest
 * <br/>Date:2014年3月26日
 * @author	ChenMan
 * @version	1.0
 */
public class ServiceRequest {
    private UserInfoBean userInfoBean;

    public UserInfoBean getUserInfoBean() {
        return userInfoBean;
    }

    public void setUserInfoBean(UserInfoBean userInfoBean) {
        this.userInfoBean = userInfoBean;
    }
    
    public String getUserId () {
        return this.userInfoBean.getUserId();
    }
}

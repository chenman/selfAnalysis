package org.cola.bean;

import java.io.Serializable;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpSession;

import org.cola.manage.UserMgt;
import org.cola.manage.UserMgtImpl;
import org.cola.util.common.JsfUtil;
import org.cola.util.common.MD5Util;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:UserLoginBean <br/>
 * Date:2014年3月17日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class UserLoginBean implements Serializable {

    private UserMgt userMgt = null;

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private String userId = null;

    private String userName = null;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String doLoginEvent() {
        HttpSession session = (HttpSession) FacesContext.getCurrentInstance()
                .getExternalContext().getSession(true);
        userMgt = new UserMgtImpl();
        UserInfoBean userInfoBean = userMgt.findUserById(userId);
        if (null == userInfoBean) {
            JsfUtil.addMessage((UIComponent)null, "用户名错误", "用户ID"+ userId + "不存在！");
            return "fail";
        } else if (!MD5Util.md5Encode(password).equals(
                userInfoBean.getPassword().toUpperCase())) {
            JsfUtil.addMessage((UIComponent)null, "用户密码错误", "用户密码错误！");
            return "fail";
        } else {
            session.setAttribute("userInfoBean", userInfoBean);
            return "success";
        }
    }
    
}

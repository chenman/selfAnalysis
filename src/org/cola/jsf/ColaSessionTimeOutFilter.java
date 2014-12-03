package org.cola.jsf;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.cola.bean.UserInfoBean;

/**
 * Description: <br/>
 * Copyright (C), 2001-2014, Jason Chan <br/>
 * This program is protected by copyright laws. <br/>
 * Program Name:ColaSessionTimeOutFilter <br/>
 * Date:2014年3月17日
 * 
 * @author ChenMan
 * @version 1.0
 */
public class ColaSessionTimeOutFilter implements Filter {

    /*
     * (non-Javadoc)
     * 
     * @see javax.servlet.Filter#destroy()
     */
    public void destroy() {

    }

    /*
     * (non-Javadoc)
     * 
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest,
     * javax.servlet.ServletResponse, javax.servlet.FilterChain)
     */
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException {
        String urlName = ((HttpServletRequest) request).getRequestURI()
                .toUpperCase();

        if (urlName.indexOf("LOGIN.JSP") != -1
                || urlName.indexOf("LOGIN.JSF") != -1
                || doSessionFilter((HttpServletRequest) request,
                        (HttpServletResponse) response)) {
            chain.doFilter(request, response);
        }
    }

    /*
     * (non-Javadoc)
     * 
     * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
     */
    public void init(FilterConfig fc) throws ServletException {

    }

    private boolean doSessionFilter(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(true);
        UserInfoBean userInfo = (UserInfoBean) session
                .getAttribute("userInfoBean");

        if (null == userInfo) {
            String errMsg = "Session超时，请重新登录！";
            request.getSession().setAttribute("errMsg", errMsg);
            response.sendRedirect(request.getContextPath() + "/login.jsf");
            return false;
        }

        return true;
    }

}

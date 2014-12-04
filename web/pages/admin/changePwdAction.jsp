<%
    /**
     * @title 绩效互评
     * @Description: 
     * @author 
     * @version 1.0.0
     * @since 2014-03-24
     * @history 1.0.0 2014-03-24 created by chenm
     */
%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.List"%>
<%@ page import="org.cola.admin.bean.UserPwdBean"%>
<%@ page import="org.cola.util.common.Function"%>
<%@ page import="org.cola.frame.ReportTr"%>
<%@ page import="com.alibaba.fastjson.JSON" %>

<%
    // 分页参数
    String start = "1";// 开始行
    String page_count = "20";// 每页条数
    String row_count = "0";// 总记录数

    // 请求Bean--参数
    Map requestMap = request.getParameterMap();
    UserPwdBean bean = new UserPwdBean();
    Function.setBeanProperty(requestMap, bean);

    // 设置属性
    ReportTr mgmt = new ReportTr();        
    Map map = mgmt.queryProcessReport("10000001", bean, start, page_count);
    if (map != null) {
    	String[] return_str = ((String) map.get("other_flag")).split("\\|");
        String result_code = return_str[0];
        String error_msg = return_str[1];
        
        if(result_code.equals("0")){
            out.println("<script type='text/javascript' language='javaScript'>");
            out.print("alert('密码修改成功！');");
            out.print("</script>");                     
        }else {
            out.println("<script type='text/javascript' language='javaScript'>");
            out.print("alert('密码修改失败，错误信息：" + error_msg + "');");
            out.print("</script>"); 
        }
    }
%>

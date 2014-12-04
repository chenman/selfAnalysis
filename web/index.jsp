<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ page import="org.cola.bean.UserInfoBean"%>
<%
    String path = request.getContextPath();
	UserInfoBean userInfo = (UserInfoBean) session
			.getAttribute("userInfoBean");
    if (userInfo == null) {
        response.sendRedirect("login.jsf");
        return;
    }
    String userName = userInfo.getUserName();
%>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>E-START绩效管理系统</title>
<link href="css/head.css" rel="stylesheet" type="text/css" />
<link href="css/nav.css" rel="stylesheet" type="text/css" />
<link href="css/themes/default/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="js/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="js/nav.js"></script>
<script type="text/javascript">
    var _menus = [ {
        "menuid" : "10",
        "menuname" : "系統管理",
        "menus" : [ {
            "menuid" : "1001",
            "menuname" : "更改密码",
            "url" : "pages/admin/changePwdView.jsf"
        }
//         , {
//             "menuid" : "1002",
//             "menuname" : "权限管理",
//             "url" : "#"
//         }, {
//             "menuid" : "1003",
//             "menuname" : "用户管理",
//             "url" : "#"
//         }
        ]
    }, {
        "menuid" : "11",
        "menuname" : "自助分析平台",
        "menus" : [ {
            "menuid" : "1101",
            "menuname" : "自助取数",
            "url" : "pages/bonus/cfgBonusBatchView.jsf"
//             "url" : "pages/bonus/cfgBonusView.jsf"
        }, {
            "menuid" : "1102",
            "menuname" : "分析日志",
            "url" : "pages/bonus/qryBonusView.jsf"
        }]
    } ];
    
    function init() {
        $('.icon-logout').attr('href','javascript:void(0);');
        $('.icon_logout').click(doLogout);
    }
    
    function doLogout(){
    	$.messager.confirm('确认', '确定要注销系统吗?', function(r){
    		if (r){
    			window.location.href = 'logout.jsf';
    		}
    	});
    }
    
</script>
<style>
#css3menu li {
    float: left;
    list-style-type: none;
}

#css3menu li a {
    color: #fff;
    padding-right: 20px;
}

#css3menu li a.active {
    color: yellow;
}
</style>
</head>
<body class="easyui-layout" onload="init()">
    <div data-options="region:'north',border:false" class="header">
        <i class="logo"></i>
        <i class="sysname"></i>
        <i class="welcome">欢迎您：<%=userName%></i>
        <a class="icon_logout" title="注销" ></a>
    </div>
    <div data-options="region:'west',split:true,title:'导航菜单'"
        style="width: 150px; padding: 0px;">
        <div id="wnav" class="easyui-accordion" fit="true" border="false">
        </div>
    </div>
    <div data-options="region:'center'">
        <div id="tabs" class="easyui-tabs" fit="true" border="false"></div>
    </div>
    <div data-options="region:'south',split:true" style="height: 32px;">
        <div align="center">Copyright：支撑中心运营管理室 使用反馈：13850263232@139.com</div>
    </div>

    <div id="mm" class="easyui-menu" style="width: 150px;">
        <div id="mm-tabupdate" data-options="iconCls:'icon-arrow_refresh'">刷新</div>
        <div id="mm-tabclose">关闭</div>
        <div id="mm-tabcloseall">全部关闭</div>
        <div id="mm-tabcloseother">除此之外全部关闭</div>
        <div class="menu-sep"></div>
        <div id="mm-tabcloseright">当前页右侧全部关闭</div>
        <div id="mm-tabcloseleft">当前页左侧全部关闭</div>
        <div class="menu-sep"></div>
        <div id="mm-exit">退出</div>
    </div>
</body>
</html>

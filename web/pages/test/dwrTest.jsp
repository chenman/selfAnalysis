<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
%>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>自助分析</title>
<link href="<%=path%>/css/css.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="<%=path%>/js/jquery.min.js"></script>
<script type='text/javascript' src='/selfAnalysis/dwr/interface/SelfAnalysisClient.js'></script>
<script type='text/javascript' src='/selfAnalysis/dwr/engine.js'></script>
<script type='text/javascript' src='/selfAnalysis/dwr/util.js'></script>
<script type="text/javascript">
	// 	function showUserInfo() {
	// 		SelfAnalysisClient.getUserInfo(function(userInfo) {
	// 			alert(userInfo);
	// 		});
	// 	}
	// 	showUserInfo();

	function checkLogin() {
		var userInfo = {
			userName : $("#userName").val(),
			passwd : $("#passwd").val()
		};
		SelfAnalysisClient.login(userInfo, function(data) {
			alert(data)
			if (data == true) {
				alert("登陆成功！");
			} else {
				alert("登陆失败！");
			}
		});
	}
</script>
</head>
<body>
    <form>
        <table>
            <td style="font-family: 宋体, simsun;">用户名：<input id="userName" type="text">
            </td>
            <td style="font-family: 宋体, simsun;">密&nbsp;&nbsp;码：</font><input id="passwd" type="password">
            </td>
            <td><input type="submit" onclick="checkLogin()" value="登录"></td>
        </table>
    </form>
</body>

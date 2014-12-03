<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Cache-Control" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<title>登录界面</title>
<script type="text/javascript" src="js/jquery.min.js"></script>
<link href="css/login.css" rel="stylesheet" type="text/css" />

<script language="javascript" type="text/javascript">
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };

    var code; //在全局 定义验证码  
    function createCode() {
        code = "";
        var codeLength = 4;//验证码的长度  
        var checkCode = document.getElementById("checkCode");
        var selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C',
            'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//所有候选组成验证码的字符，当然也可以用中文的  

        for (var i = 0; i < codeLength; i++) {
            var charIndex = Math.floor(Math.random() * 36);
            code += selectChar[charIndex];

        }
        if (checkCode) {
            checkCode.className = "code";
            checkCode.value = code;
        }

    }

    function validate() {
        var userId = $("#loginForm\\:userId").val();
        var password = $("#loginForm\\:password").val();
        var inputCode = $("#inputCode").val();

        if (userId.trim().length <= 0 || isNaN(userId.trim())) {
            alert("请输入用户名，且为数字类型！");
            $("#loginForm\\:userId").focus();
            return false;
        }

        if (password.trim().length <= 0) {
            alert("请输入用户密码！");
            $("#loginForm\\:password").focus();
            return false;
        }

        if (inputCode.length <= 0) {
            alert("请输入验证码！");
            $("#inputCode").focus();
            return false;
        } else if (inputCode.toUpperCase() != code) {
            alert("验证码输入错误！");
            createCode();//刷新验证码  
            $("#inputCode").focus();
            return false;
        } else {
            return true;
        }
    }

    function resetInput() {
        $("#loginForm\\:userId").val("");
        $("#loginForm\\:password").val("");
        $("#inputCode").val("");
    }
</script>

</head>
<body onload="createCode()">
    <div id="login" class="login">
        <f:view>
            <h:form id="loginForm" styleClass="login_form">
                <table align="center">
                    <tr>
                        <td style="font-family: 宋体, simsun;">用户名:</td>
                        <td><h:inputText styleClass="login_input"
                                id="userId" value="#{loginBean.userId}"
                                tabindex="1" required="true" /></td>
                    </tr>
                    <tr>
                        <td style="font-family: 宋体, simsun;">密&nbsp;&nbsp;码:</td>
                        <td><h:inputSecret styleClass="login_input"
                                id="password" value="#{loginBean.password}"
                                tabindex="2" required="true" /></td>
                    </tr>
                    <tr>
                        <td style="font-family: 宋体, simsun;">验证码:</td>
                        <td><input class="login_input" type="text"
                            id="inputCode" name="inputCode" style="width: 68px"
                            tabindex="3" /> <input class="login_input"
                            type="text" id="checkCode" name="checkCode"
                            style="width: 50px" readonly="readonly"
                            onclick="createCode()" /></td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center"><h:commandButton
                                id="loginBtn" styleClass="login_btn" value="登录"
                                action="#{loginBean.doLoginEvent}" tabindex="4"
                                onclick="return validate();" /> <input
                            class="login_btn" type="button" id="resetBtn"
                            onclick="resetInput()" value="重置" tabindex="5">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center"><h:messages
                                styleClass="message" /></td>
                    </tr>
                </table>
            </h:form>
        </f:view>
    </div>
</body>
</html>

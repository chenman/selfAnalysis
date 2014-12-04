<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>修改密码</title>
<link href="<%=path%>/css/css.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="<%=path%>/js/jquery.min.js"></script>
<script>
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };
    
    function checkInput() {
        var old_pwd = $("#edit_old_pwd").val();
        var new_pwd = $("#edit_new_pwd").val();
        var pwd_confirm = $("#new_pwd_confirm").val();
        if (old_pwd.trim().length <= 0) {
            alert("请输入旧密码！");
            $("#edit_old_pwd").focus();
            return false;
        }
        if (new_pwd.trim().length <= 0) {
            alert("请输入新密码！");
            $("#edit_new_pwd").focus();
            return false;
        }
        if (pwd_confirm.trim().length <= 0) {
            alert("请输入新密码确认！");
            $("#new_pwd_confirm").focus();
            return false;
        }
        if (pwd_confirm.trim() != new_pwd.trim()) {
            alert("新密码两次输入不一致！");
            $("#new_pwd").focus();
            return false;
        }
        return true;
    }
    
    function editContent() {
        if (checkInput()) {
            editForm.submit();
        }
    }
</script>
</head>
<body>
    <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0"
        align="center">
        <form id="editForm" action="changePwdAction.jsf" method="post"
            target="editIframe">
            <input type="hidden" id="oper_type" name="oper_type" />
            <tr>
                <td class="down_bg8" height="24"><table width="100%"
                        height="24" border="0" cellpadding="0" cellspacing="0"
                        background="<%=path%>/images/table_title_bg3.gif">
                        <tr>
                            <td width="3%"><div align="center">
                                    <img src="<%=path%>/images/arrow_green.gif">
                                </div></td>
                            <td align="left">编辑区</td>
                        </tr>
                    </table></td>
            </tr>
        <tr>
            <td height="10%" class="down_bg8">
                <table id="InfoPage1" width="100%">
                    <tr>
                        <td width="45%" align="right">原密码:</td>
                        <td width="55%" align="left"><input
                            id="edit_old_pwd" name="edit_old_pwd" value=""
                            style="width: 150px" type="password" /></td>
                    </tr>
                    <tr>
                        <td width="45%" align="right">新密码:</td>
                        <td width="55%" align="left"><input
                            id="edit_new_pwd" name="edit_new_pwd"
                            style="width: 150px" type="password"></input></td>
                    </tr>
                    <tr>
                        <td width="45%" align="right">新密码确认:</td>
                        <td width="55%" align="left"><input
                            id="new_pwd_confirm" name="new_pwd_confirm"
                            style="width: 150px" type="password"></input></td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center"><table>
                                <tr>
                                    <td><input id="edit" class="td_Input"
                                        type="button"
                                        style="cursor: hand; width: 50px;"
                                        onClick="editContent();" value="更新" /></td>
                                    <td><input id="cancel" class="td_Input"
                                        name="cancel" style="cursor: hand; width: 50px"
                                        type="reset" value="取消" /></td>
                                </tr>
                            </table></td>
                    </tr>
                </table>
            </td>
            <iframe src="" width="0" height="0" frameborder="0"
                name="editIframe"></iframe>
        </tr>
        </form>
    </table>

</body>
</html>
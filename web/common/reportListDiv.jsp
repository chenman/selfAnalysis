<%@ page language="java" pageEncoding="UTF-8"%>
<input type="hidden" id="select_column" name="select_column">
<input type="hidden" id="select_show_column" name="select_show_column">
<input type="hidden" id="group_column" name="group_column">
<input type="hidden" id="isRollUp" name="isRollUp">
<input type="hidden" id="selectShowColumn" name="selectShowColumn" value="">
<input type="hidden" id="isExport" name="isExport">
<input type="hidden" id="export_type" name="export_type" value="0">

<!-- 查询列表的divs -->
<input type="hidden" id="menu_id" name="menu_id" value="999999">   
<input type="hidden" id="srl_id" name="srl_id" value="">   
<input type="hidden" id="selected_ctl_value" name="selected_ctl_value" value="">
<input type="hidden" id="selected_page_value" name="selected_page_value" value="">
<input type="hidden" id="title_num" name="title_num" value="">
<input type="hidden" name="rowCount" value="">
<input type="hidden" id="rpt_priv_id" name="rpt_priv_id" value="">
<input type="hidden" id="export_style" name="export_style" value="">

<tr id="infoPageTr" style="display:none">
    <td height="100%" valign="top"><iframe src="<%=iframPage%>"
            id="infoPage" name="infoPage" width="100%" marginwidth="0"
            height="100%" marginheight="0" scrolling="Yes" frameborder="0"
            valign="middle" resize="no"></iframe></td>
</tr>
<%
    String isPage="";
    if (isPage != null && isPage.equals("false")) {
			} else {
%>
<script>
    function search_result(start) {
        try {
            if (document.all.is_page_submit != null) {
                document.all.is_page_submit.value = "true";
            }
            if (start != null) {
                document.all.start.value = start;
            } else {
                document.all.start.value = 1;
                document.all.totalnum.value = "";
            }
            var pc = document.getElementById('PageCount').value;
            var url = document.searchSubmit.action;
            if (url.indexOf("?") >= 0) {
                url = url.split("?")[0] + "?pc=" + pc + "&PageCount=" + pc
                    + "&pageCount=" + pc;
            } else {
                url = url + "?pc=" + pc + "&PageCount=" + pc + "&pageCount="
                    + pc;
            }
            document.searchSubmit.action = url;
            document.all.pageid1.innerHTML = '';
            document.all.pageid2.innerHTML = '';
            $("issubmit").value = "submit";
            if (document.getElementById("isExport") != null) {
                document.getElementById("isExport").value = "false";
            }
            document.searchSubmit.target = "infoPage";
            document.searchSubmit.submit();
        } catch (e) {
            alert("search_result exception:" + e.description);
        }
    }
</script>
<input type="hidden" name="is_page_submit" value="false">
<tr id="infoPageTrPg" style="display: none" height="35" valign="top"
    align="center">
    <td class="down_bg8"><table align="center">
            <tr>
                <td height="28" id="pageid1" class="text-12" align="right"></td>
                <td id="pageid2"></td>
            </tr>
        </table></td>
</tr>
<%
    }
%>
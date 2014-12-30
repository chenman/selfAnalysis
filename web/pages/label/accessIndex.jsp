<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>自助分析</title>
<link href="<%=path%>/css/main.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="<%=path%>/js/jquery.min.js"></script>
<script type='text/javascript' src='/selfAnalysis/dwr/interface/SelfAnalysisClient.js'></script>
<script type='text/javascript' src='/selfAnalysis/dwr/engine.js'></script>
<script type='text/javascript' src='/selfAnalysis/dwr/util.js'></script>
<script type="text/javascript">
	var divHeight = ($(window).height() - 110) + "px";
	var save_type = "add";

	$(function() {
		$("#seleDiv,#desiDiv,#saveDiv,#execDiv,#showDiv").css('height',
				divHeight);
		$("#navTable img").css('cursor', 'pointer');
		if (save_type == 'add') {
			sele();
		}
	});

	function sele() {
		clearImg();
		$("#seleImg").unbind("click");
		$("#seleImg").attr("src", "<%=path%>/images/01_Org.png");
		showDiv($("#seleDiv"));

		$("#laststep").attr("disabled", "disabled");
		$("#nextstep").attr("disabled", "");
		$("#nextstep").click(function() {
			// alert("hello");
			if (seleIframe.addSelectedToTree()) {
				desi();
			}
		});
		$("#execstep").css("display", "none");
	}

	function desi() {
		clearImg();
		$("#desiImg").unbind("click");
		$("#desiImg").attr("src", "<%=path%>/images/02_Org.png");
		showDiv($("#desiDiv"));

		$("#laststep").attr("disabled", "").unbind("click").bind("click", sele);
		$("#nextstep").attr("disabled", "").unbind("click").bind("click", save);
		$("#execstep").css("display", "none");
	}

	function save() {
		if (!saveIframe.saveCheck()) {
			return;
		}
		clearImg();
		$("#saveImg").unbind("click");
		$("#saveImg").attr("src", "<%=path%>/images/03_Org.png");
		showDiv($("#saveDiv"));

		$("#laststep").attr("disabled", "").unbind("click").bind("click", desi);
		$("#nextstep").attr("disabled", "").unbind("click").bind("click",
				function() {
					if (saveIframe.confirmCheck()) {
						exec();
					}
				});
		$("#execstep").css("display", "none");
	}

	function exec() {
		clearImg();
		$("#execImg").unbind("click");
		$("#execImg").attr("src", "<%=path%>/images/04_Org.png");
		showDiv($("#execDiv"));
	}

	function show() {
		clearImg();
		$("#showImg").unbind("click");
		$("#showImg").attr("src", "<%=path%>/images/05_Org.png");
		showDiv($("#showDiv"));
	}

	function clearImg() {
		// bind前先unbind，解决多次bind导致出现一次触发bind事件函数多次执行的情况。
		$("#seleImg").attr("src", "<%=path%>/images/01_Blue.png").unbind('click').bind(
				'click', sele);
		$("#desiImg").attr("src", "<%=path%>/images/02_Blue.png").unbind('click').bind(
				'click', desi);
		$("#saveImg").attr("src", "<%=path%>/images/03_Blue.png").unbind('click').bind(
				'click', save);
		$("#execImg").attr("src", "<%=path%>/images/04_Blue.png").unbind('click').bind(
				'click', exec);
		$("#showImg").attr("src", "<%=path%>/images/05_Blue.png").unbind('click').bind(
				'click', show);
	}

	function showDiv(obj) {
		$(obj).show().siblings().hide();
	}

	function getSaSource() {
		var SaSource = desiIframe.SaSource;
		return SaSource;
	}
</script>
</head>
<body id="bodyId" class='main_bodybg' style="margin:0; overflow: auto">
    <table height="100%" width="100%" cellSpacing="0" cellPadding="0" align="center" border="0">
        <tr>
            <td height="60px" valign="top" width="100%" align="center">
                <!--导航条start-->
                <table height="100%" cellSpacing="0" cellPadding="0" width="1024" border="0" id="navTable">
                    <tr>
                        <td><img id="seleImg" src="<%=path%>/images/01_Blue.png"></td>
                        <td id="seleTd" class="font_14F">选择元素</td>
                        <td class="arrow_r">&nbsp;</td>
                        <td><img id="desiImg" src="<%=path%>/images/02_Blue.png"></td>
                        <td id="desiTd" class="font_14F">分析设计</td>
                        <td class="arrow_r">&nbsp;</td>
                        <td><img id="saveImg" src="<%=path%>/images/03_Blue.png"></td>
                        <td id="saveTd" class="font_14F">实例保存</td>
                        <td class="arrow_r">&nbsp;</td>
                        <td><img id="execImg" src="<%=path%>/images/04_Blue.png"></td>
                        <td id="execTd" class="font_14F">实例执行</td>
                        <td class="arrow_r">&nbsp;</td>
                        <td><img id="showImg" src="<%=path%>/images/05_Blue.png"></td>
                        <td id="showTd" class="font_14F">结果展现</td>
                    </tr>
                </table> <!--导航条 end -->
            </td>
        </tr>
        <tr>
            <td class="p_50" height="100%" valign="top" align="center">
                <div id="seleDiv" style="display: block">
                    <iframe id="seleIframe" style="overflow: hidden" height="100%" width="100%" src="sele.jsp"
                        frameBorder="0"></iframe>
                </div>
                <div id="desiDiv" style="display: none">
                    <iframe id="desiIframe" style="overflow: hidden" height="100%" width="100%" src="desi.jsp"
                        frameBorder="0"></iframe>
                </div>
                <div id="saveDiv" style="display: none">
                    <iframe id="saveIframe" style="overflow: hidden" height="100%" width="100%" src="save.jsp"
                        frameBorder="0"></iframe>
                </div>
                <div id="execDiv" style="display: none">
                    <iframe id="execIframe" style="overflow: hidden" height="100%" width="100%" src="exec.jsp"
                        frameBorder="0"></iframe>
                </div>
                <div id="showDiv" style="display: none">
                    <iframe id="showIframe" style="overflow: hidden" height="100%" width="100%" src="show.jsp"
                        frameBorder="0"></iframe>
                </div>
            </td>
        </tr>
        <tr height="30px">
            <td align="right">
                <input id="laststep" class="butt_blue" type="button" value="上一步"> 
                <input id="nextstep" class="butt_blue" type="button" value="下一步"> 
                <input id="excustep" class="butt_blue" type="button" value="提交执行" onclick="saveExcuteInfo()" style="display: none">
            </td>
        </tr>
    </table>
    <input id="save_type" type="hidden" value="add">
    <input id="instance_id" type="hidden" value="null">
</body>



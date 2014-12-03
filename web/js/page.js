//颜色选中变化
function SetTR(thisobj) {
    if (typeof (document.all.trobj[0]) != "undefined") {
        for (var i = 0; i < document.all.trobj.length; i++) {
            var stylename = "";
            if (i % 2 == 0)
                stylename = "datasheet-td-normal-b";
            document.all.trobj[i].className = stylename;
        }
    }
    thisobj.className = "tr-bgcolor";
}

function setNoData() {
    document.all.show.innerText = "";
    document.all.nodatetr.style.display = "";
}

// 打印翻页
function show_page_pic(start, rownum, totalnum) {
    if (parseInt(start) > parseInt(totalnum))
        start = 0;
    var V_ImagePathPrefix = "/bi_web/images/";
    if (start <= 0) {
        start = 1;
    }
    if (rownum == 0) {
        alert("记录行数不能为空");
        return;
    }
    document.all.totalnum.value = totalnum;
    var currpage = (start - 1) / rownum * 1 + 1;
    var v_totalpagecount = Math.ceil(totalnum / rownum); // 总页数
    var s1 = '　总计:  <b>' + totalnum + '</b>  条';
    var s2 = '<table  border="0" cellpadding="1" cellspacing="0"><tr> ';
    var v_nowstart = Math.floor(start / (rownum * 10)); // 当前是第二十页的第几页
    if (v_nowstart * 10 + 10 > v_totalpagecount)
        v_endpagecount = v_totalpagecount;
    else
        v_endpagecount = v_nowstart * 10 + 10;
    var t1 = "<img src=\"" + V_ImagePathPrefix
        + "arrow_pre_last.gif\" alt=\"第一页\"  border=\"0\">";
    var t1_d = "<img src=\"" + V_ImagePathPrefix
        + "arrow_pre_last_G.gif\" alt=\"第一页\"  border=\"0\">";
    var t2 = "<img src=\"" + V_ImagePathPrefix
        + "arrow_pre.gif\" alt=\"上一页\" border=\"0\">";
    var t2_d = "<img src=\"" + V_ImagePathPrefix
        + "arrow_pre_G.gif\" alt=\"上一页\" border=\"0\">";
    var t3 = "<img src=\"" + V_ImagePathPrefix
        + "arrow_next.gif\" alt=\"下一页\"  border=\"0\">";
    var t3_d = "<img src=\"" + V_ImagePathPrefix
        + "arrow_next_G.gif\" alt=\"下一页\"  border=\"0\">";
    var t4 = "<img src=\"" + V_ImagePathPrefix
        + "arrow_next_last.gif\" alt=\"最后一页\" border=\"0\">";
    var t4_d = "<img src=\"" + V_ImagePathPrefix
        + "arrow_next_last_G.gif\" alt=\"最后一页\" border=\"0\">";

    if (start == 1) {
        v_pagepre = "<td>" + t1_d + t2_d + "</td>";

    } else {
        v_pagepre = '<td><a class="order" href="javascript:search_result('
            + (1) + ')">' + t1 + '</a></td>';
        v_pagepre = v_pagepre + ' '
            + '<td><a class="order" href="javascript:search_result('
            + (start - rownum) + ')">' + t2 + '</a></td>';
    }

    if (start > (totalnum - rownum)) {
        v_pagenext = "<td>" + t3_d + t4_d + "</td>";

    } else {
        var v_end = (v_totalpagecount - 1) * rownum + 1;
        v_pagenext = '<td><a class="order" href="javascript:search_result('
            + (parseInt(start, 10) + parseInt(rownum, 10)) + ')">' + t3
            + '</a></td>';
        v_pagenext = v_pagenext + ' '
            + '<td><a class="order" href="javascript:search_result(' + (v_end)
            + ')">' + t4 + '</a></td>';
    }
    var v_turnpage = "<td class=\"font-12px\">第</td><td class=\"font-12px\"><select name=\"tzys\"  onchange=\"turn_page(this.value,"
        + rownum + ")\">";
    // for(var i=1;i<=v_endpagecount;i++)
    for (var i = 1; i <= v_totalpagecount; i++) {
        v_turnpage = v_turnpage + "<option value=\"" + i + "\"";
        if (currpage == i)
            v_turnpage = v_turnpage + " selected ";
        v_turnpage = v_turnpage + ">" + i + "</option>";
    }
    v_turnpage = v_turnpage + "</select></td><td class=\"font-12px\">页 </td>";
    var v_pagenum = "<td class=\"font-12px\"> 每页</td><td class=\"font-12px\"><select name=\"selectCount\" onchange=\"setpagecount(this.value)\">";
    for (var i = 1; i < 10; i++) {
        v_pagenum = v_pagenum + "<option value=\"" + i + "\"";

        if (rownum == i)
            v_pagenum = v_pagenum + " selected ";
        v_pagenum = v_pagenum + ">" + i + "</option>";
    }
    for (var i = 10; i <= 50; i = i + 10) {
        v_pagenum = v_pagenum + "<option value=\"" + i + "\"";

        if (rownum == i)
            v_pagenum = v_pagenum + " selected ";
        v_pagenum = v_pagenum + ">" + i + "</option>";
    }
    for (var i = 100; i <= 300; i = i + 100) {
        v_pagenum = v_pagenum + "<option value=\"" + i + "\"";
        if (rownum == i)
            v_pagenum = v_pagenum + " selected ";
        v_pagenum = v_pagenum + ">" + i + "</option>";
    }
    v_pagenum = v_pagenum + "</select></td><td class=\"font-12px\">条</td>";
    s2 = s2 + v_pagepre + v_turnpage + v_pagenum + v_pagenext + '</tr></table>';

    document.all.pageid1.innerHTML = s1;
    document.all.pageid2.innerHTML = s2;

}

function setTRcolor() {
    for (var i = 0; i < document.all.trobj.length; i++) {
        if (i % 2 == 0)
            document.all.trobj[i].className = "datasheet-td-normal-b";
    }
}

function turn_page_pic(value, row) {
    var b = value;
    search_result((b - 1) * row + 1);
}

function setpagecount_pic(value) {
    document.all.PageCount.value = value;
    if (document.all.pageCount != null) {
        document.all.pageCount.value = value;
    }

    search_result(1);
}

// 打印翻页
function show_page(start, rownum, totalnum) {

    if (start <= 0) {
        start = 1;
    }

    var rowPattern = /^[0-9]+$/;
    if (!rowPattern.test(rownum)) {
        alert('每页条数只能是整数');
        return;
    }
    if (rownum == 0) {
        alert("记录行数不能为空");
        return;
    }

    document.all.totalnum.value = totalnum;
    var currpage = (start - 1) / rownum * 1 + 1;
    var v_totalpagecount = Math.ceil(totalnum / rownum); // 总页数
    var s1 = '  总共' + totalnum + '条  ';
    var s2 = '<table  border="0" cellpadding="1" cellspacing="0"><tr height="19px"><td> ';
    var v_nowstart = Math.floor(start / (rownum * 10)); // 当前是第二十页的第几页
    if (v_nowstart * 10 + 10 > v_totalpagecount)
        v_endpagecount = v_totalpagecount;
    else
        v_endpagecount = v_nowstart * 10 + 10;

    var t1 = "首页";
    var t1_d = "首页";
    var t2 = "上一页";
    var t2_d = "上一页";
    var t3 = "下一页";
    var t3_d = "下一页";
    var t4 = "尾页";
    var t4_d = "尾页";

    if (start == 1) {
        v_pagepre = "" + t1_d + "&nbsp;&nbsp; " + t2_d + "&nbsp;&nbsp;";

    } else {
        v_pagepre = '<a class="order" href="#" onclick="search_result(' + (1)
            + ')">' + t1 + '</a>&nbsp;&nbsp;';
        v_pagepre = v_pagepre + ' '
            + '<a class="order" href="#" onclick="search_result('
            + (start - rownum) + ')">' + t2 + '</a>&nbsp;&nbsp;';
    }

    if (start > (totalnum - rownum)) {
        v_pagenext = "" + t3_d + "&nbsp;&nbsp;" + t4_d + "&nbsp;&nbsp;";

    } else {
        var v_end = (v_totalpagecount - 1) * rownum + 1;
        v_pagenext = '<a class="order" href="#" onclick="search_result('
            + (parseInt(start, 10) + parseInt(rownum, 10)) + ')">' + t3
            + '</a>&nbsp;&nbsp;';
        v_pagenext = v_pagenext + ' '
            + '<a class="order" href="#" onclick="search_result(' + (v_end)
            + ')">' + t4 + '</a>&nbsp;&nbsp;';
    }

    s2 = s2 + v_pagepre + v_pagenext;
    s2 = s2 + "总共" + totalnum + "条&nbsp;&nbsp;";
    s2 = s2
        + "每页条数<input onKeyUp='setPageCount(-1)' name='_input_page_count' type='text' class='text_input' value='"
        + rownum + "' size='3' >&nbsp;&nbsp;";
    s2 = s2 + "现" + currpage + "/" + v_totalpagecount + "页&nbsp;&nbsp;";
    s2 = s2
        + "跳转到第<input name='_input_turn_page' type='text' class='text_input' value='"
        + currpage + "' size='3'>页&nbsp;&nbsp;";
    if (totalnum == 0) {
        s2 = s2
            + "<input  type='button' value='跳 转'  class='button-two-up' /></td>";
    } else {
        s2 = s2
            + "<input  type='button' value='跳 转'  class='button-two-up' onclick='show_turn_page("
            + totalnum + ")' /></td>";
    }
    s2 = s2 + '</tr></table>';
    setPageCount("" + rownum);
    document.all.pageid1.innerHTML = "";
    document.all.pageid2.innerHTML = s2;
    
    if (document.all.infoPage != null) {

        if (document.getElementById("infoPageTr") != null) {
            document.getElementById("infoPageTr").style.display = "";
        }
        if (document.getElementById("infoPageTrPg") != null) {
            document.getElementById("infoPageTrPg").style.display = "";
        }
    }
}

function getContextPaths() {
    try {
        return getWebContextPath();
    } catch (e) {
        var urlStr = location.href;
        if (urlStr.indexOf("\\\\") >= 0) {
            urlStr = urlStr.substring(urlStr.indexOf("\\\\") + 2);
        } else {
            urlStr = urlStr.substring(urlStr.indexOf("//") + 2);
        }

        if (urlStr.indexOf("\\") >= 0
            && urlStr.indexOf("/") < urlStr.indexOf("\\")) {
            urlStr = urlStr.substring(urlStr.indexOf("/") + 1);
        } else if (urlStr.indexOf("\\") >= 0) {
            urlStr = urlStr.substring(urlStr.indexOf("\\") + 1);
        } else {
            urlStr = urlStr.substring(urlStr.indexOf("/") + 1);
        }

        if (urlStr.indexOf("\\") >= 0
            && urlStr.indexOf("/") < urlStr.indexOf("\\")) {
            urlStr = urlStr.substring(0, urlStr.indexOf("/"));
        } else if (urlStr.indexOf("\\") >= 0) {
            urlStr = urlStr.substring(0, urlStr.indexOf("\\"));
        } else {
            urlStr = urlStr.substring(0, urlStr.indexOf("/"));
        }
        if (urlStr.indexOf("_") >= 0) {
            return "/" + urlStr;
        }
        if (urlStr.indexOf("_") < 0) {
            return "";
        }
        return "/" + urlStr;
    }
}

function setPageCount(pageValue) {
    if (pageValue == -1) {
        document.all.PageCount.value = document.all._input_page_count.value;
        if (document.all.pageCount != null) {
            document.all.pageCount.value = document.all._input_page_count.value;
        }
    } else {
        document.all.PageCount.value = pageValue;
        if (document.all.pageCount != null) {
            document.all.pageCount.value = pageValue;
        }
    }
}

function show_turn_page(totalnum) {

    var b = document.all._input_turn_page.value;
    var row = document.all._input_page_count.value;
    var rowPattern = /^[0-9]+$/;
    if (!rowPattern.test(row)) {
        alert('每页条数只能是整数');
        return;
    }
    if (row == 0) {
        alert('每页条数不能为0');
        return;
    }

    // 页面跳转非法值控制 begin //////////
    if (!rowPattern.test(b)) {
        alert('跳转页面数只能是整数');
        return;
    }
    if (b == 0) {
        alert('跳转页面数不能为0');
        return;
    }
    // 页面跳转非法值控制 end //////////

    if (row == "")
        row = 10;
    document.all.PageCount.value = row;
    if (document.all.pageCount != null) {
        document.all.pageCount.value = row;
    }
    if (b == "")
        b = 1;
    if (((b - 1) * row + 1) > (totalnum)) {
        alert('跳转到的页面编号大于总页数');
        return;
    }
    search_result((b - 1) * row + 1);
}

// 给变量赋值
function setUIHiddenValue(hiddenID) {
    var returnV;
    if (window.frames["infoPage"] != null) {
        if (window.frames["infoPage"].document.getElementById(hiddenID) != null) {
            if (typeof (window.frames["infoPage"].document
                .getElementById(hiddenID)) != 'undefined'
                && window.frames["infoPage"].document.getElementById(hiddenID).value != "") {
                returnV = window.frames["infoPage"].document
                    .getElementById(hiddenID).value;
            } else {
                returnV = "";
            }
        }
    }
    return returnV;
}
//表单查询(用于新查询报表,包含进度条)
function reportProcessSearch(ctrl, url, rootPath, exportSessionId, targets) {
    if (rootPath.indexOf("--") < 0) {
        rootPath = rootPath + "--";
    }
    if (targets == null || targets == "" || typeof (targets) == "undefined") {
        targets = "infoPage";
    }
    if (document.all.infoPage != null) {
        if (document.getElementById("reportSEDiv") != null
            && document.getElementById("reportSEDiv").style.display != "none") {
            if (constants != null) {
                if (document.getElementById("PageCount") != null) {
                    if (typeof (window.frames["infoPage"].document
                        .getElementById("default_page_count")) != "undefined"
                        && window.frames["infoPage"].document
                            .getElementById("default_page_count") != null
                        && window.frames["infoPage"].document
                            .getElementById("default_page_count").value != "") {
                        document.getElementById("PageCount").value = window.frames["infoPage"].document
                            .getElementById("default_page_count").value;
                    } else {
                        document.getElementById("PageCount").value = "100";
                    }
                }
                if (document.getElementById("pageCount") != null) {
                    if (typeof (window.frames["infoPage"].document
                        .getElementById("default_page_count")) != "undefined"
                        && window.frames["infoPage"].document
                            .getElementById("default_page_count") != null
                        && window.frames["infoPage"].document
                            .getElementById("default_page_count").value != "") {
                        document.getElementById("pageCount").value = window.frames["infoPage"].document
                            .getElementById("default_page_count").value;
                    } else {
                        document.getElementById("pageCount").value = "100";
                    }
                }
                if (document.getElementById("page_count") != null) {
                    if (typeof (window.frames["infoPage"].document
                        .getElementById("default_page_count")) != "undefined"
                        && window.frames["infoPage"].document
                            .getElementById("default_page_count") != null
                        && window.frames["infoPage"].document
                            .getElementById("default_page_count").value != "") {
                        document.getElementById("page_count").value = window.frames["infoPage"].document
                            .getElementById("default_page_count").value;
                    } else {
                        document.getElementById("page_count").value = "100";
                    }
                }
            }
        }
        /*
         * if(document.getElementById("reportSEDiv")!=null&&document.getElementById("reportSEDiv").style.display!="none"){
         * if(constants!=null){ if(document.getElementById("PageCount")!=null){
         * document.getElementById("PageCount").value="100"; }
         * if(document.getElementById("pageCount")!=null){
         * document.getElementById("pageCount").value="100"; }
         * if(document.getElementById("page_count")!=null){
         * document.getElementById("page_count").value="100"; } } }
         */
        if (window.frames["infoPage"].document.getElementById("title_num") != null) {
            if (document.getElementById("title_num") != null) {
                document.getElementById("title_num").value = window.frames["infoPage"].document
                    .getElementById("title_num").value;
            }
        }
        if (window.frames["infoPage"].document.getElementById("export_style") != null) {
            if (document.getElementById("export_style") != null) {
                document.getElementById("export_style").value = window.frames["infoPage"].document
                    .getElementById("export_style").value;
            }
        }
    }
    // alert(document.getElementById("PageCount").value);
    if (document.all.is_page_submit != null) {
        document.all.is_page_submit.value = "false";
    }
    if (document.getElementById("srl_id") != null) {
        document.getElementById("srl_id").value = "";
    }

    var rows = document.all._input_page_count;
    if (rows != null) {
        var row = rows.value;
        var rowPattern = /^[0-9]+$/;
        if (!rowPattern.test(row)) {
            alert('每页条数只能是整数');
            return;
        }
        if (row == 0) {
            alert('每页条数不能为0');
            return;
        }
    }
    // rootPath=WEB_DISPLAY_NAME+"--";
    // requestAjaxStatus(rootPath,exportSessionId);
    // var div1 = document.getElementById("div1");
    // var div2 = document.getElementById("div2");
    // var div3 = document.getElementById("div3");
    // if(div1!=null){
    // div1.style.display="";
    // }
    // if(div2!=null){
    // div2.style.display="none";
    // }
    // if(div3!=null){
    // div3.style.display="none";
    // }

    if (targets == "infoPage" && window.frames["infoPage"].document.body) {
        window.frames["infoPage"].document.body.innerHTML = "";
    }
    // if(window.frames["infoPage"].document.getElementById("box_table")!=null){
    // window.frames["infoPage"].document.getElementById("box_table").innerHTML="";
    // }
    // var select_column = document.getElementById("select_column").value;
    // var select_show_column =
    // document.getElementById("select_show_column").value;
    // var group_column = document.getElementById("group_column").value;
    // var isRollUp = document.getElementById("isRollUp").value;

    var pc = 100;
    var pagc = 100;
    if (document.getElementById('PageCount') != null) {
        pc = document.getElementById('PageCount').value;
        pagc = document.getElementById('PageCount').value;
    }
    // if(url.indexOf("?")>=0){
    // url=url+"&pc="+pc+"&select_column="+select_column+"&select_show_column="+select_show_column+"&group_column="+group_column+"&isRollUp="+isRollUp;
    // }else{
    // url=url+"?pc="+pc+"&select_column="+select_column+"&select_show_column="+select_show_column+"&group_column="+group_column+"&isRollUp="+isRollUp;
    // }
    // var select_column = document.getElementById("select_column").value;
    // var select_show_column =
    // document.getElementById("select_show_column").value;
    // var group_column = document.getElementById("group_column").value;
    // var isRollUp = document.getElementById("isRollUp").value;
    // var urls =
    // url+"&select_column="+select_column+"&select_show_column="+select_show_column+"&group_column="+group_column+"&isRollUp="+isRollUp;
    // urls = urls +"&isExport=true"
    // document.getElementById(ctrl).action=urls;
    if (url.indexOf("?") >= 0) {
        url = url + "&pc=" + pc + "&PageCount=" + pc + "&pageCount=" + pc;
    } else {
        url = url + "?pc=" + pc + "&PageCount=" + pc + "&pageCount=" + pc;
    }
    if (document.getElementById("isExport") != null) {
        document.getElementById("isExport").value = "false";
    }
    document.getElementById(ctrl).action = url;

    // document.getElementById(ctrl).action=url+"?pc="+pc+"&select_column="+select_column+"&select_show_column="+select_show_column+"&group_column="+group_column+"&isRollUp="+isRollUp;
    // alert(11+targets);
    document.getElementById(ctrl).target = targets;
    // document.getElementById(ctrl).target="_blank";
    document.getElementById(ctrl).method = "post";
    if (document.all.start != null) {
        document.all.start.value = "1";
    }
    // alert("PageCount:"+document.getElementById('PageCount').value);
    // alert("url="+url+",ctrl="+ctrl);
    document.getElementById(ctrl).submit();
}

// 选择类型后导出(用于新查询报表)
function exportExcel(ctrl, url, rootPath, exportSessionId, targets) {
    if (document.all.infoPage != null) {
        if (window.frames["infoPage"].document.getElementById("title_num") != null) {
            if (document.getElementById("title_num") != null)
                document.getElementById("title_num").value = document
                    .frames("infoPage").document.getElementById("title_num").value;
        }
        if (window.frames["infoPage"].document.getElementById("export_style") != null) {
            if (document.getElementById("export_style") != null) {
                document.getElementById("export_style").value = document
                    .frames("infoPage").document.getElementById("export_style").value;
            }
        }
    }

    var exp_type = document.getElementById("export_type").value;

    if (targets == null || targets == "" || typeof (targets) == "undefined") {
        targets = "excelExportIframe";
    }
    // divUtil.showDiv("export_div");
    var rows = document.all._input_page_count;
    if (rows != null) {
        var row = rows.value;
        var rowPattern = /^[0-9]+$/;
        if (!rowPattern.test(row)) {
            alert('每页条数只能是整数');
            return;
        }
        if (row == 0) {
            alert('每页条数不能为0');
            return;
        }
    }
    // var select_column = document.getElementById("select_column").value;
    // var select_show_column =
    // document.getElementById("select_show_column").value;
    // var group_column = document.getElementById("group_column").value;
    // var isRollUp = document.getElementById("isRollUp").value;
    // var urls =
    // url+"&select_column="+select_column+"&select_show_column="+select_show_column+"&group_column="+group_column+"&isRollUp="+isRollUp;
    // urls = urls +"&isExport=true"
    // document.getElementById(ctrl).action=urls;
    if (document.getElementById("isExport") != null) {
        document.getElementById("isExport").value = "true";
    }
    if (url.indexOf("?") >= 0) {
        url = url + "&exp_type=" + exp_type;
    } else {
        url = url + "?exp_type=" + exp_type;
    }
    
    document.getElementById(ctrl).action = url;
    document.getElementById(ctrl).target = targets;
    document.getElementById(ctrl).submit();

}

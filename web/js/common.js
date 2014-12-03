function getWebContextPath() {
    return "/cola";
}

// 隐藏、显示
function hideSearch(searchObj, iframeObj, showHeight, hideHeight) {

    var cPath = getWebContextPath();
    var downPath = "";
    var upPath = "";

    downPath = cPath + "/images/line_down.gif";
    upPath = cPath + "/images/line_up.gif";
    if (document.getElementById(searchObj).style.display != "none") {
        document.getElementById(searchObj).style.display = "none";
        document.getElementById("InfoPageImg").src = downPath;
        document.getElementById("InfoPageImg").alt = "收缩";
        // document.getElementById("InfoPageSearch").style.height = "430px";
    } else {
        document.getElementById(searchObj).style.display = "";
        document.getElementById("InfoPageImg").src = upPath;
        document.getElementById("InfoPageImg").alt = "放大";
        // document.getElementById("InfoPage").style.height = "300px";
    }
}

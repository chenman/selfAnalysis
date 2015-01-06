<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>选择元素</title>
<script type="text/javascript" src="<%=path%>/js/jquery.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery.compatible.js"></script>
<script type="text/javascript" src="<%=path%>/dwr/interface/SelfAnalysisClient.js"></script>
<script type="text/javascript" src="<%=path%>/dwr/engine.js"></script>
<script type="text/javascript" src="<%=path%>/dwr/util.js"></script>
<script type="text/javascript" src="<%=path%>/js/UtilTool.js"></script>
<script type="text/javascript" src="<%=path%>/js/NLComponent/table/com.newland.table.NLTable.min.js"></script>
<link type="text/css" href="<%=path%>/js/NLComponent/table/com.newland.table.NLTable.css" rel="stylesheet" />
<link type="text/css" href="<%=path%>/css/main.css" rel="stylesheet" />
<script>
	var system_table, selected_table;
	//var selectedArr=null;
	var tempSelectArr = [];
	var packageTypeMap = null; //属性包map对象
	var SaSource = parent.getSaSource();

	var useHeight; //页面高度

	var cm = [ {
		display : '属性编码',
		name : 'attrId',
		align : 'left',
		width : "200px",
		hide : true,
		isKey : false,
		isData : true
	}, {
		display : '属性名称',
		name : 'attrName',
		align : 'center',
		width : "12%",
		hide : false,
		isKey : false,
		isData : true
	}, {
		display : '时间周期',
		name : 'cycleType',
		align : 'center',
		width : "100px",
		hide : true,
		isKey : false,
		isData : true
	}, {
		display : '时间周期',
		name : 'cycleTypeName',
		align : 'center',
		width : "12%",
		hide : false,
		isKey : false,
		isData : true
	}, {
		display : '分析框架编码',
		name : 'frameId',
		align : 'left',
		width : "200px",
		hide : true,
		isKey : false,
		isData : true
	}, {
		display : '分析框架名称',
		name : 'frameName',
		align : 'center',
		width : "15%",
		hide : false,
		isKey : false,
		isData : true
	}, {
		display : '属性分类编码',
		name : 'attrClassId',
		align : 'left',
		width : "200px",
		hide : true,
		isKey : false,
		isData : true
	}, {
		display : '属性分类名称',
		name : 'attrClassName',
		align : 'left',
		width : "19%",
		hide : false,
		isKey : false,
		isData : true
	}, {
		display : '属性描述',
		name : 'attrDesc',
		align : 'left',
		width : "19%",
		hide : false,
		isKey : false,
		isData : true,
		fireEvent : longTextDeal
	}, {
		display : '是否维度',
		name : 'isDim',
		align : 'left',
		width : "200px",
		hide : true,
		isKey : false,
		isData : true
	}, {
		display : '维度编码',
		name : 'dimId',
		align : 'left',
		width : "200px",
		hide : true,
		isKey : false,
		isData : true
	}, {
		display : '字段名称',
		name : 'colName',
		align : 'left',
		width : "200px",
		hide : true,
		isKey : false,
		isData : true
	}, {
		display : '字段类型',
		name : 'colType',
		align : 'left',
		width : "200px",
		hide : true,
		isKey : false,
		isData : true
	}, {
		display : '表名',
		name : 'tableName',
		align : 'left',
		width : "200px",
		hide : true,
		isKey : false,
		isData : true
	}, {
		display : '最新数据时间',
		name : 'loadDate',
		align : 'left',
		width : "200px",
		hide : true,
		isKey : false,
		isData : true
	} ];

	$(function() {
		useHeight = $(window).height() - 100;
		//        alert(useHeight);
		document.getElementById("system_attr_table").style.height = useHeight
				+ "px";
		if (SaSource != undefined) {
			try {
				var t = SaSource.getAttrTreeLeafNode();
				if (t == undefined) {
					t = [];
				}
				for ( var i in t) {
					tempSelectArr.push(t[i]);
				}

			} catch (err) {
				alert(err);
				tempSelectArr = [];
			}
		}

		system_table = new NLTable({
			container_id : "system_attr_table",
			table_id : "table1",
			title : '',
			width : "100%",
			height : useHeight,
			dataType : 'json',
			showcheckbox : true,
			tableData : {
				total : 1,
				page : 1,
				resultID : 1,
				resultList : null
			},
			autoload : true,
			isFilter : false,
			rp : 15,
			onChangePage : function(newPage, pernum) {
				queryAttrList(1, newPage, pernum);
			},
			clickRowDoCheck : false,
			rowhandler : function(tr_object) {
				tr_object.onclick = function() {
					var data = system_table.getRowData(tr_object)[0];
					// parent.desiIframe.addAttrData = data;
				}
			},

			colModel : cm,
			onrowchecked : function(param) {
				if (param.isChecked) { //勾选
					if (!addAttrToSelected(1)) {
						var data = system_table.getRowData(param.tr_object)[0];
						var eid = data.attr_id;
						system_table.uncheckRowsByKeyColumn({
							identifyColumn : "attr_id",
							identityColumnValue : [ eid ]
						});
					}
				} else { //去勾

					var data = system_table.getRowData(param.tr_object)[0];
					var eid = data.attr_id;
					//checkSelItem(eid);
					if (!parent.desiIframe.SaSource.isDesinUsed(eid)) {
						//不是已使用
						delTempSelectArr(eid);
						var tb = document.getElementById("selTable");
						var cbs = document.getElementsByName("selcheck");
						if (cbs.length > 0) {
							for (var i = 0; i < cbs.length; i++) {
								if (cbs[i].value == eid) {
									tb.deleteRow(i * 2 + 1);
									tb.deleteRow(i * 2);
									break;
								}
							}
						}
					} else {
						system_table.checkRowsByKeyColumn({
							identifyColumn : "attr_id",
							identityColumnValue : [ eid ]
						});
						alert("实例设计中用到的属性不可以删除!");
					}

				}
			}
		});

		queryFrameList();
		queryAttrClassList();
	});

	function queryFrameList() {
		SelfAnalysisClient.queryFrameList(function(frameList) {
			if (!util.isNull(frameList)) {
				var bean;
				for (var i = 0; i < frameList.length; i++) {
					bean = frameList[i];
					util.addSelectOption("qry_frame_id", bean.frameName,
							bean.frameId);
				}
				util.selectedOption("qry_frame_id", "");
			}
		});
	}

    var attrClassList;
	function queryAttrClassList() {
		SelfAnalysisClient.queryAttrClassList(function(resultList) {
			attrClassList = resultList;
		});
	}
	
    function getAttrClass(frameId) {
        if (!util.isNull(attrClassList) && attrClassList.length > 0 && !util.isNull(frameId)) {
            util.clearSelect("qry_attr_class_id");
            util.addSelectOption("qry_attr_class_id", "--请选择--", "null");
            for (var i = 0; i < attrClassList.length; i++) {
                if (attrClassList[i].frameId == frameId) {
                    util.addSelectOption("qry_attr_class_id", attrClassList[i].attrClassName, attrClassList[i].attrClassId);
                }
            }
        } else {
            util.clearSelect("qry_attr_class_id");
            util.addSelectOption("qry_attr_class_id", "--请选择--", "null");
        }
    }

	function doSearch() {
		system_table.mask();
		var attrReqBean = {
			attrName : null,
			frameId : null,
			attrClassId : null,
			cycleType : null
		};
		var attrName = document.getElementById("qry_attr_name").value;
		var frameId = document.getElementById("qry_frame_id").value;
		var attrClassId = document.getElementById("qry_attr_class_id").value;
		var cycleType = document.getElementById("cycleType").value;

		if (attrName == "请输入属性名称模糊搜索") {
			attrName = "";
		}

		if (attrClassId == "null") {
			attrClassId = "";
		}
		attrReqBean.attrName = attrName;
		attrReqBean.frameId = frameId;
		attrReqBean.importId = importId;
		attrReqBean.attrClassId = attrClassId;
		attrReqBean.cycleType = cycleType;
		var parnum = system_table.getOptions().rp; //每页记录数
		QueryAnalysisClient.queryAttrList(1, attrReqBean, 1, parnum, function(
				dataArr) {
			QueryAnalysisClient.getTotalCount(function(total) {
				var dataObj = {
					total : total,
					page : 1,
					resultID : 1,
					resultList : dataArr
				};
				system_table.flexReload(null, dataObj);
				if (total > 0) {
					isSearch = true;
				}
				checkedTableSelected(system_table);
				system_table.unmask();
			});
		});
	}

	/**
	 *搜索属性列表(分页)
	 *type:1:搜索系统属性 2：模糊搜索
	 */
	function queryAttrList(type, newPage, pernum) {
		var start = newPage;
		var attrReqBean = {
			attrName : null,
			frameId : null,
			attrClassId : null,
			detailSwitch : 1,
			cycleType : null,
			packageId : null
		};
		if (type == 1) { //搜索系统属性
			system_table.mask();

			QueryAnalysisClient.queryAttrList(1, attrReqBean, start, pernum,
					function(dataArr) {
						QueryAnalysisClient.getTotalCount(function(total) {
							var dataObj = {
								total : total,
								page : newPage,
								resultID : 1,
								resultList : dataArr
							};
							system_table.flexReload(null, dataObj);
							system_table.unmask();
						});
					});

		} else if (type == 2 && isSearch) { //模糊搜索
			system_table.mask();
			var attrName = document.getElementById("qry_attr_name").value;
			var frameId = document.getElementById("qry_frame_id").value;
			var attrClassId = document.getElementById("qry_qry_attr_class_id").value;
			var cycleType = document.getElementById("qry_circle_type").value;
			if (attrName == "请输入属性名称模糊搜索") {
				attrName = "";
			}

			if (attrClassId == "null") {
				attrClassId = "";
			}
			attrReqBean.attrName = attrName;
			attrReqBean.frameId = frameId;
			attrReqBean.importId = importId;
			attrReqBean.attrClassId = attrClassId;
			attrReqBean.cycleType = cycleType;

			QueryAnalysisClient.queryAttrList(1, attrReqBean, start, pernum,
					function(dataArr) {
						QueryAnalysisClient.getTotalCount(function(total) {
							var dataObj = {
								total : total,
								page : newPage,
								resultID : 1,
								resultList : dataArr
							};
							system_table.flexReload(null, dataObj);
							checkedTableSelected(system_table);
							system_table.unmask();
						});
					});
		}
	}

	/**
	 *长口径显示处理
	 */
	function longTextDeal(param) {
		var data = param.grid.getRowData(param.tr_object)[0];
		var text = data.busInfo;
		if (text != null && text.length > 10) {
			text = text.substring(0, 10) + "...";
		}
		jQuery(param.div_object).html(text);
	}
</script>
</head>
<body>
    <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
        <tr height="22px">
            <td class="font_title" valign="top" style="text-align: left;">分析元素来源</td>
            <td width="10px">&nbsp;</td>
            <td class="font_title" valign="top" style="text-align: left;" width="30%">已选属性</td>
        </tr>
        <tr>
            <td class="td_bg p_12">
                <!-- 元素列表 -->
                <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td valign="top">
                            <table width="100%">
                                <tr>
                                    <td class="td_title" width="12%">分析框架:</td>
                                    <td class="td_cont" width="15%"><select id="qry_frame_id" name="qry_frame_id"
                                        style="width: 120px" onchange="getAttrClass(this.value)">
                                            <option value="">--请选择--</option>
                                    </select></td>
                                    <td class="td_title" width="12%">属性分类:</td>
                                    <td class="td_cont" width="15%"><select id="qry_attr_class_id"
                                        name="qry_attr_class_id" style="width: 120px">
                                            <option value="">--请选择--</option>
                                    </select></td>
                                    <td class="td_cont" width="15%"><select id="qry_circle_type"
                                        name="qry_circle_type" style="width: 100px">
                                            <option value="">请选择周期</option>
                                            <option value="1">日</option>
                                            <option value="2">月</option>
                                            <option value="0">非周期</option>
                                    </select></td>
                                    <td class="td_title" width="12%">属性名称:</td>
                                    <td class="td_cont" width="10%"><input type="text" name="qry_attr_name"
                                        id="qry_attr_name" style="width: 120px"></td>
                                    <td align="right"><input type="button" value="搜索" class="butt_blue"
                                        onclick="doSearch()"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div id="system_attr_table" class="table_container"></div>
                        </td>
                    </tr>
                </table>
            </td>
            <td></td>
            <td class="td_bg p_12">
                <!-- 已选列表 -->
                <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
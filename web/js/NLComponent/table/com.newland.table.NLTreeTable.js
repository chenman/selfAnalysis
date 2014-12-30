/*	
	树表格
	@author lwj
*/


(function($) {
	
    $.addTreeFlex = function(t, p) {
        if (t.grid) return false; //如果Grid已经存在则返回        
        $(t)
		.show() //show if hidden
		.attr({ cellPadding: 0, cellSpacing: 0, border: 0 })  //remove padding and spacing
		.removeAttr('width') //remove width properties	
		;

        //create grid class
        var g = {
            hset: {},
            rePosDrag: function() {
                var cdleft = 0 - this.hDiv.scrollLeft;
                if (this.hDiv.scrollLeft > 0) cdleft -= Math.floor(p.cgwidth / 2);

                $(g.cDrag).css({ top: g.hDiv.offsetTop + 1 });
                var cdpad = this.cdpad;

                $('div', g.cDrag).hide();
                
                
                $('thead tr:first th:visible', this.hDiv).each(function() {
                    if ($(this).css("display") == "none") {
                        return;
                    }

                    var n = $('thead tr:first th:visible', g.hDiv).index(this);			 	  
                    var cdpos = parseInt($('div', this).width());
                    var ppos = cdpos;
                    if (cdleft == 0)
                        cdleft -= Math.floor(p.cgwidth / 2);

                    cdpos = cdpos + cdleft + cdpad;

                    $('div:eq(' + n + ')', g.cDrag).css({ 'left': cdpos + 'px' }).show();

                    cdleft = cdpos;

                }
				);

            },
            fixHeight: function(newH) {
                newH = false;
                if (!newH) newH = $(g.bDiv).height();
                var hdHeight = $(this.hDiv).height();
                $('div', this.cDrag).each(
						function() {
						    $(this).height(newH + hdHeight);
						}
					);

                var nd = parseInt($(g.nDiv).height());

                if (nd > newH)
                    $(g.nDiv).height(newH).width(200);
                else
                    $(g.nDiv).height('auto').width('auto');

                $(g.block).css({ height: newH, marginBottom: (newH * -1) });

                var hrH = g.bDiv.offsetTop + newH;
                if (p.height != 'auto' && p.resizable) hrH = g.vDiv.offsetTop;
                $(g.rDiv).css({ height: hrH });

            },
            dragStart: function(dragtype, e, obj) { //default drag function start

                if (dragtype == 'colresize') //column resize
                {
                    $(g.nDiv).hide(); $(g.nBtn).hide();
                    var n = $('div', this.cDrag).index(obj);
                    var ow = $('th:visible div:eq(' + n + ')', this.hDiv).width();
                    //var ow = $('th:visible:eq(' + n + ') div', this.hDiv).width();
                    $(obj).addClass('dragging').siblings().hide();
                    //$(obj).prev().addClass('dragging').show();//modify by lwj 10.12.06 不显示前一个拖拽线条样式

                    this.colresize = { startX: e.pageX, ol: parseInt(obj.style.left), ow: ow, n: n };
                    $('body').css('cursor', 'col-resize');
                }
                else if (dragtype == 'vresize') //table resize
                {
                    var hgo = false;
                    $('body').css('cursor', 'row-resize');
                    if (obj) {
                        hgo = true;
                        $('body').css('cursor', 'col-resize');
                    }
                    this.vresize = { h: p.height, sy: e.pageY, w: p.width, sx: e.pageX, hgo: hgo };

                }

                else if (dragtype == 'colMove') //column header drag
                {
                    $(g.nDiv).hide(); $(g.nBtn).hide();
                    this.hset = $(this.hDiv).offset();
                    this.hset.right = this.hset.left + $('table', this.hDiv).width();
                    this.hset.bottom = this.hset.top + $('table', this.hDiv).height();
                    this.dcol = obj;
                    this.dcoln = $('th', this.hDiv).index(obj);

                    this.colCopy = document.createElement("div");
                    this.colCopy.className = "colCopy";
                    this.colCopy.innerHTML = obj.innerHTML;
                    if ($.browser.msie) {
                        this.colCopy.className = "colCopy ie";
                    }


					$(this.colCopy).css({ position: 'absolute', 'float': 'left', display: 'none', textAlign: obj.align });
                    $('body').append(this.colCopy);
                    $(this.cDrag).hide();

                }

                $('body').noSelect();

            },
            reSize: function() {
				//---------------modify by lwj 11.6.8-------------------//
				//--------------------start------------------//
                /*
				this.gDiv.style.width = p.width;
                this.bDiv.style.height = p.height;
				*/
				$(this.gDiv).width(p.width);
				$(this.bDiv).height(p.height);
				//--------------------end------------------//
            },
            dragMove: function(e) {

                if (this.colresize) //column resize
                {
                    var n = this.colresize.n;
                    var diff = e.pageX - this.colresize.startX;
                    var nleft = this.colresize.ol + diff;
                    var nw = this.colresize.ow + diff;
                    if (nw > p.minwidth) {
                        $('div:eq(' + n + ')', this.cDrag).css('left', nleft);
                        this.colresize.nw = nw;
                    }
                }
                else if (this.vresize) //table resize
                {
                    var v = this.vresize;
                    var y = e.pageY;
                    var diff = y - v.sy;
                    if (!p.defwidth) p.defwidth = p.width;
                    if (p.width != 'auto' && !p.nohresize && v.hgo) {
                        var x = e.pageX;
                        var xdiff = x - v.sx;
                        var newW = v.w + xdiff;
                        if (newW > p.defwidth) {
                            this.gDiv.style.width = newW + 'px';
                            p.width = newW;
                        }
                    }
                    var newH = v.h + diff;
                    if ((newH > p.minheight || p.height < p.minheight) && !v.hgo) {
                        this.bDiv.style.height = newH + 'px';
                        p.height = newH;
                        this.fixHeight(newH);
                    }
                    v = null;
                }
                /*--------------------start-------------------*/
                // by lwj 10.12.06 屏蔽列头拖拽 样式
                /* the old code
                else if (this.colCopy) {
                    $(this.dcol).addClass('thMove').removeClass('thOver');
                    if (e.pageX > this.hset.right || e.pageX < this.hset.left || e.pageY > this.hset.bottom || e.pageY < this.hset.top) {
                        //this.dragEnd();
                        $('body').css('cursor', 'move');
                    }
                    else
                        $('body').css('cursor', 'pointer');

                    $(this.colCopy).css({ top: e.pageY + 10, left: e.pageX + 20, display: 'block' });
                }
                */
				/*--------------------end-------------------*/
            },
            dragEnd: function() {
                if (this.colresize) {
                    var n = this.colresize.n;
                    var nw = this.colresize.nw;
                    $('th:visible div:eq(' + n + ')', this.hDiv).css('width', nw);
                    //$('th:visible:eq(' + n + ') div', this.hDiv).css('width', nw);

                    $('tr', this.bDiv).each(
									function() {
										/*-----------start------------*/
										//modify by lwj 10.12.06 避免拖拽时，列自定义插入DIV时，解析出错
										$("td:visible div[candrag='true']:eq(" + n + ")", this).css('width', nw);
										/*-----------end------------*/
										/* the old code
									    $('td:visible div:eq(' + n + ')', this).css('width', nw);
									    //$('td:visible:eq(' + n + ') div', this).css('width', nw);
									    */
									}
								);
                    this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                    $('div:eq(' + n + ')', this.cDrag).siblings().show();
                    $('.dragging', this.cDrag).removeClass('dragging');
                    this.rePosDrag();
                    this.fixHeight();
                    this.colresize = false;
                }
                else if (this.vresize) {
                    this.vresize = false;
                }
                else if (this.colCopy) {
                    $(this.colCopy).remove();
                    if (this.dcolt != null) {
                    
                    	/*------------------start-----------------*/
						// by lwj 10.9.13 屏蔽列头拖拽
						/* the old code
                        if (this.dcoln > this.dcolt)
                        { $('th:eq(' + this.dcolt + ')', this.hDiv).before(this.dcol); }
                        else
                        { $('th:eq(' + this.dcolt + ')', this.hDiv).after(this.dcol); }
                        this.switchCol(this.dcoln, this.dcolt);
                        */
                        /*------------------end-----------------*/ 
                        
                        $(this.cdropleft).remove();
                        $(this.cdropright).remove();
                        this.rePosDrag();
                    }
                    this.dcol = null;
                    this.hset = null;
                    this.dcoln = null;
                    this.dcolt = null;
                    this.colCopy = null;
                    $('.thMove', this.hDiv).removeClass('thMove');
                    $(this.cDrag).show();
                }
                $('body').css('cursor', 'default');
                $('body').noSelect(false);
            },
            toggleCol: function(cid, visible) {
                var ncol = $("th[axis='col" + cid + "']", this.hDiv)[0];
                var n = $('thead th', g.hDiv).index(ncol);
                var cb = $('input[value=' + cid + ']', g.nDiv)[0];
                if (visible == null) {
                    visible = ncol.hide;
                }
                if ($('input:checked', g.nDiv).length < p.minColToggle && !visible) return false;
                if (visible) {
                    ncol.hide = false;
                    $(ncol).show();
                    cb.checked = true;
                }
                else {
                    ncol.hide = true;
                    $(ncol).hide();
                    cb.checked = false;
                }
				//modify by lwj 11.8.30为了防止colModel配置中fireEvent里有自定义TR TD。
				//--------------------start-------------------//
				/*
                $('tbody tr', t).each
							(
								function() {
								    if (visible)
								        $('td:eq(' + n + ')', this).show();
								    else
								        $('td:eq(' + n + ')', this).hide();
								}
							);
				*/
				$("tbody tr[id^='"+p.table_id+"_row_']", t).each(
					function() {
						var _tds = $(this).children("td");
						if (visible){
							$(_tds[n]).show();
						}else{
							$(_tds[n]).hide();
						}
					}
				);
				//--------------------end-------------------//
                this.rePosDrag();
                if (p.onToggleCol) p.onToggleCol(cid, visible);
                return visible;
            },
            switchCol: function(cdrag, cdrop) { //switch columns
				//modify by chw 12.04.01
				//防止内嵌table导致获取tr集合不正确
                //$('tbody tr', t).each
				$("tbody tr[id^='"+p.table_id+"_row_']", t).each
					(
						function() {
						    if (cdrag > cdrop)
						        $('td:eq(' + cdrop + ')', this).before($('td:eq(' + cdrag + ')', this));
						    else
						        $('td:eq(' + cdrop + ')', this).after($('td:eq(' + cdrag + ')', this));
						}
					);
                //switch order in nDiv
                if (cdrag > cdrop)
                    $('tr:eq(' + cdrop + ')', this.nDiv).before($('tr:eq(' + cdrag + ')', this.nDiv));
                else
                    $('tr:eq(' + cdrop + ')', this.nDiv).after($('tr:eq(' + cdrag + ')', this.nDiv));
                if ($.browser.msie && $.browser.version < 7.0) $('tr:eq(' + cdrop + ') input', this.nDiv)[0].checked = true;
                this.hDiv.scrollLeft = this.bDiv.scrollLeft;
            },
            scroll: function() {
                this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                this.rePosDrag();
            },
            hideLoading: function() {
                $('.pReload', this.pDiv).removeClass('loading');
                if (p.hideOnSubmit){
                	/*
                		modify by lwj 10.4.19
                		$(g.block).remove();
                	*/
                	g.doMask('unmask');
                }
                //modify by lwj 10.7.16
                /*
                $('.pPageStat', this.pDiv).html(p.errormsg);
                */
                if(p.usepager){
                	$('.pPageStat', this.pDiv).html(p.errormsg);
                }
                this.loading = false;
            },
            
            /*----------------start---------------*/
            //add by lwj 10.8.10
            //把addData方法中的代码剥离成独立方法
			parseData: function(data){
                var ths = $('thead tr:first th', g.hDiv);
                var thsdivs = $('thead tr:first th div', g.hDiv);
                var tbhtml = [];
                if (p.dataType == 'json') {
                    if (data.rows != null) {
                        $.each(data.rows, function(i, row) {
                        	/*----------------start---------------*/
                        	//add by lwj 10.8.4
                        	if(row.parentId && row.id){
                        		if(row.parentId.toUpperCase()!="NULL" && row.id!=row.parentId){//说明是孩子
                        			tbhtml.push("<tbody id="+p.table_id+"_tbody_"+row.id+
                        						" name="+p.table_id+"_tbody_"+row.parentId+" style='display: none;'>");
                        		}else{//说明是父亲或者无父子关系
                        			tbhtml.push("<tbody id="+p.table_id+"_tbody_"+row.id+">");
                        		}
                        	}
                        	/*----------------end---------------*/
                            tbhtml.push("<tr id='", p.table_id+"_row_", row.id, "'");

                            if (i % 2 && p.striped) {
                                tbhtml.push(" class='erow'");
                            }
                            if (p.rowbinddata) {
                            	/* the old code
                                tbhtml.push("chd='", row.cell.join("_FG$SP_"), "'");
                                */
                                //-------------start--------------//
                                // add by lwj 11.2.23 过滤特殊字符
	                            var chstr = "";
	                            for(var i=0; i<row.cell.length; i++){
									if(typeof(row.cell[i]) == "string"){//modify by lwj 11.6.9
										chstr = chstr + row.cell[i].replace(/\</g,"&lt;")
																	.replace(/\>/g,"&gt;")
																	//.replace("\"","\&quot;");
																	.replaceAll("\"","\&quot;");//modiby lwj 11.6.14
									}else{
										chstr = chstr + row.cell[i];
									}
	                            	if(i < row.cell.length-1){
	                            		chstr = chstr + "_FG$SP_";
	                            	}
	                            }
                                tbhtml.push("chd=\"" + chstr + "\"");
                                //-------------end--------------//                                  
                            }
                            tbhtml.push(">");
                            var trid = row.id;
                            $(ths).each(function(j) {
                                var tddata = "";
                                var tdclass = "";
								var ver_align = p.colModel[j]&&p.colModel[j]["vertical-align"] != undefined? p.colModel[j]["vertical-align"]: "middle";
                                tbhtml.push("<td align='", this.align, "'");
                                var idx = $(this).attr('axis').substr(3);

                                if (p.sortname && p.sortname == $(this).attr('abbr')) {
                                    tdclass = 'sorted';
                                }
                                if (this.hide) {
                                    tbhtml.push(" style='display:none; vertical-align:"+ver_align+";");
                                }else{
									tbhtml.push(" style='vertical-align:"+ver_align+";'");
								}
                                var width = thsdivs[j].style.width;
                                var div = [];
                                var divInner = row.cell[idx] || "";
                                //-------------start--------------//
                                // add by lwj 11.2.23 过滤特殊字符        
								if(typeof divInner == "string"){//modify by lwj 11.6.9
									divInner = divInner.replace(/\</g,"&lt;")
														.replace(/\</g,"&lt;")
														//.replace("\"","&quot;");
														.replaceAll("\"","\&quot;");//modiby lwj 11.6.14
								}
	                            //-------------end--------------//   
                                /*-------------start---------*/
                                // modify by lwj 10.12.06 DIV加入candrag属性。防止列自定义嵌入DIV时，拖拽解析DIV出错.
                                div.push("<div candrag='true' title='"+divInner+"' style='text-align:", this.align, ";width:"+width, ";line-height: 16px;");
                                /*-------------end---------*/
                                /* the old code
                                //div.push("<div title='"+divInner+"' style='text-align:", this.align, ";width:", width, ";");
                                //div.push("<div style='text-align:", this.align, ";width:", width, ";");
                                */
	                        	/*----------------start---------------*/
	                        	//add by lwj 10.8.9 添加数据行的行高
                                //div.push("height:17px; line-height:17px;");
                                /*----------------end---------------*/
                                if (p.nowrap == false) {
                                    div.push("white-space:normal;word-break:break-all;");
                                }
                                /* the old code //modiby by lwj 10.12.06
                                div.push("'>");
                                */
                                if(p.showcheckbox){
                                	div.push(" padding:2px 4px 0px 4px; float:left;'>");//modiby by lwj 10.12.06
                                }else{
                                	div.push(" padding:2px 4px 3px 4px; float:left;'>");//modiby by lwj 10.12.06
                                }
                                if (idx == "-1") { //checkbox
                                    div.push("<input type='checkbox' id='", p.table_id, "_chk_", row.id, 
                                    			"' name='", p.table_id, "_chk_", row.parentId, "' class='itemchk' value='", row.id, "'/>");
                                    if (tdclass != "") {
                                        tdclass += " chboxtd";
                                    } else {
                                        tdclass += "chboxtd";
                                    }
                                } 
	                        	/*----------------start---------------*/
	                        	//add by lwj 10.8.4
                               /*
                                else if (idx == "-2") { //image
                                	var times = (row.id+"").split("_").length-1;
                                	for(var m=0; m<times; m++){
                                		div.push("<div class='treegrid_row_link_front_leaf_pic_div'></div>");
                                	}
                                	var cls = "treegrid_row_link_leaf_pic_div";
									//---------------start---------------------//
									//modify by chw 12.04.26
									//添加自定义叶子节点样式
									if(p.linkPicClass && p.linkPicClass.leafClass){
										cls += " " + p.linkPicClass.leafClass;
									}
									//---------------------end------------------------//
		                        	var f = row.parentId && row.id && row.parentId.toUpperCase()!="NULL" && row.hasChild;
		                        	if(f){//说明有孩子
		                        		cls = "treegrid_row_link_plus_close_pic_div";
										//---------------start---------------------//
										//modify by chw 12.04.26
										//添加自定义关闭节点样式
										if(p.linkPicClass && p.linkPicClass.closeClass){
											cls += " " + p.linkPicClass.closeClass;
										}
										//---------------------end------------------------//
		                        	}                                    
                                    div.push("<div ",(f?" title='展开子数据' ":"")," id='", p.table_id, "_row_link_div_", row.id, "' class='", cls, "'></div>");
                                }*/
                        		/*----------------end---------------*/
                                else {
                                    //var divInner = row.cell[idx] || "";
                                    /*-------------start---------------*/
		            				/* 这是原先的自有代码
                                    if (this.format) {
                                        divInner = this.format(divInner, trid);                                        
                                    }
                                    /*-------------end---------------*/
									if((p.showcheckbox && j==1) || j==0){
										div.push("<a class='a'>");
										var times = (row.id+"").split("_").length-1;
                                	for(var m=0; m<times; m++){
                                		div.push("<ins></ins>");
                                	}
                                	var cls = "treegrid_row_link_leaf_pic_div";
									//---------------start---------------------//
									//modify by chw 12.04.26
									//添加自定义叶子节点样式
									if(p.linkPicClass && p.linkPicClass.leafClass){
										cls += " " + p.linkPicClass.leafClass;
									}
									//---------------------end------------------------//
		                        	var f = row.parentId && row.id && row.parentId.toUpperCase()!="NULL" && row.hasChild;
		                        	if(f){//说明有孩子
		                        		cls = "treegrid_row_link_plus_close_pic_div";
										//---------------start---------------------//
										//modify by chw 12.04.26
										//添加自定义关闭节点样式
										if(p.linkPicClass && p.linkPicClass.closeClass){
											cls += " " + p.linkPicClass.closeClass;
										}
										//---------------------end------------------------//
		                        	}                                    
                                    div.push("<ins ",(f?" title='展开子数据' ":"")," id='", p.table_id, "_row_link_div_", row.id, "' class='", cls, "' style='vertical-align:", ver_align , "'></ins>");
								}
                                    div.push(divInner);
									div.push("</a>");
                                }
                                div.push("</div>");
                                if (tdclass != "") {
                                    tbhtml.push(" class='", tdclass, "'");
                                }
                                tbhtml.push(">", div.join(""), "</td>");
                            });
                            tbhtml.push("</tr>");
                        	/*----------------start---------------*/
                        	//add by lwj 10.8.4
                        	//if(row.parentId && row.id && row.parentId.toUpperCase()!="NULL" && row.id!=row.parentId){//说明是孩子
                        		tbhtml.push("</tbody>");
                        	//}
                        	/*----------------end---------------*/
                        });
                    }
                } else if (p.dataType == 'xml') {
                    i = 1;
                    $("rows row", data).each(function() {
				 	    i++;
				 	    var robj = this;
				 	    var arrdata = new Array();
				 	    $("cell", robj).each(function() {
				 	        arrdata.push($(this).text());
				 	    });
				 	    var nid = $(this).attr('id');
				 	    tbhtml.push("<tr id='", "row", nid, "'");
				 	    if (i % 2 && p.striped) {
				 	        tbhtml.push(" class='erow'");
				 	    }
				 	    if (p.rowbinddata) {
				 	        tbhtml.push("chd='", arrdata.join("_FG$SP_"), "'");
				 	    }
				 	    tbhtml.push(">");
				 	    var trid = nid;
				 	    $(ths).each(function(j) {
				 	        tbhtml.push("<td align='", this.align, "'");
				 	        if (this.hide) {
				 	            tbhtml.push(" style='display:none;'");
				 	        }
				 	        var tdclass = "";
				 	        var tddata = "";
				 	        var idx = $(this).attr('axis').substr(3);

				 	        if (p.sortname && p.sortname == $(this).attr('abbr')) {
				 	            tdclass = 'sorted';
				 	        }
				 	        var width = thsdivs[j].style.width;

				 	        var div = [];
				 	        div.push("<div style='text-align:", this.align, ";width:", width, ";");
				 	        if (p.nowrap == false) {
				 	            div.push("white-space:normal");
				 	        }
				 	        div.push("'>");

				 	        if (idx == "-1") { //checkbox
				 	            div.push("<input type='checkbox' id='", p.table_id, "_chk_", nid, "' class='itemchk' value='", nid, "'/>");
				 	            if (tdclass != "") {
				 	                tdclass += " chboxtd";
				 	            } else {
				 	                tdclass += "chboxtd";
				 	            }
				 	        } else {
				 	            var divInner = arrdata[idx] || "&nbsp;";
				 	            if (p.rowbinddata) {
				 	                tddata = arrdata[idx] || "";
				 	            }
				 	            /*-------------start---------------*/
		            			/* 这是原先的自有代码
				 	            if (this.format) {
				 	                divInner = this.format(divInner, trid);
				 	            }
				 	            /*-------------end---------------*/
				 	            div.push(divInner);
				 	        }
				 	        div.push("</div>");
				 	        if (tdclass != "") {
				 	            tbhtml.push(" class='", tdclass, "'");
				 	        }
				 	        tbhtml.push(" axis='", tddata, "'", ">", div.join(""), "</td>");
				 	    });
				 	    tbhtml.push("</tr>");
				 	});
                }
                return tbhtml;
			},
			/*----------------end---------------*/

			/*-----------------start---------------*/
			//modify by chw 12.10.17
			//可以上下移动数据，包括孩子数据，只限制没有配置勾选框的情况下
			adjustOrder: function(_param){
					var selectTrObj = $(g.bDiv).find("tbody tr[id^="+p.table_id+"_row_].trSelected");
					if(selectTrObj.length){
						var flag = false;
						if(p.showcheckbox){
							var count = 0;
							for(var i=0; i<selectTrObj.length; i++){
								var chkobj = $(selectTrObj[i]).children().children().children(); //input checkbox
								if(chkobj.attr("disabled") == false || chkobj.attr("disabled") == "false"){
									count++;
								}
							}
							if(count > 1){
								flag = true;
							}
						}
						if(!flag){
							if(selectTrObj != undefined){
								var trPrefix = selectTrObj.attr("id").substr(0, selectTrObj.attr("id").lastIndexOf("_"));
								var selectTodyObj = selectTrObj.parent("tbody"); //当前选中节点的元素的父元素,即tbody
								var tbodyId = selectTodyObj.attr("id"); //获得btody的Id
								var tbodyPrefix = tbodyId.substr(0, tbodyId.lastIndexOf("_"));
								var index = tbodyId.substr(tbodyId.lastIndexOf("_") + 1, tbodyId.length);
								
								if(_param.order == "up"){
									index = index - 1;
									var preTbodyObjForSel = $(g.bDiv).find("tbody[id="+(tbodyPrefix+"_"+index)+"]");//获取当前选中行对应的同级相邻前一行的行tbody对象
									if(preTbodyObjForSel.length == 0){
										alert("行数据为当前层级的顶级，无法继续向上移动");
										return false;
									}
									preTbodyObjForSel.before(selectTodyObj);

									var preChildren = (p.showcheckbox && preTbodyObjForSel.length>1)?preTbodyObjForSel: this.getChildren(tbodyPrefix+"_"+index);
									//var preChildren = this.getChildren(tbodyPrefix+"_"+index);

									if(!p.showcheckbox || (p.showcheckbox && preTbodyObjForSel.length==1)){
										for(var i=preChildren.length-1; i>=0; i--){
											preTbodyObjForSel.after(preChildren[i]);
										}
										preChildren.push(preTbodyObjForSel[0]);
									}

									selectChildren = (p.showcheckbox && selectTodyObj.length>1)?selectTodyObj: this.getChildren(tbodyPrefix+"_"+(index+1));
									//selectChildren = this.getChildren(tbodyPrefix+"_"+(index+1));
									if(!p.showcheckbox || (p.showcheckbox && selectTodyObj.length==1)){
										for(var i=selectChildren.length-1; i>=0; i--){
											selectTodyObj.after(selectChildren[i]);
										}

										selectChildren.push(selectTodyObj[0]);
									}
									var oldSelectTbodyId = selectTodyObj.attr("id");
									var oldPreTbodyId = preTbodyObjForSel.attr("id");
									this.changeChildrenId({
										oldId: tbodyId,
										newId: oldPreTbodyId,
										data: selectChildren,
										tbodyPrefix: tbodyPrefix,
										trPrefix: trPrefix
									});
									this.changeChildrenId({
										oldId: oldPreTbodyId,
										newId: tbodyId,
										data: preChildren,
										tbodyPrefix: tbodyPrefix,
										trPrefix: trPrefix
									});
								}else if(_param.order == "down"){
									index = parseInt(index) + 1;
									var nextTbodyObjForSel = $(g.bDiv).find("tbody[id="+(tbodyPrefix+"_"+index)+"]");//获取当前选中行对应的同级相邻前一行的行tbody对象
									if(nextTbodyObjForSel.length == 0){
										alert("当前节点处于当前层级的最后一个节点，无法继续往下移");
										return false;
									}
									nextTbodyObjForSel.after(selectTodyObj);
									//var nextChildren = nextTbodyObjForSel;
									var nextChildren = (p.showcheckbox && nextTbodyObjForSel.length>1)? nextTbodyObjForSel: this.getChildren(tbodyPrefix+"_"+index);
									//var nextChildren = this.getChildren(tbodyPrefix+"_"+index);
									
									if(!p.showcheckbox || (p.showcheckbox && nextTbodyObjForSel.length==1)){
										for(var i=nextChildren.length-1; i>=0; i--){
											nextTbodyObjForSel.after(nextChildren[i]);
										}
										nextChildren.push(nextTbodyObjForSel[0]);
									}

									var selectChildren = (p.showcheckbox && selectTodyObj.length>1)?selectTodyObj: this.getChildren(tbodyPrefix+"_"+(index+1));
									//selectChildren = this.getChildren(tbodyPrefix+"_"+(index+1));

									if(!p.showcheckbox || (p.showcheckbox && selectTodyObj.length == 1)){
										for(var i=selectChildren.length-1; i>=0; i--){
											selectTodyObj.after(selectChildren[i]);
										}
										
										selectChildren.push(selectTodyObj[0]);
									}
									var oldSelectTbodyId = selectTodyObj.attr("id");
									var oldNextTbodyId = nextTbodyObjForSel.attr("id");
									this.changeChildrenId({
										oldId: tbodyId,
										newId: oldNextTbodyId,
										data: selectChildren,
										tbodyPrefix: tbodyPrefix,
										trPrefix: trPrefix
									});
									this.changeChildrenId({
										oldId: oldNextTbodyId,
										newId: tbodyId,
										data: nextChildren,
										tbodyPrefix: tbodyPrefix,
										trPrefix: trPrefix
									});
								}
							}else{
								alert("请先选中一行数据进行移动");
							}
						}else{
							alert("只能针对一行数据进行移动");
						}
					}else{
						alert("只能针对一行数据进行移动");
					}
				//this.firePicColumnEvent();
			},
			/*----------------end-------------------*/
			getChildren: function(id){
				var childrenIdPrefix = id+"_";
				var allChildrenObjs = $(g.bDiv).find("tbody[id^="+childrenIdPrefix+"]");
				return allChildrenObjs;
			},
			changeChildrenId: function(__param){
				var childrenIdPrefix = __param.oldId;
				//var allChildrenObjs = $(g.bDiv).find("tbody[id^="+childrenIdPrefix+"]");
				for(var i=0; i<__param.data.length; i++){
					
					var _id = $(__param.data[i]).attr("id");
					var flag = false;
					if(_id == __param.oldId){//如果当前循环的对象是跟选中的节点对象是同一级的，则不需要修改name的值
						flag = true;
					}
					var newChildrenId = _id.replace(__param.oldId, __param.newId);	//将节点ID修改为新的
					var newName = newChildrenId.substr(0, newChildrenId.lastIndexOf("_"));		//获取前一个循环对象的ID，作为当前节点的name属性的值。
					$(__param.data[i]).attr("id", newChildrenId);		//将替换后的ID设置到当前循环的对象中去。
					var prefix = p.table_id+"_tbody_";
					var suffix = newChildrenId.substr(prefix.length, newChildrenId.length);
					var insObj = null;
					if(p.showcheckbox){
						insObj = $(__param.data[i]).children("tr").children("td.chboxtd").next().children("div").children("a").find("ins[id^='test_row_link_div_']");
						var chboxObj = $(__param.data[i]).children("tr").children("td.chboxtd").children("div").find("input[id^='test_chk_']");
						if(chboxObj != undefined){
							chboxObj.attr("id", p.table_id+"_chk_" + suffix);
							chboxObj.attr("name", p.table_id+"_chk_" + newName.substr(prefix.length, newName.length));
						}
					}else{
						insObj = $(__param.data[i]).children("tr").children("td").first().children("div").children("a").find("ins[id^='test_row_link_div_']");
					}
					if(insObj != undefined){
						insObj.attr("id", "test_row_link_div_" + suffix);
					}
					var trId = __param.trPrefix + newChildrenId.substr(__param.tbodyPrefix.length, newChildrenId.length);
					$(__param.data[i]).children("tr").attr("id", trId);	//设置tr的id
					if(!flag){	//说明当前循环的对象不是跟选中的行对象同一级的，需要重新设置name属性
						if(newName == undefined){	//如果没值，则直接设置为__param.newId
							$(__param.data[i]).attr("name", __param.newId);
						}else{
							$(__param.data[i]).attr("name", newName);
						}
					}
				}
				this.firePicColumnEvent();
				if(p.showcheckbox && p.cbLinked){//modify by lwj 12.5.14 加上钩选框是否关联孩子属性
					this.fireLinkRowsChkEvent();
				}
			},

            addData: function(data) { //parse data
            	//alert(JSON.encode(data));
                if (p.preProcess)
                { data = p.preProcess(data); }
                $('.pReload', this.pDiv).removeClass('loading');
                this.loading = false;

                if (!data) {
	                //modify by lwj 10.7.16
	                /*
	                $('.pPageStat', this.pDiv).html(p.errormsg);
	                */
	                //alert("tmd");
	                if(p.usepager){
	                	$('.pPageStat', this.pDiv).html(p.errormsg);
	                }	                    
                    return false;
                }
                var temp = p.total;
                if (p.dataType == 'xml') {
                    p.total = +$('rows total', data).text();
                }
                else {
                    p.total = data.total;
                }
                if (p.total < 0) {
                    p.total = temp;
                }

                if (p.total == 0) {
                    $('tr, a, td, div', t).unbind();
                    $(t).empty();
                    p.pages = 1;
                    p.page = 1;
		            /*----------------start---------------*/
		            //modify by lwj 10.6.21
		            //如果两个表格联动，后面的表格usepager属性为false，即不显示"页面操作菜单栏"，
		            //这时，当第一个表格点击查询第二个表格时，相关状态会在第一个表格的"页面操作菜单栏"中体现
		            if(p.usepager){
                    	this.buildpager();
                    	$('.pPageStat', this.pDiv).html(p.nomsg);
                    }
                    /*----------------end---------------*/
                    if (p.hideOnSubmit){
	                	/*
	                		modify by lwj 10.4.19
	                		$(g.block).remove();
	                	*/                    	
                    	g.doMask('unmask');
                    }
                    return false;
                }

                p.pages = Math.ceil(p.total / p.rp);

                if (p.dataType == 'xml')
                { p.page = +$('rows page', data).text(); }
                else
                { p.page = data.page; }
	            /*----------------start---------------*/
	            //modify by lwj 10.6.21
	            //如果两个表格联动，后面的表格usepager属性为false，即不显示"页面操作菜单栏"，
	            //这时，当第一个表格点击查询第二个表格时，相关状态会在第一个表格的"页面操作菜单栏"中体现
	            if(p.usepager){
                	this.buildpager();
                }
				/*----------------end---------------*/
				
				var tbhtml = this.parseData(data);
                tbhtml.unshift("<tbody>");
                tbhtml.push("</tbody>");
                $(t).html(tbhtml.join(""));
                //alert($(t).html());
                this.rePosDrag();

               	/*----------------start---------------*/
               	//add by lwj 10.8.6
               	//对第二列的图标添加事件               	
				this.firePicColumnEvent();
				//对各行数据中的钩选框，添加儿子的钩选事件
				//if(p.showcheckbox){
				if(p.showcheckbox && p.cbLinked){//modify by lwj 12.5.14 加上钩选框是否关联孩子属性
					this.fireLinkRowsChkEvent();
				}
               	/*----------------end---------------*/
                
                this.addRowProp();
                this.applyEvent();//add by lwj 10.3.15
                if (p.onSuccess) p.onSuccess();
                if (p.hideOnSubmit){
                	/*
                		modify by lwj 10.4.19
                		$(g.block).remove();//$(t).show();
                	*/                	
                	g.doMask('unmask');
                }
                this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                if ($.browser.opera) $(t).css('visibility', 'visible');

            },

			/*
            //---------------start---------------//
            //add by lwj 10.8.11
            //对第二列的图标添加事件
			firePicEvent: function(){
               	$(this).click(function(){
               		//function doChildHide(id){
					function doChildHide(id, c){
	               		var dObj = $("#"+p.table_id+"_row_link_div_"+id);
	               		//if(dObj.hasClass("treegrid_row_link_plus_open_pic_div")){
						if(!c && dObj.hasClass("treegrid_row_link_plus_open_pic_div")){
	               			dObj.removeClass("treegrid_row_link_plus_open_pic_div")
	               				.addClass("treegrid_row_link_plus_close_pic_div");
	               			dObj.attr("title", "展开子数据");
	               		}
	               		$("tbody[name$='"+p.table_id+"_tbody_"+id+"']", g.bDiv).each(function(){
		               		this.style.display = "none";
		               		var tid = $(this).attr("id");
		               		tid = tid.substring((p.table_id+"_tbody_").length, tid.length);
		               		//doChildHide(tid);
							doChildHide(tid, true);
	               		});
               		}
					function doChildShow(id, c){
	               		var dObj = $("#"+p.table_id+"_row_link_div_"+id);
	               		//if(dObj.hasClass("treegrid_row_link_plus_open_pic_div")){
						if(!c && dObj.hasClass("treegrid_row_link_plus_close_pic_div")){
	               			dObj.removeClass("treegrid_row_link_plus_close_pic_div")
	               				.addClass("treegrid_row_link_plus_open_pic_div");
	               			dObj.attr("title", "隐藏子数据");
	               		}
	               		$("tbody[name$='"+p.table_id+"_tbody_"+id+"']", g.bDiv).each(function(){
		               		this.style.display = "";
		               		var tid = $(this).attr("id");
		               		tid = tid.substring((p.table_id+"_tbody_").length, tid.length);
		               		//doChildHide(tid);
							doChildShow(tid, true);
	               		});
               		}
               		var id = $(this).attr("id");
               		id = id.substring((p.table_id+"_row_link_div_").length, id.length);
               		var divObj = $(this);
	               	if(divObj.hasClass("treegrid_row_link_plus_close_pic_div")){
	               		//if(p.url){
	               		//	this.ajaxChildData({param: {opType: "getChildren"}, parentId: id});
	               		//}else 
	               		if(p.onAppendChild){
	               			var trObj = $("#"+p.table_id+"_row_"+id);
	               			var parentData = g.getRowData(trObj[0]);
	               			var pa = {"parentId": id, "parentData": parentData[0]};
	               			p.onAppendChild.call(this, pa);
	               		}else{
							doChildShow(id);
		                }
	               	}else if(divObj.hasClass("treegrid_row_link_plus_open_pic_div")){
	               		doChildHide(id);
	               	}
               	});
				//-----------------start-------------------------//
				//add by chw 12.04.01
				//给第二列图标添加mouseover事件
				if(p.picColuMouseoverEvent){
					$(this).hover(function(){
						if($(this).hasClass("treegrid_row_link_plus_close_pic_div")){
								$(this).trigger("click");
						}                               
					},function(){});
				}
			},
			//----------------end---------------//
			*/
			doChildShow: function (id, c){
				var dObj = $("#"+p.table_id+"_row_link_div_"+id);
				//if(dObj.hasClass("treegrid_row_link_plus_open_pic_div")){
				if(!c && dObj.hasClass("treegrid_row_link_plus_close_pic_div")){
					dObj.removeClass("treegrid_row_link_plus_close_pic_div");
					//---------------start---------------------//
					//modify by chw 12.04.26
					//如果设置了自定义的关闭样式，需要在打开状态下，移除自定义的关闭样式
					if(p.linkPicClass && p.linkPicClass.closeClass){
						dObj.removeClass(p.linkPicClass.closeClass);
					}
					dObj.addClass("treegrid_row_link_plus_open_pic_div");
					//modify by chw 12.04.26
					//如果有设置自定义的打开样式，需要添加自定义的打开样式
					if(p.linkPicClass && p.linkPicClass.openClass){
						dObj.addClass(p.linkPicClass.openClass);
					}
					//-----------------end---------------------------//
					dObj.attr("title", "隐藏子数据");
				}
				$("tbody[name$='"+p.table_id+"_tbody_"+id+"']", g.bDiv).each(function(){
					var chi_tid = $(this).attr("id");
					chi_tid = chi_tid.substring((p.table_id+"_tbody_").length, chi_tid.length);
					this.style.display = "";
					if($("#"+p.table_id+"_row_link_div_"+chi_tid).hasClass("treegrid_row_link_plus_open_pic_div")){						
						var tid = $(this).attr("id");
						tid = tid.substring((p.table_id+"_tbody_").length, tid.length);
						g.doChildShow(tid, true);
					}
				});
			},
			doChildHide: function(id, c){
				var dObj = $("#"+p.table_id+"_row_link_div_"+id);
				if(!c && dObj.hasClass("treegrid_row_link_plus_open_pic_div")){
					dObj.removeClass("treegrid_row_link_plus_open_pic_div");
					//---------------start---------------------//
					//modify by chw 12.04.26
					//如果设置了自定义的打开样式，需要在打开状态下，移除自定义的打开样式
					if(p.linkPicClass && p.linkPicClass.openClass){
						dObj.removeClass(p.linkPicClass.openClass);
					}
					dObj.addClass("treegrid_row_link_plus_close_pic_div");
					//modify by chw 12.04.26
					//如果有设置自定义的关闭样式，需要添加自定义的关闭样式
					if(p.linkPicClass && p.linkPicClass.closeClass){
						dObj.addClass(p.linkPicClass.closeClass);
					}
					//---------------------end---------------------//
					dObj.attr("title", "展开子数据");
				}
				$("tbody[name$='"+p.table_id+"_tbody_"+id+"']", g.bDiv).each(function(){
					this.style.display = "none";
					var tid = $(this).attr("id");
					tid = tid.substring((p.table_id+"_tbody_").length, tid.length);
					g.doChildHide(tid, true);
				});
			},
			/*--------------start-----------------*/
			stopPropagation: function(e){
				if (e && e.stopPropagation){
					e.stopPropagation();
				}else{
					window.event.cancelBubble = true;
				}
			},
			/*---------------end------------------*/
			/*----------------start---------------*/
            //add by lwj 10.8.11
            //对第二列的图标添加事件
			firePicEvent: function(){
               	$(this).click(function(e){
					/*
               		function doChildHide(id, c){
	               		var dObj = $("#"+p.table_id+"_row_link_div_"+id);
	               		if(!c && dObj.hasClass("treegrid_row_link_plus_open_pic_div")){
	               			dObj.removeClass("treegrid_row_link_plus_open_pic_div")
	               				.addClass("treegrid_row_link_plus_close_pic_div");
	               			dObj.attr("title", "展开子数据");
	               		}
	               		$("tbody[name$='"+p.table_id+"_tbody_"+id+"']", g.bDiv).each(function(){
		               		this.style.display = "none";
		               		var tid = $(this).attr("id");
		               		tid = tid.substring((p.table_id+"_tbody_").length, tid.length);
		               		doChildHide(tid, true);
	               		});
               		}
					*/
               		var id = $(this).attr("id");
               		id = id.substring((p.table_id+"_row_link_div_").length, id.length);
               		var divObj = $(this);
	               	if(divObj.hasClass("treegrid_row_link_plus_close_pic_div")){
	               		if(p.onAppendChild){
	               			var trObj = $("#"+p.table_id+"_row_"+id);
	               			var parentData = g.getRowData(trObj[0]);
	               			var pa = {"parentId": id, "parentData": parentData[0]};
	               			p.onAppendChild.call(this, pa);
	               		}else{
							/*
		               		var cObj = $("tbody[name$='_tbody_"+id+"']", g.bDiv);
		               		cObj.each(function(){
		               			//this.style.display = "block";
		               			this.style.display = "";// modify by lwj 10.12.07 block在火狐下会错位
			               		divObj.removeClass("treegrid_row_link_plus_close_pic_div")
			               			  .addClass("treegrid_row_link_plus_open_pic_div");
			               		divObj.attr("title", "隐藏子数据");
		               		});*/
							g.doChildShow(id);
		                }
	               	}else if(divObj.hasClass("treegrid_row_link_plus_open_pic_div")){
	               		g.doChildHide(id);
	               	}
					g.stopPropagation(e);
               	});
				/*-----------------start-------------------------*/
				//add by chw 12.04.01
				//给第二列图标添加mouseover事件
				if(p.picOnMouseover){
					$(this).hover(function(){
						if($(this).hasClass("treegrid_row_link_plus_close_pic_div")){
								$(this).trigger("click");
						}                               
					},function(){});
				}
			},
			/*----------------end---------------*/
/*
            //----------------start--------------//
            //add by lwj 10.8.11
            //对第二列的图标添加事件
			firePicEvent: function(){
               	$(this).click(function(){
               		function doChildHide(id){
	               		var dObj = $("#"+p.table_id+"_row_link_div_"+id);
	               		if(dObj.hasClass("treegrid_row_link_plus_open_pic_div")){
	               			dObj.removeClass("treegrid_row_link_plus_open_pic_div")
	               				.addClass("treegrid_row_link_plus_close_pic_div");
	               			dObj.attr("title", "展开子数据");
	               		}
	               		$("tbody[name$='"+p.table_id+"_tbody_"+id+"']", g.bDiv).each(function(){
		               		this.style.display = "none";
		               		var tid = $(this).attr("id");
		               		tid = tid.substring((p.table_id+"_tbody_").length, tid.length);
		               		doChildHide(tid);
	               		});
               		}
               		var id = $(this).attr("id");
               		id = id.substring((p.table_id+"_row_link_div_").length, id.length);
               		var divObj = $(this);
	               	if(divObj.hasClass("treegrid_row_link_plus_close_pic_div")){
	               		//if(p.url){
	               		//	this.ajaxChildData({param: {opType: "getChildren"}, parentId: id});
	               		//}else 
	               		if(p.onAppendChild){
	               			var trObj = $("#"+p.table_id+"_row_"+id);
	               			var parentData = g.getRowData(trObj[0]);
	               			var pa = {"parentId": id, "parentData": parentData[0]};
	               			p.onAppendChild.call(this, pa);
	               		}else{
		               		var cObj = $("tbody[name$='_tbody_"+id+"']", g.bDiv);
		               		cObj.each(function(){
		               			//this.style.display = "block";//
		               			this.style.display = "";// modify by lwj 10.12.07 block在火狐下会错位
			               		divObj.removeClass("treegrid_row_link_plus_close_pic_div")
			               			  .addClass("treegrid_row_link_plus_open_pic_div");
			               		divObj.attr("title", "隐藏子数据");
		               		});
		                }
	               	}else if(divObj.hasClass("treegrid_row_link_plus_open_pic_div")){
	               		doChildHide(id);
	               	}
               	});
				//-----------------start-------------------------//
				//add by chw 12.04.01
				//给第二列图标添加mouseover事件
				if(p.picColuMouseoverEvent){
					$(this).hover(function(){
						if($(this).hasClass("treegrid_row_link_plus_close_pic_div")){
								$(this).trigger("click");
						}                               
					},function(){});
				}
			},
			//----------------end---------------//
*/
            /*----------------start---------------*/
            //add by lwj 10.8.11
            //对第二列的图标添加事件	
			ajaxChildData: function(paramObj){
				if(!paramObj){
					return false;
				}
				if(!paramObj.param){
					return false;
				}
                if (p.hideOnSubmit){
					g.doMask('mask');
                }  
                if (p.extParam) {
                    for (var pi = 0; pi < p.extParam.length; pi++) paramObj.param[paramObj.param.length] = p.extParam[pi];
                }                
				$.ajax({
                    type: p.method,
                    url: p.url,
                    data: paramObj.param,
                    dataType: p.dataType,
                    success: function(data) {
                    	//alert(JSON.encode(data));
                    	if (data != null && data.error != null) { 
                    		if (p.onError) { 
                    			p.onError(data); 
                    			g.hideLoading(); 
                    		} 
                    	} else {
	    					var pa = {"parentId": paramObj.parentId+""};
							var d = this.changeJsonObject(data, pa);
							//alert(JSON.encode(d));
	    					if(d){
								this.appendChild(d[0], pa);
							}							
                    	} 
                    },
                    error: function(data) { 
                    	try { 
                    		if (p.onError) { 
                    			p.onError(data); 
                    		} else { 
                    			alert("获取数据发生异常");
                    		} 
                    		g.hideLoading(); 
                    	} catch (e) { }
                    }
                });
			},
			/*----------------end---------------*/

            /*----------------start---------------*/
            //add by lwj 10.8.11
            //对钩选框，添加儿子的钩选事件
			fireChkEvent: function(){
				function doChildChk(obj, ischeck){					
                    if (ischeck) {
                        obj.parent().parent().parent().addClass("trSelected");
                    } else {
                        obj.parent().parent().parent().removeClass("trSelected");
                    }               		
					var id = obj.attr("id");
               		id = id.substring((p.table_id+"_chk_").length, id.length);
               		//对钩选框ID对应的TBODY下的钩选框（儿子钩选框）进行关联操作
					/*
	               	$("tbody[name='"+p.table_id+"_tbody_"+id+"']", g.bDiv).each(function(){
		               	$(":checkbox.itemchk", this).each(function(){
			               	if(this.name == (p.table_id+"_chk_"+id)){
			               		this.checked = ischeck;
			               		doChildChk($(this), ischeck);
			               	}
		               	});
	               	});
					*/
					//对钩选框ID对应的TBODY下的钩选框（儿子钩选框）进行关联操作
	               	$("tbody[name='"+p.table_id+"_tbody_"+id+"']", g.bDiv).each(function(){
						var _parent = $(this).children("tr");
		               	$(":checkbox.itemchk", this).each(function(){
			               	if(this.name == (p.table_id+"_chk_"+id)){
			               		this.checked = ischeck;
								if(this.checked){
									$(this).attr("disabled", "disabled");
									$(_parent).attr("trcheckboxDis", this.checked);
								}else{
									$(this).attr("disabled", "");
									$(_parent).removeAttr("trcheckboxDis");
								}
			               		doChildChk($(this), ischeck);
			               	}
		               	});
	               	});
               	}
               	$(this).click(function(){
               		var ischeck = $(this).attr("checked");
               		doChildChk($(this), ischeck);
               	});   	
			},
			/*----------------end---------------*/


            /*----------------start---------------*/
            //add by lwj 10.8.6
            //对第二列的图标添加事件	 	
			firePicColumnEvent: function(){
				var fn = this.firePicEvent;
               	$("tbody tr ins[class^='treegrid_row_link_plus_']", g.bDiv).each(function(i){
               		fn.call(this);
               	});               	
			},
			/*----------------end---------------*/

            /*----------------start---------------*/
            //add by lwj 10.8.6
            //对各行数据中的钩选框，添加儿子的钩选事件  
			fireLinkRowsChkEvent: function(){
				var fn = this.fireChkEvent;
               	$(":checkbox.itemchk", g.bDiv).each(function(){
               		fn.call(this);   		
               	});               	
			},
			/*----------------end---------------*/


            /*----------------start---------------*/
            //添加clearAllRows方法 add by lwj 10.3.15
            //清空所有的表格数据
            clearAllRows: function(){
				//$(t).html("");
				$(t).empty();//modify by lwj 11.8.17
				if(p.showcheckbox){
					$("input:first", g.hDiv).attr("checked", "");
				}
            	g.doUsePager();
				p.isSuccessSearch = false;
            },
            /*----------------end---------------*/

            /*----------------start---------------*/
            //添加applyEvent方法 add by lwj 10.3.15
            //处理各列注册的事件
            applyEvent: function(row){
                if(p.colModel){
                	var tr_object, td_object, div_object;
					//-------------start-------------//
					// modify by chw 12.1.14
					var o = $("tbody tr", t);
					if(row && row.length){
						o = row;
					}
                	//$("tbody tr", t).each(function(i){
					//-------------end-------------//
					o.each(function(i){
                		tr_object = this;
	                	$(p.colModel).each(function(j) {
	                		if(this.fireEvent){
	                			/*td_object = $(tr_object).children()[p.showcheckbox ? (j+1) : j];*/
	                			/*---------------start---------------*/
	                			//加了一列图片，索引要加1
	                			//td_object = $(tr_object).children()[p.showcheckbox ? (j+2) : (j+1)];
								td_object = $(tr_object).children()[p.showcheckbox ? (j+1) : j];
	                			/*---------------end---------------*/
	                			div_object = $(td_object).children()[0];
	                			/*
	                			//原来没传g
	                			this.fireEvent(tr_object, div_object);
	                			*/
	                			this.fireEvent({"tr_object": tr_object, "div_object": div_object, "grid": g});	                			
	                		}
	                	});
                	});
                }
            },

            /*----------------end---------------*/
            
            /*----------------start---------------*/
            //添加dealData方法 add by lwj 10.3.15
            dealData: function(jsonObject){
            //alert(JSON.encode(jsonObject));
            	try{
					var resultID = jsonObject.resultID;
					var resultMsg = jsonObject.resultMsg;
					if(resultID){
						if(resultID == p.successResultID){
							return true;
						}else{
							if(p.showErrorMsg){
								alert(resultMsg);
							}
							return false;
						}
					}else{//alert(resultID);
						alert(p.errormsg);
						return false;
					}
				}catch(_error){
					throw _error;
				}
            },
            /*----------------end---------------*/
            
            /*----------------start---------------*/
            //代码独立出来，添加getDataArr方法 
            //add by lwj 10.8.4
            /*
			getDataArr: function(o){
				var size = p.colModel.length;
				var temp_name, tmp = "",arr = new Array(size);
				for(var j=0; j<size; j++){
					temp_name = p.colModel[j].name;
					tmp = eval("o."+temp_name);
					if(typeof(tmp)=="number"){
						tmp = tmp==0 ? "0" : tmp;
					}else{
						tmp = tmp ? tmp : "";
					}
					arr[j] = tmp;
				}
				return arr;
			},
			*/
			getDataArr: function(list){
				var size = p.colModel.length;
				var temp_name, tmp = "",arr = new Array(size);
				for(var j=0; j<size; j++){
					temp_name = p.colModel[j].name;
					/* the old code
					tmp = eval("list."+temp_name);
					*/
					//---------------start--------------//
					// modify by lwj 11.2.23
					if(temp_name.indexOf("\.") != -1){
						var arrs = temp_name.split("\.");
						tmp = list[arrs[0]];
						for(var m=1; m<arrs.length; m++){
							//modify by chw 12.05.09
							//防止出现传递多级数据时，数据为空的情况
							//tmp = tmp[arrs[m]];
							if(tmp && tmp[arrs[m]] != undefined && tmp[arrs[m]] != null){
								tmp = tmp[arrs[m]];
							}else{
								tmp = "";
							}
						}
					}else{
						tmp = list[temp_name];
					}
					//---------------end--------------//
					if(typeof(tmp)=="number"){
						tmp = tmp==0 ? "0" : tmp;
					}else{
						tmp = tmp ? tmp : "";
					}
					arr[j] = tmp;
				}
				return arr;
			},			
			/*----------------end---------------*/
            
            /*----------------start---------------*/
            //添加changeJsonObject方法 add by lwj 10.3.8
			// modify by lwj 10.4.13
			// modify by lwj 10.8.4 parentId=id,说明有孩子，如果="null"，说明没有孩子，如果=父亲的ID，说明是父亲的孩子
			changeJsonObject: function(jsonObject, param){
            	try{
					var temp_object;
					//var temp_name;
					var o = [{}];
					o[0].total = jsonObject.total;
					o[0].page = jsonObject.page;
					o[0].rows = [];
					//var size = p.colModel.length;
					//var tmp = "";
					var list, cList, rD;
					/*--------------start-----------*/
					//对行的ID，根据记录数进行赋值
					var index = 0;
					if(o[0].page){
						index = p.rp * (parseInt(o[0].page)-1);
						index = index>=0 ? index : 0;
					}
					/*--------------end-----------*/
					
					function appendC(list, parentId){
						if(list.children){
							for(var k=0; k<list.children.length; k++){
								cList = list.children[k];
								if(cList){
									//rD = {"id": (parentId+"_"+k), "cell": g.getDataArr(cList), parentId: parentId+"", hasChild: false, tbody: (k==0 ? true : false), _tbody: (k==list.children.length-1 ? true : false)};
									rD = {
											"id": (parentId+"_"+k), 
											"cell": g.getDataArr(cList), 
											parentId: parentId+"", 
											hasChild: false
										};
									if(cList.children){
										rD.hasChild = true;
									}
									o[0].rows.push(rD);
								}
								appendC(cList, (parentId+"_"+k));
							}
						}	
					}
					var rowNum = 0;
					if(param.noDel != undefined && param.noDel){
						var trs = $("tbody[name='"+p.table_id+"_tbody_"+param.parentId+"']", g.bDiv);
						rowNum = trs.length;
					}

					if(jsonObject && jsonObject.resultList){
						for(var i=0; i<jsonObject.resultList.length; i++){
							list = jsonObject.resultList[i];
							if(list){
								//rD = {"id": (index+i)+"", "cell": this.getDataArr(list), parentId: "null", hasChild: false, tbody: false, _tbody: false};
								rD = {
										//"id": ((param&&param.parentId)?(param.parentId+"_"+i)):(index+i)+""),//(index+i)+"",
										"id": ((param&&param.parentId)?(param.parentId+"_"+(rowNum+i)):(index+rowNum+i)+""),//(index+i)+"", 
										"cell": this.getDataArr(list), 
										parentId: (param.parentId?param.parentId:"null"), 
										hasChild: false
									};
								if(list.children){
									rD.parentId = (param&&param.parentId) ? param.parentId : (index+i)+"";
									rD.hasChild = true;
								}
								o[0].rows.push(rD);
								appendC(list, rD.id);
							}
						}
					}
					return o;
				}catch(_error){
					throw _error;
				}
            },
            /*----------------end---------------*/
            
            
            /*----------------start---------------*/
            //添加freshParam方法 add by lwj 10.3.11 
            //如果表格重载或者重新查询时，要对参数进行重新初始化之类的处理
            freshParam: function(param){
				$.extend(p, param);
            },
            /*----------------end---------------*/ 
            
            /*----------------start---------------*/
            //add by lwj 10.3.9
            //添加getRowData方法，根据传入的TR对象,获取TR中的CH属性，并返回封装后的JSON对象
            //如果row_object即TR对象为空，则根据表格中　有选中样式的　TR进行操作
            //该方法只适用于　表格各行数据无钩选框的情况
            getRowData: function(row_object){
                var row_objects = [];
                var chd = null;
                if(row_object){
	            	chd = $(row_object).attr("chd");
                }else{
	            	if(!p.showcheckbox){
						/*-------------start----------------*/
						//modify by chw 12.04.01
						//防止内嵌table导致获取不到正确的tr行
		                //var trs = $(g.bDiv).find("tr");
						var trs = $(g.bDiv).find("tbody tr[id^="+p.table_id+"_row_]");
						/*-------------end----------------*/
		                for(var i=0; i<trs.length; i++){
		                	if($(trs[i]).hasClass("trSelected")){
		                		chd = $(trs[i]).attr("chd");
								break;
		                	}
		                }
		             }
                }
               	if(chd){
               		row_objects.push({});
            		g.generalObject(row_objects, chd, 0);
            	}
				return row_objects;
            },
            /*----------------end---------------*/              
                     
            changeSort: function(th) { //change sortorder

                if (this.loading) return true;

                $(g.nDiv).hide(); $(g.nBtn).hide();

                if (p.sortname == $(th).attr('abbr')) {
                    if (p.sortorder == 'asc') p.sortorder = 'desc';
                    else p.sortorder = 'asc';
                }

                $(th).addClass('sorted').siblings().removeClass('sorted');
                $('.sdesc', this.hDiv).removeClass('sdesc');
                $('.sasc', this.hDiv).removeClass('sasc');
                $('div', th).addClass('s' + p.sortorder);
                p.sortname = $(th).attr('abbr');
                
                if (p.onChangeSort)
                    p.onChangeSort(p.sortname, p.sortorder);
                else
                    this.populate();

            },
            buildpager: function() { //rebuild pager based on new properties

                $('.pcontrol input', this.pDiv).val(p.page);
                $('.pcontrol span', this.pDiv).html(p.pages);
                /* the old code
                var r1 = (p.page - 1) * p.rp + 1;
                var r2 = r1 + p.rp - 1;
                */
                /*---------start----------*/
                //防止字符串 modify by lwj 10.12.03
                var r1 = (parseInt(p.page) - 1) * parseInt(p.rp) + 1;
                var r2 = r1 + parseInt(p.rp) - 1;
                /*---------end----------*/

                if (p.total < r2) r2 = p.total;

                var stat = p.pagestat;

                stat = stat.replace(/{from}/, r1);
                stat = stat.replace(/{to}/, r2);
                stat = stat.replace(/{total}/, p.total);
                /*modify by lwj 10.7.16*/
                /*
                $('.pPageStat', this.pDiv).html(stat);
                */
                if(p.usepager){
                	$('.pPageStat', this.pDiv).html(stat);
                }
            },
            
            /*            
            populate: function() { //get latest data 
                //log.trace("开始访问数据源");
                if (this.loading) return true;
                if (p.onSubmit) {
                    var gh = p.onSubmit();
                    if (!gh) return false;
                }
                this.loading = true;
                if (!p.url) return false;
                $('.pPageStat', this.pDiv).html(p.procmsg);
                $('.pReload', this.pDiv).addClass('loading');
                $(g.block).css({ top: g.bDiv.offsetTop });
                if (p.hideOnSubmit) $(this.gDiv).prepend(g.block); //$(t).hide();
                if ($.browser.opera) $(t).css('visibility', 'hidden');
                if (!p.newp) p.newp = 1;
                if (p.page > p.pages) p.page = p.pages;
                //var param = {page:p.newp, rp: p.rp, sortname: p.sortname, sortorder: p.sortorder, query: p.query, qtype: p.qtype};
                var param = [
					 { name: 'pageNumber', value: p.newp }
					, { name: 'pageSize', value: p.usepager ? p.rp : 1000}
					, { name: 'sortname', value: p.sortname }
					, { name: 'sortorder', value: p.sortorder }
					, { name: 'query', value: p.query }
					, { name: 'qtype', value: p.qtype }
					, { name: 'qop', value: p.qop }
				];
                //param = jQuery.extend(param, p.extParam);
                if (p.extParam) {
                    for (var pi = 0; pi < p.extParam.length; pi++) param[param.length] = p.extParam[pi];
                }

                $.ajax({
                    type: p.method,
                    url: p.url,
                    data: param,
                    dataType: p.dataType,
                    success: function(data) { if (data != null && data.error != null) { if (p.onError) { p.onError(data); g.hideLoading(); } } else { 
    					//g.addData(data);
    					// modify by lwj 10.3.12    					
    					if(g.dealData(data)){
	                    	g.addData(g.changeJsonObject(data, {'pageNumber': p.newp, 'pageSize': p.rp})[0]);
	                    	p.isSuccessSearch = true;
    					}else{
    						g.hideLoading();
    					}
                    } },
                    error: function(data) { try { if (p.onError) { p.onError(data); } else { alert("获取数据发生异常;") } g.hideLoading(); } catch (e) { } }
                });
            },
            */

            /*
            	对表格进行遮罩操作
            	//add by lwj 10.4.19
            	modify by lwj 10.6.27
            */
            doMask: function(type){
               	//var o = document.getElementById(p.container_id);
				var o = g.gDiv;//modify by lwj 11.6.9
               	if(p.maskObject){
               		if(typeof(p.maskObject) == "string"){
               			o = document.getElementById(p.maskObject);
               		}else if(typeof(p.maskObject) == "object"){
               			o = p.maskObject;
               		}
                }
                if(!g.maskDiv){
               		g.maskDiv = document.createElement('div'); //creat blocker
                	g.maskDiv.setAttribute("id", p.container_id+"_maskDiv");
		        	g.maskDiv.className = 'gBlock';
			        $(g.maskDiv).fadeTo(0, p.blockOpacity);
					var innerIframe = "	<iframe style=\"display: block; z-index: -1; filter: alpha(Opacity='0'); left: -1px;"
									+"		left: expression(((parseInt(document.getElementById('"+p.container_id+"_maskDiv').currentStyle.borderLeftWidth)||0)*-1)+'px'); "
									+"		width: expression(document.getElementById('"+p.container_id+"_maskDiv').offsetWidth+'px'); "
									+"		position: absolute; top: -1px; "
									+"		top: expression(((parseInt(document.getElementById('"+p.container_id+"_maskDiv').currentStyle.borderTopWidth)||0)*-1)+'px'); "
									+"		height: expression(document.getElementById('"+p.container_id+"_maskDiv').offsetHeight+'px');\""
									+"		tabIndex=-1 src=\"\" frameBorder=0>"
									+"	</iframe>";			        
			        $(g.maskDiv).prepend(innerIframe);
		        }
		        var gh = $(o).height();
		        //var gw = $(o).width();
				var gw = $(o).width()+2;//modify by lwj 11.6.16 不然IE6右边会露一点遮不到
		        //var gtop = o.offsetTop;
				var gtop = 0;//modify by lwj 11.6.9
		        $(g.maskDiv).css({
				    width: gw,
				    height: gh,
				    //position: 'relative',
				    position: 'absolute',
				    //marginBottom: (gh * -1),
					marginBottom: 0,//modify by lwj 11.6.9
				    zIndex: 1//,
				    //top: gtop,//modify by lwj 11.6.15
				    //left: '0px'//modify by lwj 11.6.15
				});

                if(!g.maskMsgDiv){
                	g.maskMsgDiv = document.createElement('div'); //creat blocker
                	g.maskMsgDiv.className = 'grid-mask-msg';
					$(g.maskMsgDiv).html("<div>请稍候...</div>");
                }
                if(type == 'mask'){
                	if(!g.tmpDiv){
						g.tmpDiv = document.createElement('div'); //creat blocker
						g.tmpDiv.className = p.gridClass;
					}
               		$(g.tmpDiv).append(g.maskDiv);
					$(g.tmpDiv).append(g.maskMsgDiv);						
					if(p.maskObject){
						$(o).prepend(g.tmpDiv);
					}else{
						$(this.gDiv).prepend(g.tmpDiv);
					}
					//---------------start----------------------//
					// modify by lwj 11.6.16

					//var t = Math.round($(o).height() / 2 - ($(g.maskMsgDiv).height() - parseInt($(g.maskMsgDiv).css("padding-top")) - parseInt($(g.maskMsgDiv).css("padding-bottom"))) / 2)+"px";
					//var l = Math.round($(o).width() / 2 - ($(g.maskMsgDiv).width() - parseInt($(g.maskMsgDiv).css("padding-left")) - parseInt($(g.maskMsgDiv).css("padding-right"))) / 2)+"px";
					var t = Math.round($(o).height() / 2 - ($(g.maskMsgDiv).height() - parseInt($(g.maskMsgDiv).css("padding-top")) - parseInt($(g.maskMsgDiv).css("padding-bottom"))) / 2);
					var l = Math.round($(o).width() / 2 - ($(g.maskMsgDiv).width() - parseInt($(g.maskMsgDiv).css("padding-left")) - parseInt($(g.maskMsgDiv).css("padding-right"))) / 2);	l = l - 4;//减4是因为DIV 样式 padding: 2px;			
					var _top, _left;
					if(p.maskObject){
						_top = $(o).offset().top + t + "px";
						_left = $(o).offset().left + l + "px";
					}else{
						_top = t + "px";
						_left = l + "px";
					}
					//$(g.maskMsgDiv).css("top", t);
					//$(g.maskMsgDiv).css("left", l);
					$(g.maskMsgDiv).css("top", _top);
					$(g.maskMsgDiv).css("left", _left);
					//---------------end----------------------//
                }else if(type == 'unmask'){
                	$(g.maskMsgDiv).remove();
                	$(g.maskDiv).remove();
                	$(g.tmpDiv).remove();              	               	
                }
                
            },
            
            getParentId: function(_param){
				var keyValue = _param.keyValue;
				var tr = null;
				for(var i=0; i<p.colModel.length; i++){
					if(p.colModel[i].name == _param.keyId){//说明是关键属性列
						var $trs = $("tbody tr[id^="+p.table_id+"_row_]", g.bDiv);
						for(var j=0; j<$trs.length; j++){
							var _tds = $($trs[j]).children("td");
							//--------------start-------------------//
							//modify by chw 12.05.02
							//i的值就是关键属性列所在的td的下标(分有勾选框跟无勾选框状态)。
							//alert($("div", $(_tds[(p.showcheckbox ? i+1 : i)])).html());
							var text = $("div", $(_tds[(p.showcheckbox ? i+1 : i)])).attr("title");//text();
							//alert(text);
							if(text == _param.keyValue){
								tr = $trs[j];
								break;
							}
							//--------------end-------------------//
						}
					}
				}
				if(tr!=null){
					var tbodyPrefix = p.table_id + "_tbody_";
					var parentId = $(tr).parent("tbody").attr("id");
					_param.parentId = parentId.substr(tbodyPrefix.length, parentId.length);
				}
				/*
				var tbodyPrefix = p.table_id + "_tbody_";
				for(var i=0; i<trs.length; i++){
					var tr = $(trs[i]);
					if(tr.attr("chd").indexOf(keyValue) > -1){
						parentId = tr.parent("tbody").attr("id");
						_param.parentId = parentId.substr(tbodyPrefix.length, parentId.length);
						break;
					}
				}
				*/
				return _param.parentId;
			},
			getChildrenLen: function(_param){
				var keyValue = _param.keyValue;
				var trs = $("tbody tr[id^="+p.table_id+"_row_]", g.bDiv);
				var tbodyPrefix = p.table_id + "_tbody_";
				for(var i=0; i<trs.length; i++){
					var tr = $(trs[i]);
					if(tr.attr("chd").indexOf(keyValue) > -1){
						parentId = tr.parent("tbody").attr("id");
						_param.parentId = parentId.substr(tbodyPrefix.length, parentId.length);
						break;
					}
				}
				return _param.parentId;
			},
            /*----------------start---------------*/
            //add by lwj 10.8.10 添加孩子行
            appendChild: function(data, param){
            	//alert("aa:"+JSON.encode(data));
                if (!data) {
	                if(p.usepager){
	                	$('.pPageStat', this.pDiv).html(p.errormsg);
	                }
                    return false;
                }
                
                function doChildChk(parentId){
               		//对钩选框ID对应的TBODY下的钩选框（儿子钩选框）进行关联操作
	               	$("tbody[name='"+p.table_id+"_tbody_"+parentId+"']", g.bDiv).each(function(){
		               	$(":checkbox.itemchk", this).each(function(){
			               	if(this.name == (p.table_id+"_chk_"+parentId)){
			               		chkFn.call(this);
			               		var id = this.id.substring((p.table_id+"_chk_").length, this.id.length);
			               		doChildChk(id);
			               	}
		               	});
	               	});
                }
                function doChildPic(parentId){
                	var cObj = $("tbody[name='"+p.table_id+"_tbody_"+parentId+"']", g.bDiv);
                	if(cObj.length){
						//-----------------------start-------------------------------//
						//modify chw 12.04.26
						//添加文件夹打开或者关闭样式
                		//父亲文件夹图标换成打开状态
	                	$("#"+p.table_id+"_row_link_div_"+parentId).removeClass("treegrid_row_link_plus_close_pic_div");
						if(p.linkPicClass && p.linkPicClass.closeClass){
							$("#"+p.table_id+"_row_link_div_"+parentId).removeClass(p.linkPicClass.closeClass);
						}
	                	$("#"+p.table_id+"_row_link_div_"+parentId).addClass("treegrid_row_link_plus_open_pic_div");
						if(p.linkPicClass && p.linkPicClass.openClass){
							$("#"+p.table_id+"_row_link_div_"+parentId).addClass(p.linkPicClass.openClass);
						}
						//-----------------------------------end--------------------------//
	                	$("#"+p.table_id+"_row_link_div_"+parentId).attr("title", "隐藏子数据");
		                cObj.each(function(){
	               			/*this.style.display = "block";*/
	               			this.style.display = "";// modify by lwj 10.12.07 block在火狐下会错位
							//modify by chw 12.10.16
							//结构改变，将div改为ins
			               	//$("tr div[class^='treegrid_row_link_plus_']", this).each(function(){
							$("tr ins[class^='treegrid_row_link_plus_']", this).each(function(){
								//modify by chw 12.11.06
								//如果插入数据时没有删除原先的数据，则因为是使用bind方法绑定事件，导致原先的对象会绑定多次事件
								//所以需要判断当前对象是否有绑定了某个事件
								if(!$(this).data("events") || !$(this).data("events")["click"]) {
			               			picFn.call(this);
									var id = this.id.substring((p.table_id+"_row_link_div_").length, this.id.length);
			               			doChildPic(id);
								}
			               	});
		                });
	                }
                }
				function removeChild(parentId){
	               	$("tbody[name='"+p.table_id+"_tbody_"+parentId+"']", g.bDiv).each(function(){
						var id = this.id.substring((p.table_id+"_tbody_").length, this.id.length);
						removeChild(id);
						$(this).remove();
	               	});
				}
				function fireChildRowsEvent(parentId){
					var cObj = $("tbody[name='"+p.table_id+"_tbody_"+parentId+"']", g.bDiv);
	               	cObj.each(function(){
						var r = $("tr", this)[0];
						g.rowProp.call(r);
						var id = this.id.substring((p.table_id+"_tbody_").length, this.id.length);
						fireChildRowsEvent(id);
	               	});
				}

				function recuChild(parentId){
					var obj = null;
					var child = $("tbody[name='"+parentId+"']", g.bDiv);
					if(child.length > 0){
						obj = recuChild($(child[child.length-1]).attr("id"));
					}else{
						obj = $("tbody[id='"+parentId+"']", g.bDiv);
					}
					return obj;
				}
				//如果调用appendChild方法允许删除原先的孩子数据
				if(param.noDel != undefined && !param.noDel){
					//将父亲行下的所有子行删除
					removeChild(param.parentId);
				}

				var tbhtml = this.parseData(data);
                var parentObj = $("#"+p.table_id+"_tbody_"+param.parentId);
				
				//再将孩子加入父亲行下面
				//$(tbhtml.join("")).insertAfter(parentObj);
				var c = $(tbhtml.join(""));// modify by chw 12.1.14
				//modify by chw 12.11.06
				//如果调用appendChild方法时，不允许删除原先的孩子数据，则直接插入到当前孩子节点的后面。
				if(param.noDel != undefined && param.noDel){
					var childTrs = $("tbody[name='"+p.table_id+"_tbody_"+param.parentId+"']", g.bDiv);
					if(childTrs.length > 0){//如果当前父亲数据有孩子行，则需要递归到最后一个孩子节点那边，保证新插入的数据在最后一行
						var child = recuChild($(childTrs[childTrs.length-1]).attr("id"));
						//c.insertAfter($(childTrs[childTrs.length-1]));
						c.insertAfter(child);
					}else{//如果没有孩子节点，则直接插入到当前父亲行后面
						c.insertAfter(parentObj);
					}
				}else{
					c.insertAfter(parentObj);// modify by chw 12.1.14
				}

				//对加入的孩子行添加行事件
				fireChildRowsEvent(param.parentId);
				this.applyEvent($("tr", c));// add by chw 12.1.14
                var picFn = this.firePicEvent;
                var chkFn = this.fireChkEvent;
		
                doChildPic(param.parentId);
                //if(p.showcheckbox){
				if(p.showcheckbox && p.cbLinked){//modify by lwj 12.5.14 加上钩选框是否关联孩子属性
                	doChildChk(param.parentId);
					//如果父亲行勾选框有勾选，则需要级联勾选孩子节点
					alert($("tbody tr[id="+p.table_id+"_row_"+param.parentId+"]", g.bDiv).children("td.chboxtd").length);
					alert($("tbody tr[id="+p.table_id+"_row_"+param.parentId+"]", g.bDiv).children("td.chboxtd").children().children("input.itemchk").length);
					var checked = $("tbody tr[id="+p.table_id+"_row_"+param.parentId+"]", g.bDiv).children("td.chboxtd").children().children("input.itemchk")[0].checked;
					$("tbody tr[id^="+p.table_id+"_row_"+param.parentId+"_]", g.bDiv).each(
						function() {
							$("input.itemchk", this).each(function() {
								var ptr = $(this).parent().parent().parent();
								if (checked) {
									this.checked = checked;
									ptr.addClass("trSelected");
									$(this).attr("disabled", "disabled");
								}
								else {
									this.checked = checked;
									ptr.removeClass("trSelected");
									$(this).attr("disabled", "");
								}
								if (p.onrowchecked) {
									p.onrowchecked.call(this);
								}
								g.freshCheckboxState();
							});
						}
					);
				}
            },
            /*----------------end---------------*/
            
            populate: function() { //get latest data
                //log.trace("开始访问数据源");
                if (this.loading) return true;
                if (p.onSubmit) {
                    var gh = p.onSubmit();
                    if (!gh) return false;
                }
                this.loading = true;
                //if (!p.url) return false;
               	
	            /*----------------start---------------*/
	            //modify by lwj 10.6.21
	            //如果两个表格联动，后面的表格usepager属性为false，即不显示"页面操作菜单栏"，
	            //这时，当第一个表格点击查询第二个表格时，相关状态会在第一个表格的"页面操作菜单栏"中体现
                if(p.usepager){
                	$('.pPageStat', this.pDiv).html(p.procmsg);
                	$('.pReload', this.pDiv).addClass('loading');
                }
                /*----------------end---------------*/
                            
                $(g.block).css({ top: g.bDiv.offsetTop });
                if (p.hideOnSubmit){
                	/*
                		modify by lwj 10.4.19
                		$(this.gDiv).prepend(g.block); //$(t).hide();
                	*/
					g.doMask('mask');
                }                            
                if ($.browser.opera) $(t).css('visibility', 'hidden');
                if (!p.newp){
                	p.newp = 1;
                }
                if (p.page > p.pages) p.page = p.pages;
                //var param = {page:p.newp, rp: p.rp, sortname: p.sortname, sortorder: p.sortorder, query: p.query, qtype: p.qtype};
                var param = [
					 { name: 'pageNumber', value: p.newp }
					, { name: 'pageSize', value: p.usepager ? p.rp : 1000}
					, { name: 'sortname', value: p.sortname }
					, { name: 'sortorder', value: p.sortorder }
					, { name: 'query', value: p.query }
					, { name: 'qtype', value: p.qtype }
					, { name: 'qop', value: p.qop }
				];
				
                //param = jQuery.extend(param, p.extParam);
                if (p.extParam) {
                    for (var pi = 0; pi < p.extParam.length; pi++) param[param.length] = p.extParam[pi];
                }
				
				function doData(){
					
   					if(g.dealData(p.tableData)){
                    	g.addData(g.changeJsonObject(p.tableData, {'pageNumber': p.newp, 'pageSize': p.rp})[0]);
                    	p.isSuccessSearch = true;
   					}else{
   						g.hideLoading();
   					}
				}
				//alert(JSON.encode(p.tableData));
				if(p.tableData && !p.url){
   					doData();
				}else if(p.url){
					$.ajax({
	                    type: p.method,
	                    url: p.url,
	                    data: param,
	                    dataType: p.dataType,
	                    success: function(data) {
	                    	//alert(JSON.encode(data));
	                    	if (data != null && data.error != null) { 
	                    		if (p.onError) { 
	                    			p.onError(data); 
	                    			g.hideLoading(); 
	                    		} 
	                    	} else {
		    					p.tableData = data;
		    					doData();
	                    	} 
	                    },
	                    error: function(data) { 
	                    	try { 
	                    		if (p.onError) { 
	                    			p.onError(data); 
	                    		} else { 
	                    			alert("获取数据发生异常");
	                    		} 
	                    		g.hideLoading(); 
	                    	} catch (e) { }
	                    }
	                });
				}
            },
            
            doSearch: function() {
                var queryType = $('select[name=qtype]', g.sDiv).val();
                var qArrType = queryType.split("$");
                var index = -1;
                if (qArrType.length != 3) {
                    p.qop = "Eq";
                    p.qtype = queryType;
                }
                else {
                    p.qop = qArrType[1];
                    p.qtype = qArrType[0];
                    index = parseInt(qArrType[2]);
                }
                p.query = $('input[name=q]', g.sDiv).val();
                //添加验证代码
                if (p.query != "" && p.searchitems && index >= 0 && p.searchitems.length > index) {
                    if (p.searchitems[index].reg) {
                        if (!p.searchitems[index].reg.test(p.query)) {
                            alert("你的输入不符合要求!");
                            return;
                        }
                    }
                }
                p.newp = 1;
                this.populate();
            },
            changePage: function(ctype) { //change page
				
                if (this.loading) return true;
				
                switch (ctype) {
                    case 'first': p.newp = 1; break;
                    case 'prev': if (p.page > 1) p.newp = parseInt(p.page) - 1; break;
                    //modify by chw 12.04.05
					//到达最后一页之后，因为p.newp被设置为1，导致点击下一页的按钮，会跑到第一页去
					//case 'next': if (p.page < p.pages) p.newp = parseInt(p.page) + 1; break;
                    case 'next': 
						if (p.page < p.pages){ 
							p.newp = parseInt(p.page) + 1;
						}else{
							p.newp = p.pages;
						}
						break;
                    case 'last': p.newp = p.pages; break;
                    case 'input':
                        var nv = parseInt($('.pcontrol input', this.pDiv).val());
                        if (isNaN(nv)) nv = 1;
                        if (nv < 1) nv = 1;
                        else if (nv > p.pages) nv = p.pages;
                        $('.pcontrol input', this.pDiv).val(nv);
                        p.newp = nv;
                        break;
                }
                /*
            	if (p.newp==p.page) return false;
            	*/
                if (p.newp==p.page){
                	if(ctype!='reload' && ctype!='change'){
                		return false;
                	}
                }
                /*
                if (p.onChangePage)
                    p.onChangePage(p.newp);
                else
                    this.populate();
                */
                if (p.onChangePage){
                	p.onChangePage(p.newp, p.rp);
                }else{
                	this.populate();
                }
            },
            cellProp: function(n, ptr, pth) {
                var tdDiv = document.createElement('div');
                if (pth != null) {
                    if (p.sortname == $(pth).attr('abbr') && p.sortname) {
                        this.className = 'sorted';
                    }
                    $(tdDiv).css({ textAlign: pth.align, width: $('div:first', pth)[0].style.width });
                    if (pth.hide) $(this).css('display', 'none');
                }
                if (p.nowrap == false) $(tdDiv).css('white-space', 'normal');

                if (this.innerHTML == '') this.innerHTML = '&nbsp;';

                //tdDiv.value = this.innerHTML; //store preprocess value
                tdDiv.innerHTML = this.innerHTML;

                var prnt = $(this).parent()[0];
                var pid = false;
                if (prnt.id) pid = prnt.id.substr(3);
                
                if (pth != null) {
                    if (pth.format){ 
                    	pth.format(tdDiv, pid); 
                    }
                }
                $("input.itemchk", tdDiv).each(function() {
		            /*-------------start---------------*/
		            /* 这是原先的自有代码
                    $(this).click(function() {
                        if (this.checked) {
                            $(ptr).addClass("trSelected");
                        }
                        else {
                            $(ptr).removeClass("trSelected");
                        }   
                        if (p.onrowchecked) {
                            p.onrowchecked.call(this);
                        }
                    });
		            */
		            /*-------------end---------------*/
                    
		            /*----------------start---------------*/
		            //modify by lwj 10.3.9
					$(this).bind('click', function() {
                        if (this.checked) {
                            $(ptr).addClass("trSelected");
                        }
                        else {
                            $(ptr).removeClass("trSelected");
                        }
                        if (p.onrowchecked) {
                            p.onrowchecked.call(this);
                        }
					});
					/*----------------end---------------*/
                });
                $(this).empty().append(tdDiv).removeAttr('width'); //wrap content
                //add editable event here 'dblclick',如果需要可编辑在这里添加可编辑代码 
            },
            addCellProp: function() {
                var $gF = this.cellProp;
				//moidfy by chw 12.04.01
                //$('tbody tr td', g.bDiv).each
				$("tbody tr[id^="+p.table_id+"_row_] td", g.bDiv).each
					(
						function() {
						    var n = $('td', $(this).parent()).index(this);
						    var pth = $('th:eq(' + n + ')', g.hDiv).get(0);
						    var ptr = $(this).parent();
						    $gF.call(this, n, ptr, pth);
						}
					);
                $gF = null;
            },
            
            /*-------------start---------------*/
            /* 这是原先的自有代码
            getCheckedRows: function() {
                var ids = [];
                $(":checkbox:checked", g.bDiv).each(function() {
                    ids.push($(this).val());
                });
                return ids;
            },
            */
            /*-------------start---------------*/                     

            /*----------------start---------------*/
            //add by lwj 10.3.11
            //添加getRowsData方法，获取所有钩选的行数据　封装后的JSON对象
            //该方法只适用于　表格各行数据有钩选框的情况
            getRowsData: function() {
            	//var arr = $(":checkbox:checked", g.bDiv);
            	/*----------------start---------------*/
            	//modify by lwj 10.7.7
            	//为了防止列中有别的钩选框 表格的钩选框有样式 itemchk
            	var arr = $(":checkbox:checked.itemchk", g.bDiv);
            	/*----------------end---------------*/
            	var len = arr.length;
            	/* the old code
            	var temp = "";
            	for(var i=0; i<len; i++){
            		temp = temp + "{},";
            	}
            	temp = "["+temp.substr(0, temp.length-1)+"]";
                var row_objects = eval(temp);
                */
                //-----------------start----------------//
                // modify by lwj 11.2.23
                var row_objects = [];
            	for(var i=0; i<len; i++){
            		row_objects.push({});
            	}             
            	//-----------------end----------------//  
                var chd = null;
                for(var i=0; i<len; i++){		
                	chd = $(arr[i]).parent().parent().parent().attr("chd");
					g.generalObject(row_objects, chd, i);
                }
                return row_objects;
            },
            /*----------------end---------------*/ 

			/*-----------------start----------------*/
			openRow: function(_param){
				if(_param && _param.identityColumn && _param.value){
					var identityColumn = _param.identityColumn;
					var value = _param.value;
					var $trs = $("tbody tr[id^="+p.table_id+"_row_]", g.bDiv);
					for(var i=0, len=$trs.length; i<len; i++){
						var rowData = g.getRowData($trs[i]);
						if(rowData[0][identityColumn] && rowData[0][identityColumn] == value){
							var flag = true;
							var tr_id, id, divObj;
							var tBodyName = $($trs[i]).parent().attr("name");
							var parentTbody = $("#"+tBodyName, g.bDiv);
							//如果$trs[i]是子行
							if(tBodyName){
								id = tBodyName.substr((p.table_id + "_tbody_").length, tBodyName.length);
								divObj = $("#"+p.table_id+"_row_link_div_"+id);
								if(divObj.hasClass("treegrid_row_link_plus_close_pic_div")){
									flag = false;
								}
							}
							if(flag){
								tr_id = $($trs[i]).attr("id");
								id = tr_id.substr((p.table_id+"_row_").length, tr_id.length);
								g.doChildShow(id);
							}
						}
					}
				}
			},
			closeRow: function(_param){
				if(_param && _param.identityColumn && _param.value){
					var identityColumn = _param.identityColumn;
					var value = _param.value;
					var $trs = $("tbody tr[id^="+p.table_id+"_row_]", g.bDiv);
					for(var i=0, len=$trs.length; i<len; i++){
						var rowData = g.getRowData($trs[i]);
						if(rowData[0][identityColumn] && rowData[0][identityColumn] == value){
							var flag = true;
							var tr_id, id, divObj;
							var tBodyName = $($trs[i]).parent().attr("name");
							var parentTbody = $("#"+tBodyName, g.bDiv);
							//如果$trs[i]是子行
							if(tBodyName){
								id = tBodyName.substr((p.table_id + "_tbody_").length, tBodyName.length);
								divObj = $("#"+p.table_id+"_row_link_div_"+id);
								if(divObj.hasClass("treegrid_row_link_plus_close_pic_div")){
									flag = false;
								}
							}
							if(flag){
								tr_id = $($trs[i]).attr("id");
								id = tr_id.substr((p.table_id+"_row_").length, tr_id.length);
								g.doChildHide(id);
							}
						}
					}
				}
			},
			/*-----------------end---------------------*/

			deleteRow: function(param){
				var arr = [];
           		if(param && param.rowNum){
           			var array = param.rowNum.split(",")
           				str = "";
           			for(var i=0; i<array.length; i++){
            			if(!isNaN(parseInt(array[i]))){
            				if(str.indexOf(array[i]) == -1){
            					str = str + array[i] + ";";
            					arr[arr.length] = $("tbody tr[id^="+p.table_id+"_row_]:eq("+(parseInt(array[i]))+")", g.bDiv);
            				}
            			}
           			}
           			for(var i=0; i<arr.length; i++){
           				arr[i].remove();
           			}
				}else{
            		if(p.showcheckbox){
            			arr = $(":checkbox:checked.itemchk", g.bDiv).parent().parent().parent().filter(function(){
							return $(this).parent().attr("noDel") != true || $(this).parent().attr("noDel") != "true";
						});
            		}else{
            			//arr = $("tbody tr[id^="+p.table_id+"_row_].trSelected", g.bDiv);
						function circleAddObj(tbodyId){
							var children = $("tbody[name^="+tbodyId+"]", g.bDiv).filter(function(){
								return $(this).attr("noDel") != true || $(this).attr("noDel") != "true";
							});;
							for(var j=0; j<children.length; j++){
								//arr.push(children[j]);
								$(children[j]).remove();
								circleAddObj($(children[j]).attr("id"));
							}
						}
						var selectTr = $("tbody tr[id^="+p.table_id+"_row_].trSelected", g.bDiv).filter(function(){
							return $(this).parent().attr("noDel") != true || $(this).parent().attr("noDel") != "true";
						});;
						if(selectTr.length > 0){
						//arr.push(selectTr[0]);
							var tbodyId = selectTr.parent().attr("id");
							circleAddObj(tbodyId);
							selectTr.remove();
						}
            		}
	            	if(arr && arr.length > 0){
	            		arr.each(function(){
							if(param.isNotDelTopRow){
								if($(this).parent().attr("name") != undefined){
									$(this).parent().remove();
								}
							}else{
								$(this).parent().remove();
							}			
	            		});
	            	}             		
            	}
				//如果用户将表格数据删除，则需要更新标题头的勾选框状态
				g.freshCheckboxState();
			},

			getAllData: function(param){
				if(!param.isList){
					var $trs = $("tbody tr[id^="+p.table_id+"_row_]", g.bDiv).filter(function(){
						return $(this).parent("tbody").attr("name") == undefined;
					});//获取顶级的行对象
					var len = $trs.length;
					var row_objects = [];
					for(var i=0; i<len; i++){
						row_objects.push({});
					}
					//var tbodyPre = p.table_id+"_tbody_";

					function circleAddData(row_object, tbodyId){
						var childrenTbody = $("tbody[name='"+tbodyId+"']", g.bDiv);
						if(childrenTbody.length > 0){
							row_object.children = [];
							var len = childrenTbody.length;
							for(var i=0; i<len; i++){
								row_object.children.push({});
							}
							for(var i=0; i<len; i++){
								var $tr = $(childrenTbody[i]).children("tr");
								var chd = $tr.attr("chd");
								g.generalObject(row_object.children, chd, i);
								circleAddData(row_object.children[i], $(childrenTbody[i]).attr("id"));
							}
						}else{
							row_object.children = null;
						}
					}

					for(var i=0; i<len; i++){
						var chd = $($trs[i]).attr("chd");
						//var parent = $($trs[i]).parent().attr("name");
						g.generalObject(row_objects, chd, i);
						circleAddData(row_objects[i], $($trs[i]).parent("tbody").attr("id"));
					}
					return row_objects;
				}else{
					var $trs = $("tbody tr[id^="+p.table_id+"_row_]", g.bDiv);//获取顶级的行对象
					var len = $trs.length;
					var row_objects = [];
					for(var i=0; i<len; i++){
						row_objects.push({});
					}
					for(var i=0; i<len; i++){
						var chd = $($trs[i]).attr("chd");
						g.generalObject(row_objects, chd, i);
					}
					return row_objects;
				}
			},
            
			/*----------------start---------------*/
            //add by lwj 11.7.14
            //增加freshCheckboxState方法,刷新钩选框的状态
			freshCheckboxState: function(){
		//		if($("tbody tr", g.bDiv).length>0 && $("tbody tr input[type='checkbox'][disabled='']:not(:checked).itemchk", g.bDiv).length==0){
				if($("tbody tr", g.bDiv).length>0 && $("tbody tr input[type='checkbox']:not(:disabled):not(:checked).itemchk", g.bDiv).length==0){
					if($("tbody tr input[type='checkbox']:not(:disabled)", g.bDiv).length==0){	//当用户配置了disCheckbox属性为true，如果表格当中多有的数据都是disabled的话，则要将表头的勾选框去钩。
						g.doUncheck();
					}else{
						g.doCheck();
					}
				}else{
					g.doUncheck();
				}			
			},
            //增加doUncheck方法,列头栏的钩选框恢复去钩
			doUncheck: function(){
				$("th div input[type='checkbox']", g.hDiv).filter(function(){
					return $(this).hasClass("noborder");
				}).attr("checked", false);
			},
			//增加doUncheck方法,列头栏的钩选框打钩
			doCheck: function(){
				$("th div input[type='checkbox']", g.hDiv).filter(function(){
					return $(this).hasClass("noborder");
				}).attr("checked", true);
			},
			/*----------------end---------------*/
			/*----------------start---------------*/
            //add by lwj 10.3.11
            //增加cancelAllSelectState方法,取消所有选中行的状态
            cancelAllSelectState: function() {
				//modify by chw 12.04.01
                //$("tbody tr", g.bDiv).each(function() {
				$("tbody tr[id^="+p.table_id+"_row_]", g.bDiv).each(function() {
                 	if($(this).attr("class").indexOf("trSelected") != -1){
                 		$(this).removeClass("trSelected");
                 		if(p.showcheckbox){
                 			$("input:checkbox", this).attr("checked", false);
                 		}
                 	}
                });
				g.freshCheckboxState();
            },
            /*----------------end---------------*/             
            
            /*----------------start---------------*/
            //add by lwj 10.3.10
            //增加generalObject方法
            //根据处理对象
            //@param row_objects JSON数组
            //@param chd TR中的CH属性值
            //@param index　行数据要存放在JSON数组中的索引
            generalObject: function(row_objects, chd, index){		
				var data_array = chd.split("_FG$SP_");
				var col_model = p.colModel;
				var col_name = "", col_value = "";
				for(var i=0; i<col_model.length; i++){
					col_name = col_model[i].name;
					col_value = data_array[i];
					/* the old code
					execute({
						'col_name': col_name,
						'object_str': "row_objects["+index+"]",
						'col_value': col_value
					});
					*/
					//---------------start--------------//
					// modify by lwj 11.2.23
					execute({
						col_name: col_name,
						row_object: row_objects[index],
						col_value: col_value
					});
					//---------------end--------------//
				}
				
				function execute(param){
					var col_name = param.col_name;
					var flag = col_name.indexOf("\.");
					//var object_str = param.object_str;
					var row_object = param.row_object;// modify by lwj 11.2.23
					var col_value = param.col_value;
					if(flag == -1){
						//eval(object_str+"."+col_name+"='"+col_value+"'");
						row_object[col_name] = col_value;// modify by lwj 11.2.22
					}else{
						var front_str = col_name.substr(0, flag);
						var end_str = col_name.substr(flag+1, col_name.length);
						/* the old code
						if(!eval(object_str+"."+front_str)){
							eval(object_str+"."+front_str+"={}");
						}
						execute({
							'col_name': end_str,
							'object_str': object_str+"."+front_str,
							'col_value': col_value
						});
						*/
						//---------------start--------------//
						// modify by lwj 11.2.23
						if(!row_object[front_str]){
							row_object[front_str] = {};
						}
						execute({
							col_name: end_str,
							row_object: row_object[front_str],
							col_value: col_value
						});
						//---------------end--------------//
					}			
				}
            },
            /*----------------end---------------*/

                     
            getCellDim: function(obj) // get cell prop for editable event
            {
                var ht = parseInt($(obj).height());
                var pht = parseInt($(obj).parent().height());
                var wt = parseInt(obj.style.width);
                var pwt = parseInt($(obj).parent().width());
                var top = obj.offsetParent.offsetTop;
                var left = obj.offsetParent.offsetLeft;
                var pdl = parseInt($(obj).css('paddingLeft'));
                var pdt = parseInt($(obj).css('paddingTop'));
                return { ht: ht, wt: wt, top: top, left: left, pdl: pdl, pdt: pdt, pht: pht, pwt: pwt };
            },
            rowProp: function() {
                if (p.rowhandler) {
                    p.rowhandler(this);
                }
                if ($.browser.msie && $.browser.version < 7.0) {
                    $(this).hover(function() { $(this).addClass('trOver'); }, function() { $(this).removeClass('trOver'); });
                }
                
                /*----------------start----------------*/
                /*add by lwj 增加行选中事件处理,只有不显示钩选框的情况下才生效*/
                if(!p.showcheckbox){
                	$(this).click(function(){
                		if($(this).attr("class").indexOf("trSelected") == -1){
                			//$(g.bDiv).find("tr").each(function(){
                			//	$(this).removeClass('trSelected');
                			//});
							/*-------------start----------------*/
							//modify by chw 12.04.01
							//防止内嵌table导致获取不到正确的tr行
							//var trs = $(g.bDiv).find("tr");
							$(g.bDiv).find("tbody tr[id^="+p.table_id+"_row_]").each(function(){
                				$(this).removeClass('trSelected');
                			});
							/*-------------end----------------*/
                			$(this).addClass('trSelected');
                		}else{
                			if(p.onRowSelectedChangeClass){
                				$(this).removeClass('trSelected');
                			}
                		}
                	});
                }
                /*----------------end----------------*/
            },
			//---------------------start---------------------//
			//add by chw 12.11.09
			//遍历判断tbody，添加属性noDel，用于调用删除行数据接口的时候，判断是否选中的行是否能删除
			circleParent: function(parentId){
				var parentObj = $("tbody[id='"+parentId+"']", g.bDiv);
				if(parentObj && parentObj.length >=1){
					var childrenObj = $("tbody[name='"+parentId+"']", g.bDiv);
					var count = 0;
					for(var i=0; i<childrenObj.length; i++){
						var chkObj = $("input:checkbox.itemchk", $(childrenObj[i]));
						if(chkObj[0] && chkObj[0].checked && ($(childrenObj[i]).attr("noDel") == undefined || $(childrenObj[i]).attr("noDel") == false || $(childrenObj[i]).attr("noDel") == "false")){
							count++;
						}
					}
					if(count == childrenObj.length){
						parentObj.attr("noDel", "false");
					}else{
						parentObj.attr("noDel", "true");
					}
					g.circleParent(parentObj.attr("name"));
				}
			},
			//---------------------end---------------------//
            addRowProp: function() {
                var $gF = this.rowProp;
                //$('tbody tr', g.bDiv).each(
				$("tbody tr[id^="+p.table_id+"_row_]", g.bDiv).each(
                    function() {
                        $("input.itemchk", this).each(function() {
                            var ptr = $(this).parent().parent().parent();
                            $(this).click(function() {
                                if (this.checked) {
                                    ptr.addClass("trSelected");
                                }
                                else {
                                    ptr.removeClass("trSelected");
                                }
								g.circleParent($(this).parent().parent().parent().parent().attr("name"));
                                if (p.onrowchecked) {
                                    p.onrowchecked.call(this);
                                }
								g.freshCheckboxState();
                            });
                        });
                        $gF.call(this);
                    }
                );
                $gF = null;
            },
            checkAllOrNot: function(parent) {            	
                var ischeck = $(this).attr("checked");
                //$('tbody tr', g.bDiv).each(function() {
				$("tbody tr[id^="+p.table_id+"_row_]", g.bDiv).each(function() {
                    if (ischeck) {
                        $(this).addClass("trSelected");
                    } else {
                        $(this).removeClass("trSelected");
                    }
                });
                $("input.itemchk", g.bDiv).each(function() {
                    this.checked = ischeck;
					if(!ischeck){
						$(this).attr("disabled", "");
					}
                    //Raise Event
                    if (p.onrowchecked) {
                        p.onrowchecked.call(this);
                    }
                });
            },
            pager: 0
            
        };

        //create model if any
        if (p.colModel) {
            thead = document.createElement('thead');
            tr = document.createElement('tr');
            //p.showcheckbox ==true;
            if (p.showcheckbox) {
                var cth = jQuery('<th/>');
                var cthch = jQuery('<input type="checkbox"/>');
                cthch.addClass("noborder")
                cth.addClass("cth").attr({ 'axis': "col-1", width: "22", "isch": true }).append(cthch);
                $(tr).append(cth);
            }
            
            /*------------start-----------------*/
            //add by lwj 10.8.6
            //增加图标列。
			//modify by chw 12.10.16
			//去掉图标列，合并到第一列数据
			/*
            var cth = jQuery('<th/>');
            var cthpic = jQuery('<input type="hidden"/>');
			cth.attr({ 'axis': "col-2", width: p.linkPicColumnWidth, "ispic": true }).append(cthpic);
			$(tr).append(cth);	
			*/
			/*------------end-----------------*/
			
            for (i = 0; i < p.colModel.length; i++) {
                var cm = p.colModel[i];
                var th = document.createElement('th');

                th.innerHTML = cm.display;

                if (cm.name && cm.sortable)
                    $(th).attr('abbr', cm.name);

                //th.idx = i;
                $(th).attr('axis', 'col' + i);
                
                if (cm.align)
                    th.align = cm.align;

                if (cm.width)
                    $(th).attr('width', cm.width);

                if (cm.hide) {
                    th.hide = true;
                }
                if (cm.toggle != undefined) {
                    th.toggle = cm.toggle
                }
                if (cm.format) {
                    th.format = cm.format;
                }
				if(cm.isKey){
					th.isKey = cm.isKey;
				}
				if(cm.title_align){
					th.title_align = cm.title_align;
				}else{
					th.title_align = "center";
				}

                $(tr).append(th);
            }
            $(thead).append(tr);
            $(t).prepend(thead);
        } // end if p.colmodel	

        //init divs
        g.gDiv = document.createElement('div'); //create global container
        g.mDiv = document.createElement('div'); //create title container
        g.hDiv = document.createElement('div'); //create header container
        g.bDiv = document.createElement('div'); //create body container
        g.vDiv = document.createElement('div'); //create grip
        g.rDiv = document.createElement('div'); //create horizontal resizer
        g.cDrag = document.createElement('div'); //create column drag
        g.block = document.createElement('div'); //creat blocker
        g.nDiv = document.createElement('div'); //create column show/hide popup
        g.nBtn = document.createElement('div'); //create column show/hide button
        g.iDiv = document.createElement('div'); //create editable layer
        g.tDiv = document.createElement('div'); //create toolbar
        g.sDiv = document.createElement('div');

        if (p.usepager) g.pDiv = document.createElement('div'); //create pager container
        g.hTable = document.createElement('table');

        //set gDiv
        g.gDiv.className = p.gridClass;
        /*----------------start---------------*/
        //modify by lwj 10.6.27
        //当没有注册表格遮罩对象时，须对gDiv层添加样式
        //if(!p.maskObject){//modify by lwj 11.6.15
        	$(g.gDiv).css({
			    position: "relative"
			});
        //}
        /*----------------end---------------*/
        //if (p.width != 'auto') g.gDiv.style.width = p.width + 'px';
        //modify by lwj 10.3.1 使其支持百分比显示
        if (p.width != 'auto') g.gDiv.style.width = p.width + ((p.width+"").indexOf("%")?"":'px');
        //add conditional classes
        if ($.browser.msie)
            $(g.gDiv).addClass('ie');

        if (p.novstripe)
            $(g.gDiv).addClass('novstripe');

        $(t).before(g.gDiv);
        $(g.gDiv)
		.append(t)
		;
        //set toolbar
        if (p.buttons) {
            g.tDiv.className = 'tDiv';
            var tDiv2 = document.createElement('div');
            tDiv2.className = 'tDiv2';

            for (i = 0; i < p.buttons.length; i++) {
                var btn = p.buttons[i];
                if (!btn.separator) {
                    var btnDiv = document.createElement('div');
                    btnDiv.className = 'fbutton';
                    btnDiv.innerHTML = "<div><span style='padding-top: 3px;'>" + btn.displayname + "</span></div>";
                    btnDiv.disabled = btn.disabled;
                    if (btn.title) {
                        btnDiv.title = btn.title;
                    }
                    if (btn.bclass)
                        $('span', btnDiv)
							.addClass(btn.bclass)
							.css({paddingLeft:20});//add by lwj 10.12.06;
                    btnDiv.onpress = btn.onpress;
                    btnDiv.name = btn.name;
                    if (btn.onpress) {
                        $(btnDiv).click
							(
								function() {
								    //this.onpress(this.name, g.gDiv);
								    this.onpress();
								}
							);
                    }
                    $(tDiv2).append(btnDiv);
                    if ($.browser.msie && $.browser.version < 7.0) {
                        $(btnDiv).hover(function() { $(this).addClass('fbOver'); }, function() { $(this).removeClass('fbOver'); });
                    }

                } else {
                    $(tDiv2).append("<div class='btnseparator'></div>");
                }
            }
            $(g.tDiv).append(tDiv2);
            $(g.tDiv).append("<div style='clear:both'></div>");
            $(g.gDiv).prepend(g.tDiv);
        }

        //set hDiv
        g.hDiv.className = 'hDiv';

        $(t).before(g.hDiv);

        //set hTable
        g.hTable.cellPadding = 0;
        g.hTable.cellSpacing = 0;
        $(g.hDiv).append('<div class="hDivBox"></div>');
        $('div', g.hDiv).append(g.hTable);
        var thead = $("thead:first", t).get(0);
        if (thead) $(g.hTable).append(thead);
        thead = null;

        if (!p.colmodel) var ci = 0;

        //setup thead			
        $('thead tr:first th', g.hDiv).each
			(
			 	function() {
			 	    var thdiv = document.createElement('div');
			 	    if ($(this).attr('abbr')) {
			 	        $(this).click(
								function(e) {
								    if (!$(this).hasClass('thOver')) return false;
								    var obj = (e.target || e.srcElement);
								    if (obj.href || obj.type) return true;
								    g.changeSort(this);
								}
							);

			 	        if ($(this).attr('abbr') == p.sortname) {
			 	            this.className = 'sorted';
			 	            thdiv.className = 's' + p.sortorder;
			 	        }
			 	    }

			 	    if (this.hide) $(this).hide();
			 	    /*if (!p.colmodel && !$(this).attr("isch")) {*/			 	    	
			 	    if (!p.colmodel && !$(this).attr("isch") && !$(this).attr("ispic")) {//modify by lwj 10.8.6
			 	        $(this).attr('axis', 'col' + ci++);
			 	    }
			 	    /*---------start-------------*/
			 	    //add by lwj 10.8.9 列头加图标
					if($(this).attr("ispic")){
						$(thdiv).addClass("treegrid_row_link_head_pic_div");
					}
					/*---------end-------------*/
					//modify by chw 12.04.28
					//新增表头文本对齐方式
			 	    //$(thdiv).css({ textAlign: this.align, width: this.width + 'px' });
					$(thdiv).css({ textAlign: this.title_align, width: this.width + 'px' });


			 	    thdiv.innerHTML = this.innerHTML;
			 	    $(this).empty().append(thdiv).removeAttr('width');
			 	    
			 	    /*if (!$(this).attr("isch")) {*/
			 	    if (!$(this).attr("isch") && !$(this).attr("ispic")) {//modify by lwj 10.8.6
			 	        $(this).mousedown(function(e) {
			 	            g.dragStart('colMove', e, this);
			 	        })
						.hover(
							function() {

							    if (!g.colresize && !$(this).hasClass('thMove') && !g.colCopy) $(this).addClass('thOver');

							    if ($(this).attr('abbr') != p.sortname && !g.colCopy && !g.colresize && $(this).attr('abbr')) $('div', this).addClass('s' + p.sortorder);
							    else if ($(this).attr('abbr') == p.sortname && !g.colCopy && !g.colresize && $(this).attr('abbr')) {
							        var no = '';
							        if (p.sortorder == 'asc') no = 'desc';
							        else no = 'asc';
							        $('div', this).removeClass('s' + p.sortorder).addClass('s' + no);
							    }

							    if (g.colCopy) {

							        var n = $('th', g.hDiv).index(this);

							        if (n == g.dcoln) return false;



							        if (n < g.dcoln) $(this).append(g.cdropleft);
							        else $(this).append(g.cdropright);

							        g.dcolt = n;

							    } else if (!g.colresize) {
							        var thsa = $('th:visible', g.hDiv);
							        var nv = -1;
							        for (var i = 0, j = 0, l = thsa.length; i < l; i++) {
							            if ($(thsa[i]).css("display") != "none") {
							                if (thsa[i] == this) {
							                    nv = j;
							                    break;
							                }
							                j++;
							            }
							        }
							        var nv = $('th:visible', g.hDiv).index(this);
							        var onl = parseInt($('div:eq(' + nv + ')', g.cDrag).css('left'));
							        var nw = parseInt($(g.nBtn).width()) + parseInt($(g.nBtn).css('borderLeftWidth'));
							        nl = onl - nw + Math.floor(p.cgwidth / 2);

							        $(g.nDiv).hide(); $(g.nBtn).hide();

							        $(g.nBtn).css({ 'left': nl, top: g.hDiv.offsetTop }).show();

							        var ndw = parseInt($(g.nDiv).width());

							        $(g.nDiv).css({ top: g.bDiv.offsetTop });

							        if ((nl + ndw) > $(g.gDiv).width())
							            $(g.nDiv).css('left', onl - ndw + 1);
							        else
							            $(g.nDiv).css('left', nl);


							        if ($(this).hasClass('sorted'))
							            $(g.nBtn).addClass('srtd');
							        else
							            $(g.nBtn).removeClass('srtd');

							    }

							},
							function() {
							    $(this).removeClass('thOver');
							    if ($(this).attr('abbr') != p.sortname) $('div', this).removeClass('s' + p.sortorder);
							    else if ($(this).attr('abbr') == p.sortname) {
							        var no = '';
							        if (p.sortorder == 'asc') no = 'desc';
							        else no = 'asc';

							        $('div', this).addClass('s' + p.sortorder).removeClass('s' + no);
							    }
							    if (g.colCopy) {
							        $(g.cdropleft).remove();
							        $(g.cdropright).remove();
							        g.dcolt = null;
							    }
							})
						; //wrap content
			 	    }
			 	}
			);

        //set bDiv
        g.bDiv.className = 'bDiv';
        $(t).before(g.bDiv);
        $(g.bDiv)
		.css({ height: (p.height == 'auto') ? 'auto' : p.height + "px" })


		.scroll(function(e) { g.scroll() })
		.append(t)
		;

        if (p.height == 'auto') {
            $('table', g.bDiv).addClass('autoht');
        }

        //add td properties
        if (p.url == false || p.url == "") {
            g.addCellProp();
            //add row properties
            g.addRowProp();
        }

        //set cDrag

        var cdcol = $('thead tr:first th:first', g.hDiv).get(0);

        if (cdcol != null) {
            g.cDrag.className = 'cDrag';
            g.cdpad = 0;

            g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderLeftWidth'))) ? 0 : parseInt($('div', cdcol).css('borderLeftWidth')));
            g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderRightWidth'))) ? 0 : parseInt($('div', cdcol).css('borderRightWidth')));
            g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingLeft'))) ? 0 : parseInt($('div', cdcol).css('paddingLeft')));
            g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingRight'))) ? 0 : parseInt($('div', cdcol).css('paddingRight')));
            g.cdpad += (isNaN(parseInt($(cdcol).css('borderLeftWidth'))) ? 0 : parseInt($(cdcol).css('borderLeftWidth')));
            g.cdpad += (isNaN(parseInt($(cdcol).css('borderRightWidth'))) ? 0 : parseInt($(cdcol).css('borderRightWidth')));
            g.cdpad += (isNaN(parseInt($(cdcol).css('paddingLeft'))) ? 0 : parseInt($(cdcol).css('paddingLeft')));
            g.cdpad += (isNaN(parseInt($(cdcol).css('paddingRight'))) ? 0 : parseInt($(cdcol).css('paddingRight')));

            $(g.bDiv).before(g.cDrag);

            var cdheight = $(g.bDiv).height();
            var hdheight = $(g.hDiv).height();

            $(g.cDrag).css({ top: -hdheight + 'px' });
            
			/* 屏蔽拖动相关功能 modify by lwj 10.7.16*/            
            $('thead tr:first th', g.hDiv).each
			(
			 	function() {
			 	    var cgDiv = document.createElement('div');
			 	    $(g.cDrag).append(cgDiv);
			 	    if (!p.cgwidth) p.cgwidth = $(cgDiv).width();
			 	    /* the old code
			 	    $(cgDiv).css({ height: cdheight + hdheight })
						.mousedown(function(e) { g.dragStart('colresize', e, this); })//屏蔽 by lwj 10.7.16
						;
					*/
		 	    	//modify by lwj 10.12.06 钩选框排除
		 	    	/*-----------start------------*/
		 	    	var isch = $(this).attr("isch");
		 	    	var ispic = $(this).attr("ispic");
			 	    $(cgDiv).css({ height: cdheight + hdheight });
			 	    if(!isch){
			 	    	$(cgDiv).mousedown(function(e) { g.dragStart('colresize', e, this); })//屏蔽 by lwj 10.7.16 open by lwj 10.12.06
						;
					}
					/*-----------end------------*/
			 	    //if ($.browser.msie && $.browser.version < 7.0) {
			 	        g.fixHeight($(g.gDiv).height());
			 	        /*屏蔽 by lwj 10.7.16  
			 	        open by lwj 10.12.06
			 	        */
			 	        $(cgDiv).hover(
								function() {
								    g.fixHeight();
								    /* the old code
								    $(this).addClass('dragging');
								    */
						 	    	//modify by lwj 10.12.06 钩选框排除						 	    	
						 	    	if(!isch){
						 	    		$(this).addClass('dragging');
						 	    	}
						 	    	/*-----------end------------*/
								},
								function() { if (!g.colresize) $(this).removeClass('dragging') }
							);
						
			 	    //}
			 	}
			);
            g.rePosDrag();

        }


        //add strip		
        if (p.striped)
            //$('tbody tr:odd', g.bDiv).addClass('erow');
			$("tbody tr[id^='"+p.table_id+"_row_']:odd", g.bDiv).addClass('erow');


        if (p.resizable && p.height != 'auto') {
            g.vDiv.className = 'vGrip';
            $(g.vDiv)
		.mousedown(function(e) { g.dragStart('vresize', e) })
		.html('<span></span>');
            $(g.bDiv).after(g.vDiv);
        }

        if (p.resizable && p.width != 'auto' && !p.nohresize) {
            g.rDiv.className = 'hGrip';
            $(g.rDiv)
		.mousedown(function(e) { g.dragStart('vresize', e, true); })
		.html('<span></span>')
		.css('height', $(g.gDiv).height())
		;
            if ($.browser.msie && $.browser.version < 7.0) {
                $(g.rDiv).hover(function() { $(this).addClass('hgOver'); }, function() { $(this).removeClass('hgOver'); });
            }
            $(g.gDiv).append(g.rDiv);
        }
        
        /*-------------start---------------*/
   		// modify by lwj 10.3.16 
		g.doUsePager = function(){
	        if (p.usepager) {
	            g.pDiv.className = 'pDiv';
	            g.pDiv.innerHTML = '<div class="pDiv2"></div>';
	            $(g.bDiv).after(g.pDiv);
	            var html = '<div class="pGroup"><div class="pFirst pButton" title="转到第一页"><span></span></div><div class="pPrev pButton" title="转到上一页"><span></span></div> </div><div class="btnseparator"></div> <div class="pGroup"><span class="pcontrol">当前第 <input type="text" size="1" value="1" />页，总页数 <span> 1 </span></span></div><div class="btnseparator"></div><div class="pGroup"> <div class="pNext pButton" title="转到下一页"><span></span></div><div class="pLast pButton" title="转到最后一页"><span></span></div></div><div class="btnseparator"></div><div class="pGroup"> <div class="pReload pButton" title="刷新"><span></span></div> </div> <div class="btnseparator"></div><div class="pGroup"><span class="pPageStat"></span></div>';
	            $('div', g.pDiv).html(html);
	            $('.pReload', g.pDiv).click(function() {
	            	if(p.isSuccessSearch){
	            		//g.populate();
	            		g.changePage('reload');
	            	}
	            });
	            $('.pFirst', g.pDiv).click(function() { 
	            	if(p.isSuccessSearch){
	            		g.changePage('first'); 
	            	}
	            });
	            $('.pPrev', g.pDiv).click(function() { 
	            	if(p.isSuccessSearch){
	            		g.changePage('prev');
	            	} 
	            });
	            $('.pNext', g.pDiv).click(function() { 
	            	if(p.isSuccessSearch){
			            g.changePage('next');
			        }
			    });
	            $('.pLast', g.pDiv).click(function() { 
	            	if(p.isSuccessSearch){	
	            		g.changePage('last');
	            	}
	            });
	            $('.pcontrol input', g.pDiv).keydown(function(e) { 
	            	if (e.keyCode==13 && p.isSuccessSearch){
	            		g.changePage('input');
	            	} 
	            }); 
	    					
	            if ($.browser.msie && $.browser.version < 7) $('.pButton', g.pDiv).hover(function() { $(this).addClass('pBtnOver'); }, function() { $(this).removeClass('pBtnOver'); });
	
	            if (p.useRp) {
	                var opt = "";
	                for (var nx = 0; nx < p.rpOptions.length; nx++) {
	                    if (p.rp == p.rpOptions[nx]) sel = 'selected="selected"'; else sel = '';
	                    opt += "<option value='" + p.rpOptions[nx] + "' " + sel + " >" + p.rpOptions[nx] + "&nbsp;&nbsp;</option>";
	                };
	                $('.pDiv2', g.pDiv).prepend("<div class='pGroup'>每页 <select name='rp'>" + opt + "</select>条</div> <div class='btnseparator'></div>");
	                $('select', g.pDiv).change(
						function() {
						    if (p.onRpChange){
						        p.onRpChange(+this.value);
						    } else {
						        p.newp = 1;
						        p.rp = this.value;
							    if(p.isSuccessSearch){
							        //g.populate();
							        g.changePage('change');
							    }
						    }
						}
					);
	            }
	
	            //add search button
	            if (p.searchitems) {
	                $('.pDiv2', g.pDiv).prepend("<div class='pGroup'> <div class='pSearch pButton'><span></span></div> </div>  <div class='btnseparator'></div>");
	                $('.pSearch', g.pDiv).click(function() { $(g.sDiv).slideToggle('fast', function() { $('.sDiv:visible input:first', g.gDiv).trigger('focus'); }); });
	                //add search box
	                g.sDiv.className = 'sDiv';
	
	                sitems = p.searchitems;
	
	                var sopt = "";
	                var op = "Eq";
	                for (var s = 0; s < sitems.length; s++) {
	                    if (p.qtype == '' && sitems[s].isdefault == true) {
	                        p.qtype = sitems[s].name;
	                        sel = 'selected="selected"';
	                    } else sel = '';
	                    if (sitems[s].operater == "Like") {
	                        op = "Like";
	                    }
	                    else {
	                        op = "Eq";
	                    }
	                    sopt += "<option value='" + sitems[s].name + "$" + op + "$" + s + "' " + sel + " >" + sitems[s].display + "&nbsp;&nbsp;</option>";
	                }
	
	                if (p.qtype == '') p.qtype = sitems[0].name;
	
	                $(g.sDiv).append("<div class='sDiv2'>快速检索：<input type='text' size='30' name='q' class='qsbox' /> <select name='qtype'>" + sopt + "</select> <input type='button' name='qclearbtn' value='清空' /></div>");
	
	                $('input[name=q],select[name=qtype]', g.sDiv).keydown(function(e) { if (e.keyCode == 13) g.doSearch() });
	                $('input[name=qclearbtn]', g.sDiv).click(function() { $('input[name=q]', g.sDiv).val(''); p.query = ''; g.doSearch(); });
	                $(g.bDiv).after(g.sDiv);
	
	            }
	
	        }
		}
		g.doUsePager();
		/*-------------end---------------*/

        /*-------------start---------------*/
		/* 这是原先的自有代码
        // add pager
        if (p.usepager) {
            g.pDiv.className = 'pDiv';
            g.pDiv.innerHTML = '<div class="pDiv2"></div>';
            $(g.bDiv).after(g.pDiv);
            var html = '<div class="pGroup"><div class="pFirst pButton" title="转到第一页"><span></span></div><div class="pPrev pButton" title="转到上一页"><span></span></div> </div><div class="btnseparator"></div> <div class="pGroup"><span class="pcontrol">当前第 <input type="text" size="1" value="1" />页，总页数 <span> 1 </span></span></div><div class="btnseparator"></div><div class="pGroup"> <div class="pNext pButton" title="转到下一页"><span></span></div><div class="pLast pButton" title="转到最后一页"><span></span></div></div><div class="btnseparator"></div><div class="pGroup"> <div class="pReload pButton" title="刷新"><span></span></div> </div> <div class="btnseparator"></div><div class="pGroup"><span class="pPageStat"></span></div>';
            $('div', g.pDiv).html(html);
            $('.pReload', g.pDiv).click(function() { g.populate() });
            $('.pFirst', g.pDiv).click(function() { g.changePage('first') });
            $('.pPrev', g.pDiv).click(function() { g.changePage('prev') });
            $('.pNext', g.pDiv).click(function() { g.changePage('next') });
            $('.pLast', g.pDiv).click(function() { g.changePage('last') });
            $('.pcontrol input', g.pDiv).keydown(function(e) { if (e.keyCode == 13) g.changePage('input') });
            if ($.browser.msie && $.browser.version < 7) $('.pButton', g.pDiv).hover(function() { $(this).addClass('pBtnOver'); }, function() { $(this).removeClass('pBtnOver'); });

            if (p.useRp) {
                var opt = "";
                for (var nx = 0; nx < p.rpOptions.length; nx++) {
                    if (p.rp == p.rpOptions[nx]) sel = 'selected="selected"'; else sel = '';
                    opt += "<option value='" + p.rpOptions[nx] + "' " + sel + " >" + p.rpOptions[nx] + "&nbsp;&nbsp;</option>";
                };
                $('.pDiv2', g.pDiv).prepend("<div class='pGroup'>每页 <select name='rp'>" + opt + "</select>条</div> <div class='btnseparator'></div>");
                $('select', g.pDiv).change(
					function() {
					    if (p.onRpChange)
					        p.onRpChange(+this.value);
					    else {
					        p.newp = 1;
					        p.rp = +this.value;
							g.populate();
					    }
					}
				);
            }

            //add search button
            if (p.searchitems) {
                $('.pDiv2', g.pDiv).prepend("<div class='pGroup'> <div class='pSearch pButton'><span></span></div> </div>  <div class='btnseparator'></div>");
                $('.pSearch', g.pDiv).click(function() { $(g.sDiv).slideToggle('fast', function() { $('.sDiv:visible input:first', g.gDiv).trigger('focus'); }); });
                //add search box
                g.sDiv.className = 'sDiv';

                sitems = p.searchitems;

                var sopt = "";
                var op = "Eq";
                for (var s = 0; s < sitems.length; s++) {
                    if (p.qtype == '' && sitems[s].isdefault == true) {
                        p.qtype = sitems[s].name;
                        sel = 'selected="selected"';
                    } else sel = '';
                    if (sitems[s].operater == "Like") {
                        op = "Like";
                    }
                    else {
                        op = "Eq";
                    }
                    sopt += "<option value='" + sitems[s].name + "$" + op + "$" + s + "' " + sel + " >" + sitems[s].display + "&nbsp;&nbsp;</option>";
                }

                if (p.qtype == '') p.qtype = sitems[0].name;

                $(g.sDiv).append("<div class='sDiv2'>快速检索：<input type='text' size='30' name='q' class='qsbox' /> <select name='qtype'>" + sopt + "</select> <input type='button' name='qclearbtn' value='清空' /></div>");

                $('input[name=q],select[name=qtype]', g.sDiv).keydown(function(e) { if (e.keyCode == 13) g.doSearch() });
                $('input[name=qclearbtn]', g.sDiv).click(function() { $('input[name=q]', g.sDiv).val(''); p.query = ''; g.doSearch(); });
                $(g.bDiv).after(g.sDiv);

            }

        }
        */
		/*-------------end---------------*/


        $(g.pDiv, g.sDiv).append("<div style='clear:both'></div>");
		
        // add title
        if (p.title) {
            g.mDiv.className = 'mDiv';
            g.mDiv.innerHTML = '<div class="ftitle">' + p.title + '</div>';
            $(g.gDiv).prepend(g.mDiv);
            if (p.showTableToggleBtn) {
                $(g.mDiv).append('<div class="ptogtitle" title="Minimize/Maximize Table"><span></span></div>');
                $('div.ptogtitle', g.mDiv).click
					(
					 	function() {
					 	    $(g.gDiv).toggleClass('hideBody');
					 	    $(this).toggleClass('vsble');
					 	}
					);
            }
            g.rePosDrag();
        }

        //setup cdrops
        g.cdropleft = document.createElement('span');
        /*------------------start-----------------*/
        // by lwj 10.9.13 屏蔽表头列 鼠标经过时的 箭头样式
        /* the old code
        g.cdropleft.className = 'cdropleft';
        */
        /*------------------end-----------------*/
        g.cdropright = document.createElement('span');
        /*------------------start-----------------*/
        // by lwj 10.9.13 屏蔽表头列 鼠标经过时的 箭头样式
        /* the old code
        g.cdropright.className = 'cdropright';
        */
        /*------------------end-----------------*/

        //add block
        /*----------------start---------------*/
		// modify by lwj 10.6.27
        //g.block.className = 'gBlock';
        /*----------------end---------------*/
        var blockloading = $("<div/>");
        blockloading.addClass("loading");
        $(g.block).append(blockloading);
        var gh = $(g.bDiv).height();
        var gtop = g.bDiv.offsetTop;
        $(g.block).css(
		{
		    width: g.bDiv.style.width,
		    height: gh,
		    position: 'relative',
		    marginBottom: (gh * -1),
		    zIndex: 1,
		    top: gtop,
		    left: '0px'
		}		
		);
        $(g.block).fadeTo(0, p.blockOpacity);

        // add column control
        if ($('th', g.hDiv).length) {
            g.nDiv.className = 'nDiv';
            g.nDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
            $(g.nDiv).css(
			{
			    marginBottom: (gh * -1),
			    display: 'none',
			    top: gtop
			}
			).noSelect()
			;

            var cn = 0;

            $('th div', g.hDiv).each
			(
			 	function() {
			 	    var kcol = $("th[axis='col" + cn + "']", g.hDiv)[0];
			 	    if (kcol == null) return;
			 	    var chkall = $("input[type='checkbox']", this);
			 	    if (chkall.length > 0) {
			 	        chkall[0].onclick = g.checkAllOrNot;
			 	        return;
			 	    }
			        /*----------------start---------------*/
					// add by lwj 10.8.6
			        //加上图片列判断		        
			 	    var pic = $("input[type='hidden']", this);
			 	    if (pic.length > 0) {
			 	        return;
			 	    }
			 	    /*----------------end---------------*/
			 	    if (kcol.toggle == false || this.innerHTML == "") {
			 	        cn++;
			 	        return;
			 	    }
			 	    var chk = 'checked="checked"';
			 	    if (kcol.style.display == 'none') chk = '';
			 	    $('tbody', g.nDiv).append('<tr><td class="ndcol1"><input type="checkbox" ' + chk + ' class="togCol noborder" value="' + cn + '" /></td><td class="ndcol2">' + this.innerHTML + '</td></tr>');
			 	    cn++;
			 	}
			);

            if ($.browser.msie && $.browser.version < 7.0)
                $('tr', g.nDiv).hover
				(
				 	function() { $(this).addClass('ndcolover'); },
					function() { $(this).removeClass('ndcolover'); }
				);

            $('td.ndcol2', g.nDiv).click
			(
			 	function() {
					//---------------start----------------------//
					//modify by chw 12.04.13
					//如果初始化只有一个的话，此时，点击勾选，导致直接返回false，无法进行列显示隐藏切换
			 	    //if ($('input:checked', g.nDiv).length <= p.minColToggle && $(this).prev().find('input')[0].checked) return false;
			 	    if ($('input:checked', g.nDiv).length < p.minColToggle && $(this).prev().find('input')[0].checked) return false;
					//-----------end--------------------//
			 	    return g.toggleCol($(this).prev().find('input').val());
			 	}
			);

            $('input.togCol', g.nDiv).click
			(
			 	function() {
			 	    if ($('input:checked', g.nDiv).length < p.minColToggle && this.checked == false) return false;
			 	    $(this).parent().next().trigger('click');
			 	    //return false;
			 	}
			);


            $(g.gDiv).prepend(g.nDiv);

            $(g.nBtn).addClass('nBtn')
			.html('<div></div>')
            //.attr('title', 'Hide/Show Columns')
			.click
			(
			 	function() {
			 	    $(g.nDiv).toggle(); return true;
			 	}
			);

            if (p.showToggleBtn)
                $(g.gDiv).prepend(g.nBtn);

        }

        // add date edit layer
        $(g.iDiv)
		.addClass('iDiv')
		.css({ display: 'none' })
		;
        $(g.bDiv).append(g.iDiv);

        // add flexigrid events
        $(g.bDiv)
		.hover(function() { $(g.nDiv).hide(); $(g.nBtn).hide(); }, function() { if (g.multisel) g.multisel = false; })
		;
        $(g.gDiv)
		.hover(function() { }, function() { $(g.nDiv).hide(); $(g.nBtn).hide(); })
		;

        //add document events
        /* 屏蔽拖动功能 modify by lwj 10.3.29*/
        $(document)
		.mousemove(function(e) { g.dragMove(e) })
		.mouseup(function(e) { g.dragEnd() })
		.hover(function() { }, function() { g.dragEnd() })
		;
		
        //browser adjustments
        if ($.browser.msie && $.browser.version < 7.0) {
            $('.hDiv,.bDiv,.mDiv,.pDiv,.vGrip,.tDiv, .sDiv', g.gDiv)
			.css({ width: '100%' });
            $(g.gDiv).addClass('ie6');
            if (p.width != 'auto') $(g.gDiv).addClass('ie6fullwidthbug');
        }

        g.rePosDrag();
        g.fixHeight();

        //make grid functions accessible
        t.p = p;
        t.grid = g;

        // load data
        /*
        //原先的代码
        if (p.url && p.autoload) {
            g.populate();
        }
        */
        //-----------------start----------------//
		//生成表格后面，不然火狐下宽度不对 modify by lwj 11.6.15
		/*
        if (p.autoload) {
            p.isSuccessSearch = true;
            g.populate();
        }
		*/
		//-----------------end----------------//
        
	    /*-------------start---------------*/
	    // add by lwj 10.6.22 
	    //对装表格容器的第一个table加样式grid_layout_style，防止列过宽时，撑大表格
		var pts = $("#"+p.container_id).parents("table");
		
		if(pts.length){
			var pt = $(pts[0]);
			if(!pt.hasClass("grid_layout_style")){
				pt.addClass("grid_layout_style");
			}
		}
		//-----------------start----------------//
		//生成表格后面，不然火狐下宽度不对 modify by lwj 11.6.15
        if (p.autoload) {
            p.isSuccessSearch = true;
            g.populate();
        }
		//-----------------start----------------//
        return t;

    };

    var docloaded = false;

    $(document).ready(function() { docloaded = true });

    $.fn.createTreeGrid = function(p) {
        return this.each(function() {
            if (!docloaded) {
                $(this).hide();
                var t = this;
                $(document).ready
					(
						function() {
						    $.addTreeFlex(t, p);
						}
					);
            } else {
                $.addTreeFlex(this, p);
            }
        });

    }; //end flexigrid


    $.fn.noSelect = function(p) { //no select plugin by me :-)
        if (p == null)
            prevent = true;
        else
            prevent = p;

        if (prevent) {

            return this.each(function() {
                if ($.browser.msie || $.browser.safari) $(this).bind('selectstart', function() { return false; });
                else if ($.browser.mozilla) {
                    $(this).css('MozUserSelect', 'none');
                    $('body').trigger('focus');
                }
                else if ($.browser.opera) $(this).bind('mousedown', function() { return false; });
                else $(this).attr('unselectable', 'on');
            });

        } else {


            return this.each(function() {
                if ($.browser.msie || $.browser.safari) $(this).unbind('selectstart');
                else if ($.browser.mozilla) $(this).css('MozUserSelect', 'inherit');
                else if ($.browser.opera) $(this).unbind('mousedown');
                else $(this).removeAttr('unselectable', 'on');
            });

        }
    }; //end noSelect
	
	
	
})(jQuery);


var NLTreeTable = function(param){
	//------------------start---------------------//
	// modify by lwj 11.6.14
	String.prototype.replaceAll = function(s1,s2){    
		return this.replace(new RegExp(s1,"gm"),s2);    
	}
	//------------------end---------------------//

	// 引用默认属性
	param = jQuery.extend({
		container_id: "",//容器ID
		table_id: "",//表格ID
		tableData: false,//表格数据
		onChangePage: false,//页数变化事件
		onAppendChild: false,//请求子行数据时，所注册的方法
	    height: 200, //flexigrid插件的高度，单位为px
	    sortname: "id",//默认排序字段
		sortorder: "desc",//默认排序方式
	    width: 'auto', //宽度值，auto表示根据每列的宽度自动计算
	    linkPicColumnWidth: 40,//关联图标列的宽度
	    striped: false, //是否显示斑纹效果，默认是奇偶交互的形式
	    novstripe: false,
	    maskObject: false,//表格请求数据时，需要遮罩的对象。可以为ID，也可以为html对象
	    minwidth: 30, //列的最小宽度
	    minheight: 80, //列的最小高度
	    resizable: false, //resizable table是否可伸缩
	    url: false, //ajax url,ajax方式对应的url地址
	    method: 'POST', // data sending method,数据发送方式
	    dataType: 'json', // type of data loaded,数据加载的类型，xml,json
	    errormsg: '数据请求失败!', //错误提升信息
	    usepager: true, //是否分页
	    nowrap: false, //是否不换行
	    page: 1, //current page,默认当前页
	    total: 1, //total pages,总页面数
	    useRp: true, //use the results per page select box,是否可以动态设置每页显示的结果数
	    rp: 10, // results per page,每页默认的结果数
	    rpOptions: [10, 15, 20, 25, 40, 100], //可选择设定的每页结果数
	    title: "数据列表", //是否包含标题
	    pagestat: '显示记录从{from}到{to}，总数 {total} 条', //显示当前页和总页面的样式
	    procmsg: '正在处理数据，请稍候 ...', //正在处理的提示信息
	    query: '', //搜索查询的条件
	    qtype: '', //搜索查询的类别
	    qop: "Eq", //搜索的操作符
	    nomsg: '没有符合条件的记录存在', //无结果的提示信息
	    minColToggle: 1, //minimum allowed column to be hidden
	    showToggleBtn: false, //show or hide column toggle popup colModel中的toggle属性是　是否在标题栏的下拉　是否显示菜单中　显示
	    hideOnSubmit: true, //显示遮盖
	    showTableToggleBtn: false, //显示隐藏Grid 
	    autoload: false, //自动加载
	    blockOpacity: 0.5, //透明度设置
	    onToggleCol: false, //当在行之间转换时
	    onChangeSort: false, //当改变排序时
	    onSuccess: false, //成功后执行
	    onSubmit: false, // using a custom populate function,调用自定义的计算函数
	    showcheckbox: false, //是否显示第一列的checkbox（用于全选）
	    rowhandler: false, //是否启用行的扩展事情功能,在生成行时绑定事件，如双击，右键等（该事件每行构造的时候都会执行）
	    onRowSelectedChangeClass: false,//add by lwj 10.3.3 当行选中时，要做的操作(只有当钩选框不显示的时候才有效)
	    rowbinddata: true,//配合上一个操作，如在双击事件中获取该行的数据
	    extParam: [{}],//添加extParam参数可将外部参数动态注册到grid，实现如查询等操作
	    successResultID: "1",//后台处理时默认返回的成功的数字标识
	    showSuccessMsg: true,//后台处理时是否显示成功信息，默认不显示
	    showErrorMsg: true,//后台处理时是否显示错误信息，默认显示
		cbLinked: true,//modify by lwj 12.5.14 加上钩选框是否关联孩子属性
	    //Style
	    gridClass: "bbit-grid-tree",
		picOnMouseover: false, //配置第二列图标是否有mouseover事件，默认是没有
		linkPicClass: false		//自定义节点打开、关闭、以及叶子节点的图标样式
	}, param);

	param.striped = false;		//屏蔽显示斑纹效果
	param.resizable = false; //resizable table是否可伸缩
	
	var subLen = 25;//列头栏25 列头的1px不计算
	subLen += 1;//排序样式 nBtn 1px;
	subLen += 1;//排序样式 nDiv 1px;
	if(param.title){
		subLen += 23;//标题栏23
	}
	if(param.buttons){
		subLen += 26;//按钮栏26
	}
	if(param.usepager){
		subLen += 31;//分页栏31
	}		
	
	param.height = param.height - subLen;

	//-------------------start---------------------//
	// modify by lwj 11.6.16
	if(param.height < 0){
		param.height = 0;
	}
	//-------------------end---------------------//	

	//param.colModel.unshift({display: '', name : '__TABLE_ROW_AND_ROW_LINK__',width : 50, sortable : false, align: 'left',hide: false,toggle : false});
	
	
	/*
	*在容器中创建表格的html元素
	*/
	function createTreeTable(){
		jQuery("#"+param.container_id).append("<table id=\""+param.table_id+"\" style=\"display:none\"></table>");
	}

	createTreeTable();
	

	var treeGridObj = jQuery("#"+param.table_id).createTreeGrid(param);
	
	
    /*-------------start---------------*/
    /* 这是原先的自有代码
    $.fn.flexReload = function(p) { // function to reload grid

        return this.each(function() {
            if (this.grid && this.p.url) this.grid.populate();
        });

    }; //end flexReload*/
    /*-------------end---------------*/
    
    
    /*-------------start---------------*/
    // modify by lwj 10.3.11 修改flexReload方法
    this.flexReload = function(extParam, tableData) { // function to reload grid        
        return treeGridObj.each(function() {        
            if (treeGridObj[0].grid){    	
				var param = {
	        		'newp': treeGridObj[0].p.newp ? treeGridObj[0].p.newp : null, 
	        		'extParam': extParam ? extParam : [{}]
	        	};	        	        	
	        	if(tableData){
	        		param.tableData = tableData;
	        	}
            	treeGridObj[0].grid.freshParam(param);
            	
            	treeGridObj[0].grid.populate();
            }
        });

    }; //end flexReload
    /*-------------end---------------*/
    
    /*-------------start---------------*/
    // add by lwj 10.3.15 增加clearAllRows方法
    this.clearAllRows = function() {
        if (treeGridObj[0].grid) {
        	treeGridObj[0].grid.clearAllRows();
        }
    }; //end flexReload
    /*-------------end---------------*/    
    
    
    //重新指定宽度和高度
    this.flexResize = function(w, h) {
		//var p = { width: w, height: h-subLen };
		//----------------start------------------//
		//modify by lwj 11.6.15
		var p = {};
		if(w){
			p.width = w;
		}
		if(h){
			h = parseInt(h,10);
			p.height = h-subLen;
			if(p.height < 0){
				p.height = 0;
			}
		}
		//----------------end------------------//
        return treeGridObj.each(function() {
            if (treeGridObj[0].grid) {
                jQuery.extend(treeGridObj[0].p, p);
                treeGridObj[0].grid.reSize();
            }
        });
    }
    /*
   	this.ChangePage = function(type) {
        return treeGridObj.each(function() {
            if (treeGridObj[0].grid) {
                treeGridObj[0].grid.changePage(type);
            }
        })
    }
    */
    this.flexOptions = function(p) { //function to update general options

        return treeGridObj.each(function() {
            if (treeGridObj[0].grid) jQuery.extend(treeGridObj[0].p, p);
        });

    }; //end flexOptions
    this.GetOptions = function() {
        if (treeGridObj[0].grid) {
            return treeGridObj[0].p;
        }
        return null;
    }
    this.getCheckedRows = function() {
        if (treeGridObj[0].grid) {
            return treeGridObj[0].grid.getCheckedRows();
        }
        return [];
    }
    
	
    /*-----------------start---------------------*/
    //add by lwj 10.3.8
    //增加search方法
    //传入额外的初始化参数
	this.search = function(extParam, tableData){
        if (treeGridObj[0].grid) {
        	var param = {
        		'newp': treeGridObj[0].p.newp ? treeGridObj[0].p.newp : null,
        		'extParam': extParam ? extParam : [{}]
        	};        	
        	if(tableData){
        		param.tableData = tableData;
        	}
        	treeGridObj[0].grid.freshParam(param);
            treeGridObj[0].grid.populate();
        }
	}
	/*-----------------end---------------------*/	
	
    /*-----------------start---------------------*/
    //add by lwj 10.3.8
    //增加getRowData方法
	this.getRowData = function(row_object){
        if (treeGridObj[0].grid) {
            return treeGridObj[0].grid.getRowData(row_object);
        }
	}
	/*-----------------end---------------------*/
	
    /*-----------------start---------------------*/
    //add by lwj 10.3.11
    //增加getRowsData方法
	this.getRowsData = function(){
        if (treeGridObj[0].grid) {
            return treeGridObj[0].grid.getRowsData();
        }
	}
	/*-----------------end---------------------*/
	
    /*-----------------start---------------------*/
    //add by lwj 10.3.8
    //增加cancelAllSelectState方法，取消所有选中行的状态
	this.cancelAllSelectState = function(){
        if (treeGridObj[0].grid) {
            treeGridObj[0].grid.cancelAllSelectState();
        }
	}
	/*-----------------end---------------------*/	
	
    /*-----------------start---------------------*/
    //add by lwj 10.7.5
    //增加mask遮罩方法
	this.mask = function(){
        if (treeGridObj[0].grid) {
            treeGridObj[0].grid.doMask('mask');;
        }
	}
	/*-----------------end---------------------*/	
	
	/*-----------------start---------------------*/
    //add by lwj 10.3.8
    //增加unmask方法，取消遮罩
	this.unmask = function(){
        if (treeGridObj[0].grid) {
            treeGridObj[0].grid.doMask('unmask');;
        }
	}
	/*-----------------end---------------------*/


   	this.flexToggleCol = function(cid, visible) { // function to reload grid

        return treeGridObj.each(function() {
            if (treeGridObj[0].grid) treeGridObj[0].grid.toggleCol(cid, visible);
        });

    }; //end flexToggleCol

   this.flexAddData = function(data) { // function to add data to grid

        return treeGridObj.each(function() {
            if (treeGridObj[0].grid) treeGridObj[0].grid.addData(data);
        });

    };
	
	/*-----------------start---------------------*/
    //add by lwj 10.8.12
    //增加appendChild方法，展开子行数据	
	this.appendChild = function(data, param){
        if (treeGridObj[0].grid) {
			if(param.parentId == undefined){
				param.parentId = treeGridObj[0].grid.getParentId(param);
			}
			if(!param.noDel){//如果不允许删除孩子节点，则需要特殊处理
				
			}
        	var data = treeGridObj[0].grid.changeJsonObject(data, param);
            treeGridObj[0].grid.appendChild(data[0], param);
        }
	}
	/*-----------------end---------------------*/
	
	/*-----------------start---------------------*/
    //add by lwj 10.9.13
    //增加stopPropagation方法，阻止事件冒泡
	this.stopPropagation = function(e){
		if (e && e.stopPropagation){
			e.stopPropagation();
		}else{
			window.event.cancelBubble = true;
		}
	}
	/*-----------------end---------------------*/

	/*----------------------start------------------------*/
	this.openRow = function(param){
		if(treeGridObj[0].grid){
			treeGridObj[0].grid.openRow(param);
		}
	}
	/*----------------------end------------------------*/

	/*----------------------start------------------------*/
	this.closeRow = function(param){
		if(treeGridObj[0].grid){
			treeGridObj[0].grid.closeRow(param);
		}
	}
	/*----------------------end------------------------*/

	/*---------------------start-----------------------*/
	this.adjustOrder = function(param){
		if(treeGridObj[0].grid){
			treeGridObj[0].grid.adjustOrder(param);
		}
	}
	/*----------------------end------------------------*/

	/*----------------------start------------------------*/
	this.deleteRow = function(param){
		if(treeGridObj[0].grid){
			treeGridObj[0].grid.deleteRow(param);
		}
	}
	/*----------------------end------------------------*/

	/*----------------------start------------------------*/
	this.getAllData = function(param){
		if(treeGridObj[0].grid){
			return treeGridObj[0].grid.getAllData(param);
		}
	}
	/*----------------------end------------------------*/
}


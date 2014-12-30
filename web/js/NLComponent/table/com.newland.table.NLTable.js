(function(a) {
	a.addFlex = function(u, w) {
		if (u.grid) {
			return false
		}
		a(u).show().attr({
			cellPadding : 0,
			cellSpacing : 0,
			border : 0
		}).removeAttr("width");
		var z = {
			hset : {},
			rePosDrag : function() {
				var p = 0 - this.hDiv.scrollLeft;
				if (this.hDiv.scrollLeft > 0) {
					p -= Math.floor(w.cgwidth / 2)
				}
				a(z.cDrag).css({
					top : z.hDiv.offsetTop + 1
				});
				var g = this.cdpad;
				a("div", z.cDrag).hide();
				a("thead tr:first th:visible", this.hDiv).each(function() {
					if (a(this).css("display") == "none") {
						return
					}
					var G = a("thead tr:first th:visible", z.hDiv).index(this);
					var F = parseInt(a("div", this).width());
					var t = F;
					if (p == 0) {
						p -= Math.floor(w.cgwidth / 2)
					}
					F = F + p + g;
					a("div:eq(" + G + ")", z.cDrag).css({
						left : F + "px"
					}).show();
					p = F
				})
			},
			fixHeight : function(p) {
				p = false;
				if (!p) {
					p = a(z.bDiv).height()
				}
				var F = a(this.hDiv).height();
				a("div", this.cDrag).each(function() {
					a(this).height(p + F)
				});
				var t = parseInt(a(z.nDiv).height());
				if (t > p) {
					a(z.nDiv).height(p).width(200)
				} else {
					a(z.nDiv).height("auto").width("auto")
				}
				a(z.block).css({
					height : p,
					marginBottom : (p * -1)
				});
				var g = z.bDiv.offsetTop + p;
				if (w.height != "auto" && w.resizable) {
					g = z.vDiv.offsetTop
				}
				a(z.rDiv).css({
					height : g
				})
			},
			dragStart : function(G, F, t) {
				if (G == "colresize") {
					a(z.nDiv).hide();
					a(z.nBtn).hide();
					var H = a("div", this.cDrag).index(t);
					var g = a("th:visible div:eq(" + H + ")", this.hDiv)
							.width();
					a(t).addClass("dragging").siblings().hide();
					this.colresize = {
						startX : F.pageX,
						ol : parseInt(t.style.left),
						ow : g,
						n : H
					};
					a("body").css("cursor", "col-resize")
				} else {
					if (G == "vresize") {
						var p = false;
						a("body").css("cursor", "row-resize");
						if (t) {
							p = true;
							a("body").css("cursor", "col-resize")
						}
						this.vresize = {
							h : w.height,
							sy : F.pageY,
							w : w.width,
							sx : F.pageX,
							hgo : p
						}
					} else {
						if (G == "colMove") {
							a(z.nDiv).hide();
							a(z.nBtn).hide();
							this.hset = a(this.hDiv).offset();
							this.hset.right = this.hset.left
									+ a("table", this.hDiv).width();
							this.hset.bottom = this.hset.top
									+ a("table", this.hDiv).height();
							this.dcol = t;
							this.dcoln = a("th", this.hDiv).index(t);
							this.colCopy = document.createElement("div");
							this.colCopy.className = "colCopy";
							this.colCopy.innerHTML = t.innerHTML;
							if (a.browser.msie) {
								this.colCopy.className = "colCopy ie"
							}
							a(this.colCopy).css({
								position : "absolute",
								"float" : "left",
								display : "none",
								textAlign : t.align
							});
							a("body").append(this.colCopy);
							a(this.cDrag).hide()
						}
					}
				}
				a("body").noSelect()
			},
			calScrollBarWidth : function() {
				var G = document.createElement("p");
				G.style.width = "100%";
				G.style.height = "200px";
				var H = document.createElement("div");
				H.style.position = "absolute";
				H.style.top = "0px";
				H.style.left = "0px";
				H.style.visibility = "hidden";
				H.style.width = "200px";
				H.style.height = "150px";
				H.style.overflow = "hidden";
				H.appendChild(G);
				document.body.appendChild(H);
				var p = G.offsetWidth;
				var F = G.offsetHeight;
				H.style.overflow = "scroll";
				var g = G.offsetWidth;
				var t = G.offsetHeight;
				if (p == g) {
					g = H.clientWidth
				}
				if (F == t) {
					t = H.clientWidth
				}
				document.body.removeChild(H);
				window.scrollbarWidth = p - g;
				window.scrollbarHeight = F - t;
				return {
					scrollbarWidth : window.scrollbarWidth,
					scrollbarHeight : window.scrollbarHeight
				}
			},
			calWidth : function(G) {
				var J = a("#" + w.container_id).outerWidth();
				if (typeof w.width == "string" && w.width.indexOf("%") != -1) {
					if (w.showcheckbox) {
						J = J * parseFloat(w.width) * 0.01 - 2 - 32
					} else {
						J = J * parseFloat(w.width) * 0.01 - 2
					}
				} else {
					if (typeof w.width == "string"
							&& w.width.indexOf("%") == -1) {
						if (w.showcheckbox) {
							J = parseFloat(w.width) - 32 - 2
						} else {
							J = parseFloat(w.width) - 2
						}
					} else {
						if (w.showcheckbox) {
							J = w.width - 32 - 2
						} else {
							J = w.width - 2
						}
					}
				}
				J = J * G.totalColsWidthPercent;
				var I = a("#" + w.container_id + " .bbit-grid .bDiv");
				if (I[0].clientWidth < I[0].offsetWidth - 4) {
					J = J - z.calScrollBarWidth().scrollbarWidth
				}
				for ( var F = 0, t = w.colModel.length; F < t; F++) {
					var p = w.colModel[F];
					var g;
					var H = a("#" + w.container_id
							+ " .bbit-grid .hDiv th[axis=col" + F + "]");
					if (typeof p.width == "string"
							&& p.width.indexOf("%") != -1) {
						g = J
								* (parseFloat(p.width) * 0.01 / G.nowPerColPercent)
								- 10
					} else {
						g = parseFloat(p.width)
					}
					H.attr("width", g);
					H.children("div").css("width", g);
					a(".bbit-grid .bDiv tr[id^='" + w.table_id + "_row_']")
							.each(
									function() {
										a(this).children("td").eq(
												w.showcheckbox ? F + 1 : F)
												.children("div")
												.css("width", g)
									});
					z.rePosDrag()
				}
			},
			calPerColPercent : function() {
				var t = 0;
				var O = 0;
				var J = 0;
				var K = 1;
				var g = true;
				var F = a("input.noborder", z.nDiv).filter(function() {
					return !a(this).attr("checked")
				});
				var I = a("input.noborder", z.nDiv).filter(function() {
					return a(this).attr("checked")
				});
				for ( var H = 0, L = w.colModel.length; H < L; H++) {
					var Q = w.colModel[H];
					var R = Q.width;
					if (Q.hide) {
						var N = false;
						for ( var G = 0, M = F.length; G < M; G++) {
							var p = a(
									"th[axis='col" + a(F[G]).attr("value")
											+ "']", this.hDiv).children()
									.text();
							if (p == Q.display) {
								N = true;
								break
							}
						}
						for ( var G = 0, P = I.length; G < P; G++) {
							var p = a(
									"th[axis='col" + a(I[G]).attr("value")
											+ "']", this.hDiv).children()
									.text();
							if (p == Q.display) {
								N = true;
								break
							}
						}
						if (!N) {
							if (typeof Q.width == "string"
									&& Q.width.indexOf("%") != -1) {
								O += parseInt(Q.width)
							}
						}
					}
					if (typeof R == "string" && R.indexOf("%") != -1) {
						g = true;
						J += parseInt(R)
					} else {
						g = false
					}
				}
				J = J * 0.01;
				for ( var H = 0, L = F.length; H < L; H++) {
					var R = a("th[axis='col" + a(F[H]).attr("value") + "']",
							this.hDiv).attr("oriWidth");
					if (R.indexOf("%") == -1) {
						g = false;
						break
					} else {
						g = true
					}
					t += parseInt(R)
				}
				t = O + t;
				K = J - t * 0.01;
				return {
					isPercent : g,
					nowPerColPercent : K,
					hideColsWidth : t,
					totalColsWidthPercent : J
				}
			},
			reSize : function() {
				a(this.gDiv).width(w.width);
				a(this.bDiv).height(w.height);
				var g = z.calPerColPercent();
				if (g.isPercent) {
					z.calWidth(g)
				}
			},
			dragMove : function(G) {
				if (this.colresize) {
					var p = this.colresize.n;
					var L = G.pageX - this.colresize.startX;
					var H = this.colresize.ol + L;
					var F = this.colresize.ow + L;
					if (F > w.minwidth) {
						a("div:eq(" + p + ")", this.cDrag).css("left", H);
						this.colresize.nw = F
					}
				} else {
					if (this.vresize) {
						var M = this.vresize;
						var J = G.pageY;
						var L = J - M.sy;
						if (!w.defwidth) {
							w.defwidth = w.width
						}
						if (w.width != "auto" && !w.nohresize && M.hgo) {
							var K = G.pageX;
							var t = K - M.sx;
							var g = M.w + t;
							if (g > w.defwidth) {
								this.gDiv.style.width = g + "px";
								w.width = g
							}
						}
						var I = M.h + L;
						if ((I > w.minheight || w.height < w.minheight)
								&& !M.hgo) {
							this.bDiv.style.height = I + "px";
							w.height = I;
							this.fixHeight(I)
						}
						M = null
					}
				}
			},
			dragEnd : function() {
				if (this.colresize) {
					var p = this.colresize.n;
					var g = this.colresize.nw;
					a("th:visible div:eq(" + p + ")", this.hDiv)
							.css("width", g);
					a("th:visible div:eq(" + p + ")", this.hDiv).parent("th")
							.css("width", g);
					a("tr", this.bDiv).each(
							function() {
								a(
										"td:visible div[candrag='true']:eq("
												+ p + ")", this)
										.css("width", g)
							});
					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
					a("div:eq(" + p + ")", this.cDrag).siblings().show();
					a(".dragging", this.cDrag).removeClass("dragging");
					this.rePosDrag();
					this.fixHeight();
					this.colresize = false
				} else {
					if (this.vresize) {
						this.vresize = false
					} else {
						if (this.colCopy) {
							a(this.colCopy).remove();
							if (this.dcolt != null) {
								a(this.cdropleft).remove();
								a(this.cdropright).remove();
								this.rePosDrag()
							}
							this.dcol = null;
							this.hset = null;
							this.dcoln = null;
							this.dcolt = null;
							this.colCopy = null;
							a(".thMove", this.hDiv).removeClass("thMove");
							a(this.cDrag).show()
						}
					}
				}
				a("body").css("cursor", "default");
				a("body").noSelect(false)
			},
			toggleCol : function(I, G) {
				var F = a("th[axis='col" + I + "']", this.hDiv)[0];
				var H = a("thead th", z.hDiv).index(F);
				var g = a("input[value=" + I + "]", z.nDiv)[0];
				var t = a("input[value=" + I + "]", z.eDiv)[0];
				if (G == null) {
					G = F.hide
				}
				if (a("input:checked", z.nDiv).length < w.minColToggle && !G) {
					return false
				}
				if (G) {
					F.hide = false;
					a(F).show();
					g.checked = true;
					if (t) {
						t.checked = true
					}
				} else {
					F.hide = true;
					a(F).hide();
					g.checked = false;
					if (t) {
						t.checked = false
					}
				}
				a("tbody tr[id^='" + w.table_id + "_row_']", u).each(
						function() {
							var J = a(this).children("td");
							if (G) {
								a(J[H]).show()
							} else {
								a(J[H]).hide()
							}
						});
				var p = z.calPerColPercent();
				if (p.isPercent) {
					z.calWidth(p)
				}
				this.rePosDrag();
				if (w.onToggleCol) {
					w.onToggleCol(I, G)
				}
				return G
			},
			switchCol : function(p, g) {
				a("tbody tr", u).each(
						function() {
							if (p > g) {
								a("td:eq(" + g + ")", this).before(
										a("td:eq(" + p + ")", this))
							} else {
								a("td:eq(" + g + ")", this).after(
										a("td:eq(" + p + ")", this))
							}
						});
				if (p > g) {
					a("tr:eq(" + g + ")", this.nDiv).before(
							a("tr:eq(" + p + ")", this.nDiv))
				} else {
					a("tr:eq(" + g + ")", this.nDiv).after(
							a("tr:eq(" + p + ")", this.nDiv))
				}
				if (a.browser.msie && a.browser.version < 7) {
					a("tr:eq(" + g + ") input", this.nDiv)[0].checked = true
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft
			},
			scroll : function() {
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				this.rePosDrag()
			},
			hideLoading : function() {
				a(".pReload", this.pDiv).removeClass("loading");
				if (w.hideOnSubmit) {
					z.doMask("unmask")
				}
				if (w.usepager) {
					a(".pPageStat", this.pDiv).html(w.errormsg)
				}
				this.loading = false
			},
			addData : function(H) {
				if (w.preProcess) {
					H = w.preProcess(H)
				}
				a(".pReload", this.pDiv).removeClass("loading");
				this.loading = false;
				if (!H) {
					if (w.usepager) {
						a(".pPageStat", this.pDiv).html(w.errormsg)
					}
					return false
				}
				var t = w.total;
				if (w.dataType == "xml") {
					w.total = +a("rows total", H).text()
				} else {
					w.total = H.total
				}
				if (w.total < 0) {
					w.total = t
				}
				if (w.total == 0) {
					a("tr, a, td, div", u).unbind();
					a(u).empty();
					w.pages = 1;
					w.page = 1;
					if (w.usepager) {
						this.buildpager();
						a(".pPageStat", this.pDiv).html(w.nomsg)
					}
					if (w.hideOnSubmit) {
						z.doMask("unmask")
					}
					return false
				}
				w.pages = Math.ceil(w.total / w.rp);
				if (w.dataType == "xml") {
					w.page = +a("rows page", H).text()
				} else {
					w.page = H.page
				}
				if (w.usepager) {
					this.buildpager()
				}
				var p = a("thead tr:first th", z.hDiv);
				var I = a("thead tr:first th div", z.hDiv);
				var G = [];
				var F = H.oriDateValue;
				G.push("<tbody>");
				if (w.dataType == "json") {
					if (H.rows != null) {
						a
								.each(
										H.rows,
										function(J, M) {
											G.push("<tr id='", w.table_id
													+ "_row_", M.id, "'");
											if (J % 2 && w.striped) {
												G.push(" class='erow'")
											}
											if (F && F.length > 0) {
												G.push(" value_type='"
														+ F[J].type
														+ "' date_value="
														+ F[J].value + " ")
											}
											if (w.rowbinddata) {
												var K = "";
												for ( var J = 0; J < M.cell.length; J++) {
													if (typeof (M.cell[J]) == "string"
															&& w.isFilter) {
														K = K
																+ M.cell[J]
																		.replace(
																				/\</g,
																				"&lt;")
																		.replace(
																				/\>/g,
																				"&gt;")
																		.replaceAll(
																				'"',
																				"&quot;")
													} else {
														K = K + M.cell[J]
													}
													if (J < M.cell.length - 1) {
														K = K + "_FG$SP_"
													}
												}
												G.push('chd="' + K + '"')
											}
											G.push(">");
											var L = M.id;
											a(p)
													.each(
															function(O) {
																var S = "";
																var Q = "";
																G
																		.push(
																				"<td align='",
																				this.align,
																				"'");
																var N = a(this)
																		.attr(
																				"axis")
																		.substr(
																				3);
																if (w.sortname
																		&& w.sortname == a(
																				this)
																				.attr(
																						"abbr")) {
																	Q = "sorted"
																}
																if (this.hide) {
																	G
																			.push(" style='display:none;'")
																}
																var P = I[O].style.width;
																var T = [];
																var R = M.cell[N]
																		|| "";
																if (N != "-1") {
																	if (this.format) {
																		R = this
																				.format(
																						R,
																						L)
																	}
																	if (w.colModel[N].ct
																			&& w.colModel[N].ct.type == "date") {
																		R = z
																				.parseData({
																					data : R,
																					colModel : w.colModel[N]
																				})
																	}
																}
																if (typeof R == "string"
																		&& w.isFilter) {
																	R = R
																			.replace(
																					/\</g,
																					"&lt;")
																			.replace(
																					/\</g,
																					"&lt;")
																			.replaceAll(
																					'"',
																					"&quot;")
																}
																T
																		.push(
																				"<div candrag='true' title=\""
																						+ R
																						+ "\" style='text-align:",
																				this.align,
																				";width:"
																						+ P,
																				";");
																if (w.nowrap == false) {
																	T
																			.push("white-space:normal;word-break:break-all;")
																}
																if (w.showcheckbox) {
																	T
																			.push(" padding:2px 4px 0px 4px;'>")
																} else {
																	T
																			.push(" padding:4px 4px 2px 4px;'>")
																}
																if (N == "-1") {
																	if (w.disCheckbox) {
																		T
																				.push(
																						"<input type='checkbox' id='chk_",
																						M.id,
																						"' class='itemchk' value='",
																						M.id,
																						"' disabled='disabled'/>")
																	} else {
																		T
																				.push(
																						"<input type='checkbox' id='chk_",
																						M.id,
																						"' class='itemchk' value='",
																						M.id,
																						"'/>")
																	}
																	if (Q != "") {
																		Q += " chboxtd"
																	} else {
																		Q += "chboxtd"
																	}
																} else {
																	T.push(R)
																}
																T
																		.push("</div>");
																if (Q != "") {
																	G
																			.push(
																					" class='",
																					Q,
																					"'")
																}
																G
																		.push(
																				">",
																				T
																						.join(""),
																				"</td>")
															});
											G.push("</tr>")
										})
					}
				} else {
					if (w.dataType == "xml") {
						i = 1;
						a("rows row", H)
								.each(
										function() {
											i++;
											var K = this;
											var J = new Array();
											a("cell", K).each(function() {
												J.push(a(this).text())
											});
											var M = a(this).attr("id");
											G.push("<tr id='", "row", M, "'");
											if (i % 2 && w.striped) {
												G.push(" class='erow'")
											}
											if (w.rowbinddata) {
												G.push("chd='", J
														.join("_FG$SP_"), "'")
											}
											G.push(">");
											var L = M;
											a(p)
													.each(
															function(O) {
																G
																		.push(
																				"<td align='",
																				this.align,
																				"'");
																if (this.hide) {
																	G
																			.push(" style='display:none;'")
																}
																var Q = "";
																var S = "";
																var N = a(this)
																		.attr(
																				"axis")
																		.substr(
																				3);
																if (w.sortname
																		&& w.sortname == a(
																				this)
																				.attr(
																						"abbr")) {
																	Q = "sorted"
																}
																var P = I[O].style.width;
																var T = [];
																T
																		.push(
																				"<div style='text-align:",
																				this.align,
																				";width:",
																				P,
																				";");
																if (w.nowrap == false) {
																	T
																			.push("white-space:normal")
																}
																T.push("'>");
																if (N == "-1") {
																	T
																			.push(
																					"<input type='checkbox' id='chk_",
																					M,
																					"' class='itemchk' value='",
																					M,
																					"'/>");
																	if (Q != "") {
																		Q += " chboxtd"
																	} else {
																		Q += "chboxtd"
																	}
																} else {
																	var R = J[N]
																			|| "&nbsp;";
																	if (w.rowbinddata) {
																		S = J[N]
																				|| ""
																	}
																	if (this.format) {
																		R = this
																				.format(
																						R,
																						L)
																	}
																	T.push(R)
																}
																T
																		.push("</div>");
																if (Q != "") {
																	G
																			.push(
																					" class='",
																					Q,
																					"'")
																}
																G
																		.push(
																				" axis='",
																				S,
																				"'",
																				">",
																				T
																						.join(""),
																				"</td>")
															});
											G.push("</tr>")
										})
					}
				}
				G.push("</tbody>");
				a(u).html(G.join(""));
				this.rePosDrag();
				this.addRowProp();
				this.applyEvent();
				if (w.onSuccess) {
					w.onSuccess(this)
				}
				if (w.hideOnSubmit) {
					z.doMask("unmask")
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				if (a.browser.opera) {
					a(u).css("visibility", "visible")
				}
				var g = z.calPerColPercent();
				if (g.isPercent) {
					z.calWidth(g)
				}
			},
			clearAllRows : function() {
				a(u).html("");
				if (w.showcheckbox) {
					a("input:first", z.hDiv).attr("checked", "")
				}
				z.doUsePager();
				w.isSuccessSearch = false;
				z.freshSortClass()
			},
			addCss : function(p) {
				var g;
				if (p.str) {
					g = document.createElement("style");
					g.setAttribute("type", "text/css");
					g.setAttribute("id", "grid_customBg_" + p.id);
					if (g.styleSheet) {
						document.getElementsByTagName("head")[0].appendChild(g);
						g.styleSheet.cssText = p.str
					} else {
						g.appendChild(document.createTextNode(p.str));
						document.getElementsByTagName("head")[0].appendChild(g)
					}
				}
				if (p.url) {
					if (document.createStyleSheet) {
						try {
							g = document.createStyleSheet(p.url)
						} catch (t) {
						}
					} else {
						g = document.createElement("link");
						g.rel = "stylesheet";
						g.type = "text/css";
						g.media = "all";
						g.href = p.url;
						document.getElementsByTagName("head")[0].appendChild(g)
					}
				}
			},
			reverseRowOrColumnCol : {
				setCol : {
					isCall : false,
					param : new Array(),
					bgColor : new Array()
				},
				clearCol : {
					isCall : false,
					param : new Array()
				},
				_index : 0
			},
			setRowOrColumnCol : function(H) {
				var g = [];
				var O = true;
				var T = a("tbody tr[id^='" + w.table_id + "_row_']", z.bDiv);
				if (H) {
					if (H.bgColor) {
						var G = H.bgColor.indexOf("#") == -1 ? H.bgColor
								: H.bgColor.substr(1);
						var L = ".bbit-grid tr td.customBgCol" + G
								+ "{background-color: " + H.bgColor
								+ ";}.bbit-grid tr.erow td.customBgCol" + G
								+ "{background-color: " + H.bgColor
								+ ";}.bbit-grid tr.newadd_tr td.customBgCol"
								+ G + "{background-color: " + H.bgColor + ";}";
						for ( var P = 0; P < z.reverseRowOrColumnCol.setCol.bgColor.length; P++) {
							var M = "grid_customBg_"
									+ z.reverseRowOrColumnCol.setCol.bgColor[P];
							if (a("#" + M).length >= 1
									&& z.reverseRowOrColumnCol.setCol.bgColor[P] == H.bgColor) {
								O = false
							} else {
								O = true
							}
						}
					}
					if (H.rowNum && H.colNum) {
						var R = H.colNum;
						if (w.showcheckbox) {
							R = "";
							g = H.colNum.split(",");
							for ( var P = 0; P < g.length; P++) {
								if (!isNaN(parseInt(g[P]))) {
									R += (parseInt(g[P]) + 1) + ","
								}
							}
							var Q = R.lastIndexOf(",");
							R = R.substr(0, Q)
						}
						var t = H.rowNum.split(",");
						var I = R.split(",");
						if (H.bgColor && O) {
							z.addCss({
								str : L,
								id : H.bgColor
							})
						}
						for ( var P = 0; P < t.length; P++) {
							if (!isNaN(parseInt(t[P]))) {
								var W = T.eq(parseInt(t[P]) - 1);
								var V = W.children("td");
								for ( var N = 0; N < I.length; N++) {
									if (!isNaN(parseInt(I[N]))) {
										if (H.color) {
											a(V[parseInt(I[N] - 1)]).css(
													"color", H.color)
										}
										if (H.bgColor) {
											if (O) {
												for ( var S = 0; S < z.reverseRowOrColumnCol.setCol.bgColor.length; S++) {
													var J = z.reverseRowOrColumnCol.setCol.bgColor[S];
													if (J.indexOf("#") == -1) {
														if (a(
																V[parseInt(I[N] - 1)])
																.hasClass(
																		"customBgCol"
																				+ J)) {
															a(
																	V[parseInt(I[N] - 1)])
																	.removeClass(
																			"customBgCol"
																					+ J)
														}
													} else {
														if (a(
																V[parseInt(I[N] - 1)])
																.hasClass(
																		"customBgCol"
																				+ J
																						.substr(1))) {
															a(
																	V[parseInt(I[N] - 1)])
																	.removeClass(
																			"customBgCol"
																					+ J
																							.substr(1))
														}
													}
												}
											}
											a(V[parseInt(I[N] - 1)]).addClass(
													"customBgCol");
											a(V[parseInt(I[N] - 1)]).addClass(
													"customBgCol" + G)
										}
									} else {
										alert("\u8bf7\u4f20\u5165\u7531\u6570\u5b57\u7ec4\u6210\u7684\u5217\u53c2\u6570\uff01\uff01");
										return false
									}
								}
							} else {
								alert("\u8bf7\u4f20\u5165\u7531\u6570\u5b57\u7ec4\u6210\u7684\u884c\u53c2\u6570!!");
								return false
							}
						}
					} else {
						if (H.rowNum) {
							var g = H.rowNum.split(",");
							for ( var P = 0; P < g.length; P++) {
								if (!isNaN(parseInt(g[P]))) {
									continue
								} else {
									alert("rowNum\u53c2\u6570\u542b\u6709\u9664\u9017\u53f7\u4e4b\u5916\u7684\u5176\u4ed6\u975e\u6570\u5b57\u5b57\u7b26\uff01\uff01");
									return false
								}
							}
							if (H.bgColor && O) {
								z.addCss({
									str : L,
									id : H.bgColor
								})
							}
							for ( var P = 0; P < g.length; P++) {
								var K = T.eq(g[P] - 1);
								var V = K.children("td");
								for ( var N = 0; N < V.length - 1; N++) {
									if (H.color) {
										a(
												V[parseInt(w.showcheckbox ? N + 1
														: N)]).css("color",
												H.color)
									}
									if (H.bgColor) {
										if (O) {
											for ( var S = 0; S < z.reverseRowOrColumnCol.setCol.bgColor.length - 1; S++) {
												var J = z.reverseRowOrColumnCol.setCol.bgColor[S];
												if (J.indexOf("#") == -1) {
													if (a(
															V[parseInt(w.showcheckbox ? N + 1
																	: N)])
															.hasClass(
																	"customBgCol"
																			+ J)) {
														a(
																V[parseInt(w.showcheckbox ? N + 1
																		: N)])
																.removeClass(
																		"customBgCol"
																				+ J)
													}
												} else {
													if (a(
															V[parseInt(w.showcheckbox ? N + 1
																	: N)])
															.hasClass(
																	"customBgCol"
																			+ J
																					.substr(1))) {
														a(
																V[parseInt(w.showcheckbox ? N + 1
																		: N)])
																.removeClass(
																		"customBgCol"
																				+ J
																						.substr(1))
													}
												}
											}
										}
										a(
												V[parseInt(w.showcheckbox ? N + 1
														: N)]).addClass(
												"customBgCol");
										a(
												V[parseInt(w.showcheckbox ? N + 1
														: N)]).addClass(
												"customBgCol" + G)
									}
								}
							}
						}
						if (H.colNum) {
							var R = H.colNum;
							if (w.showcheckbox) {
								R = "";
								g = H.colNum.split(",");
								for ( var P = 0; P < g.length; P++) {
									if (!isNaN(parseInt(g[P]))) {
										R += (parseInt(g[P]) + 1) + ","
									} else {
										alert("colNum\u53c2\u6570\u542b\u6709\u9664\u9017\u53f7\u4e4b\u5916\u7684\u5176\u4ed6\u975e\u6570\u5b57\u5b57\u7b26\uff01\uff01");
										return false
									}
								}
								var Q = R.lastIndexOf(",");
								R = R.substr(0, Q)
							} else {
								g = R.split(",");
								for ( var P = 0; P < g.length; P++) {
									if (!isNaN(parseInt(R[P]))) {
										continue
									} else {
										alert("colNum\u53c2\u6570\u542b\u6709\u9664\u9017\u53f7\u4e4b\u5916\u7684\u5176\u4ed6\u975e\u6570\u5b57\u5b57\u7b26\uff01\uff01");
										return false
									}
								}
							}
							if (g.length) {
								g = R.split(",")
							}
							if (H.bgColor && O) {
								z.addCss({
									str : L,
									id : H.bgColor
								})
							}
							for ( var P = 0; P < T.length; P++) {
								var W = T.eq(parseInt(P - 1));
								var V = W.children("td");
								for ( var N = 0; N < g.length; N++) {
									if (H.color) {
										a(V[parseInt(g[N] - 1)]).css("color",
												H.color)
									}
									if (H.bgColor) {
										if (O) {
											for ( var S = 0; S < z.reverseRowOrColumnCol.setCol.bgColor.length - 1; S++) {
												var J = z.reverseRowOrColumnCol.setCol.bgColor[S];
												if (J.indexOf("#") == -1) {
													if (a(V[parseInt(g[N] - 1)])
															.hasClass(
																	"customBgCol"
																			+ J)) {
														a(V[parseInt(g[N] - 1)])
																.removeClass(
																		"customBgCol"
																				+ J)
													}
												} else {
													if (a(V[parseInt(g[N] - 1)])
															.hasClass(
																	"customBgCol"
																			+ J
																					.substr(1))) {
														a(V[parseInt(g[N] - 1)])
																.removeClass(
																		"customBgCol"
																				+ J
																						.substr(1))
													}
												}
											}
										}
										a(V[parseInt(g[N] - 1)]).addClass(
												"customBgCol");
										a(V[parseInt(g[N] - 1)]).addClass(
												"customBgCol" + G)
									}
								}
							}
						}
					}
					if (H.bgColor && O) {
						z.reverseRowOrColumnCol._index++
					}
					if (H.isReloadCall == undefined) {
						var U = false;
						var p = (H.rowNum ? H.rowNum : "")
								+ (H.colNum ? H.colNum : "")
								+ (H.bgColor ? H.bgColor : "");
						for ( var P = 0; P < z.reverseRowOrColumnCol.setCol.param.length; P++) {
							var F = z.reverseRowOrColumnCol.setCol.param[P].paramStr;
							if (F == p) {
								U = false;
								break
							} else {
								U = true
							}
						}
						if (!z.reverseRowOrColumnCol.setCol.param.length || U) {
							z.reverseRowOrColumnCol.setCol.param.push(H);
							z.reverseRowOrColumnCol.setCol.bgColor
									.push(H.bgColor);
							z.reverseRowOrColumnCol.setCol.param[z.reverseRowOrColumnCol.setCol.param.length - 1].paramStr = p
						}
						z.reverseRowOrColumnCol.setCol.isCall = true
					}
				}
			},
			clearRowOrColumnCol : function(t) {
				var J = [];
				if (t) {
					if (t.rowNum && t.colNum) {
						var H = t.colNum;
						if (w.showcheckbox) {
							H = "";
							J = t.colNum.split(",");
							for ( var I = 0; I < J.length; I++) {
								if (!isNaN(parseInt(J[I]))) {
									H += (parseInt(J[I]) + 1) + ","
								}
							}
							var L = H.lastIndexOf(",");
							H = H.substr(0, L)
						}
						var p = a("tbody tr[id^='" + w.table_id + "_row_']",
								z.bDiv);
						var O = t.rowNum.split(",");
						var M = H.split(",");
						for ( var I = 0; I < O.length; I++) {
							if (!isNaN(parseInt(O[I]))) {
								var K = p.eq(parseInt(O[I]) - 1);
								var N = K.children("td");
								for ( var G = 0; G < M.length; G++) {
									if (!isNaN(parseInt(M[G]))) {
										if (t.color) {
											a(N[parseInt(M[G] - 1)]).css(
													"color", "")
										}
										if (t.bgColor) {
											for ( var P = 0; P < z.reverseRowOrColumnCol.setCol.bgColor.length; P++) {
												var g = z.reverseRowOrColumnCol.setCol.bgColor[P];
												if (g && g.indexOf("#") == -1) {
													if (a(N[parseInt(M[G] - 1)])
															.hasClass(
																	"customBgCol"
																			+ g)) {
														a(N[parseInt(M[G] - 1)])
																.removeClass(
																		"customBgCol"
																				+ g)
													}
												} else {
													if (a(N[parseInt(M[G] - 1)])
															.hasClass(
																	"customBgCol"
																			+ g
																					.substr(1))) {
														a(N[parseInt(M[G] - 1)])
																.removeClass(
																		"customBgCol"
																				+ g
																						.substr(1))
													}
												}
											}
											a(N[parseInt(M[G] - 1)])
													.removeClass("customBgCol")
										}
									} else {
										alert("\u8bf7\u4f20\u5165\u7531\u6570\u5b57\u7ec4\u6210\u7684\u5217\u53c2\u6570\uff01\uff01");
										return false
									}
								}
							} else {
								alert("\u8bf7\u4f20\u5165\u7531\u6570\u5b57\u7ec4\u6210\u7684\u884c\u53c2\u6570!!");
								return false
							}
						}
					} else {
						if (t.rowNum) {
							var J = t.rowNum.split(",");
							for ( var I = 0; I < J.length; I++) {
								if (!isNaN(parseInt(J[I]))) {
									continue
								} else {
									alert("rowNum\u53c2\u6570\u542b\u6709\u9664\u9017\u53f7\u4e4b\u5916\u7684\u5176\u4ed6\u975e\u6570\u5b57\u5b57\u7b26\uff01\uff01");
									return false
								}
							}
							var p = a(
									"tbody tr[id^='" + w.table_id + "_row_']",
									z.bDiv);
							for ( var I = 0; I < J.length; I++) {
								var F = p.eq(J[I] - 1);
								var N = F.children("td");
								for ( var G = 0; G < N.length; G++) {
									if (t.color) {
										a(
												N[parseInt(w.showcheckbox ? G + 1
														: G)]).css("color", "")
									}
									if (t.bgColor) {
										for ( var P = 0; P < z.reverseRowOrColumnCol.setCol.bgColor.length; P++) {
											var g = z.reverseRowOrColumnCol.setCol.bgColor[P];
											if (g.indexOf("#") == -1) {
												if (a(
														N[parseInt(w.showcheckbox ? G + 1
																: G)])
														.hasClass(
																"customBgCol"
																		+ g)) {
													a(
															N[parseInt(w.showcheckbox ? G + 1
																	: G)])
															.removeClass(
																	"customBgCol"
																			+ g)
												}
											} else {
												if (a(
														N[parseInt(w.showcheckbox ? G + 1
																: G)])
														.hasClass(
																"customBgCol"
																		+ g
																				.substr(1))) {
													a(
															N[parseInt(w.showcheckbox ? G + 1
																	: G)])
															.removeClass(
																	"customBgCol"
																			+ g
																					.substr(1))
												}
											}
										}
										a(
												N[parseInt(w.showcheckbox ? G + 1
														: G)]).removeClass(
												"customBgCol")
									}
								}
							}
						}
						if (t.colNum) {
							var H = t.colNum;
							if (w.showcheckbox) {
								H = "";
								J = t.colNum.split(",");
								for ( var I = 0; I < J.length; I++) {
									if (!isNaN(parseInt(J[I]))) {
										H += (parseInt(J[I]) + 1) + ","
									} else {
										alert("colNum\u53c2\u6570\u542b\u6709\u9664\u9017\u53f7\u4e4b\u5916\u7684\u5176\u4ed6\u975e\u6570\u5b57\u5b57\u7b26\uff01\uff01");
										return false
									}
								}
								var L = H.lastIndexOf(",");
								H = H.substr(0, L)
							} else {
								J = H.split(",");
								for ( var I = 0; I < J.length; I++) {
									if (!isNaN(parseInt(H[I]))) {
										continue
									} else {
										alert("colNum\u53c2\u6570\u542b\u6709\u9664\u9017\u53f7\u4e4b\u5916\u7684\u5176\u4ed6\u975e\u6570\u5b57\u5b57\u7b26\uff01\uff01");
										return false
									}
								}
							}
							if (J.length) {
								J = H.split(",")
							}
							var p = a(
									"tbody tr[id^='" + w.table_id + "_row_']",
									z.bDiv);
							for ( var I = 0; I < p.length; I++) {
								var K = p.eq(parseInt(I - 1));
								var N = K.children("td");
								for ( var G = 0; G < J.length; G++) {
									if (t.color) {
										a(N[parseInt(J[G] - 1)]).css("color",
												"")
									}
									if (t.bgColor) {
										for ( var P = 0; P < z.reverseRowOrColumnCol.setCol.bgColor.length; P++) {
											var g = z.reverseRowOrColumnCol.setCol.bgColor[P];
											if (g.indexOf("#") == -1) {
												if (a(N[parseInt(J[G] - 1)])
														.hasClass(
																"customBgCol"
																		+ g)) {
													a(N[parseInt(J[G] - 1)])
															.removeClass(
																	"customBgCol"
																			+ g)
												}
											} else {
												if (a(N[parseInt(J[G] - 1)])
														.hasClass(
																"customBgCol"
																		+ g
																				.substr(1))) {
													a(N[parseInt(J[G] - 1)])
															.removeClass(
																	"customBgCol"
																			+ g
																					.substr(1))
												}
											}
										}
										a(N[parseInt(J[G] - 1)]).removeClass(
												"customBgCol")
									}
								}
							}
						}
					}
				} else {
					var p = a("tbody tr[id^='" + w.table_id + "_row_']", z.bDiv);
					var N = p.children("td");
					for ( var I = 0; I < N.length; I++) {
						if (t.color) {
							a(N[I]).css("color", "")
						}
						if (t.bgColor) {
							for ( var P = 0; P < z.reverseRowOrColumnCol.setCol.bgColor.length; P++) {
								var g = z.reverseRowOrColumnCol.setCol.bgColor[P];
								if (g.indexOf("#") == -1) {
									if (a(N[I]).hasClass("customBgCol" + g)) {
										a(N[I]).removeClass("customBgCol" + g)
									}
								} else {
									if (a(N[I]).hasClass(
											"customBgCol" + g.substr(1))) {
										a(N[I]).removeClass(
												"customBgCol" + g.substr(1))
									}
								}
							}
							a(N[I]).removeClass("customBgCol")
						}
					}
				}
				if (t.isReloadCall == undefined) {
					z.reverseRowOrColumnCol.clearCol.isCall = true;
					z.reverseRowOrColumnCol.clearCol.param.push(t)
				}
			},
			checkRowsByKeyColumn : function(p) {
				var F = [];
				if (p && p.identifyColumn) {
					var I = p.identityColumnValue;
					for ( var H = 0; H < w.colModel.length; H++) {
						if (w.colModel[H].name == p.identifyColumn) {
							var g = a(
									"tbody tr[id^='" + w.table_id + "_row_']",
									z.bDiv);
							for ( var t = 0, J = I.length; t < J; t++) {
								for ( var G = 0; G < g.length; G++) {
									var K = a(g[G]).children("td");
									var L = a("div",
											a(K[(w.showcheckbox ? H + 1 : H)]))
											.text();
									if (L == I[t]) {
										F.push(g[G]);
										break
									}
								}
							}
							break
						}
					}
					for ( var H = 0, J = F.length; H < J; H++) {
						if (w.showcheckbox) {
							a(F[H]).addClass("trSelected");
							a("input.itemchk", F[H]).attr("checked", "checked")
						} else {
							a(F[0]).addClass("trSelected")
						}
						if (p.callCheckEvent != "undefined" && p.callCheckEvent) {
							if (w.onrowchecked) {
								if (w.showcheckbox) {
									w.onrowchecked.call(this, {
										flag : true,
										tr_object : a(F[H]),
										isHeadCheckbox : false
									})
								} else {
									w.onrowchecked.call(this, {
										flag : true,
										tr_object : a(F[0]),
										isHeadCheckbox : false
									})
								}
							}
						}
						z.freshCheckboxState()
					}
				}
			},
			updateRowData : function(t) {
				var H = [];
				if (t.identifyCloumn || t.identifyColumn) {
					for ( var J = 0; J < w.colModel.length; J++) {
						if (w.colModel[J].name == t.identifyCloumn
								|| w.colModel[J].name == t.identifyColumn) {
							var g = a(
									"tbody tr[id^='" + w.table_id + "_row_']",
									z.bDiv);
							for ( var I = 0; I < g.length; I++) {
								var K = a(g[I]).children("td");
								var N = a("div",
										a(K[(w.showcheckbox ? J + 1 : J)]))
										.text();
								if (N == t.identifyCloumnValue
										|| N == t.identifyColumnValue) {
									H.push(g[I]);
									break
								}
							}
							break
						}
					}
				}
				if (H.length) {
					if (t.data) {
						for ( var G = 0; G < H.length; G++) {
							var O = "";
							var K = a(H[G]).children("td");
							for ( var J = 0; J < w.colModel.length; J++) {
								var p = w.colModel[J].name;
								var M;
								if (p.indexOf(".") != -1) {
									var L = p.split(".");
									M = t.data;
									for ( var I = 0; I < L.length; I++) {
										if (M[L[I]] != undefined
												&& M[L[I]] != null) {
											M = z.parseData({
												data : M[L[I]],
												colModel : w.colModel[J]
											})
										} else {
											M = ""
										}
									}
								} else {
									if (t.data[p] != undefined
											&& t.data[p] != null) {
										M = z.parseData({
											data : t.data[p],
											colModel : w.colModel[J]
										})
									} else {
										M = ""
									}
								}
								M = M ? M : "";
								if (typeof (M) == "string" && w.isFilter) {
									O = O
											+ M.replace(/\</g, "&lt;").replace(
													/\>/g, "&gt;").replaceAll(
													'"', "&quot;")
								} else {
									O = O + M
								}
								if (J < w.colModel.length - 1) {
									O = O + "_FG$SP_"
								}
								var F = a("div",
										K[(w.showcheckbox ? J + 1 : J)]);
								F.text(M)
							}
							a(H[G]).attr("chd", O);
							for ( var J = 0; J < w.colModel.length; J++) {
								if (w.colModel[J] && w.colModel[J].fireEvent) {
									w.colModel[J].fireEvent({
										tr_object : a(H[G]),
										div_object : w.showcheckbox ? a("div",
												K[J + 1])[0]
												: a("div", K[J])[0],
										grid : z
									})
								}
							}
						}
					}
				}
			},
			deleteRowData : function(H) {
				var g = [];
				if (H && H.rowNum) {
					var J = H.rowNum.split(",");
					str = "";
					for ( var t = 0; t < J.length; t++) {
						if (!isNaN(parseInt(J[t]))) {
							if (str.indexOf(J[t]) == -1) {
								str = str + J[t] + ";";
								g[g.length] = a(
										"tbody tr[id^=" + w.table_id
												+ "_row_]:eq("
												+ (parseInt(J[t])) + ")",
										z.bDiv)
							}
						}
					}
					for ( var t = 0; t < g.length; t++) {
						g[t].remove()
					}
				} else {
					if (H && H.data) {
						var G = "";
						for ( var t = 0; t < H.data.length; t++) {
							for ( var p = 0; p < w.colModel.length; p++) {
								colModel = w.colModel[p];
								var F = colModel.name;
								tdData = z.parseJson({
									data : H.data[t],
									colName : F,
									col : colModel
								});
								G += tdData + "_FG$SP_"
							}
							var I = G.lastIndexOf("_FG$SP_");
							G = G.substr(0, I);
							a("tbody tr", z.bDiv).each(
									function() {
										if (a(this).attr("chd") == G
												&& a(this).attr("change")) {
											a(this).remove();
											return false
										}
									});
							G = ""
						}
					} else {
						if (w.showcheckbox) {
							g = a(":checkbox:checked.itemchk", z.bDiv).parent()
									.parent().parent()
						} else {
							g = a("tbody tr[id^=" + w.table_id
									+ "_row_].trSelected", z.bDiv)
						}
						if (g) {
							g.each(function() {
								a(this).remove()
							})
						}
					}
				}
				z.freshCheckboxState()
			},
			addRowData : function(K) {
				var Q = 0;
				var t = rn = a("tbody tr[id^='" + w.table_id + "_row_']",
						z.bDiv).length;
				if (K && K.data) {
					for ( var H = 0; H < K.data.length; H++) {
						if (K.rowNum && !isNaN(parseInt(K.rowNum, 10))) {
							K.rowNum = parseInt(K.rowNum);
							if (K.rowNum <= 0) {
								K.rowNum = Q
							} else {
								if (K.rowNum >= rn) {
									K.rowNum = rn
								}
							}
						} else {
							K.rowNum = Q
						}
						if (rn == 0) {
							var M = {
								total : 1,
								page : 1,
								rows : [ {
									id : w.table_id + "_row_",
									cell : [ "", "", "", "", "" ]
								} ]
							};
							if (w.usepager) {
								a(".pPageStat", this.pDiv).css("display",
										"none")
							}
							z.addData(M);
							if (w.usepager) {
								a(".pPageStat", this.pDiv).css("display",
										"block");
								a(".pPageStat", this.pDiv).html(w.nomsg)
							}
						}
						var g = a(a("tbody tr[id^='" + w.table_id + "_row_']",
								z.bDiv)[0]);
						var G = g.clone();
						if (t != 0) {
							G.attr("id", "grid_new_add")
						}
						G.removeClass("trSelected").addClass("newadd_tr");
						a("td", G).removeClass();
						a("td", G).css("color", "#000");
						var N = G.children("td");
						if (!z.reverseRowOrColumnCol.setCol.isCall) {
							for ( var F = 0; F < N.length; F++) {
								a(N[F]).css("color", "")
							}
						}
						G.removeClass();
						if (w.rowbinddata) {
							G.attr("ch", "")
						}
						if (K.rowNum == Q || K.rowNum < rn) {
							var p = a(
									"tbody tr[id^='" + w.table_id + "_row_']",
									z.bDiv)[K.rowNum];
							G.insertBefore(a(p))
						} else {
							var p = a(
									"tbody tr[id^='" + w.table_id + "_row_']",
									z.bDiv)[K.rowNum - 1];
							G.insertAfter(a(p))
						}
						if (rn == 0) {
							g.remove()
						}
						rn = a("tbody tr[id^='" + w.table_id + "_row_']",
								z.bDiv).length
					}
					if (t == 0) {
						a("tbody tr[id^='" + w.table_id + "_row_']", z.bDiv)
								.attr("id", "grid_new_add")
					}
					var I = a("tr[id='grid_new_add']", z.bDiv);
					var J = I.length;
					var L = "", p = null;
					for ( var H = 0; H < J; H++) {
						var R = "";
						var P = null;
						a(I[H])
								.children("td")
								.each(
										function(S) {
											p = a("div", this);
											if (w.showcheckbox) {
												if (S > 0) {
													P = w.colModel[S - 1]
												} else {
													if (S == 0) {
														L = "<input type='checkbox' class='itemchk'/>"
													}
												}
											} else {
												P = w.colModel[S]
											}
											if (P) {
												var T = P.name;
												L = z.parseJson({
													data : K.data[H],
													colName : T,
													col : P
												})
											}
											p.html(L);
											if (w.showcheckbox && S == 0) {
												L = ""
											} else {
												R = R + L + "_FG$SP_"
											}
											p.attr("title", L);
											L = ""
										});
						var O = R.lastIndexOf("_FG$SP");
						R = R.substr(0, O);
						a(I[H]).attr("chd", R);
						if (!(typeof K.isLaterClearId != "undefined" && K.isLaterClearId)) {
							a(I[H]).attr("id", w.table_id + "_row_" + t)
						}
						for ( var F = 0; F < w.colModel.length; F++) {
							if (w.colModel[F] && w.colModel[F].fireEvent) {
								w.colModel[F].fireEvent({
									tr_object : I[H],
									div_object : w.showcheckbox ? a("td:eq("
											+ (F + 1) + ") div", I[H])[0] : a(
											"td:eq(" + F + ") div", I[H])[0],
									grid : z
								})
							}
						}
						z.rowTrProp.call(I[H]);
						z.rowProp.call(I[H]);
						z.freshCheckboxState()
					}
				}
				z.freshRowStriped()
			},
			freshRowStriped : function() {
				if (w.striped) {
					a("tbody tr:even", z.bDiv).removeClass("erow");
					a("tbody tr:odd", z.bDiv).addClass("erow")
				}
			},
			getNewRows : function() {
				return a("tr[id='grid_new_add']", z.bDiv)
			},
			getRowObject : function(p) {
				var t = [];
				if (p) {
					if (p.rowNum) {
						var G = p.rowNum.split(",");
						str = "";
						for ( var F = 0; F < G.length; F++) {
							if (!isNaN(parseInt(G[F]))) {
								if (str.indexOf(G[F]) == -1) {
									str = str + G[F] + ";";
									t[t.length] = a("tbody tr[id^="
											+ w.table_id + "_row_]:eq(" + G[F]
											+ ")", z.bDiv)
								}
							}
						}
					}
				} else {
					if (w.showcheckbox) {
						var g = a(":checkbox:checked.itemchk", z.bDiv);
						for ( var F = 0; F < g.length; F++) {
							t.push(a(g[F]).parent().parent().parent())
						}
					} else {
						t.push(a("tbody tr.trSelected", z.bDiv))
					}
				}
				return t
			},
			getSelectIndex : function(p) {
				var I = "";
				if (p && p.rowObject) {
					I = p.rowObject.rowIndex;
					return I + ","
				} else {
					if (p && p.data) {
						var H = "";
						for ( var F = 0; F < w.colModel.length; F++) {
							var G = w.colModel[F].name;
							tdData = z.parseJson({
								data : p.data,
								colName : G,
								col : w.colModel[F]
							});
							H = H + tdData + "_FG$SP_"
						}
						var t = H.lastIndexOf("_FG$SP_");
						H = H.substr(0, t);
						var g = a("tbody tr[id^=" + w.table_id + "_row_]",
								z.bDiv);
						g.each(function(J) {
							if (a(this).attr("chd") == H) {
								I = J + ","
							}
						});
						return I
					} else {
						if (w.showcheckbox) {
							arr = a(":checkbox:checked.itemchk", z.bDiv)
									.parent().parent().parent()
						} else {
							arr = a("tbody tr[id^=" + w.table_id
									+ "_row_].trSelected", z.bDiv)
						}
					}
				}
				if (arr) {
					if (arr.length > 1) {
						for ( var F = 0; F < arr.length; F++) {
							I = I
									+ a(
											"tbody tr[id^=" + w.table_id
													+ "_row_]", z.bDiv).index(
											arr[F]) + ","
						}
					} else {
						I = a("tbody tr[id^=" + w.table_id + "_row_]", z.bDiv)
								.index(arr)
								+ ","
					}
					return I
				} else {
					return "0,"
				}
			},
			applyEvent : function() {
				if (w.colModel) {
					var p, g, t;
					a("tbody tr", u)
							.each(
									function(F) {
										p = this;
										a(w.colModel)
												.each(
														function(G) {
															if (this.fireEvent) {
																g = a(p)
																		.children()[w.showcheckbox ? (G + 1)
																		: G];
																t = a(g)
																		.children()[0];
																this
																		.fireEvent({
																			tr_object : p,
																			div_object : t,
																			grid : z
																		})
															}
														})
									})
				}
			},
			dealData : function(p) {
				try {
					var F = p.resultID;
					var g = p.resultMsg;
					if (F) {
						if (F == w.successResultID) {
							return true
						} else {
							if (w.showErrorMsg) {
								alert(g)
							}
							return false
						}
					} else {
						alert(w.errormsg);
						return false
					}
				} catch (t) {
					throw t
				}
			},
			changeJsonObject : function(N, F) {
				try {
					var g;
					var G;
					var p = [ {} ];
					p[0].total = N.total;
					p[0].page = N.page;
					p[0].rows = [];
					p[0].oriDateValue = [];
					var Q = w.colModel.length;
					var J = "";
					var M;
					var L = 0;
					if (p[0].page) {
						L = w.rp * (parseInt(p[0].page) - 1);
						L = L >= 0 ? L : 0
					}
					if (N && N.resultList) {
						for ( var I = 0; I < N.resultList.length; I++) {
							M = N.resultList[I];
							if (M) {
								var K = new Array(Q);
								for ( var H = 0; H < Q; H++) {
									G = w.colModel[H].name;
									if (G.indexOf(".") != -1) {
										var O = G.split(".");
										J = M[O[0]];
										for ( var t = 1; t < O.length; t++) {
											if (J != undefined
													&& J[O[t]] != undefined
													&& J[O[t]] != null) {
												J = typeof (J[O[t]]) == "boolean" ? J[O[t]]
														+ ""
														: J[O[t]]
											} else {
												J = ""
											}
										}
									} else {
										if (M[G] != undefined && M[G] != null) {
											J = typeof (M[G]) == "boolean" ? M[G]
													+ ""
													: M[G]
										} else {
											J = ""
										}
									}
									if (typeof (J) == "number") {
										J = J == 0 ? "0" : J
									} else {
										J = J ? J : ""
									}
									K[H] = J
								}
								p[0].rows.push({
									id : (L + I),
									cell : K
								})
							}
						}
					}
					return p
				} catch (P) {
					throw P
				}
			},
			parseData : function(t) {
				if (t.colModel.ct && t.colModel.ct.type == "date") {
					var g = t.colModel.ct.format;
					return t.data = z.dateToStr(t.data, g)
				} else {
					return typeof (t.data) == "boolean" ? t.data + "" : t.data
				}
			},
			dateToStr : function(t, G) {
				if (t.constructor == Date) {
					t = new Date(t)
				} else {
					if (t.constructor == String && t != "") {
						t = new Date(Date.parse(t.replace(/-/g, "/")))
					} else {
						return ""
					}
				}
				if (t == "NaN") {
					return ""
				} else {
					if (G == null || G == "") {
						G = "yyyy-MM-dd hh:mm:ss"
					}
					var H = {
						"Y+" : "Y",
						"y+" : "y",
						"M+" : "M",
						"o+" : "o",
						"d+" : "d",
						"D+" : "D",
						"h+" : "h",
						"H+" : "H",
						"m+" : "m",
						"i+" : "i",
						"s+" : "s",
						"S+" : "S"
					};
					var g = {
						Y : t.getFullYear(),
						y : t.getFullYear(),
						M : (t.getMonth() < 9) ? ("0" + (1 + t.getMonth()))
								: (1 + t.getMonth()),
						o : (1 + t.getMonth()),
						d : (t.getDate() < 10) ? ("0" + t.getDate()) : t
								.getDate(),
						D : t.getDate(),
						h : (t.getHours() < 10) ? ("0" + t.getHours()) : t
								.getHours(),
						H : t.getHours(),
						m : (t.getMinutes() < 10) ? ("0" + t.getMinutes()) : t
								.getMinutes(),
						i : t.getMinutes(),
						s : (t.getSeconds() < 10) ? ("0" + t.getSeconds()) : t
								.getSeconds(),
						S : t.getSeconds()
					};
					var F = G;
					for ( var p in H) {
						if (new RegExp("(" + p + ")").test(G)) {
							F = F.replace(RegExp.$1, g[H[p]])
						}
					}
					return F
				}
			},
			freshParam : function(g) {
				a.extend(w, g)
			},
			adjustOrder : function(G) {
				var F = a(z.bDiv).find(
						"tbody tr[id^=" + w.table_id + "_row_].trSelected");
				if (F.length > 0) {
					if (F != undefined) {
						var g = F.attr("id");
						var I = g.substr(0, g.lastIndexOf("_"));
						var p = g.substr(I.length + 1, g.length);
						if (G.order == "up") {
							p = p - 1;
							for ( var t = 0; t < F.length; t++) {
								var H = a(F[t]).prev();
								if (H.length == 0) {
									alert("\u884c\u6570\u636e\u4e3a\u5f53\u524d\u5c42\u7ea7\u7684\u9876\u7ea7\uff0c\u65e0\u6cd5\u7ee7\u7eed\u5411\u4e0a\u79fb\u52a8");
									return false
								}
								H.before(F[t])
							}
						} else {
							if (G.order == "down") {
								p = parseInt(p) + 1;
								for ( var t = 0; t < F.length; t++) {
									var J = F.next();
									if (J.length == 0) {
										alert("\u5f53\u524d\u8282\u70b9\u5904\u4e8e\u5f53\u524d\u5c42\u7ea7\u7684\u6700\u540e\u4e00\u4e2a\u8282\u70b9\uff0c\u65e0\u6cd5\u7ee7\u7eed\u5f80\u4e0b\u79fb");
										return false
									}
									J.after(F[t])
								}
							}
						}
					} else {
						alert("\u8bf7\u5148\u9009\u4e2d\u4e00\u884c\u6570\u636e\u8fdb\u884c\u79fb\u52a8")
					}
				} else {
					if (F.length > 1) {
						alert("\u53ea\u80fd\u9488\u5bf9\u4e00\u884c\u6570\u636e\u8fdb\u884c\u79fb\u52a8")
					} else {
						alert("\u8bf7\u5148\u9009\u4e2d\u4e00\u884c\u6570\u636e\u8fdb\u884c\u79fb\u52a8")
					}
				}
			},
			changeChildrenId : function(I) {
				var t = I.oldId;
				for ( var p = 0; p < I.data.length; p++) {
					var g = a(I.data[p]).attr("id");
					var F = g.replace(I.oldId, I.newId);
					var H = F.substr(I.trPrefix.length + 1, F.length);
					a(I.data[p]).attr("id", F);
					if (w.showcheckbox) {
						var G = a(I.data[p]).children("td.chboxtd").children(
								"div").find("input[id^='chk_']");
						if (G != undefined) {
							G.attr("id", "chk_" + H);
							G.attr("value", H)
						}
					}
				}
			},
			getRowData : function(p) {
				var F = [];
				var G = null;
				if (p) {
					G = a(p).attr("chd")
				} else {
					if (!w.showcheckbox) {
						var g = a(z.bDiv).find(
								"tbody tr[id^=" + w.table_id + "_row_]");
						for ( var t = 0; t < g.length; t++) {
							if (a(g[t]).hasClass("trSelected")) {
								G = a(g[t]).attr("chd");
								break
							}
						}
					}
				}
				if (G) {
					F.push({});
					z.generalObject(F, G, 0)
				}
				return F
			},
			getUnSelectedRowData : function(p) {
				var F = [];
				var G = null;
				if (p) {
					G = a(p).attr("chd")
				} else {
					if (w.showcheckbox) {
						var g = a(z.bDiv).find(
								"tbody tr[id^=" + w.table_id
										+ "_row_].trUnselected");
						for ( var t = 0; t < g.length; t++) {
							G = a(g[t]).attr("chd")
						}
					}
				}
				if (G) {
					F.push({});
					z.generalObject(F, G, 0)
				}
				return F
			},
			getUnselectRowsData : function() {
				var p = [];
				var g = a("tbody tr[id^=" + w.table_id
						+ "_row_]:not(.trSelected)", z.bDiv);
				g.each(function(t) {
					p.push({});
					chd = a(this).attr("chd");
					z.generalObject(p, chd, t)
				});
				return p
			},
			changeSort : function(g) {
				if (this.loading) {
					return true
				}
				a(z.nDiv).hide();
				a(z.nBtn).hide();
				if (w.sortname == a(g).attr("abbr")) {
					if (w.sortorder == "asc") {
						w.sortorder = "desc"
					} else {
						w.sortorder = "asc"
					}
				}
				a(g).addClass("sorted").siblings().removeClass("sorted");
				a(".sdesc", this.hDiv).removeClass("sdesc");
				a(".sasc", this.hDiv).removeClass("sasc");
				a("div", g).addClass("s" + w.sortorder);
				w.sortname = a(g).attr("abbr");
				if (w.onChangeSort) {
					w.onChangeSort(w.sortname, w.sortorder)
				} else {
					if (w.sortByStatic) {
						this.populate({
							changeSort : true
						})
					} else {
						this.populate()
					}
				}
			},
			buildpager : function() {
				a(".pcontrol input", this.pDiv).val(w.page);
				a(".pcontrol span", this.pDiv).html(w.pages);
				var p = (parseInt(w.page) - 1) * parseInt(w.rp) + 1;
				var g = p + parseInt(w.rp) - 1;
				if (w.total < g) {
					g = w.total
				}
				var t = w.pagestat;
				t = t.replace(/{from}/, p);
				t = t.replace(/{to}/, g);
				t = t.replace(/{total}/, w.total);
				if (w.usepager) {
					a(".pPageStat", this.pDiv).html(t)
				}
				a("select", z.pDiv).val(w.rp)
			},
			doMask : function(H) {
				var g = z.gDiv;
				if (w.maskObject) {
					if (typeof (w.maskObject) == "string") {
						g = document.getElementById(w.maskObject)
					} else {
						if (typeof (w.maskObject) == "object") {
							g = w.maskObject
						}
					}
				}
				if (!z.maskDiv) {
					z.maskDiv = document.createElement("div");
					z.maskDiv.setAttribute("id", w.container_id + "_maskDiv");
					z.maskDiv.className = "gBlock";
					a(z.maskDiv).fadeTo(0, w.blockOpacity);
					if (a.browser.msie && a.browser.version == 6) {
						var F = "	<iframe style=\"display: block; z-index: -1; filter: alpha(Opacity='0'); left: -1px;		left: expression(((parseInt(document.getElementById('"
								+ w.container_id
								+ "_maskDiv').currentStyle.borderLeftWidth)||0)*-1)+'px'); 		width: expression(document.getElementById('"
								+ w.container_id
								+ "_maskDiv').offsetWidth+'px'); 		position: absolute; top: -1px; 		top: expression(((parseInt(document.getElementById('"
								+ w.container_id
								+ "_maskDiv').currentStyle.borderTopWidth)||0)*-1)+'px'); 		height: expression(document.getElementById('"
								+ w.container_id
								+ "_maskDiv').offsetHeight+'px');\"		tabIndex=-1 src=\"\" frameBorder=0>	</iframe>";
						a(z.maskDiv).prepend(F)
					}
				}
				var G = a(g).height();
				var M = a(g).width() + 2;
				var I = 0;
				a(z.maskDiv).css({
					width : M,
					height : G,
					position : "absolute",
					marginBottom : 0,
					zIndex : 1
				});
				if (!z.maskMsgDiv) {
					z.maskMsgDiv = document.createElement("div");
					z.maskMsgDiv.className = "grid-mask-msg";
					a(z.maskMsgDiv).html("<div>\u8bf7\u7a0d\u5019...</div>")
				}
				if (H == "mask") {
					if (!z.tmpDiv) {
						z.tmpDiv = document.createElement("div");
						z.tmpDiv.className = w.gridClass
					}
					a(z.tmpDiv).append(z.maskDiv);
					a(z.tmpDiv).append(z.maskMsgDiv);
					if (w.maskObject) {
						a(g).prepend(z.tmpDiv)
					} else {
						a(this.gDiv).prepend(z.tmpDiv)
					}
					var K = Math.round(a(g).height()
							/ 2
							- (a(z.maskMsgDiv).height()
									- parseInt(a(z.maskMsgDiv).css(
											"padding-top")) - parseInt(a(
									z.maskMsgDiv).css("padding-bottom"))) / 2);
					var p = Math.round(a(g).width()
							/ 2
							- (a(z.maskMsgDiv).width()
									- parseInt(a(z.maskMsgDiv).css(
											"padding-left")) - parseInt(a(
									z.maskMsgDiv).css("padding-right"))) / 2);
					p = p - 4;
					var J, L;
					if (w.maskObject) {
						J = a(g).offset().top + K + "px";
						L = a(g).offset().left + p + "px"
					} else {
						J = K + "px";
						L = p + "px"
					}
					a(z.maskMsgDiv).css("top", J);
					a(z.maskMsgDiv).css("left", L)
				} else {
					if (H == "unmask") {
						a(z.maskMsgDiv).remove();
						a(z.maskDiv).remove();
						a(z.tmpDiv).remove()
					}
				}
			},
			recordBeforeStatus : function(g) {
				var p = new Object();
				if (w.showcheckbox) {
					p.checkData = z.getRowsData();
					p.unCheckData = z.getUnSelectedRowData()
				} else {
					p.checkData = z.getRowData()
				}
				return p
			},
			loadBeforeStatus : function(H, I) {
				if (I && H) {
					var N = [];
					var M = false;
					var K = [];
					for ( var p = 0; p < w.colModel.length; p++) {
						if (w.colModel[p].isKey) {
							K.push(w.colModel[p])
						}
					}
					var g = a("tbody tr[id^='" + w.table_id + "_row_']", z.bDiv);
					for ( var J = 0; J < g.length; J++) {
						var G = z.getRowData(g[J]);
						if (H.checkData) {
							var O = H.checkData;
							for ( var F = 0; F < O.length; F++) {
								M = z.freshStyle({
									trData : G[0],
									data : O[F],
									identifyColumn : K
								});
								if (M) {
									a(g[J]).addClass("trSelected");
									if (w.showcheckbox) {
										a("input:checkbox", g[J]).attr(
												"checked", true)
									}
								}
							}
						}
						if (H.unCheckData) {
							var L = H.unCheckData;
							for ( var t = 0; t < L.length; t++) {
								M = z.freshStyle({
									trData : G[0],
									data : L[t],
									identifyColumn : K
								});
								if (M) {
									if (!w.clickRowDoCheck) {
										a(g[J]).addClass("trUnselected")
									}
								}
							}
						}
					}
				}
			},
			freshStyle : function(t) {
				var G = t.data;
				var F = false;
				flag = [];
				for ( var p = 0; p < t.identifyColumn.length; p++) {
					if (z.parseJson({
						data : t.trData,
						col : t.identifyColumn[p],
						colName : t.identifyColumn[p].name
					}) == z.parseJson({
						data : G,
						col : t.identifyColumn[p],
						colName : t.identifyColumn[p].name
					})) {
						flag.push(true)
					} else {
						flag.push(false)
					}
				}
				for ( var g = 0; g < flag.length; g++) {
					if (flag[g] == true) {
						F = true
					} else {
						F = false;
						break
					}
				}
				return F
			},
			parseJson : function(J) {
				var F = "";
				var p = J.col;
				var t = J.colName;
				var g = t.indexOf(".");
				if (g != -1) {
					var I = t.substr(0, g);
					var H = t.substr(g + 1, t.length);
					function G(L, M) {
						var K = M.indexOf(".");
						if (K != -1) {
							var N = M.substr(0, K);
							var M = M.substr(K + 1, M.length);
							G(L[N], M)
						} else {
							if (L != undefined && L[M] != undefined
									&& L[M] != null) {
								return z.parseData({
									data : L[M],
									colModel : p
								})
							} else {
								return ""
							}
						}
					}
					F = G(J.data[I], H)
				} else {
					if (J.data[t] != undefined && J.data[t] != null) {
						F = z.parseData({
							data : J.data[t],
							colModel : p
						})
					} else {
						F = ""
					}
				}
				return F
			},
			populate : function(t) {
				if (this.loading) {
					return true
				}
				if (w.onSubmit) {
					var p = w.onSubmit();
					if (!p) {
						return false
					}
				}
				this.loading = true;
				if (w.usepager) {
					a(".pPageStat", this.pDiv).html(w.procmsg);
					a(".pReload", this.pDiv).addClass("loading")
				}
				a(z.block).css({
					top : z.bDiv.offsetTop
				});
				if (w.hideOnSubmit) {
					z.doMask("mask")
				}
				if (a.browser.opera) {
					a(u).css("visibility", "hidden")
				}
				if (!w.newp) {
					w.newp = 1
				}
				if (w.page > w.pages) {
					w.page = w.pages
				}
				var G = [ {
					name : "pageNumber",
					value : w.newp
				}, {
					name : "pageSize",
					value : w.usepager ? w.rp : 1000
				}, {
					name : "sortname",
					value : w.sortname
				}, {
					name : "sortorder",
					value : w.sortorder
				}, {
					name : "query",
					value : w.query
				}, {
					name : "qtype",
					value : w.qtype
				}, {
					name : "qop",
					value : w.qop
				} ];
				if (w.extParam) {
					for ( var F = 0; F < w.extParam.length; F++) {
						G[G.length] = w.extParam[F]
					}
				}
				function g() {
					if (z.dealData(w.tableData)) {
						var J;
						if (t && t.fnName == "fresh" && t.isRecoverRowState) {
							J = z.recordBeforeStatus(t)
						}
						if (w.sortByStatic) {
							w.tableData.resultList = z
									.sortData(w.tableData.resultList)
						}
						z.addData(z.changeJsonObject(w.tableData, {
							pageNumber : w.newp,
							pageSize : w.rp
						})[0]);
						if (w.showcheckbox) {
							z.doUncheck()
						}
						if (t && t.fnName == "fresh" && t.isRecoverRowState) {
							z.loadBeforeStatus(J, t)
						}
						if (w.isReloadCall
								&& z.reverseRowOrColumnCol.setCol.isCall) {
							for ( var H = 0; H < z.reverseRowOrColumnCol.setCol.bgColor.length; H++) {
								a(
										"#grid_customBg_"
												+ z.reverseRowOrColumnCol.setCol.bgColor[H])
										.remove()
							}
							for ( var I = 0; I < z.reverseRowOrColumnCol.setCol.param.length; I++) {
								z.reverseRowOrColumnCol.setCol.param[I].isReloadCall = true;
								z
										.setRowOrColumnCol(z.reverseRowOrColumnCol.setCol.param[I])
							}
						}
						if (z.reverseRowOrColumnCol.clearCol.isCall) {
							for ( var I = 0; I < z.reverseRowOrColumnCol.clearCol.param.length; I++) {
								z.reverseRowOrColumnCol.clearCol.param[I].isReloadCall = true;
								z
										.clearRowOrColumnCol(z.reverseRowOrColumnCol.clearCol.param[I])
							}
						}
						w.isSuccessSearch = true
					} else {
						z.hideLoading()
					}
				}
				if (w.tableData && !w.url) {
					g()
				} else {
					if (w.url) {
						if (t && t.changeSort != undefined && t.changeSort) {
							g()
						} else {
							a
									.ajax({
										type : w.method,
										url : w.url,
										data : G,
										dataType : w.dataType,
										success : function(H) {
											if (H != null && H.error != null) {
												if (w.onError) {
													w.onError(H);
													z.hideLoading()
												}
											} else {
												w.tableData = H;
												g()
											}
										},
										error : function(H) {
											try {
												if (w.onError) {
													w.onError(H)
												} else {
													alert("\u83b7\u53d6\u6570\u636e\u53d1\u751f\u5f02\u5e38")
												}
												z.hideLoading()
											} catch (I) {
											}
										}
									})
						}
					}
				}
			},
			sortData : function(t) {
				var g = null;
				for ( var p = 0; p < w.colModel.length; p++) {
					if (w.colModel[p].name == w.sortname) {
						g = w.colModel[p];
						break
					}
				}
				if (g != null) {
					t.sort(function(G, F) {
						G = z.parseJson({
							data : G,
							colName : w.sortname,
							col : g
						});
						F = z.parseJson({
							data : F,
							colName : w.sortname,
							col : g
						});
						if (!isNaN(G - F)) {
							if (w.sortorder == "desc") {
								return F - G
							} else {
								return G - F
							}
						} else {
							if (w.sortorder == "desc") {
								return F.localeCompare(G)
							} else {
								return G.localeCompare(F)
							}
						}
					})
				}
				return t
			},
			doSearch : function() {
				var g = a("select[name=qtype]", z.sDiv).val();
				var p = g.split("$");
				var t = -1;
				if (p.length != 3) {
					w.qop = "Eq";
					w.qtype = g
				} else {
					w.qop = p[1];
					w.qtype = p[0];
					t = parseInt(p[2])
				}
				w.query = a("input[name=q]", z.sDiv).val();
				if (w.query != "" && w.searchitems && t >= 0
						&& w.searchitems.length > t) {
					if (w.searchitems[t].reg) {
						if (!w.searchitems[t].reg.test(w.query)) {
							alert("\u4f60\u7684\u8f93\u5165\u4e0d\u7b26\u5408\u8981\u6c42!");
							return
						}
					}
				}
				w.newp = 1;
				this.populate()
			},
			changePage : function(t, p) {
				if (this.loading) {
					return true
				}
				switch (t) {
				case "first":
					w.newp = 1;
					break;
				case "prev":
					if (w.page > 1) {
						w.newp = parseInt(w.page) - 1
					}
					break;
				case "next":
					if (w.page < w.pages) {
						w.newp = parseInt(w.page) + 1
					} else {
						w.newp = w.pages
					}
					break;
				case "last":
					w.newp = w.pages;
					break;
				case "input":
					var g = parseInt(a(".pcontrol input", this.pDiv).val());
					if (isNaN(g)) {
						g = 1
					}
					if (g < 1) {
						g = 1
					} else {
						if (g > w.pages) {
							g = w.pages
						}
					}
					a(".pcontrol input", this.pDiv).val(g);
					w.newp = g;
					break
				}
				if (w.newp == w.page) {
					if (t != "reload" && t != "change") {
						return false
					}
				}
				if (t != "reload" && w.onChangePage && !w.url) {
					w.onChangePage(w.newp, w.rp)
				} else {
					this.populate(p);
					if (!p) {
						p = {
							isCallOnChangePage : true
						}
					}
					if (p.isCallOnChangePage && w.onChangePage) {
						w.onChangePage(w.newp, w.rp)
					}
				}
			},
			cellProp : function(H, G, F) {
				var t = document.createElement("div");
				if (F != null) {
					if (w.sortname == a(F).attr("abbr") && w.sortname) {
						this.className = "sorted"
					}
					a(t).css({
						textAlign : F.align,
						width : a("div:first", F)[0].style.width
					});
					if (F.hide) {
						a(this).css("display", "none")
					}
				}
				if (w.nowrap == false) {
					a(t).css("white-space", "normal")
				}
				if (this.innerHTML == "") {
					this.innerHTML = "&nbsp;"
				}
				t.innerHTML = this.innerHTML;
				var p = a(this).parent()[0];
				var g = false;
				if (p.id) {
					g = p.id.substr(3)
				}
				if (F != null) {
					if (F.format) {
						F.format(t, g)
					}
				}
				a("input.itemchk", t).each(function() {
					a(this).bind("click", function() {
						if (this.checked) {
							a(G).addClass("trSelected")
						} else {
							a(G).removeClass("trSelected")
						}
						if (w.onrowchecked) {
							w.onrowchecked.call(this, {
								isChecked : this.checked,
								tr_object : a(G),
								isHeadCheckbox : false
							})
						}
					})
				});
				a(this).empty().append(t).removeAttr("width")
			},
			addCellProp : function() {
				var g = this.cellProp;
				a("tbody tr td", z.bDiv).each(function() {
					var F = a("td", a(this).parent()).index(this);
					var p = a("th:eq(" + F + ")", z.hDiv).get(0);
					var t = a(this).parent();
					g.call(this, F, t, p)
				});
				g = null
			},
			getAllData : function() {
				var t = [];
				var p = a("tbody tr[id^=" + w.table_id + "_row_]", z.bDiv);
				var g = p.length;
				var F = null;
				p.each(function(G) {
					t.push({});
					F = a(this).attr("chd");
					z.generalObject(t, F, G)
				});
				return t
			},
			getChangeData : function() {
				var t = [];
				var p = a("tr[id^=" + w.table_id + "_row_].change", z.bDiv);
				var g = p.length;
				var F = null;
				p.each(function(G) {
					t.push({});
					F = a(this).attr("chd");
					z.generalObject(t, F, G)
				});
				return t
			},
			getRowsData : function() {
				var p = a(":checkbox:checked.itemchk", z.bDiv);
				var g = p.length;
				var F = [];
				for ( var t = 0; t < g; t++) {
					F.push({})
				}
				var G = null;
				for ( var t = 0; t < g; t++) {
					G = a(p[t]).parent().parent().parent().attr("chd");
					z.generalObject(F, G, t)
				}
				return F
			},
			flexTitle : function(p) {
				var g = a("#" + w.container_id + " .mDiv .ftitle");
				g.text(p.title)
			},
			cancelAllSelectState : function() {
				a("tbody tr[id^=" + w.table_id + "_row_]", z.bDiv).each(
						function() {
							if ((a(this).attr("class") + " ")
									.indexOf("trSelected") != -1) {
								a(this).removeClass("trSelected");
								if (w.showcheckbox) {
									a("input:checkbox", this).attr("checked",
											false)
								}
							}
						});
				z.freshCheckboxState()
			},
			generalObject : function(g, K, I) {
				var H = K.split("_FG$SP_");
				var p = w.colModel;
				var t = "", F = "";
				for ( var G = 0; G < p.length; G++) {
					t = p[G].name;
					if (p[G].ct && p[G].ct.type == "date") {
						if (H[G] != "") {
							if (H[G] && H[G].indexOf("-") != -1) {
								F = new Date(Date
										.parse(H[G].replace(/-/g, "/")))
							} else {
								F = new Date(H[G])
							}
						} else {
							F = null
						}
					} else {
						F = H[G]
					}
					J({
						col_name : t,
						row_object : g[I],
						col_value : F
					})
				}
				function J(Q) {
					var N = Q.col_name;
					var L = N.indexOf(".");
					var M = Q.row_object;
					var R = Q.col_value;
					if (L == -1) {
						M[N] = R
					} else {
						var P = N.substr(0, L);
						var O = N.substr(L + 1, N.length);
						if (!M[P]) {
							M[P] = {}
						}
						J({
							col_name : O,
							row_object : M[P],
							col_value : R
						})
					}
				}
			},
			getCellDim : function(t) {
				var I = parseInt(a(t).height());
				var g = parseInt(a(t).parent().height());
				var G = parseInt(t.style.width);
				var K = parseInt(a(t).parent().width());
				var H = t.offsetParent.offsetTop;
				var p = t.offsetParent.offsetLeft;
				var J = parseInt(a(t).css("paddingLeft"));
				var F = parseInt(a(t).css("paddingTop"));
				return {
					ht : I,
					wt : G,
					top : H,
					left : p,
					pdl : J,
					pdt : F,
					pht : g,
					pwt : K
				}
			},
			rowProp : function() {
				if (w.rowhandler) {
					w.rowhandler(this, {
						grid : z
					})
				}
				if (a.browser.msie && a.browser.version < 7) {
					a(this).hover(function() {
						a(this).addClass("trOver")
					}, function() {
						a(this).removeClass("trOver")
					})
				}
				a(this)
						.click(
								function(g) {
									if (a(g.target).hasClass("itemchk")) {
										return
									}
									if ((a(this).attr("class") + " ")
											.indexOf("trSelected") == -1) {
										if (w.showcheckbox) {
											if (w.disCheckbox) {
												if (!a("input.itemchk", this)
														.attr("disabled")) {
													if (w.clickRowDoCheck) {
														a(this).addClass(
																"trSelected");
														a("input.itemchk", this)
																.attr(
																		"checked",
																		"checked");
														z.freshCheckboxState()
													} else {
														a("tr.trUnselected",
																z.bDiv)
																.removeClass(
																		"trUnselected");
														a(this).addClass(
																"trUnselected")
													}
												} else {
													a("tr.trUnselected", z.bDiv)
															.removeClass(
																	"trUnselected");
													a(this).addClass(
															"trUnselected")
												}
											} else {
												if (w.clickRowDoCheck) {
													a(this).addClass(
															"trSelected");
													a("input.itemchk", this)
															.attr("checked",
																	"checked");
													z.freshCheckboxState()
												} else {
													a("tr.trUnselected", z.bDiv)
															.removeClass(
																	"trUnselected");
													a(this).addClass(
															"trUnselected")
												}
											}
										} else {
											a("tr.trSelected", z.bDiv)
													.removeClass("trSelected");
											a(this).addClass("trSelected")
										}
									} else {
										if (w.showcheckbox) {
											if (w.clickRowDoCheck) {
												a("input.itemchk", this).attr(
														"checked", "");
												a(this).removeClass(
														"trSelected");
												z.doUncheck()
											} else {
												a("tr.trUnselected", z.bDiv)
														.removeClass(
																"trUnselected");
												a(this)
														.addClass(
																"trUnselected")
											}
										} else {
											if (w.onRowSelectedChangeClass) {
												a(this).removeClass(
														"trSelected")
											}
										}
									}
								})
			},
			addRowProp : function() {
				var g = this.rowProp;
				var p = this.rowTrProp;
				a("tbody tr", z.bDiv).each(function() {
					p.call(this);
					g.call(this)
				});
				p = null;
				g = null
			},
			stopPropagation : function(g) {
				if (g && g.stopPropagation) {
					g.stopPropagation()
				} else {
					window.event.cancelBubble = true
				}
			},
			getRecordCount : function() {
				var g = a(z.bDiv).children("table").children("tbody").children(
						"tr");
				return g.length
			},
			rowTrProp : function() {
				a("input.itemchk", this).each(function() {
					var g = a(this).parent().parent().parent();
					a(this).click(function(p) {
						if (this.checked) {
							g.addClass("trSelected");
							z.freshCheckboxState()
						} else {
							g.removeClass("trSelected");
							z.doUncheck()
						}
						if (w.onrowchecked) {
							w.onrowchecked.call(this, {
								isChecked : this.checked,
								tr_object : g,
								isHeadCheckbox : false
							})
						}
						z.stopPropagation(p)
					})
				})
			},
			checkAllOrNot : function(g) {
				var p = a(this).attr("checked");
				a("tbody tr[id^=" + w.table_id + "_row_]", z.bDiv).each(
						function() {
							if (!a("input.itemchk", this).attr("disabled")) {
								if (p) {
									a(this).addClass("trSelected")
								} else {
									a(this).removeClass("trSelected")
								}
							}
						});
				a("input.itemchk", z.bDiv).each(function() {
					if (!a(this).attr("disabled")) {
						this.checked = p;
						var t = a(this).parent().parent().parent();
						if (w.onrowchecked) {
							w.onrowchecked.call(this, {
								isChecked : this.checked,
								tr_object : t,
								isHeadCheckbox : true
							})
						}
					}
				})
			},
			freshCheckboxState : function() {
				if (a("tbody tr", z.bDiv).length > 0
						&& a(
								"tbody tr input[type='checkbox']:not(:disabled):not(:checked).itemchk",
								z.bDiv).length == 0) {
					if (a("tbody tr input[type='checkbox']:not(:disabled)",
							z.bDiv).length == 0) {
						z.doUncheck()
					} else {
						z.doCheck()
					}
				} else {
					z.doUncheck()
				}
			},
			doUncheck : function() {
				a("th div input[type='checkbox']", z.hDiv).filter(function() {
					return a(this).hasClass("noborder")
				}).attr("checked", false)
			},
			doCheck : function() {
				a("th div input[type='checkbox']", z.hDiv).filter(function() {
					return a(this).hasClass("noborder")
				}).attr("checked", true)
			},
			enabledButton : function(t) {
				if (t.id) {
					var g = document.getElementById(t.id);
					if (g) {
						a(g).removeAttr("disabled");
						if (!a.browser.msie) {
							a(g).css("color", "rgb(0,0,0)")
						}
						if (g.disabledClass) {
							jQuery("span", g).removeClass(g.disabledClass)
						}
						if (!(a(g).data("events") && a(g).data("events")["click"])) {
							a(g).bind("click", function() {
								this.onpress(this.name, z.gDiv)
							})
						}
					}
				}
			},
			disabledButton : function(t) {
				if (t.id) {
					var g = document.getElementById(t.id);
					if (g) {
						a(g).attr("disabled", "disabled");
						if (!a.browser.msie) {
							a(g).css("color", "grey")
						}
						if (g.disabledClass) {
							jQuery("span", g).addClass(g.disabledClass)
						}
					}
				}
				if (a(g).data("events") && a(g).data("events")["click"]) {
					a(g).unbind("click")
				}
			},
			doSortClass : function() {
				a("thead tr:first th", z.hDiv)
						.each(
								function() {
									var g = a(this).children("div");
									if (a(this).attr("abbr")) {
										a(this).click(function(t) {
											if (!a(this).hasClass("thOver")) {
												return false
											}
											var p = (t.target || t.srcElement);
											if (p.href || p.type) {
												return true
											}
											if (z.getRecordCount() > 0) {
												z.changeSort(this)
											}
										});
										if (a(this).attr("abbr") == w.sortname
												&& z.getRecordCount() > 0) {
											a(this).attr("class", "sorted");
											g.attr("class", "s" + w.sortorder)
										}
									}
									if (!a(this).attr("isch")) {
										a(this)
												.hover(
														function() {
															if (a(this).attr(
																	"abbr") != w.sortname
																	&& !z.colCopy
																	&& !z.colresize
																	&& a(this)
																			.attr(
																					"abbr")
																	&& z
																			.getRecordCount() > 0) {
																a("div", this)
																		.addClass(
																				"s"
																						+ w.sortorder)
															} else {
																if (a(this)
																		.attr(
																				"abbr") == w.sortname
																		&& !z.colCopy
																		&& !z.colresize
																		&& a(
																				this)
																				.attr(
																						"abbr")
																		&& z
																				.getRecordCount() > 0) {
																	var p = "";
																	if (w.sortorder == "asc") {
																		p = "desc"
																	} else {
																		p = "asc"
																	}
																	a("div",
																			this)
																			.removeClass(
																					"s"
																							+ w.sortorder)
																			.addClass(
																					"s"
																							+ p)
																} else {
																	a("div",
																			this)
																			.removeClass(
																					"s"
																							+ w.sortorder)
																			.removeClass(
																					"s"
																							+ p)
																}
															}
														},
														function() {
															if (a(this).attr(
																	"abbr") != w.sortname
																	&& z
																			.getRecordCount() > 0) {
																a("div", this)
																		.removeClass(
																				"s"
																						+ w.sortorder)
															} else {
																if (a(this)
																		.attr(
																				"abbr") == w.sortname
																		&& z
																				.getRecordCount() > 0) {
																	var p = "";
																	if (w.sortorder == "asc") {
																		p = "desc"
																	} else {
																		p = "asc"
																	}
																	a("div",
																			this)
																			.addClass(
																					"s"
																							+ w.sortorder)
																			.removeClass(
																					"s"
																							+ p)
																} else {
																	a("div",
																			this)
																			.removeClass(
																					"s"
																							+ w.sortorder)
																			.removeClass(
																					"s"
																							+ p)
																}
															}
															if (z.colCopy) {
																a(z.cdropleft)
																		.remove();
																a(z.cdropright)
																		.remove();
																z.dcolt = null
															}
														})
									}
								})
			},
			freshSortClass : function() {
				var g = a("thead tr:first th", z.hDiv);
				for ( var p = 0; p < g.length; p++) {
					if (!a(g[p]).attr("isch")
							&& a(g[p]).attr("abbr") == w.sortname) {
						if (!z.colCopy && !z.colresize && a(g[p]).attr("abbr")
								&& z.getRecordCount() > 0) {
							a("div", g[p]).addClass("s" + w.sortorder)
						} else {
							if (!z.colCopy && !z.colresize
									&& a(g[p]).attr("abbr")
									&& z.getRecordCount() == 0) {
								a("div", g[p]).removeClass("s" + w.sortorder)
							}
						}
						break
					}
				}
			},
			jsPath : function(F) {
				var p = document.getElementsByTagName("script");
				for ( var g = 0; g < p.length; g++) {
					if (p[g].src.lastIndexOf(F) >= 0) {
						var t = p[g].src.replace(/\\/gi, "/");
						return t.substring(0, t.lastIndexOf("/") + 1)
					}
				}
				return ""
			},
			initExportDivContent : function() {
				var g = 0;
				var t = 0;
				var F = "";
				var p = true;
				a("th div", z.hDiv)
						.each(
								function() {
									var J = false;
									var H = a("th[axis='col" + g + "']", z.hDiv)[0];
									var I = a(this).parents("th").attr("axis");
									I = I.substr(3);
									if (H == null) {
										return
									}
									var G = 'checked="checked"';
									if (H.style.display == "none") {
										G = ""
									}
									if (p) {
										F += "<tr>\r";
										p = false
									}
									if (I == -1) {
										g--
									}
									if (!(I == -1) && w.colModel[I]["isData"]) {
										J = true;
										F = F
												+ '\t<td class="ndcol1"><input type="checkbox" '
												+ G
												+ ' class="togCol noborder" value="'
												+ I
												+ '" /></td>\r\t<td class="ndcol2">'
												+ this.innerText + "</td>\r"
									}
									if (J && t % 2 != 0) {
										F += "</tr>\r";
										p = true
									}
									if (J) {
										t++
									}
									g++
								});
				a("tbody", z.eDiv).append(F)
			},
			initExportDiv : function() {
				z.eDiv = document.createElement("div");
				z.eDiv.style.overFlow = "auto";
				z.eDiv.style.maxHeight = "300";
				z.eDiv.className = "eDiv";
				z.eDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
				a(z.eDiv).css({
					display : "none"
				}).noSelect();
				a(z.eDiv).children("tbody").empty();
				z.initExportDivContent();
				a("tbody", z.eDiv)
						.prepend(
								'<tr class="tBar"><td colspan="6" class="tBar"><table><tr><td><span class="title">\u8bf7\u9009\u62e9\u5217</span></td><td class="button"><span id="export">\u786e\u5b9a</span></td><td class="button"><span id="cancel">\u53d6\u6d88</span></td><td class="button"><span id="reverseCheck">\u53cd\u9009</span></td><td class="button"><span id="checkAll">\u5168\u9009</span></td></tr></table></td></tr>');
				a(z.gDiv).prepend(z.eDiv);
				a("td.ndcol2", z.eDiv).click(function() {
					var g = a(this).prev().find("input")[0];
					if (g.checked) {
						g.checked = ""
					} else {
						g.checked = "checked"
					}
				})
			},
			exportByColumns : function(t) {
				var M = {};
				var p = [];
				if (t && t.btnName) {
					var g;
					if (a(z.eDiv).is(":visible")) {
						a(z.eDiv).hide()
					} else {
						if (z.eDiv) {
							a(z.eDiv).remove()
						}
						z.initExportDiv();
						a(z.eDiv).show();
						var K = a("div[name='" + t.btnName + "']", z.tDiv);
						var J = K.width();
						var G = z.tDiv.offsetTop;
						if (K.width() == null) {
							a(z.eDiv).css({
								top : G + 3,
								left : 0
							})
						} else {
							a(z.eDiv).css({
								top : G + K.height() + 3,
								left : K.offset().left
							})
						}
						if (!a("#export", z.eDiv).data("events")
								|| !a("#export", z.eDiv).data("events")["click"]) {
							a("#export", z.eDiv)
									.click(
											function() {
												a(":checkbox:checked", z.eDiv)
														.each(
																function() {
																	var N = a(
																			this)
																			.attr(
																					"value");
																	p
																			.push(w.colModel[N])
																});
												M.sortname = w.sortname;
												M.sortorder = w.sortorder;
												M.data = p;
												if (w.onSelectCol) {
													if (p.length) {
														w.onSelectCol.call(
																this, M);
														a(z.eDiv).hide()
													} else {
														alert("\u60a8\u8fd8\u6ca1\u6709\u9009\u62e9\u4efb\u4f55\u9700\u8981\u5bfc\u51fa\u7684\u5217")
													}
												}
											})
						}
						if (!a("#cancel", z.eDiv).data("events")
								|| !a("#cancel", z.eDiv).data("events")["click"]) {
							a("#cancel", z.eDiv).click(function() {
								a(z.eDiv).hide()
							})
						}
						if (!a("#checkAll", z.eDiv).data("events")
								|| !a("#checkAll", z.eDiv).data("events")["click"]) {
							a("#checkAll", z.eDiv).click(
									function() {
										a("td.ndcol1", z.eDiv).each(
												function() {
													a(this).children("input")
															.attr("checked",
																	"checked")
												})
									})
						}
						if (!a("#reverseCheck", z.eDiv).data("events")
								|| !a("#reverseCheck", z.eDiv).data("events")["click"]) {
							a("#reverseCheck", z.eDiv)
									.click(
											function() {
												a("td.ndcol1", z.eDiv)
														.each(
																function() {
																	var N = a(
																			this)
																			.children(
																					"input")
																			.attr(
																					"checked");
																	if ((N == true || (typeof N == "string" && N == "checked"))) {
																		a(this)
																				.children(
																						"input")
																				.attr(
																						"checked",
																						false)
																	} else {
																		a(this)
																				.children(
																						"input")
																				.attr(
																						"checked",
																						true)
																	}
																})
											})
						}
					}
				} else {
					var L = a(".bbit-grid .hDivBox")
							.children()
							.children()
							.children()
							.children()
							.filter(
									function() {
										return !(a(this).css("display") == "none")
												&& a(this).attr("isData")
									});
					for ( var H = 0; H < L.length; H++) {
						var F = a(L[H]).attr("axis");
						var I = F.substr(3, F.length - 1);
						if (I < 0) {
							continue
						}
						p.push(w.colModel[I])
					}
					M.sortname = w.sortname;
					M.sortorder = w.sortorder;
					M.data = p;
					return M
				}
			},
			exportAll : function(g) {
				var F = [];
				var t = w.colModel;
				if (w.onSelectCol) {
					for ( var p = 0; p < t.length; p++) {
						if (t[p].isData) {
							F.push(t[p])
						}
					}
					w.onSelectCol.call(this, {
						selectCols : F
					})
				}
			},
			pager : 0
		};
		if (w.colModel) {
			A = document.createElement("thead");
			tr = document.createElement("tr");
			if (w.showcheckbox) {
				var c = jQuery("<th/>");
				var q = jQuery('<input type="checkbox"/>');
				q.addClass("noborder");
				c.addClass("cth").attr({
					axis : "col-1",
					width : "22",
					isch : true
				}).append(q);
				c[0].hide = false;
				a(tr).append(c)
			}
			var r = a("#" + w.container_id).outerWidth();
			if (typeof w.width == "string" && w.width.indexOf("%") != -1) {
				if (w.showcheckbox) {
					r = r * parseFloat(w.width) * 0.01 - 2 - 32
				} else {
					r = r * parseFloat(w.width) * 0.01 - 2
				}
			} else {
				if (typeof w.width == "string" && w.width.indexOf("%") == -1) {
					if (w.showcheckbox) {
						r = parseFloat(w.width) - 32 - 2
					} else {
						r = parseFloat(w.width) - 2
					}
				} else {
					if (w.showcheckbox) {
						r = w.width - 32 - 2
					} else {
						r = w.width - 2
					}
				}
			}
			var l = 0;
			var v = 1;
			for (i = 0; i < w.colModel.length; i++) {
				var o = w.colModel[i];
				if (typeof o.width == "string" && o.width.indexOf("%") != -1) {
					if (o.hide) {
						l += parseInt(o.width)
					}
				}
			}
			v = 1 - l * 0.01;
			for (i = 0; i < w.colModel.length; i++) {
				o = w.colModel[i];
				var h;
				var k = document.createElement("th");
				k.innerHTML = o.display;
				if (o.name && o.sortable) {
					a(k).attr("abbr", o.name)
				}
				a(k).attr("axis", "col" + i);
				if (o.align) {
					k.align = o.align
				}
				if (o.width) {
					a(k).attr("oriWidth", o.width);
					if (typeof o.width == "string"
							&& o.width.indexOf("%") != -1) {
						w.dragable = false;
						h = r * (parseFloat(o.width) * 0.01 / v) - 10
					} else {
						h = parseFloat(o.width)
					}
					a(k).attr("width", h)
				} else {
					a(k).attr("width", 100)
				}
				if (o.hide) {
					k.hide = true
				} else {
					k.hide = false
				}
				if (o.toggle != undefined) {
					k.toggle = o.toggle
				}
				if (o.format) {
					k.format = o.format
				}
				if (o.isData == undefined) {
					o.isData = true
				}
				if (o.isData) {
					k.isData = true
				} else {
					o.isData = false;
					k.isData = false
				}
				if (o.ct) {
					k.ct = o.ct
				} else {
					k.ct = false
				}
				if (o.isKey) {
					k.isKey = o.isKey
				} else {
					k.isKey = false
				}
				if (o.title_align) {
					k.title_align = o.title_align
				} else {
					k.title_align = "center"
				}
				a(tr).append(k)
			}
			a(A).append(tr);
			a(u).prepend(A)
		}
		z.gDiv = document.createElement("div");
		z.mDiv = document.createElement("div");
		z.hDiv = document.createElement("div");
		z.bDiv = document.createElement("div");
		z.vDiv = document.createElement("div");
		z.rDiv = document.createElement("div");
		z.cDrag = document.createElement("div");
		z.block = document.createElement("div");
		z.nDiv = document.createElement("div");
		z.nBtn = document.createElement("div");
		z.iDiv = document.createElement("div");
		z.tDiv = document.createElement("div");
		z.sDiv = document.createElement("div");
		if (w.usepager) {
			z.pDiv = document.createElement("div")
		}
		z.hTable = document.createElement("table");
		z.gDiv.className = w.gridClass;
		a(z.gDiv).css({
			position : "relative"
		});
		if (w.width != "auto") {
			z.gDiv.style.width = w.width
					+ (((w.width + "").indexOf("%") != -1) ? "" : "px")
		}
		if (a.browser.msie) {
			a(z.gDiv).addClass("ie")
		}
		if (w.novstripe) {
			a(z.gDiv).addClass("novstripe")
		}
		a(u).before(z.gDiv);
		a(z.gDiv).append(u);
		var E = a("#" + w.container_id).parents("table");
		if (E.length) {
			var x = a(E[0]);
			if (!x.hasClass("grid_layout_style")) {
				x.addClass("grid_layout_style")
			}
		}
		if (w.buttons) {
			z.tDiv.className = "tDiv";
			var C = document.createElement("div");
			C.className = "tDiv2";
			for (i = 0; i < w.buttons.length; i++) {
				var n = w.buttons[i];
				if (!n.separator) {
					var y = document.createElement("div");
					y.className = "fbutton";
					y.innerHTML = "<div><span style='padding-top: 3px;'>"
							+ n.displayname + "</span></div>";
					y.disabled = n.disabled;
					if (n.title) {
						y.title = n.title
					}
					if (n.bclass) {
						a("span", y).addClass(n.bclass).css({
							paddingLeft : 20
						})
					}
					y.name = n.name;
					y.id = n.id;
					y.onpress = n.onpress;
					if (n.disabledClass) {
						y.disabledClass = n.disabledClass
					}
					a(y).bind("click", function() {
						this.onpress(this.name, z.gDiv)
					});
					a(C).append(y);
					if (a.browser.msie && a.browser.version < 7) {
						a(y).hover(function() {
							a(this).addClass("fbOver")
						}, function() {
							a(this).removeClass("fbOver")
						})
					}
					if (n.disabled) {
						if (!a.browser.msie) {
							a(y).css("color", "grey")
						}
						if (n.disabledClass) {
							jQuery("span", y).addClass(n.disabledClass)
						}
						a(y).unbind("click")
					}
				} else {
					a(C).append("<div class='btnseparator'></div>")
				}
			}
			a(z.tDiv).append(C);
			a(z.tDiv).append("<div style='clear:both'></div>");
			a(z.gDiv).prepend(z.tDiv)
		}
		z.hDiv.className = "hDiv";
		a(u).before(z.hDiv);
		z.hTable.cellPadding = 0;
		z.hTable.cellSpacing = 0;
		a(z.hDiv).append('<div class="hDivBox"></div>');
		a("div", z.hDiv).append(z.hTable);
		var A = a("thead:first", u).get(0);
		if (A) {
			a(z.hTable).append(A)
		}
		A = null;
		if (!w.colmodel) {
			var s = 0
		}
		a("thead tr:first th", z.hDiv)
				.each(
						function() {
							var g = document.createElement("div");
							if (this.hide) {
								a(this).hide()
							}
							if (!w.colmodel && !a(this).attr("isch")) {
								a(this).attr("axis", "col" + s++)
							}
							a(g).css({
								textAlign : this.title_align,
								width : this.width + "px"
							});
							g.innerHTML = this.innerHTML;
							a(this).empty().append(g);
							if (!a(this).attr("isch")) {
								a(this)
										.mousedown(function(p) {
											z.dragStart("colMove", p, this)
										})
										.hover(
												function() {
													if (!z.colresize
															&& !a(this)
																	.hasClass(
																			"thMove")
															&& !z.colCopy) {
														a(this).addClass(
																"thOver")
													}
													if (z.colCopy) {
														var F = a("th", z.hDiv)
																.index(this);
														if (F == z.dcoln) {
															return false
														}
														if (F < z.dcoln) {
															a(this)
																	.append(
																			z.cdropleft)
														} else {
															a(this)
																	.append(
																			z.cdropright)
														}
														z.dcolt = F
													} else {
														if (!z.colresize) {
															var p = a(
																	"th:visible",
																	z.hDiv);
															var K = -1;
															for ( var I = 0, H = 0, G = p.length; I < G; I++) {
																if (a(p[I])
																		.css(
																				"display") != "none") {
																	if (p[I] == this) {
																		K = H;
																		break
																	}
																	H++
																}
															}
															var K = a(
																	"th:visible",
																	z.hDiv)
																	.index(this);
															var t = parseInt(a(
																	"div:eq("
																			+ K
																			+ ")",
																	z.cDrag)
																	.css("left"));
															var J = parseInt(a(
																	z.nBtn)
																	.width())
																	+ parseInt(a(
																			z.nBtn)
																			.css(
																					"borderLeftWidth"));
															nl = t
																	- J
																	+ Math
																			.floor(w.cgwidth / 2);
															a(z.nDiv).hide();
															a(z.nBtn).hide();
															a(z.nBtn)
																	.css(
																			{
																				left : nl,
																				top : z.hDiv.offsetTop
																			})
																	.show();
															var L = parseInt(a(
																	z.nDiv)
																	.width());
															a(z.nDiv)
																	.css(
																			{
																				top : z.bDiv.offsetTop
																			});
															if ((nl + L) > a(
																	z.gDiv)
																	.width()) {
																a(z.nDiv)
																		.css(
																				"left",
																				t
																						- L
																						+ 1)
															} else {
																a(z.nDiv).css(
																		"left",
																		nl)
															}
															if (a(this)
																	.hasClass(
																			"sorted")) {
																a(z.nBtn)
																		.addClass(
																				"srtd")
															} else {
																a(z.nBtn)
																		.removeClass(
																				"srtd")
															}
														}
													}
												},
												function() {
													a(this).removeClass(
															"thOver");
													if (z.colCopy) {
														a(z.cdropleft).remove();
														a(z.cdropright)
																.remove();
														z.dcolt = null
													}
												})
							}
						});
		z.bDiv.className = "bDiv";
		if (w.bgColor) {
			a(z.bDiv).css("background-color", w.bgColor)
		}
		a(u).before(z.bDiv);
		a(z.bDiv).css({
			height : (w.height == "auto") ? "auto" : w.height + "px"
		}).scroll(function(g) {
			z.scroll()
		}).append(u);
		if (w.height == "auto") {
			a("table", z.bDiv).addClass("autoht")
		}
		if (w.url == false || w.url == "") {
			z.addCellProp();
			z.addRowProp()
		}
		var f = a("thead tr:first th:first", z.hDiv).get(0);
		if (f != null) {
			z.cDrag.className = "cDrag";
			z.cdpad = 0;
			z.cdpad += (isNaN(parseInt(a("div", f).css("borderLeftWidth"))) ? 0
					: parseInt(a("div", f).css("borderLeftWidth")));
			z.cdpad += (isNaN(parseInt(a("div", f).css("borderRightWidth"))) ? 0
					: parseInt(a("div", f).css("borderRightWidth")));
			z.cdpad += (isNaN(parseInt(a("div", f).css("paddingLeft"))) ? 0
					: parseInt(a("div", f).css("paddingLeft")));
			z.cdpad += (isNaN(parseInt(a("div", f).css("paddingRight"))) ? 0
					: parseInt(a("div", f).css("paddingRight")));
			z.cdpad += (isNaN(parseInt(a(f).css("borderLeftWidth"))) ? 0
					: parseInt(a(f).css("borderLeftWidth")));
			z.cdpad += (isNaN(parseInt(a(f).css("borderRightWidth"))) ? 0
					: parseInt(a(f).css("borderRightWidth")));
			z.cdpad += (isNaN(parseInt(a(f).css("paddingLeft"))) ? 0
					: parseInt(a(f).css("paddingLeft")));
			z.cdpad += (isNaN(parseInt(a(f).css("paddingRight"))) ? 0
					: parseInt(a(f).css("paddingRight")));
			a(z.bDiv).before(z.cDrag);
			var e = a(z.bDiv).height();
			var d = a(z.hDiv).height();
			a(z.cDrag).css({
				top : -d + "px"
			});
			a("thead tr:first th", z.hDiv).each(function() {
				var p = document.createElement("div");
				a(z.cDrag).append(p);
				if (!w.cgwidth) {
					w.cgwidth = a(p).width()
				}
				var g = a(this).attr("isch");
				if (w.dragable) {
					a(p).css({
						height : e + d
					});
					if (!g) {
						a(p).mousedown(function(t) {
							z.dragStart("colresize", t, this)
						})
					}
					z.fixHeight(a(z.gDiv).height());
					a(p).hover(function() {
						z.fixHeight();
						if (!g) {
							a(this).addClass("dragging")
						}
					}, function() {
						if (!z.colresize) {
							a(this).removeClass("dragging")
						}
					})
				}
			});
			z.rePosDrag()
		}
		if (w.striped) {
			a("tbody tr:odd", z.bDiv).addClass("erow")
		}
		if (w.resizable && w.height != "auto") {
			z.vDiv.className = "vGrip";
			a(z.vDiv).mousedown(function(g) {
				z.dragStart("vresize", g)
			}).html("<span></span>");
			a(z.bDiv).after(z.vDiv)
		}
		if (w.resizable && w.width != "auto" && !w.nohresize) {
			z.rDiv.className = "hGrip";
			a(z.rDiv).mousedown(function(g) {
				z.dragStart("vresize", g, true)
			}).html("<span></span>").css("height", a(z.gDiv).height());
			if (a.browser.msie && a.browser.version < 7) {
				a(z.rDiv).hover(function() {
					a(this).addClass("hgOver")
				}, function() {
					a(this).removeClass("hgOver")
				})
			}
			a(z.gDiv).append(z.rDiv)
		}
		z.doUsePager = function() {
			if (w.usepager) {
				z.pDiv.className = "pDiv";
				z.pDiv.innerHTML = '<div class="pDiv2"></div>';
				a(z.bDiv).after(z.pDiv);
				var F = '<div class="pGroup"><div class="pFirst pButton" title="\u8f6c\u5230\u7b2c\u4e00\u9875"><span></span></div><div class="pPrev pButton" title="\u8f6c\u5230\u4e0a\u4e00\u9875"><span></span></div> </div><div class="btnseparator"></div> <div class="pGroup"><span class="pcontrol">\u5f53\u524d\u7b2c <input type="text" size="1" value="1" />\u9875\uff0c\u603b\u9875\u6570 <span> 1 </span></span></div><div class="btnseparator"></div><div class="pGroup"> <div class="pNext pButton" title="\u8f6c\u5230\u4e0b\u4e00\u9875"><span></span></div><div class="pLast pButton" title="\u8f6c\u5230\u6700\u540e\u4e00\u9875"><span></span></div></div><div class="btnseparator"></div><div class="pGroup"> <div class="pReload pButton" title="\u5237\u65b0"><span></span></div> </div> <div class="btnseparator"></div><div class="pGroup"><span class="pPageStat"></span></div>';
				a("div", z.pDiv).html(F);
				a(".pReload", z.pDiv).click(function() {
					if (w.isSuccessSearch) {
						z.changePage("reload")
					}
				});
				a(".pFirst", z.pDiv).click(function() {
					if (w.isSuccessSearch) {
						z.changePage("first")
					}
				});
				a(".pPrev", z.pDiv).click(function() {
					if (w.isSuccessSearch) {
						z.changePage("prev")
					}
				});
				a(".pNext", z.pDiv).click(function() {
					if (w.isSuccessSearch) {
						z.changePage("next")
					}
				});
				a(".pLast", z.pDiv).click(function() {
					if (w.isSuccessSearch) {
						z.changePage("last")
					}
				});
				a(".pcontrol input", z.pDiv).keydown(function(I) {
					if (I.keyCode == 13 && w.isSuccessSearch) {
						z.changePage("input")
					}
				});
				if (a.browser.msie && a.browser.version < 7) {
					a(".pButton", z.pDiv).hover(function() {
						a(this).addClass("pBtnOver")
					}, function() {
						a(this).removeClass("pBtnOver")
					})
				}
				if (w.useRp) {
					var t = "";
					for ( var p = 0; p < w.rpOptions.length; p++) {
						if (w.rp == w.rpOptions[p]) {
							sel = 'selected="selected"'
						} else {
							sel = ""
						}
						t += "<option value='" + w.rpOptions[p] + "' " + sel
								+ " >" + w.rpOptions[p]
								+ "&nbsp;&nbsp;</option>"
					}
					a(".pDiv2", z.pDiv)
							.prepend(
									"<div class='pGroup'>\u6bcf\u9875 <select name='rp'>"
											+ t
											+ "</select>\u6761</div> <div class='btnseparator'></div>");
					a("select", z.pDiv).change(function() {
						if (w.onRpChange) {
							w.onRpChange(+this.value)
						} else {
							w.newp = 1;
							w.rp = this.value;
							if (w.isSuccessSearch) {
								z.changePage("change")
							}
						}
					})
				}
				if (w.searchitems) {
					a(".pDiv2", z.pDiv)
							.prepend(
									"<div class='pGroup'> <div class='pSearch pButton'><span></span></div> </div>  <div class='btnseparator'></div>");
					a(".pSearch", z.pDiv).click(
							function() {
								a(z.sDiv).slideToggle(
										"fast",
										function() {
											a(".sDiv:visible input:first",
													z.gDiv).trigger("focus")
										})
							});
					z.sDiv.className = "sDiv";
					sitems = w.searchitems;
					var g = "";
					var H = "Eq";
					for ( var G = 0; G < sitems.length; G++) {
						if (w.qtype == "" && sitems[G].isdefault == true) {
							w.qtype = sitems[G].name;
							sel = 'selected="selected"'
						} else {
							sel = ""
						}
						if (sitems[G].operater == "Like") {
							H = "Like"
						} else {
							H = "Eq"
						}
						g += "<option value='" + sitems[G].name + "$" + H + "$"
								+ G + "' " + sel + " >" + sitems[G].display
								+ "&nbsp;&nbsp;</option>"
					}
					if (w.qtype == "") {
						w.qtype = sitems[0].name
					}
					a(z.sDiv)
							.append(
									"<div class='sDiv2'>\u5feb\u901f\u68c0\u7d22\uff1a<input type='text' size='30' name='q' class='qsbox' /> <select name='qtype'>"
											+ g
											+ "</select> <input type='button' name='qclearbtn' value='\u6e05\u7a7a' /></div>");
					a("input[name=q],select[name=qtype]", z.sDiv).keydown(
							function(I) {
								if (I.keyCode == 13) {
									z.doSearch()
								}
							});
					a("input[name=qclearbtn]", z.sDiv).click(function() {
						a("input[name=q]", z.sDiv).val("");
						w.query = "";
						z.doSearch()
					});
					a(z.bDiv).after(z.sDiv)
				}
			}
		};
		z.doUsePager();
		a(z.pDiv, z.sDiv).append("<div style='clear:both'></div>");
		if (w.title) {
			z.mDiv.className = "mDiv";
			z.mDiv.innerHTML = '<div class="ftitle">' + w.title + "</div>";
			a(z.gDiv).prepend(z.mDiv);
			if (w.showTableToggleBtn) {
				a(z.mDiv)
						.append(
								'<div class="ptogtitle" title="Minimize/Maximize Table"><span></span></div>');
				a("div.ptogtitle", z.mDiv).click(function() {
					a(z.gDiv).toggleClass("hideBody");
					a(this).toggleClass("vsble")
				})
			}
			z.rePosDrag()
		}
		z.cdropleft = document.createElement("span");
		z.cdropright = document.createElement("span");
		var j = a("<div/>");
		j.addClass("loading");
		a(z.block).append(j);
		var B = a(z.bDiv).height();
		var D = z.bDiv.offsetTop;
		a(z.block).css({
			width : z.bDiv.style.width,
			height : B,
			position : "relative",
			marginBottom : (B * -1),
			zIndex : 1,
			top : D,
			left : "0px"
		});
		a(z.block).fadeTo(0, w.blockOpacity);
		if (a("th", z.hDiv).length) {
			z.nDiv.className = "nDiv";
			z.nDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
			a(z.nDiv).css({
				marginBottom : (B * -1),
				display : "none",
				top : D
			}).noSelect();
			var m = 0;
			a("th div", z.hDiv).each(
					function() {
						var p = a("th[axis='col" + m + "']", z.hDiv)[0];
						if (p == null) {
							return
						}
						var t = a("input[type='checkbox']", this).filter(
								function() {
									return a(this).hasClass("noborder")
								});
						if (t.length > 0) {
							t[0].onclick = z.checkAllOrNot;
							return
						}
						if (p.toggle == false || this.innerHTML == "") {
							m++;
							return
						}
						var g = 'checked="checked"';
						if (p.style.display == "none") {
							g = ""
						}
						a("tbody", z.nDiv).append(
								'<tr><td class="ndcol1"><input type="checkbox" '
										+ g
										+ ' class="togCol noborder" value="'
										+ m + '" /></td><td class="ndcol2">'
										+ this.innerText + "</td></tr>");
						m++
					});
			if (a.browser.msie && a.browser.version < 7) {
				a("tr", z.nDiv).hover(function() {
					a(this).addClass("ndcolover")
				}, function() {
					a(this).removeClass("ndcolover")
				})
			}
			a("td.ndcol2", z.nDiv).click(
					function() {
						if (a("input:checked", z.nDiv).length < w.minColToggle
								&& a(this).prev().find("input")[0].checked) {
							return false
						}
						return z.toggleCol(a(this).prev().find("input").val())
					});
			a("input.togCol", z.nDiv).click(
					function() {
						if (a("input:checked", z.nDiv).length < w.minColToggle
								&& this.checked == false) {
							return false
						}
						a(this).parent().next().trigger("click")
					});
			a(z.gDiv).prepend(z.nDiv);
			a(z.nBtn).addClass("nBtn").html("<div></div>").click(function() {
				a(z.nDiv).toggle();
				return true
			});
			if (w.showToggleBtn) {
				a(z.gDiv).prepend(z.nBtn)
			}
		}
		a(z.iDiv).addClass("iDiv").css({
			display : "none"
		});
		a(z.bDiv).append(z.iDiv);
		a(z.bDiv).hover(function() {
			a(z.nDiv).hide();
			a(z.nBtn).hide();
			a(z.eDiv).hide()
		}, function() {
			if (z.multisel) {
				z.multisel = false
			}
		});
		a(z.gDiv).hover(function() {
		}, function() {
			a(z.nDiv).hide();
			a(z.nBtn).hide();
			a(z.eDiv).hide()
		});
		a(document).mousemove(function(g) {
			z.dragMove(g)
		}).mouseup(function(g) {
			z.dragEnd()
		}).hover(function() {
		}, function() {
			z.dragEnd()
		});
		if (a.browser.msie && a.browser.version < 7) {
			a(".hDiv,.bDiv,.mDiv,.pDiv,.vGrip,.tDiv, .sDiv", z.gDiv).css({
				width : "100%"
			});
			a(z.gDiv).addClass("ie6");
			if (w.width != "auto") {
				a(z.gDiv).addClass("ie6fullwidthbug")
			}
		}
		z.rePosDrag();
		z.fixHeight();
		u.p = w;
		u.grid = z;
		if (w.autoload) {
			w.isSuccessSearch = true;
			z.populate()
		}
		z.doSortClass();
		return u
	};
	var b = false;
	a(document).ready(function() {
		b = true
	});
	a.fn.flexigrid = function(c) {
		return this.each(function() {
			if (!b) {
				a(this).hide();
				var d = this;
				a(document).ready(function() {
					a.addFlex(d, c)
				})
			} else {
				a.addFlex(this, c)
			}
		})
	};
	a.fn.noSelect = function(c) {
		if (c == null) {
			prevent = true
		} else {
			prevent = c
		}
		if (prevent) {
			return this.each(function() {
				if (a.browser.msie || a.browser.safari) {
					a(this).bind("selectstart", function() {
						return false
					})
				} else {
					if (a.browser.mozilla) {
						a(this).css("MozUserSelect", "none");
						a("body").trigger("focus")
					} else {
						if (a.browser.opera) {
							a(this).bind("mousedown", function() {
								return false
							})
						} else {
							a(this).attr("unselectable", "on")
						}
					}
				}
			})
		} else {
			return this.each(function() {
				if (a.browser.msie || a.browser.safari) {
					a(this).unbind("selectstart")
				} else {
					if (a.browser.mozilla) {
						a(this).css("MozUserSelect", "inherit")
					} else {
						if (a.browser.opera) {
							a(this).unbind("mousedown")
						} else {
							a(this).removeAttr("unselectable", "on")
						}
					}
				}
			})
		}
	}
})(jQuery);
var NLTable = function(g) {
	this.timer = null;
	String.prototype.replaceAll = function(k, j) {
		return this.replace(new RegExp(k, "gm"), j)
	};
	if (g.height) {
		g.isDefaultHeight = false
	} else {
		if (g.subIds && g.subIds.length > 0) {
			g.isDefaultHeight = true;
			var f = 0;
			for ( var b = 0, a = g.subIds.length; b < a; b++) {
				f += jQuery("#" + g.subIds[b]).outerHeight()
			}
			g.height = jQuery(window).height() - f
		} else {
			g.isDefaultHeight = true;
			g.height = jQuery(window).height()
		}
	}
	g = jQuery
			.extend(
					{
						container_id : "",
						table_id : "",
						tableData : false,
						onChangePage : false,
						height : 305,
						sortname : "id",
						sortorder : "desc",
						width : "auto",
						striped : true,
						novstripe : false,
						maskObject : false,
						minwidth : 30,
						minheight : 80,
						url : false,
						method : "POST",
						dataType : "json",
						errormsg : "\u6570\u636e\u8bf7\u6c42\u5931\u8d25!",
						usepager : true,
						nowrap : false,
						page : 1,
						total : 1,
						useRp : true,
						rp : 10,
						rpOptions : [ 10, 15, 20, 25, 40, 100 ],
						title : "\u6570\u636e\u5217\u8868",
						pagestat : "\u663e\u793a\u8bb0\u5f55\u4ece{from}\u5230{to},\u603b\u6570 {total} \u6761",
						procmsg : "\u6b63\u5728\u5904\u7406\u6570\u636e\uff0c\u8bf7\u7a0d\u5019 ...",
						query : "",
						qtype : "",
						qop : "Eq",
						nomsg : "\u6ca1\u6709\u7b26\u5408\u6761\u4ef6\u7684\u8bb0\u5f55\u5b58\u5728",
						minColToggle : 1,
						onWindowResize : false,
						showToggleBtn : false,
						hideOnSubmit : true,
						showTableToggleBtn : false,
						autoload : false,
						blockOpacity : 0.5,
						onToggleCol : false,
						onChangeSort : false,
						onSuccess : false,
						onSubmit : false,
						showcheckbox : false,
						rowhandler : false,
						clickRowDoCheck : true,
						onRowSelectedChangeClass : false,
						rowbinddata : true,
						extParam : [ {} ],
						successResultID : "1",
						showSuccessMsg : true,
						showErrorMsg : true,
						bgClass : false,
						gridClass : "bbit-grid",
						disCheckbox : false,
						dragable : true,
						isReloadCall : false,
						sortByStatic : false,
						isFilter : true
					}, g);
	g._rp = g.rp;
	g._page = g.page;
	g._sortname = g.sortname;
	g._sortorder = g.sortorder;
	g._query = g.query;
	g._qtype = g.qtype;
	g._qop = g.qop;
	g.resizable = false;
	var c = 26;
	c += 1;
	if (g.title) {
		c += 24
	}
	if (g.buttons) {
		c += 26
	}
	if (g.usepager) {
		c += 31
	}
	g.height = g.height - c;
	if (g.height < 0) {
		g.height = 0
	}
	g.table_id = g.container_id + "_table_id";
	function d() {
		jQuery("#" + g.container_id).append(
				'<table id="' + g.table_id + '" style="display:none"></table>')
	}
	d();
	var e = jQuery("#" + g.table_id).flexigrid(g);
	g.oldWidth = jQuery("#" + g.container_id).width();
	if (g.onWindowResize) {
		var h = this;
		jQuery(window)
				.resize(
						function() {
							window.clearTimeout(h.timer);
							h.timer = window
									.setTimeout(
											function() {
												var k = g.onWindowResize();
												if (k.width != undefined
														&& k.height != undefined) {
													var j, m;
													if (typeof e[0].p.width == "string"
															&& e[0].p.width
																	.indexOf("%") != -1) {
														j = jQuery(
																"#"
																		+ e[0].p.container_id)
																.width()
																* e[0].p.width
													} else {
														j = parseInt(e[0].p.width)
													}
													if (typeof k.width == "string"
															&& k.width
																	.indexOf("%") != -1) {
														m = jQuery(
																"#"
																		+ g.container_id)
																.width()
																* k.width
													} else {
														m = parseInt(k.width)
													}
													var l = j != m;
													if ((e[0].p.width != k.width || l)
															|| (parseInt(
																	e[0].p.height,
																	10) + c) != k.height) {
														h.flexResize(k.width,
																k.height)
													}
												}
											}, 100)
						})
	} else {
		if (g.subIds) {
			var h = this;
			jQuery(window)
					.resize(
							function() {
								window.clearTimeout(h.timer);
								h.timer = window
										.setTimeout(
												function() {
													if (g.isDefaultHeight) {
														var k = 0;
														if (g.subIds
																&& g.subIds.length > 0) {
															var o = 0;
															for ( var m = 0, j = g.subIds.length; m < j; m++) {
																o += jQuery(
																		"#"
																				+ g.subIds[m])
																		.outerHeight()
															}
															k = jQuery(window)
																	.height()
																	- o
														} else {
															k = jQuery(window)
																	.height()
														}
														var n;
														if (typeof e[0].p.width == "string"
																&& e[0].p.width
																		.indexOf("%") != -1) {
															n = jQuery(
																	"#"
																			+ e[0].p.container_id)
																	.width()
																	* e[0].p.width
														} else {
															n = parseInt(e[0].p.width)
														}
														var l = g.oldWidth != n;
														if (l
																|| (parseInt(
																		e[0].p.height,
																		10) + c) != k) {
															g.oldWidth = l;
															h.flexResize(
																	g.width, k)
														}
													}
												}, 100)
							})
		}
	}
	this.search = this.flexReload = function(j, k) {
		return e.each(function() {
			if (e[0].grid) {
				var l = {
					newp : g._page,
					rp : (g.tableData && !g.url) ? g.rp : g._rp,
					sortname : g._sortname,
					sortorder : g._sortorder,
					query : g._query,
					qtype : g._qtype,
					qop : g._qop,
					extParam : j ? j : [ {} ]
				};
				if (k) {
					l.tableData = k
				}
				e[0].grid.freshParam(l);
				e[0].grid.populate()
			}
		})
	};
	this.clearAllRows = function() {
		if (e[0].grid) {
			e[0].grid.clearAllRows()
		}
	};
	this.flexResize = function(j, k) {
		var l = {};
		if (j) {
			l.width = j
		}
		if (k) {
			k = parseInt(k, 10);
			l.height = k - c;
			if (l.height < 0) {
				l.height = 0
			}
		}
		return e.each(function() {
			if (e[0].grid) {
				jQuery.extend(e[0].p, l);
				e[0].grid.reSize()
			}
		})
	};
	this.flexOptions = function(j) {
		return e.each(function() {
			if (e[0].grid) {
				jQuery.extend(e[0].p, j)
			}
		})
	};
	this.getOptions = function() {
		if (e[0].grid) {
			return e[0].p
		}
		return null
	};
	this.getCheckedRows = function() {
		if (e[0].grid) {
			return e[0].grid.getCheckedRows()
		}
		return []
	};
	this.getRowData = function(j) {
		if (e[0].grid) {
			return e[0].grid.getRowData(j)
		}
	};
	this.getRowsData = function() {
		if (e[0].grid) {
			return e[0].grid.getRowsData()
		}
	};
	this.cancelAllSelectState = function() {
		if (e[0].grid) {
			e[0].grid.cancelAllSelectState()
		}
	};
	this.mask = function() {
		if (e[0].grid) {
			e[0].grid.doMask("mask")
		}
	};
	this.unmask = function() {
		if (e[0].grid) {
			e[0].grid.doMask("unmask")
		}
	};
	this.exportByColumns = function(j) {
		if (e[0].grid) {
			return e[0].grid.exportByColumns(j)
		}
		return null
	};
	this.exportAll = function(j) {
		if (e[0].grid) {
			return e[0].grid.exportAll(j)
		}
		return null
	};
	this.enabledButton = function(j) {
		if (e[0].grid) {
			e[0].grid.enabledButton(j)
		}
	};
	this.disabledButton = function(j) {
		if (e[0].grid) {
			e[0].grid.disabledButton(j)
		}
	};
	this.flexToggleCol = function(k, j) {
		return e.each(function() {
			if (e[0].grid) {
				e[0].grid.toggleCol(k, j)
			}
		})
	};
	this.flexAddData = function(j) {
		return e.each(function() {
			if (e[0].grid) {
				e[0].grid.addData(j)
			}
		})
	};
	this.stopPropagation = function(j) {
		if (e[0].grid) {
			e[0].grid.stopPropagation(j)
		}
	};
	this.addRowData = function(j) {
		if (e[0].grid) {
			return e[0].grid.addRowData(j)
		}
	};
	this.getSelectIndex = function(j) {
		if (e[0].grid) {
			return e[0].grid.getSelectIndex(j)
		}
	};
	this.deleteRowData = function(j) {
		if (e[0].grid) {
			e[0].grid.deleteRowData(j)
		}
	};
	this.getAllData = function() {
		if (e[0].grid) {
			return e[0].grid.getAllData()
		}
	};
	this.getChangeData = function() {
		if (e[0].grid) {
			return e[0].grid.getChangeData()
		}
	};
	this.getRowObject = function(j) {
		if (e[0].grid) {
			return e[0].grid.getRowObject(j)
		}
	};
	this.setRowOrColumnCol = function(j) {
		if (e[0].grid) {
			return e[0].grid.setRowOrColumnCol(j)
		}
	};
	this.clearRowOrColumnCol = function(j) {
		if (e[0].grid) {
			return e[0].grid.clearRowOrColumnCol(j)
		}
	};
	this.getNewRows = function() {
		if (e[0].grid) {
			return e[0].grid.getNewRows()
		}
	};
	this.updateRowData = function(j) {
		if (e[0].grid) {
			return e[0].grid.updateRowData(j)
		}
	};
	this.getUnselectRowsData = function() {
		if (e[0].grid) {
			return e[0].grid.getUnselectRowsData()
		}
	};
	this.fresh = function(j) {
		if (e[0].grid) {
			if (!j) {
				j = {}
			}
			j.fnName = "fresh";
			if (j.isCallOnChangePage != undefined
					&& (j.isCallOnChangePage == false || (typeof j.isCallOnChangePage == String && j.isCallOnChangePage
							.toUpperCase() == "false".toUpperCase()))) {
				j.isCallOnChangePage = false
			} else {
				j.isCallOnChangePage = true
			}
			e[0].grid.changePage("reload", j)
		}
	};
	this.checkRowsByKeyColumn = function(j) {
		if (e[0].grid) {
			e[0].grid.checkRowsByKeyColumn(j)
		}
	};
	this.flexTitle = function(j) {
		if (e[0].grid) {
			e[0].grid.flexTitle(j)
		}
	};
	this.adjustOrder = function(j) {
		if (e[0].grid) {
			e[0].grid.adjustOrder(j)
		}
	}
};

/**
 * 工具类
 * @author weiys
 */
var util = new function() {

    //去掉字符串前后的空格;
    this.trim = function(sString) {
            return sString.replace(/(^\s*)|(\s*$)/g, "");
        }
        //去掉左边的空格;
    this.lTrim = function(sString) {
            return sString.replace(/(^\s*)/g, "");
        }
        //去掉右边的空格
    this.rTrim = function(sString) {
            return sString.replace(/(\s*$)/g, "");
        }
        /**
         * 根据控件ID获取控件对像
         * @ctlId:控件ID
         */
    this.getElement = function(ctlId) {
            if (!this.isNull(ctlId)) {
                if (typeof ctlId == "object") {
                    return ctlId;
                } else {
                    if (this.isNull(document.getElementById(ctlId))) {
                        alert(ctlId + "控件不存在!");
                    }
                    return document.getElementById(ctlId);
                }
            } else {
                return null;
            }
        }
        //判断对像是否为空
    this.isNull = function(obj) {
            //alert(typeof obj);
            //alert(obj instanceof String);
            if (obj == undefined) {
                return true;
            } else if (obj == "undefined") {
                return true;
            } else if (obj == null) {
                return true;
            } else if (typeof obj == "string") {
                if (this.trim(obj) == "") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        /**
         *多条件返回值
         *source：用于判断的值
         *condArr:[{cond:cond1,value:value1},{cond:cond2,value:value2}……]：为条件cond1返回value1
         *other:不在条件里的默认值
         *decode(sex,[{1:'男'},{2:'女'}],'未知')：当sex的值为1返回男，为2返回女，其他值返回未知
         */
    this.decode = function(source, condArr, other) {
            if (!this.isNull(source) && !this.isNull(condArr) && condArr.length > 0) {
                for (var i = 0; i < condArr.length; i++) {
                    if (source == condArr[i].cond) {
                        return condArr[i].value;
                    }
                }
                if (!this.isNull(other)) {
                    return other;
                } else {
                    return "";
                }
            } else {
                return "";
            }
        }
        /**
         * 检查控件的值是否为空(验证作用)
         * @ctlName 控件中文描述
         * @ctlId 控件id
         */
    this.checkCtlIsNull = function(ctlName, ctlId) {
            var ctl = this.getElement(ctlId);
            if (!isNull(ctl)) {
                if (this.isNull(ctl.value)) {
                    ctl.fucus;
                    alert(ctlName + "不能为空!");
                    return true;
                } else {
                    return false;
                }
            } else {
                alert(ctlId + "控件不存在!");
                return true;
            }
        }
        /**
         * 获取控件的值
         * @ctlId 控件id
         */
    this.getCtlValue = function(ctlId) {
            var obj = this.getElement(ctlId);
            if (!this.isNull(obj)) {
                return obj.value;
            } else {
                alert(ctlId + "控件不存在!");
                return "";
            }
        }
        /**
         * 设置控件的值
         * @ctlId 控件id
         * @value 控件值
         */
    this.setCtlValue = function(ctlId, value) {
            var obj = this.getElement(ctlId);
            if (!this.isNull(obj)) {
                obj.value = value;
            } else {
                alert(ctlId + "控件不存在!");
            }
        }
        /**
         * 点击某个控件时获取其坐标和宽高大小
         */
    this.getPosition = function() {
            var aTag = event.srcElement;
            var eventObj = new Object();
            eventObj.width = aTag.offsetWidth;
            eventObj.height = aTag.offsetHeight;
            var leftpos = 0;
            var toppos = 0;
            do {
                leftpos += aTag.offsetLeft;
                toppos += aTag.offsetTop;
                aTag = aTag.offsetParent;
            } while (aTag.tagName != "BODY");

            eventObj.left = leftpos;
            eventObj.top = toppos;

            return eventObj;
        }
        /**
         * 判断页面某个元素是否是指定元素的子节点
         * 判断obj对象是否是parentObj对象的子节点
         */
    this.isParentChild = function(obj, parentObj) {
        while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
            if (obj == parentObj) {
                return true;
            }
            obj = obj.parentNode;
        }
        return false;
    }

    /**
     * 替换字符串中的值
     * @str 字符串
     * @oldValue
     * @newValue
     */
    this.replaceAll = function(str, oldValue, newValue) {
            var temp = str;
            if (!this.isNull(temp)) {
                temp = temp + "";
                while (temp.indexOf(oldValue) >= 0) {
                    temp = temp.replace(oldValue, newValue);
                }
            }
            return temp;
        }
        /**
         * 校验是否为数字
         * @digit 检验值
         */
    this.isDigit = function(digit) {
            if (this.isNull(digit) || isNaN(digit)) {
                return false;
            }
            return true;
        }
        /**
         * 校验是否为合法日期
         * @date 检验值   格式：(范围:18000101~29990101)(范围:1800-01-01~2999-01-01)
         */
    this.isDate = function(date) {
            var pattern = /^(18|19|20|21|23|24|25|26|27|28|29)\d{2}-?(0?\d|1[012])-?(0?\d|[12]\d|3[01])$/;
            if (!pattern.exec(date)) {
                return false
            }
            return true
        }
        /**
         * 校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
         * @tel 检验值
         */
    this.isTel = function(tel) {
            var patrn = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
            if (!patrn.exec(tel)) {
                return false
            }
            return true
        }
        /**
         * 校验email地址
         * @email 检验值
         */
    this.isEmail = function(email) {
            var patrn = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
            if (!patrn.exec(email)) {
                return false
            }
            return true
        }
        /**
         * 返回lista中所有不在listb中的元素集
         * @id 判断lista和listb中对象是否相同的属性标志
         */
    this.getListNotInList = function(lista, listb, id) {
            var arr = [];
            if (!this.isNull(lista) && lista.length > 0) {
                if (this.isNull(listb) || listb.length <= 0) {
                    arr = lista;
                } else {
                    for (var i = 0; i < lista.length; i++) {
                        for (var j = 0; j < listb.length; j++) {
                            if (lista[i][id] == listb[j][id]) {
                                break;
                            }
                            if (j + 1 == listb.length) {
                                arr[arr.length] = lista[i];
                            }
                        }
                    }
                }
            }
            return arr;
        }
        /**
         * 返回lista中所有在listb中的元素集
         * @id 判断lista和listb中对象是否相同的属性标志
         */
    this.getListInList = function(lista, listb, id) {
            var arr = [];
            if (!this.isNull(lista) && !this.isNull(listb) && listb.length > 0) {
                for (var i = 0; i < lista.length; i++) {
                    for (var j = 0; j < listb.length; j++) {
                        if (lista[i][id] == listb[j][id]) {
                            arr[arr.length] = lista[i];
                            break;
                        }
                    }
                }
            }
            return arr;
        }
        /**
         * 将两个列表合并(去除相同的选项)
         * @id 判断lista和listb中对象是否相同的属性标志
         */
    this.mergeList = function(lista, listb, id) {
            var list = [];
            if (lista != null && listb != null) {
                if (lista.length > 0) {
                    if (listb.length > 0) {
                        for (var i = 0; i < listb.length; i++) {
                            lista[lista.length] = listb[i]
                        }
                        for (var i = 0; i < lista.length; i++) {
                            if (i == 0) {
                                list[list.length] = lista[i];
                            } else {
                                for (var j = 0; j < list.length; j++) {
                                    if (lista[i][id] == list[j][id]) {
                                        break;
                                    }
                                    if (j + 1 == list.length) {
                                        list[list.length] = lista[i];
                                    }
                                }
                            }
                        }
                    } else {
                        list = lista;
                    }
                } else {
                    list = listb;
                }
            }
            return list;
        }
        //=====================================复选框控件(checkbox)=====================================//		
        /**
         * 设置复选框控件组全选或取消全选
         * @tagName checkbox控件的name
         * @isChecked true:全选,false:取消全选
         */
    this.selectCheckBox = function(tagName, isChecked) {
            var arr = document.getElementsByName(tagName);
            if (!this.isNull(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    if (isChecked) {
                        arr[i].checked = true;
                    } else {
                        arr[i].checked = false;
                    }
                }
            }
        }
        /**
         * 判断复选框控件组是否全部选中
         * @tagName checkbox控件的name
         */
    this.isAllChecked = function(tagName) {
            var arr = document.getElementsByName(tagName);
            var flag = true
            if (!this.isNull(arr)) {
                var len = arr.length;
                for (i = 0; i < len; i++) {
                    if (!arr[i].checked) {
                        flag = false;
                        break;
                    }
                }
            }
            return flag;
        }
        /**
         * 获取复选框控件组中选中的值(用逗号隔开)
         * @tagName checkbox控件的name
         */
    this.getCheckBoxValue = function(tagName) {
            var arr = document.getElementsByName(tagName);
            var value = "";
            if (!this.isNull(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].checked) {
                        if (this.isNull(value)) {
                            value = arr[i].value;
                        } else {
                            value += "," + arr[i].value;
                        }
                    }
                }
            }
            return value;
        }
        //==========================================================================================//

    //=====================================单选框控件(radio)=====================================//		
    /**
     * 获取单选框控件组中选中的值
     * @tagName radio控件的name
     */
    this.getRadioValue = function(tagName) {
            var arr = document.getElementsByName(tagName);
            var value = "";
            if (!this.isNull(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].checked) {
                        value = arr[i].value;
                    }
                }
            }
            return value;
        }
        //==========================================================================================//	

    //=====================================下拉框控件(select)=====================================//	
    /**
     * 获取下拉框控件中选中的option对像(可以获得：option.value,option.text,option.index)
     * 选中时：selectedIndex获取选中下标
     * @selId select控件的ID
     */
    this.getSelectedOption = function(selId) {
            var sel = this.getElement(selId);
            var option = null;
            if (!this.isNull(sel)) {
                option = sel.options[sel.selectedIndex];
            }
            return option;
        }
        /**
         * 获取下拉框控件的大小
         * @selId select控件的ID
         */
    this.getSelectSize = function(selId) {
            var sel = this.getElement(selId);
            if (!this.isNull(sel)) {
                return sel.options.length;
            }
        }
        /**
         * 获取下拉框控件的所有option对像(返回一个Array)
         * @selId select控件的ID
         */
    this.getSelectOptons = function(selId) {
            var sel = this.getElement(selId);
            if (!this.isNull(sel) && this.getSelectSize(sel) > 0) {
                return sel.options;
            } else {
                return null;
            }
        }
        /**
         * 获取下拉框控件的所有option对像的值(用逗号隔开)
         * @selId select控件的ID
         */
    this.getSelectValue = function(selId) {
            var options = this.getSelectOptons(selId);
            var values = "";
            if (!this.isNull(options)) {
                for (var i = 0; i < options.length; i++) {
                    if (i == 0) {
                        values += options[i].value;
                    } else {
                        values += "," + options[i].value;
                    }
                }
            }
            return values;
        }
        /**
         *判断下拉框中是否存在指定的中文值选项
         *@selId select控件的ID
         *@text 中文值
         */
    this.isContainText = function(selId, text) {
            var flag = false;
            var options = this.getSelectOptons(selId);
            if (!this.isNull(options)) {
                for (var i = 0; i < options.length; i++) {
                    if (options[i].text == text) {
                        flag = true;
                        break;
                    }
                }
            }
            return flag;
        }
        /**
         * 删除下拉框控件中指定的下标的option
         * @selId select控件的ID
         */
    this.removeSelect = function(selId, index) {
            var sel = this.getElement(selId);
            if (!this.isNull(sel) && !this.isNull(index) && this.getSelectSize(sel) > 0 && index >= 0) {
                sel.options.remove(index);
            }
        }
        /**
         * 清空下拉框控件的所有option
         * @selId select控件的ID
         */
    this.clearSelect = function(selId) {
            var sel = this.getElement(selId);
            if (!this.isNull(sel) && !this.isNull(sel.options) && this.getSelectSize(sel) > 0) {
                while (this.getSelectSize(sel) > 0) {
                    sel.options.remove(0);
                }
            }
        }
        /**
         * 往下拉框控件中加入一个新的option对像
         * @selId select控件的ID
         * @text  Option.text
         * @value Option.value
         */
    this.addSelectOption = function(selId, text, value) {
            var sel = this.getElement(selId);
            if (!this.isNull(sel) && !this.isNull(text) && !this.isNull(value)) {
                var option = new Option(text, value);
                sel.options.add(option);
            }
        }
        /**
         * 根据value值选中下拉框的对应项
         * @selId select控件的ID
         * @value Option.value
         */
    this.selectedOption = function(selId, value) {
            var options = this.getSelectOptons(selId);
            if (!this.isNull(options)) {
                for (var i = 0; i < options.length; i++) {
                    if (options[i].value == value) {
                        options[i].selected = "selected";
                        break;
                    }
                }
            }
        }
        //==========================================================================================//
        //========================================DIV动态显示=========================================//
        //在引用的JSP文件中写JS方法，再在JS方法中调用以下方法
        /**
         * DIV渐渐展开
         * @id
         * @timeOut:间隔时间
         */
    var isFirstClip = true;
    var clipTop = 0,
        clipRight = 0,
        clipBottom = 0,
        clipLeft = 0,
        width = 0,
        height = 0,
        clipWidthSpace = clipHeightSpace = 10;
    this.showClipDiv = function(id, timeOut) {
            var obj = document.getElementById(id);
            if (!this.isNull(obj)) {
                if (isFirstClip) {
                    width = parseInt(obj.style.width, 10);
                    height = parseInt(obj.style.height, 10);
                    clipWidthSpace = width * 0.05;
                    clipHeightSpace = height * 0.05;
                    clipTop = height / 2 - 10;
                    clipRight = width / 2 + 10;
                    clipBottom = height / 2 + 10;
                    clipLeft = width / 2 - 10;
                    isFirstClip = false;
                }
                if (clipTop > 0 && clipBottom < height && clipRight < width && clipLeft > 0) {
                    obj.style.clip = "rect(" + clipTop + "," + clipRight + "," + clipBottom + "," + clipLeft + ")";
                    clipTop = clipTop - clipHeightSpace;
                    clipRight = clipRight + clipWidthSpace;
                    clipBottom = clipBottom + clipHeightSpace;
                    clipLeft = clipLeft - clipWidthSpace;
                    window.setTimeout(function() {
                        util.showClipDiv(obj.id, timeOut)
                    }, timeOut)
                } else {
                    clipTop = 0;
                    clipRight = width;
                    clipBottom = height;
                    clipLeft = 0;
                    obj.style.clip = "rect(" + clipTop + "," + clipRight + "," + clipBottom + "," + clipLeft + ")";
                    isFirstClip = true;
                }
            }
        }
        /**
         * DIV渐渐关闭
         * @id
         * @timeOut:间隔时间
         */
    this.closeClipDiv = function(id, timeOut) {
            var obj = document.getElementById(id);
            if (!this.isNull(obj)) {
                if (isFirstClip) {
                    width = parseInt(obj.style.width, 10);
                    height = parseInt(obj.style.height, 10);
                    clipWidthSpace = width * 0.05;
                    clipHeightSpace = height * 0.05;
                    clipTop = 0;
                    clipRight = width;
                    clipBottom = height;
                    clipLeft = 0;
                    isFirstClip = false;
                }
                if (clipTop < clipBottom) {
                    obj.style.clip = "rect(" + clipTop + "," + clipRight + "," + clipBottom + "," + clipLeft + ")";
                    obj.style.display = "";
                    clipTop = clipTop + clipHeightSpace;
                    clipRight = clipRight - clipWidthSpace;
                    clipBottom = clipBottom - clipHeightSpace;
                    clipLeft = clipLeft + clipWidthSpace;
                    window.setTimeout(function() {
                        util.closeClipDiv(obj.id, timeOut)
                    }, timeOut)
                } else {
                    clipTop = 0;
                    clipRight = 0;
                    clipBottom = 0;
                    clipLeft = 0;
                    obj.style.clip = "rect(" + clipTop + "," + clipRight + "," + clipBottom + "," + clipLeft + ")";
                    isFirstClip = true;
                }
            }
        }
        //==========================================================================================//	

}


/***************************************************Map对像****************************************************/
/**
 * Map类
 * @author weiys
 */
var Map = function() {

    var arr = new Array();
    /**
     * 栈中对像个数
     */
    this.size = function() {
            return arr.length;
        }
        /**
         * 清空栈
         */
    this.clear = function() {
            arr = new Array();
        }
        /**
         * 判断栈中是否存在key的对像
         * @key
         */
    this.contain = function(key) {
            var flag = false;
            if (this.size() > 0) {
                for (var i = 0; i < this.size(); i++) {
                    if (arr[i].key == key) {
                        flag = true;
                        break;
                    }
                }
            }
            return flag;
        }
        /**
         * 往栈中添加一个对像(栈中已存在则替换掉)
         * @key
         * @value
         */
    this.put = function(key, value) {
            if (!util.isNull(key) && !util.isNull(value)) {
                var obj = new Object();
                obj.key = key;
                obj.value = value;
                if (this.size() == 0) {
                    arr[arr.length] = obj;
                } else {
                    var i = 0;
                    for (i = 0; i < this.size(); i++) {
                        if (key == arr[i].key) {
                            break;
                        }
                    }
                    if (i == this.size()) {
                        arr[arr.length] = obj;
                    } else {
                        arr[i] = obj;
                    }
                }
            }
        }
        /**
         * 从栈中取一个指定key的对像,返回value的值
         * @key
         */
    this.get = function(key) {
            var value = null;
            if (!util.isNull(key) && this.size() > 0) {
                for (var i = 0; i < this.size(); i++) {
                    if (key == arr[i].key) {
                        value = arr[i].value;
                        break;
                    }
                }
            }
            return value;
        }
        /**
         * 从栈中取一个指定索引的对像(返回一个对像包括：obj.key,obj.value)
         * @index
         */
    this.getByIndex = function(index) {
            var obj = null;
            if (this.size() > 0 && index < this.size()) {
                obj = arr[index];
            }
            return obj;
        }
        /**
         * 从栈中删除一个指定KEY的对象
         * @key
         */
    this.deleteBykey = function(key) {
        if (this.contain(key)) {
            var tempArr = new Array;
            for (var i = 0; i < this.size(); i++) {
                if (key != arr[i].key) {
                    tempArr[tempArr.length] = arr[i];
                }
            }
            arr = tempArr;
        }
    }
}

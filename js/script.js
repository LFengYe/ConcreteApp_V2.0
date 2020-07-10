/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var winWidth = 0;
var winHeight = 0;
function findDimensions() {
    if (window.innerWidth) {
        winWidth = window.innerWidth;
    } else if ((document.body) && (document.body.clientWidth)) {
        winWidth = document.body.clientWidth;
    }
    if (window.innerHeight) {
        winHeight = window.innerHeight;
    } else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight;
    }
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }

    if ($(".wc-wc-menu-parent")) {
        $(".wc-wc-menu-parent").css("height", winHeight - 80);
    }
    if ($(".wc-menu")) {
        $(".wc-menu").css("height", winHeight - 120);
    }
    /*
    if ($(".wc-page")) {
        $(".wc-page").css("height", winHeight - 60);
    }
    */
}

function getRootPath() {
    //获取当前网址
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录
    var pathName = window.document.location.pathname;

    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址
    var localhostPath = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);

    return(localhostPath + projectName);
}

function getCarYearCode(year) {
    var code = ["A ", "B ", "C ", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "V", "W", "X", "Y", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return code[(year - 1980) % 30];
}

function deepCopy(source) {
    var result = {};
    for (var key in source) {
        result[key] = typeof source[key] === 'object' ? deepCoyp(source[key]) : source[key];
    }
    return result;
}

function compareFunc(param1, param2) {
    var value1 = Number(param1);
    var value2 = Number(param2);
    if (!isNaN(value1) && !isNaN(value2)) {
        return value1 - value2;
    } else {
        return param1.localeCompare(param2);
    }
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r !== null)
        return unescape(r[2]);
    return null; //返回参数值
}

//JQuery printArea插件, 打印div内容
function printReport(divId, options) {
    $("#" + divId).css({
        "height": "auto"
        , "overflow": "visible"
    }).printArea(options);
}

//获取当前日期的下一年
function getNextYear() {
    var t = new Date();
    var nextYear = [t.getFullYear() + 1, t.getMonth() + 1, t.getDate()].join("-");
    return nextYear;
}
//获取客户端当前日期
function getNowDate() {
    var t = new Date;
    var nowDate = [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('-');
    nowDate += ' 00:00';
    return nowDate;
}
//获取客户端当前日期
function getNowDateShort() {
    var t = new Date;
    var nowDate = [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('-');
    return nowDate;
}
//获取昨天日期
function getYesterday() {
    var t = new Date;
    t.setDate(t.getDate() - 1);
    var nowDate = [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('-');
    return nowDate;
}

function getPreCarryOverDate() {
    var t = new Date;
    var nowDate = [t.getFullYear(), t.getMonth(), 28].join('-');
    return nowDate;
}
//getMaxDate生成客户端本地时间
function getMaxDate() {
    var t = new Date();
    var maxDate = [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('-');
    maxDate += ' ' + [t.getHours(), t.getMinutes(), t.getSeconds()].join(":");
    return maxDate;
}
//getMinDate生成客户端本地时间
function getMinDate() {
    var t = new Date();
    t.setMonth(t.getMonth() - 2);//最小时间少2个月
    var maxDate = [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('-');
    maxDate += ' ' + [t.getHours(), t.getMinutes()].join(":");
    //alert(maxDate);
    return maxDate;
}
///字符串转日期
function stringToDate(strDate) {
    var fullDate = strDate.split(" ")[0].split("-");

    var fullTime = strDate.split(" ")[1].split(":");

    return new Date(fullDate[0], fullDate[1] - 1, fullDate[2], (fullTime[0] != null ? fullTime[0] : 0), (fullTime[1] != null ? fullTime[1] : 0), (fullTime[2] != null ? fullTime[2] : 0));
}

function serializeJqueryElement(jqEl) {
    //console.log(jqEl);
    var elements = jqEl.find("input");
    var queryComponents = new Array();
    //console.log(elements);
    for (var i = 0; i < elements.length; i++) {
        var queryComponent = serializeElement(elements[i]);
        if (queryComponent)
            queryComponents.push(queryComponent);
    }
    return '{' + queryComponents.join(',') + '}';
}

///////获取指定form中的所有的<input>对象/////////
function getElements(formId) {
    var form = document.getElementById(formId);
    var elements = new Array();
    var tagElements = form.getElementsByTagName('input');
    for (var j = 0; j < tagElements.length; j++)
        elements.push(tagElements[j]);
    return elements;
}

function inputSelector(element) {
    if (element.checked)
        return [element.name, element.value];
    else
        return false;
}

function input(element) {
    switch (element.type.toLowerCase()) {
        case 'submit':
        case 'hidden':
        case 'password':
        case 'text':
            return [element.name, element.value];
        case 'checkbox':
        case 'radio':
            return inputSelector(element);
    }
    return false;
}

function serializeElement(element) {
    var method = element.tagName.toLowerCase();
    var parameter = input(element);
    if (parameter) {
        var key = (parameter[0]);
        if (key.length == 0)
            return null;

        if (parameter[1].constructor != Array)
            parameter[1] = [parameter[1]];

        var values = parameter[1];
        var results = [];
        var results;
        for (var i = 0; i < values.length; i++) {
            results.push('"' + key + '":"' + (values[i] + '"'));
        }
        return results.join(',');
    } else {
        return null;
    }
}

function serializeForm(formId) {
    var elements = getElements(formId);
    var queryComponents = new Array();

    for (var i = 0; i < elements.length; i++) {
        var queryComponent = serializeElement(elements[i]);
        if (queryComponent)
            queryComponents.push(queryComponent);
    }
    return '{' + queryComponents.join(',') + '}';
}

function getXMLHttpRequest() {
    var request = false;
    try {
        request = new XMLHttpRequest();
    } catch (trymicrosoft) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (othermicrosoft) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (failed) {
                request = false;
            }
        }
    }
    return request;
}

//清空form选择
function clearForm(formId) {
    var formObj = document.getElementById(formId);
    if (formObj == undefined) {
        return;
    }
    for (var i = 0; i < formObj.elements.length; i++) {
        if (formObj.elements[i].type == "text") {
            formObj.elements[i].value = "";
        } else if (formObj.elements[i].type == "hidden") {
            formObj.elements[i].value = "";
        } else if (formObj.elements[i].type == "password") {
            formObj.elements[i].value = "";
        } else if (formObj.elements[i].type == "radio") {
            formObj.elements[i].checked = false;
        } else if (formObj.elements[i].type == "checkbox") {
            formObj.elements[i].checked = false;
        } else if (formObj.elements[i].type == "file") {
            //formObj.elements[i].select();
            //document.selection.clear();
            // for IE, Opera, Safari, Chrome
            var file = formObj.elements[i];
            if (file.outerHTML) {
                file.outerHTML = file.outerHTML;
            } else {
                file.value = ""; // FF(包括3.5)
            }
        } else if (formObj.elements[i].type == "textarea") {
            formObj.elements[i].value = "";
        }
    }
}

/**
 * 清空form表单, 除hidden外
 * @param {type} formId
 * @returns {undefined}
 */
function clearFormExceptHidden(formId) {
    var formObj = document.getElementById(formId);
    if (formObj == undefined) {
        return;
    }
    for (var i = 0; i < formObj.elements.length; i++) {
        if (formObj.elements[i].type == "text") {
            formObj.elements[i].value = "";
        } else if (formObj.elements[i].type == "hidden") {
            formObj.elements[i].value = "";
        } else if (formObj.elements[i].type == "password") {
            formObj.elements[i].value = "";
        } else if (formObj.elements[i].type == "radio") {
            formObj.elements[i].checked = false;
        } else if (formObj.elements[i].type == "checkbox") {
            formObj.elements[i].checked = false;
        } else if (formObj.elements[i].type == "file") {
            //formObj.elements[i].select();
            //document.selection.clear();
            // for IE, Opera, Safari, Chrome
            var file = formObj.elements[i];
            if (file.outerHTML) {
                file.outerHTML = file.outerHTML;
            } else {
                file.value = ""; // FF(包括3.5)
            }
        } else if (formObj.elements[i].type == "textarea") {
            formObj.elements[i].value = "";
        }
    }
}
//将时间（分钟数）转换成为字符串
function timeToString(time) {
    //var dayBase = 1440;//一天1440分钟(60 * 24)
    var timeStr = "";
    var temp = parseInt(time / 1440);
    if (temp > 0) {
        timeStr += temp + "天";
    }

    time = (time - 1440 * temp);
    temp = parseInt(time / 60);
    if (temp > 0) {
        timeStr += temp + "小时";
    }

    time = (time - 60 * temp);
    temp = parseInt(time);
    if (temp > 0) {
        timeStr += temp + "分";
    }
    return timeStr;
}
//将时间（秒数）转换成为字符串
function secondTimeToString(secondTime) {
    var timeStr = "";
    var temp = parseInt(secondTime / 86400);
    if (temp > 0) {
        timeStr += temp + "天";
    }

    secondTime = (secondTime - 86400 * temp);
    temp = parseInt(secondTime / 3600);
    if (temp > 0) {
        timeStr += temp + "小时";
    }

    secondTime = (secondTime - 3600 * temp);
    temp = parseInt(secondTime / 60);
    if (temp > 0) {
        timeStr += temp + "分";
    }

    secondTime = (secondTime - 60 * temp);
    temp = parseInt(secondTime);
    timeStr += temp + "秒";
    return timeStr;
}
//获取元素的纵坐标（相对于窗口）
function getTop(e) {
    var offset = e.offsetTop;
    if (e.offsetParent != null)
        offset += getTop(e.offsetParent);
    return offset;
}
//获取元素的横坐标（相对于窗口）
function getLeft(e) {
    var offset = e.offsetLeft;
    if (e.offsetParent != null)
        offset += getLeft(e.offsetParent);
    return offset;
}

Date.prototype.format = function(format) {
       var date = {
              "M+": this.getMonth() + 1,
              "d+": this.getDate(),
              "h+": this.getHours(),
              "m+": this.getMinutes(),
              "s+": this.getSeconds(),
              "q+": Math.floor((this.getMonth() + 3) / 3),
              "S+": this.getMilliseconds()
       };
       if (/(y+)/i.test(format)) {
              format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
       }
       for (var k in date) {
              if (new RegExp("(" + k + ")").test(format)) {
                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
              }
       }
       return format;
}
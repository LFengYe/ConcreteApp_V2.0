/**
 * 参考文档：http://ask.dcloud.net.cn/article/431
 * 升级文件为JSON格式数据，如下：
 * 
 * 需升级
 {
	"status":1,
	"version": "2.6.0",
	"title": "Hello MUI版本更新",
	"note": "修复“选项卡+下拉刷新”示例中，某个选项卡滚动到底时，会触发所有选项卡上拉加载事件的bug；\n修复Android4.4.4版本部分手机上，软键盘弹出时影响图片轮播组件，导致自动轮播停止的bug；",
	"url": "http://www.dcloud.io/hellomui/HelloMUI.apk"
}
*
* 无需升级
{"status":0}
 */

function update() {
	var updateObj = {
		module: "update",
		operation: "app",
		appid: plus.runtime.appid,
		version: plus.runtime.version,
		imei: plus.device.imei
	};
	mui.ajax(app.getUrl() + "action.do", {
		data: JSON.stringify(updateObj),
		dataType: "json",
		type: "post",
		success: function(data) {
			if(data.status == 0) {
				var versionInfo = JSON.parse(data.data).datas[0];
				if(versionInfo) {
					console.log(plus.runtime.version + ",versionName:" + versionInfo.versionName);
					if(plus.runtime.version != versionInfo.versionName) {
						plus.nativeUI.confirm(versionInfo.updateMessage, function(event) {
							if(0 == event.index) {
								plus.runtime.openURL(versionInfo.updateUrl);
							}
						}, "版本更新", ["立即更新", "取　　消"]);
					}
				}
			} else {
				plus.nativeUI.toast(data.message);
			}
		}
	});
}

//mui.os.plus && !mui.os.stream && mui.plusReady(update);
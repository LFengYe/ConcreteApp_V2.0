/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {

	owner.getUrl = function() {
		// return "http://192.168.2.140:8080/Concrete/";
		
		var settingsText = localStorage.getItem('$settings') || "{}";
		var settings = JSON.parse(settingsText);
		if (settings.server) {
			return settings.server; 
		}
		return "http://221.236.155.202:8004/Concrete/";
	}

	owner.request_old = function(action, obj, successCallback, failCallback) {
		// console.log(JSON.stringify(obj));
		//console.log(app.getUrl());
		$.ajax(app.getUrl() + action, {
			data: JSON.stringify(obj),
			dataType: "json",
			type: "post",
			success: function(data) {
				console.log(data);
				if(data) {
					if(data.message) {
						plus.nativeUI.toast(data.message);
					}
					if(data.status == 0) {
						successCallback(data.data);
					} else {
						failCallback();
					}
				} else {
					failCallback();
				}
			},
			error: function(xhr, type, error) {
				$.toast('请求失败!' + type);
				failCallback();
			}
		});
	}
	
	owner.request = function(action, obj, successCallback, failCallback) {
		// console.log("Request Data:" + JSON.stringify(obj));
		var xhr = new plus.net.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			switch(xhr.readyState) {
				case 4: {
					if (xhr.status == 200) {
						// console.log("Response Data:" + xhr.responseText);
						var data = JSON.parse(xhr.responseText);
						if(data) {
							if(data.message) {
								plus.nativeUI.toast(data.message);
							}
							if(data.status == 0) {
								successCallback(data.data);
							} else {
								failCallback();
							}
						} else {
							failCallback();
						}
					} else {
						$.toast('请求失败!');
						failCallback();
					}
					break;
				}
				default: {
					break;
				}
			}
		};
		xhr.responseType = "json";
		xhr.open( "POST", app.getUrl() + action);
		xhr.send(JSON.stringify(obj));
	}

	owner.openUrl = function(url) {
		setTimeout(function() {
			$.openWindow({
				url: url,
				id: url,
				createNew: true,
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});
		}, 1000);
	};

	owner.openUrlNoTimeOut = function(url) {
		$.openWindow({
			url: url,
			id: url,
			createNew: true,
			show: {
				aniShow: 'pop-in'
			},
			styles: {
				popGesture: 'hide'
			},
			waiting: {
				autoShow: false
			}
		});
	};

	owner.openUrlNoTimeOutWithParams = function(url, params) {
		$.openWindow({
			url: url,
			id: url,
			extras: params,
			createNew: true,
			show: {
				aniShow: 'pop-in'
			},
			styles: {
				popGesture: 'hide'
			},
			waiting: {
				autoShow: false
			}
		});
	};

	owner.getCurLocation = function() {
		var curLocal = localStorage.getItem('curLocation');
		return JSON.parse(curLocal);
	}

	owner.setCurLocation = function(latitude, longitude, type) {
		var curLocal = {
			latitude: latitude,
			longitude: longitude,
			type: type
		}
		localStorage.setItem("curLocation", JSON.stringify(curLocal));
	}

	var checkPhone = function(phone) {
		phone = phone || '';
		return(/^1(3|4|5|7|8)\d{9}$/.test(phone));
	}

	var checkEmail = function(email) {
		email = email || '';
		return(email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if(!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
	
	//过期时间与当前时间的天数差
	owner.expiredDay = function(expiredDate) {
		var date = new Date(expiredDate.replace(/-/g, "/"));
		var now = new Date();
		var diffTime = date.getTime() - now.getTime();
		return parseInt(diffTime / 1000 * 60 * 60 * 24);
	}

}(mui, window.app = {}));
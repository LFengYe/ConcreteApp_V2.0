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
	};

	owner.request_old = function(action, obj, successCallback, failCallback) {
		// console.log(JSON.stringify(obj));
		//console.log(app.getUrl());
		$.ajax(app.getUrl() + action, {
			data: JSON.stringify(obj),
			dataType: "json",
			type: "post",
			success: function(data) {
				//console.log(data);
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
	};
	
	owner.request = function(action, obj, successCallback, failCallback) {
		console.log("Request Data:" + JSON.stringify(obj));
		var xhr = new plus.net.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			switch(xhr.readyState) {
				case 4: {
					if (xhr.status == 200) {
						console.log("Response Data:" + xhr.responseText);
						var data = JSON.parse(xhr.responseText);
						if(data) {
							if(data.message) {
								//plus.nativeUI.toast(data.message);
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
	};

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
	};

	owner.setCurLocation = function(latitude, longitude, type) {
		var curLocal = {
			latitude: latitude,
			longitude: longitude,
			type: type
		}
		localStorage.setItem("curLocation", JSON.stringify(curLocal));
	};

	var checkPhone = function(phone) {
		phone = phone || '';
		return(/^1(3|4|5|7|8)\d{9}$/.test(phone));
	};

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
	};

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
	};
	
	//过期时间与当前时间的天数差
	owner.expiredDay = function(expiredDate) {
		var date = new Date(expiredDate.replace(/-/g, "/"));
		var now = new Date();
		var diffTime = date.getTime() - now.getTime();
		//console.log(diffTime);
		return parseInt(diffTime / (1000 * 60 * 60 * 24));
	};
	
	var transformlat = function transformlat(lng, lat) {
		var lat = +lat;
		var lng = +lng;
		var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
		ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
		ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
		return ret
	};
	 
	var transformlng = function transformlng(lng, lat) {
		var lat = +lat;
		var lng = +lng;
		var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
		ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
		ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
		return ret
	};
 
	/**
	 * 判断是否在国内，不在国内则不做偏移
	 * @param lng
	 * @param lat
	 * @returns {boolean}
	 */
	var out_of_china = function out_of_china(lng, lat) {
		var lat = +lat;
		var lng = +lng;
		// 纬度3.86~53.55,经度73.66~135.05 
		return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
	};
	
	//定义一些常量
	var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
	var PI = 3.1415926535897932384626;
	var a = 6378245.0;
	var ee = 0.00669342162296594323;
	/**
	 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
	 * 即 百度 转 谷歌、高德
	 * @param bd_lon
	 * @param bd_lat
	 * @returns {*[]}
	 */
	owner.bd09togcj02 = function bd09togcj02(bd_lon, bd_lat) {
		var bd_lon = +bd_lon;
		var bd_lat = +bd_lat;
		var x = bd_lon - 0.0065;
		var y = bd_lat - 0.006;
		var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
		var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
		var gg_lng = z * Math.cos(theta);
		var gg_lat = z * Math.sin(theta);
		return {
			lng:gg_lng,
			lat:gg_lat
		}
	};
 
	/**
	 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
	 * 即谷歌、高德 转 百度
	 * @param lng
	 * @param lat
	 * @returns {*[]}
	 */
	owner.gcj02tobd09 = function gcj02tobd09(lng, lat) {
		var lat = +lat;
		var lng = +lng;
		var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
		var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
		var bd_lng = z * Math.cos(theta) + 0.0065;
		var bd_lat = z * Math.sin(theta) + 0.006;
		return {
			lng:bd_lng,
			lat:bd_lat
		}
	};
 
	/**
	 * WGS84转GCj02
	 * @param lng
	 * @param lat
	 * @returns {*[]}
	 */
	owner.wgs84togcj02 = function wgs84togcj02(lng, lat) {
		var lat = +lat;
		var lng = +lng;
		if(out_of_china(lng, lat)) {
			return [lng, lat]
		} else {
			var dlat = transformlat(lng - 105.0, lat - 35.0);
			var dlng = transformlng(lng - 105.0, lat - 35.0);
			var radlat = lat / 180.0 * PI;
			var magic = Math.sin(radlat);
			magic = 1 - ee * magic * magic;
			var sqrtmagic = Math.sqrt(magic);
			dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
			dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
			var mglat = lat + dlat;
			var mglng = lng + dlng;
			return {
				lng: mglng,
				lat: mglat
			}
		}
	};
 
	/**
	 * GCJ02 转换为 WGS84
	 * @param lng
	 * @param lat
	 * @returns {*[]}
	 */
	owner.gcj02towgs84 = function gcj02towgs84(lng, lat) {
		var lat = +lat;
		var lng = +lng;
		if(out_of_china(lng, lat)) {
			return [lng, lat]
		} else {
			var dlat = transformlat(lng - 105.0, lat - 35.0);
			var dlng = transformlng(lng - 105.0, lat - 35.0);
			var radlat = lat / 180.0 * PI;
			var magic = Math.sin(radlat);
			magic = 1 - ee * magic * magic;
			var sqrtmagic = Math.sqrt(magic);
			dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
			dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
			var mglat = lat + dlat;
			var mglng = lng + dlng;
			return {
				lng:lng * 2 - mglng,
				lat:lat * 2 - mglat
			}
		}
	};

}(mui, window.app = {}));
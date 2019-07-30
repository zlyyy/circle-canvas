//封装一个网络请求的对象，方便做统一的处理,axios做请求，polyfill保证兼容性
window.yyoyu = {
	webapi: {
		//统一的请求处理
		tryAjax: function(url, action, par, onsuccess, onerror, showing){
			var params = par;
			if(showing){
				yyoyu.showLoading();
			}
			axios({
		  		method: action,
		  		url: url,
		  		timeout: 5000,
		  		responseType: 'json',
		  		params: params,
			}).then(function (response) {
				if(showing){
					yyoyu.hideLoading();
				}
				//网络请求成功了，业务请求有没有成功由上层判断
				if(onsuccess){
					onsuccess(response.data);
				}
		     	console.log('axios='+JSON.stringify(response.data));
			}).catch(function (response) {
				if(showing){
					yyoyu.hideLoading();
				}
				//网络请求失败了
		    		if (response instanceof Error) {
		      		// Something happened in setting up the request that triggered an Error
		      		console.log('Error', response.message);
		    		} else {
		      		// The request was made, but the server responded with a status code
		      		// that falls out of the range of 2xx
		      		console.log(response.data);
		      		console.log(response.status);
		      		console.log(response.statusText);
		      		console.log(response.headers);
		      		console.log(response.config);
		    		}
		    		//网络不给力，请检查网络！
				console.log("网络不给力，请检查网络！");
				if(onerror){
					//就认为网络不可达，不用具体分析什么原因导致的
					onerror();
				}
			});
		},
		tryAjax2: function(url, action, par, onsuccess, onerror, showing){
			axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
			var params = par;
			if(showing){
				yyoyu.showLoading();
			}
			axios({
		  		method: action,
		  		url: url,
		  		timeout: 5000,
		  		responseType: 'json',
		  		data: params,
			}).then(function (response) {
				if(showing){
					yyoyu.hideLoading();
				}
				//网络请求成功了，业务请求有没有成功由上层判断
				if(onsuccess){
					onsuccess(response.data);
				}
		     	console.log('axios='+JSON.stringify(response.data));
			}).catch(function (response) {
				if(showing){
					yyoyu.hideLoading();
				}
				//网络请求失败了
		    		if (response instanceof Error) {
		      		// Something happened in setting up the request that triggered an Error
		      		console.log('Error', response.message);
		    		} else {
		      		// The request was made, but the server responded with a status code
		      		// that falls out of the range of 2xx
		      		console.log(response.data);
		      		console.log(response.status);
		      		console.log(response.statusText);
		      		console.log(response.headers);
		      		console.log(response.config);
		    		}
		    		//网络不给力，请检查网络！
				console.log("网络不给力，请检查网络！");
				if(onerror){
					//就认为网络不可达，不用具体分析什么原因导致的
					onerror();
				}
			});
		},
		subscribe: {
			jsapi_ticket: function(params, onsuccess, onerror, showing){
				var url = 'http://one.dydigit.com/henan_jh/weixin/get-signature';
				yyoyu.webapi.tryAjax(url, 'get', params, onsuccess, onerror, showing);
			},
			getVisitCounts: function(onsuccess, onerror, showing){
				var url = 'http://116.62.170.104:10088/yang/getCounts?ts='+new Date().getTime();
				yyoyu.webapi.tryAjax(url, 'get', {}, onsuccess, onerror, showing);
			},
			getPercentage: function(onsuccess, onerror, showing){
				var url = 'http://116.62.170.104:10088/yang/getPercentage?ts='+new Date().getTime();
				yyoyu.webapi.tryAjax(url, 'get', {}, onsuccess, onerror, showing);
			},
			postInfo: function(params, onsuccess, onerror, showing){
				var url = 'http://116.62.170.104:10088/yang/postInfo';
				yyoyu.webapi.tryAjax(url, 'get', params, onsuccess, onerror, showing);
			},
			postZuoPin: function(params, onsuccess, onerror, showing){
				var url = 'http://116.62.170.104:10088/yang/postzuopin';
				yyoyu.webapi.tryAjax2(url, 'post', params, onsuccess, onerror, showing);
			},
			getZuoPin: function(params, onsuccess, onerror, showing){
				var url = 'http://116.62.170.104:10088/yang/getzuopin';
				yyoyu.webapi.tryAjax(url, 'get', params, onsuccess, onerror, showing);
			},
		}
	},
	//网络请求加载
	showLoading:	 function(){
		if(document.getElementById('youyu_loading')){
			//已经有loading了，就不重复显示了
		}else{
			var imgsrc = 'http://flb-online.oss-cn-hangzhou.aliyuncs.com/loading.gif';
			//否则加一个loading
			var htmlstr = '<div id="youyu_loading" style="font-size: 0;position: absolute;bottom: 0;top: 0;width: 100%;z-index: 99999999;text-align: center;vertical-align: middle;"><div style="font-size: 0;height: 100%;position: relative;"><img style="width: 0.6rem;position: relative;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);" src="'+imgsrc+'"/></div></div>';
			document.body.insertAdjacentHTML('beforeend', htmlstr);
		}
	},
	hideLoading: function(){
		var youyu_loading = document.getElementById('youyu_loading');
		if(youyu_loading){
			document.body.removeChild(youyu_loading);
		}
	}
}

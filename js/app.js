//一些通用的方法，比如toast之类，最后发布的时候做压缩，甚至可以直接加到html文件中，减少下载
(function(app) {
	
	//只能在微信浏览器中打开
	var ua = navigator.userAgent.toLowerCase();
	var isWeixin = ua.indexOf('micromessenger') != -1;
	if (!isWeixin) {
		//window.location.replace("./error.html");	
	}
	
	//layer模块
	/*! layer mobile-v2.0 弹层组件移动版 License LGPL http://layer.layui.com/mobile By 贤心 */
	;!function(a){"use strict";var b=document,c="querySelectorAll",d="getElementsByClassName",e=function(a){return b[c](a)},f={type:0,shade:!0,shadeClose:!0,fixed:!0,anim:"scale"},g={extend:function(a){var b=JSON.parse(JSON.stringify(f));for(var c in a)b[c]=a[c];return b},timer:{},end:{}};g.touch=function(a,b){a.addEventListener("click",function(a){b.call(this,a)},!1)};var h=0,i=["layui-m-layer"],j=function(a){var b=this;b.config=g.extend(a),b.view()};j.prototype.view=function(){var a=this,c=a.config,f=b.createElement("div");a.id=f.id=i[0]+h,f.setAttribute("class",i[0]+" "+i[0]+(c.type||0)),f.setAttribute("index",h);var g=function(){var a="object"==typeof c.title;return c.title?'<h3 style="'+(a?c.title[1]:"")+'">'+(a?c.title[0]:c.title)+"</h3>":""}(),j=function(){"string"==typeof c.btn&&(c.btn=[c.btn]);var a,b=(c.btn||[]).length;return 0!==b&&c.btn?(a='<span yes type="1">'+c.btn[0]+"</span>",2===b&&(a='<span no type="0">'+c.btn[1]+"</span>"+a),'<div class="layui-m-layerbtn">'+a+"</div>"):""}();if(c.fixed||(c.top=c.hasOwnProperty("top")?c.top:100,c.style=c.style||"",c.style+=" top:"+(b.body.scrollTop+c.top)+"px"),2===c.type&&(c.content='<i></i><i class="layui-m-layerload"></i><i></i><p>'+(c.content||"")+"</p>"),c.skin&&(c.anim="up"),"msg"===c.skin&&(c.shade=!1),f.innerHTML=(c.shade?"<div "+("string"==typeof c.shade?'style="'+c.shade+'"':"")+' class="layui-m-layershade"></div>':"")+'<div class="layui-m-layermain" '+(c.fixed?"":'style="position:static;"')+'><div class="layui-m-layersection"><div class="layui-m-layerchild '+(c.skin?"layui-m-layer-"+c.skin+" ":"")+(c.className?c.className:"")+" "+(c.anim?"layui-m-anim-"+c.anim:"")+'" '+(c.style?'style="'+c.style+'"':"")+">"+g+'<div class="layui-m-layercont">'+c.content+"</div>"+j+"</div></div></div>",!c.type||2===c.type){var k=b[d](i[0]+c.type),l=k.length;l>=1&&layer.close(k[0].getAttribute("index"))}document.body.appendChild(f);var m=a.elem=e("#"+a.id)[0];c.success&&c.success(m),a.index=h++,a.action(c,m)},j.prototype.action=function(a,b){var c=this;a.time&&(g.timer[c.index]=setTimeout(function(){layer.close(c.index)},1e3*a.time));var e=function(){var b=this.getAttribute("type");0==b?(a.no&&a.no(),layer.close(c.index)):a.yes?a.yes(c.index):layer.close(c.index)};if(a.btn)for(var f=b[d]("layui-m-layerbtn")[0].children,h=f.length,i=0;h>i;i++)g.touch(f[i],e);if(a.shade&&a.shadeClose){var j=b[d]("layui-m-layershade")[0];g.touch(j,function(){layer.close(c.index,a.end)})}a.end&&(g.end[c.index]=a.end)},a.layer={v:"2.0",index:h,open:function(a){var b=new j(a||{});return b.index},close:function(a){var c=e("#"+i[0]+a)[0];c&&(c.innerHTML="",b.body.removeChild(c),clearTimeout(g.timer[a]),delete g.timer[a],"function"==typeof g.end[a]&&g.end[a](),delete g.end[a])},closeAll:function(){for(var a=b[d](i[0]),c=0,e=a.length;e>c;c++)layer.close(0|a[0].getAttribute("index"))}},"function"==typeof define?define(function(){return layer}):function(){var a=document.scripts,c=a[a.length-1],d=c.src,e=d.substring(0,d.lastIndexOf("/")+1);c.getAttribute("merge")||document.head.appendChild(function(){var a=b.createElement("link");return a.href=e+"need/layer.css?2.0",a.type="text/css",a.rel="styleSheet",a.id="layermcss",a}())}()}(window);
	
	//首先是autoresize模块
	function BaseDesign(){
		this.width = 850;
		this.fontSize = 100;
	}
	BaseDesign.prototype.renderDOM = function(){
		var _self = this;
	    _self.width = this.width;//设置默认最大宽度
	    _self.fontSize = this.fontSize;//默认字体大小
		_self.widthProportion = function(){var p = (document.body&&document.body.clientWidth||document.getElementsByTagName("html")[0].offsetWidth)/_self.width;
		return p>1?1:p;
		};
		_self.changePage = function(){
		document.getElementsByTagName("html")[0].setAttribute("style","font-size:"+_self.widthProportion()*_self.fontSize+"px !important");
		}
		_self.changePage();
		window.addEventListener('resize',function(){_self.changePage();},false);
	};
	var baseDesign = new BaseDesign();
	baseDesign.renderDOM();
	
	//在微信中禁止调整字体大小
	if(typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
	　handleFontSize();
	}else{
	　if(document.addEventListener) {
	　　document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
	　}else if(document.attachEvent) {
	　　document.attachEvent("WeixinJSBridgeReady", handleFontSize);
	　　document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
	　}
	}
	
	function handleFontSize() {
		//设置网页字体为默认大小
	　WeixinJSBridge.invoke('setFontSizeCallback', {
	　　	'fontSize': 0
	　});
		//重写设置网页字体大小的事件
	　WeixinJSBridge.on('menu:setfont', function () {
	　　WeixinJSBridge.invoke('setFontSizeCallback', {
	　　　'fontSize': 0
	　　});
	　});
	}
	
	//常用方法
	//借助layer弹出toast
	app.showToast = function(content){
	   layer.open({
	       content: content,
	       time: 2,
	       skin: 'msg',
    	   });
  	}
	
	app.showDialog = function(content, callback){
	   layer.open({
	       content: content,
	       btn: '好的',
	       yes: function(index){
	       		if(callback){
	       			callback();
	       		}
		   }
    	   });
  	}
   
   //可共存的toast
   app.showToast2 = function(content){
	   layer.open({
	       content: content,
	       time: 2,
	       skin: 'msg',
	       type: 1
    	   });
   }
   
   //怕网络不好，切换页面很慢，卡在那里，所以给页面切换加一个动画
   app.switchPage = function(toUrl){
   		//先给一个loading页面，然后300ms之后切换指定页面
		layer.open({
		    type: 2,
		    content: '加载中...'
		  });
		  setTimeout(function(){
		  		window.location.href = toUrl;
		  }, 300);
   }  
   
   /**
	 *  js 获取url 的参数
	 * @param {Object} variable
	 */
	app.getQueryVariable = function(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for(var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable) {
				return pair[1];
			}
		}
		return null;
	}

    app.isMobile = function(sMobile){
        if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(sMobile))){
            return false;
        } else {
        	return true;
		}
    }
    
    //这里用到html5的history.state来保存前一个页面的状态，以回到上一个页面的时候是用户之前看到的
    //市面上的浏览器基本上都支持了这个属性
    /**
     * 这是插入一条浏览记录
     * @param {Object} data	存储的状态json数据
     */
    app.saveHistoryState = function(data){
    		if(history.pushState){
    			history.pushState(data, '', '');
    		}
    }
    
    /**
     * 这是替换当前浏览器记录
     * @param {Object} data	存储的状态json数据
     */
    app.replaceHistoryState = function(data, urlstr){
    		if(history.pushState){
    			history.replaceState(data, '', urlstr);
    		}
    }
    
    /**
     * 获取当前页面的state的方法，如果为空，那么走默认的数据
     * 这里的state可以存更多的东西，比如列表的位置，请求的页数等，用来做列表定位
     */
    app.getHistoryState = function(){
    		if(history.pushState){
    			return history.state;
    		}else{
    			return null;
    		}
    }
    
    //自动登录流程
    app.autoLogin = function(locationUrl, callback){
    		var state = app.getQueryVariable('state');
    		if(!state){
    			localStorage.setItem('LOGIN_INFO_NEW', '{}');
    			localStorage.removeItem('LOGIN_INFO_NEW');
    			//第一次进来，需要走授权
    			location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=&redirect_uri="+locationUrl+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect");
    		}else{
    			var userInfo = JSON.parse(localStorage.getItem('LOGIN_INFO_NEW'));
    			if(userInfo && userInfo.uid){
    				//登录过不需要重复登录
    				callback();
    				return;
    			}
    			//授权code
    			var code = app.getQueryVariable('code');
    			console.log('code='+code);
    			//有state的话，说明拿到了授权code，需要走登录流程
    			var params = {
    				code: code,
    				appid: ''
    			};
    			yyoyu.webapi.subscribe.wxcodelogin(params, function(data){
    				//成功回调
    				//登录信息存localstorage
    				localStorage.setItem('LOGIN_INFO_NEW', JSON.stringify(data.data));
    				callback();
    			}, function(){
    				//失败回调
    				console.log('登录失败了');
    			}, true);
    		}
    }
    
    //微信SDK调用分三步
    app.initConfig = function(url, callBack) {
		var params = {
			url: url
		};
		yyoyu.webapi.subscribe.jsapi_ticket(params, function(data) {
			console.log('config='+JSON.stringify(data));
			callBack(data);
		}, function(xhr, type, errorThrown) {
			console.log('error');
		});
	}
    
    app.initShare= function(url, callback) {
		app.initConfig(url, function(data) {
			var appId = data.appId;
			var timestamp = data.timestamp;
			var nonceStr = data.noncestr;
			var signature = data.signature;
			wx.config({
				debug: false,
				appId: appId,
				timestamp: timestamp,
				nonceStr: nonceStr,
				signature: signature,
				jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'onMenuShareQZone',
					'showAllNonBaseMenuItem'
				]
			});
			wx.ready(function() {
				callback();
			});
		});
	}
    
    /**
	 * 调起支付
	 * @param {Object} url
	 * @param {Object} timestamp
	 * @param {Object} nonceStr
	 * @param {Object} packag
	 * @param {Object} signType
	 * @param {Object} paySign
	 * @param {Object} callback
	 */
	app.commonShare = function(url, title, desc, linkUrl, imgUrl) {
		app.initShare(url, function() {
			wx.onMenuShareTimeline({ //分享到朋友圈
				title: title, // 分享标题
				desc: desc,
				link: linkUrl, // 分享链接
				imgUrl: imgUrl, // 分享图标		
				success: function() {

				},
				cancel: function() {

				}
			});
			wx.onMenuShareQQ({ //分享到QQ
				title: title, // 分享标题
				desc: desc,
				link: linkUrl, // 分享链接
				imgUrl: imgUrl, // 分享图标		
				success: function() {

				},
				cancel: function() {

				}
			});

			wx.onMenuShareAppMessage({ //分享给好友
				title: title, // 分享标题
				desc: desc,
				link: linkUrl, // 分享链接
				imgUrl: imgUrl, // 分享图标		
				success: function() {

				},
				cancel: function() {

				}
			});

			wx.onMenuShareQZone({ //分享给qq空间
				title: title, // 分享标题
				desc: desc,
				link: linkUrl, // 分享链接
				imgUrl: imgUrl, // 分享图标		
				success: function() {

				},
				cancel: function() {

				}
			});

			wx.onMenuShareWeibo({ //分享到腾讯微博
				title: title, // 分享标题
				desc: desc,
				link: linkUrl, // 分享链接
				imgUrl: imgUrl, // 分享图标		
				success: function() {

				},
				cancel: function() {

				}
			});
			
			wx.showAllNonBaseMenuItem();
		});
	}

}(window.app = {}));
FastClick.attach(document.body);

var version = '1.0.6'; //发布时更新数据库的这个版本号，实现重置获奖次数和作画次数

app.commonShare(location.href, '中秋送祝福，画个月亮比比看~', '听说月亮画的圆，这个中秋会更圆满哦！', location.href, 'http://one.dydigit.com/hnjh/img/xiaoyueliang.jpg');
function showLoading(){
	document.getElementById("mask").classList.remove("display-hidden");
	if(document.getElementById('youyu_loading')){
		//已经有loading了，就不重复显示了
	}else{
		var imgsrc = './img/loading.gif';
		//否则加一个loading
		var htmlstr = '<div id="youyu_loading" style="font-size: 0;position: absolute;bottom: 0;top: 0;width: 100%;z-index: 99999999;text-align: center;vertical-align: middle;"><div style="font-size: 0;height: 100%;position: relative;"><img style="width: 1rem;position: relative;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);" src="'+imgsrc+'"/></div></div>';
		var htmlstr2 = '<div id="youyu_loading2" style="font-size: 0;position: absolute;bottom: 0;top: 0;width: 100%;z-index: 99999998;text-align: center;vertical-align: middle;"><div style="font-size: 0.5rem;color: #3c3a38;font-family: fangzhengyinlian;height: 100%;position: relative;"><div style="position: relative;top: 60%;">AI老师打分中</div></div></div>';
		document.body.insertAdjacentHTML('beforeend', htmlstr);
		document.body.insertAdjacentHTML('beforeend', htmlstr2);
	}
}
function hideLoading(){
	var youyu_loading = document.getElementById('youyu_loading');
	var youyu_loading2 = document.getElementById('youyu_loading2');
	if(youyu_loading){
		document.body.removeChild(youyu_loading);
		document.body.removeChild(youyu_loading2);
	}
	document.getElementById("mask").classList.add("display-hidden");
}
function jisuanfenshu(){
	var huacount = localStorage.getItem('hnjh_huayy_fenshu_count'+version);
	if(huacount == null){
		console.log('count is null');
		//没有存过值，第一次使用
		huacount = 0;
	}else{
		huacount = parseInt(huacount);
		console.log(huacount);
		if(parseInt(huacount) >= 8){
			//已经画过8次了
			app.showToast("您只能让AI老师评分8次哦");
			return;
		}
		
	}
	//圆太小容易得高分，所以有个限制
	var banj = banjing();
	if(banj < 40){
		app.showToast("您画的圆有点小哦，重画一个吧");
		return;
	}
	var fen = fenshu();
	if(fen == 0){
		app.showToast("您还没画呢");
		return;
	}
	showLoading();
	//1.先把份数存起来
	localStorage.setItem('hnjh_huayy_fenshu',fen);
	huacount++;
	localStorage.setItem('hnjh_huayy_fenshu_count'+version,huacount);
	//2.跳转到对应的页面
	setTimeout(switchPage,2000,fen);
}

function switchPage(fenshu){
	console.log('fenshu='+fenshu);
	hideLoading();
	if(fenshu >= 90){
		//跳转page2
		window.location.href = './fenshu3.html?v=1.1.0';
	}else if(fenshu >= 85){
		//不合格的份数啊
		window.location.href = './fenshu2.html?v=1.1.0';
	}else{
		//不合格的份数啊
		window.location.href = './fenshu.html?v=1.1.0';
	}
}


var yyy = document.getElementById('xxx');
var context = yyy.getContext('2d');
var lineWidth = 5;
var selectColor = false;
var canvasTop = document.documentElement.clientWidth/850*100*1; 
var canvasLeft = document.documentElement.clientWidth/850*100*1;  
console.log('canvasTop='+canvasTop+ ' canvasLeft='+canvasLeft);
autoSetCanvasSize(yyy);

//先存四个点：
var minX = 1000000;
var minX_Y = 1000000;
var maxX = 0;
var maxX_Y = 0;
var minY = 1000000;
var minY_X = 1000000;
var maxY = 0;
var maxY_X = 0;

var xishu = 1;//难度系数

var pointArray = [];

//listenToUser(yyy);

var eraserEnabled = false;

function autoSetCanvasSize(canvas) {
  setCanvasSize()

  window.onresize = function() {
    setCanvasSize()
  }

  function setCanvasSize() {
    var pageWidth = yyy.clientWidth;
    var pageHeight = yyy.clientHeight;
	//canvas需要设置宽高值，切记
    canvas.width = pageWidth;
    canvas.height = pageHeight;
    console.log('canvas.width='+canvas.width+' canvas.height='+canvas.height);
    //draw2();
  }
}

//然后是循环画图
function draw2(pointArray2){
	var point1 = getDataCenterPoint(pointArray2);
	var point2 = getCanvasCenterPoint();
	var offX=point2.x - point1.x;
	var offY=point2.y - point1.y;
	console.log('point1='+JSON.stringify(point1)+' point2='+JSON.stringify(point2)+' offX='+offX+' offY='+offY);
	//现有数据画圆
	for(var i=0; i<pointArray2.length-1; i++){
		drawLine(pointArray2[i].x+offX, pointArray2[i].y+offY, pointArray2[i+1].x+offX, pointArray2[i+1].y+offY)
	}
}

/******/

function drawCircle(x, y, radius) {
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill()
}

function drawLine(x1, y1, x2, y2) {
	if(selectColor == false){
		context.fillStyle = '#4d5669';
  		context.strokeStyle = '#4d5669';
	}
  context.beginPath();
  context.moveTo(x1-canvasLeft, y1-canvasTop) // 起点
  context.lineWidth = lineWidth
  context.lineTo(x2-canvasLeft, y2-canvasTop) // 终点
  context.stroke()
  context.closePath()
}

function listenToUser(canvas) {


  var using = false
  var lastPoint = {
    x: undefined,
    y: undefined
  }
  // 特性检测
  if(document.body.ontouchstart !== undefined){
    // 触屏设备 苏菲就是个触屏设备啊哥
    canvas.ontouchstart = function(aaa){
      var x = aaa.touches[0].clientX
      var y = aaa.touches[0].clientY
      console.log(x,y)
      using = true
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        lastPoint = {
          "x": x,
          "y": y
        }
        if(x>maxX){
        		maxX = x;
        		maxX_Y = y;
        }
        if(x<minX){
        		minX = x;
        		minX_Y = y;
        }
        if(y>maxY){
        		maxY = y;
        		maxY_X = x;
        }
        if(y<minY){
        		minY = y;
        		minY_X = x;
        }
        pointArray.push(lastPoint);
      }
    }
    canvas.ontouchmove = function(aaa){
      console.log('边摸边动')
      var x = aaa.touches[0].clientX
      var y = aaa.touches[0].clientY

      if (!using) {return}

      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        var newPoint = {
          "x": x,
          "y": y
        }
        if(x>maxX){
        		maxX = x;
        		maxX_Y = y;
        }
        if(x<minX){
        		minX = x;
        		minX_Y = y;
        }
        if(y>maxY){
        		maxY = y;
        		maxY_X = x;
        }
        if(y<minY){
        		minY = y;
        		minY_X = x;
        }
        pointArray.push(newPoint);
        console.log('x='+x+' y='+y);
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }
      aaa.preventDefault();
    }
    canvas.ontouchend = function(){
      console.log('摸完了')
      using = false
    }
  }else{
    // 非触屏设备
    canvas.onmousedown = function(aaa) {
      var x = aaa.clientX
      var y = aaa.clientY
      using = true
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        lastPoint = {
          "x": x,
          "y": y
        }
        if(x>maxX){
        		maxX = x;
        		maxX_Y = y;
        }
        if(x<minX){
        		minX = x;
        		minX_Y = y;
        }
        if(y>maxY){
        		maxY = y;
        		maxY_X = x;
        }
        if(y<minY){
        		minY = y;
        		minY_X = x;
        }
      }
    }
    canvas.onmousemove = function(aaa) {
      var x = aaa.clientX
      var y = aaa.clientY

      if (!using) {return}

      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        var newPoint = {
          "x": x,
          "y": y
        }
        if(x>maxX){
        		maxX = x;
        		maxX_Y = y;
        }
        if(x<minX){
        		minX = x;
        		minX_Y = y;
        }
        if(y>maxY){
        		maxY = y;
        		maxY_X = x;
        }
        if(y<minY){
        		minY = y;
        		minY_X = x;
        }
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }

    }
    canvas.onmouseup = function(aaa) {
      using = false
    }
  }

}

//半径
function banjing(){
	var xDis = getDistanceTwoPoint(minX, minX_Y, maxX, maxX_Y);
	var YDis = getDistanceTwoPoint(minY, minY_X, maxY, maxY_X);
	console.log('xDis='+xDis+' YDis='+YDis+' (xDis+YDis)/4='+(xDis+YDis)/4);
	return (xDis+YDis)/4;
}

//两点之间的距离
function getDistanceTwoPoint(x1, y1, x2, y2){
	var xx = Math.abs(x1-x2);
	var yy = Math.abs(y1-y2);
	return Math.sqrt(xx*xx+yy*yy);
}

//简单的算中心点
function centerPoint(x1, y1, x2, y2, x3, y3, x4, y4){
	var x = Math.abs(x1-x2)/2 + Math.min(x1, x2);
	var y = Math.abs(y1-y2)/2 + Math.min(y1, y2);
	console.log('center.x='+x+' center.y='+y);
	var xx = Math.abs(x3-x4)/2 + Math.min(x3, x4);
	var yy = Math.abs(y3-y4)/2 + Math.min(y3, y4);
	console.log('center.xx='+xx+' center.yy='+yy);
	//再求一次这中心点
	var xxx = Math.abs(x-xx)/2 + Math.min(x, xx);
	var yyy = Math.abs(y-yy)/2 + Math.min(y, yy);
	console.log('center.xxx='+xxx+' center.yyy='+yyy);
	return {
		  "x": xxx,
          "y": yyy};
}

//计算分数
function fenshu(){
	if(pointArray.length < 10){
		return 0;
	}
	//1.求中心点
	var cPoint = centerPoint(minX, minX_Y, maxX, maxX_Y, minY_X, minY, maxY_X, maxY);
	//2.求半径
	var banj = banjing();
	//3.随机取30个点，求这30点与中心点的距离，和半径比较
	var count = 0;
	var sum = 0;
	for(var i=0; i<30; i++){
		var num=Math.floor(Math.random()*(pointArray.length));
		if(num < pointArray.length){
			var tempPoint = pointArray[num];
			//求半径
			var tempRadius = getDistanceTwoPoint(tempPoint.x, tempPoint.y, cPoint.x, cPoint.y);
			sum += Math.abs(banj-tempRadius);
			count++;
			console.log('num='+num+' banj='+banj+ 'tempRadius='+tempRadius);
		}
	}
	var chaJun = sum/count * xishu;
	var fen = 0; 
	if(chaJun < 1){
		//绝对的95分以上
		fen = Math.floor(Math.random()*5 + 95);
	}else if(chaJun < 2){
		//绝对的90分以上
		fen = Math.floor(Math.random()*5 + 90);
	}else if(chaJun < 3){
		//绝对的85分以上
		fen = Math.floor(Math.random()*5 + 85);
	}else if(chaJun < 5){
		//60到84分
		fen = Math.floor(Math.random()*24 + 60);
	}else if(chaJun < 10){
		//50到60分
		fen = Math.floor(Math.random()*10 + 50);
	}else{
		//0-50分以下
		fen = Math.floor(Math.random()*50);
	}
	console.log('chajun='+chaJun+ ' fen='+fen);
	return fen;
}

var origin_width = 0;
var origin_height = 0;

//获取作品
function getZuoPin(){
	var id = getUrlParam('id');
	if(!id){
		return;
	}
	var params = {
		id: id
	};
	yyoyu.webapi.subscribe.getZuoPin(params, function(data) {
		console.log('getZuoPin='+JSON.stringify(data));
		if(data.code == 200){
			var points = JSON.parse(data.data.data);
			selectColor = true;
			context.fillStyle = data.data.color;
  			context.strokeStyle = data.data.color;
  			origin_width = data.data.width;
  			origin_height = data.data.height;
			setTimeout(draw2, 100, points);
		}else{
			//app.showToast(data.msg);
		}
	}, function(xhr, type, errorThrown) {
		console.log('error');
	});
}

function getUrlParam(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		return unescape(r[2]);
	}
	return null;
}

getZuoPin();


//思路：找到画板的中心点，让元数据的超级中心点与画板的中心点重合，算偏移量
function getDataCenterPoint(array){
	for(var i=0; i<array.length; i++){
		if(array[i].x>maxX){
        		maxX = array[i].x;
        		maxX_Y = array[i].y;
        }
        if(array[i].x<minX){
        		minX = array[i].x;
        		minX_Y = array[i].y;
        }
        if(array[i].y>maxY){
        		maxY = array[i].y;
        		maxY_X = array[i].x;
        }
        if(array[i].y<minY){
        		minY = array[i].y;
        		minY_X = array[i].x;
        }
	}
	return centerPoint(minX, minX_Y, maxX, maxX_Y, minY_X, minY, maxY_X, maxY);
}

//画板的中心点
function getCanvasCenterPoint(){
	var x = document.documentElement.clientWidth/850*100*4.25; 
	var y = document.documentElement.clientWidth/850*100*4.5;
	return {
		"x": x,
		"y": y
	};
}

//调用这个接口
//getPercentage();





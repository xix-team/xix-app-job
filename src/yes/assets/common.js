var g = function(o) {return document.getElementById(o)};
var giftBOX = g("gift_box"),
 	gift_data = {
    touchStartX: "0",
    touchEndX: "0",
    moveX: "0",
};
var pageTurn = true;
var slideYes = function(){
	var	util = {
			fn: {}
		},
		wraperBox = $("#wraper"),
		containerBox = $("#container"),
		mainBox = $("#main"),
		mainSec = mainBox.find("section"),
		tipsBox = $("#tips"),
		screenH = $(window).height(),
		screenW = $(window).width(),
		secLen = mainSec.length,
		count_data={
		    touchStartY: 0,
		    touchEndY: 0,
		    moveY: 0,
		    nowY:0,
		    nowP:1
		};
	//根据手机分辨率设定高度，必须
	util.setHeight = function(){
		var docH = secLen*screenH;
		wraperBox.height(screenH);
		containerBox.height(docH);
		mainBox.height(docH);
		mainSec.css({"width":screenW,"height":screenH});
	}
	//下一页
	util.nextSec = function(){
		if(count_data.nowP==secLen){
	        mainBox.css("-webkit-transform", "matrix(1, 0, 0, 1, 0, "+(-screenH*(secLen-1))+")");
			count_data={
			    touchStartY: "0",
			    touchEndY: "0",
			    moveY: "0",
			    nowY:-screenH*(secLen-1),
			    nowP:secLen
			};
	    	return;
		}
		tipsBox.removeClass("tips-ani");
		count_data.nowP++;
		var pNum = count_data.nowP;
		mainBox.css("-webkit-transform", "matrix(1, 0, 0, 1, 0, "+(-screenH*(pNum-1))+")");
		$("#sec-"+pNum).addClass("sec-0"+pNum+"-show");
		$("#sec-"+(pNum-1)).removeClass("sec-0"+(pNum-1)+"-show");
		count_data={
		    touchStartY: 0,
		    touchEndY: 0,
		    moveY: 0,
		    nowY:-screenH*(pNum-1),
		    nowP:pNum
		};
	}
	//上一页
	util.prevSec = function(){
		if(count_data.nowP==1){
	        mainBox.css("-webkit-transform", "matrix(1, 0, 0, 1, 0, 0)");
			count_data={
			    touchStartY: 0,
			    touchEndY: 0,
			    moveY: 0,
			    nowY:0,
			    nowP:1
			};
			return;
		}
		tipsBox.removeClass("tips-ani");
		count_data.nowP--;
		var pNum = count_data.nowP;
	    mainBox.css("-webkit-transform", "matrix(1, 0, 0, 1, 0, "+(-screenH*(pNum-1))+")");
		$("#sec-"+pNum).addClass("sec-0"+pNum+"-show");
		$("#sec-"+(pNum+1)).removeClass("sec-0"+(pNum+1)+"-show");
		count_data={
		    touchStartY: 0,
		    touchEndY: 0,
		    moveY: 0,
		    nowY:-screenH*(pNum-1),
		    nowP:pNum
		};
	}

	//页面滑动
	util.secSlide = function(){
		var moveYcount = 0,mainP = document.getElementById("main");
		mainP.addEventListener('touchstart', function (e) {
			count_data.touchStartY = e.touches[0].clientY;
		    mainBox.addClass("ani-n");
		    //g("notie2").style.display="none";
		    //g("notie2").className="pa notie2";
		},false);
		mainP.addEventListener('touchmove', function (e) {
			//g("notie2").className="pa notie2";
			if(!pageTurn) return;
			e.preventDefault();
			if (e.targetTouches.length == 1) {
				var touch = e.changedTouches[0];
				moveYcount = touch.pageY - count_data.touchStartY;//位移
				count_data.moveY = moveYcount;
				var temp = count_data.nowY + moveYcount;
				if(count_data.nowP==1){
					pageTurn = true;
			        if(count_data.moveY<0){
						tipsBox.addClass("tips-ani");
				        tipsBox.html("亲，只能点击哦！！");
				        moveYcount = 0;
						return;
			        }
				}
				if(count_data.nowP==secLen){
			        if(count_data.moveY<0){
						tipsBox.addClass("tips-ani");
				        tipsBox.html("已经到达最后一页了啦！");
				        moveYcount = 0;
						return;
			        }
				}
		    	mainBox.css("-webkit-transform", "matrix(1, 0, 0, 1, 0, "+temp+")");
			};
			if(count_data.nowP>1){
				g("click_ico").addEventListener('click',clearZD);
				bz_num=1,zd_num=1;
				g("keyframes").style.display="none";
				g("keyframes").src=imgPath+"p1.png";
				g("sec-1").className="sec sec-1";
		        g("dhx").src=imgPath+"s1_dhx_1.png";
			};
		},false);
		mainP.addEventListener('touchend', function (e){
			//g("notie2").style.display="block";
			//g("notie2").className +=" ntfont";
		    mainBox.removeClass("ani-n");
			if(moveYcount<-50||moveYcount>50){
				if(moveYcount<-50){
					util.nextSec();
				}
				if(moveYcount>50){
					util.prevSec();
				}
			}else{
		        mainBox.css("-webkit-transform", "matrix(1, 0, 0, 1, 0, "+(-screenH*(count_data.nowP-1))+")");
			}
			count_data.touchStartY= 0;
			count_data.touchEndY = 0;
			count_data.moveY = 0;
			moveYcount = 0;
		},false);
	};
	util.setHeight();
	util.secSlide();
	var nextBtn = $(".arr");
    nextBtn.click(function(){util.nextSec();});
	//炸弹
    var dx_num=1 , bz_num=1 , oTimer1=null , oTimer2=null;
	function showZD(){
		g("dhx").src=imgPath+"s1_dhx_"+dx_num+".png";
		dx_num++;
		if(dx_num==9){
			oTimer2=setInterval(keyframes,10);
			clearInterval(oTimer1);
			dx_num=1;
			return false;
		}
	};
	var clearZD = function(){
		g("click_ico").removeEventListener('click',clearZD);
		oTimer1=setInterval(showZD,80);
	}
	g("click_ico").addEventListener('click',clearZD);
	//爆炸帧
	function keyframes(){
		if(bz_num==8){
			clearInterval(oTimer2);
			//pageTurn = false;
			util.nextSec();
			bz_num=1;
			return false;
		}
		else{
		g("keyframes").style.display="block";
		g("keyframes").src=imgPath+"p"+bz_num+".png";
		bz_num++;
		}
}
}
slideYes();

//S5枪
var frames = [] , q_src=g("qiang_img");
for(var s=1;s<16;s++)
{
	frames.push('http://ossweb-img.qq.com/images/yes/act/a20140728mobile/qiang'+s+'.png');
};
var myFilm = film(q_src, {
    resource : frames,  //如果传递的为一张图片，那么认为是采用sprite的形式进行
    index : 7, //默认显示第几帧
    playTime :1000, //滚动执行时间
    aniType : 'linear' //运算轨迹
})
var gst = gesture(q_src,{});
var handler = function(e){
	if(e.distance.x>0){
		myFilm.next();
	}
	if(e.distance.x<0){
		myFilm.prev();
	}
}
gst.on("swipeleft swiperight swipeup swipedown touchleft touchright", handler);
gst.on('touchleft touchright', function(){
	pageTurn = false;
}).on('touchend', function(){
	pageTurn = true;
});


//S6图片tab
var gift_L=0 , gift_F=0;
$('.ytab li').tap(function(){
	var t=$(this).index();
	gift_F=-25*t+"%";
	$(this).parents('.s6_box').find('.tab_con').css({'-webkit-transform':'translate('+gift_F+')','-webkit-transition':'500ms linear'} );
	$(this).siblings().removeClass('on');
	$(this).addClass('on');
});

$('.tablist').swipeLeft(function() {
    var i = $(this).index() + 1;
    if (i == 4) {i = 0}
    gift_L = -25 * i + "%";
        $(this).parent('.tab_con').css({
            '-webkit-transform': 'translate(' + gift_L + ')',
            '-webkit-transition': '500ms linear'
        });
        $(this).parents('.s6_box').find('.ytab li').eq(i).siblings().removeClass('on');
        $(this).parents('.s6_box').find('.ytab li').eq(i).addClass('on');
});
$('.tablist').swipeRight(function(){
    var i = $(this).index();
    if (i == 0) {i = 4}
        var n = i - 1;
        gift_L = -25 * n + "%";
        $(this).parents('.tabcontent').find('.tab_con').css({
            '-webkit-transform': 'translate(' + gift_L + ')',
            '-webkit-transition': '500ms linear'
        });
        $(this).parents('.s6_box').find('.ytab li').eq(i - 1).siblings().removeClass('on');
        $(this).parents('.s6_box').find('.ytab li').eq(i - 1).addClass('on');
});

var gst_gift = gesture(g("gift_box"),{});
gst_gift.on('touchleft touchright', function(){
	pageTurn = false;
}).on('touchend', function(){
	pageTurn = true;
});

//重力感应
var scene = document.getElementById('scene');
var parallax = new Parallax(scene);
//S7分享按钮
g("shareLayer").onclick = function(){
	g("shareLayer").style.display="none";
}
g("shareFriends").onclick = function(){
    g("shareLayer").style.display="block";
    pgvSendClick({hottag: 'act.a20140728mobile.sharefriend'});
}

//朋友圈分享
function onBridgeReady(){
	    var aurl="http://yes.qq.com/act/a20140728mobile/m.htm";
	    var img_src="http://ossweb-img.qq.com/images/yes/act/a20140728mobile/share_pic.png";
	    var des="Ye游节枪战季三步暴击攻略";
	    var tit="Ye游节枪战季三步暴击攻略";
	//转发朋友圈
	WeixinJSBridge.on("menu:share:timeline", function(e){
	    var data = {
	        img_url: img_src,
	        img_width: "120",
	        img_height: "120",
	        link: aurl,
	        desc:des,
	        title:tit
	    };
	    WeixinJSBridge.invoke("shareTimeline", data, function(res){
	        WeixinJSBridge.log(res.err_msg)
	    });
	});
	//同步到微博
	WeixinJSBridge.on("menu:share:weibo", function(){
	    WeixinJSBridge.invoke("shareWeibo", {
	        "content":des,
	        "url": aurl
	    }, function(res) {
	        WeixinJSBridge.log(res.err_msg);
	    });
	});
	//分享给朋友
	WeixinJSBridge.on('menu:share:appmessage', function(argv){
	    WeixinJSBridge.invoke("sendAppMessage", {
	        img_url:img_src,
	        img_width: "120",
	        img_height: "120",
	        link: aurl,
	        desc:des,
	        title:tit
	    }, function(res) {
	        WeixinJSBridge.log(res.err_msg)
	    });
	});
};
try{
    document.addEventListener('WeixinJSBridgeReady', function() {
           onBridgeReady();
    });
}catch(e){};



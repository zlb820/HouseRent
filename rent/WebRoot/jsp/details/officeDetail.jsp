<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<title></title>
	<base href="${pageContext.request.contextPath}/"/>
	<link href="jsp/css/metro.min.css" rel="stylesheet">
	<link href="jsp/css/metro-icons.css" rel="stylesheet">
	<link href="jsp/css/index.css" rel="stylesheet">
	<script src="jsp/js/jquery-2.1.3.min.js"></script>
	<script src="jsp/js/jquery.dataTables.min.js"></script>
	<script src="jsp/js/select2.min.js"></script>
    <script src="jsp/js/metro.js"></script>
    <script type="text/javascript" src="jsp/f-js/utils/fUtils.js"></script>
	<script type="text/javascript" src="jsp/f-js/searchInfo/officeDetail.js"></script>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=pcLs9hw4xxEHV7bX00GGeBk9"></script>  
    <script type="text/javascript">
    	var  contextUrl = function(){
    		return "${pageContext.request.contextPath}";
    	}
    </script>
</head>
<body class="bg-taupe">
	<!--header部分-->
	<div class="container page-content titleMenu">	
			
		<div>
            <ul class="h-menu block-shadow-impact bg-grayDark">
	            <li class="fg-lightOrange padding20 margin80 no-margin-left no-margin-top no-margin-bottom no-padding-top no-padding-bottom">
		            <span class="fg-lightOrange mif-squirrel mif-4x margin10 no-margin-left no-margin-top no-margin-bottom "></span>"葭叮柳"沁心小屋
		        </li>
                <li>
	                <a href="index/list" class="fg-white sub-header">
	                <span class="mif-library mif-lg"></span>&nbsp;&nbsp;首页</a>
	            </li>
                <li><a href="jsp/searchInfo/RentalsSearch.jsp" class="fg-white sub-header"><span class="mif-home mif-lg"></span>&nbsp;&nbsp;租房</a>
					<!--<ul  class="d-menu bg-grayDark" data-role="dropdown">
                        <li><a href="#" class="fg-white sub-header"><span class="mif-home mif-lg"></span>&nbsp;&nbsp;短租</a></li>
                        <li><a href="#" class="fg-white sub-header"><span class="mif-home mif-lg"></span>&nbsp;&nbsp;长租</a></li>
                        <li><a href="#" class="fg-white sub-header"><span class="mif-home mif-lg"></span>&nbsp;&nbsp;求租</a></li>
                    </ul>-->
                </li>
                <li><a href="jsp/searchInfo/OfficeSearch.jsp" class="fg-white sub-header"><span class="mif-location-city mif-lg"></span>&nbsp;&nbsp;写字楼</a></li>
                <li><a href="jsp/searchInfo/StoreSearch.jsp" class="fg-white sub-header"><span class="mif-shop mif-lg"></span>&nbsp;&nbsp;商铺</a></li>
                 <li>
	                <a href="#" class="fg-white sub-header">
	                <span class="mif-broadcast mif-lg fg-red"></span>&nbsp;&nbsp;北京</a>
	                <ul  class="d-menu bg-grayDark" data-role="dropdown">
                        <li><a href="#" class="fg-white"><span class="mif-broadcast mif-lg"></span>&nbsp;&nbsp;邯郸</a></li>
                        <li><a href="#" class="fg-white"><span class="mif-broadcast mif-lg"></span>&nbsp;&nbsp;广州</a></li>                   
                    </ul>
	            </li>
                <li class="place-right no-hovered">
                    <a href="#" class="fg-white sub-header"><span class="mif-users mif-lg mif-ani-vertical mif-ani-slow"></span>&nbsp;&nbsp;登录</a>
                    <a href="#" class="fg-white sub-header"><span class="mif-user-md mif-lg mif-ani-spanner mif-ani-slow"></span>&nbsp;&nbsp;注册</a>
                    <div class="app-bar-drop-container bg-grayDark fg-white place-right" data-role="dropdown" data-no-close="true">
                        <div class="padding20">
                            <form>
                                <h4 class="text-light">登录</h4>
                                <div class="input-control text">
                                    <span class="mif-user prepend-icon"></span>
                                    <input type="text">
                                </div>
                                <div class="input-control text">
                                    <span class="mif-lock prepend-icon"></span>
                                    <input type="password">
                                </div>
                                <label class="input-control checkbox small-check">
                                    <input type="checkbox">
                                    <span class="check"></span>
                                    <span class="caption">Remember me</span>
                                </label>
                                <div class="form-actions">
                                    <button class="button">Login</button>
                                    <button class="button link">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
	</div>
	<!--主体部分-->
	<div class="margin100 no-margin-top no-margin-bottom bg-grayLighter">
	<ul class="breadcrumbs bg-grayLighter padding10">
        <li><a href="jsp/index.jsp"><span class="icon mif-home"></span></a></li>
        <li><a href="javascript:void(0);">写字楼</a></li>
        <li><a href="javascript:void(0);">${office.location }</a></li>
        <li><a href="javascript:void(0);">${office.title }</a></li>
    </ul>
	 
	<div class="grid padding60 no-padding-bottom no-padding-top">
		<div class="row cells2">
			<div class="cell">
				<div id="car_m_2" class="carousel" data-role="carousel" data-height="500" data-controls="false" data-markers="false" data-auto="false">
                    <div class="slide"><img src="${office.pic01 }" data-role="fitImage" data-format="fill"></div>
                    <div class="slide"><img src="${office.pic02 }" data-role="fitImage" data-format="fill"></div>
                    <div class="slide"><img src="${office.pic03 }" data-role="fitImage" data-format="fill"></div>
                    <div class="slide"><img src="${office.pic04 }" data-role="fitImage" data-format="fill"></div>
                </div>
                <div id="car_m_2_thumbs" class="padding10 align-center">
                    <div class="thumb" data-index="1"><img src="${office.pic01 }" data-role="fitImage" data-format="fill"/></div>
                    <div class="thumb" data-index="2"><img src="${office.pic02 }" data-role="fitImage" data-format="fill"/></div>
                    <div class="thumb" data-index="3"><img src="${office.pic03 }" data-role="fitImage" data-format="fill"/></div>
                    <div class="thumb" data-index="4"><img src="${office.pic04 }" data-role="fitImage" data-format="fill"/></div>
                </div>
                <script>
                    $(function(){
                        var car_m_2 = $('#car_m_2').data('carousel');
                        var thumbs = $('#car_m_2_thumbs > .thumb');
                        $.each(thumbs, function(){
                            var thumb = $(this),  index = thumb.data('index') - 1;
                            thumb.on('click', function(){
                                car_m_2.slideTo(index);
                            });
                        });
                    });
                </script>
			</div>	
			<div class="cell padding20">
				<p class="sub-header padding30 no-padding-bottom no-padding-top">${office.location } ${office.title }</p>
				<p class="sub-header padding6">租金：<span class="fg-red sub-header">￥<span class="sub-leader">${office.price }</span>元/月 </span> 押一付三</p>
				<p class="sub-header padding6">面积：${office.proportation }平米</p>
				<p class="sub-header padding6">朝向：${office.direction }</p>
				<p class="sub-header padding6">楼层：${office.floor }层</p>
				<p class="sub-header padding6">联系人：${office.linkMan }</p>
				<p class="sub-header padding6">联系方式：</p>
				<p><button class="command-button warning"><span class="icon mif-phone-in-talk fg-white"></span>${office.tel }</button></p>
			</div>	
		</div>
	</div>
	<div class="grid" id="detail_basicInfo">
		<div class="row cells4">
			<div class="cell colspan4">
				<div class="cell">
					<div class="panel">
                            <div class="heading">
                                <span class="title">房源信息</span>
                            </div>
                            <div class="content padding20">
	                                                        
								${office.detailInfo }
                            </div>
                        </div>
				</div>
			</div>
		</div>
		<div class="row cells4">
			<div class="cell colspan4">
				<div class="cell">
					<div class="panel">
                            <div class="heading">
                                <span class="title">房屋配置</span>
                            </div>
                            <div class="content padding20">
	                            <span class="align-center"><img src="jsp/images/peizhi.png" width="100%"/></span>
                            </div>
                        </div>
				</div>
			</div>
		</div>
		<div class="row cells4">
			<div class="cell colspan4">
				<div class="cell">
					<div class="panel">
                            <div class="heading">
                                <span class="title">周边环境</span>
                            </div>
                            <div class="content padding20">
	                            <div style="width:100%;height:400px;border:1px solid gray;margin:0 auto;" id="container"></div>
                            </div>
                        </div>
				</div>
			</div>
		</div>
		<div class="row cells4">
			<div class="cell colspan4">
				<div class="cell">
					<div class="panel">
                            <div class="heading">
                                <span class="title">照片展示</span>
                            </div>
                            <div class="content padding20">
	                            <span class="align-center"><img src="${office.pic01 }" width="100%" height="500"/></span>
	                            <span class="align-center"><img src="${office.pic02 }" width="100%" height="500"/></span>
	                            <span class="align-center"><img src="${office.pic03 }" width="100%" height="500"/></span>
	                            <span class="align-center"><img src="${office.pic04 }" width="100%" height="500"/></span>
                            </div>
                        </div>
				</div>
			</div>
		</div>
		<div class="row cells4">
			<div class="cell colspan4">
				<div class="cell">
					<div class="panel">
                            <div class="heading">
                                <span class="title">看了又看</span>
                            </div>
                            <div class="content padding10">
	                            <div class="grid" id="seeAgain">
		                            <div class="row cells4">
			                        </div>
		                        </div>
                            </div>
                        </div>
				</div>
			</div>
		</div>
		</div>
	</div>
			<!--右边基本信息部分-->
	<div class="grid" id="Detail_rightFloat">
		<p class="bg-red padding10 fg-white"><span class="mif-bell"></span> 热门房源</p>
		
			
	</div>
</body>
<!--foot部分-->
	<footer class="bg-grayDark">
		<div class="container">
			<div class="align-center fg-white leader padding20 no-padding-left no-padding-right no-padding-bottom">
				房客保障计划
			</div>
			<div class="grid">
				<div class="row cells4 padding10">
					<div class="cell">
						<dl>
							<dt class="align-center"><img src="jsp/images/safe2.png"></dt>
							<dd class="align-center fg-white sub-alt-header padding5">入住前一天 无条件退款</dd>
						</dl>
					</div>
					<div class="cell">
						<dl>
							<dt class="align-center"><img src="jsp/images/safe3.png"></dt>
							<dd class="align-center fg-white sub-alt-header padding5">到店无房 赔首晚房费</dd>
						</dl>
					</div>
					<div class="cell">
						<dl>
							<dt class="align-center"><img src="jsp/images/safe4.png"></dt>
							<dd class="align-center fg-white sub-alt-header padding5">付款葭叮柳 资金有保障</dd>
						</dl>
					</div>
					<div class="cell">
						<dl>
							<dt class="align-center"><img src="jsp/images/safe1.png"></dt>
							<dd class="align-center fg-white sub-alt-header padding5">保障入住 蚂蚁补差价</dd>
						</dl>
					</div>
				</div>
			</div>			
		</div>
		<div class="grid padding100 margin100 no-margin-top no-margin-bottom no-padding-top no-padding-bottom">
				<div class="row cells5">
					<div class="cell">
						<dl>					
							<dd><span class="sub-header fg-white padding20 no-padding-left">联系我们</span></dd>
							<dd class="fg-white sub-alt-header padding5">客户服务</dd>
							<dd class="fg-white minor-header padding5">183-030-913-58</dd>
							<dd class="fg-white minor-header padding5">183-030-187-11</dd>
							<dd class="fg-white sub-alt-header padding5">商务合作</dd>
							<dd class="fg-white minor-header padding5">QQ : 916356537</dd>
							<dd class="fg-white minor-header padding5">Email : 18303091358@163.com</dd>
						</dl>
					</div>
					<div class="cell">
						<dl>					
							<dd><span class="sub-header fg-white padding10 no-padding-left">帮助中心</span></dd>
							<dd class="fg-white minor-header padding5">我是房客</dd>
							<dd class="fg-white minor-header padding5">我是房东</dd>
							<dd class="fg-white minor-header padding5">房源审核规范</dd>
							<dd class="fg-white minor-header padding5">房客保障计划</dd>
							<dd class="fg-white minor-header padding5">优质住宿计划</dd>
							
						</dl>
					</div>
					<div class="cell">
						<dl>					
							<dd><span class="sub-header fg-white padding10 no-padding-left">公司信息</span></dd>
							<dd class="fg-white minor-header padding5">关于葭叮柳</dd>
							<dd class="fg-white minor-header padding5">媒体报道</dd>
							<dd class="fg-white minor-header padding5">服务协议</dd>
							<dd class="fg-white minor-header padding5">隐私条款</dd>						
						</dl>
					</div>
					<div class="cell">
						<dl>					
							<dd><span class="sub-header fg-white padding10">APP下载</span></dd>
							<dd class="fg-white minor-header padding10"><img src="jsp/images/weixin.png"></dd>								
						</dl>
					</div>
					<div class="cell">
						<dl>					
							<dd><span class="padding10 sub-header fg-white">关注我们</span></dd>
							<dd class="padding10">
								<img src="jsp/images/weixin_logo.png">
								<img src="jsp/images/xinlang_logo.png">
							</dd>														
						</dl>
					</div>
				</div>
			</div>
		<div>
			<p class="fg-grayLight padding100 no-padding-top no-padding-bottom minor-header">
				<span class="fg-red">热门城市：</span>
				<a href="#" class="fg-grayLight padding10">北京短租</a>
				<a href="#" class="fg-grayLight padding10">上海短租</a>
				<a href="#" class="fg-grayLight padding10">广州短租</a>
				<a href="#" class="fg-grayLight padding10">深圳短租</a>
				<a href="#" class="fg-grayLight padding10">北京短租</a>
				<a href="#" class="fg-grayLight padding10">上海短租</a>
				<a href="#" class="fg-grayLight padding10">广州短租</a>
				<a href="#" class="fg-grayLight padding10">深圳短租</a>
				<a href="#" class="fg-grayLight padding10">北京短租</a>
				<a href="#" class="fg-grayLight padding10">上海短租</a>
				<a href="#" class="fg-grayLight padding10">广州短租</a>
				<a href="#" class="fg-grayLight padding10">深圳短租</a>	
				<!--<a href="#" class="fg-grayLight padding10">北京短租</a>
				<a href="#" class="fg-grayLight padding10">上海短租</a>
				<a href="#" class="fg-grayLight padding10 ">广州短租</a>
				<a href="#" class="fg-grayLight padding10">深圳短租</a>
				<a href="#" class="fg-grayLight padding10">北京短租</a>
				<a href="#" class="fg-grayLight padding10">上海短租</a>
				<a href="#" class="fg-grayLight padding10">广州短租</a>
				<a href="#" class="fg-grayLight padding10">深圳短租</a>-->
			</p>
			<p class="fg-grayLight minor-header padding100 no-padding-top no-padding-bottom">
				<span class="fg-red">热门推荐：</span>
				<a href="#" class="fg-grayLight padding10">别墅日租短租</a>				
			</p>
			<p class="fg-grayLight minor-header padding100 no-padding-top no-padding-bottom">
				<span class="fg-red">友情链接：</span>
				<a href="http://www.yododo.cn" class="fg-grayLight padding10">客栈住宿</a>
				<a href="http://www.pintour.com" class="fg-grayLight padding10">驴友</a>
				<a href="http://chengdu.anjuke.com" class="fg-grayLight padding10">成都房产网</a>
				<a href="http://house.shangdu.com" class="fg-grayLight padding10">郑州房产网</a>
				<a href="http://www.housoo.com" class="fg-grayLight padding10">太原房产网</a>
				<a href="http://sh.fangjia.com" class="fg-grayLight padding10">上海房价</a>
				<a href="http://www.tripc.net" class="fg-grayLight padding10">启程旅游网</a>
				<a href="#" class="fg-grayLight padding10">宾馆预订</a>
				<a href="#" class="fg-grayLight padding10">遨游搜旅游网</a>
				<a href="#" class="fg-grayLight padding10">去114分类信息网</a>
				<a href="#" class="fg-grayLight padding10">九游网</a>
			
				<a href="#" class="fg-grayLight padding10">婚宴酒店</a>	
				<!--<a href="#" class="fg-grayLight padding10">买房网</a>			
				<a href="#" class="fg-grayLight padding10 ">杭州二手房网</a>
				<a href="#" class="fg-grayLight padding10">昆山房产网</a>
				<a href="#" class="fg-grayLight padding10">家居产品库</a>			
				<a href="#" class="fg-grayLight padding10">酷讯酒店预订</a>
				<a href="#" class="fg-grayLight padding10">旅游百事通</a>
				<a href="#" class="fg-grayLight padding10">出境游</a>-->
								
			</p>
		</div>	
		<div class="padding1 align-center no-padding-top">
			<!--<p class="fg-grayLight minor-header">开发公司：北京诺君安信息技术股份有限公司</p>-->
			<p class="fg-grayLight minor-header">开发者：陈柳羽 (版权归设计者所有)</p>
		</div>
	</footer>
	<script type="text/javascript">
		$(function(){
			officeDetail.init();
		});
	</script>
	<script type="text/Javascript">
     //创建和初始化地图函数：
     function initMap(){
         createMap();//创建地图
         setMapEvent();//设置地图事件
         addMapControl();//向地图添加控件
     }
     
     //创建地图函数：
     function createMap(){
         var map = new BMap.Map("container");//在百度地图容器中创建一个地图
         var point = new BMap.Point(116.331445,39.903241);//定义一个中心点坐标
         map.centerAndZoom(point,15);//设定地图的中心点和坐标并将地图显示在地图容器中
         var marker = new BMap.Marker(point);   // 创建标注
		 map.addOverlay(marker);                        // 将标注添加到地图
		 var infoWindow = new BMap.InfoWindow("<p color='red'>房屋出租</p><p>地址：北京市海淀区</p><p>联系电话：18303091358</p>");    // 创建信息窗口对象
		 map.openInfoWindow(infoWindow,point);                 //开启信息窗口
         window.map = map;//将map变量存储在全局
     }
     
     //地图事件设置函数：
     function setMapEvent(){
         map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
         map.enableScrollWheelZoom();//启用地图滚轮放大缩小
         map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
         map.enableKeyboard();//启用键盘上下左右键移动地图
     }
     
     //地图控件添加函数：
     function addMapControl(){
	    map.addControl(new BMap.NavigationControl());
		map.addControl(new BMap.ScaleControl());
		map.addControl(new BMap.OverviewMapControl());
     }
     initMap();//创建和初始化地图psd.knowsky.com
 </script>
</html>

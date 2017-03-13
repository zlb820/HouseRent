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
                </li>
                <li><a href="jsp/searchInfo/OfficeSearch.jsp" class="fg-white sub-header bg-lighterBlue"><span class="mif-location-city mif-lg"></span>&nbsp;&nbsp;写字楼</a></li>
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
	<!--header部分结束-->
	<!--主体部分开始-->
	<div class="margin100 no-margin-top no-margin-bottom bg-grayLighter">
		<ul class="breadcrumbs bg-grayLighter padding10">
	        <li><a href="jsp/index.jsp"><span class="icon mif-home"></span></a></li>
	        <li><a href="#">写字楼</a></li>
	    </ul>
	    <!--中间部分-->
	    <div class="bg-grayLighter margin100 no-margin-top no-margin-bottom">
	    <!--条件选择部分-->
	    <div class="example">
	    <p class="minor-header" id="area">
			<span class="fg-red">区域：</span>
		</p>
	    <p class="minor-header" id="officeType">
		    <span class="fg-red">类别：</span>
		</p>
		<p class="minor-header" id="officeSource">
			<span class="fg-red">来源：</span>
		    <!-- <a href="#" class="fg-grayLight padding10">不限</a>	
		    <a href="#" class="fg-grayLight padding10">个人</a>	
		    <a href="#" class="fg-grayLight padding10">经纪人</a>	 -->
		</p>
		<p class="minor-header">
			<span class="fg-red">价格：</span>
		    <input type="text" name="startMoney"/>——<input type="text" name="endMoney"/> 元/月
		    <span class="fg-red margin70 no-margin-bottom no-margin-top
		     no-margin-right">面积：</span>
		    <input type="text" name="startSquear"/>——<input type="text" name="endSquear"/> 平方米	
		</p>
		<div class="input-control text full-size" data-role="input">
	    <input type="text" name="searchValue">
	    <button class="button fg-red" id="searchBtn"><span class="mif-search fg-red"></span> 搜索</button>
		</div>
		</div>
		 <!--条件选择部分结束-->
		<!--搜索内容部分-->
    	<div class="tabcontrol" data-role="tabcontrol" id="officeWay">
	        <ul class="tabs">
	        </ul>
	        <div class="frames bg-white">
	            <div class="frame bg-white" id="frame_1_1">
		           <div class="grid">
			            <div class="row cells12">
				            <div class="cell colspan2">
					             <img src="jsp/images/detail01.jpg">
				            </div>
				            <div class="cell colspan6">
					            <ul class="store_Ulinfo">
						            <li class="fg-blue sub-header padding2">东四环现房招医院进驻百子湾</li>
						            <li class="padding2">东四环京哈高速与高碑店路交叉口 独栋7300平米一层4.2米</li>
						            <li class="padding2">临近:CBD高尔夫球场 / 今天</li>
					            </ul>
				            </div>
				            <div class="cell colspan2 align-center padding30 no-padding-left no-padding-right">面议</div>
				            <div class="cell colspan2 align-center padding30 no-padding-left no-padding-right"><span class="fg-red sub-header">20000</span>平</div>
				        </div>
				         
		           </div>
	            </div>
	            
	        </div>
		   <div class="pagination rounded align-right" id="pager">
                <span class="item prev">&lt;</span>
                <span class="item next">&gt;</span>
            </div>
    	</div>
    	<!--搜索内容部分结束-->
    	<div class="grid">
	    	<div class="row">
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
    	<!--中间部分结束-->
    </div>    
    <!--主体部分结束-->
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
	 <script type="text/javascript" src="jsp/f-js/utils/fUtils.js"></script>
	<script type="text/javascript" src="jsp/f-js/searchInfo/officeSearch.js"></script>
	<script type="text/javascript">
		$(function(){
			officeSearch.init();
			//console.info(RentalsSearch);
		});
	</script>
</html>
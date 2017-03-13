<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!doctype html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<title>“葭叮柳”沁心小屋</title>
	<base href="${pageContext.request.contextPath}/"/>
	<link href="jsp/css/metro.min.css" rel="stylesheet">
	<link href="jsp/css/metro-icons.css" rel="stylesheet">
	<link href="jsp/css/index.css" rel="stylesheet">
	<script src="jsp/js/jquery-2.1.3.min.js"></script>
	<script src="jsp/js/jquery.dataTables.min.js"></script>
	<script src="jsp/js/select2.min.js"></script>
    <script src="jsp/js/metro.js"></script>
    
</head>
<body class="bg-taupe">
	<!--header部分-->
	<!--工具栏部分-->
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
                                            <button class="button link"><a href="login.jsp">Cancel</a></button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                </li>
            </ul>
        </div>
	</div>
	<!--图片轮换部分-->
	<div>
		 <div class="carousel" data-role="carousel" data-height="600" data-control-next="<span class='mif-chevron-right'></span>" data-control-prev="<span class='mif-chevron-left'></span>">	       
	       <div class="slide"><img src="jsp/images/slide01.jpg" data-role="fitImage" data-format="fill"></div>
	       <div class="slide"><img src="jsp/images/slide02.jpg" data-role="fitImage" data-format="fill"></div>
	       <div class="slide"><img src="jsp/images/slide003.jpg" data-role="fitImage" data-format="fill"></div>
	       <div class="slide"><img src="jsp/images/slide04.jpg" data-role="fitImage" data-format="fill"></div>
	    </div>
	</div>
    <!--轮换往下部分-->
    <div class="grid bg-lightOrange margin20">
        <div class="row cells4">
            <div class="cell padding5">
                <div class="notify cell01">
	                <span class="notify-icon mif-vpn-publ"></span>
                    <span class="notify-title">一套房子全能解决</span>
                    <span class="notify-text sub-header fg-brown">不论是一家老小，还是朋友几个</span>
                </div>
            </div>
            <div class="cell padding5">
                <div class="notify cell01">
                    <span class="notify-icon mif-vpn-publ"></span>
                    <span class="notify-title">享受家一般的舒适</span>
                    <span class="notify-text sub-header fg-brown">有客厅，有厨房，能洗衣，能做饭</span>
                </div>
            </div>
            <div class="cell padding5">
                <div class="notify cell01">
	                <span class="notify-icon mif-vpn-publ"></span>
                    <span class="notify-title">比同等酒店便宜50%</span>
                    <span class="notify-text sub-header fg-brown">一般“葭叮柳”小屋==2间酒店房间</span>
                </div>
            </div>
            <div class="cell padding5">
                <div class="notify cell01">
	                <span class="notify-icon mif-vpn-publ"></span>                   
                    <span class="notify-title">本地房东做向导</span>
                    <span class="notify-text sub-header fg-brown">像本地房东一样旅行</span>
                </div>
            </div>
        </div>
    </div>
    
    <!--租房推荐-->
	<div class="padding10 ribbed-grayLighter fg-darkRed margin10 no-margin-right no-margin-left align-center text-accent text-bold">
	             整 租 房 推 荐
	</div>
	<div class="bg-lightOrange margin20">
	    <div class="grid" id="houseRecommend">
		    <div class="row cells3 padding30">
		    <c:forEach items="${house }" var="h">
		     <div class="cell">  
		            <dl>
			            <dt>
				            <a href="houseRent/getHouse?id=${h.id }"><img src="jsp/images/zr_style01.jpg" data-role="fitImage" data-overlay='</br></br></br></br></br></br></br></br></br></br>${h.title }${h.direction }</br>价格：￥${h.price }/月'  data-type="handing-ani"></a>                             
			            </dt>
			            <dd class="fg-dark">￥${h.price }/月</dd>
			            <dd class="fg-dark">${h.title }</dd>
			            <dd class="fg-dark">${h.basicInfo }</dd>
			        </dl>      
	                
	            </div>
		    </c:forEach>
	            <%-- <div class="cell">  
		            <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style01.jpg" data-role="fitImage" data-overlay="you text here..."  data-type="handing-ani"></a>                             
			            </dt>
			            <dd class="fg-dark">￥5000/月</dd>
			            <dd class="fg-dark">温馨小屋</dd>
			            <dd class="fg-dark">北京市海淀区魏公村D口出 紫竹院路199号</dd>
			        </dl>      
	                
	            </div>
	            <div class="cell">
		            <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style02.jpg" data-role="fitImage" data-overlay="</br></br></br></br></br></br></br></br></br></br>格兰晴天3居室-南卧</br>价格：￥3330/月" data-type="handing"></a>
			            </dt>
			            <dd class="fg-dark">￥3330/月</dd>
			            <dd class="fg-dark">舒适整租</dd>
			            <dd class="fg-dark">北京市五号线天通苑北地铁口B口出</dd>
		            </dl>
	                
	            </div>
	            <div class="cell">
		            <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style03.jpg" data-role="fitImage" data-overlay="you text here..." data-type="handing-ani"></a>
			            </dt>
			            <dd class="fg-dark">￥5000/月</dd>
			            <dd class="fg-dark">温馨小屋</dd>
			            <dd class="fg-dark">北京市海淀区魏公村D口出 紫竹院路199号</dd>
			        </dl>	                
	            </div>           
	        </div> --%>
	        <%-- <div class="row cells3 padding30 no-padding-top">
	            <div class="cell">
	                <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style01.jpg" data-role="fitImage" data-overlay="you text here..."  data-type="handing-ani"></a>                             
			            </dt>
			            <dd class="fg-dark">￥5000/月</dd>
			            <dd class="fg-dark">温馨小屋</dd>
			            <dd class="fg-dark">北京市海淀区魏公村D口出 紫竹院路199号</dd>
			        </dl>    
	            </div>
	            <div class="cell">
	                <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style02.jpg" data-role="fitImage" data-overlay="</br></br></br></br></br></br></br></br></br></br>格兰晴天3居室-南卧</br>价格：￥3330/月" data-type="handing"></a>
			            </dt>
			            <dd class="fg-dark">￥3330/月</dd>
			            <dd class="fg-dark">舒适整租</dd>
			            <dd class="fg-dark">北京市五号线天通苑北地铁口B口出</dd>
		            </dl>
	            </div>
	            <div class="cell">
	                <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style03.jpg" data-role="fitImage" data-overlay="you text here..." data-type="handing-ani"></a>
			            </dt>
			            <dd class="fg-dark">￥5000/月</dd>
			            <dd class="fg-dark">温馨小屋</dd>
			            <dd class="fg-dark">北京市海淀区魏公村D口出 紫竹院路199号</dd>
			        </dl>	
	            </div>           
	        </div> --%>
		</div>
	</div>
	<!--写字楼推荐-->	
	<div class="padding10 ribbed-grayLighter fg-darkRed margin10 no-margin-right no-margin-left align-center text-accent text-bold">
	            写 字 楼 推 荐
	</div>
	<div class="bg-lightOrange margin20 padding20 no-padding-top">
	    <div class="grid">
		    <div class="row cells3">
		    <c:forEach items="${office }" var="o">
		    	<div class="cell">
		            <dl>
			            <dt>
				           <a href="officeRent/get?id=${o.id }"><img src="jsp/images/zr_style01.jpg" data-role="fitImage" data-overlay='</br></br></br></br></br></br></br></br></br></br>${o.title }${o.direction }</br>价格：￥${h.price }/月'  data-type="bordered"></a>
			            </dt>
			            <dd class="fg-dark">￥${o.price }/月</dd>
			            <dd class="fg-dark">${o.title }</dd>
			            <dd class="fg-dark">${o.basicInfo }</dd>
		            </dl>
	            </div>
		    </c:forEach>
	           <!--  <div class="cell">
		            <dl>
			            <dt>
				           <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style01.jpg" data-role="fitImage" data-overlay="you text here..."  data-type="bordered"></a>
			            </dt>
			            <dd class="fg-dark">￥5000/月</dd>
			            <dd class="fg-dark">温馨小屋</dd>
			            <dd class="fg-dark">北京市海淀区魏公村D口出 紫竹院路199号</dd>
			            
		            </dl>
	                
	            </div>
	            <div class="cell">
		            <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style02.jpg" data-role="fitImage" data-overlay="you text here..." data-type="bordered"></a>
			            </dt>
			            <dd class="fg-dark">￥3330/月</dd>
			            <dd class="fg-dark">舒适整租</dd>
			            <dd class="fg-dark">北京市五号线天通苑北地铁口B口出</dd>
		            </dl>       
	            </div>
	            <div class="cell">
		            <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style03.jpg" data-role="fitImage" data-overlay="you text here..." data-type="bordered"></a>
			            </dt>
			            <dd class="fg-dark">￥3330/月</dd>
			            <dd class="fg-dark">舒适整租</dd>
			            <dd class="fg-dark">北京市五号线天通苑北地铁口B口出</dd>
		            </dl> 
	                
	            </div>           
	        </div>
	        <div class="row cells3">
	            <div class="cell">
	               <dl>
			            <dt>
				           <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style01.jpg" data-role="fitImage" data-overlay="you text here..."  data-type="bordered"></a>
			            </dt>
			            <dd class="fg-dark">￥5000/月</dd>
			            <dd class="fg-dark">温馨小屋</dd>
			            <dd class="fg-dark">北京市海淀区魏公村D口出 紫竹院路199号</dd>
			            
		            </dl>
	            </div>
	            <div class="cell">
	                 <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style02.jpg" data-role="fitImage" data-overlay="you text here..." data-type="bordered"></a>
			            </dt>
			            <dd class="fg-dark">￥3330/月</dd>
			            <dd class="fg-dark">舒适整租</dd>
			            <dd class="fg-dark">北京市五号线天通苑北地铁口B口出</dd>
		            </dl>    
	            </div>
	            <div class="cell">
	                <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style03.jpg" data-role="fitImage" data-overlay="you text here..." data-type="bordered"></a>
			            </dt>
			            <dd class="fg-dark">￥3330/月</dd>
			            <dd class="fg-dark">舒适整租</dd>
			            <dd class="fg-dark">北京市五号线天通苑北地铁口B口出</dd>
		            </dl> 
	            </div>          -->  
	        </div>
		</div>
	</div>

	<!--商铺推荐-->
	<div class="padding10 ribbed-grayLighter fg-darkRed margin10 no-margin-right no-margin-left align-center text-accent text-bold">
             商 铺 推 荐
    </div>
    <div class="bg-lightOrange margin20 padding20">
	    <div class="grid">
		    <div class="row cells3 padding20">
		    <c:forEach items="${store }" var="s">
		    <div class="cell example">
		             <dl>
			            <dt>
				            <a href="storeRent/get?id=${s.id }"><img src="jsp/images/zr_style01.jpg" data-role="fitImage" 
				            data-overlay='</br></br></br></br></br></br></br>${s.title }${s.direction }</br>价格：￥${s.price }/月' data-type="handing"></a>
			            </dt>
			            <dd class="fg-dark">￥${s.price }/月</dd>
			            <dd class="fg-dark">${s.title }</dd>
			            <dd class="fg-dark">${s.basicInfo }</dd>
		            </dl> 	                
	            </div>
		    </c:forEach>
	          <!--   <div class="cell example">
		             <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style01.jpg" data-role="fitImage" data-overlay="you text here..." data-type="handing"></a>
			            </dt>
			            <dd class="fg-dark">￥3330/月</dd>
			            <dd class="fg-dark">舒适整租</dd>
			            <dd class="fg-dark">北京市五号线天通苑北地铁口B口出</dd>
		            </dl> 	                
	            </div>
	            <div class="cell example">
		            <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style02.jpg" data-role="fitImage" data-overlay="you text here..." data-type="handing"></a>
			            </dt>
			            <dd class="fg-dark">￥3330/月</dd>
			            <dd class="fg-dark">舒适整租</dd>
			            <dd class="fg-dark">北京市五号线天通苑北地铁口B口出</dd>
		            </dl> 	 	                
	            </div>
	            <div class="cell example">
		            <dl>
			            <dt>
				            <a href="jsp/details/houseDetail.jsp"><img src="jsp/images/zr_style03.jpg" data-role="fitImage" data-overlay="you text here..." data-type="handing"></a>
			            </dt>
			            <dd class="fg-dark">￥3330/月</dd>
			            <dd class="fg-dark">舒适整租</dd>
			            <dd class="fg-dark">北京市五号线天通苑北地铁口B口出</dd>
		            </dl> 	                 
	            </div>           
 -->	        </div>	       
		</div>
	</div>
	
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
</body>
</html>
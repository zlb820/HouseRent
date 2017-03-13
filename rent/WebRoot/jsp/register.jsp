<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<title></title>
	<link href="css/metro.min.css" rel="stylesheet">
	<link href="css/metro-icons.css" rel="stylesheet">
	<link href="css/index.css" rel="stylesheet">
	<script src="js/jquery-2.1.3.min.js"></script>
	<script src="js/jquery.dataTables.min.js"></script>
	<script src="js/select2.min.js"></script>
    <script src="js/metro.js"></script>
</head>
<body>
	<!--header部分-->
	<!--工具栏部分-->
	<div class="container page-content titleMenu">			
		<div>
            <ul class="h-menu block-shadow-impact bg-grayDark">
	            <li class="fg-lightOrange padding20 margin80 no-margin-left no-margin-top no-margin-bottom no-padding-top no-padding-bottom">
		            <span class="fg-lightOrange mif-squirrel mif-4x margin10 no-margin-left no-margin-top no-margin-bottom "></span>"葭叮柳"沁心小屋
		        </li>
                <li>
	                <a href="index.html" class="fg-white sub-header">
	                <span class="mif-library mif-lg"></span>&nbsp;&nbsp;首页</a>
	            </li>
                <li><a href="searchInfo/RentalsSearch.html" class="fg-white sub-header"><span class="mif-home mif-lg"></span>&nbsp;&nbsp;租房</a>
					<!--<ul  class="d-menu bg-grayDark" data-role="dropdown">
                        <li><a href="#" class="fg-white sub-header"><span class="mif-home mif-lg"></span>&nbsp;&nbsp;短租</a></li>
                        <li><a href="#" class="fg-white sub-header"><span class="mif-home mif-lg"></span>&nbsp;&nbsp;长租</a></li>
                        <li><a href="#" class="fg-white sub-header"><span class="mif-home mif-lg"></span>&nbsp;&nbsp;求租</a></li>
                    </ul>-->
                </li>
                <li><a href="searchInfo/OfficeSearch.html" class="fg-white sub-header"><span class="mif-location-city mif-lg"></span>&nbsp;&nbsp;写字楼</a></li>
                <li><a href="searchInfo/StoreSearch.html" class="fg-white sub-header"><span class="mif-shop mif-lg"></span>&nbsp;&nbsp;商铺</a></li>
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
	
</body>
</html>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<title>"葭叮柳"沁心小屋租房系统</title>
	<base href="${pageContext.request.contextPath}/"/>
	<link rel="stylesheet" href="manage/themes/default/easyui.css" type="text/css"></link>
	<link rel="stylesheet" href="manage/themes/icon.css" type="text/css"></link>
	<script type="text/javascript" src="manage/js/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="manage/js/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="manage/js/easyui-lang-zh_CN.js"></script>
	<script>	
		function addTabs(el,url){
			var tt=$(el).html();
			var flag=$("#main").tabs("exists",tt);
			if(flag){
				$("#main").tabs("select",tt);
			}else{
				$("#main").tabs("add",{
					title:tt,
					closable:true,
					content:"<iframe src='"+url+"' scrolling='no'  frameborder='0' width='100%' height='100%'></iframe>"
				});
			}
		}
	</script>
	<style>
		#top{
			/* background-color:#D0E5F8; */
			background-image:url(manage/images/main03.jpg);
		    background-repeat:x-repeat;
		}
		.logo{
			font:bolder 50px/100px 微软雅黑;
			color:#C9C8EA;
			text-shadow: 8px 10px 10px #535353;
		}
	</style>
</head>
<body class="easyui-layout" style="width:1500px;height:100%;">
	<div region="north" style="height:100px" id="top">
		<center class="logo">"葭叮柳"沁心小屋租房系统</center>
	</div>
	<div class="easyui-accordion" iconCls="icon-tip" title="导航栏目" region="west" style="width:200px;height:100%;">		
		<div title="系统管理" iconCls="icon-edit">
			<p style="margin-left:25px;margin-bottom:238px;" onclick="addTabs(this,'manage/sys/person.jsp')"><img src="manage/images/clock_Disabled.png">用户管理</p>
			<div class="cc" style="width:180px;height:180px;"></div> 
		</div>
		<div title="租房管理" iconCls="icon-edit">
			<p style="margin-left:25px;" onclick="addTabs(this,'manage/houseRent/personInfoRent.jsp')"><img src="manage/images/clock_Disabled.png">房屋出租信息</p>
			<p style="margin-left:25px;" onclick="addTabs(this,'manage/officeRent/officePersonRent.jsp')"><img src="manage/images/clock_Disabled.png">写字楼出租信息</p>
		    <p style="margin-left:25px;margin-bottom:180px;" onclick="addTabs(this,'manage/storeRent/storePersonRent.jsp')"><img src="manage/images/clock_Disabled.png">商铺出租信息</p>		
		    <div class="cc" style="width:180px;height:180px;"></div> 
		</div>
		<div title="客户管理" iconCls="icon-edit">
			<p style="margin-left:25px;" onclick="addTabs(this,'manage/customer/customer.jsp')"><img src="manage/images/clock_Disabled.png">客户资源管理</p>
			<!-- <p style="margin-left:25px;" onclick="addTabs(this,'userAdd.html')"><img src="manage/images/clock_Disabled.png">客户发展计划</p> -->
		    <p style="margin-left:25px;margin-bottom:210px;" onclick="addTabs(this,'manage/customer/analysis.jsp')"><img src="manage/images/clock_Disabled.png">客户信誉度管理</p>	
		    <div class="cc" style="width:180px;height:180px;"></div> 
		</div>
		<!-- <div title="合同管理" iconCls="icon-edit">
			<p style="margin-left:25px;" onclick="addTabs(this,'userAdd.html')"><img src="manage/images/clock_Disabled.png">合同管理</p>
		    <p style="margin-left:25px;margin-bottom:180px;" onclick="addTabs(this,'easyui01.html')"><img src="manage/images/clock_Disabled.png">合同审核</p>	
		    <div class="cc" style="width:180px;height:180px;"></div> 
		</div> -->
	</div>
	<div class="easyui-tabs" id="main" region="center">
		<div title="欢迎页面"><img src="manage/images/index.jpg"></div>
	</div>
</body>
<script type="text/javascript">
	$('.cc').calendar({   
    width:195,   
    height:180, 
    current:new Date()   

  });  
</script>
</html>

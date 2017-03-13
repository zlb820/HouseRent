<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
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
  <script>
  
  
 
  /***************************查看****************************************/
  
  /* 
  		function find(){
  			$.ajax({
  				url:'${pageContext.request.contextPath}/customer/pie',
  				type:'post',
  				dataType:'text',
  				async:true,
  				success:function(filename){
  				
  					$("#pie img").attr("src","chart.jpg?filename="+filename);
  				}
  			});
  			
  		
  		} */
  
  
  
  		
  </script>
</head>
  <body>
 		<div id="pie">
    			<img src=""/>
 		</div>
  </body>
  <script type="text/javascript" src="manage/customer/js/analysis.js"></script>
  <script type="text/javascript">
		$(function(){
			analysis.init();
			console.info(analysis);
		});
	</script>
</html>

<%@ page language="java" import="java.util.*" pageEncoding="ISO-8859-1"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'upload.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

  </head>
  
  <body>
  
  	<form method="post" action="${pageContext.request.contextPath }/houseRent/newAddimages" enctype="multipart/form-data">
  		<input type="file" value="选择图片01" name='tp'/>
  		<input type="file" value="选择图片01" name='tp'/>
  		<input type="file" value="选择图片01" name='tp'/>
  		<input type="file" value="选择图片01" name='tp'/>
  		<input type="submit" value="上传"/>
  	</form>
  
   
  </body>
</html>

/***************************************
 * @Name : 测试模块
 * @ID : DemoTest
 * @CreaterName : chenliuyu
 * @Email : chenliuyu@bjnja.com
 ***************************************/


$(function(){
	
	/*侧边栏的收缩效果代码*/
	$(".DemoTest_DivFloat").click(function(){
		$("#DemoTest_LeftSideMain").hide();
		$("#DemoTest_LeftSideMain02").show();		
	});
	
	$(".DemoTest_DivFloat2").click(function(){		
		$("#DemoTest_LeftSideMain02").hide();		
		$("#DemoTest_LeftSideMain").show();	
	});

	/*demo01与demo02的表格js*/
	$("#DemoTest_Table").dataTable({
		"searching":false,
		"bsort":false,
		"bLengthChange":false,
		"sPaginationType":"full_numbers",
		"oLanguage":{
		
			"sLengthMenu":"show _MENU_ data",
			"sZeroRecords":"抱歉，没有找到相应内容",
			"sInfo":"从_START_到_END_/共_TOTAL_条数据",
			"sInfoEmpty":"没有数据",
			"sInfoFiltered":"从_MAX_数据中检索",
			"sZeroRecords":"没有检索导数据",
			"sSearch":"名称：",
			"oPaginate":{
				"sFirst":false,
				"sPrevious":"上页",
				"sNext":"下页",
				"sLast":false
			
			}
		
		}

	});

	/*demo02中的第二个表格js*/
	$("#DemoTest_Table01").dataTable({
		"searching":false,
		"bsort":false,
		"bLengthChange":false,
		"sPaginationType":"full_numbers",
		"oLanguage":{
		
			"sLengthMenu":"show _MENU_ data",
			"sZeroRecords":"抱歉，没有找到相应内容",
			"sInfo":"从_START_到_END_/共_TOTAL_条数据",
			"sInfoEmpty":"没有数据",
			"sInfoFiltered":"从_MAX_数据中检索",
			"sZeroRecords":"没有检索导数据",
			"sSearch":"名称：",
			"oPaginate":{
				"sFirst":false,
				"sPrevious":"上页",
				"sNext":"下页",
				"sLast":false
			
			}
		
		}

	});

	/*$(".DemoTest_divFloat").click(function(){
		$(".DemoTest_hide").toggle(100);
		
	});*/
});


<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<title></title>
	 <%-- <base href="${pageContext.request.contextPath}/"/>  --%>
	<SCRIPT>var isomorphicDir="../../isomorphic/";</SCRIPT>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_Core.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_Foundation.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_Containers.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_Grids.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_Forms.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_DataBinding.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/skins/TreeFrog/load_skin.js></SCRIPT>
</head>
<body style="background-color:#DAEADD;">
	<script type="text/javascript">
/**分页*/
isc.RestDataSource.create({
    ID:"Customer_UserDS",
    dataFormat:"json",
    recordXPath:"/data",
    fetchDataURL:"${pageContext.request.contextPath}/customer/find"
});

/**查询框*/
isc.DynamicForm.create({
    ID:"Customer_searchForm",
    autoDraw:false,
    width:"50%",
    numCols:6,
    colWidths:[100,120,120,120,120,"*"],
    fields:[
        {
            name:"name",
            type:"text",
            title:"客户名称",
            //required:true,
            width:150,
        },{
	        name:"startTime",
            type:"date", 
            useTextField:true,
            title:"修改时间起",
            width:150,
        },{
	        name:"endTime",
            type:"date",
            title:"修改时间止",
            width:150,
            type:"date", 
            useTextField:true,
        }
    ]
});
/**查询按钮*/
isc.IconButton.create({
    ID:"Customer_searchButton",
    title:"查询",
    icon:"[SKIN]actions/view.png",
    showMenuIconOver:false,
    click:function(){
	    Customer_FindUser();
    }
});
/**添加按钮*/
isc.IconButton.create({
    ID:"Customer_AddButton",
    title:"添加",
    icon:"[SKIN]actions/add.png",
    showMenuIconOver:false,
    click:function(){
	    Customer_FormLayout.show();
	    Customer_saveButton.show();
	    Customer_UpdateSaveButton.hide();
	    Customer_UserList.deselectAllRecords();
	    Customer_Form.clearValues();
    }
});
/**删除按钮*/
isc.IconButton.create({
    ID:"Customer_DelButton",
    title:"删除",
    icon:"[SKIN]actions/remove.png",
    showMenuIconOver:false,
    click:function(){
	    Customer_DelUserInfo();
    }
});
/**修改按钮*/
isc.IconButton.create({
    ID:"Customer_UpdateButton",
    title:"修改",
    icon:"[SKIN]actions/edit.png",
    showMenuIconOver:false,
    click:function(){
   		Customer_GetUserInfo();
	    
    }
});

/**查询框的toolstrip*/
isc.ToolStrip.create({
    ID:"Customer_ToolStrip",
    width:"100%",
    height:25,
    members:[
        Customer_searchForm,
        //isc.LayoutSpacer.create({}),// 填充空白区域
        "separator",	
        Customer_searchButton,
        Customer_AddButton,
        Customer_DelButton,
        Customer_UpdateButton

    ]
});
/**成员列表*/
isc.ListGrid.create({
    ID:"Customer_UserList",
    canResizeFields:false,
    width:"100%",
    autoDraw:false,
    alternateRecordStyles:true,
    autoFetchData: false,
    selectionAppearance:"checkbox",
    dataSource:Customer_UserDS,
    fields:[
        {
            name:"id",
            showIf:"false"
        },{
            name:"name",
            title:"客户名称"
        },{
            name:"sex",
            //showIf:"false",
            title:"性别",
            width:50
        },{
            name:"birthday",
            title:"出生日期"	,
            width:80
        },{
            name:"phone",
            title:"联系方式"
        },{
            name:"email",
            title:"邮箱"
        },{
            name:"address",
            title:"用户地址"
        },{
            name:"payTimes",
            title:"消费次数",
            width:80,
            formatCellValue(value,record){
            	return value +"次";
            }
        },{
            name:"totalPay",
            title:"消费总金额",
            formatCellValue(value,record){
            	return value +"元";
            }
        },{
        	name:"serviceSatisfy",
        	title:"服务满意度",
        	formatCellValue(value,record){
            	return value +"%";
            }
        },{
        	name:"honstLevel",
        	title:"信誉等级"
        },{
        	name:"valuelevel",
        	title:"价值等级",
        	formatCellValue(value,record){
            	return value +"级";
            }
        },{
        	name:"lastModifyTime",
        	title:"最后修改时间"
        },{
        	name:"note",
        	title:"备注信息"
        }
    ],
   
});
/**
 * 右侧顶部表单
 */
isc.ToolStrip.create({
    ID:'Customer_clearToolStrip',
    width:'100%',
    height:25,
    members:[
        isc.LayoutSpacer.create({
	        width:'*'
        }),
        isc.ToolStripButton.create({
            title:"",
            align:"right",
            icon:"[SKIN]actions/redo.png",
            click:function(){
	            Customer_FormLayout.hide();
            }
        })
    ]
});
/**人员form*/
isc.DynamicForm.create({
    ID:"Customer_Form",
    width:"100%",
    height:"100%",
    autoDraw:false,
    colWidths:[200,"*"],
    numCols:2,
    padding:20,
    cellPadding:8,
    overflow:"auto",
    // 标题文本上下显示
    titleOrientation:"top",
    fields:[
        {
            type:"header",
            defaultValue:"客户信息"
        },{
            name:"name",
            title:"客户名称",
            required: true
        },{
            name:"sex",
            title:"性别",
            type:"radioGroup",
            width:100,
            defaultValue:"男",
            valueMap: ["男","女"],
            vertical:false
          },{
            name:"birthday",
            type:"date",
            useTextField:true,
            required: true, 
            title:"出生日期"
        },{
            name:"phone",
            required: true, 
            title:"联系方式"
        },{
            name:"email",
            title:"邮箱",
            required: true, 
            //keyPressFilter:"[0-9]",
           
        },{
            name:"address",
            title:"地址"
        },{
            name:"payTimes",
            title:"消费次数"	
        },{
            name:"totalPay",
            title:"消费总金额"	
        },{
            name:"serviceSatisfy",
            title:"服务满意度"	
        },{
            name:"honstLevel",
            title:"信誉等级"	,
            type:"select",
            valueMap: ["等级A","等级B","等级C","等级D"]
        },{
            name:"valuelevel",
            title:"价值等级"	
        },{
            name:"note",
            title:"备注"	,
            width:350,
            height:50,
            type:"textArea",
            colSpan:2
        }
    ]
});

isc.ToolStripButton.create({
			ID:"Customer_saveButton",
            title:"保存",
            name:"savePersonButton",
            align:"right",
            visibility:"hidden",
            icon:"[SKIN]actions/save.png",
            click:function(){
	          Customer_SaveUserInfo();
            }
});
isc.ToolStripButton.create({
			ID:"Customer_UpdateSaveButton",
            title:"保存",
            name:"updatePersonButton",
            align:"right",
            visibility:"hidden",
            icon:"[SKIN]actions/save.png",
            click:function(){
	          Customer_UpdateUserInfo();
            }
});
/**
 * 人员toolstrip
 */
isc.ToolStrip.create({
    ID:'Customer_PersonButtonToolStrip',
    width:'100%',
    height:25,
    members:[
        isc.LayoutSpacer.create({
	        width:'*'
        }),
        "separator",
        Customer_saveButton,
        Customer_UpdateSaveButton,
        isc.ToolStripButton.create({
            title:"清空",
            align:"right",
            icon:"[SKIN]actions/close_Over.png",
            click:function(){
            	Customer_Form.clearValues();
            }
        })
    ]
});

/**
 * 人员信息布局
 */
isc.VLayout.create({
    ID:"Customer_FormLayout",
    autoDraw:false,
    visibility:"hidden", 
    overflow:"hidden",
    width:"55%",
    height:"100%",
    border:"1px solid #999",
    membersMargin:3,
    members:[
    	Customer_clearToolStrip,
        Customer_Form,
        isc.LayoutSpacer.create({
	        width:'*'
        }),
        // 出访地按钮
        Customer_PersonButtonToolStrip
    ]
});
/**列表与隐藏元素的左右布局*/
isc.HLayout.create({
	ID:"Customer_Hlayout",
	width:"100%",
	height:"100%",
	membersMargin:5,
	members:[
		 Customer_UserList,
		 Customer_FormLayout
	]
});
/**主体布局*/
isc.VLayout.create({
	ID:"Customer_vlayout",
	width:"90%",
	height:"100%",
	layoutLeftMargin:10,
	layoutTopMargin:10,
    membersMargin:5,
    members:[	
        Customer_ToolStrip,
        Customer_Hlayout
       
        
    ]
});

//------------------------------------------------------------function-----------------------------------------------
function Customer_FindUser(){
	var name = Customer_searchForm.getField("name").getValue();
	var startTime = Customer_searchForm.getField("startTime").getValue();
	var endTime = Customer_searchForm.getField("endTime").getValue();
	Customer_UserList.invalidateCache();
	Customer_UserList.fetchData({
		"name":name,
		"startTime"	:startTime,
		"endTime" : endTime
	}); 
	
}
function Customer_SaveUserInfo(){

	if(!Customer_Form.validate()){
		return;
	}
	var customer = Customer_Form.getValues();
	//var file = Customer_Form.getField("files").getValue();
	isc.confirm("确认添加<font color='red'>" + customer.name + "</font>用户吗？",function(value){
	if(value){
		isc.RPCManager.sendRequest({
		    actionURL:"${pageContext.request.contextPath}/customer/add",
		    httpMethod:"POST",
		    params:{
		        "customer":customer
		    },
		    callback:function(msg){
		    	Customer_FindUser();
		    	Customer_Form.clearValues();
		    	Customer_FormLayout.hide();
			    isc.say("添加成功");
			    return;
		    }
		});
	}
	});
}
/**删除成员*/
function Customer_DelUserInfo(){
	var record = Customer_UserList.getSelectedRecords();
	if(record.length == 0){
		isc.say("请选择至少一项待删除");
		return;
	}
	var ids = new Array();
	for(var i=0;i< record.length;i++){
		ids[i] = record[i].id; 
	}
	isc.confirm("确认删除用户吗？",function(value){
	if(value){
		isc.RPCManager.sendRequest({
		    actionURL:"${pageContext.request.contextPath}/customer/del",
		    httpMethod:"POST",
		    params:{
		        "ids":ids
		    },
		    callback:function(){
		    	Customer_FindUser();
			    isc.say("删除成功");
			    return;
		    }
		});
	}
	});
}
/**获取*/
function Customer_GetUserInfo(){
	var record = Customer_UserList.getSelectedRecord();
	if(!record){
		isc.say("请选择一项进行修改！");
		return;
	}
	Customer_Form.setData(record);
	Customer_FormLayout.show();
	Customer_saveButton.hide();
	Customer_UpdateSaveButton.show();
}
function Customer_UpdateUserInfo(){
	var record = Customer_UserList.getSelectedRecord();
	if(!Customer_Form.validate()){
		return;
	}
	var id =record.id;
	var customer = Customer_Form.getValues();
	isc.confirm("确认对<font color='red'>" + record.username + "</font>用户进行修改吗？",function(value){
	if(value){
		isc.RPCManager.sendRequest({
		    actionURL:"${pageContext.request.contextPath}/customer/update",
		    httpMethod:"POST",
		    params:{
		        "customer":customer	
		    },
		    callback:function(msg){
		    	Customer_FindUser();
		    	Customer_Form.clearValues();
		    	Customer_FormLayout.hide();
			    isc.say("修改成功");
			    return;
		    }
		});
	}
	});
}
Customer_FindUser();

	</script>
</body>
</html>
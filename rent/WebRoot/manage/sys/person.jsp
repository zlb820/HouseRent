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
    ID:"User_UserDS",
    dataFormat:"json",
    recordXPath:"/data",
    fetchDataURL:"${pageContext.request.contextPath}/find"
});

/**查询框*/
isc.DynamicForm.create({
    ID:"User_searchForm",
    autoDraw:false,
    width:"50%",
    numCols:6,
    colWidths:[100,120,120,120,120,"*"],
    fields:[
        {
            name:"username",
            type:"text",
            title:"用户名",
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
    ID:"User_searchButton",
    title:"查询",
    icon:"[SKIN]actions/view.png",
    showMenuIconOver:false,
    click:function(){
	    User_FindUser();
    }
});
/**添加按钮*/
isc.IconButton.create({
    ID:"User_AddButton",
    title:"添加",
    icon:"[SKIN]actions/add.png",
    showMenuIconOver:false,
    click:function(){
	    User_FormLayout.show();
	    User_saveButton.show();
	    User_UpdateSaveButton.hide();
	    User_UserList.deselectAllRecords();
	    User_Form.clearValues();
    }
});
/**删除按钮*/
isc.IconButton.create({
    ID:"User_DelButton",
    title:"删除",
    icon:"[SKIN]actions/remove.png",
    showMenuIconOver:false,
    click:function(){
	    User_DelUserInfo();
    }
});
/**修改按钮*/
isc.IconButton.create({
    ID:"User_UpdateButton",
    title:"修改",
    icon:"[SKIN]actions/edit.png",
    showMenuIconOver:false,
    click:function(){
   		User_GetUserInfo();
	    
    }
});

/**查询框的toolstrip*/
isc.ToolStrip.create({
    ID:"User_ToolStrip",
    width:"100%",
    height:25,
    members:[
        User_searchForm,
        //isc.LayoutSpacer.create({}),// 填充空白区域
        "separator",	
        User_searchButton,
        User_AddButton,
        User_DelButton,
        User_UpdateButton

    ]
});
/**成员列表*/
isc.ListGrid.create({
    ID:"User_UserList",
    canResizeFields:false,
    width:"100%",
    autoDraw:false,
    alternateRecordStyles:true,
    autoFetchData: false,
    selectionAppearance:"checkbox",
    dataSource:User_UserDS,
    fields:[
        {
            name:"id",
            showIf:"false"
        },{
            name:"username",
            title:"用户名"
        },{
            name:"sex",
            //showIf:"false",
            title:"性别"
        },{
            name:"birthDate",
            title:"出生日期"	,
            
        },{
            name:"realname",
            title:"真实姓名"
        },{
            name:"password",
            title:"密码"
        },{
            name:"email",
            title:"邮箱地址"
        },{
            name:"tel",
            title:"联系方式"
        },{
            name:"lastModifyTime",
            title:"最后操作时间",
        },{
        	name:"operator",
        	title:"操作人"
        }
    ],
   
});
/**
 * 右侧顶部表单
 */
isc.ToolStrip.create({
    ID:'User_clearToolStrip',
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
	            User_FormLayout.hide();
            }
        })
    ]
});
/**人员form*/
isc.DynamicForm.create({
    ID:"User_Form",
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
            defaultValue:"成员信息"
        },{
            name:"username",
            title:"用户名",
            required: true
        },{
            name:"sex",
            title:"性别",
            type:"radioGroup",
            width:100,
            defaultValue:"男",
            valueMap: ["男", "女"],
            vertical:false
          },{
            name:"birthDate",
            type:"date",
            useTextField:true,
            required: true, 
            title:"出生日期"
        },{
            name:"realname",
            required: true, 
            title:"真实姓名"
        },{
            name:"password",
            title:"密码",
            required: true, 
            keyPressFilter:"[0-9]",
           
        },{
            name:"email",
            title:"邮箱"
        },{
            name:"tel",
            title:"联系方式"	
        }
    ]
});

isc.ToolStripButton.create({
			ID:"User_saveButton",
            title:"保存",
            name:"savePersonButton",
            align:"right",
            visibility:"hidden",
            icon:"[SKIN]actions/save.png",
            click:function(){
	          User_SaveUserInfo();
            }
});
isc.ToolStripButton.create({
			ID:"User_UpdateSaveButton",
            title:"保存",
            name:"updatePersonButton",
            align:"right",
            visibility:"hidden",
            icon:"[SKIN]actions/save.png",
            click:function(){
	          User_UpdateUserInfo();
            }
});
/**
 * 人员toolstrip
 */
isc.ToolStrip.create({
    ID:'User_PersonButtonToolStrip',
    width:'100%',
    height:25,
    members:[
        isc.LayoutSpacer.create({
	        width:'*'
        }),
        "separator",
        User_saveButton,
        User_UpdateSaveButton,
        isc.ToolStripButton.create({
            title:"清空",
            align:"right",
            icon:"[SKIN]actions/close_Over.png",
            click:function(){
            	User_Form.clearValues();
            }
        })
    ]
});

/**
 * 人员信息布局
 */
isc.VLayout.create({
    ID:"User_FormLayout",
    autoDraw:false,
    visibility:"hidden", 
    overflow:"hidden",
    width:"55%",
    height:"100%",
    border:"1px solid #999",
    membersMargin:3,
    members:[
    	User_clearToolStrip,
        User_Form,
        isc.LayoutSpacer.create({
	        width:'*'
        }),
        // 出访地按钮
        User_PersonButtonToolStrip
    ]
});
/**列表与隐藏元素的左右布局*/
isc.HLayout.create({
	ID:"User_Hlayout",
	width:"100%",
	height:"100%",
	membersMargin:5,
	members:[
		 User_UserList,
		 User_FormLayout
	]
});
/**主体布局*/
isc.VLayout.create({
	ID:"User_vlayout",
	width:"90%",
	height:"100%",
	layoutLeftMargin:10,
	layoutTopMargin:10,
    membersMargin:5,
    members:[	
        User_ToolStrip,
        User_Hlayout
       
        
    ]
});

//------------------------------------------------------------function-----------------------------------------------
function User_FindUser(){
	var username = User_searchForm.getField("username").getValue();
	var startTime = User_searchForm.getField("startTime").getValue();
	var endTime = User_searchForm.getField("endTime").getValue();
	User_UserList.invalidateCache();
	User_UserList.fetchData({
		"username":username,
		"startTime"	:startTime,
		"endTime" : endTime
	}); 
	
}
function User_SaveUserInfo(){

	if(!User_Form.validate()){
		return;
	}
	var user = User_Form.getValues();
	//var file = User_Form.getField("files").getValue();
	isc.confirm("确认添加<font color='red'>" + user.username + "</font>用户吗？",function(value){
	if(value){
		isc.RPCManager.sendRequest({
		    actionURL:"${pageContext.request.contextPath}/add",
		    httpMethod:"POST",
		    params:{
		        "user":user
		    },
		    callback:function(msg){
		    	User_FindUser();
		    	User_Form.clearValues();
		    	User_FormLayout.hide();
			    isc.say("添加成功");
			    return;
		    }
		});
	}
	});
}
/**删除成员*/
function User_DelUserInfo(){
	var record = User_UserList.getSelectedRecords();
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
		    actionURL:"${pageContext.request.contextPath}/del",
		    httpMethod:"POST",
		    params:{
		        "ids":ids
		    },
		    callback:function(){
		    	User_FindUser();
			    isc.say("删除成功");
			    return;
		    }
		});
	}
	});
}
/**获取*/
function User_GetUserInfo(){
	var record = User_UserList.getSelectedRecord();
	if(!record){
		isc.say("请选择一项进行修改！");
		return;
	}
	User_Form.setData(record);
	User_FormLayout.show();
	User_saveButton.hide();
	User_UpdateSaveButton.show();
}
function User_UpdateUserInfo(){
	var record = User_UserList.getSelectedRecord();
	if(!User_Form.validate()){
		return;
	}
	var id =record.id;
	var user = User_Form.getValues();
	isc.confirm("确认对<font color='red'>" + record.username + "</font>用户进行修改吗？",function(value){
	if(value){
		isc.RPCManager.sendRequest({
		    actionURL:"${pageContext.request.contextPath}/update",
		    httpMethod:"POST",
		    params:{
		        "user":user
		    },
		    callback:function(msg){
		    	User_FindUser();
		    	User_Form.clearValues();
		    	User_FormLayout.hide();
			    isc.say("修改成功");
			    return;
		    }
		});
	}
	});
}
User_FindUser();

	</script>
</body>
</html>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<title></title>
	<SCRIPT>var isomorphicDir="../../isomorphic/";</SCRIPT>
	<script src="../../jsp/js/jquery-2.1.3.min.js"></script>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_Core.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_Foundation.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_Containers.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_Grids.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_Forms.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/system/modules/ISC_DataBinding.js></SCRIPT>
	<SCRIPT SRC=../../isomorphic/skins/TreeFrog/load_skin.js></SCRIPT>
	<SCRIPT SRC=../../jsp/f-js/utils/fUtils.js></SCRIPT>
	
</head>
<body style="background-color:#DAEADD;">
	<script type="text/javascript">
	
isc.RestDataSource.create({
    ID:"houseRent_UserDS",
    dataFormat:"json",
    recordXPath:"/data",
    fetchDataURL:"${pageContext.request.contextPath}/houseRent/find"
});
/**查询框*/
isc.DynamicForm.create({
    ID:"houseRent_SearchForm",
    autoDraw:false,
    width:"50%",
    numCols:12,
    colWidths:[80,100,80,100,80,100,80,100,80,"*"],
    fields:[
        {
            name:"searchValue",
            type:"text",
            title:"房屋标题",
            //required:true,
            width:100
        },{
	        name:"area",
            title:"所在区域",
            type:"select",
            width:100,
            defaultValue:0,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.address()
            })
        },{
            name:"houseSource",
            title:"来源",
            width:100,
           	type:"select",
           	defaultValue:0,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.houseSource()
            })
         },{
        	name:"startMoney",
        	title:"价格 起",
        	type:"text",
        	width:100
        	
        },{
        	name:"endMoney",
        	title:"价格 止",
        	type:"text",
        	width:100
        }
    ]
});
/**查询按钮*/
isc.IconButton.create({
    ID:"houseRent_searchButton",
    title:"查询",
    icon:"[SKIN]actions/view.png",
    showMenuIconOver:false,
    click:function(){
	    houseRent_findRentInfo();
    }
});
/**添加按钮*/
isc.IconButton.create({
    ID:"houseRent_AddButton",
    title:"添加",
    icon:"[SKIN]actions/add.png",
    showMenuIconOver:false,
    click:function(){
	    houseRent_FormLayout.show();
	    houseRent_saveButton.show();
	    houseRent_UpdateSaveButton.hide();
	    houseRent_UserList.deselectAllRecords();
	    houseRent_Form.clearValues();
    }
});
/**删除按钮*/
isc.IconButton.create({
    ID:"houseRent_DelButton",
    title:"删除",
    icon:"[SKIN]actions/remove.png",
    showMenuIconOver:false,
    click:function(){
	    houseRent_DelUserInfo();
    }
});
/**修改按钮*/
isc.IconButton.create({
    ID:"houseRent_UpdateButton",
    title:"修改",
    icon:"[SKIN]actions/edit.png",
    showMenuIconOver:false,
    click:function(){
   		 houseRent_GetHouseInfo();
	    
    }
});
/**上传按钮*/
isc.IconButton.create({
    ID:"houseRent_UpdloadButton",
    title:"上传图片",
    icon:"[SKIN]actions/edit.png",
    showMenuIconOver:false,
    click:function(){
   		houseRent_win.show();
	    
    }
});
/**查询框的toolstrip*/
isc.ToolStrip.create({
    ID:"houseRent_ToolStrip",
    width:"100%",
    height:25,
    members:[
        houseRent_SearchForm,
        //isc.LayoutSpacer.create({}),// 填充空白区域
        "separator",	
        houseRent_searchButton,
        houseRent_AddButton,
        houseRent_DelButton,
        houseRent_UpdateButton
       // houseRent_UpdloadButton

    ]
});
/**租房信息列表*/
isc.ListGrid.create({
    ID:"houseRent_UserList",
    canResizeFields:false,
    alternateRecordStyles:true,
    width:"100%",
    autoDraw:false,
    cellHeight:120,
    wrapCells: true,
    autoFetchData: false,
    selectionAppearance:"checkbox",
    dataSource:houseRent_UserDS,
    fields:[
        {
            name:"id",
            showIf:"false"
        },{
            name:"basicImg",
            title:"图片信息",
            type:"image",
            imageURLPrefix:"../../../",
            /*imageURLSuffix:".jpg", */
            canEdit:false,
            align:"center",
            imageWidth:150,
            imageHeight:100,
            width:200,
            showHover:true,
            hoverHTML:function(record,value,rowNum,colNum,grid){
            	return value;
            }
        },{
            name:"title",
            //showIf:"false",
            title:"房屋标题",
            width:150
        },{
            name:"area",
            title:"所在区域",
            width:100,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.address()
            })
        },{
            name:"proportation",
            title:"面积",
            width:70,
            formatCellValue(value,record){
            	return "<font color = 'red'>" +value + "</font>平方米";
            }
        },{
            name:"price",
            title:"价格",
            width:80,
            formatCellValue(value,record){
            	return "<font color = 'red'>￥" +value + "</font>元/月";
            }
        },{
            name:"way",
            title:"出租方式",
            width:100,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.way()
            })
        },{
            name:"hall",
            title:"房型",
            width:100,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.hall()
            })
        },{
            name:"houseSource",
            title:"来源",
            width:80,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.houseSource()
            })
         },{
        	name:"basicInfo",
        	title:"房屋基本描述",
        	showHover:true,
        	Width:300,
            hoverHTML:function(record,value,rowNum,colNum,grid){
            	return value;
            }
        }
    ],
   
});
/**
 * 右侧顶部表单
 */
isc.ToolStrip.create({
    ID:'houseRent_clearToolStrip',
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
	            houseRent_FormLayout.hide();
            }
        })
    ]
});
/**租房信息form*/
isc.DynamicForm.create({
    ID:"houseRent_Form",
    width:"100%",
    height:"100%",
    autoDraw:false,
    colWidths:[180,"*"],
    numCols:2,
    padding:20,
    cellPadding:8,
    overflow:"auto",
    // 标题文本上下显示
    titleOrientation:"top",
    fields:[
        {
            type:"header",
            defaultValue:"个人租房信息"
        },{
            name:"title",
            title:"房屋标题",
            required: true
        },{
            name:"area",
            title:"所在区域",
            type:"select",
            required: true,
           	displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.address()
            })
          },{
            name:"price",
            type:"text",
            required: true,
            title:"价格"
        },{
            name:"proportation",
            required: true,
            title:"面积"
        },{
            name:"hall",
            title:"房型",
           	type:"select",
           	required: true,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.hall()
            })
        },{
            name:"way",
            title:"出租方式",
            type:"select",
            displayField:"name",
            valueField:"code",
            required: true,
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.way()
            })
        },{
            name:"basicInfo",
            title:"房屋基本信息",
            colSpan:2,
            width:333,
            height:50,
            required: true,
            type:"textArea"	
        },{
            name:"location",
            title:"位置基本信息",
        },{
            name:"houseSource",
            title:"来源",
           	type:"select",
            displayField:"name",
            valueField:"code",
            required: true,
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.houseSource()
            })
        },{
            name:"direction",
            type:"text",
            title:"朝向"
        },{
            name:"floor",
            title:"楼层"
        },{
            name:"linkMan",
            title:"联系人",
            required: true
        },{
            name:"tel",
            title:"联系人电话",
            required: true
        },{
            name:"detailInfo",
            title:"房源详细信息",
            colSpan:2,
            width:333,
            height:50,
            type:"textArea"	
        }
         /* ,{
        	name:"basicImg",
        	title:"基本图片",
        	type:"imageFile",
        	colSpan:2,
        	width:100
        },{
        	name:"pic01",
        	title:"图片1",
        	type:"imageFile",
        	colSpan:2, 
        	width:100
        },{
        	name:"pic02",
        	title:"图片2",
        	type:"imageFile",
        	colSpan:2,
        	width:100
        },{
        	name:"pic03",
        	title:"图片3",
        	type:"imageFile",
        	colSpan:2,
        	width:100
        },{
        	name:"pic04",
        	title:"图片4",
        	type:"imageFile",
        	colSpan:2,
        	width:100
        } */
    ]
});
isc.Label.create({
	ID:"houseRent_Label",
	contents:"<a href='upload.jsp?>上传</a>"
});
isc.ToolStripButton.create({
			ID:"houseRent_saveButton",
            title:"保存",
            name:"savePersonButton",
            align:"right",
            visibility:"hidden",
            icon:"[SKIN]actions/save.png",
            click:function(){
	          houseRent_SaveUserInfo();
            }
});
isc.ToolStripButton.create({
			ID:"houseRent_UpdateSaveButton",
            title:"保存",
            name:"updatePersonButton",
            align:"right",
            visibility:"hidden",
            icon:"[SKIN]actions/save.png",
            click:function(){
	          houseRent_UpdateUserInfo();
            }
});
/**
 * 人员toolstrip
 */
isc.ToolStrip.create({
    ID:'houseRent_PersonButtonToolStrip',
    width:'100%',
    height:25,
    members:[
        isc.LayoutSpacer.create({
	        width:'*'
        }),
        "separator",
       // houseRent_Label,
        houseRent_saveButton,
        houseRent_UpdateSaveButton,
        isc.ToolStripButton.create({
            title:"清空",
            align:"right",
            icon:"[SKIN]actions/close_Over.png",
            click:function(){
	            // 保存出访地信息
	            houseRent_ResetVisitPlaceForm();
            }
        })
    ]
});

/**
 * 人员信息布局
 */
isc.VLayout.create({
    ID:"houseRent_FormLayout",
    autoDraw:false,
    visibility:"hidden", 
    overflow:"hidden",
    width:"55%",
    height:"100%",
    border:"1px solid #999",
    membersMargin:3,
    members:[
    	houseRent_clearToolStrip,
        houseRent_Form,
        isc.LayoutSpacer.create({
	        width:'*'
        }),
        // 出访地按钮
        houseRent_PersonButtonToolStrip
    ]
});
/**列表与隐藏元素的左右布局*/
isc.HLayout.create({
	ID:"houseRent_Hlayout",
	width:"100%",
	height:"100%",
	membersMargin:5,
	members:[
		 houseRent_UserList,
		 houseRent_FormLayout
	]
});
/**主体布局*/
isc.VLayout.create({
	ID:"houseRent_vlayout",
	width:"90%",
	height:"100%",
	layoutLeftMargin:10,
	layoutTopMargin:10,
    membersMargin:5,
    members:[	
        houseRent_ToolStrip,
        houseRent_Hlayout
       
        
    ]
});

isc.Window.create({
	ID:"houseRent_win",
    title: "Auto-sizing window",
    autoSize: true,
    visibility:"hidden",
    width:500,
    height:500,
    canDragReposition: true,
    canDragResize: true,
    items: [
       
    ]
});

//------------------------------------------------------------function-----------------------------------------------
function houseRent_findRentInfo(){
	var area = houseRent_SearchForm.getField("area").getValue();
	var searchValue = houseRent_SearchForm.getField("searchValue").getValue();
	var houseSource = houseRent_SearchForm.getField("houseSource").getValue();
	var startMoney = houseRent_SearchForm.getField("startMoney").getValue();
	var endMoney = houseRent_SearchForm.getField("endMoney").getValue();
	var house = houseRent_SearchForm.getValues();
	houseRent_UserList.invalidateCache();
	houseRent_UserList.fetchData({
		"area":area,
		"searchValue":searchValue,
		"houseSource":houseSource,
		"startMoney":startMoney,
		"endMoney":endMoney
	}); 
	
}
function houseRent_SaveUserInfo(){
	if(!houseRent_Form.validate()){
		return;
	}
	var house = houseRent_Form.getValues();
	isc.RPCManager.sendRequest({
	    actionURL:"${pageContext.request.contextPath}/houseRent/add",
	    httpMethod:"POST",
	    params:{
	        "house":house
	    },
	    callback:function(msg){
		    	houseRent_findRentInfo();
		    	houseRent_Form.clearValues();
		    	houseRent_FormLayout.hide();
			    isc.say("添加成功");
			    return;
		    }
	});
}
/**删除*/
function houseRent_DelUserInfo(){
	var record = houseRent_UserList.getSelectedRecords();
	if(record.length == 0){
		isc.say("请选择至少一项待删除");
		return;
	}
	var ids = new Array();
	for(var i=0;i< record.length;i++){
		ids[i] = record[i].id; 
	}
	isc.confirm("确认删除以下租房信息吗？",function(value){
	if(value){
		isc.RPCManager.sendRequest({
		    actionURL:"${pageContext.request.contextPath}/houseRent/del",
		    httpMethod:"POST",
		    params:{
		        "ids":ids
		    },
		    callback:function(){
		    	houseRent_findRentInfo();
			    isc.say("删除成功");
			    return;
		    }
		});
	}
	});
}

/**获取*/
function houseRent_GetHouseInfo(){
	var record = houseRent_UserList.getSelectedRecord();
	if(!record){
		isc.say("请选择一项进行修改！");
		return;
	}
	houseRent_Form.setData(record);
	houseRent_FormLayout.show();
	houseRent_saveButton.hide();
	houseRent_UpdateSaveButton.show();
}

function houseRent_UpdateUserInfo(){
	var record = houseRent_UserList.getSelectedRecord();
	if(!houseRent_Form.validate()){
		return;
	}
	var id =record.id;
	var house = houseRent_Form.getValues();
	isc.confirm("确认对<font color='red'>" + record.title + "</font>用户进行修改吗？",function(value){
	if(value){
		isc.RPCManager.sendRequest({
		    actionURL:"${pageContext.request.contextPath}/houseRent/update",
		    httpMethod:"POST",
		    params:{
		        "house":house
		    },
		    callback:function(msg){
		    	houseRent_findRentInfo();
		    	houseRent_Form.clearValues();
		    	houseRent_FormLayout.hide();
			    isc.say("修改成功");
			    return;
		    }
		});
	}
	});
}
houseRent_findRentInfo();
	</script>
 
</body>
</html>
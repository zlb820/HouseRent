<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<title></title>
	<%-- <base href="${pageContext.request.contextPath}/"/> --%>
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
    ID:"storeRent_UserDS",
    dataFormat:"json",
    recordXPath:"/data",
    fetchDataURL:"${pageContext.request.contextPath}/storeRent/find"
});
/**查询框*/
isc.DynamicForm.create({
    ID:"storeRent_SearchForm",
    autoDraw:false,
    width:"50%",
    numCols:12,
    colWidths:[80,90,60,100,90,100,60,90,80,80,80,"*"],
    fields:[
        {
            name:"searchValue",
            type:"text",
            title:"房屋标题",
            //required:true,
            width:100
        },{
	        name:"storeType",
            type:"select", 
            title:"类型",
            width:100,
            defaultValue:0,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.storeType()
            })
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
	        name:"storeSource",
            title:"来源",
            type:"select",
            width:100,
            defaultValue:0,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.storeSource()
            })
        },{
        	name:"startMoney",
        	title:"价格 起",
        	type:"text",
        	width:80
        	
        },{
        	name:"endMoney",
        	title:"价格 止",
        	type:"text",
        	width:80
        }
    ]
});
/**查询按钮*/
isc.IconButton.create({
    ID:"storeRent_searchButton",
    title:"查询",
    icon:"[SKIN]actions/view.png",
    showMenuIconOver:false,
    click:function(){
	    storeRent_findRentInfo();
    }
});
/**添加按钮*/
isc.IconButton.create({
    ID:"storeRent_AddButton",
    title:"添加",
    icon:"[SKIN]actions/add.png",
    showMenuIconOver:false,
    click:function(){
	    storeRent_FormLayout.show();
	    storeRent_saveButton.show();
	    storeRent_UpdateSaveButton.hide();
	    storeRent_UserList.deselectAllRecords();
	    storeRent_Form.clearValues();
    }
});
/**删除按钮*/
isc.IconButton.create({
    ID:"storeRent_DelButton",
    title:"删除",
    icon:"[SKIN]actions/remove.png",
    showMenuIconOver:false,
    click:function(){
	    storeRent_DelUserInfo();
    }
});
/**修改按钮*/
isc.IconButton.create({
    ID:"storeRent_UpdateButton",
    title:"修改",
    icon:"[SKIN]actions/edit.png",
    showMenuIconOver:false,
    click:function(){
    	storeRent_GetHouseInfo();
    }
});

/**查询框的toolstrip*/
isc.ToolStrip.create({
    ID:"storeRent_ToolStrip",
    width:"100%",
    height:25,
    members:[
        storeRent_SearchForm,
        //isc.LayoutSpacer.create({}),// 填充空白区域
        "separator",	
        storeRent_searchButton,
        storeRent_AddButton,
        storeRent_DelButton,
        storeRent_UpdateButton

    ]
});
/**租房信息列表*/
isc.ListGrid.create({
    ID:"storeRent_UserList",
    canResizeFields:false,
    alternateRecordStyles:true,
    width:"100%",
    autoDraw:false,
    cellHeight:120,
    wrapCells: true,
   /*  fixedRecordHeights: false, */
    autoFetchData: false,
    selectionAppearance:"checkbox",
    dataSource:storeRent_UserDS,
    fields:[
        {
            name:"id",
            showIf:"false"
        },{
            name:"basicImg",
            title:"图片信息",
            type:"image",
            imageURLPrefix:"../../../",
           /* imageURLSuffix:".jpg", */
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
            width:80,
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
            name:"type",
            title:"出租类型",
            width:100,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.storeType()
            })
        },{
            name:"classify",
            title:"分类",
            width:100,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.storeClassify()
            })
        },{
            name:"pubDate",
            //showIf:"false",
            title:"发布时间",
            width:80
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
    ID:'storeRent_clearToolStrip',
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
	            storeRent_FormLayout.hide();
            }
        })
    ]
});
/**租房信息form*/
isc.DynamicForm.create({
    ID:"storeRent_Form",
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
           	displayField:"name",
            valueField:"code",
            required: true,
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
            title:"面积",
            required: true
        },{
            name:"type",
            title:"类型",
           	type:"select",
            displayField:"name",
            valueField:"code",
            required: true,
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.storeType()
            })
        },{
            name:"classify",
            title:"分类",
            type:"select",
            displayField:"name",
            valueField:"code",
            required: true,
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.storeClassify()
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
            name:"supply",
            title:"供求方式",
            type:"select",
            displayField:"name",
            valueField:"code",
            required: true,
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.storeSupply()
            })
          },{
            name:"storeSource",
            title:"来源",
           	type:"select",
            displayField:"name",
            valueField:"code",
            required: true,
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.storeSource()
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
        	name:"file",
        	title:"基本图片",
        	type:"imageFile",
        	colSpan:2,
        	width:100
        },{
        	name:"file",
        	title:"图片1",
        	type:"imageFile",
        	colSpan:2, 
        	width:100
        },{
        	name:"file",
        	title:"图片2",
        	type:"imageFile",
        	colSpan:2,
        	width:100
        },{
        	name:"file",
        	title:"图片3",
        	type:"imageFile",
        	colSpan:2,
        	width:100
        },{
        	name:"file",
        	title:"图片4",
        	type:"imageFile",
        	colSpan:2,
        	width:100
        }, */
    ]
});
isc.ToolStripButton.create({
			ID:"storeRent_saveButton",
            title:"保存",
            name:"savePersonButton",
            align:"right",
            visibility:"hidden",
            icon:"[SKIN]actions/save.png",
            click:function(){
	          storeRent_SaveStoreInfo();
            }
});
isc.ToolStripButton.create({
			ID:"storeRent_UpdateSaveButton",
            title:"保存",
            name:"updatePersonButton",
            align:"right",
            visibility:"hidden",
            icon:"[SKIN]actions/save.png",
            click:function(){
	          storeRent_UpdateUserInfo();
            }
});
/**
 * 人员toolstrip
 */
isc.ToolStrip.create({
    ID:'storeRent_PersonButtonToolStrip',
    width:'100%',
    height:25,
    members:[
        isc.LayoutSpacer.create({
	        width:'*'
        }),
        "separator",
        storeRent_saveButton,
        storeRent_UpdateSaveButton,
        isc.ToolStripButton.create({
            title:"清空",
            align:"right",
            icon:"[SKIN]actions/close_Over.png",
            click:function(){
	            // 保存出访地信息
	            storeRent_ResetVisitPlaceForm();
            }
        })
    ]
});

/**
 * 人员信息布局
 */
isc.VLayout.create({
    ID:"storeRent_FormLayout",
    autoDraw:false,
    visibility:"hidden", 
    overflow:"hidden",
    width:"55%",
    height:"100%",
    border:"1px solid #999",
    membersMargin:3,
    members:[
    	storeRent_clearToolStrip,
        storeRent_Form,
        isc.LayoutSpacer.create({
	        width:'*'
        }),
        // 出访地按钮
        storeRent_PersonButtonToolStrip
    ]
});
/**列表与隐藏元素的左右布局*/
isc.HLayout.create({
	ID:"storeRent_Hlayout",
	width:"100%",
	height:"100%",
	membersMargin:5,
	members:[
		 storeRent_UserList,
		 storeRent_FormLayout
	]
});
/**主体布局*/
isc.VLayout.create({
	ID:"storeRent_vlayout",
	width:"90%",
	height:"100%",
	layoutLeftMargin:10,
	layoutTopMargin:10,
    membersMargin:5,
    members:[	
        storeRent_ToolStrip,
        storeRent_Hlayout
       
        
    ]
});

//------------------------------------------------------------function-----------------------------------------------
function storeRent_findRentInfo(){
	var area = storeRent_SearchForm.getField("area").getValue();
	var searchValue = storeRent_SearchForm.getField("searchValue").getValue();
	var storeSource = storeRent_SearchForm.getField("storeSource").getValue();
	var storeType = storeRent_SearchForm.getField("storeType").getValue();
	var startMoney = storeRent_SearchForm.getField("startMoney").getValue();
	var endMoney = storeRent_SearchForm.getField("endMoney").getValue();
	var house = storeRent_SearchForm.getValues();
	storeRent_UserList.invalidateCache();
	storeRent_UserList.fetchData({
		"area":area,
		"searchValue":searchValue,
		"storeSource":storeSource,
		"storeType":storeType,
		"startMoney":startMoney,
		"endMoney":endMoney
	}); 
}
function storeRent_SaveStoreInfo(){
	var store = storeRent_Form.getValues();
	//var file = storeRent_Form.getField("files").getValue();
	isc.RPCManager.sendRequest({
	    actionURL:"${pageContext.request.contextPath}/storeRent/add",
	    httpMethod:"POST",
	    params:{
	        "store":store
	    },
	    callback:function(msg){
		    	storeRent_findRentInfo();
		    	storeRent_Form.clearValues();
		    	storeRent_FormLayout.hide();
			    isc.say("添加成功");
			    return;
		    }
	});
}
/**删除*/
function storeRent_DelUserInfo(){
	var record = storeRent_UserList.getSelectedRecords();
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
		    actionURL:"${pageContext.request.contextPath}/storeRent/del",
		    httpMethod:"POST",
		    params:{
		        "ids":ids
		    },
		    callback:function(){
		    	storeRent_findRentInfo();
			    isc.say("删除成功");
			    return;
		    }
		});
	}
	});
}
/**获取*/
function storeRent_GetHouseInfo(){
	var record = storeRent_UserList.getSelectedRecord();
	if(!record){
		isc.say("请选择一项进行修改！");
		return;
	}
	storeRent_Form.setData(record);
	storeRent_FormLayout.show();
	storeRent_saveButton.hide();
	storeRent_UpdateSaveButton.show();
}

function storeRent_UpdateUserInfo(){
	var record = storeRent_UserList.getSelectedRecord();
	if(!storeRent_Form.validate()){
		return;
	}
	var id =record.id;
	var store = storeRent_Form.getValues();
	isc.confirm("确认对<font color='red'>" + record.title + "</font>用户进行修改吗？",function(value){
	if(value){
		isc.RPCManager.sendRequest({
		    actionURL:"${pageContext.request.contextPath}/storeRent/update",
		    httpMethod:"POST",
		    params:{
		        "store":store
		    },
		    callback:function(msg){
		    	storeRent_findRentInfo();
		    	storeRent_Form.clearValues();
		    	storeRent_FormLayout.hide();
			    isc.say("修改成功");
			    return;
		    }
		});
	}
	});
}
storeRent_findRentInfo();
	</script>
</body>
</html>
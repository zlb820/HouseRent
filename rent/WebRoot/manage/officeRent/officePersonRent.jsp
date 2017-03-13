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
    ID:"officeRent_UserDS",
    dataFormat:"json",
    recordXPath:"/data",
    fetchDataURL:"${pageContext.request.contextPath}/officeRent/find"
});
/**查询框*/
isc.DynamicForm.create({
    ID:"officeRent_SearchForm",
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
	        name:"officeType",
            type:"select", 
            title:"类别",
            width:100,
            defaultValue:0,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.officeType()
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
            name:"officeSource",
            title:"来源",
            type:"select",
            width:100,
            defaultValue:0,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.officeSource()
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
    ID:"officeRent_searchButton",
    title:"查询",
    icon:"[SKIN]actions/view.png",
    showMenuIconOver:false,
    click:function(){
	    officeRent_findRentInfo();
    }
});
/**添加按钮*/
isc.IconButton.create({
    ID:"officeRent_AddButton",
    title:"添加",
    icon:"[SKIN]actions/add.png",
    showMenuIconOver:false,
    click:function(){
	    officeRent_FormLayout.show();
	    officeRent_saveButton.show();
	    officeRent_UpdateSaveButton.hide();
	    officeRent_UserList.deselectAllRecords();
	    officeRent_Form.clearValues();
    }
});
/**删除按钮*/
isc.IconButton.create({
    ID:"officeRent_DelButton",
    title:"删除",
    icon:"[SKIN]actions/remove.png",
    showMenuIconOver:false,
    click:function(){
	    officeRent_DelUserInfo();
    }
});
/**修改按钮*/
isc.IconButton.create({
    ID:"officeRent_UpdateButton",
    title:"修改",
    icon:"[SKIN]actions/edit.png",
    showMenuIconOver:false,
    click:function(){
    		officeRent_GetHouseInfo();
    }
});

/**查询框的toolstrip*/
isc.ToolStrip.create({
    ID:"officeRent_ToolStrip",
    width:"100%",
    height:25,
    members:[
        officeRent_SearchForm,
        //isc.LayoutSpacer.create({}),// 填充空白区域
        "separator",	
        officeRent_searchButton,
        officeRent_AddButton,
        officeRent_DelButton,
        officeRent_UpdateButton

    ]
});
/**租房信息列表*/
isc.ListGrid.create({
    ID:"officeRent_UserList",
    canResizeFields:false,
    alternateRecordStyles:true,
    width:"100%",
    autoDraw:false,
    cellHeight:120,
    wrapCells: true,
   /*  fixedRecordHeights: false, */
    autoFetchData: false,
    selectionAppearance:"checkbox",
    dataSource:officeRent_UserDS,
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
            title:"类别",
            width:100,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.officeType()
            })
        },{
            name:"pubDate",
            title:"发布日期",
            width:100
        },{
            name:"officeSource",
            title:"来源",
             width:100,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.officeSource()
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
    ID:'officeRent_clearToolStrip',
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
	            officeRent_FormLayout.hide();
            }
        })
    ]
});
/**租房信息form*/
isc.DynamicForm.create({
    ID:"officeRent_Form",
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
            defaultValue:"写字楼信息"
        },{
            name:"title",
            title:"房屋标题",
            required: true
        },{
            name:"area",
            title:"所在区域",
            type:"select",
           	displayField:"name",
           	required: true,
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.address()
            })
          },{
            name:"price",
            type:"text",
            title:"价格",
            required: true
        },{
            name:"proportation",
            title:"面积",
            required: true
        },{
            name:"type",
            title:"类别",
           	type:"select",
            displayField:"name",
            valueField:"code",
            required: true,
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.officeType()
            })
        },{
            name:"officeSource",
            title:"来源",
            type:"select",
            displayField:"name",
            valueField:"code",
            required: true,
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.officeSource()
            })
        },{
            name:"basicInfo",
            title:"房屋基本信息",
            colSpan:2,
            width:333,
            height:50,
            type:"textArea",
            required: true	
        },{ 
            name:"location",
            title:"位置基本信息",
        },{
            name:"officeWay",
            title:"供求方式",
            type:"select",
            required: true,
            displayField:"name",
            valueField:"code",
            optionDataSource:isc.DataSource.create({
                clientOnly:true,
                testData:$.officeWay()
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
			ID:"officeRent_saveButton",
            title:"保存",
            name:"savePersonButton",
            align:"right",
            visibility:"hidden",
            icon:"[SKIN]actions/save.png",
            click:function(){
	          officeRent_SaveHouseInfo();
            }
});
isc.ToolStripButton.create({
			ID:"officeRent_UpdateSaveButton",
            title:"保存",
            name:"updatePersonButton",
            align:"right",
            visibility:"hidden",
            icon:"[SKIN]actions/save.png",
            click:function(){
	          officeRent_UpdateUserInfo();
            }
});
/**
 * 人员toolstrip
 */
isc.ToolStrip.create({
    ID:'officeRent_PersonButtonToolStrip',
    width:'100%',
    height:25,
    members:[
        isc.LayoutSpacer.create({
	        width:'*'
        }),
        "separator",
       officeRent_saveButton,
       officeRent_UpdateSaveButton,
       isc.ToolStripButton.create({
            title:"清空",
            align:"right",
            icon:"[SKIN]actions/close_Over.png",
            click:function(){
	            // 保存出访地信息
	            officeRent_ResetVisitPlaceForm();
            }
        })
    ]
});

/**
 * 人员信息布局
 */
isc.VLayout.create({
    ID:"officeRent_FormLayout",
    autoDraw:false,
    visibility:"hidden", 
    overflow:"hidden",
    width:"55%",
    height:"100%",
    border:"1px solid #999",
    membersMargin:3,
    members:[
    	officeRent_clearToolStrip,
        officeRent_Form,
        isc.LayoutSpacer.create({
	        width:'*'
        }),
        // 出访地按钮
        officeRent_PersonButtonToolStrip
    ]
});
/**列表与隐藏元素的左右布局*/
isc.HLayout.create({
	ID:"officeRent_Hlayout",
	width:"100%",
	height:"100%",
	membersMargin:5,
	members:[
		 officeRent_UserList,
		 officeRent_FormLayout
	]
});
/**主体布局*/
isc.VLayout.create({
	ID:"officeRent_vlayout",
	width:"90%",
	height:"100%",
	layoutLeftMargin:10,
	layoutTopMargin:10,
    membersMargin:5,
    members:[	
        officeRent_ToolStrip,
        officeRent_Hlayout
       
        
    ]
});

//------------------------------------------------------------function-----------------------------------------------
function officeRent_findRentInfo(){
	var area = officeRent_SearchForm.getField("area").getValue();
	var searchValue = officeRent_SearchForm.getField("searchValue").getValue();
	var officeSource = officeRent_SearchForm.getField("officeSource").getValue();
	var officeType = officeRent_SearchForm.getField("officeType").getValue();
	var startMoney = officeRent_SearchForm.getField("startMoney").getValue();
	var endMoney = officeRent_SearchForm.getField("endMoney").getValue();
	var house = officeRent_SearchForm.getValues();
	officeRent_UserList.invalidateCache();
	officeRent_UserList.fetchData({
		"area":area,
		"searchValue":searchValue,
		"officeSource":officeSource,
		"officeType":officeType,
		"startMoney":startMoney,
		"endMoney":endMoney
	}); 
}
function officeRent_SaveHouseInfo(){
	var office = officeRent_Form.getValues();
	//var file = officeRent_Form.getField("files").getValue();
	isc.RPCManager.sendRequest({
	    actionURL:"${pageContext.request.contextPath}/officeRent/add",
	    httpMethod:"POST",
	    params:{
	        "office":office
	    },
	    callback:function(msg){
		    	officeRent_findRentInfo();
		    	officeRent_Form.clearValues();
		    	officeRent_FormLayout.hide();
			    isc.say("添加成功");
			    return;
		    }
	});
}
/**删除*/
function officeRent_DelUserInfo(){
	var record = officeRent_UserList.getSelectedRecords();
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
		    actionURL:"${pageContext.request.contextPath}/officeRent/del",
		    httpMethod:"POST",
		    params:{
		        "ids":ids
		    },
		    callback:function(){
		    	officeRent_findRentInfo();
			    isc.say("删除成功");
			    return;
		    }
		});
	}
	});
}
/**获取*/
function officeRent_GetHouseInfo(){
	var record = officeRent_UserList.getSelectedRecord();
	if(!record){
		isc.say("请选择一项进行修改！");
		return;
	}
	officeRent_Form.setData(record);
	officeRent_FormLayout.show();
	officeRent_saveButton.hide();
	officeRent_UpdateSaveButton.show();
}

function officeRent_UpdateUserInfo(){
	var record = officeRent_UserList.getSelectedRecord();
	if(!officeRent_Form.validate()){
		return;
	}
	var id =record.id;
	var office = officeRent_Form.getValues();
	isc.confirm("确认对<font color='red'>" + record.title + "</font>用户进行修改吗？",function(value){
	if(value){
		isc.RPCManager.sendRequest({
		    actionURL:"${pageContext.request.contextPath}/officeRent/update",
		    httpMethod:"POST",
		    params:{
		        "office":office
		    },
		    callback:function(msg){
		    	officeRent_findRentInfo();
		    	officeRent_Form.clearValues();
		    	officeRent_FormLayout.hide();
			    isc.say("修改成功");
			    return;
		    }
		});
	}
	});
}
officeRent_findRentInfo();
	</script>
</body>
</html>
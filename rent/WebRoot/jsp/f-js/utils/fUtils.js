$.extend({
	address:function(){
		var data = [
		            {code:'0',name:"全北京"},{code:'1',name:"朝阳"},{code:'2',name:"海淀"},
		            {code:'4',name:'东城'},{code:'5',name:'西城'},{code:'6',name:'丰台'},
		            {code:'7',name:'通州'},{code:'8',name:'石景山'},{code:'9',name:'昌平'},
		            {code:'10',name:'崇文'},{code:'11',name:'宣武'},{code:'12',name:'房山'},
		            {code:'13',name:'大兴'},{code:'14',name:'顺义'},{code:'15',name:'密云'},
		            {code:'16',name:'怀柔'},{code:'17',name:'延庆'},{code:'18',name:'平谷'}
		           ];
		return data;
	},
	getAddress:function(code){
		var result = '';
		$.each(this.address(),function(){
			if(this.code==code){
				result = this.name;
			}
		});
		return result;
	},
	/**租房**/
	hall:function(){
		var data = [{code:'0',name:"全部"},{code:'1',name:"一室一厅"},{code:'2',name:"二室一厅"},{code:'3',name:'三室一厅'},{code:'4',name:'四室一厅'}];
		return data;
	},
	getHall:function(code){
		var result = '';
		$.each(this.hall(),function(){
			if(this.code==code){
				result = this.name;
			}
		});
		return result;
	},
	way:function(){
		var data = [{code:'0',name:"全部"},{code:'1',name:"整套出租"},{code:'2',name:"单间出租"},{code:'3',name:'床位出租'}];
		return data;
	},
	getWay:function(code){
		var result = '';
		$.each(this.way(),function(){
			if(this.code==code){
				result = this.name;
			}
		});
		return result;
	},
	houseSource:function(){
		var data = [{code:'0',name:"全部"},{code:'1',name:"个人"},{code:'2',name:"经纪人"}];
		return data;
	},
	getHouseSource:function(code){
		var result = '';
		$.each(this.houseSource(),function(){
			if(this.code==code){
				result = this.name;
			}
		});
		return result;
	},
	
	/**商铺*/
	storeClassify:function(){
		var data = [{code:'0',name:"全部"},{code:'1',name:"商铺租售"},{code:'2',name:"生意转让"}];
		return data;
	},
	getStoreClassify:function(code){
		var result = '';
		$.each(this.storeClassify(),function(){
			if(this.code==code){
				result = this.name;
			}
		});
		return result;
	},
	storeSupply:function(){
		var data = [{code:'0',name:'全部'},{code:'1',name:'出租'},{code:'2',name:'出售'},{code:'3',name:'求租'},{code:'4',name:'求购'}];
		return data;
	},
	getStoreSupply:function(code){
		var result = '';
		$.each(this.storeSupply(),function(){
			if(this.code==code){
				result = this.name;
			}
		});
		return result;
	},
	storeType:function(){
		var data = [{code:'0',name:'全部'},{code:'1',name:'商业街卖场'},{code:'2',name:'写字楼配套'},{code:'3',name:'住宅底商'},{code:'4',name:'摊位柜台'},{code:'5',name:'其他'}];
		return data;
	},
	getStoreType:function(code){
		var result = '';
		$.each(this.storeType(),function(){
			if(this.code==code){
				result = this.name;
			}
		});
		return result;
	},
	storeSource:function(){
		var data = [{code:'0',name:"全部"},{code:'1',name:"个人"},{code:'2',name:"商家"}];
		return data;
	},
	getStoreSource:function(code){
		var result = '';
		$.each(this.storeSource(),function(){
			if(this.code==code){
				result = this.name;
			}
		});
		return result;
	},
	/**写字楼**/
	officeType:function(){
		var data = [{code:'0',name:'全部'},{code:'1',name:'写字楼'},{code:'2',name:'商务中心'},{code:'3',name:'商住公寓'}];
		return data;
	},
	getOfficeType:function(code){
		var result = '';
		$.each(this.officeType(),function(){
			if(this.code==code){
				result = this.name;
			}
		});
		return result;
	},
	officeWay:function(){
		var data = [{code:'0',name:'全部'},{code:'1',name:'出租'},{code:'2',name:'出售'},{code:'3',name:'求租'},{code:'4',name:'求购'}];
		return data;
	},
	getOfficeWay:function(code){
		var result = '';
		$.each(this.officeWay(),function(){
			if(this.code==code){
				result = this.name;
			}
		});
		return result;
	},
	
	officeSource:function(){
		var data = [{code:'0',name:"全部"},{code:'1',name:"个人"},{code:'2',name:"经纪人"}];
		return data;
	},
	getOfficeSource:function(code){
		var result = '';
		$.each(this.officeSource(),function(){
			if(this.code==code){
				result = this.name;
			}
		});
		return result;
	},
	
});

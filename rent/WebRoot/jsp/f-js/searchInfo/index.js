var index = (function(){
	var _index = {
			initRentalSerach : function(){
				
			},
			initOffice : function(){
				
			},
			initStore : function(){
				
			},
			RentalSearch:function(){
				var _this = this;
				$.post(contextUrl()+"/houseRent/listRecommend?"+new Date().getTime(),function(pager){
					var aaData = pager.aaData;
					$.each(aaData,function(){
						var cell = ' <div class="cell tile fg-white" data-role="tile" data-id='+(this.id||'')+'>'+
									                '<div class="tile-content slide-up">'+
									                    '<div class="slide">'+
									                        '<img src="jsp/images/detail01.jpg" data-role="fitImage" data-format="square">'+
									                    '</div>'+
									                    '<div class="slide-over op-cyan text-small padding10">'+(this.basicInfo||'')+'</div>'+
									                    '<div class="tile-label">'+(this.title||'')+'￥'+(this.price||'')+'/月'+'</div>'+
									               ' </div>'+   
					                       '</div>'
							$("#seeAgain .row").append(cell);
					});
				},'json');
			},
	};
	return {
		_index.initRentalSerach();
		_index.initOffice();
		_index.initStore();
	};
	
})();
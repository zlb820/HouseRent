var DetailStore = (function(){
	var _DetailStore = {
			initSeeAgain:function(){
				this.seeAgain();
			},
			initHot:function(){
				this.hot();
			},
			seeAgain:function(){
				var _this = this;
				$.post(contextUrl()+"/storeRent/listSeeAgain?"+new Date().getTime(),function(pager){
					var aaData = pager.aaData;
					$.each(aaData,function(){
						var cell = ' <div class="cell tile fg-white" data-role="tile" data-id='+(this.id||'')+'>'+
									                '<div class="tile-content slide-up">'+
									                    '<div class="slide">'+
									                        '<img src="" data-role="fitImage" data-format="square">'+
									                    '</div>'+
									                    '<div class="slide-over op-cyan text-small padding10">'+(this.basicInfo||'')+'</div>'+
									                    '<div class="tile-label">'+(this.title||'')+'￥'+(this.price||'')+'/月'+'</div>'+
									               ' </div>'+   
					                       '</div>';
						cell = $(cell);
					    $("img",cell).attr('src',(this.basicImg||''));
							$("#seeAgain .row").append(cell);
					});
					$(".cell .tile-content div").click(function(){
						//alert($(this).parents('.row').data('id'));
						var id = $(this).parents('.cell').data('id');
						location.href = contextUrl()+"/storeRent/get?id="+id;
					});
				},'json');
			},
			hot:function(){
				var _this = this;
				$.post(contextUrl()+"/storeRent/listHot?"+new Date().getTime(),function(pager){
					var aaData = pager.aaData;
					$.each(aaData,function(){
						var cell = ' <div class="cell tile fg-white" data-role="tile" data-id='+(this.id||'')+'>'+
									                '<div class="tile-content slide-up">'+
									                    '<div class="slide">'+
									                        '<img src="" data-role="fitImage" data-format="square">'+
									                    '</div>'+
									                    '<div class="slide-over op-cyan text-small padding10">'+(this.basicInfo||'')+'</div>'+
									                    '<div class="tile-label">'+(this.title||'')+'￥'+(this.price||'')+'/月'+'</div>'+
									               ' </div>'+   
					                       '</div>';
							cell = $(cell);
					    	$("img",cell).attr('src',(this.basicImg||''));
							$("#Detail_rightFloat p").after(cell);
							/*$("#Detail_rightFloat").append(cell);*/
					});
					$(".cell .tile-content div").click(function(){
						var id = $(this).parents('.cell').data('id');
						location.href = contextUrl()+"/storeRent/get?id="+id;
					});
				},'json');
			},
	};
	return{
		init: function(){
			_DetailStore.initSeeAgain();
			_DetailStore.initHot();
		}
	};
})();

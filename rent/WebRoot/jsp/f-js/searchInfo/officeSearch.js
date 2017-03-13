var officeSearch = (function(){
	var _officeSearch = {
			initArea:function(){
				var index = 0;
				$.each($.address(),function(){
					var $a = $("<a/>");
					if(index==0){
						$a.addClass('fg-red padding10');
					}else{
						$a.addClass('fg-grayLight padding10');
					}
					$a.data('code',this.code);
					$a.text(this.name);
					$("#area").append($a);
					index++;
				})
			},
			initOfficeType:function(){
				var index = 0;
				$.each($.officeType(),function(){
					var $a = $("<a/>");
					if(index==0){
						$a.addClass('fg-red padding10');
					}else{
						$a.addClass('fg-grayLight padding10');
					}
					$a.data('code',this.code);
					$a.text(this.name);
					$("#officeType").append($a);
					index++;
				})
			},
			initOfficeSource:function(){
				var index = 0;
				$.each($.officeSource(),function(){
					var $a = $("<a/>");
					if(index==0){
						$a.addClass('fg-red padding10');
					}else{
						$a.addClass('fg-grayLight padding10');
					}
					$a.data('code',this.code);
					$a.text(this.name);
					$("#officeSource").append($a);
					index++;
				})
			},
			initOfficeWay:function(){
				var index = 0;
				$.each($.officeWay(),function(){
					var $li = $("<li/>");
					var $a = $("<a/>");
					if(index == 0){
						$a.addClass("act");
					}
					$a.data('code',this.code);
					$a.text(this.name).attr('href','#frame_1_1');
					$li.append($a);
					$("#officeWay .tabs").append($li);
					index++;	
				})
			},
			initEvent:function(){
				var _this = this;
				$(".minor-header a").click(function(){
					$(this).parent('.minor-header').find('a.fg-red').removeClass('fg-red').addClass('fg-grayLight');
					$(this).removeClass('fg-grayLight').addClass('fg-red');
					_this.initSearch();
				});
				$(".tabs li a").click(function(){
					$(this).parents('.tabs').find('a.act').removeClass('act');
					$(this).addClass('act');
					_this.initSearch();
				});
				$("#searchBtn").click(function(){
					_this.initSearch();
				});
			},
			initSearch:function(){
				this.search();
			},
			initSeeAgain:function(){
				this.seeAgain();
			},
			search:function(iDisplayStart){
				var _this = this;
				var area = $("#area a.fg-red").data('code');
				var officeType = $("#officeType a.fg-red").data('code');
				var officeSource = $("#officeSource a.fg-red").data('code');
				var officeWay = $("#officeWay .tabs a.act").data('code');
				var startMoney = $("[name='startMoney']").val();
				var endMoney = $("[name='endMoney']").val();
				var startSquear = $("[name='startSquear']").val();
				var endSquear = $("[name='endSquear']").val();
				var searchValue = $("[name='searchValue']").val();
				var param = {
						area:area,
						officeType:officeType,
						officeSource:officeSource,
						officeWay:officeWay,
						startMoney:startMoney,
						endMoney:endMoney,
						startSquear:startSquear,
						endSquear:endSquear,
						searchValue:searchValue,
						iDisplayLength:10,
						iDisplayStart:iDisplayStart||0
				};
				$.post(contextUrl()+"/officeRent/list?"+new Date().getTime(),param,function(pager){
					var aaData = pager.aaData;
					$("#frame_1_1 .grid").empty();
					$.each(aaData,function(){
						var cell=' <div class="row cells12" data-id='+(this.id||'')+'>'+
				            '<div class="cell colspan2">'+
					             '<img src="">'+
				            '</div>'+
				           '<div class="cell colspan6">'+
					           '<ul class="store_Ulinfo">'+
						          ' <li class="fg-blue sub-header padding2">'+(this.title||'')+'</li>'+
						           '<li class="padding2">'+(this.basicInfo||'')+'</li>'+
						           '<li class="padding2">'+(this.location||'')+'</li>'+
					          ' </ul>'+
				            '</div>'+
				            '<div class="cell colspan2 align-center padding30 no-padding-left no-padding-right"><span class="fg-red sub-header">'+(this.price||'')+'</span>元/月</div>'+
				            '<div class="cell colspan2 align-center padding30 no-padding-left no-padding-right"><span class="fg-red sub-header">'+(this.proportation||'')+'</span>平方米</div>'+
				        '</div>';
						cell = $(cell);
					    $("img",cell).attr('src',(this.basicImg||''));
						$("#frame_1_1 .grid").append(cell);
					});
					var total = Math.floor(pager.iTotalDisplayRecords/pager.iDisplayLength)+1;
					var currIndex = Math.floor(pager.iDisplayStart/pager.iDisplayLength)+1;
					$("#pager .inner").remove();
					for(var i = total;i>0;i--){
						var $span = $("<span/>").addClass('item').addClass('inner').html(i);
						if(i==currIndex){
							$span.addClass('current');
						}
						$("#pager span:first").after($span);
					}
					$("#pager span:first").click(function(){
						var currIndex = +$("#pager .current").html();
						if(currIndex>1){
							_this.search((currIndex-2)*pager.iDisplayLength);
						}
					});
					$("#pager span:last").click(function(){
						var lastIndex = +$(this).prev().html();
						var currIndex = +$("#pager .current").html();
						if(currIndex<lastIndex){
							_this.search(currIndex*pager.iDisplayLength);
						}
					});
					$("#pager .inner").click(function(){
						_this.search((+$(this).html()-1)*pager.iDisplayLength);
					});
					$("#frame_1_1 div img").click(function(){
						//alert($(this).parents('.row').data('id'));
						var id = $(this).parents('.row').data('id');
						location.href = contextUrl()+"/officeRent/get?id="+id;
					});
				},'json');
			},
			seeAgain:function(){
				var _this = this;
				$.post(contextUrl()+"/officeRent/listSeeAgain?"+new Date().getTime(),function(pager){
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
						location.href = contextUrl()+"/officeRent/get?id="+id;
					});
				},'json');
			},
	};
	return {
		init : function(){
			_officeSearch.initArea();
			_officeSearch.initOfficeType();
			_officeSearch.initOfficeSource();
			_officeSearch.initOfficeWay();
			_officeSearch.initSearch();
			_officeSearch.initSeeAgain();
			_officeSearch.initEvent();
			$("#officeWay .tabs a:first").click();
		}
	};
})();
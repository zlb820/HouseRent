var analysis = (function(){
	var _analysis = {
			initAnalysis:function(){
				this.annaly();
			},
			annaly:function(){
				/*$.post(contextUrl()+"/customer/pie",function(fileName){
					console.log(fileName);
					$("#pie img").attr("src","chart.jpg?fileName="+fileName);
				},'html');*/
				
				$.ajax({
	  				url:contextUrl()+'/customer/pie',
	  				type:'post',
	  				dataType:'text',
	  				async:true,
	  				success:function(fileName){
	  					$("#pie img").attr("src","customer/chart?fileName="+fileName);
	  				}
	  			});
			},
	};
	return {
		init : function(){
			_analysis.initAnalysis();
		}
	}
})();
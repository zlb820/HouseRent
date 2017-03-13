
/*

  SmartClient Ajax RIA system
  Version v9.1p_2014-11-06/Pro Development Only (2014-11-06)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF THE
     SOFTWARE LICENSE AGREEMENT. If you have received this file without an 
     Isomorphic Software license file, please see:

         http://www.isomorphic.com/licenses/license-sisv.html

     You are not required to accept this agreement, however, nothing else
     grants you the right to copy or use this software. Unauthorized copying
     and use of this software is a violation of international copyright law.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. YOU ARE EXPRESSLY PROHIBITED
     FROM ATTEMPTING TO REVERSE ENGINEER THIS SOFTWARE OR MODIFY THIS
     SOFTWARE FOR HUMAN READABILITY.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

if(window.isc&&window.isc.module_Core&&!window.isc.module_Charts){isc.module_Charts=1;isc._moduleStart=isc._Charts_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'Charts load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;

if (window.isc && isc.version != "v9.1p_2014-11-06/Pro Development Only") {
    isc.logWarn("SmartClient module version mismatch detected: This application is loading the core module from "
        + "SmartClient version '" + isc.version + "' and additional modules from 'v9.1p_2014-11-06/Pro Development Only'. Mixing resources from different "
        + "SmartClient packages is not supported and may lead to unpredictable behavior. If you are deploying resources "
        + "from a single package you may need to clear your browser cache, or restart your browser."
        + (isc.Browser.isSGWT ? " SmartGWT developers may also need to clear the gwt-unitCache and run a GWT Compile." : ""));
}
isc.ClassFactory.defineInterface("Chart").addInterfaceMethods({
valueProperty:"_value",
metricFacetId:"metric",
stacked:false,
isStacked:function(context){
    return(context||this).stacked;
},
chartType:"Column",
threeD:true,
animateValuesOnShow:true,
labelValues:false,
setupChart:function(){
    if(this.facets!=null&&!isc.isAn.Array(this.facets)){
        this.facets=[this.facets];
    }
    var inlinedFacet=this.inlinedFacet=this.facets.find("inlinedValues",true);
    if(inlinedFacet)inlinedFacet.id=inlinedFacet.id||"inlined";
    this.metricFacet=null;
    for(var i=0;i<this.facets.length;i++){
        var facet=this.facets[i];
        this.deriveFacetValues(facet);
        if(facet.values){
            if(facet.id==this.metricFacetId){
                this.metricFacet=facet;
            }
            facet.valueIds=facet.values.getProperty("id");
        }else{
            this.logWarn(
                "Facet '"+facet.id+"' has no values declared, and none could be derived "+
                "from the data.  This facet will not be used by the chart.");
            this.facets.removeAt(i);
            --i;
        }
    }
    if(this.metricFacet!=null){
        for(var i=this.metricFacet.values.length;i--;){
            this._deriveMetricFacetValueType(this.metricFacet.values[i]);
        }
    }
},
getFacetData:function(){
    if(this.facetData&&this.data==this._lastFacetData)return this.facetData;
    var data=this.data;
    if(!isc.isAn.Array(data))return data;
    var facetData=[];
    for(var i=0;i<data.length;i++){
        var record=data[i],
            inFacets=(record!=null);
        for(var j=0;inFacets&&j<this.facets.length;j++){
            var facet=this.facets[j];
            if(facet==this.inlinedFacet||facet.autoDerived)continue;
            if(!facet.valueIds.contains(record[facet.id],null,this._comparator)){
                inFacets=false;
            }
        }
        if(inFacets)facetData.add(record);
    }
    this._lastFacetData=data;
    return(this.facetData=facetData);
},
_comparator:Array.DATETIME_VALUES,
deriveFacetValues:function(facet){
    if(facet.values&&!facet.autoDerived)return;
    var comparator=this._comparator,
        facetId=facet.id,
        facetValues=[],
        dataLength=0;
    if(this.data!=null&&isc.isA.List(this.data)){
        dataLength=this.data.getLength();
    }
    for(var i=0;i<dataLength;++i){
        var obj=this.data.get(i),
           facetValueId=(obj!=null?obj[facetId]:null);
        if(facetValueId!=null&&facetValues.findIndex("id",facetValueId,comparator)==-1){
            facetValues.add({id:facetValueId,title:facetValueId});
        }
    }
    if(facetValues.length>0){
        facet.autoDerived=true;
        facet.values=facetValues;
    }else{
        delete facet.autoDerived;
        delete facet.values;
    }
},
_deriveMetricFacetValueType:function(metricFacetValue){
    var metricFacetId=this.metricFacetId,
        criteria={};
    criteria[metricFacetId]=metricFacetValue.id;
    var values=this.getValue(criteria,true,true),
        allNulls=true,
        isTypeDate=!!values;
    for(var i=isTypeDate&&values.length;isTypeDate&&i--;){
        var value=values[i],
            valueIsNull=(value==null);
        allNulls=allNulls&&valueIsNull;
        isTypeDate=(valueIsNull||isc.isA.Date(value));
    }
    isTypeDate=isTypeDate&&!allNulls;
    metricFacetValue._type=(isTypeDate?"date":"number");
},
_isDateValued:function(metricId){
    var isScatter=this.chartType=="Scatter",
        metricFacet=isScatter&&this.metricFacet,
        metricFacetValue=metricFacet&&this.getFacetValue(metricFacet.id,metricId);
    return(metricFacetValue&&metricFacetValue._type=="date");
},
getFacet:function(facetId){
    return this.facets.find("id",facetId);
},
getFacetValue:function(facetId,facetValueId){
    var facet=this.getFacet(facetId);
    if(facet)return facet.values.find("id",facetValueId,this._comparator);
},
isMultiFacet:function(){
    var numFacets=(this.facets&&this.facets.length)||0;
    return(numFacets>(this.metricFacet!=null?2:1));
},
getValue:function(facetValues,multiple,dontParseFloat){
    var data=this.getFacetData();
    if(data==null)return null;
    facetValues=facetValues||{};
    if(multiple==null)multiple=this.multiCellData;
    var record=this.getDataRecord(facetValues,multiple);
    if(!record)return null;
    return this.getValueFromRecord(record,facetValues,multiple,dontParseFloat);
},
getValueFromRecord:function(record,facetValues,multiple,dontParseFloat){
    if(record==null)return null;
    if(!this.metricFacet){
        if(!this.inlinedFacet||(facetValues&&facetValues[this.inlinedFacet.id]!=null)){
            var property=this.inlinedFacet?facetValues[this.inlinedFacet.id]:this.valueProperty;
            if(multiple){
                var values=record.getProperty(property);
                return(dontParseFloat?values:values.map(parseFloat));
            }else{
                var value=record[property];
                return(dontParseFloat?value:parseFloat(value));
            }
        }
        var records=isc.isAn.Array(record)?record:[record],
            values=[],
            inlinedValues=this.inlinedFacet.valueIds;
        for(var i=0;i<records.length;i++){
            for(var j=0;j<inlinedValues.length;j++){
                var value=records[i][inlinedValues[j]];
                values.add(dontParseFloat?value:parseFloat(value));
            }
        }
        if(!multiple&&values.length<2)return values[0];
        else return values;
    }else{
        if(!this.inlinedFacet||this.metricFacetId!=this.inlinedFacet.id){
            this.logWarn("the metric facet must be an inlined facet");
            return null;
        }
        var metricId=facetValues[this.metricFacet.id];
        if(!metricId)metricId=this.getDefaultMetric();
        if(multiple){
            var values=record.getProperty(metricId);
            return(dontParseFloat?values:values.map(parseFloat));
        }else{
            var value=record[metricId];
            return(dontParseFloat?value:parseFloat(value));
        }
    }
},
getDataRecord:function(facetValues,multiple){
    var data=this.getFacetData();
    if(!isc.isAn.Array(data))return data;
    if(multiple==null)multiple=this.multiCellData;
    if(!this.inlinedFacet){
        return(multiple?
            data.findAll(facetValues,null,this._comparator):
            data.find(facetValues,null,this._comparator));
    }
    var criteria=isc.addProperties({},facetValues);
    delete criteria[this.inlinedFacet.id];
    if(isc.isAn.emptyObject(criteria)){
        return(multiple?data.duplicate():data[0]);
    }else{
        return(multiple?
            data.findAll(criteria,null,this._comparator):
            data.find(criteria,null,this._comparator));
    }
},
getDataSeries:function(facetId,otherFacetValues){
    var facet=isc.isAn.Object(facetId)?facetId:this.facets.find("id",facetId);
    if(otherFacetValues==null){
        otherFacetValues={};
    }else if(!isc.isAn.Object(otherFacetValues)){
        var otherFacetValueId=otherFacetValues;
        var otherFacet=(facet==this.facets[0]?this.facets[1]:this.facets[0]);
        otherFacetValues={};
        otherFacetValues[otherFacet.id]=otherFacetValueId;
    }else{
        otherFacetValues=isc.addProperties({},otherFacetValues);
    }
    var dontParseFloat=false;
    if(this.metricFacet!=null){
        var metricId=otherFacetValues[this.metricFacet.id];
        if(!metricId)metricId=this.getDefaultMetric();
        otherFacetValues[this.metricFacet.id]=metricId;
        dontParseFloat=!this._isDateValued(metricId);
    }
    var series=[];
    for(var i=0;i<facet.values.length;i++){
        var facetValue=facet.values[i];
        otherFacetValues[facet.id]=facetValue.id;
        var record=this.getDataRecord(otherFacetValues),
            value=this.getValueFromRecord(record,otherFacetValues,false,dontParseFloat);
        series.add({
            facetValueId:facetValue.id,
            title:(facetValue.title||facetValue.id),
            value:value,
            record:record
        });
    }
    return series;
},
getDefaultMetric:function(){
    return this.metricFacet?this.metricFacet.values.first().id:this.valueProperty;
},
getMinValue:function(metricId,recalc,context,considerPartialSums,logScale){
    return this.getMaxValue(metricId,recalc,context,considerPartialSums,logScale,false);
},
getMaxValue:function(metricId,recalc,context,considerPartialSums,logScale,wantMax){
    context=context||this;
    if(wantMax==null)wantMax=true;
    if(!metricId)metricId=this.getDefaultMetric();
    var cache;
    if(wantMax){
        cache=context.cachedMaxValues=context.cachedMaxValues||{};
    }else{
        cache=context.cachedMinValues=context.cachedMinValues||{};
    }
    var key=(
            metricId+"_"+
            (considerPartialSums?"true":"false")+"_"+
            (logScale?"true":"false"));
    if(!recalc&&cache[key]!=null){
        return cache[key];
    }
    var isExtraAxisChart=(context!=this);
    var valuesAreDates=this._isDateValued(metricId);
    logScale=logScale&&!valuesAreDates;
    var max=null;
    if(this.isMultiFacet()&&this.chartType!="Scatter"&&(!isExtraAxisChart||context.isMultiFacet())){
        var stackFacet=this.facets[1],
            otherFacet=this.facets[0],
            otherFacetValues={};
        if(this.metricFacet)otherFacetValues[this.metricFacet.id]=metricId;
        for(var i=0;i<otherFacet.values.length;i++){
            otherFacetValues[otherFacet.id]=otherFacet.values[i].id;
            var series=this.getDataSeries(stackFacet,otherFacetValues),
                values=series.getProperty("value"),
                seriesValue=null;
            if(this.isStacked(context)){
                if(considerPartialSums){
                    var sum=0;
                    for(var j=0,numValues=values.length;j<numValues;++j){
                        var value=values[j];
                        if(isc.isA.Number(value)){
                            sum+=value;
                            if(!logScale||sum>0){
                                if(seriesValue==null){
                                    seriesValue=sum;
                                }else{
                                    seriesValue=(wantMax?Math.max(seriesValue,sum):Math.min(seriesValue,sum));
                                }
                            }
                        }
                    }
                    if(seriesValue==null&&!logScale){
                        seriesValue=0;
                    }
                }else{
                    seriesValue=values.sum();
                    if(logScale&&seriesValue<=0){
                        seriesValue=null;
                    }
                }
            }else if(!logScale){
                seriesValue=(wantMax?values.max():values.min());
            }else{
                for(var j=values.length;j--;){
                    var value=values[j];
                    if(isc.isA.Number(value)&&value>0){
                        if(seriesValue==null){
                            seriesValue=value;
                        }else{
                            seriesValue=(wantMax?Math.max(seriesValue,value):Math.min(seriesValue,value));
                        }
                    }
                }
            }
            if(seriesValue!=null){
                if(max==null){
                    max=seriesValue;
                }else{
                    max=(wantMax?Math.max(max,seriesValue):Math.min(max,seriesValue));
                }
            }
        }
    }else{
        var facetValues=null;
        if(this.chartType!="Scatter"&&isExtraAxisChart&&this.isMultiFacet()){
            facetValues={};
            facetValues[this.facets[1].id]=context._fixedFacetValue.id;
        }
        if(this.metricFacet){
            facetValues=facetValues||{};
            facetValues[this.metricFacet.id]=metricId;
        }
        var values=this.getValue(facetValues,true,valuesAreDates);
        if(values!=null){
            if(!logScale){
                if(valuesAreDates){
                    for(var j=values.length;j--;){
                        var value=values[j];
                        if(isc.isA.Date(value)){
                            if(max==null){
                                max=value;
                            }else if(wantMax){
                                max=isc.DateUtil._max(max,value);
                            }else{
                                max=isc.DateUtil._min(max,value);
                            }
                        }
                    }
                }else{
                    max=(wantMax?values.max():values.min());
                }
            }else{
                for(var j=values.length;j--;){
                    var value=values[j];
                    if(isc.isA.Number(value)&&value>0){
                        if(max==null){
                            max=value;
                        }else{
                            max=(wantMax?Math.max(max,value):Math.min(max,value));
                        }
                    }
                }
            }
        }
    }
    return(cache[key]=max);
},
setData:function(){}
});
isc.A=isc.Chart;
isc.A.allChartTypes=[]
;

isc.A=isc.Chart;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A._mean=function isc_c_Chart__mean(array){
    return array.sum()/array.length;
}
,isc.A._variance=function isc_c_Chart__variance(array,population,knownMean){
    var n=array.length,
        mean=knownMean!=null?knownMean:isc.Chart._mean(array),
        sumSq=0;
    for(var i=n;i--;){
        var t=array[i];
        sumSq+=t*t;
    }
    return(sumSq-n*mean*mean)/(population?n:(n-1));
}
,isc.A._standardDeviation=function isc_c_Chart__standardDeviation(array,population,knownMean){
    return Math.sqrt(array._variance(population,knownMean));
}
,isc.A._range=function isc_c_Chart__range(array){
    var n=array.length;
    if(n==0){
        return null;
    }else{
        var min=array[n-1],max=array[n-1];
        for(var i=n-1;i--;){
            var t=array[i];
            min=Math.min(t,min);
            max=Math.max(t,max);
        }
        return max-min;
    }
}
);
isc.B._maxIndex=isc.C+4;

if(isc.Flashlet){
isc.ClassFactory.defineClass("FusionChart","Flashlet","Chart");
isc.A=isc.FusionChart;
isc.A.allChartTypes=["Area","Bar","Column","Pie","Doughnut","Line","Radar"];
isc.A.singleSeriesChartTypes=["Area","Bar","Column","Pie","Doughnut","Line"];
isc.A.singleOnlyChartTypes=["Doughnut","Pie"];
isc.A.multiSeriesChartTypes=["Area","Bar","Column","Line","Radar"];
isc.A.multiOnlyChartTypes=["Radar"];
isc.A.stackedChartTypes=["Area","Bar","Column"];
isc.A.threeDChartTypes=["Column","Bar","Pie"];
isc.A.needsDimension=["Column","Bar","Pie","Doughnut","Area"]
;

isc.A=isc.FusionChart.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.overflow="hidden";
isc.A.redrawOnResize=true;
isc.A.chartsBaseURL=isc.Page.getIsomorphicDir()+"../FusionCharts/Charts/";
isc.A.fusionVersion="3.0";
isc.A.dataColors=[
        "CCCCFF",
        "CCCC99",
        "FFCCCC",
        "FFFF99",
        "CCFF99",
        "FFCC99",
        "FF0000",
        "00FF00",
        "0000FF",
        "FF00FF",
        "FFFF00",
        "00FFFF",
        "000000"
];
isc.A.codeBase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0";
isc.A.pluginsPage="http://www.macromedia.com/go/getflashplayer";
isc.A.params={};
isc.B.push(isc.A.getDataColor=function isc_FusionChart_getDataColor(index){
    return this.dataColors[index]||"FFFFFF";
}
,isc.A.initWidget=function isc_FusionChart_initWidget(){
    this.Super("initWidget",arguments);
    this.setupChart();
    this.setChartProperties();
    this._generateCategoriesXML();
    this.setData();
}
,isc.A.setSrc=function isc_FusionChart_setSrc(){
    if(this.chartURL){
        this.src=this.chartURL;
        return;
    }
    var stacked=this.stacked&&isc.FusionChart.stackedChartTypes.contains(this.chartType);
    var stackedWord,prefix,
        needsDimension=isc.FusionChart.needsDimension.contains(this.chartType);
    if(this.fusionVersion=="2.3"){
        prefix="FC_2_3_";
        stackedWord="Stckd";
        if(this.chartType=="Area"&&this._usingMultiFacet){
            stackedWord="Stkcd";
            needsDimension=!stacked;
        }
    }else{
        prefix="";
        stackedWord="Stacked";
        if(this.chartType=="Area"&&this._usingMultiFacet&&!stacked){
            needsDimension=false;
        }
    }
    var buffer=isc.SB.create();
    buffer.append(
        this.chartsBaseURL,
        prefix,
        isc.FusionChart.multiOnlyChartTypes.contains(this.chartType)||
            (!this._usingMultiFacet&&
             isc.FusionChart.singleSeriesChartTypes.contains(this.chartType))?"":
            stacked?stackedWord:"MS",
        this.chartType
    );
    if(needsDimension){
        buffer.append(this.threeD&&
                      isc.FusionChart.threeDChartTypes.contains(this.chartType)&&
                      !(this.fusionVersion=="2.3"&&this.chartType=="Bar")?
                      "3D":"2D");
    }
    buffer.append(".swf")
    this.src=buffer.toString();
    this.logInfo("src set to: "+this.src);
}
,isc.A.getInnerHTML=function isc_FusionChart_getInnerHTML(){
    this.setSrc();
    var allParams=isc.SB.concat(
        '&chartWidth=',this.getInnerWidth(),
        '&chartHeight=',this.getInnerHeight(),
        '&dataXML=',encodeURIComponent(this.getChartXML())
    );
    this.params.FlashVars=allParams;
    return this.Super("getInnerHTML",arguments);
}
,isc.A.getChartXML=function isc_FusionChart_getChartXML(){
    var chartXML=isc.SB.concat(
        '<graph ',this._chartPropertiesXML,'>',
            this._chartCategoriesXML,
            this._chartDataXML,
        '</graph>');
    if(this.logIsDebugEnabled()){
        this.logWarn("chartXML: "+chartXML);
    }
    return chartXML;
}
,isc.A.setChartProperties=function isc_FusionChart_setChartProperties(props){
    if(!props)props=this.chartProperties;
    else this.chartProperties=props;
    props=isc.addProperties({
        caption:this.title,
        subCaption:this.subTitle,
        yAxisName:this.valueTitle,
        xAxisName:this.facets[0].title,
        animation:this.animateValuesOnShow,
        showValues:this.labelValues
    },this.chartProperties);
    var buffer=isc.SB.create();
    for(var attr in props){
        if(props[attr]===true){
            buffer.append(attr,'="1" ');
        }else if(props[attr]===false){
            buffer.append(attr,'="0" ');
        }else if(attr.endsWith("olor")&&props[attr].startsWith("#")){
            buffer.append(attr,'="',props[attr].substring(1),'" ');
        }else{
            buffer.append(attr,'="',props[attr],'" ');
        }
    }
    this._chartPropertiesXML=buffer.toString();
    if(this.isDrawn())this.markForRedraw();
}
,isc.A._generateCategoriesXML=function isc_FusionChart__generateCategoriesXML(categories){
    if(!categories)categories=this.facets[0].values;
    var buffer=isc.SB.create();
    buffer.append('<categories>');
    for(var i=0;i<categories.length;i++){
        if(categories[i].vLine){
            this._writeVLineXML(categories[i],buffer);
            continue;
        }
        buffer.append('<category name="',
                      isc.makeXMLSafe(categories[i].title||categories[i].id),
                      '"');
        if(categories[i].longTitle){
            buffer.append(' hoverText="',isc.makeXMLSafe(categories[i].longTitle),'"');
        }
        if(categories[i].showTitle===false)buffer.append(' showName="0"');
        buffer.append('/>');
    }
    buffer.append('</categories>');
    this._chartCategoriesXML=buffer.toString();
    if(this.isDrawn())this.markForRedraw();
}
,isc.A._writeVLineXML=function isc_FusionChart__writeVLineXML(vLine,buffer){
    buffer.append('<vLine');
    for(var attr in vLine){
        if(attr=="vLine")continue;
        buffer.append(' ',attr,'="',isc.makeXMLSafe(vLine[attr]),'"');
    }
    buffer.append('/>');
}
,isc.A.setFacets=function isc_FusionChart_setFacets(facets){
    this.facets=facets;
    this.setupChart();
    this._generateCategoriesXML();
}
,isc.A.setData=function isc_FusionChart_setData(data,seriesNum){
    var data=this.data=data||this.data;
    if(data==null||(isc.isAn.Array(data)&&data.length==0)){
        return this._chartDataXML="";
    }
    var buffer=isc.SB.create();
    var firstFacet=this.facets.first(),
        firstFacetValues=firstFacet.values,
        facetValues={};
    this._usingMultiFacet=this.isMultiFacet();
    if(this.isMultiFacet()&&
        isc.FusionChart.singleOnlyChartTypes.contains(this.chartType))
    {
        this.logWarn("'"+this.chartType+"' charts support one facet only;"+
                     " showing only first value for second facet");
        this._usingMultiFacet=false;
        facetValues[this.facets[1].id]=this.facets[1].values[0].id;
    }
    if(this._usingMultiFacet){
        var secondFacet=this.facets[1],
            secondFacetValues=secondFacet.values;
        var setValue='<set value="',
            quoteClose='"',
            close='/>';
        for(var i=0;i<secondFacetValues.length;i++){
            buffer.append('<dataset seriesname="',isc.makeXMLSafe(secondFacetValues[i].title),
                            '" color="',this.getDataColor(i),'">');
            for(var j=0;j<firstFacetValues.length;j++){
                if(firstFacetValues[j].vLine)continue;
                facetValues[secondFacet.id]=secondFacetValues[i].id||
                                                secondFacetValues[i].name;
                facetValues[firstFacet.id]=firstFacetValues[j].id||
                                                firstFacetValues[j].name;
                var theValue=this.getValue(facetValues);
                buffer.append(setValue,theValue,quoteClose);
                var link=this.getLink(facetValues,theValue);
                if(link)buffer.append(' link="'+link+'"');
                buffer.append(close);
            }
            buffer.append("</dataset>");
        }
    }else{
        for(var i=0;i<firstFacetValues.length;i++){
            if(firstFacetValues[i].vLine){
                this._writeVLineXML(firstFacetValues[j],buffer);
                continue;
            }
            facetValues[firstFacet.id]=firstFacetValues[i].id||
                                            firstFacetValues[i].name;
            var theValue=this.getValue(facetValues);
            buffer.append('<set value="',theValue,'"');
            var link=this.getLink(facetValues,theValue);
            if(link){
                buffer.append(' link="'+link+'"');
            }
            buffer.append(' name="',
                    isc.makeXMLSafe(firstFacetValues[i].title||firstFacetValues[i].id),
            '"');
            buffer.append(' color="',this.getDataColor(i),'"');
            if(firstFacetValues[i].longTitle){
                buffer.append(' hoverText="',isc.makeXMLSafe(firstFacetValues[i].longTitle),'"');
            }
            if(firstFacetValues[i].showTitle===false)buffer.append(' showName="0"');
            buffer.append('/>');
        }
    }
    this._chartDataXML=buffer.toString();
    if(this.isDrawn())this.markForRedraw();
}
,isc.A.getLink=function isc_FusionChart_getLink(facetValues,value){
}
,isc.A.setChartType=function isc_FusionChart_setChartType(chartType){
    if(!isc.FusionChart.allChartTypes.contains(chartType)){
        this.logWarn("'"+chartType+"' is not a recognized chart type");
    }else{
        chartType=this.chartType=chartType||this.chartType;
        this.setData();
        if(this.isDrawn())this.markForRedraw();
    }
}
,isc.A.setFusionVersion=function isc_FusionChart_setFusionVersion(version){
    this.fusionVersion=version;
    this.setSrc();
    if(this.isDrawn())this.markForRedraw();
}
,isc.A.setStacked=function isc_FusionChart_setStacked(isStacked){
    this.stacked=isStacked;
    if(isStacked&&!isc.FusionChart.stackedChartTypes.contains(this.chartType)){
        this.logWarn("'"+this.chartType+"' charts do not support stacking");
    }else{
        if(this.isDrawn())this.markForRedraw();
    }
}
,isc.A.setThreeD=function isc_FusionChart_setThreeD(isThreeD){
    if(isThreeD&&!isc.FusionChart.threeDChartTypes.contains(this.chartType)){
        this.logWarn("'"+this.chartType+"' charts do not support 3D effects");
    }else{
        this.threeD=isThreeD;
        if(this.isDrawn())this.markForRedraw();
    }
}
);
isc.B._maxIndex=isc.C+15;

}
if(isc.DrawPane){
isc.ClassFactory.defineClass("_PieSeriesSector","DrawSector");
isc.A=isc._PieSeriesSector.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._avoidRadialLineSegment=true;
isc.B.push(isc.A.destroy=function isc__PieSeriesSector_destroy(){
    var fillGradient=this.fillGradient;
    if(isc.isA.String(fillGradient)){
        if(this.drawPane&&this.drawPane.gradients){
            fillGradient=this.drawPane.getGradient(fillGradient);
            if(fillGradient._temporary)this.drawPane.removeGradient(fillGradient);
        }
    }
    if(isc.isAn.Object(fillGradient)&&fillGradient._temporary){
        var svgDef=fillGradient._svgDef;
        if(svgDef!=undefined){
            if(svgDef.parentNode)svgDef.parentNode.removeChild(svgDef);
            delete fillGradient._svgDef;
        }
    }
    this.Super("destroy",arguments);
}
);
isc.B._maxIndex=isc.C+1;

isc.ClassFactory.defineClass("FacetChart","DrawPane","Chart");
isc.addGlobal("BarChart",isc.FacetChart);
isc.A=isc.FacetChart.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.defaultHeight=300;
isc.A.defaultWidth=400;
isc.A.overflow="hidden";
isc.A.xGutter=30;
isc.A.yGutter=80;
isc.A.padding=5;
isc.A.styleName="scChart";
isc.A.chartType="Column";
isc.A.stacked=null;
isc.A.connected=true;
isc.A.title="Chart";
isc.A.showTitle=true;
isc.A.titleProperties={
        fontSize:14
    };
isc.A.valueAxisLabelProperties={
        fontSize:11
    };
isc.A.dataAxisLabelProperties={
        fontSize:11
    };
isc.A.axisLabelMargin=5;
isc.A.pixelsPerGradation=28;
isc.A.minDataSpreadPercent=30;
isc.A.minXDataSpreadPercent=30;
isc.A.gradationLabelProperties={
        fontFamily:"Tahoma",
        fontSize:10,
        fontWeight:"normal",
        fontStyle:"normal",
        lineColor:"#444444"
    };
isc.A.gradationLineProperties={
        excludeFromQuadTree:true,
        lineWidth:1,
        lineColor:"#BBBBBB"
    };
isc.A.gradationZeroLineProperties={
        lineWidth:2,
        lineColor:"#999999"
    };
isc.A.bandedBackground=true;
isc.A.backgroundBandProperties={
        excludeFromQuadTree:true,
        lineOpacity:0,
        fillColor:"#F7F7F7"
    };
isc.A.showRadarGradationLabels=true;
isc.A.radarGradationLabelOffset=2;
isc.A.expectedValueLineProperties={
        lineWidth:1,
        lineColor:"#333333"
    };
isc.A.standardDeviationLineProperties={
        lineWidth:2,
        lineColor:"#999999"
    };
isc.A.useSymmetricStandardDeviations=true;
isc.A.standardDeviations=[-1,1];
isc.A.standardDeviationBandProperties=[];
isc.A.regressionLineProperties={
        lineWidth:1,
        lineColor:"#0000EE"
    };
isc.A.regressionLineType="line";
isc.A.regressionPolynomialDegree=3;
isc.A.dataPointSize=5;
isc.A.dataPointDefaults={
        cursor:"crosshair",
        click:function(){
            if(this.dataRecord!=null){
                var context=this._context,
                    chart=context;
                if(!isc.isA.FacetChart(chart)){
                    chart=context._chart;
                }
                chart._clickShape();
                if(context.pointClick){
                    return context.pointClick(this.dataValue,this.dataRecord,this);
                }
            }else{
                return this.Super("click",arguments);
            }
        },
        hover:function(){
            if(this.dataRecord!=null){
                var context=this._context;
                if(context.pointHover){
                    return context.pointHover(this.dataValue,this.dataRecord,this);
                }
            }else{
                return this.Super("hover",arguments);
            }
        },
        getHoverHTML:function(){
            var context=this._context;
            if(context.getPointHoverHTML){
                return context.getPointHoverHTML(this.dataValue,this.dataRecord,this);
            }
            return null;
        }
    };
isc.A.dataPointProperties={
        fillColor:"#FFFFFF",
        lineWidth:1
    };
isc.A.pointShapes=[
        "Oval","Square","Diamond","Triangle"
    ];
isc.A.useMultiplePointShapes=true;
isc.A.logScale=false;
isc.A.useLogGradations=false;
isc.A.logBase=10;
isc.A.logGradations=[1,2,4,6,8];
isc.A.showChartRect=false;
isc.A.chartRectProperties={
        rounding:0.02,lineWidth:1,lineColor:"#111111",
        backgroundColor:"#CCCCCC",
        fillGradient:{
            x1:'0%',
            y1:'100%',
            x2:'100%',
            y2:'0%',
            colorStops:[{
                color:"#FFFFFF",
                offset:0.0
            },{
                color:"#FFFFFF",
                offset:0.5
            },{
                color:"#CCCCCC",
                offset:0.9
            },{
                color:"#C2c2c2",
                offset:1.0
            }]
        },
        shadow:{blur:8,color:"#555555",offset:[2,2]}
    };
isc.A.chartRectMargin=5;
isc.A.dataMargin=10;
isc.A.rotateLabels="auto";
isc.A.dataLabelProperties={
        fontFamily:"Tahoma",
        fontSize:10,
        fontWeight:"normal",
        fontStyle:"normal",
        lineColor:"#444444"
    };
isc.A.decimalPrecision=2;
isc.A.zoomChartDefaults={
        canZoom:false,
        padding:0,
        showTitle:false,
        showValueAxisLabel:false,
        showDataAxisLabel:false,
        axisLabelMargin:0,
        showDataPoints:false,
        showChartRect:false,
        chartRectMargin:0,
        dataMargin:0,
        rotateLabels:"never",
        showLegend:false,
        legendMargin:0,
        legendPadding:0,
        _showYGradations:false,
        bandedBackground:false,
        pixelsPerGradation:40,
        useAutoGradients:false
    };
isc.A._showYGradations=true;
isc.A.zoomSelectionChartDefaults={
        canZoom:false,
        padding:0,
        showTitle:false,
        showValueAxisLabel:false,
        showDataAxisLabel:false,
        axisLabelMargin:0,
        showDataPoints:false,
        showChartRect:false,
        chartRectMargin:0,
        dataMargin:0,
        rotateLabels:"never",
        showLegend:false,
        legendMargin:0,
        legendPadding:0,
        _showYGradations:false,
        bandedBackground:false,
        pixelsPerGradation:40,
        useAutoGradients:false
    };
isc.A.zoomShowSelection=true;
isc.A.zoomChartSliderDefaults={};
isc.A.zoomChartHeight=100;
isc.A.colorMutePercent=0;
isc.A.zoomMutePercent=-35;
isc.A.showInlineLabels=false;
isc.A.showGradationsOverData=false;
isc.A.legendMargin=10;
isc.A.legendPadding=5;
isc.A.legendSwatchSize=16;
isc.A.legendSwatchProperties={
        lineWidth:1,
        lineColor:"#000000"
    };
isc.A.legendTextPadding=5;
isc.A.legendItemPadding=5;
isc.A.legendRowPadding=5;
isc.A.showLegendRect=false;
isc.A.legendRectProperties={
        lineWidth:1,
        lineColor:"#333333"
    };
isc.A.legendLabelProperties={
        fontFamily:"Arial",
        fontSize:10,
        fontWeight:"normal",
        fontStyle:"normal",
        lineColor:"#333333"
    };
isc.A.showShadows=true;
isc.A.shadowProperties={fillColor:"#333333",lineWidth:1.1};
isc.A.barMargin=4;
isc.A.minBarThickness=4;
isc.A.maxBarThickness=150;
isc.A.clusterMarginRatio=4;
isc.A.barProperties={
        fillColor:"#FFCCCC",
        lineWidth:1,
        opacity:0.5,
        lineColor:"#333333"
    };
isc.A.dataLineProperties={
        lineWidth:3,
        lineColor:"#333333",
        shadow:{blur:5,color:"#333333",offset:[2,3]}
    };
isc.A.dataOutlineProperties={
        lineWidth:1,
        lineColor:"#333333"
    };
isc.A.dataShapeProperties={
        lineWidth:0,
        lineOpacity:0,
        lineColor:"#333333",
        fillOpacity:0.5
    };
isc.A.valueLineProperties={
        lineWidth:1,
        lineColor:"#BBBBBB"
    };
isc.A.singlePointMarkerSize=4;
isc.A.maxDataPointSize=14;
isc.A.minDataPointSize=3;
isc.A.minKnobSize=isc.Browser.isTouch?10:6;
isc.A.radarBackgroundProperties={
        lineWidth:1
    };
isc.A.radialLabelOffset=5;
isc.A.pieStartAngle=0;
isc.A.pieSliceProperties={lineOpacity:0,lineWidth:0.1};
isc.A.pieBorderProperties={lineColor:"#333333",lineWidth:1};
isc.A.pieRingBorderProperties={lineColor:"#333333",lineWidth:1};
isc.A.showDoughnut=null;
isc.A.doughnutRatio=0.2;
isc.A.doughnutHoleProperties={lineWidth:0,fillColor:"white"};
isc.A.pieLabelLineProperties={lineColor:"#111111",lineWidth:2};
isc.A.pieLabelAngleStart=20;
isc.A.pieLabelLineExtent=7;
isc.A.errorBarWidth=6;
isc.A.errorLineProperties={
        lineWidth:1
    };
isc.A.errorBarColorMutePercent=-60;
isc.A.canDrag=false;
isc.A.cursor="auto";
isc.A.hoverLabelProperties={
        fontFamily:"Arial",
        fontSize:12,
        fontWeight:"bold",
        fontStyle:" normal",
        lineColor:"#333333"
    };
isc.A.hoverRectProperties={
        rounding:0.3,
        lineWidth:1,
        lineColor:"#333333",
        fillColor:"#ffffff",
        fillOpacity:0.85,
        shadow:{blur:8,color:"#555555",offset:[2,2]}
    };
isc.A.hoverLabelOffset=25;
isc.A.brightenPercent=30;
isc.A.showDataValues=false;
isc.A.valueAxisMargin=10;
isc.A.gradationTickMarkLength=5;
isc.A.tickMarkToValueAxisMargin=7;
isc.A.extraAxisMetrics=[];
isc.A.extraAxisSettings=[]
;
isc.B.push(isc.A.isStacked=function isc_FacetChart_isStacked(context){
        context=context||this;
        return context.stacked!=null?context.stacked:context.chartType!="Line";
    }
,isc.A.isFilled=function isc_FacetChart_isFilled(context){
        context=context||this;
        return context.filled!=null?
            context.filled:
            (context.isMultiFacet()&&this.isStacked(context))||context.chartType=="Area";
    }
,isc.A._getMinDataSpreadPercent=function isc_FacetChart__getMinDataSpreadPercent(primary,context){
        var prop=(primary?"minDataSpreadPercent":"minXDataSpreadPercent");
        return(context[prop]!=null?context[prop]:this[prop]);
    }
,isc.A.setShowScatterLines=function isc_FacetChart_setShowScatterLines(showScatterLines,context){
        context=context||this;
        if(context.chartType!="Scatter"){
            this.logWarn("showScatterLines property works only for charts of type Scatter");
        }else{
            context.showScatterLines=showScatterLines;
            if(this.data)this._redrawFacetChart(false);
        }
    }
,isc.A.setDataLineType=function isc_FacetChart_setDataLineType(dataLineType,context){
        context=context||this;
        if(context.chartType!="Scatter"&&context.chartType!="Line"){
            this.logWarn("dataLineType property works only for charts of type Scatter and Line");
        }else{
            context.dataLineType=dataLineType;
            if(this.data)this._redrawFacetChart(false);
        }
    }
,isc.A._getDataLineType=function isc_FacetChart__getDataLineType(context){
        context=context||this;
        var chartType=context.chartType;
        if(context.dataLineType=="smooth"&&!(chartType=="Area"||chartType=="Radar")){
            return"smooth";
        }else{
            return"straight";
        }
    }
,isc.A._getUseMultiplePointShapes=function isc_FacetChart__getUseMultiplePointShapes(){
        var flag=this.useMultiplePointShapes;
        return(flag==null||flag);
    }
,isc.A.setUseMultiplePointShapes=function isc_FacetChart_setUseMultiplePointShapes(useMultiplePointShapes){
        var prev=this._getUseMultiplePointShapes();
        this.useMultiplePointShapes=useMultiplePointShapes;
        var next=this._getUseMultiplePointShapes();
        if(prev!=next){
            this.setData(this.data);
        }
    }
,isc.A._canRotateLabels=function isc_FacetChart__canRotateLabels(){
        return(
            this.rotateLabels=="always"||(this.rotateLabels=="auto"&&
            !(isc.isA.Boolean(this.autoRotateLabels)&&this.autoRotateLabels==false)));
    }
,isc.A._getRequireZeroGradation=function isc_FacetChart__getRequireZeroGradation(context){
        context=context||this;
        return!context.logScale;
    }
,isc.A._showShadows=function isc_FacetChart__showShadows(context){
        return(this.hasShadows&&context.showShadows);
    }
,isc.A.shouldShowDoughnut=function isc_FacetChart_shouldShowDoughnut(){
        return this.showDoughnut||(this.chartType=="Doughnut"&&this.showDoughnut!==false);
    }
,isc.A._getCanMoveAxes=function isc_FacetChart__getCanMoveAxes(){
        return this._hasExtraAxes()&&
            (this.canMoveAxes!=null?this.canMoveAxes:this._getExtraAxisSettings().visible.length>1);
    }
);
isc.B._maxIndex=isc.C+13;

isc.A=isc.FacetChart.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.redrawOnResize=true;
isc.A.allContentAndChildren=true;
isc.A._$fakeData=[0.7,1.0,0.9,0.4,0.8,0.5,0.8];
isc.A._$extraAxisDataColorAndGradientDefaults={
    getDataColor:function(index){
        var chart=this._chart;
        return chart.getDataColor.apply(chart,
                (this._hasOwnDataColors?[index,this]:[index+this._dataColorOffset,chart]));
    },
    getDataGradient:function(index,create,drawingType){
        var chart=this._chart;
        return chart.getDataGradient.apply(chart,
                (this._hasOwnDataGradients?
                [index,create,drawingType,this,this._hasOwnDataColors]:
                [index+this._dataGradientOffset,create,drawingType,chart,this._hasOwnDataColors]));
    }
};
isc.A._$brightBlue="#0000ff";
isc.A.angleMargin=5;
isc.A._$Oval="Oval";
isc.A._$Square="Square";
isc.A._$Diamond="Diamond";
isc.A._closeCommand={type:isc.DrawShape._$close};
isc.A._$moveto=isc.DrawShape._$moveto;
isc.A._$lineto=isc.DrawShape._$lineto;
isc.A._$circleto=isc.DrawShape._$circleto;
isc.A._inlineLabelXOffset=5;
isc.A._inlineLabelYOffset=2;
isc.A._facetIds=null;
isc.A.interactivePoints=true;
isc.A.useAutoGradients=true;
isc.A.dataColors=[
    "#df5545",
    "#7ae02d",
    "#4d89f9",
    "#2de0e0",
    "#e0e02d",
    "#e02de0",
    "#FF9933",
    "#99FF33",
    "#9933FF",
    "#639966",
    "#63CCCC",
    "#6366FF",
    "#800080",
    "#999999",
    "#FF00FF",
    "#FFCC00",
    "#00FF00",
    "#00CCFF",
    "#996366",
    "#C0C0C0",
    "#000000",
    "#996100",
    "#636300",
    "#006300",
    "#006366",
    "#000080",
    "#636399",
    "#636363",
    "#800000",
    "#FF6600",
    "#808000",
    "#8000FF",
    "#008080",
    "#666699",
    "#808080",
    "#FF99CC",
    "#FFCC99",
    "#FFFF99",
    "#CCFFCC",
    "#CCFFFF",
    "#99CCFF",
    "#CC99FF",
    "#FFFFFF"
];
isc.A.rotateProps={rotation:90};
isc.A._zoomChartMargin=4;
isc.B.push(isc.A.getChartTop=function isc_FacetChart_getChartTop(){
    return this._titleRect.height+this._getDataAndChartRectMargin(true);
}
,isc.A.getChartHeight=function isc_FacetChart_getChartHeight(recalc){
    return this.getInnerContentHeight()
        -this.getChartTop()
        -this.chartRectMargin
        -Math.max(this.getXLabelsHeight(recalc),this._getValueAxisLabelsHeight(recalc))
        -(this._legendRect?this.legendMargin+this._legendRect.height:0)
        -(this._getCanZoom()?this._zoomChartMargin+this.zoomChartHeight+this._zoomChartSliderScrollbarHeight:0);
}
,isc.A._getAvailableHeight=function isc_FacetChart__getAvailableHeight(){
    return this.getInnerContentHeight()
        -this.getChartTop()
        -this._getDataAndChartRectMargin(true)
        -(this._legendRect?this.legendMargin+this._legendRect.height:0)
        -(this._getCanZoom()?this._zoomChartMargin+this.zoomChartHeight+this._zoomChartSliderScrollbarHeight:0)
        -this.getAxisLabelSpace(false);
}
,isc.A.getChartLeft=function isc_FacetChart_getChartLeft(){
    var chartLeft=this.getYLabelsWidth()+this._chartRectLeftMargin;
    if(this._hasExtraAxes()&&this._showYGradations){
        var settings=this._getExtraAxisSettings();
        var leftSettings=settings.left,
            numLeft=leftSettings.length;
        chartLeft+=leftSettings.getProperty("_totalValueAxisWidth").sum();
        chartLeft+=numLeft*this.valueAxisMargin;
    }
    return chartLeft;
}
,isc.A.getChartWidth=function isc_FacetChart_getChartWidth(recalc){
    var chartWidth=this.getInnerContentWidth()-this.getChartLeft()-this._chartRectRightMargin;
    if(this._hasExtraAxes()&&this._showYGradations){
        var settings=this._getExtraAxisSettings(),
            rightSettings=settings.right,
            numRight=rightSettings.length;
        if(this._hasSideValueAxisLabels()){
            chartWidth-=this.getValueAxisLabelHeight(rightSettings[0]);
        }
        chartWidth-=rightSettings.getProperty("_totalValueAxisWidth").sum();
        chartWidth-=Math.max(0,numRight-1)*this.valueAxisMargin;
    }
    return chartWidth;
}
,isc.A._getDataAndChartRectMargin=function isc_FacetChart__getDataAndChartRectMargin(vertical){
    var margin=this.chartRectMargin;
    if(vertical==this.hasXGradations()&&
        (this.chartType=="Column"||this.chartType=="Bar"||
        this.chartType=="Line"||this.chartType=="Area"))
    {
        margin+=this.dataMargin;
    }
    return margin;
}
,isc.A._getAvailableWidth=function isc_FacetChart__getAvailableWidth(){
    var availableWidth=this.getInnerContentWidth()-2*this._getDataAndChartRectMargin(false)-this.getAxisLabelSpace(false);
    if(this._hasExtraAxes()&&this._showYGradations){
        var settings=this._getExtraAxisSettings(),
            countLeft=settings.left.length,
            countRight=settings.right.length;
        availableWidth-=(countLeft+Math.max(0,countRight-1))*this.valueAxisMargin;
        for(var i=settings.visible.length;i--;){
            availableWidth-=this._getValueAxisExtraWidth(settings.visible[i]);
        }
    }
    return availableWidth;
}
,isc.A._getValueAxisExtraWidth=function isc_FacetChart__getValueAxisExtraWidth(context){
    if(context==this||context.showAxis==false||!this._showYGradations){
        return 0;
    }else{
        var valueAxisLineWidth=((this._shouldShowValueAxisLine(context)&&
                this._getValueAxisLineProperties(context).lineWidth)||0),
            extraWidth=valueAxisLineWidth+
                this.gradationTickMarkLength+this.tickMarkToValueAxisMargin;
        return extraWidth;
    }
}
,isc.A.getDataAxisLength=function isc_FacetChart_getDataAxisLength(recalc){
    if(this.chartType=="Radar")return this.getChartHeight(recalc)/2;
    if(this.hasYGradations()){
        var height=this.getChartHeight(recalc);
        return height;
    }else{
        return this.getChartWidth();
    }
}
,isc.A._drawChartRect=function isc_FacetChart__drawChartRect(drawChartRect){
    var top=this.getChartTop(),
        height=this.getChartHeight(),
        left=this.getChartLeft(),
        width=this.getChartWidth();
    var rect=this._chartRect={
        top:top,
        left:left,
        width:width,
        height:height
    };
    if(drawChartRect&&this.showChartRect){
        this.drawRect(left,top,width,height,this.chartRectProperties,this);
    }
}
,isc.A.getChartRect=function isc_FacetChart_getChartRect(){
    if(this._chartRect==null)this.logWarn("getChartRect(): chart rect not available yet");
    return this._chartRect;
}
,isc.A.getChartRectLineWidth=function isc_FacetChart_getChartRectLineWidth(){
    var rectProps=this.chartRectProperties;
    var rectLineWidth=rectProps.lineWidth;
    if(rectProps.lineOpacity==0)rectLineWidth=0;
    if(!this.showChartRect)rectLineWidth=0;
    return(rectLineWidth||0);
}
,isc.A.getStackFacet=function isc_FacetChart_getStackFacet(){
    return this._getFacets()[1];
}
,isc.A.isPieChart=function isc_FacetChart_isPieChart(chartType){
    chartType=chartType||this.chartType;
    return chartType=="Pie"||chartType=="Doughnut";
}
,isc.A.hasYAxisLabels=function isc_FacetChart_hasYAxisLabels(){
    return this.chartType!="Radar"&&!this.isPieChart();
}
,isc.A.setStacked=function isc_FacetChart_setStacked(newValue,context){
    context=context||this;
    context.stacked=newValue;
    if(this.data)this._redrawFacetChart(false);
}
,isc.A.setFilled=function isc_FacetChart_setFilled(newValue,context){
    context=context||this;
    context.filled=newValue;
    if(this.data)this._redrawFacetChart(false);
}
,isc.A.swapFacets=function isc_FacetChart_swapFacets(){
    if(!this._canSwapFacets()){
        return;
    }
    var facets=this._getFacets();
    if(facets){
        var swap=facets[0];
        facets[0]=facets[1];
        facets[1]=swap;
        this.erase(false);
        this.setData(this._getData());
    }
}
,isc.A._canSwapFacets=function isc_FacetChart__canSwapFacets(){
    if(!this.isMultiFacet()){
        return false;
    }else if(this._hasExtraAxes()){
        var settings=this._getExtraAxisSettings(),
            numExtraAxes=settings.visible.length;
        for(var j=0;j<numExtraAxes;++j){
            if(!settings.visible[j].isMultiFacet()){
                return false;
            }
        }
    }
    return true;
}
,isc.A.setChartType=function isc_FacetChart_setChartType(chartType,context){
    context=context||this;
    if(!isc.FacetChart.allChartTypes.contains(chartType)){
        this.logWarn("'"+chartType+"' is not a recognized chart type");
    }else{
        var wipeOrderedData=(
                this.reversePieFacets&&
                this.isMultiFacet()&&
                (this.isPieChart(context.chartType)||this.isPieChart(chartType))),
            wipeZoomChart=(
                this._getCanZoom(context.chartType)!=this._getCanZoom(chartType));
        context.chartType=chartType;
        if(this.data){
            this._redrawFacetChart(wipeOrderedData,wipeZoomChart);
        }
    }
}
,isc.A.showContextMenu=function isc_FacetChart_showContextMenu(){
    var self=this,
        contextMenuItems=null;
    contextMenuItems=this._getMoveAxesContextMenuItems();
    if(contextMenuItems!=null){
    }else if(this.chartType=="Scatter"){
        if(this._isDateValued(this.getXAxisMetric())||this._isDateValued(this.getYAxisMetric())){
            return true;
        }
        var none=!(this.showRegressionLine!=null&&this.showRegressionLine),
            straightLine=(!none&&this.regressionLineType=="line"),
            polynomialCurve=(!none&&this.regressionLineType=="polynomial");
        contextMenuItems=[{
            title:isc.FacetChart.regressionLinesContextMenuItemTitle,
            submenu:[{
                title:isc.FacetChart.hideRegressionLinesContextMenuItemTitle,
                click:"target.setShowRegressionLine(false)",
                checked:none
            },{
                title:isc.FacetChart.linearRegressionLinesContextMenuItemTitle,
                click:"target.setRegressionLineType(\"line\"); target.setShowRegressionLine(true)",
                checked:straightLine
            },{
                title:isc.FacetChart.polynomialRegressionLinesContextMenuItemTitle,
                click:"target.setRegressionLineType(\"polynomial\"); target.setShowRegressionLine(true)",
                checked:polynomialCurve
            },{
                title:isc.FacetChart.polynomialDegreeRegressionLinesContextMenuItemTitle,
                click:function(){
                    var callback=function(value){
                        var cancelled=(value==null);
                        if(cancelled)return;
                        var badInput=isc.isA.emptyString(value),
                            degree;
                        if(!badInput){
                            degree=parseInt(value,10);
                            badInput=(
                                !isc.isA.Number(degree)||
                                value!=degree.toString(10)||
                                !self._isDegreeValid(degree));
                        }
                        if(badInput){
                            isc.warn(isc.FacetChart.invalidPolynomialDegreeMessage);
                        }else if(degree!=self.regressionPolynomialDegree){
                            self.setRegressionPolynomialDegree(degree);
                            self.setRegressionLineType("polynomial");
                            self.setShowRegressionLine(true);
                        }
                    };
                    isc.askForValue(isc.FacetChart.polynomialDegreePrompt,callback,{
                            defaultValue:self.regressionPolynomialDegree
                        });
                }
            }]
        }];
    }else{
        var hasExtraAxes=this._hasExtraAxes(),
            allowedChartTypes=(
                hasExtraAxes?
                    isc.FacetChart._allMultiAxisChartTypes:isc.FacetChart.allChartTypes),
            canSwapFacets=this._canSwapFacets();
        contextMenuItems=[{
            title:"Chart Type",
            submenu:allowedChartTypes.map(function(chartType){
                return{
                    title:chartType,
                    click:"target.setChartType('"+chartType+"')",
                    checked:self.chartType==chartType
                };
            })
        },{
            title:"Fill",
            submenu:[{
                title:"Filled",
                click:"target.setFilled(true)",
                checked:this.filled!=null&&this.filled
            },{
                title:"Unfilled",
                click:"target.setFilled(false)",
                checked:this.filled!=null&&!this.filled
            },{
                title:"Auto",
                click:"target.setFilled(null)",
                checked:this.filled==null
            }]
        }];
        if(this.isMultiFacet()){
            contextMenuItems.add({
                title:"Stack",
                submenu:[{
                    title:"Stacked",
                    click:"target.setStacked(true)",
                    checked:this.stacked!=null&&this.stacked
                },{
                    title:"Unstacked",
                    click:"target.setStacked(false)",
                    checked:this.stacked!=null&&!this.stacked
                },{
                    title:"Auto",
                    click:"target.setStacked(null)",
                    checked:this.stacked==null
                }]
            });
            if(canSwapFacets){
                contextMenuItems.add({
                    title:"Swap Facets",
                    click:"target.swapFacets()"
                });
            }
        }
    }
    if(this._contextMenu!=null){
        this._contextMenu.destroy();
    }
    var contextMenu=this._contextMenu=this.getMenuConstructor().create({
        data:contextMenuItems
    });
    return contextMenu.showContextMenu(this);
}
,isc.A.click=function isc_FacetChart_click(){
    var contextMenuItems=this._getMoveAxesContextMenuItems();
    if(contextMenuItems!=null){
        if(this._contextMenu!=null){
            this._contextMenu.destroy();
        }
        var contextMenu=this._contextMenu=this.getMenuConstructor().create({
            data:contextMenuItems
        });
        return contextMenu.showContextMenu(this);
    }
}
,isc.A._getMoveAxesContextMenuItems=function isc_FacetChart__getMoveAxesContextMenuItems(){
    var contextMenuItems=null;
    if(this._getCanMoveAxes()){
        var x=this.getOffsetX()-this.getLeftMargin()-this.getLeftPadding(),
            y=this.getOffsetY()-this.getTopMargin()-this.getTopPadding(),
            chartRect=this._chartRect;
        if(chartRect!=null){
            var settings=this._getExtraAxisSettings(),
                numExtraAxes=settings.visible.length,
                minIndex=-settings.left.length,
                maxIndex=settings.right.length;
            for(var j=0;j<numExtraAxes;++j){
                var context=settings.visible[j],
                    left=this._getValueAxisLeft(context),
                    right=left+context._totalValueAxisWidth;
                if(left<=x&&x<=right&&y>=chartRect.top&&
                    context._valueAxisLabel!=null&&y<=context._valueAxisLabel.getBoundingBox()[3])
                {
                    var submenu=[],
                        contextIndex=this._getValueAxisIndex(context);
                    for(var i=minIndex;i<=maxIndex;++i){
                        if(i==0){
                            continue;
                        }
                        var c=(i<0?settings.left[-i-1]:settings.right[i-1]);
                        if(context==c){
                            continue;
                        }
                        var swapContextIndex=this._getValueAxisIndex(c);
                        var title;
                        if(c.valueTitle!=null){
                            title=c.valueTitle;
                        }else{
                            var metricFacetValue=this.metricFacet.values.find("id",c._metric);
                            title=metricFacetValue.title||metricFacetValue.id;
                        }
                        submenu.push({
                            title:title,
                            click:"target.changeValueAxisPositions(["+
                                contextIndex+","+swapContextIndex+","+swapContextIndex+","+contextIndex+"])"
                        });
                    }
                    if(!submenu.isEmpty()){
                        contextMenuItems=[{
                            title:"Swap Metric Axes",
                            submenu:submenu
                        }];
                        break;
                    }
                }
            }
        }
    }
    return contextMenuItems;
}
,isc.A.initWidget=function isc_FacetChart_initWidget(){
    this.errorBarColorMutePercent=this._getColorMutePercent(
            this.errorBarColorMutePercent,
            isc.FacetChart.getInstanceProperty("errorBarColorMutePercent"));
    this.colorMutePercent=this._getColorMutePercent(
            this.colorMutePercent,
            isc.FacetChart.getInstanceProperty("colorMutePercent"));
    if(this._getCanZoom()){
        this.allowContentAndChildren=true;
    }
    this.Super("initWidget",arguments);
    this.origDataGradients=this.dataGradients;
    this.dataGradients=isc.addProperties({},this.origDataGradients);
    this.isVML=this.drawingType=="vml";
    this.hasShadows=!this.isVML;
    if(this.facets&&this.facets.length>2&&this.chartType!="Scatter"&&
        !((this.chartType=="Line"||this.chartType=="Area")&&(this.highErrorMetric!=null||this.lowErrorMetric!=null))&&
        !(this.extraAxisMetrics!=null&&isc.isAn.Array(this.extraAxisMetrics)&&!this.extraAxisMetrics.isEmpty()))
    {
        this.logWarn("The FacetChart \""+this.getID()+"\" has "+this.facets.length+" "+
                "facets, but it is not a scatter plot and it does not have any extraAxisMetrics.  "+
                "This is probably an error as the chart cannot utilize more than two facets.");
    }
    this._zoomChartNeedsRedraw=true;
    if(this._parentChart==null){
        this.setData(this._getData());
    }else{
        this._initExtraAxes();
    }
    var dummyRangeSlider=this.createAutoChild("zoomChartSlider",{
        _constructor:"RangeSlider",
        autoDraw:false,
        minValue:0,maxValue:1,
        startValue:0,endValue:1
    });
    this._zoomChartSliderScrollbarHeight=dummyRangeSlider.scrollbar.getHeight();
    dummyRangeSlider.destroy();
    this._origWidth=this.getWidth();
    this._origHeight=this.getHeight();
}
,isc.A.draw=function isc_FacetChart_draw(){
    if(isc._traceMarkers)arguments.__this=this;
    if(!this.readyToDraw())return this;
    this.Super("draw",arguments);
    this.drawChart();
    return this;
}
,isc.A.resized=function isc_FacetChart_resized(deltaX,deltaY,reason){
    this.Super("resized",arguments);
    if(this._getCanZoom()){
        var width=this.getWidth(),
            height=this.getHeight();
        if(width!=this._origWidth){
            this._origWidth=width;
            this._zoomChartNeedsRedraw=true;
        }
        if(height!=this._origHeight){
            this._origHeight=height;
            if(this._zoomChartCreated){
                var top=this._getZoomChartTop();
                this.zoomChart.setTop(top);
                this.zoomChartSlider.setTop(top);
                if(this.zoomShowSelection){
                    this._zoomSelectionViewCanvas.setTop(top);
                }
            }
        }
    }
    if(this._parentChart==null&&reason!="init"){
        this._redrawFacetChart(false);
    }
}
,isc.A.setFacets=function isc_FacetChart_setFacets(facets){
    this.facets=facets;
    var data=this._getData();
    if(data&&data.length>0)this.setupChart();
}
,isc.A.setData=function isc_FacetChart_setData(data){
    if(data&&!isc.isAn.Array(data)){
        data=[data];
    }
    this.data=data;
    if(data&&data.length>0){
        this.setupChart();
    }
    this._zoomChartNeedsRedraw=true;
    this.orderedData=null;
    delete this._dataIsSorted;
    delete this._statCache;
    delete this._zoomValueRange;
    if(this.zoomChart!=null){
        delete this.zoomChart._zoomValueRange;
    }
    if(this.zoomSelectionChart!=null){
        delete this.zoomSelectionChart._zoomValueRange;
    }
    if(this._hasFacetValues()){
        var maxValue=this.getMaxValue(null,true);
        this.logInfo("setData: maxValue: "+maxValue);
        this._initExtraAxes();
        if(this._getCanZoom()){
            if(this.zoomChart)this.zoomChart._initExtraAxes();
            if(this.zoomSelectionChart)this.zoomSelectionChart._initExtraAxes();
        }
    }
    this._redrawFacetChart(false);
}
,isc.A._hasFacetValues=function isc_FacetChart__hasFacetValues(){
    var dataLabelFacet=this.getDataLabelFacet(),
        legendFacet=this.getLegendFacet(),
        inlinedFacet=this._getInlinedFacet(),
        metricFacet=this._getMetricFacet();
    return(
        (this.chartType=="Scatter"||!(dataLabelFacet==null&&legendFacet==null))&&
        (dataLabelFacet==null||dataLabelFacet.values)&&
        (legendFacet==null||legendFacet.values)&&
        (inlinedFacet==null||inlinedFacet.values)&&
        (metricFacet==null||metricFacet.values));
}
,isc.A._redrawFacetChart=function isc_FacetChart__redrawFacetChart(wipeOrderedData,wipeZoomChart){
    if(this.drawingType=="vml"){
        if(!isc.FacetChart._safeForVMLRedraw){
            var delay=!isc.FacetChart._pageLoadTime?isc.FacetChart._firstVMLRedrawDelay:
                            isc.FacetChart._firstVMLRedrawDelay-
                                    (new Date().getTime()-isc.FacetChart._pageLoadTime);
            if(delay<10)delay=10;
            this.logDebug("Delaying redraw of FacetChart '"+this.ID+"' by "+delay+"ms","drawing");
            this.delayCall("_redrawFacetChart",[wipeOrderedData,wipeZoomChart],delay);
            return;
        }else{
            this.logDebug("VML redraw is marked safe drawing FacetChart '"+this.ID+
                                "' - continuing on-thread","drawing");
        }
    }
    this._destroyItems();
    if(!this.isDrawn())return;
    if(wipeOrderedData){
        this.orderedData=null;
        delete this._dataIsSorted;
    }
    delete this.cachedMaxValues;
    delete this.cachedMinValues;
    delete this._primaryMinMaxValues;
    delete this._secondaryMinMaxValues;
    delete this.gradations;
    delete this._axisStartValue;
    delete this._axisEndValue;
    delete this._oneGradationLabel;
    delete this._secondGradations;
    delete this._secondAxisStartValue;
    delete this._secondAxisEndValue;
    delete this._gradationsWidth;
    delete this._gradationsHeight;
    delete this._dataLabels;
    delete this._zoomDataBounds;
    this._zoomChartNeedsRedraw=true;
    if(wipeZoomChart){
        this._setZoomChartProperties();
        delete this._zoomValueRange;
        delete this._zoomChartCreated;
        if(this._redrawZoomChartTimerEvent!=null){
            isc.Timer.clear(this._redrawZoomChartTimerEvent);
            delete this._redrawZoomChartTimerEvent;
        }
        if(this._redrawZoomSelectionChartTimerEvent!=null){
            isc.Timer.clear(this._redrawZoomSelectionChartTimerEvent);
            delete this._redrawZoomSelectionChartTimerEvent;
        }
        if(this.zoomSelectionChart!=null){
            this.zoomSelectionChart.destroy();
            delete this.zoomSelectionChart;
        }
        if(this._zoomSelectionViewCanvas!=null){
            this._zoomSelectionViewCanvas.destroy();
            delete this._zoomSelectionViewCanvas;
        }
        if(this.zoomChart!=null){
            this.zoomChart.destroy();
            delete this.zoomChart;
        }
        if(this.zoomChartSlider!=null){
            this.ignore(this.zoomChartSlider,"changed");
            this.ignore(this.zoomChartSlider,"resized");
            this.zoomChartSlider.destroy();
            delete this.zoomChartSlider;
        }
    }else{
        if(this.zoomChart!=null){
            this.zoomChart.setChartType(this.chartType);
            this.zoomChart.setStacked(this.stacked);
            this.zoomChart.setFilled(this.filled);
        }
        if(this.zoomSelectionChart!=null){
            this.zoomSelectionChart.setChartType(this.chartType);
            this.zoomSelectionChart.setStacked(this.stacked);
            this.zoomSelectionChart.setFilled(this.filled);
        }
    }
    delete this._valueAxisLabelsHeight;
    delete this._legendRect;
    delete this._showDataValues;
    delete this._showValueOnHover;
    if(this._hasExtraAxes()){
        var settings=this._getExtraAxisSettings().all;
        for(var i=0;i<settings.length;++i){
            var context=settings[i];
            delete context.cachedMaxValues;
            delete context.cachedMinValues;
            delete context._primaryMinMaxValues;
            delete context._secondaryMinMaxValues;
            delete context.gradations;
            delete context._axisStartValue;
            delete context._axisEndValue;
            delete context._zoomDataBounds;
            delete context._showDataValues;
            delete context._showValueOnHover;
        }
    }
    this.xLabelsHeight=this.yLabelsWidth=null;
    this.drawChart();
}
,isc.A.drawChart=function isc_FacetChart_drawChart(){
    this.beginBatchDrawing();
    try{
        this._drawChart();
    }finally{
        this.endBatchDrawing(true);
    }
}
,isc.A._drawChart=function isc_FacetChart__drawChart(){
    this.drawTitle();
    if(this._shouldShowLegend()){
        this.drawLegend();
    }
    var data=this._getData();
    if(!isc.isAn.Array(data)||data.length==0||!this._hasFacetValues()){
        return;
    }
    this._setZoomChartProperties();
    var hasYGradations=this.hasYGradations(),
        hasXGradations=this.hasXGradations();
    var vertical,
        rotateLabels,
        secondRotateLabels=this._canRotateLabels(),
        labelDataPairs,secondLabelDataPairs,
        gradations,secondGradations,
        axisStartValue,secondAxisStartValue,
        axisEndValue,secondAxisEndValue,
        logScale,secondLogScale;
    this._chartRectLeftMargin=this._chartRectRightMargin=this.chartRectMargin;
    this._usingNewLayoutAlgorithm=this.chartType!="Radar"&&!this.isPieChart();
    this._addGradationForShowDataValuesBarChart=!this._usingNewLayoutAlgorithm;
    if(this._usingNewLayoutAlgorithm){
        delete this.xLabelsHeight;
        delete this.yLabelsWidth;
        delete this._primaryMinMaxValues;
        delete this._secondaryMinMaxValues;
        delete this.gradations;
        delete this._axisStartValue;
        delete this._axisEndValue;
        delete this._secondGradations;
        delete this._secondAxisStartValue;
        delete this._secondAxisEndValue;
        delete this._dataLabels;
        delete this._extraAxisStartMargin;
        var availableWidth=this._getAvailableWidth(),
            availableHeight=this._getAvailableHeight(),
            numValueAxes=this._getNumValueAxes(),
            numAxes=1+numValueAxes,
            settings=(numAxes>2?this._getExtraAxisSettings().visible:null),
            hasExtraAxes=this._hasExtraAxes(),
            groups=null,
            numGroups=1,
            hasSideValueAxisLabels=false,
            valueAxisLabelWidths=null,
            valueAxisExtraWidths=null,
            labelDataPairs=new Array(numValueAxes);
        if(hasExtraAxes){
            var extraAxisSettings=this._getExtraAxisSettings();
            groups=extraAxisSettings.groups;
            numGroups=groups.length;
            hasSideValueAxisLabels=this._hasSideValueAxisLabels();
            valueAxisLabelWidths=new Array(numAxes-1);
            valueAxisExtraWidths=new Array(numAxes-1);
        }else if(this.hasYGradations()){
            groups=[[this]];
        }else{
            groups=[this];
        }
        var axes=this._axes=new Array(1+numGroups);
        for(;;){
            var horizontalAxis=axes[0]=this._createAxis(false,this,0);
            for(var j=0,k=0;j<numGroups;++j){
                var contexts=groups[j],
                    minAxisWidths;
                if(hasExtraAxes){
                    minAxisWidths=new Array(contexts.length);
                    for(var l=0;l<contexts.length;++k,++l){
                        var context=contexts[l],
                            extraWidth=valueAxisExtraWidths[k]=this._getValueAxisExtraWidth(context);
                        if(!hasSideValueAxisLabels&&this.shouldShowValueAxisLabel(context)){
                            var valueAxisLabelWidth=valueAxisLabelWidths[k]=this.measureLabel(
                                    context.valueTitle,context.valueAxisLabelProperties).width;
                            minAxisWidths[l]=Math.max(0,valueAxisLabelWidth-extraWidth);
                        }else{
                            valueAxisLabelWidths[k]=0;
                            minAxisWidths[l]=0;
                        }
                    }
                }else if(isc.isAn.Array(contexts)){
                    minAxisWidths=[0];
                }else{
                    minAxisWidths=0;
                }
                axes[1+j]=this._createAxis(true,contexts,minAxisWidths);
            }
            var info=this._calculateAxisLayout(axes,horizontalAxis,availableWidth,availableHeight);
            var axisMeasures=info.axisMeasures,
                axisWidths=info.axisWidths,
                axisHeights=info.axisHeights;
            var horizontalAxisMeasure=axisMeasures[0],
                horizontalAxisWidth=axisWidths[0],
                horizontalAxisHeight=axisHeights[0],
                horizontalAxisRotateLabels=horizontalAxis.rotateLabels(horizontalAxisMeasure),
                horizontalAxisUseGradations=horizontalAxis.useGradations(horizontalAxisMeasure),
                horizontalAxisLabelDataPairs=horizontalAxis.getLabelDataPairs(
                    horizontalAxisWidth,horizontalAxisHeight,horizontalAxisMeasure),
                horizontalAxisLogScale=horizontalAxis.logScale(horizontalAxisMeasure);
            if(isc.isAn.Array(horizontalAxisWidth)){
                horizontalAxisWidth=horizontalAxisWidth[0];
            }
            if(isc.isAn.Array(horizontalAxisHeight)){
                horizontalAxisHeight=horizontalAxisHeight[0];
            }
            var reserveLeft=horizontalAxisMeasure._reserveLeft||0,
                reserveRight=horizontalAxisMeasure._reserveRight||0;
            this._chartRectLeftMargin+=reserveLeft;
            this._chartRectRightMargin+=reserveRight;
            if(this.chartType=="Scatter"||hasYGradations){
                rotateLabels=false;
                secondRotateLabels=horizontalAxisRotateLabels;
            }else{
                rotateLabels=horizontalAxisRotateLabels;
                secondRotateLabels=false;
            }
            var yLabelsWidth;
            if(this.chartType=="Scatter"){
                var verticalAxis=axes[1],
                    verticalAxisMeasure=axisMeasures[1],
                    verticalAxisWidth=axisWidths[1][0],
                    verticalAxisHeights=axisHeights[1][0];
                vertical=true;
                yLabelsWidth=verticalAxisWidth;
                var valueLabelDataPairs=labelDataPairs[0]=verticalAxis.getLabelDataPairs(
                    verticalAxisWidth,verticalAxisHeight,verticalAxisMeasure)[0];
                gradations=valueLabelDataPairs.getProperty("dataValue");
                axisStartValue=verticalAxis._getAxisStartValue(
                    verticalAxisWidth,verticalAxisHeight,verticalAxisMeasure);
                axisEndValue=verticalAxis._getAxisEndValue(
                    verticalAxisWidth,verticalAxisHeight,verticalAxisMeasure);
                logScale=verticalAxis.logScale(verticalAxisMeasure);
                secondLabelDataPairs=horizontalAxisLabelDataPairs[0];
                secondGradations=secondLabelDataPairs.getProperty("dataValue");
                secondAxisStartValue=horizontalAxis._getAxisStartValue(
                    horizontalAxisWidth,horizontalAxisHeight,horizontalAxisMeasure);
                secondAxisEndValue=horizontalAxis._getAxisEndValue(
                    horizontalAxisWidth,horizontalAxisHeight,horizontalAxisMeasure);
                secondLogScale=horizontalAxisLogScale;
            }else if(hasXGradations){
                var verticalAxis=axes[1],
                    verticalAxisMeasure=axisMeasures[1],
                    verticalAxisWidth=axisWidths[1],
                    verticalAxisHeight=axisHeights[1];
                vertical=false;
                yLabelsWidth=verticalAxisWidth;
                var valueLabelDataPairs=labelDataPairs[0]=horizontalAxisLabelDataPairs[0];
                gradations=valueLabelDataPairs.getProperty("dataValue");
                axisStartValue=horizontalAxis._getAxisStartValue(
                    horizontalAxisWidth,horizontalAxisHeight,horizontalAxisMeasure),
                axisEndValue=horizontalAxis._getAxisEndValue(
                    horizontalAxisWidth,horizontalAxisHeight,horizontalAxisMeasure);
                logScale=horizontalAxisLogScale;
                secondLabelDataPairs=verticalAxis.getLabelDataPairs(
                    verticalAxisWidth,verticalAxisHeight,verticalAxisMeasure);
                secondLogScale=verticalAxis.logScale(verticalAxisMeasure);
                if(verticalAxis.useGradations(verticalAxisMeasure)){
                    secondGradations=secondLabelDataPairs.getProperty("dataValue");
                }
            }else{
                vertical=true;
                secondLabelDataPairs=horizontalAxisLabelDataPairs;
                secondLogScale=horizontalAxisLogScale;
                if(horizontalAxisUseGradations){
                    secondGradations=secondLabelDataPairs.getProperty("dataValue");
                }
                horizontalAxisWidth-=reserveLeft+reserveRight;
                for(var j=0,k=0;j<numGroups;++j){
                    var contexts=groups[j],
                        axis=axes[1+j],
                        axisLabelDataPairs=axis.getLabelDataPairs(
                            axisWidths[1+j],axisHeights[1+j],axisMeasures[1+j]);
                    for(var l=0;l<contexts.length;++l,++k){
                        if(k==0){
                            var mainValueAxis=axis,
                                mainValueAxisMeasure=axisMeasures[1+j],
                                mainValueAxisWidth=axisWidths[1+j][l],
                                mainValueAxisHeight=axisHeights[1+j][l];
                            var mainValueLabelDataPairs=labelDataPairs[0]=axisLabelDataPairs[l];
                            gradations=mainValueLabelDataPairs.getProperty("dataValue");
                            axisStartValue=mainValueAxis._getAxisStartValue(
                                mainValueAxisWidth,mainValueAxisHeight,mainValueAxisMeasure);
                            axisEndValue=mainValueAxis._getAxisEndValue(
                                mainValueAxisWidth,mainValueAxisHeight,mainValueAxisMeasure);
                            yLabelsWidth=mainValueAxisWidth;
                            logScale=mainValueAxis.logScale(mainValueAxisMeasure);
                            this._gradationsWidth=this.measureLabels(
                                mainValueLabelDataPairs.getProperty("label"),"width",this.gradationLabelProperties);
                            this._totalValueAxisWidth=mainValueAxisWidth;
                        }else{
                            var valueAxis=axis,
                                context=contexts[l],
                                valueAxisMeasure=axisMeasures[1+j],
                                valueAxisWidth=axisWidths[1+j][l],
                                valueAxisHeight=axisHeights[1+j][l];
                            var pairs=labelDataPairs[k]=axisLabelDataPairs[l];
                            context.gradations=pairs.getProperty("dataValue");
                            context._axisStartValue=valueAxis._getAxisStartValue(
                                valueAxisWidth,valueAxisHeight,valueAxisMeasure);
                            context._axisEndValue=valueAxis._getAxisEndValue(
                                valueAxisWidth,valueAxisHeight,valueAxisMeasure);
                            context._gradationsWidth=this.measureLabels(
                                pairs.getProperty("label"),"width",context.gradationLabelProperties);
                            context._totalValueAxisWidth=valueAxisWidth+valueAxisExtraWidths[k];
                        }
                    }
                }
            }
            this.xLabelsHeight=horizontalAxisHeight+this.getAxisLabelSpace(false);
            this.yLabelsWidth=yLabelsWidth+this.getAxisLabelSpace(true);
            if(gradations!=null){
                this.gradations=gradations;
                this._axisStartValue=axisStartValue;
                this._axisEndValue=axisEndValue;
            }
            if(secondGradations!=null){
                this._secondGradations=secondGradations;
                this._secondAxisStartValue=secondAxisStartValue;
                this._secondAxisEndValue=secondAxisEndValue;
            }
            var tryAdditionalGradation=!this._addGradationForShowDataValuesBarChart;
            if(tryAdditionalGradation){
                tryAdditionalGradation=false;
                var allSettings=(hasExtraAxes?this._getExtraAxisSettings().all:null);
                for(var j=0;!tryAdditionalGradation&&j<numValueAxes;++j){
                    var context=(j==0?this:allSettings[j-1]);
                    tryAdditionalGradation=(
                        context.showDataValues&&
                        (context.chartType=="Bar"||context.chartType=="Column"));
                }
            }
            if(tryAdditionalGradation){
                this._drawChartRect(false);
                tryAdditionalGradation=this._drawData(
                    secondGradations,secondLogScale,secondLabelDataPairs,
                    secondRotateLabels,true);
                if(tryAdditionalGradation){
                    delete this.orderedData;
                    delete this._chartRect;
                    delete this._chartRectTopPadding;
                    delete this._chartRectBottomPadding;
                    delete this._chartRectLeftPadding;
                    delete this._chartRectRightPadding;
                    this._chartRectLeftMargin=this._chartRectRightMargin=this.chartRectMargin;
                    this._addGradationForShowDataValuesBarChart=true;
                    continue;
                }
            }
            break;
        }
        this._dataLabels=secondLabelDataPairs.getProperty("label");
    }else{
        this.measureDataLabels();
        this._calculateAllGradations();
        this.measureGradationLabels(true);
    }
    this._drawChartRect(true);
    this.drawGradationLabels(vertical,labelDataPairs,rotateLabels);
    var showGradationsOverData=this.showGradationsOverData;
    if(hasExtraAxes){
        this._drawAllGradations();
    }else{
        this._drawAllGradations(
            vertical,gradations,axisStartValue,axisEndValue,false,showGradationsOverData);
        if(secondGradations!=null&&this.chartType!="Scatter"){
            this._drawAllGradations(
                !vertical,secondGradations,null,null,showGradationsOverData);
        }
    }
    if(this.chartBackgroundDrawn){
        this.chartBackgroundDrawn();
    }
    this.logDebug("drawing data","chartDraw");
    this._cleanHoverItems();
    if(!this.showStatisticsOverData&&this.chartType!="Scatter"){
        this._drawStatistics();
    }
    this._drawData(
        secondGradations,secondLogScale,secondLabelDataPairs,secondRotateLabels,false);
    if(this.showStatisticsOverData){
        this._drawStatistics();
    }
    if(showGradationsOverData){
        this._drawGradations(vertical,gradations,axisStartValue,axisEndValue,true,false);
        if(secondGradations!=null){
            this._drawGradations(!vertical,secondGradations,null,null,true,false);
        }
    }
    this.drawDataAxisLabel();
    this._drawAllValueAxisLabels();
    if(this.chartDrawn){
        this.chartDrawn();
    }
    if(this._zoomChartNeedsRedraw&&this._getCanZoom()){
        if(!this._zoomChartCreated){
            this._createZoomChartAndSlider();
        }
        var _this=this;
        if(this._redrawZoomChartTimerEvent==null){
            this._redrawZoomChartTimerEvent=isc.Timer.setTimeout(function(){
                delete _this._redrawZoomChartTimerEvent;
                if(_this._zoomChartCreated){
                    var left=_this._getZoomChartLeft(),
                        top=_this._getZoomChartTop(),
                        chartWidth=_this.getChartWidth();
                    _this.zoomChart.setRect(left,top,chartWidth);
                    _this.zoomChartSlider.setRect(left,top,chartWidth);
                    if(!_this.zoomChart.isDrawn()){
                        _this.zoomChart.draw();
                    }else{
                        _this.zoomChart._redrawFacetChart(false);
                    }
                    if(_this.zoomShowSelection){
                        if(_this._redrawZoomSelectionChartTimerEvent==null){
                            _this._redrawZoomSelectionChartTimerEvent=isc.Timer.setTimeout(function(){
                                delete _this._redrawZoomSelectionChartTimerEvent;
                                if(_this._zoomChartCreated){
                                    var top=_this._getZoomChartTop(),
                                        chartWidth=_this.getChartWidth();
                                    _this._zoomSelectionViewCanvas.setTop(top);
                                    _this.zoomSelectionChart.setWidth(chartWidth);
                                    if(!_this.zoomSelectionChart.isDrawn()){
                                        _this.zoomSelectionChart.draw();
                                    }else{
                                        _this.zoomSelectionChart._redrawFacetChart(false);
                                    }
                                }
                                _this._zoomChartNeedsRedraw=false;
                            },0);
                        }
                    }else{
                        _this._zoomChartNeedsRedraw=false;
                    }
                }else{
                    _this._zoomChartNeedsRedraw=false;
                }
            },0);
        }
    }
}
);
isc.evalBoundary;isc.B.push(isc.A.hasXGradations=function isc_FacetChart_hasXGradations(chartType){
    return(chartType||this.chartType)=="Bar";
}
,isc.A.hasYGradations=function isc_FacetChart_hasYGradations(chartType){
    return(chartType||this.chartType)!="Bar";
}
,isc.A.measureDataLabels=function isc_FacetChart_measureDataLabels(){
    if(this.hasYGradations()){
        this.getXLabelsHeight(true);
    }else{
        this.getYLabelsWidth(true);
    }
}
,isc.A.erase=function isc_FacetChart_erase(destroy,willRedraw){
    this._cleanHoverItems();
    delete this._mutedDataGradients;
    if(this._hasExtraAxes()){
        var settings=this._getExtraAxisSettings().all;
        for(var i=0;i<settings.length;++i){
            delete settings[i]._mutedDataGradients;
        }
    }
    this.Super("erase",arguments);
    this.dataGradients=isc.addProperties({},this.origDataGradients);
}
,isc.A.destroyItems=function isc_FacetChart_destroyItems(){
    this._destroyZoomChartAndSlider();
    this._destroyItems();
}
,isc.A._destroyItems=function isc_FacetChart__destroyItems(){
    this.Super("destroyItems",arguments);
}
,isc.A._getMultiMinMaxValues=function isc_FacetChart__getMultiMinMaxValues(primary,context){
    var cache=(primary?context._primaryMinMaxValues:context._secondaryMinMaxValues);
    if(cache!=null){
        return cache;
    }else if(primary){
        cache=context._primaryMinMaxValues={};
    }else{
        cache=context._secondaryMinMaxValues={};
    }
    var scatter=(context.chartType=="Scatter"),
        considerPartialSums=!scatter,
        metricFacet=this._getMetricFacet(),
        yAxisMetric=scatter&&this.getYAxisMetric(),
        xAxisMetric=scatter&&this.getXAxisMetric(),
        lowErrorMetric=this._getLowErrorMetric(),
        highErrorMetric=this._getHighErrorMetric();
    var supportsErrorBars=(!this._hasExtraAxes()&&metricFacet!=null),
        considerErrorBars=false;
    var logScale=(primary&&context.logScale);
    var minValue,maxValue;
    if(context==this){
        if(scatter){
            var metric=(primary?yAxisMetric:xAxisMetric);
            if(metricFacet!=null&&metric!=null){
                var xAxisStartValue=this._getAxisStartValue(false,null,null,null,context),
                    yAxisStartValue=this._getAxisStartValue(true,null,null,null,context),
                    oppAxisStartValue=(primary?xAxisStartValue:yAxisStartValue),
                    oppMetric=(primary?xAxisMetric:yAxisMetric),
                    isDateValued=this._isDateValued(metric),
                    oppIsDateValued=this._isDateValued(oppMetric);
                if(oppAxisStartValue!=null){
                    var facetValues={};
                    facetValues[metricFacet.id]=metric;
                    var values=this.getValue(facetValues,true,isDateValued);
                    facetValues[metricFacet.id]=oppMetric;
                    var oppValues=this.getValue(facetValues,true,oppIsDateValued);
                    if(values!=null&&oppValues!=null){
                        var lowValues,lowOppValues;
                        if(supportsErrorBars&&lowErrorMetric!=null&&
                            !(primary?isDateValued:oppIsDateValued))
                        {
                            facetValues[metricFacet.id]=lowErrorMetric;
                            if(primary){
                                lowValues=this.getValue(facetValues,true,false);
                                lowOppValues=null;
                            }else{
                                lowValues=null;
                                lowOppValues=this.getValue(facetValues,true,false);
                            }
                        }
                        var highValues,highOppValues;
                        if(supportsErrorBars&&highErrorMetric!=null&&
                            !(primary?isDateValued:oppIsDateValued))
                        {
                            facetValues[metricFacet.id]=highErrorMetric;
                            if(primary){
                                highValues=this.getValue(facetValues,true,false);
                                highOppValues=null;
                            }else{
                                highValues=null;
                                highOppValues=this.getValue(facetValues,true,false);
                            }
                        }
                        var oppLogScale=(!primary&&context.logScale);
                        logScale=logScale&&!isDateValued;
                        oppLogScale=oppLogScale&&!oppIsDateValued;
                        for(var j=values.length;j--;){
                            var validValue=(
                                    isDateValued?isc.isA.Date(values[j]):
                                    isc.isA.Number(values[j])&&(!logScale||values[j]>0)),
                                validOppValue=(
                                    oppIsDateValued?isc.isA.Date(oppValues[j]):
                                    isc.isA.Number(oppValues[j])&&
                                        (!oppLogScale||oppValues[j]>0));
                            if(validValue&&validOppValue){
                                var maxOppVal=oppValues[j];
                                if(lowOppValues!=null&&(!oppLogScale||lowOppValues[j]>0)){
                                    maxOppVal=Math.max(maxOppVal,lowOppValues[j]);
                                }
                                if(highOppValues!=null&&(!oppLogScale||highOppValues[j]>0)){
                                    maxOppVal=Math.max(maxOppVal,highOppValues[j]);
                                }
                                if(oppIsDateValued?
                                        maxOppVal.getTime()>=oppAxisStartValue.getTime():
                                        maxOppVal>=oppAxisStartValue)
                                {
                                    var minVal=values[j],
                                        maxVal=values[j];
                                    if(lowValues!=null&&
                                        isc.isA.Number(lowValues[j])&&
                                        (!logScale||lowValues[j]>0))
                                    {
                                        minVal=Math.min(minVal,lowValues[j]);
                                        maxVal=Math.max(maxVal,lowValues[j]);
                                    }
                                    if(highValues!=null&&
                                        isc.isA.Number(highValues[j])&&
                                        (!logScale||highValues[j]>0))
                                    {
                                        minVal=Math.min(minVal,highValues[j]);
                                        maxVal=Math.max(maxVal,highValues[j]);
                                    }
                                    if(minValue==null){
                                        minValue=minVal;
                                        maxValue=maxVal;
                                    }else if(isDateValued){
                                        minValue=isc.DateUtil._min(minValue,minVal);
                                        maxValue=isc.DateUtil._max(maxValue,maxVal);
                                    }else{
                                        minValue=Math.min(minValue,minVal);
                                        maxValue=Math.max(maxValue,maxVal);
                                    }
                                }
                            }
                        }
                    }
                }else{
                    minValue=this.getMinValue(metric,null,null,null,logScale);
                    maxValue=this.getMaxValue(metric,null,null,null,logScale);
                    considerErrorBars=!this._isDateValued(metric);
                }
            }
        }else{
            var metric=this.getDefaultMetric();
            minValue=this.getMinValue(metric,null,null,considerPartialSums,logScale);
            maxValue=this.getMaxValue(metric,null,null,considerPartialSums,logScale);
            considerErrorBars=!this._isDateValued(metric);
        }
    }else{
        minValue=this.getMinValue(context._metric,null,context,considerPartialSums,logScale);
        maxValue=this.getMaxValue(context._metric,null,context,considerPartialSums,logScale);
        considerErrorBars=false;
    }
    if(logScale&&minValue==null&&maxValue==null){
        minValue=maxValue=0;
    }
    cache.minValue=minValue;
    cache.maxValue=maxValue;
    if(considerErrorBars&&primary&&supportsErrorBars){
        if(lowErrorMetric!=null){
            this._minMaxWithErrorMetric(lowErrorMetric,cache,logScale);
        }
        if(highErrorMetric!=null){
            this._minMaxWithErrorMetric(highErrorMetric,cache,logScale);
        }
    }
    return cache;
}
,isc.A._minMaxWithErrorMetric=function isc_FacetChart__minMaxWithErrorMetric(errorMetric,values,logScale){
    var minValue=values.minValue,
        maxValue=values.maxValue,
        minError=this.getMinValue(errorMetric,null,null,null,logScale),
        maxError=this.getMaxValue(errorMetric,null,null,null,logScale);
    if(minValue==null){
        minValue=minError;
    }else if(minError!=null){
        minValue=Math.min(minValue,minError);
    }
    if(maxValue==null){
        maxValue=maxError;
    }else if(maxError!=null){
        maxValue=Math.max(maxValue,maxError);
    }
    values.minValue=minValue;
    values.maxValue=maxValue;
}
,isc.A.getMagnitude=function isc_FacetChart_getMagnitude(number,base,context){
    context=context||this;
    if(number==0)return 0;
    if(base==null)base=context.logBase;
    var logValue=this.logValue(number,base,context);
    return Math.ceil(logValue);
}
,isc.A.getGradations=function isc_FacetChart_getGradations(context){
    return this._getGradations(false,true,null,context);
}
,isc.A._getGradations=function isc_FacetChart__getGradations(recalc,primary,axisLength,context){
    context=context||this;
    var minMaxValues=this._getMultiMinMaxValues(primary,context),
        minValue=minMaxValues.minValue,
        maxValue=minMaxValues.maxValue;
    var useLog=primary&&this.shouldUseLogGradations(context);
    if(useLog){
        return this.getLogGradations(maxValue,minValue,recalc,context);
    }
    if(!recalc&&(primary?context.gradations:context._secondGradations)){
        return(primary?context.gradations:context._secondGradations);
    }
    var axisLength=axisLength||this.getDataAxisLength(true);
    var idealGradations=Math.round(axisLength/this.pixelsPerGradation);
    var possibleIncrements=this._getPossibleIncrements(primary,minValue,maxValue,this);
    var flag=false,
        bestIncrement,
        closest=Number.MAX_VALUE;
    for(var i=0;i<possibleIncrements.length;i++){
        var increment=possibleIncrements[i],
            gradations=(this._getAxisBoundaryValues(
                    primary,minValue,maxValue,increment,this).numGradations-1),
            difference=Math.abs(idealGradations-gradations);
        if((!flag||gradations<idealGradations)&&difference<closest){
            flag=flag&&gradations<idealGradations;
            bestIncrement=increment;
            closest=difference;
        }
    }
    var increment=bestIncrement,
        info=this._getAxisBoundaryValues(primary,minValue,maxValue,increment,this),
        base=info.startValue,
        ceil=info.endValue,
        b=info.b,
        numGradations=info.numGradations,
        oneGradationLabel=info.oneGradationLabel;
    var gradations=new Array(numGradations);
    for(var i=numGradations;i--;){
        gradations[i]=((b+i)*increment);
    }
    if(primary){
        context.gradations=gradations;
        context._axisStartValue=base;
        context._axisEndValue=ceil;
        context._oneGradationLabel=oneGradationLabel;
    }else{
        context._secondGradations=gradations;
        context._secondAxisStartValue=base;
        context._secondAxisEndValue=ceil;
    }
    if(this.logIsDebugEnabled("chartScale")&&context==this){
        this.logDebug("chose increment: "+increment+". "+numGradations+
                     " gradations (ideal "+idealGradations+"): "+gradations,"chartScale");
    }
    return gradations;
}
,isc.A._getAxisStartValue=function isc_FacetChart__getAxisStartValue(primary,minValue,maxValue,gradationIncrement,context){
    var info=this._getAxisBoundaryValues(primary,minValue,maxValue,gradationIncrement,context);
    return(info!=null?info.startValue:null);
}
,isc.A._validateLogGradations=function isc_FacetChart__validateLogGradations(logGradations,logBase){
    var epsilon=logBase*1e-6,
        duplicated=false,
        valid=(isc.isAn.Array(logGradations)&&logGradations.length>0);
    for(var i=0;valid&&i<logGradations.length;++i){
        var lg=logGradations[i];
        valid=isc.isA.Number(lg);
        if(!(1<=lg)){
            if(1-epsilon<lg){
                if(!duplicated){
                    duplicated=true;
                    logGradations=logGradations.duplicate();
                }
                logGradations[i]=1;
            }else{
                valid=false;
            }
        }
        if(!(lg<logBase)){
            if(lg-epsilon<logBase){
                if(!duplicated){
                    duplicated=true;
                    logGradations=logGradations.duplicate();
                }
                logGradations.removeAt(i);
                if(!logGradations.contains(1)){
                    logGradations.unshift(1);
                }else{
                    --i;
                }
            }else{
                valid=false;
            }
        }
    }
    for(var i=1;valid&&i<logGradations.length;++i){
        var a=logGradations[i-1],
            b=logGradations[i];
        if(Math.abs(a-b)<epsilon){
            if(!duplicated){
                duplicated=true;
                logGradations=logGradations.duplicate();
            }
            logGradations.removeAt(i);
            --i;
        }else if(!(a<b)){
            valid=false;
        }
    }
    if(!valid){
        this.logWarn(
            "The chart's logGradations were invalid.  Continuing with logGradations set to [1].");
    }
    return(valid?logGradations:[1]);
}
,isc.A._getAxisBoundaryValues=function isc_FacetChart__getAxisBoundaryValues(primary,minValue,maxValue,gradationIncrement,context){
    var useLog=primary&&this.shouldUseLogGradations(context);
    var isDateValued=false;
    if(context.chartType=="Scatter"){
        isDateValued=this._isDateValued(
            primary?this.getYAxisMetric():this.getXAxisMetric());
    }else{
        isDateValued=this._isDateValued(this.getDefaultMetric());
    }
    useLog=useLog&&!isDateValued;
    var numericDataAxis=!(primary||context.chartType=="Scatter"),
        fixedBase=false,
        base=null,ceil;
    if(numericDataAxis){
        fixedBase=true;
        base=minValue;
    }else{
        var prop=(primary?"axisStartValue":"xAxisStartValue");
        if(isDateValued?isc.isA.Date(context[prop]):isc.isA.Number(context[prop])){
            fixedBase=true;
            base=context[prop];
        }
    }
    var ret={
        startValue:base,
        increment:gradationIncrement
    };
    if(!useLog&&gradationIncrement==null){
        return ret;
    }
    if(minValue==null||maxValue==null){
        ret.endValue=null;
        ret.b=-1;
        ret.c=0;
        ret.numGradations=0;
        return ret;
    }
    var minDataSpreadPercent=null;
    if(!fixedBase){
        minDataSpreadPercent=this._getMinDataSpreadPercent(primary,context);
        if(!(
            isc.isA.Number(minDataSpreadPercent)&&
            0<minDataSpreadPercent&&
            minDataSpreadPercent<100))
        {
            minDataSpreadPercent=null;
        }
    }
    if(useLog){
        if(fixedBase&&base<0){
            this.logWarn(
                "Logarithmic scaling is not supported with negative values for "+
                "axisStartValue.  Continuing with a zero start value.");
            base=0;
        }
        var includeZero=(fixedBase&&base==0);
        var logBase=context.logBase,
            logGradations=this._validateLogGradations(context.logGradations,logBase),
            logGradationsLength=logGradations.length;
        var maxMagnitude=this.getMagnitude(
                (fixedBase?Math.max(base,maxValue):maxValue),null,context),
            minMagnitude=this.getMagnitude(
                (fixedBase&&!includeZero?base:minValue),null,context);
        if((Math.pow(logBase,minMagnitude-1)*logGradations[0])>(fixedBase&&!includeZero?base:minValue)){
            --minMagnitude;
        }
        var b,c;
        if(fixedBase&&!includeZero){
            b=0;
            for(;;){
                var i=minMagnitude-1+Math.floor(b/logGradationsLength),
                    j=(b%logGradationsLength);
                if(Math.pow(logBase,i)*logGradations[j]>=base){
                    break;
                }else{
                    ++b;
                }
            }
        }else{
            b=0;
            base=Math.pow(logBase,minMagnitude-1)*logGradations[0];
        }
        c=(maxMagnitude-minMagnitude+1)*logGradationsLength;
        ceil=Math.pow(logBase,maxMagnitude);
        var numGradations=(c-b+1),
            minNumGradations=(includeZero?3:2);
        if(numGradations<minNumGradations){
            var epsilon=logBase*1e-6,
                flag=(Math.abs(logGradations[0]-1)<epsilon);
            for(;numGradations<minNumGradations;++numGradations){
                if(fixedBase&&!includeZero){
                    if(flag){
                        flag=false;
                        --numGradations;
                        ceil=ceil*logGradations[0];
                    }else{
                        ++c;
                        var i=minMagnitude-1+Math.floor(c/logGradationsLength),
                            j=(c%logGradationsLength);
                        ceil=Math.pow(logBase,i)*logGradations[j];
                    }
                }else{
                    --b;
                    var i=minMagnitude-1+Math.floor(b/logGradationsLength),
                        j=(b%logGradationsLength);
                    base=Math.pow(logBase,i)*logGradations[j];
                }
            }
        }
        var ceilLog=0,baseLog=0,valueRange=0;
        if(minValue>0){
            var maxLog=this.logValue(maxValue,logBase,context),
                minLog=this.logValue(minValue,logBase,context);
            ceilLog=this.logValue(ceil,logBase,context),
            baseLog=this.logValue(base,logBase,context);
            valueRange=(maxLog-minLog);
        }
        if(minDataSpreadPercent!=null&&
            0<valueRange&&
            valueRange<(minDataSpreadPercent/100)*(ceilLog-baseLog)){
            var minDelta=Math.abs((valueRange/(ceilLog-baseLog))-0.75);
            for(var b1=b+1,c1=c-1;minNumGradations<c-b+1;){
                var ib1=minMagnitude-1+Math.floor(b1/logGradationsLength),
                    jb1=(b1%logGradationsLength),
                    base1=Math.pow(logBase,ib1)*logGradations[jb1],
                    base1Log=this.logValue(base1,logBase,context),
                    deltab=Math.abs((valueRange/(ceilLog-base1Log))-0.75);
                var ic1=minMagnitude-1+Math.floor(c1/logGradationsLength),
                    jc1=(c1%logGradationsLength),
                    ceil1=Math.pow(logBase,ic1)*logGradations[jc1],
                    ceil1Log=this.logValue(ceil1,logBase,context),
                    deltac=Math.abs((valueRange/(ceil1Log-baseLog))-0.75);
                if(base1>minValue){
                    deltab=minDelta;
                }
                if(ceil1<maxValue){
                    deltac=minDelta;
                }
                if(deltab<deltac){
                    if(deltab<minDelta){
                        minDelta=deltab;
                        b=b1;
                        base=base1;
                        baseLog=base1Log;
                    }else{
                        break;
                    }
                }else{
                    if(deltac<minDelta){
                        minDelta=deltac;
                        c=c1;
                        ceil=ceil1;
                        ceilLog=ceil1Log;
                    }else{
                        break;
                    }
                }
            }
        }
        ret.startValue=base;
        ret.endValue=ceil;
        ret.b=b;
        ret.c=c;
        ret.numGradations=(c-b+1);
        ret.minMagnitude=minMagnitude;
        ret.maxMagnitude=maxMagnitude;
        ret.logGradations=logGradations;
        ret.includeZeroGradation=includeZero;
        return ret;
    }
    var zero=isDateValued&&isc.FacetChart._dateFloor(gradationIncrement,minValue),
        bPrime=(isDateValued?0:Math.floor(minValue/gradationIncrement)),
        useZeroBase=(
            !isDateValued&&
            !fixedBase&&
            primary&&
            (minValue!=null&&minValue>0)&&
            this._getRequireZeroGradation(context)),
        useZeroCeil=(
            !isDateValued&&
            (!fixedBase||base<maxValue)&&
            primary&&
            (maxValue!=null&&maxValue<0)&&
            this._getRequireZeroGradation(context)),
        b,c;
    if(fixedBase){
        if(isDateValued){
            b=isc.FacetChart._dateSubtract(
                gradationIncrement,
                isc.FacetChart._dateCeil(gradationIncrement,base),
                zero);
        }else{
            b=Math.ceil(base/gradationIncrement);
        }
    }else if(useZeroBase){
        b=0;
        base=0;
    }else{
        b=bPrime;
        base=(isDateValued?zero:b*gradationIncrement);
    }
    var cPrime,ceilPrime;
    if(numericDataAxis){
        ceilPrime=Math.max(base,maxValue);
        cPrime=Math.floor(ceilPrime/gradationIncrement);
    }else{
        if(primary){
            if(isDateValued){
                ceilPrime=isc.FacetChart._dateCeil(gradationIncrement,isc.DateUtil._max(base,maxValue));
                cPrime=isc.FacetChart._dateSubtract(gradationIncrement,ceilPrime,zero);
            }else{
                cPrime=Math.ceil(Math.max(base,maxValue)/gradationIncrement);
                ceilPrime=cPrime*gradationIncrement;
            }
        }else{
            if(isDateValued){
                ceilPrime=isc.FacetChart._dateCeil(gradationIncrement,isc.DateUtil._max(base,maxValue));
                cPrime=isc.FacetChart._dateSubtract(gradationIncrement,ceilPrime,zero);
            }else{
                ceilPrime=Math.max(base,maxValue);
                cPrime=Math.floor(ceilPrime/gradationIncrement);
            }
        }
    }
    if(useZeroCeil){
        ceil=0;
        c=0;
    }else{
        ceil=ceilPrime;
        c=cPrime;
    }
    var oneGradationLabel=false;
    if(!numericDataAxis){
        if(!isDateValued&&primary&&
            (context.chartType=="Bar"||context.chartType=="Column")&&
            context.showDataValues&&
            (maxValue!=null&&maxValue>=0)&&
            this._addGradationForShowDataValuesBarChart)
        {
            ++c;
            ceil=c*gradationIncrement;
        }
        var numGradations=(c-b+1);
        if(numGradations<2){
            if(!fixedBase){
                if(isDateValued){
                    base=isc.FacetChart._dateFloor(gradationIncrement,minValue);
                    b=isc.FacetChart._dateSubtract(gradationIncrement,base,zero);
                }else{
                    b=Math.floor(minValue/gradationIncrement);
                    base=b*gradationIncrement;
                }
            }
            if(isDateValued){
                ceil=isc.FacetChart._dateCeil(
                    gradationIncrement,isc.DateUtil._max(base,maxValue));
                c=isc.FacetChart._dateSubtract(gradationIncrement,ceil,zero);
            }else{
                c=Math.ceil(Math.max(base,maxValue)/gradationIncrement);
                ceil=c*gradationIncrement;
            }
            if(b==c){
                ++c;
                if(isDateValued){
                    ceil=isc.FacetChart._nextDate(gradationIncrement,ceil);
                }else{
                    ceil=c*gradationIncrement;
                }
                oneGradationLabel=true;
            }
        }
    }
    var numGradations=(c-b+1);
    var valueRange;
    if(fixedBase){
        if(isDateValued){
            var t0=isc.DateUtil._max(base,minValue),
                t1=isc.DateUtil._max(base,maxValue);
            valueRange=(t1.getTime()-t0.getTime());
        }else{
            valueRange=(Math.max(base,maxValue)-Math.max(base,minValue));
        }
    }else{
        valueRange=(
            isDateValued?maxValue.getTime()-minValue.getTime():maxValue-minValue);
    }
    var baseCeilRange=(isDateValued?ceil.getTime()-base.getTime():ceil-base);
    if(minDataSpreadPercent!=null&&
        0<valueRange&&
        valueRange<(minDataSpreadPercent/100)*baseCeilRange)
    {
        var fixed=false;
        if(!primary&&context.chartType=="Scatter"){
            if(isDateValued){
                ceil=isc.FacetChart._dateCeil(gradationIncrement,ceil);
                c=isc.FacetChart._dateSubtract(gradationIncrement,ceil,zero);
            }else{
                c=Math.ceil(ceil/gradationIncrement);
                ceil=c*gradationIncrement;
            }
            numGradations=(c-b+1);
            baseCeilRange=(isDateValued?ceil.getTime()-base.getTime():ceil-base);
            fixed=(valueRange<(minDataSpreadPercent/100)*baseCeilRange);
        }
        if(!fixed){
            var maxN=Math.min(numGradations-2,(bPrime-b)+(c-cPrime));
            var n=c-b-valueRange/gradationIncrement/0.75,
                n0=Math.max(0,Math.min(maxN,Math.floor(n))),
                n1=Math.max(0,Math.min(maxN,Math.ceil(n)));
            if(n0==n1){
                n=n0;
            }else if(c-b-n1==0){
                n=n0;
            }else if(c-b-n0==0){
                n=n1;
            }else{
                var spreadPercent0=(valueRange/(c-b-n0)/gradationIncrement),
                    spreadPercent1=(valueRange/(c-b-n1)/gradationIncrement);
                if(Math.abs(spreadPercent0-0.75)<Math.abs(spreadPercent1-0.75)){
                    n=n0;
                }else{
                    n=n1;
                }
            }
            var nb=0,nc=0;
            if(!isDateValued&&minValue!=null&&minValue>0){
                nb=Math.min(n,bPrime-b);
                nc=n-nb;
            }else if(!isDateValued&&maxValue!=null&&maxValue<0){
                nc=Math.min(n,c-cPrime);
                nb=n-nc;
            }else{
                nb=Math.min(Math.ceil(n/2),bPrime-b);
                nc=n-nb;
            }
            b+=nb;
            if(isDateValued){
                if(nb>0){
                    base=isc.FacetChart._dateAddScope(gradationIncrement,base,nb);
                }
            }else{
                base+=nb*gradationIncrement;
            }
            c-=nc;
            if(isDateValued){
                if(nc>0){
                    ceil=isc.FacetChart._dateAddScope(gradationIncrement,ceil,-nc);
                }
            }else{
                ceil-=nc*gradationIncrement;
            }
            numGradations=(c-b+1);
        }
    }
    oneGradationLabel=(oneGradationLabel||(numGradations==1));
    ret.startValue=base;
    ret.endValue=ceil;
    ret.b=b;
    ret.c=c;
    ret.numGradations=numGradations;
    ret.oneGradationLabel=oneGradationLabel;
    ret.isDateValued=isDateValued;
    if(isDateValued){
        ret.zero=zero;
    }
    return ret;
}
,isc.A._getPossibleIncrements=function isc_FacetChart__getPossibleIncrements(primary,minValue,maxValue,context){
    var axisStartValue=this._getAxisStartValue(primary,minValue,maxValue,null,context);
    if(axisStartValue!=null){
        var valueRange=Math.max(0,maxValue-axisStartValue);
        var magnitude=this.getMagnitude(valueRange,10,context);
        var high=Math.pow(10,magnitude-1),low=Math.pow(10,(magnitude-2));
        var possibleIncrements=[
            low,
            2*low,
            5*low,
            10*low,
            2*high,
            5*high
        ];
        return possibleIncrements;
    }
    var magnitude=this.getMagnitude(maxValue-minValue,10,context),
        minMagnitude=magnitude,
        maxMagnitude=magnitude;
    for(var notDone=true;notDone;){
        notDone=false;
        var magnitude=maxMagnitude,
            low=Math.pow(10,magnitude-2),
            high=10*low;
        for(var i=0;i<6;++i){
            var increment;
            switch(i){
            case 0:increment=low;break;
            case 1:increment=2*low;break;
            case 2:increment=5*low;break;
            case 3:increment=high;break;
            case 4:increment=2*high;break;
            case 5:increment=5*high;break;
            }
            var boundary=this._getAxisBoundaryValues(primary,minValue,maxValue,increment,context),
                m=this.getMagnitude((boundary.c-boundary.b)*increment,10,context);
            if(!(minMagnitude<=m&&m<=maxMagnitude)){
                notDone=notDone||!(m<=maxMagnitude);
                minMagnitude=Math.min(minMagnitude,m);
                maxMagnitude=Math.max(maxMagnitude,m);
            }
        }
    }
    var increments=new Array(6*(maxMagnitude-minMagnitude+1));
    for(var m=minMagnitude;m<=maxMagnitude;++m){
        var low=Math.pow(10,m-2),
            i=6*(m-minMagnitude);
        increments[i]=low;
        increments[i+1]=2*low;
        increments[i+2]=5*low;
        increments[i+3]=10*low;
        increments[i+4]=20*low;
        increments[i+5]=50*low;
    }
    return increments;
}
,isc.A._calculateAllGradations=function isc_FacetChart__calculateAllGradations(axisLength){
    var recalc=true,
        primary=true;
    this._getGradations(recalc,primary,axisLength,this);
    var settings=this._getExtraAxisSettings();
    if(settings!=null){
        settings=settings.all;
        for(var i=0,numExtraAxes=settings.length;i<numExtraAxes;++i){
            var metricSettings=settings[i];
            this._getGradations(recalc,primary,axisLength,metricSettings);
        }
    }
}
,isc.A.logValue=function isc_FacetChart_logValue(number,base,context){
    if(base==null)base=(context||this).logBase;
    return Math.log(number)/Math.log(base);
}
,isc.A.shouldUseLogGradations=function isc_FacetChart_shouldUseLogGradations(context){
    context=context||this;
    if(context.logScale==false)return false;
    if(context.useLogGradations!=null)return context.useLogGradations;
    return context.logBase==10;
}
,isc.A.getLogGradations=function isc_FacetChart_getLogGradations(maxValue,minValue,recalc,context){
    context=context||this;
    if(!recalc&&context.gradations)return context.gradations;
    if(minValue<0)this.logWarn("logarithmic scaling is not supported with negative values");
    var logBase=context.logBase,
        info=this._getAxisBoundaryValues(true,minValue,maxValue,null,context);
    if(context==this){
        this.logDebug("magnitude of max,min: "+[info.maxMagnitude,info.minMagnitude],"chartScale");
    }
    var logGradations=info.logGradations,
        logGradationsLength=logGradations.length,
        numGradations=info.numGradations,
        gradations=new Array(numGradations),
        minMagnitude=info.minMagnitude,
        b=info.b;
    for(var i=numGradations;i--;){
        if(i==0&&info.includeZeroGradation){
            gradations[i]=0;
        }else{
            var j=minMagnitude-1+Math.floor((b+i)/logGradationsLength),
                k=((b+i)%logGradationsLength);
            gradations[i]=Math.pow(logBase,j)*logGradations[k];
        }
    }
    context.gradations=gradations;
    context._axisStartValue=info.startValue;
    context._axisEndValue=info.endValue;
    if(context==this){
        this.logDebug("log gradations: "+gradations,"chartScale");
    }
    return gradations;
}
,isc.A.getMaxGradation=function isc_FacetChart_getMaxGradation(context){
    context=context||this;
    return context.gradations.last();
}
,isc.A.measureGradationLabels=function isc_FacetChart_measureGradationLabels(){
    if(this.isPieChart()||this.chartType=="Radar"){
        this._gradationsWidth=this._gradationsHeight=0;
        return;
    }
    var vertical=this.hasYGradations(),
        props=this.gradationLabelProperties,
        gradations=this.gradations.duplicate();
    for(var i=0;i<gradations.length;i++){
        gradations[i]=this.formatAxisValue(gradations[i],!vertical);
    }
    if(vertical){
        this._gradationsWidth=this.measureLabels(gradations,"width",props);
    }else{
        if(this._canRotateLabels()){
            this._gradationsHeight=this.measureLabels(gradations,"width",props);
        }else{
            this._gradationsHeight=this.measureLabel("Xy",props).height;
        }
    }
}
,isc.A.getGradationsWidth=function isc_FacetChart_getGradationsWidth(){
    if(this._gradationsWidth==null)this.logWarn("Gradation width not available");
    return this._gradationsWidth;
}
,isc.A.getGradationsHeight=function isc_FacetChart_getGradationsHeight(){
    if(this._gradationsHeight==null)this.logWarn("Gradation height not available");
    return this._gradationsHeight;
}
,isc.A.drawGradationLabels=function isc_FacetChart_drawGradationLabels(vertical,labelDataPairs,rotateLabels){
    if(this.isPieChart()||this.chartType=="Radar")return;
    var vertical=(vertical==null?this.hasYGradations():vertical===true);
    if(vertical&&!this._showYGradations){
        return;
    }
    rotateLabels=(!vertical&&(rotateLabels==null?
        this._canRotateLabels():rotateLabels===true));
    var hasExtraAxes=this._hasExtraAxes(),
        settings=this._getExtraAxisSettings(),
        numValueAxes=this._getNumValueAxes(),
        verticalAxisLabelSpace;
    if(vertical){
        verticalAxisLabelSpace=this.getAxisLabelSpace(true);
    }
    for(var j=0;j<numValueAxes;++j){
        var context=(j==0?this:settings.all[j-1]),
            showAxis=!(context!=this&&context.showAxis==false);
        if(!showAxis){
            continue;
        }
        var props=isc.addProperties({
                    _verticalAlignMiddle:true
                },context.gradationLabelProperties),
            gradations=context.gradations,
            oneGradationLabel=context._oneGradationLabel,
            labelHeight=this.measureLabel("Xy",props).height,
            pairs=labelDataPairs&&labelDataPairs[j],
            flag=(pairs==null),
            len=(flag?(oneGradationLabel?1:gradations.getLength()):pairs.getLength());
        if(vertical){
            var left;
            if(hasExtraAxes){
                left=this._getValueAxisGradationLabelLeft(context);
            }else{
                left=verticalAxisLabelSpace;
            }
            for(var i=0;i<len;i++){
                var top=this.getYCoord(flag?gradations[i]:pairs[i].dataValue,context),
                    stringValue=flag?context.formatAxisValue(gradations[i],!vertical):pairs[i].label;
                this.drawLabel(left,top-(labelHeight/2),stringValue,props);
            }
        }else{
            if(this.chartType=="Scatter"){
                gradations=this.getSecondGradations();
            }
            var top=this.getChartTop()+this.getChartHeight()+this.chartRectMargin;
            for(var i=0;i<len;i++){
                var gradation=flag?gradations[i]:pairs[i].dataValue,
                    left=this.getValueCoord(gradation,false),
                    stringValue=flag?this.formatAxisValue(gradation,!vertical):pairs[i].label;
                if(rotateLabels){
                    this.drawLabel(left+this.getRotatedCenteringOffset(labelHeight),
                                   top,stringValue,props,true);
                }else{
                    var dims=this.measureLabel(stringValue,props);
                    this.drawLabel(left-(dims.width/2),
                                   top,stringValue,props);
                }
            }
        }
    }
}
,isc.A.getGradationLineWidth=function isc_FacetChart_getGradationLineWidth(){
    return(this.gradationLineProperties.lineWidth||0);
}
,isc.A._drawGradations=function isc_FacetChart__drawGradations(vertical,gradations,axisStartValue,axisEndValue,dontDrawBackground,dontDrawForeground){
    this.logDebug("drawing gradations","chartDraw");
    gradations=gradations||this.gradations;
    if(this.isPieChart())return;
    if(this.chartType=="Radar")return this.drawRadarGradations(gradations);
    vertical=(vertical==null?this.hasYGradations():vertical===true);
    if(vertical&&!this._showYGradations){
        return;
    }
    dontDrawBackground=dontDrawBackground||!(this.bandedBackground&&vertical);
    var drawForeground=!dontDrawForeground,
        drawBackground=!dontDrawBackground;
    if(dontDrawForeground&&dontDrawBackground){
        return;
    }
    var rect=this.getChartRect(),
        availableSpace=vertical?rect.height:rect.width;
    var rectLineWidth=this.getChartRectLineWidth();
    var i=0,last=gradations.length;
    if(rectLineWidth!=0){
        if(isc.isA.Date(axisStartValue)&&isc.isA.Date(gradations[0])?
                axisStartValue.getTime()==gradations[0].getTime():
                axisStartValue==gradations[0])
        {
            ++i;
        }
        if(isc.isA.Date(axisEndValue)&&isc.isA.Date(gradations[last-1])?
                axisEndValue.getTime()==gradations[last-1].getTime():
                axisEndValue==gradations[last-1])
        {
            --last;
        }
    }
    var lowValue,highValue;
    if(!vertical&&(axisStartValue==null||axisEndValue==null)){
        if(this.hasXGradations()){
            lowValue=this._axisStartValue;
            highValue=this._axisEndValue;
        }else if(this.chartType=="Scatter"){
            lowValue=this._secondAxisStartValue;
            highValue=this._secondAxisEndValue;
        }else{
            var range=this._getZoomValueRange();
            lowValue=range[0].dataValue;
            highValue=range[1].dataValue;
            if(!(range[0].index<range[1].index)||lowValue==highValue){
                return;
            }
        }
    }
    for(;i<last;i++){
        if(drawForeground){
            if(vertical){
                var left=rect.left+rectLineWidth,
                    endLeft=rect.left+rect.width-rectLineWidth,
                    top=this.getYCoord(gradations[i]),
                    isZeroLine=(gradations[i]==0);
                isc.DrawLine.create(
                    isZeroLine?this.gradationZeroLineProperties:this.gradationLineProperties,
                    {
                        drawPane:this,
                        startLeft:left,
                        startTop:top,
                        endLeft:endLeft,
                        endTop:top,
                        autoDraw:true
                    });
            }else{
                var left=this._getXCoord(gradations[i],lowValue,highValue,false);
                isc.DrawLine.create(this.gradationLineProperties,{
                    drawPane:this,
                    startLeft:left,
                    startTop:rect.top+rectLineWidth,
                    endLeft:left,
                    endTop:rect.top+rect.height-(2*rectLineWidth),
                    autoDraw:true
                });
            }
        }
        if(drawBackground&&(i%2==1)&&i!=(gradations.length-1)){
            var nextTop=this.getYCoord(gradations[i+1]),
                height=top-nextTop,
                lineWidth=this.gradationLineProperties.lineWidth||0;
            isc.DrawRect.create(this.backgroundBandProperties,{
                drawPane:this,
                left:left,
                top:nextTop+lineWidth,
                width:endLeft-rect.left-rectLineWidth*2,
                height:height-(lineWidth*2),
                autoDraw:true
            });
        }
    }
}
);
isc.evalBoundary;isc.B.push(isc.A._drawAllGradations=function isc_FacetChart__drawAllGradations(vertical,gradations,axisStartValue,axisEndValue,dontDrawBackground,dontDrawForeground){
    this._drawGradations(vertical,gradations,axisStartValue,axisEndValue,dontDrawBackground,dontDrawForeground);
    var hasExtraAxes=this._hasExtraAxes();
    if(hasExtraAxes){
        var settings=this._getExtraAxisSettings().visible;
        for(var j=settings.length;j--;){
            var context=settings[j],
                gradations=context.gradations,
                left=this._getValueAxisGradationLineLeft(context),
                endLeft=left+this.gradationTickMarkLength;
            for(var i=gradations.length;i--;){
                var top=this.getYCoord(gradations[i],context),
                    isZeroLine=(gradations[i]==0);
                isc.DrawLine.create(
                    isZeroLine?context.gradationZeroLineProperties:context.gradationLineProperties,
                    {
                        drawPane:this,
                        startLeft:left,
                        startTop:top,
                        endLeft:endLeft,
                        endTop:top,
                        autoDraw:true
                    });
            }
            this._drawValueAxisLine(context);
        }
    }
}
,isc.A.getValueRatio=function isc_FacetChart_getValueRatio(value,lowValue,highValue,logScale,context){
    context=context||this;
    logScale=logScale!=null?logScale:context.logScale;
    if(highValue==null||lowValue==null){
        var gradations=context.gradations;
        lowValue=context._axisStartValue;
        highValue=context._axisEndValue;
        if(!gradations.length||!(lowValue!=null&&highValue!=null)){
            return 0;
        }
    }
    if(isc.isA.Date(lowValue)&&isc.isA.Date(highValue)&&isc.isA.Date(value)){
        var lowTime=lowValue.getTime(),
            range=highValue.getTime()-lowTime;
        return(value.getTime()-lowTime)/range;
    }else if(!logScale){
        var range=highValue-lowValue;
        return(range!=0?(value-lowValue)/range:0);
    }else{
        if(value==0)return 0;
        var highLog=this.logValue(highValue,context.logBase,context),
            lowLog=lowValue==0?0:this.logValue(lowValue,context.logBase,context),
            logRange=highLog-lowLog;
        if(logRange==0){
            return 0;
        }else{
            return(this.logValue(value,context.logBase,context)-lowLog)/logRange;
        }
    }
}
,isc.A.getYCoord=function isc_FacetChart_getYCoord(value,context){
    context=context||this;
    var chartType=context.chartType;
    if(chartType=="Radar"||this.isPieChart(chartType)){
        return null;
    }else if(chartType!="Scatter"&&!this.hasYGradations(chartType)){
        if(value==null||!isc.isAn.Object(value)){
            return null;
        }else{
            value=this._completeCriteria(value,context);
            var drawnValue=this.getDrawnValue(value,false);
            return(drawnValue!=null?drawnValue.y:null);
        }
    }else{
        return this.getValueCoord(value,null,context);
    }
}
,isc.A._completeCriteria=function isc_FacetChart__completeCriteria(criteria,context){
    context=context||this;
    var dataLabelFacet=this.getDataLabelFacet(),
        dataFacetValue=this.getFacetValue(dataLabelFacet.id,criteria[dataLabelFacet.id]),
        legendFacet,
        ret={};
    if(dataFacetValue==null){
        return null;
    }else{
        ret[dataLabelFacet.id]=dataFacetValue.id;
    }
    if(this.isMultiFacet()){
        legendFacet=this.getLegendFacet();
        var chartType=context.chartType,
            clustered=(chartType=="Bar"||chartType=="Column")&&!this.isStacked(context),
            required=context.isMultiFacet()&&clustered&&(legendFacet.values.length>1);
        if(required){
            var legendFacetValue=this.getFacetValue(legendFacet.id,criteria[legendFacet.id]);
            if(legendFacetValue==null){
                return null;
            }else{
                ret[legendFacet.id]=legendFacetValue.id;
            }
        }else{
            ret[legendFacet.id]=legendFacet.values[0].id;
        }
    }
    var valueFacet=(this.inlinedFacet!=null&&
        this.inlinedFacet!=dataLabelFacet&&this.inlinedFacet!=legendFacet
        ?this.inlinedFacet:null);
    if(valueFacet!=null){
        var required=(valueFacet.values.length>1);
        if(required){
            var valueFacetValue=this.getFacetValue(valueFacet.id,criteria[valueFacet.id]);
            if(valueFacetValue==null){
                return null;
            }else{
                ret[valueFacet.id]=valueFacet.values[0].id;
            }
        }else{
            ret[valueFacet.id]=valueFacet.values[0].id;
        }
    }
    return ret;
}
,isc.A.getValueCoord=function isc_FacetChart_getValueCoord(value,vertical,context){
    if(vertical==null)vertical=true;
    var valueRatio=this.getValueRatio(value,null,null,null,context);
    var chartBase,chartLength;
    if(vertical){
        chartBase=this.getChartTop();
        chartLength=this.getChartHeight();
        return chartBase+chartLength-Math.round(valueRatio*chartLength);
    }else{
        chartBase=this.getChartLeft();
        chartLength=this.getChartWidth();
        return chartBase+Math.round(valueRatio*chartLength);
    }
}
,isc.A.getXCoord=function isc_FacetChart_getXCoord(value,context){
    context=context||this;
    var chartType=context.chartType;
    if(chartType=="Radar"||this.isPieChart(chartType)){
        return null;
    }else if(chartType!="Scatter"&&!this.hasXGradations(chartType)){
        if(value==null||!isc.isAn.Object(value)){
            return null;
        }else{
            value=this._completeCriteria(value,context);
            var drawnValue=this.getDrawnValue(value,false);
            return(drawnValue!=null?drawnValue.x:null);
        }
    }else{
        return this._getXCoord(value,null,null,null,context);
    }
}
,isc.A._getXCoord=function isc_FacetChart__getXCoord(value,lowValue,highValue,logScale,context){
    context=context||this;
    var chartType=context.chartType;
    if((highValue==null||lowValue==null)&&chartType=="Scatter"){
        lowValue=this._secondAxisStartValue;
        highValue=this._secondAxisEndValue;
    }
    var valueRatio=this.getValueRatio(value,lowValue,highValue,logScale,context),
        rect=this.getChartRect();
    return rect.left+Math.round(valueRatio*rect.width);
}
,isc.A.getDataLabels=function isc_FacetChart_getDataLabels(){
    if(this._dataLabels)return this._dataLabels;
    if(this.chartType=="Scatter")return(this._dataLabels=this.getSecondGradations());
    var orderedData=this.getOrderedData();
    return(this._dataLabels=orderedData.getProperty("title"));
}
,isc.A.getDataLabelHeight=function isc_FacetChart_getDataLabelHeight(){
    return this.measureLabel("Xy",this.dataLabelProperties).height;
}
,isc.A.getXLabelsHeight=function isc_FacetChart_getXLabelsHeight(recalc){
    if(!recalc&&this.xLabelsHeight!=null)return this.xLabelsHeight;
    if(this.chartType=="Radar"||this.isPieChart()||this.showInlineLabels){
        return(this.xLabelsHeight=0);
    }
    if(this.hasXGradations()){
        return this.getGradationsHeight()+this.getValueAxisLabelHeight();
    }
    if(this._canRotateLabels()){
        this.xLabelsHeight=this.measureDataLabels();
    }else{
        this.xLabelsHeight=this.getDataLabelHeight();
    }
    this.xLabelsHeight+=this.getDataAxisLabelHeight();
    return this.xLabelsHeight;
}
,isc.A.getYLabelsWidth=function isc_FacetChart_getYLabelsWidth(recalc){
    if(!recalc&&this.yLabelsWidth!=null)return this.yLabelsWidth;
    if(this.hasYGradations()){
        var gradationsWidth=this.getGradationsWidth();
        if(this._hasSideValueAxisLabels()){
            return gradationsWidth+this.getValueAxisLabelHeight();
        }else{
            return this._totalValueAxisWidth;
        }
    }else{
        return(this.yLabelsWidth=this.measureDataLabels()+this.getDataAxisLabelHeight());
    }
}
,isc.A.measureDataLabels=function isc_FacetChart_measureDataLabels(attribute,props){
    return this.measureLabels(null,attribute,props);
}
,isc.A.measureLabels=function isc_FacetChart_measureLabels(titles,attribute,props){
    titles=titles||this.getDataLabels();
    attribute=attribute||"width";
    props=props||this.dataLabelProperties;
    var max=0;
    for(var i=0;i<titles.length;i++){
        var size=this.measureLabel(titles[i],props)[attribute];
        max=Math.max(max,size);
    }
    return max;
}
,isc.A._getGradationLabelHeight=function isc_FacetChart__getGradationLabelHeight(context){
    context=context||this;
    return this.measureLabel("Xy",context.gradationLabelProperties).height;
}
,isc.A._hasExtraAxes=function isc_FacetChart__hasExtraAxes(){
    return this._extraAxisMetrics!=null;
}
,isc.A._getExtraAxisMetrics=function isc_FacetChart__getExtraAxisMetrics(){
    return this._extraAxisMetrics;
}
,isc.A._getExtraAxisSettings=function isc_FacetChart__getExtraAxisSettings(){
    return this._extraAxisSettings;
}
,isc.A._getFixedFacetValue=function isc_FacetChart__getFixedFacetValue(metricSettings){
    var legendFacet=this.getLegendFacet(),
        facetId=legendFacet&&legendFacet.id,
        fixedFacetValue=metricSettings.fixedFacetValue;
    if(legendFacet==null){
        return null;
    }else if(isc.isA.String(fixedFacetValue)||isc.isA.Number(fixedFacetValue)){
        return this.getFacetValue(facetId,fixedFacetValue);
    }else if(isc.isA.Object(fixedFacetValue)){
        var facetValue=this.getFacetValue(facetId,fixedFacetValue.id);
        return(facetValue==fixedFacetValue?facetValue:null);
    }else{
        return null;
    }
}
,isc.A._getValueAxisGradationLabelLeft=function isc_FacetChart__getValueAxisGradationLabelLeft(context){
    var settings=this._getExtraAxisSettings(),
        left=this._getValueAxisLeft(context);
    if(context==this){
        left+=this._totalValueAxisWidth-this._gradationsWidth;
    }else{
        var showAxisLine=this._shouldShowValueAxisLine(context),
            axisLineWidth=(showAxisLine&&this._getValueAxisLineProperties(context).lineWidth)||0;
        if(settings.right.indexOf(context)!=-1){
            left+=axisLineWidth+this.gradationTickMarkLength+this.tickMarkToValueAxisMargin;
        }else{
            left+=context._totalValueAxisWidth-context._gradationsWidth-axisLineWidth
                    -this.gradationTickMarkLength-this.tickMarkToValueAxisMargin;
        }
    }
    return left;
}
,isc.A._getValueAxisGradationLineLeft=function isc_FacetChart__getValueAxisGradationLineLeft(context){
    var settings=this._getExtraAxisSettings(),
        left=this._getValueAxisLeft(context),
        showAxisLine=this._shouldShowValueAxisLine(context),
        axisLineWidth=(showAxisLine&&this._getValueAxisLineProperties(context).lineWidth)||0;
    if(settings.left.indexOf(context)!=-1){
        left+=context._totalValueAxisWidth-axisLineWidth-this.gradationTickMarkLength;
    }else{
        left+=axisLineWidth;
    }
    return left;
}
,isc.A._getValueAxisLineLeft=function isc_FacetChart__getValueAxisLineLeft(context){
    var lineWidth=this._getValueAxisLineProperties(context).lineWidth||0,
        halfLineWidth=Math.floor(lineWidth/2),
        left=this._getValueAxisLeft(context),
        settings=this._getExtraAxisSettings();
    if(settings.left.indexOf(context)!=-1){
        left+=context._totalValueAxisWidth+(halfLineWidth-lineWidth);
    }else{
        left+=halfLineWidth;
    }
    return left;
}
,isc.A._getValueAxisLeft=function isc_FacetChart__getValueAxisLeft(context){
    var settings=this._getExtraAxisSettings();
    var ret;
    if(context==this){
        ret=this.getChartLeft()-this._chartRectLeftMargin-this._totalValueAxisWidth;
    }else{
        var left=settings.left,
            right=settings.right,
            leftIndex=left.findIndex(context),
            rightIndex=right.findIndex(context),
            space=this.valueAxisMargin;
        if(rightIndex==-1){
            ret=(left.length-1-leftIndex)*space;
            for(var i=left.length;--i>leftIndex;){
                ret+=left[i]._totalValueAxisWidth;
            }
        }else if(leftIndex==-1){
            ret=this.getChartLeft()+this.getChartWidth()+this._chartRectRightMargin+rightIndex*space;
            for(var i=0;i<rightIndex;++i){
                ret+=right[i]._totalValueAxisWidth;
            }
        }
    }
    return ret;
}
,isc.A._drawValueAxisLine=function isc_FacetChart__drawValueAxisLine(context){
    var showAxisLine=this._shouldShowValueAxisLine(context);
    if(showAxisLine){
        var top=this.getChartTop(),
            height=this.getChartHeight(),
            left=this._getValueAxisLineLeft(context),
            lineProps=this._getValueAxisLineProperties(context);
        isc.DrawLine.create(lineProps,{
            autoDraw:true,
            drawPane:this,
            startLeft:left,
            startTop:top,
            endLeft:left,
            endTop:top+height
        });
    }
}
,isc.A._getNumValueAxes=function isc_FacetChart__getNumValueAxes(){
    return 1+(this._hasExtraAxes()?this._getExtraAxisSettings().all.length:0);
}
,isc.A._hasSideValueAxisLabels=function isc_FacetChart__hasSideValueAxisLabels(){
    if(!this._hasExtraAxes()||(this.hasYGradations()&&!this._showYGradations)){
        return true;
    }else{
        var settings=this._getExtraAxisSettings();
        return(settings.left.length==0&&settings.right.length==1);
    }
}
,isc.A._getValueAxisLabelsHeight=function isc_FacetChart__getValueAxisLabelsHeight(recalc){
    if(!recalc&&this._valueAxisLabelsHeight!=null){
        return this._valueAxisLabelsHeight;
    }
    var height=0;
    if(!this._hasSideValueAxisLabels()){
        var settings=this._getExtraAxisSettings(),
            numAxes=this._getNumValueAxes();
        for(var j=0;j<numAxes;++j){
            var context=(j==0?this:settings.all[j-1]);
            if(this.shouldShowValueAxisLabel(context)){
                var labelHeight=this.measureLabel(context.valueTitle,context.valueAxisLabelProperties).height;
                height=Math.max(height,labelHeight);
            }
        }
    }
    return(this._valueAxisLabelsHeight=height);
}
,isc.A._shouldShowValueAxisLine=function isc_FacetChart__shouldShowValueAxisLine(context){
    if(context==this||context.showAxis==false){
        return false;
    }
    var settings=this._getExtraAxisSettings(),
        showAxisLine=context.showAxisLine;
    return(settings.right.length==0||context!=settings.right[0])&&
        (showAxisLine!=null?showAxisLine:this.showChartRect);
}
,isc.A._getValueAxisLineProperties=function isc_FacetChart__getValueAxisLineProperties(metricSettings){
    if(metricSettings.axisLineProperties!=null){
        return metricSettings.axisLineProperties;
    }else{
        var ret={};
        if(isc.isAn.Object(this.chartRectProperties)){
            var props=this.chartRectProperties;
            if(props.lineCap!=null)ret.lineCap=props.lineCap;
            if(props.lineColor!=null)ret.lineColor=props.lineColor;
            if(props.lineOpacity!=null)ret.lineOpacity=props.lineOpacity;
            if(props.linePattern!=null)ret.linePattern=props.linePattern;
            if(props.lineWidth!=null)ret.lineWidth=props.lineWidth;
        }
        return ret;
    }
}
,isc.A._createExtraAxisLegendSwatch=function isc_FacetChart__createExtraAxisLegendSwatch(context,series,left,top,swatchSize){
    var width=swatchSize,height=swatchSize,
        chartType=context.chartType,
        drawItems=[];
    if(chartType=="Column"){
        var barMargin=2;
        var minBarThickness=3,maxBarThickness=5;
        var fakeData=this._$fakeData;
        var dataColor=this._getDataColor(series,context),
            dataGradient=this._getDataGradient(series,null,null,context);
        var maxNumBars=Math.floor((width+barMargin)/(minBarThickness+barMargin)),
            minNumBars=Math.floor((width+barMargin)/(maxBarThickness+barMargin)),
            numBars,barThickness,extra;
        for(numBars=maxNumBars;numBars>=minNumBars;--numBars){
            barThickness=Math.min((width+barMargin)/numBars)-barMargin;
            extra=width+barMargin-numBars*(barThickness+barMargin);
            if(extra%2==0)break;
        }
        var offset=left+Math.max(extra/2);
        for(var i=0;i<numBars;++i){
            var barHeight=Math.round(fakeData[i%fakeData.length]*height);
            var barProps=isc.addProperties({},this.barProperties,{
                drawPane:this,
                autoDraw:false,
                width:barThickness,
                height:barHeight,
                left:offset,
                top:top+height-barHeight
            });
            if(!this.useAutoGradients){
                barProps.fillColor=dataColor;
            }else{
                barProps.fillGradient=dataGradient;
            }
            drawItems.push(isc.DrawRect.create(barProps));
            offset+=barThickness+barMargin;
        }
    }else if((chartType=="Area"||chartType=="Line")&&this.isFilled(context)){
        var minSpacing=1,maxSpacing=3;
        var fakeData=this._$fakeData;
        var dataColor=this._getDataColor(series,context),
            dataGradient=this._getDataGradient(series,null,null,context);
        var maxNumPoints=Math.floor((width+1)/(minSpacing+1)),
            minNumPoints=Math.floor((width+1)/(maxSpacing+1)),
            numPoints,spacing,extra;
        for(numPoints=maxNumPoints;numPoints>=minNumPoints;--numPoints){
            spacing=Math.min((width+1)/numPoints)-1;
            extra=width+1-numPoints*(spacing+1);
            if(extra%2==0)break;
        }
        var points=[];
        var x=left+Math.max(extra/2);
        for(var i=0;i<numPoints;++i){
            var value=fakeData[i%fakeData.length];
            points.push([x,top+Math.round(height*(1-value))]);
            x+=spacing+1;
        }
        var fullShapePoints=points.duplicate();
        fullShapePoints.add([points.last()[0],top+height]);
        fullShapePoints.add([points.first()[0],top+height]);
        drawItems.addList([
            this.drawDataLineSegment(
                points,0,points.length,{lineColor:dataColor},context,false,false),
            this._drawDataShape(fullShapePoints,{
                lineColor:dataColor,
                fillColor:!this.useAutoGradients?dataColor:null,
                fillGradient:this.useAutoGradients?dataGradient:null
            },false,false,context)
        ]);
    }else if(chartType=="Area"||chartType=="Line"){
        var y=top+Math.round(height/2),
            leftPoint=[left,y],
            centerPoint=[left+Math.round(width/2),y],
            rightPoint=[left+width,y],
            pointSize=Math.min(context.dataPointSize,swatchSize);
        drawItems.push(this.drawDataLineSegment(
            [leftPoint,rightPoint],0,2,{
                lineColor:this._getDataColor(series,context),
                shadow:null
            },context,false,false));
        if(context.showDataPoints){
            drawItems.push(this.drawDataPoint(centerPoint,series,pointSize,null,null,context,false,false));
        }
    }
    return isc.DrawGroup.create(this.legendSwatchProperties,{
        drawPane:this,
        autoDraw:true,
        drawItems:drawItems,
        left:left,
        top:top,
        width:width,
        height:height
    });
}
,isc.A._getMetricSettingsDefaults=function isc_FacetChart__getMetricSettingsDefaults(){
    var defaults={
        multiFacet:this.isMultiFacet(),
        chartType:"Line"
    };
    var properties=[
        "gradationLabelProperties","gradationLineProperties","gradationZeroLineProperties",
        "showDataPoints","dataPointSize","logScale","useLogGradations","logBase",
        "logGradations","decimalPrecision","showShadows","shadowProperties","dataLineProperties",
        "dataOutlineProperties","dataShapeProperties","valueLineProperties",
        "valueAxisLabelProperties","dataPointProperties","formatAxisValue","formatDataValue"];
    for(var i=0,numProperties=properties.length;i<numProperties;++i){
        var property=properties[i];
        defaults[property]=isc.FacetChart.getInstanceProperty(property);
    }
    return defaults;
}
,isc.A._initExtraAxes=function isc_FacetChart__initExtraAxes(){
    var metrics=this.extraAxisMetrics,
        settings=this.extraAxisSettings;
    if(!(metrics!=null&&isc.isAn.Array(metrics)&&!metrics.isEmpty())){
        this._extraAxisMetrics=null;
        this._extraAxisSettings=null;
        return;
    }
    if(settings==null||!isc.isAn.Array(settings)){
        settings=[];
    }
    this._extraAxisMetrics=metrics;
    this._extraAxisSettings={left:[],right:[],all:settings,visible:[],hidden:[]};
    var dataColorOffset,dataGradientOffset;
    if(!this.isMultiFacet()){
        dataColorOffset=dataGradientOffset=(this.chartType=="Column"?this.getDataLabelFacet().values.length:1);
    }else{
        dataColorOffset=dataGradientOffset=this.getLegendFacet().values.length;
    }
    var len=metrics.length,
        offset=0,
        defaultProperties=len>0&&this._getMetricSettingsDefaults(),
        legendFacet=this.getLegendFacet(),
        inlinedFacet=this._getInlinedFacet();
    for(var i=0;i<len;++i){
        var j=i-offset,
            metric=metrics[j],
            metricSettings,
            skip=!(isc.isA.String(metric)&&
                    (inlinedFacet?this.getFacetValue(inlinedFacet.id,metric)!=null
                    :(metric==this.valueProperty)));
        if(!skip){
            metricSettings=settings[j]=isc.addDefaults(settings[j]||{},defaultProperties);
            var chartType=metricSettings.chartType;
            if(chartType==null){
                chartType=metricSettings.chartType=(
                    i==0&&this.chartType!="Column"?"Column":"Line");
            }
            if(chartType=="Radar"||this.isPieChart(chartType)){
                skip=true;
                this.logWarn(
                    "The MetricSettings of metric value axis number "+i+" in FacetChart \""+this.getID()+"\" "+
                    "has a non-rectangular chart type, which is not allowed.  Skipping this extra value axis.");
            }else if(!this.hasYGradations(chartType)){
                skip=true;
                this.logWarn(
                    "The MetricSettings of metric value axis number "+i+" in FacetChart \""+this.getID()+"\" "+
                    "has a chart type which does not use a vertical value axis and thus is not supported as an extra value axis.  "+
                    "Skipping this extra value axis.");
            }
        }
        var singleFacet,fixedFacetValue;
        if(!skip){
            var singleFacet=!(this.isMultiFacet()&&metricSettings.multiFacet),
                fixedFacetValue=singleFacet?this._getFixedFacetValue(metricSettings):null;
            singleFacet&=(!this.isMultiFacet()||fixedFacetValue!=null);
            var criteria={};
            if(inlinedFacet!=null){
                criteria[inlinedFacet.id]=metric;
            }
            if(fixedFacetValue!=null&&legendFacet!=null&&legendFacet!=inlinedFacet){
                criteria[legendFacet.id]=fixedFacetValue.id;
            }
            var values=this.getValue(criteria,true),
                noData=true;
            for(var l=(values!=null?values.length:0);noData&&l--;){
                noData=!isc.isA.Number(values[l]);
            }
            skip=noData;
        }
        if(skip){
            metrics.removeAt(j);
            settings.removeAt(j);
            ++offset;
            continue;
        }
        var filled=metricSettings.filled;
        metricSettings._metric=metric;
        metricSettings._multiFacet=!singleFacet;
        metricSettings._fixedFacetValue=fixedFacetValue;
        if(metricSettings.showAxis===false){
            this._extraAxisSettings.hidden.push(metricSettings);
        }else{
            var k=this._extraAxisSettings.visible.length;
            this._extraAxisSettings[(k%4<2)?"right":"left"].push(metricSettings);
            this._extraAxisSettings.visible.push(metricSettings);
        }
        var defaults=this._$extraAxisDataColorAndGradientDefaults,
            hasOwnDataColors=isc.isAn.Array(metricSettings.dataColors)||
                    (isc.isA.Function(metricSettings.getDataColor)&&metricSettings.getDataColor!=defaults.getDataColor),
            hasOwnDataGradients=isc.isAn.Array(metricSettings.dataGradients)||
                    (isc.isA.Function(metricSettings.getDataGradient)&&metricSettings.getDataGradient!=defaults.getDataGradient);
        isc.addDefaults(metricSettings,defaults);
        isc.addProperties(metricSettings,{
            _chart:this,
            _hasOwnDataColors:hasOwnDataColors,
            _hasOwnDataGradients:hasOwnDataGradients,
            _dataColorOffset:dataColorOffset,
            _dataGradientOffset:dataGradientOffset,
            isMultiFacet:function(){
                return this._multiFacet;
            },
            getXCoord:function(value){
                var chart=this._chart;
                return chart.getXCoord.apply(chart,[value,this]);
            },
            getYCoord:function(value){
                var chart=this._chart;
                return chart.getYCoord.apply(chart,[value,this]);
            },
            getGradations:function(){
                var chart=this._chart;
                return chart.getGradations.apply(chart,[this]);
            },
            setChartType:function(chartType){
                var chart=this._chart;
                return chart.setChartType.apply(chart,[chartType,this]);
            },
            setStacked:function(newValue){
                var chart=this._chart;
                return chart.setStacked.apply(chart,[newValue,this]);
            },
            setFilled:function(newValue){
                var chart=this._chart;
                return chart.setFilled.apply(chart,[newValue,this]);
            },
            setDataColors:function(dataColors){
                var chart=this._chart;
                return chart.setDataColors.apply(chart,[dataColors,this]);
            }
        });
        if(!hasOwnDataColors){
            if(singleFacet){
                dataColorOffset+=(chartType=="Column"?this.getDataLabelFacet().values.length:1);
            }else{
                dataColorOffset+=this.getLegendFacet().values.length;
            }
        }
        if(!hasOwnDataGradients){
            if(singleFacet){
                dataGradientOffset+=(chartType=="Column"?this.getDataLabelFacet().values.length:1);
            }else{
                dataGradientOffset+=this.getLegendFacet().values.length;
            }
        }
    }
    if(metrics.isEmpty()){
        this._extraAxisMetrics=null;
        this._extraAxisSettings=null;
        return;
    }
    var metricFacet=this._getMetricFacet(),
        primaryMetricFacetValue=metricFacet&&metricFacet.values[0],
        primaryMetric=primaryMetricFacetValue&&primaryMetricFacetValue.id;
    len=metrics.length;
    for(var j=0;j<len;++j){
        var metric=metrics[j],
            metricSettings=settings[j];
        if(metricSettings.matchGradations!=null){
            var k=metrics.indexOf(metricSettings.matchGradations),
                match=(
                    k!=-1?
                    settings[k]:
                    (metricSettings.matchGradations==primaryMetric?
                    this:null));
            if(match!=null&&
                metricSettings!=match&&
                (metricSettings._matchGradations==null||
                metricSettings._matchGradations!=match._matchGradations))
            {
                var definesLogScale=(metricSettings.logScale!=null),
                    matchDefinesLogScale=(match.logScale!=null),
                    otherAxis=null,
                    logScale=true;
                if(definesLogScale^matchDefinesLogScale){
                    if(definesLogScale){
                        logScale=metricSettings.logScale;
                        otherAxis=match;
                    }else{
                        logScale=match.logScale;
                        otherAxis=metricSettings;
                    }
                }else if(definesLogScale&&metricSettings.logScale!=match.logScale){
                    this.logWarn(
                        "The extra axis settings for metric '"+metricSettings._metric+
                        "' "+(metricSettings.logScale?"has":"does not have")+" a "+
                        "log scale, whereas the extra axis settings specified by its "+
                        "matchGradations property "+
                        (match.logScale?"has":"does not have")+" a log scale.  "+
                        "Assuming a log scale for the extra value axis for metric '"+
                        (metricSettings.logScale?match._metric:metricSettings._metric)+
                        "'.");
                    logScale=true;
                    otherAxis=(metricSettings.logScale==logScale?match:metricSettings);
                }
                if(otherAxis!=null){
                    otherAxis.logScale=logScale;
                    if(otherAxis._matchGradations!=null){
                        for(var l=otherAxis._matchGradations.length;l--;){
                            otherAxis._matchGradations[l].logScale=logScale;
                        }
                    }
                }
                var definesLogBase=(metricSettings.logBase!=null),
                    matchDefinesLogBase=(match.logBase!=null),
                    logBase=2;
                otherAxis=null;
                if(definesLogBase^matchDefinesLogBase){
                    if(definesLogBase){
                        logBase=metricSettings.logBase;
                        otherAxis=match;
                    }else{
                        logBase=match.logBase;
                        otherAxis=metricSettings;
                    }
                }else if(definesLogBase&&metricSettings.logBase!=match.logBase){
                    logBase=Math.max(metricSettings.logBase,match.logBase);
                    this.logWarn(
                        "The extra axis settings for metric '"+metricSettings._metric+
                        "' uses logBase "+metricSettings.logBase.toString()+" but the "+
                        "extra axis settings specified by its matchGradations property "+
                        "uses logBase "+match.logBase.toString()+".  Assuming a "+
                        "logBase of "+logBase.toString()+" for both extra value axes.");
                    otherAxis=(metricSettings.logBase==logBase?match:metricSettings);
                }
                if(otherAxis!=null){
                    var otherAxes=(otherAxis._matchGradations||[otherAxis]);
                    for(var l=otherAxes.length;l--;){
                        if(isc.isAn.Array(otherAxes[l].logGradations)){
                            var prevLogBase=otherAxes[l].logBase,
                                prevLogGradations=otherAxes[l].logGradations,
                                logGradations=[1];
                            for(var m=0;m<prevLogGradations.length;++m){
                                var prevLogGradation=prevLogGradations[m];
                                if(isc.isAn.Number(prevLogGradation)&&
                                    1<prevLogGradation&&
                                    prevLogGradation<prevLogBase)
                                {
                                    logGradations.push(prevLogGradation*logBase/prevLogBase);
                                }
                            }
                            otherAxes[l].logGradations=logGradations;
                        }
                        otherAxes[l].logBase=logBase;
                    }
                }
                var minDataSpreadPercent=this._getMinDataSpreadPercent(true,metricSettings),
                    matchMinDataSpreadPercent=this._getMinDataSpreadPercent(true,match),
                    maxMinDataSpreadPercent=Math.max(
                        minDataSpreadPercent,matchMinDataSpreadPercent);
                otherAxis=null;
                if(minDataSpreadPercent<maxMinDataSpreadPercent){
                    otherAxis=metricSettings;
                }else if(matchMinDataSpreadPercent<maxMinDataSpreadPercent){
                    otherAxis=match;
                }
                if(otherAxis!=null){
                    if(otherAxis._matchGradations!=null){
                        for(var l=otherAxis._matchGradations.length;l--;){
                            otherAxis._matchGradations[l].minDataSpreadPercent=maxMinDataSpreadPercent;
                        }
                    }else{
                        otherAxis.minDataSpreadPercent=maxMinDataSpreadPercent;
                    }
                }
                var definesAxisStartValue=(metricSettings.axisStartValue!=null),
                    matchDefinesAxisStartValue=(match.axisStartValue!=null),
                    axisStartValue=null;
                otherAxis=null;
                if(definesAxisStartValue){
                    if(matchDefinesAxisStartValue){
                        axisStartValue=Math.min(metricSettings.axisStartValue,match.axisStartValue);
                        if(axisStartValue<metricSettings.axisStartValue){
                            otherAxis=metricSettings;
                        }else if(axisStartValue<match.axisStartValue){
                            otherAxis=match;
                        }
                    }else{
                        axisStartValue=metricSettings.axisStartValue;
                        otherAxis=match;
                    }
                }else if(matchDefinesAxisStartValue){
                    axisStartValue=match.axisStartValue;
                    otherAxis=metricSettings;
                }
                if(otherAxis!=null){
                    otherAxis.axisStartValue=axisStartValue;
                    if(otherAxis._matchGradations!=null){
                        for(var l=otherAxis._matchGradations.length;l--;){
                            otherAxis._matchGradations[l].axisStartValue=axisStartValue;
                        }
                    }
                }
                var matches=[metricSettings,match];
                matches.sortUnique=true;
                if(metricSettings._matchGradations!=null){
                    matches.addAll(metricSettings._matchGradations);
                }
                if(match._matchGradations!=null){
                    matches.addAll(match._matchGradations);
                }
                metricSettings._matchGradations=match._matchGradations=matches;
            }
        }
    }
    var groups=this._extraAxisSettings.groups=[];
    groups.sortUnique=true;
    for(var j=0;j<len;++j){
        var group=settings[j]._matchGradations;
        if(group==null){
            groups.add([settings[j]]);
        }else{
            groups.add(group);
            if(group.contains(this)){
                this._extraAxisSettings.mainGroup=group;
            }
        }
        delete settings[j]._matchGradations;
    }
    var mainGroup=this._extraAxisSettings.mainGroup;
    if(mainGroup==null){
        mainGroup=this._extraAxisSettings.mainGroup=[this];
    }else{
        var mainGroup=this._extraAxisSettings.mainGroup;
        this._extraAxisSettings.groups.remove(mainGroup);
    }
    this._extraAxisSettings.groups.unshift(mainGroup);
    mainGroup.remove(this);
    mainGroup.unshift(this);
}
,isc.A._getValueAxisIndex=function isc_FacetChart__getValueAxisIndex(context){
    if(context==this){
        return 0;
    }else{
        var settings=this._getExtraAxisSettings(),
            index=settings.left.indexOf(context);
        if(index!=-1){
            index=-(1+index);
        }else{
            index=settings.right.indexOf(context);
            index=1+index;
        }
        return index;
    }
}
,isc.A.changeValueAxisPositions=function isc_FacetChart_changeValueAxisPositions(indexMap){
    if(!this._hasExtraAxes()){
        return;
    }
    var settings=this._getExtraAxisSettings();
    var evenIndexOf=isc.FacetChart._evenIndexOf,
        oddIndexOf=isc.FacetChart._oddIndexOf,
        valid=isc.isA.Array(indexMap)&&indexMap.length%2==0,
        minIndex=-settings.left.length,
        maxIndex=settings.right.length,
        minValue,maxValue;
    for(var i=0,len=indexMap.length;i<len;i+=2){
        var key=indexMap[i],value=indexMap[i+1];
        valid=isc.isA.Number(key)&&isc.isA.Number(value)
            &&Math.round(key)==key&&Math.round(value)==value
            &&key!=0&&value!=0
            &&minIndex<=key&&key<=maxIndex
            &&evenIndexOf(indexMap,key,i+2)==-1
            &&oddIndexOf(indexMap,value,i+3)==-1;
        minValue=i!=0?Math.min(minValue,value):value;
        maxValue=i!=0?Math.max(maxValue,value):value;
    }
    var newMinIndex,newMaxIndex;
    if(valid){
        newMinIndex=Math.min(minIndex,minValue);
        newMaxIndex=Math.max(maxIndex,maxValue);
        while(newMinIndex<=newMaxIndex&&!(oddIndexOf(indexMap,newMinIndex)!=-1||evenIndexOf(indexMap,newMinIndex)==-1)){
            ++newMinIndex;
        }
        while(newMaxIndex>newMinIndex&&!(oddIndexOf(indexMap,newMaxIndex)!=-1||evenIndexOf(indexMap,newMaxIndex)==-1)){
            --newMaxIndex;
        }
        valid=(maxIndex-minIndex==newMaxIndex-newMinIndex)&&newMinIndex<=0&&0<=newMaxIndex;
    }
    if(!valid){
        this.logWarn("An invalid indexMap argument was passed to FacetChart.changeValueAxisPositions().");
        return;
    }
    var newPositions=[],
        newLeft=[],
        newRight=[];
    for(var i=minIndex;i<=maxIndex;++i){
        if(i==0){
            continue;
        }
        var j=evenIndexOf(indexMap,i),
            key=j!=-1?indexMap[j]:i,
            value=j!=-1?indexMap[j+1]:i,
            keyContext;
        if(key>0){
            keyContext=settings.right[key-1];
        }else if(key<0){
            keyContext=settings.left[-key-1];
        }
        if(value>0){
            newRight[value-1]=keyContext;
        }else{
            newLeft[-value-1]=keyContext;
        }
    }
    settings.left=newLeft;
    settings.right=newRight;
    this._redrawFacetChart(false);
}
);
isc.evalBoundary;isc.B.push(isc.A._hoverValueAxisLabel=function isc_FacetChart__hoverValueAxisLabel(context){
    if(context!=this._hoverValueAxis){
        this._unhoverValueAxisLabel();
        var valueAxisLabel=context._valueAxisLabel;
        context._origValueAxisLabelLineColor=valueAxisLabel.lineColor;
        valueAxisLabel.lineColor=this._$brightBlue;
        valueAxisLabel.erase();
        valueAxisLabel.setDrawPane(this);
        valueAxisLabel.draw();
        this._hoverValueAxis=context;
    }
}
,isc.A._unhoverValueAxisLabel=function isc_FacetChart__unhoverValueAxisLabel(){
    var context=this._hoverValueAxis;
    if(context!=null){
        var valueAxisLabel=context._valueAxisLabel;
        valueAxisLabel.lineColor=context._origValueAxisLabelLineColor;
        valueAxisLabel.erase();
        valueAxisLabel.setDrawPane(this);
        valueAxisLabel.draw();
        delete this._hoverValueAxis;
    }
}
,isc.A.getChartCenter=function isc_FacetChart_getChartCenter(rect){
    rect=rect||this.getChartRect();
    return[
               Math.round(rect.left+(rect.width/2)),
               Math.round(rect.top+(rect.height/2))
           ]
}
,isc.A.getChartRadius=function isc_FacetChart_getChartRadius(rect){
    rect=rect||this.getChartRect();
    var offset=this.radialLabelOffset,
        rectLineWidth=this.getChartRectLineWidth();
    if(this.isPieChart()&&this.isStacked())offset+=this.pieLabelLineExtent;
    var hLabelSpace=2*(this.measureDataLabels()+offset),
        vLabelSpace=2*(this.getDataLabelHeight()+offset),
        longAxis=Math.min(rect.width-hLabelSpace,rect.height-vLabelSpace),
        maxRadius=this.maxRadius=Math.round((longAxis-(2*rectLineWidth))/2);
    return maxRadius;
}
,isc.A.drawRadarGradations=function isc_FacetChart_drawRadarGradations(gradations){
    var rect=this.getChartRect(),
        gradations=gradations||this.gradations,
        maxRadius=this.getChartRadius(rect);
    isc.DrawOval.create(this.radarBackgroundProperties,{
        drawPane:this,
        autoDraw:true,
        centerPoint:this.getChartCenter(),
        radius:maxRadius
    });
    var center=this.getChartCenter(),
        showLabels=this.showRadarGradationLabels;
    for(var i=0;i<gradations.length;i++){
        var radius=this.getValueRatio(gradations[i])*maxRadius;
        if(radius!=0){
            isc.DrawOval.create(
                gradations[i]==0?this.gradationZeroLineProperties:this.gradationLineProperties,
                {
                    drawPane:this,
                    autoDraw:true,
                    centerPoint:center,
                    radius:radius
                });
        }
        if(showLabels){
            var offset=this.radarGradationLabelOffset;
            this.drawLabel(center[0]+offset,
                           center[1]-radius-(this.getDataLabelHeight()/2)+offset,
                           this.formatAxisValue(gradations[i],true),
                           this.gradationLabelProperties);
        }
    }
}
,isc.A.drawRadarData=function isc_FacetChart_drawRadarData(rect,maxValue,data){
    rect=rect||this.getChartRect();
    data=data||this.getOrderedData();
    maxValue=maxValue||this.getMaxGradation();
    var firstFacet=this.getDataLabelFacet();
    if(this._getMultiCellData()){
        this.drawRadarSet(firstFacet);
        return;
    }
    var center=this.getChartCenter();
    var anglePerValue=Math.round(360/firstFacet.values.length);
    for(var i=0;i<data.length;i++){
        var angle=anglePerValue*i,
            outerPoint=isc.GraphMath.polar2screen(angle,this.maxRadius,center,true);
        this.drawValueLine(center,outerPoint);
        var facetValue={
            id:data[i].facetValueId,
            title:data[i].title
        };
        this.drawRadialLabel(center,this.maxRadius,angle,data[i].title,facetValue);
    }
    this._drawLines(undefined,undefined,undefined,undefined,this,true);
}
,isc.A.drawRadarSet=function isc_FacetChart_drawRadarSet(facet){
    var segmentAngle=Math.round(360/facet.values.length);
    var center=this.getChartCenter();
    for(var i=0;i<facet.values.length;i++){
        var facetValue=facet.values[i];
        var angle=(i*segmentAngle);
        var outerPoint=isc.GraphMath.polar2screen(angle,this.maxRadius,center,true);
        this.drawValueLine(center,outerPoint);
        var title=facet.values[i].title||facet.values[i].id;
        var labelAngle=angle+Math.round(segmentAngle/2);
        this.drawRadialLabel(center,this.maxRadius,labelAngle,title);
        var facetValues={};
        facetValues[facet.id]=facetValue.id;
        var records=this.getDataRecord(facetValues);
        if(records==null)return;
        this.drawPointsAcrossAngle(records,
                                   angle+this.angleMargin,
                                   angle+segmentAngle-this.angleMargin);
    }
}
,isc.A.drawPointsAcrossAngle=function isc_FacetChart_drawPointsAcrossAngle(records,startAngle,endAngle){
    var angleIncrement=Math.round((endAngle-startAngle)/records.length),
        center=this.getChartCenter(),
        maxRadiusValue=this.getMaxValue(),
        radiusMetric,sizeMetric,maxSizeValue;
    var metricFacet=this._getMetricFacet();
    if(metricFacet){
        sizeMetric=metricFacet.values[1].id;
        radiusMetric=metricFacet.values[0].id;
        maxSizeValue=this.getMaxValue(sizeMetric);
    }
    for(var i=0;i<records.length;i++){
        var record=records[i];
        var radiusValue,
            size=this.dataPointSize;
        if(metricFacet){
            radiusValue=parseFloat(record[radiusMetric]);
            var sizeValue=parseFloat(record[sizeMetric]);
            size=Math.max(this.minDataPointSize,
                            Math.ceil((sizeValue/maxSizeValue)*this.maxDataPointSize));
        }else{
            radiusValue=record[this.getDefaultMetric()];
        }
        var distance=Math.round((radiusValue/maxRadiusValue)*this.maxRadius);
        var point=isc.GraphMath.polar2screen(startAngle+(i*angleIncrement),
                                               distance,center,true);
        this.drawDataPoint(point,0,size,record,radiusValue,null,null,true);
    }
}
,isc.A.drawRadialLabel=function isc_FacetChart_drawRadialLabel(center,radius,angle,label,facetValue){
    var coords=this._getRadialLabelCoordinates(center,radius,angle,label,this.dataLabelProperties);
    var dataLabel=this.drawLabel(coords[0],coords[1],label,this.dataLabelProperties);
    this._processDataLabelActions(dataLabel,facetValue);
}
,isc.A._getRadialLabelCoordinates=function isc_FacetChart__getRadialLabelCoordinates(center,radius,angle,label,labelProperties){
    var labelOrigin=isc.GraphMath.polar2screen(angle,
                                                 radius+this.radialLabelOffset,
                                                 center,true);
    var labelDims=this.measureLabel(label,labelProperties);
    if(angle>=360)angle-=360;
    if(angle>180&&angle<=360){
        labelOrigin[0]-=labelDims.width;
    }
    if((angle>=0&&angle<90)||(angle>270&&angle<=360)){
        labelOrigin[1]-=labelDims.height;
    }
    var fromTop=isc.GraphMath.angleDifference(0,angle),
        fromBottom=isc.GraphMath.angleDifference(angle,180),
        fromRight=isc.GraphMath.angleDifference(90,angle),
        fromLeft=isc.GraphMath.angleDifference(angle,270),
        vDelta=Math.min(Math.abs(fromTop),Math.abs(fromBottom)),
        hDelta=Math.min(Math.abs(fromLeft),Math.abs(fromRight));
    if(vDelta<=20){
        var angleOffset=Math.abs(fromTop)==vDelta?fromTop:fromBottom,
            direction=angleOffset==vDelta?1:-1,
            maxOffset=direction*(labelDims.width/2),
            ratio=1-(vDelta/20),
            offset=Math.round(ratio*maxOffset);
        labelOrigin[0]-=Math.round(ratio*maxOffset);
    }else if(hDelta<=20){
        var angleOffset=Math.abs(fromLeft)==hDelta?fromLeft:fromRight,
            direction=angleOffset==hDelta?1:-1,
            maxOffset=direction*(labelDims.height/2),
            ratio=1-(hDelta/20),
            offset=Math.round(ratio*maxOffset);
        labelOrigin[1]-=offset;
    }
    return[labelOrigin[0],labelOrigin[1]];
}
,isc.A.formatAxisValue=function isc_FacetChart_formatAxisValue(value,forHorizontalAxis){
    var pow10=Math.pow(10,this.decimalPrecision);
    var roundedValue=Math.round(value*pow10)/pow10;
    return isc.Format.toUSString(roundedValue);
}
,isc.A.formatDataValue=function isc_FacetChart_formatDataValue(value){
    var pow10=Math.pow(10,this.decimalPrecision);
    var roundedValue=Math.round(value*pow10)/pow10;
    return isc.Format.toUSString(roundedValue);
}
,isc.A.getOrderedData=function isc_FacetChart_getOrderedData(recalc){
    if(this.orderedData&&!recalc)return this.orderedData;
    if(this.chartType=="Scatter"){
        var legendFacet=this.getLegendFacet(),
            orderedData;
        if(legendFacet!=null){
            orderedData=new Array(legendFacet.values.length);
            for(var j=0;j<legendFacet.values.length;++j){
                var legendFacetValue=legendFacet.values[j],
                    criteria={};
                criteria[legendFacet.id]=legendFacetValue.id;
                var records=this.getDataRecord(criteria,true),
                    seriesNode=orderedData[j]={
                        facetValueId:legendFacetValue.id,
                        title:legendFacetValue.title||legendFacetValue.id
                    },
                    items=seriesNode.series=new Array(records.length);
                for(var i=records.length;i--;){
                    items[i]={
                        record:records[i]
                    };
                }
            }
        }else{
            var records=this.getDataRecord({},true);
            orderedData=new Array(records.length);
            for(var i=records.length;i--;){
                orderedData[i]={record:records[i]};
            }
        }
        this.orderedData=orderedData;
        return orderedData;
    }
    var orderedData=this.orderedData=[],
        multiCellData=this._getMultiCellData(),
        firstFacet=this.getDataLabelFacet()||this.getLegendFacet();
    var firstFacetValues=firstFacet.values,
        facetValues={};
    if(this.isMultiFacet()){
        var secondFacet=this.getLegendFacet(),
            secondFacetValues=secondFacet.values;
        for(var i=0;i<firstFacetValues.length;i++){
            var criteria={};
            criteria[firstFacet.id]=firstFacetValues[i].id;
            var seriesNode={
                title:firstFacetValues[i].title||firstFacetValues[i].id,
                facetValueId:firstFacetValues[i].id,
                series:[]
            }
            orderedData.add(seriesNode);
            for(var j=0;j<secondFacetValues.length;j++){
                var facetValue=secondFacetValues[j];
                var item={
                    facetValueId:secondFacetValues[j].id,
                    title:secondFacetValues[j].title||secondFacetValues[j].id
                };
                seriesNode.series.add(item);
                criteria[secondFacet.id]=secondFacetValues[j].id;
                item.record=this.getDataRecord(criteria,multiCellData);
                item.value=this.getValueFromRecord(item.record,criteria,multiCellData);
            }
        }
    }else{
        var criteria={};
        for(var i=0;i<firstFacetValues.length;i++){
            var facetValue=firstFacetValues[i];
            var item={
                title:facetValue.title||facetValue.id,
                facetValueId:facetValue.id
            };
            orderedData.add(item);
            criteria[firstFacet.id]=firstFacetValues[i].id;
            item.record=this.getDataRecord(criteria,multiCellData);
            item.value=this.getValueFromRecord(item.record,criteria,multiCellData);
        }
    }
    return orderedData;
}
,isc.A._drawData=function isc_FacetChart__drawData(gradations,logScale,labelDataPairs,rotateLabels,checkDataValueLabels){
    var hasExtraAxes=this._hasExtraAxes(),
        numValueAxes=this._getNumValueAxes(),
        numAxes=1+numValueAxes,
        settings=hasExtraAxes&&this._getExtraAxisSettings().all;
    for(var i=0,maxI=(hasExtraAxes?3*numValueAxes:1);i<maxI;++i){
        var j=i%numValueAxes,
            k=(i-j)/numValueAxes,
            context=(j==0?this:settings[j-1]);
        if(hasExtraAxes){
            var barChart=(context.chartType=="Column"),
                areaChart=(
                    !barChart&&
                    (context.chartType=="Area"||
                    (context.chartType=="Line"&&context.filled))),
                lineChart=!(barChart||areaChart)&&(context.chartType=="Line");
            if(!((k==0&&barChart)||(k==1&&areaChart)||(k==2&&lineChart))){
                continue;
            }
        }
        if(context.chartType=="Column"||context.chartType=="Bar"){
            this._drawBars(
                (context==this?labelDataPairs:null),rotateLabels,context,
                !checkDataValueLabels);
        }else if(context.chartType=="Line"||context.chartType=="Area"){
            this._drawLines(
                (context==this?gradations:null),
                (context==this?logScale:null),
                (context==this?labelDataPairs:null),
                rotateLabels,context,
                !checkDataValueLabels);
        }else if(context.chartType=="Radar"){
            this.drawRadarData();
        }else if(this.isPieChart(context.chartType)){
            this.drawPieData();
        }else if(context.chartType=="Scatter"){
            this.drawScatterData(rotateLabels);
        }else{
            this.logWarn("chart type: '"+context.chartType+"' not supported");
        }
    }
    var data=this.getOrderedData(),
        ret=false;
    for(var j=0;j<numValueAxes&&!(checkDataValueLabels&&ret);++j){
        var context=(j==0?this:settings[j-1]);
        ret=this._drawDataValueLabels(data,context,checkDataValueLabels);
    }
    return ret;
}
,isc.A._getDiscontinuousLines=function isc_FacetChart__getDiscontinuousLines(context){
    context=context||this;
    var filled=false;
    if(this.chartType!="Scatter"){
        var range=this._getZoomValueRange(),
            start=range[0].index,
            end=range[1].index,
            len=end-start+1;
        filled=this.isFilled(context)&&len>=2;
    }
    return(context.discontinuousLines!=null?context.discontinuousLines:filled);
}
,isc.A._drawLines=function isc_FacetChart__drawLines(gradations,logScale,labelDataPairs,rotateLabels,context,drawLines){
    var rect=this.getChartRect(),
        data=this.getOrderedData(),
        axisStartValue=context._axisStartValue;
    var range=this._getZoomValueRange();
    var lowValue=range[0].dataValue,highValue=range[1].dataValue;
    var start=range[0].index,end=range[1].index,len=end-start+1;
    var discrete=(this._hasDiscreteDataValues()||gradations==null||len==1);
    var isRadar=context.chartType=="Radar";
    var center,anglePerValue,offset,spacing;
    if(isRadar){
        center=this.getChartCenter();
        anglePerValue=Math.round(360/this.getDataLabelFacet().values.length);
    }else{
        var startMargin=(
                this._hasExtraAxes()&&isc.isA.Number(this._extraAxisStartMargin)?
                this._extraAxisStartMargin:this.dataMargin),
            dataSpace=(rect.width-2*startMargin);
        offset=rect.left+startMargin;
        spacing=len>1?dataSpace/(len-1):0;
    }
    var multiFacet=this.isMultiFacet(),
        stacked=context.isMultiFacet()&&this.isStacked(context),
        filled=this.isFilled(context)&&len>=2;
    var dataSeriesLength=context.isMultiFacet()?data[0].series.length:1;
    var isExtraAxisChart=(context!=this),
        extraAxisMetric;
    if(isExtraAxisChart){
        extraAxisMetric=context._metric;
    }
    var discontinuousLines=this._getDiscontinuousLines(context),
        leftBasePoints,rightBasePoints,
        startBasePoint0,endBasePoint0,
        startBasePoint,endBasePoint,
        chartRect=this.getChartRect(),
        y0=chartRect.top+chartRect.height,
        badPoint=[NaN,NaN],
        lastShapePoints,
        plotValues,
        inc,
        k=start,
        xs=[];
    if(drawLines&&filled&&stacked&&discontinuousLines){
        leftBasePoints=new Array(len);
        rightBasePoints=new Array(len);
    }
    for(var i=0;i<dataSeriesLength;++i){
        var values,records,seriesIndex=null;
        if(this.isMultiFacet()&&(!isExtraAxisChart||context.isMultiFacet())){
            var series=data.getProperty("series").getProperty(i);
            records=series.getProperty("record");
            values=isExtraAxisChart?records.getProperty(extraAxisMetric):series.getProperty("value");
            seriesIndex=i;
        }else{
            if(isExtraAxisChart){
                if(this.isMultiFacet()){
                    var fixedFacetValue=this._getFixedFacetValue(context);
                    seriesIndex=this.getLegendFacet().values.findIndex("id",fixedFacetValue.id);
                    var series=data.getProperty("series").getProperty(seriesIndex);
                    records=series.getProperty("record");
                }else{
                    records=data.getProperty("record");
                }
            }
            values=(isExtraAxisChart?records.getProperty(extraAxisMetric):data.getProperty("value"));
        }
        if(stacked){
            plotValues=this.addValues(values,plotValues);
        }else{
            plotValues=values;
        }
        var reverse=(i%2!=0);
        inc=reverse?-1:1;
        var points=drawLines&&[],
            shapePoints=filled&&[],
            leftBadValue=false,
            rightBadValue=false,
            prevBadValue=(!isRadar?true:
                this.connected&&(
                    !isc.isA.Number(values[reverse?start:end])||
                    plotValues[reverse?start:end]<axisStartValue)),
            badValue=(!isc.isA.Number(values[k])||plotValues[k]<axisStartValue);
        for(var j=0;j<len;++j,k+=inc){
            var nextBadValue=(j<len-1?
                    (!isc.isA.Number(values[k+inc])||plotValues[k+inc]<axisStartValue):
                    (!isRadar?true:
                        this.connected&&(
                            !isc.isA.Number(values[reverse?end:start])||
                            plotValues[reverse?end:start]<axisStartValue)));
            var value=plotValues[k],
                point;
            if(i==0&&!isRadar){
                xs[k]=(discrete?
                    Math.round(offset+(k-start)*spacing):
                    this._getXCoord(data[k].title,lowValue,highValue,logScale,context));
            }
            if(badValue){
                if(k==start){
                    leftBadValue=true
                }else if(k==end){
                    rightBadValue=true;
                }
                point=badPoint
            }else if(isRadar){
                var valueRatio=this.getValueRatio(value),
                    distance=Math.round(valueRatio*this.maxRadius),
                    angle=anglePerValue*(k-start);
                point=isc.GraphMath.polar2screen(angle,distance,center,true);
            }else{
                point=[xs[k],this.getYCoord(value,context)];
            }
            if(drawLines){
                points.push(point);
            }
            if(drawLines&&filled){
                if(badValue){
                    if(stacked&&discontinuousLines){
                        var leftBasePoint=leftBasePoints[k-start],
                            rightBasePoint=rightBasePoints[k-start];
                        if(leftBasePoint==rightBasePoint){
                            var basePoint=(leftBasePoint||(isRadar?center:[xs[k],y0]));
                            shapePoints.push(basePoint);
                        }else{
                            leftBasePoint=leftBasePoint||(isRadar?center:[xs[k],y0]);
                            rightBasePoint=rightBasePoint||(isRadar?center:[xs[k],y0]);
                            if(reverse){
                                shapePoints.push(rightBasePoint);
                                shapePoints.push(leftBasePoint);
                            }else{
                                shapePoints.push(leftBasePoint);
                                shapePoints.push(rightBasePoint);
                            }
                        }
                    }
                }else{
                    if(discontinuousLines&&prevBadValue){
                        var basePoints=(reverse?rightBasePoints:leftBasePoints),
                            basePoint=(
                                (stacked&&basePoints[k-start])||
                                (isRadar?center:[xs[k],y0]));
                        shapePoints.push(basePoint);
                    }
                    shapePoints.push(point);
                    if(discontinuousLines&&nextBadValue){
                        var basePoints=(reverse?leftBasePoints:rightBasePoints),
                            basePoint=(
                                (stacked&&basePoints[k-start])||
                                (isRadar?center:[xs[k],y0]));
                        shapePoints.push(basePoint);
                    }
                    if(stacked){
                        if(discontinuousLines){
                            if(!prevBadValue||(k==(reverse?end:start)&&!isRadar&&!nextBadValue)){
                                (reverse?rightBasePoints:leftBasePoints)[k-start]=point;
                            }
                            if(!nextBadValue||(k==(reverse?start:end)&&!isRadar&&!prevBadValue)){
                                (reverse?leftBasePoints:rightBasePoints)[k-start]=point;
                            }
                        }else{
                            if(k==start){
                                startBasePoint=point;
                            }else if(k==end){
                                endBasePoint=point;
                            }
                        }
                    }
                }
            }
            if(!badValue){
                var drawnValue=this._getDrawnValue(context,k,seriesIndex);
                drawnValue.drawnX=point[0];
                drawnValue.drawnY=point[1];
                drawnValue.value=values[k];
            }
            prevBadValue=badValue;
            badValue=nextBadValue;
        }
        if(isRadar&&this.connected){
            if(!(leftBadValue||rightBadValue)){
                points.add(points[0]);
            }
            if(filled&&shapePoints.length>0){
                shapePoints.add(shapePoints[0]);
            }
        }
        k-=inc;
        var color,lineProps;
        if(drawLines){
            color=this._getDataColor(i,context);
            lineProps={lineColor:color};
            this.drawDataLine(points,lineProps,context);
        }
        if(drawLines&&filled){
            if(lastShapePoints==null||!stacked){
                if(isRadar){
                    lastShapePoints=[];
                }else{
                    startBasePoint0=[xs[start],y0];
                    endBasePoint0=[xs[end],y0];
                    if(inc==1){
                        lastShapePoints=[endBasePoint0,startBasePoint0];
                    }else{
                        lastShapePoints=[startBasePoint0,endBasePoint0];
                    }
                }
            }
            var fullShapePoints=shapePoints.concat(lastShapePoints);
            lastShapePoints=shapePoints;
            if(!discontinuousLines&&filled&&stacked&&!isRadar){
                if(leftBadValue){
                    var sbp=startBasePoint||startBasePoint0;
                    if(inc==1)lastShapePoints.unshift(sbp);
                    else lastShapePoints.push(sbp);
                }
                if(rightBadValue){
                    var ebp=endBasePoint||endBasePoint0;
                    if(inc==1)lastShapePoints.push(ebp);
                    else lastShapePoints.unshift(ebp);
                }
            }
            var useGradients=this.useAutoGradients&&(!multiFacet||!this.isVML);
            if(!fullShapePoints.isEmpty()){
                if(!multiFacet||context.chartType=="Area"||context.chartType=="Line"){
                    this._drawDataShape(fullShapePoints,{
                        lineColor:color,
                        fillColor:!useGradients?color:null,
                        fillGradient:useGradients?this._getDataGradient(i,null,null,context):null
                    },false,true,context);
                }else if(context.chartType=="Radar"){
                    var shape=this._drawDataShape(fullShapePoints,{
                        lineColor:color,
                        fillColor:!useGradients?color:null,
                        fillGradient:null
                    },this.connected,false,context);
                    if(useGradients){
                        shape.fillGradient=this.getRadarShapeGradient(
                                color,shape,center,i==0);
                    }
                    shape.draw();
                }
            }
        }
        if(drawLines&&multiFacet&&this._getLowErrorMetric()!=null&&!this._hasExtraAxes()){
            this._drawErrorBars(points,records,i,rect,start,end,reverse);
        }
        if(drawLines&&context.showDataPoints){
            if(records==null){
                records=data.getProperty("record");
            }
            this.drawPoints(points,records,i,plotValues,start,end,reverse,context);
        }
        if(drawLines&&i==0&&!isRadar&&context==this){
            if(labelDataPairs==null){
                this.drawDataLabels(xs,data.getProperty("title"),true,rotateLabels,data.getProperty("facetValueId"));
            }else{
                var dataValues=labelDataPairs.getProperty("dataValue");
                var numDataValues=dataValues.length;
                var labelXs=[],labels=[];
                if(discrete){
                    for(var l=0;l<numDataValues;++l){
                        var dataValue=dataValues[l],
                            m=data.findNextIndex(
                                start,"title",dataValue,end,Array.DATETIME_VALUES);
                        if(m!=-1){
                            labelXs.push(Math.round(offset+(m-start)*spacing));
                            labels.push(labelDataPairs[l].label);
                        }
                    }
                }else{
                    for(var l=0;l<numDataValues;++l){
                        var dataValue=dataValues[l];
                        if(!(dataValue<lowValue||dataValue>highValue)){
                            labelXs.push(this._getXCoord(dataValue,lowValue,highValue,logScale,context));
                            labels.push(labelDataPairs[l].label);
                        }
                    }
                }
                this.drawDataLabels(labelXs,labels,true,rotateLabels,dataValues);
            }
        }
    }
}
,isc.A.getBasePoints=function isc_FacetChart_getBasePoints(points){
    var rect=this.getChartRect(),
        y=rect.top+rect.height,
        basePoints=[[points[0][0],y],[points[points.length-1][0],y]];
    return basePoints;
}
,isc.A.addValues=function isc_FacetChart_addValues(values1,values2){
    if(values2==null)return values1;
    if(values1==null)return values2;
    var totals=new Array(values1.length);
    for(var i=values1.length;i--;){
        var v1=values1[i],
            v2=values2[i];
        totals[i]=(isc.isA.Number(v1)?v1:0)+(isc.isA.Number(v2)?v2:0);
    }
    return totals;
}
,isc.A.drawPoints=function isc_FacetChart_drawPoints(points,records,series,values,start,end,reverse,context){
    context=context||this;
    var drawingVML=this.drawingType=="vml";
    if(start==null||end==null){
        start=0;
        end=records.length-1;
    }
    reverse=(reverse===true);
    if(!values)values=[];
    if(this.pointSizeMetric){
        var maxPointSizeValue=this.getMaxValue(this.pointSizeMetric);
    }
    var color=this._getDataColor(series,context);
    var drawShape=isc.DrawShape.create({
        lineColor:color,
        fillColor:color
    },context.dataPointDefaults,context.dataPointProperties,{
        drawPane:this,
        excludeFromQuadTree:true,
        autoDraw:true,
        commands:drawShapeCommands,
        canHover:false,
        _context:context
    });
    var useMultiplePointShapes=this._getUseMultiplePointShapes(),
        shape=this.pointShapes[(
            useMultiplePointShapes?(series%this.pointShapes.length):0)],
        pointSize,
        drawShapeCommands=[];
    for(var i=0,len=end-start+1;i<len;i++){
        var j=reverse?len-i-1:i,
            record=records[start+i];
        if(this.pointSizeMetric){
            var maxPointSizeValue=this._getMaxPointSizeValue(false);
            var pointSizeValue=record[this.pointSizeMetric];
            pointSize=Math.max(this.minDataPointSize,
                                 Math.ceil((pointSizeValue/maxPointSizeValue)*this.maxDataPointSize));
        }else{
            pointSize=context.dataPointSize;
        }
        var point=points[j],
            value=values[start+i];
        if(isc.isA.Number(value)&&
            !isNaN(point[1]))
        {
            if(shape==this._$Oval){
                var cx=point[0],
                    cy=point[1],
                    radius=pointSize/2+0.25;
                drawShapeCommands.push(
                    {type:this._$moveto,args:[cx+radius,cy]},
                    {type:this._$circleto,args:[[cx,cy],radius,0,360]},
                    this._closeCommand
                );
            }else if(shape==this._$Square){
                var mx=point[0]-pointSize/2,
                    my=point[1]-pointSize/2;
                if(drawingVML){
                    mx=mx<<0;
                    my=my<<0;
                }
                drawShapeCommands.push(
                    {type:this._$moveto,args:[mx,my]},
                    {type:this._$lineto,args:[[mx+pointSize,my],[mx+pointSize,my+pointSize],[mx,my+pointSize]]},
                    this._closeCommand
                );
            }else if(shape==this._$Diamond){
                var cx=point[0],
                    cy=point[1],
                    delta=pointSize/2+0.8;
                drawShapeCommands.push(
                    {type:this._$moveto,args:[cx,cy-delta]},
                    {type:this._$lineto,args:[[cx+delta,cy],[cx,cy+delta],[cx-delta,cy]]},
                    this._closeCommand
                );
            }else{
                var cx=point[0],
                    cy=point[1],
                    delta=pointSize/2+0.8;
                drawShapeCommands.push(
                    {type:this._$moveto,args:[cx-delta,cy+delta]},
                    {type:this._$lineto,args:[[cx+delta,cy+delta],[cx,cy-delta]]},
                    this._closeCommand
                );
            }
            this._createLightweightDrawPoint(point,pointSize,record,value,context);
        }
    }
    drawShape.setCommands(drawShapeCommands);
}
,isc.A._createLightweightDrawPoint=function isc_FacetChart__createLightweightDrawPoint(point,pointSize,record,value,context){
    var startLeft=point[0]-pointSize/2,
        startTop=point[1]-pointSize/2;
    var drawPoint=isc.DrawItem.create(this.dataPointDefaults,this.dataPointProperties,{
        ID:false,
        autoDraw:false,
        _boundingBox:[startLeft,startTop,startLeft+pointSize,startTop+pointSize],
        canHover:this.interactivePoints,
        _context:context,
        dataRecord:record,
        dataValue:value,
        isPointInPath:function(x,y){
            return this.isInBounds(x,y);
        }
    });
    drawPoint.drawPane=this;
    this._addEventOnlyDrawItem(drawPoint);
    return drawPoint;
}
,isc.A._drawErrorBars=function isc_FacetChart__drawErrorBars(points,records,series,rect,start,end,reverse){
    var highErrorMetric=this._getHighErrorMetric(),
        lowErrorMetric=this._getLowErrorMetric();
    if(start==null||end==null){
        start=0;
        end=records.length-1;
    }
    reverse=(reverse===true);
    var round=!this.supportsFractionalCoordinates(),
        top=rect.top,
        bottom=top+rect.height,
        color=isc.DrawPane._mutergb(this.errorBarColorMutePercent,this.getDataColor(series)),
        errorLineProperties=isc.addDefaults({
                    drawPane:this,
                    autoDraw:true,
                    lineColor:color,
                    lineWidth:1
                },this.errorLineProperties);
    for(var i=0,len=end-start+1;i<len;++i){
        var point=points[reverse?len-i-1:i],
            x=point[0],
            y=point[1];
        if(isNaN(y)){
            continue;
        }
        var record=records[start+i],
            highValue=record[highErrorMetric],
            lowValue=record[lowErrorMetric];
        if(!isc.isA.Number(highValue))highValue=null;
        if(!isc.isA.Number(lowValue))lowValue=null;
        var highY=(highValue!=null?this.getYCoord(highValue):y),
            lowY=(lowValue!=null?this.getYCoord(lowValue):y);
        if(highValue==null&&lowValue==null){
            continue;
        }
        if(highValue!=null&&!(top<=highY&&highY<=bottom)){
            highValue=null;
            highY=Math.min(bottom,Math.max(top,highY));
        }
        if(lowValue!=null&&!(top<=lowY&&lowY<=bottom)){
            lowValue=null;
            lowY=Math.min(bottom,Math.max(top,lowY));
        }
        isc.DrawLine.create(errorLineProperties,{
            startLeft:x,
            startTop:highY,
            endLeft:x,
            endTop:lowY
        });
        var errorBarLeft=x-this.errorBarWidth/2,
            errorBarRight=x+this.errorBarWidth/2;
        if(round){
            errorBarLeft=Math.round(errorBarLeft);
            errorBarRight=Math.round(errorBarRight);
        }
        if(highValue!=null){
            isc.DrawLine.create(errorLineProperties,{
                startLeft:errorBarLeft,
                startTop:highY,
                endLeft:errorBarRight,
                endTop:highY
            });
        }
        if(lowValue!=null){
            isc.DrawLine.create(errorLineProperties,{
                startLeft:errorBarLeft,
                startTop:lowY,
                endLeft:errorBarRight,
                endTop:lowY
            });
        }
    }
}
,isc.A.drawDataLabels=function isc_FacetChart_drawDataLabels(coords,titles,vertical,rotateXLabels,facetIds){
    for(var i=0;i<coords.length;i++){
        var facetValue={
            id:facetIds[i],
            title:titles[i]
        };
        this.drawDataLabel(coords[i],titles[i],vertical,rotateXLabels,facetValue);
    }
}
,isc.A.getRotatedCenteringOffset=function isc_FacetChart_getRotatedCenteringOffset(labelHeight){
    return Math.floor(labelHeight/2);
}
,isc.A.drawDataLabel=function isc_FacetChart_drawDataLabel(coord,title,vertical,rotateXLabels,facetValue){
    rotateXLabels=(rotateXLabels==null?this._canRotateLabels():rotateXLabels===true);
    if(vertical==null)vertical=true;
    var labelHeight=this.getDataLabelHeight();
    if(vertical){
        var labelDims=this.measureLabel(title,this.dataLabelProperties),
            labelTop,labelLeft,
            drawLabel=true;
        if(!this.showInlineLabels){
            labelTop=this.getChartTop()+this.getChartHeight()+this.chartRectMargin;
            labelLeft=coord;
            if(rotateXLabels){
                drawLabel=labelLeft+Math.floor(labelHeight/2)<=this.getInnerContentWidth();
                labelLeft+=this.getRotatedCenteringOffset(labelHeight);
            }else{
                labelLeft-=labelDims.width/2;
                drawLabel=labelLeft+labelDims.width<=this.getInnerContentWidth();
            }
        }else{
            rotateXLabels=false;
            labelTop=this.getChartTop()+this.getChartHeight()
                -this._inlineLabelYOffset-labelDims.height;
            labelLeft=coord+this._inlineLabelXOffset;
            drawLabel=labelLeft+labelDims.width<this.getChartLeft()+this.getChartWidth();
        }
        drawLabel=drawLabel&&0<=labelLeft;
        if(drawLabel){
            var dataLabel=this.drawLabel(labelLeft,labelTop,title,this.dataLabelProperties,rotateXLabels);
            this._processDataLabelActions(dataLabel,facetValue);
        }
    }else{
        var labelHeight=this.getDataLabelHeight();
        var dataLabel=this.drawLabel(this.getAxisLabelSpace(true),
                       coord-Math.round(labelHeight/2),title,this.dataLabelProperties);
        this._processDataLabelActions(dataLabel,facetValue);
    }
}
,isc.A._processDataLabelActions=function isc_FacetChart__processDataLabelActions(dataLabel,facetValue){
    var _this=this;
    if(this.dataLabelClick){
        dataLabel.click=function(){
            _this.dataLabelClick(facetValue);
        }
    }
    if(this.dataLabelHover){
        dataLabel.canHover=true;
        dataLabel.hover=function(){
            _this.dataLabelHover(facetValue);
        }
    }
    if(this.getDataLabelHoverHTML){
        dataLabel.canHover=true;
        dataLabel.getHoverHTML=function(){
            return _this.getDataLabelHoverHTML(facetValue);
        }
    }
}
,isc.A._processLegendActions=function isc_FacetChart__processLegendActions(legend,facetValue,metricFacetValue){
    var _this=this;
    if(this.legendClick){
        legend.click=function(){
            _this.legendClick(facetValue,metricFacetValue);
        }
    }
    if(facetValue){
        if(this.legendHover){
            legend.canHover=true;
            legend.hover=function(){
                _this.legendHover(facetValue,metricFacetValue);
            }
        }
        if(this.getLegendHoverHTML){
            legend.canHover=true;
            legend.getHoverHTML=function(){
                return _this.getLegendHoverHTML(facetValue,metricFacetValue);
            }
        }
    }
}
);
isc.evalBoundary;isc.B.push(isc.A._calculateBarLayout=function isc_FacetChart__calculateBarLayout(context,data,dataLength,axisLength,axisOffset,ret){
    var stacked=context.isMultiFacet()&&this.isStacked(context);
    var clustered=context.isMultiFacet()&&!this.isStacked(context);
    var startMargin=this.dataMargin;
    var segmentCount=context.isMultiFacet()?data[0].series.length:1;
    var barsPerCluster=segmentCount;
    var numClusters=dataLength;
    var totalBars=clustered?numClusters*barsPerCluster:dataLength;
    var availableSpace=axisLength-(2*startMargin);
    var clusterMargin=!clustered?this.barMargin:
            Math.min(50,Math.round(this.barMargin*this.clusterMarginRatio));
    var totalMargin=(totalBars*this.barMargin)+
            (clustered?numClusters*clusterMargin:0);
    var availableBarSpace=Math.max(0,availableSpace-totalMargin);
    var barThickness=Math.floor(availableBarSpace/totalBars);
    var allocatedSpace;
    if(barThickness<this.minBarThickness){
        barThickness=this.minBarThickness;
    }else if(barThickness>this.maxBarThickness){
        allocatedSpace=(barThickness-this.maxBarThickness)*totalBars;
        barThickness=this.maxBarThickness;
    }
    var clusterSize=clustered?((barThickness+this.barMargin)*barsPerCluster-this.barMargin)
                                :barThickness;
    var clusterGap=dataLength<2?0:
                       Math.round((availableSpace-(dataLength*clusterSize))/(dataLength-1));
    var clusterBarMargin;
    if(clustered){
        var clusterMarginRatio=Math.max(0,this.clusterMarginRatio);
        if(barsPerCluster>1&&dataLength>1){
            var m=-dataLength*(barsPerCluster-1)/(dataLength-1),
                b=(availableSpace-dataLength*barThickness*barsPerCluster)/(dataLength-1);
            clusterBarMargin=Math.max(0,b/(clusterMarginRatio-m));
            if(Math.abs(Math.floor(clusterBarMargin)*(clusterMarginRatio-m)-b)<
                Math.abs(Math.ceil(clusterBarMargin)*(clusterMarginRatio-m)-b))
            {
                clusterBarMargin=Math.floor(clusterBarMargin);
            }else{
                clusterBarMargin=Math.ceil(clusterBarMargin);
            }
        }else if(barsPerCluster<=1){
            clusterBarMargin=0;
        }else{
            clusterBarMargin=this.barMargin;
        }
        clusterSize=(barThickness+clusterBarMargin)*barsPerCluster-clusterBarMargin;
        clusterGap=dataLength<2?0:
                    Math.round((availableSpace-(dataLength*clusterSize))/(dataLength-1));
    }
    if(allocatedSpace&&(allocatedSpace>2*this.barMargin)){
        clusterGap=Math.round((availableSpace-(dataLength*clusterSize))/(dataLength+1));
    }
    var barOffset=clusterSize+clusterGap;
    var extraSpace=availableSpace-(clusterSize*dataLength)
                                    -(clusterGap*(dataLength-1));
    startMargin+=Math.round(extraSpace/2);
    if(this.logIsDebugEnabled("chartDraw")&&context==this){
        this.logDebug("availableSpace: "+availableSpace+
                     ", availableBarSpace: "+availableBarSpace+
                     ", bars per cluster: "+barsPerCluster+
                     ", final gap between clusters/bars: "+clusterGap+
                     ", final within-cluster bar margin: "+clusterBarMargin+
                     ", barThickness: "+barThickness+
                     ", extraSpace: "+barThickness,"chartDraw");
    }
    clusterMargin=stacked?0:clusterMargin;
    var startOffset=axisOffset+startMargin;
    ret=ret||{};
    ret.barThickness=barThickness;
    ret.clusterSize=clusterSize;
    ret.clusterBarMargin=clusterBarMargin;
    ret.barOffset=barOffset;
    ret.clusterGap=clusterGap;
    ret.startOffset=startOffset;
    ret.startMargin=startMargin;
    return ret;
}
,isc.A._getBarBaseValue=function isc_FacetChart__getBarBaseValue(context){
    var axisStartValue=context._axisStartValue||0,
        axisEndValue=this.getMaxGradation(context)||0;
    return(axisStartValue<=0&&axisEndValue>=0?0:
        (Math.abs(axisStartValue)<=Math.abs(axisEndValue)?axisStartValue:axisEndValue));
}
,isc.A._drawBars=function isc_FacetChart__drawBars(labelDataPairs,rotateLabels,context,drawBars){
    context=context||this;
    rotateLabels=(rotateLabels===true);
    var rect=this.getChartRect(),
        data=this.getOrderedData(),
        maxValue=this.getMaxGradation(context),
        axisStartValue=context._axisStartValue;
    var range=this._getZoomValueRange(),
        start=range[0].index,end=range[1].index,dataLength=end-start+1;
    var stacked=context.isMultiFacet()&&this.isStacked(context);
    var clustered=context.isMultiFacet()&&!this.isStacked(context);
    var vertical=(context.chartType=="Column");
    var layout=this._calculateBarLayout(
            context,data,dataLength,
            (vertical?rect.width:rect.height),
            (vertical?rect.left:rect.top)),
        barThickness=layout.barThickness,
        clusterSize=layout.clusterSize,
        clusterBarMargin=layout.clusterBarMargin,
        barOffset=layout.barOffset,
        startOffset=layout.startOffset,
        startMargin=layout.startMargin;
    var baseValue=this._getBarBaseValue(context);
    if(this._hasExtraAxes()){
        var halfCluster=clusterSize/2;
        this._extraAxisStartMargin=startMargin+halfCluster;
    }
    var isExtraAxisChart=(context!=this),
        extraAxisMetric;
    if(isExtraAxisChart){
        extraAxisMetric=context._metric;
    }
    if(this.isMultiFacet()&&(!isExtraAxisChart||context.isMultiFacet())){
        for(var i=start;i<=end;i++){
            var runningTotal=0,
                firstBar=true,
                prevDrawnX=null,
                prevDrawnY=null;
            var positiveRunningTotal=0,
                negativeRunningTotal=0,
                firstPositiveBar=true,
                firstNegativeBar=true,
                prevPositiveDrawnX=null,
                prevPositiveDrawnY=null,
                prevNegativeDrawnX=null,
                prevNegativeDrawnY=null;
            for(var j=0;j<data[i].series.length;j++){
                var barStart=startOffset+((i-start)*barOffset);
                if(clustered)barStart+=(j*(barThickness+clusterBarMargin));
                var currBar=data[i].series[j],
                    currBarValue=(isExtraAxisChart?
                        (currBar.record!=null?currBar.record[extraAxisMetric]:null):
                        currBar.value),
                    badValue=!isc.isA.Number(currBarValue);
                var prevRunningTotal=0,
                    isFirstBar=false,
                    isPositiveBar=false,
                    isNegativeBar=false;
                if(stacked){
                    if(!badValue&&
                        (currBarValue<0||
                            (currBarValue==0&&!firstNegativeBar&&!firstPositiveBar)))
                    {
                        isNegativeBar=true;
                        prevRunningTotal=negativeRunningTotal;
                        isFirstBar=firstNegativeBar;
                        firstNegativeBar=false;
                    }else{
                        isPositiveBar=true;
                        prevRunningTotal=positiveRunningTotal;
                        if(!badValue){
                            isFirstBar=firstPositiveBar;
                            firstPositiveBar=false;
                        }
                    }
                }else{
                    prevRunningTotal=runningTotal;
                    isFirstBar=firstBar;
                }
                var newRunningTotal=(badValue?0:prevRunningTotal+currBarValue);
                var belowAxisStartValue=(
                        (isFirstBar||clustered||prevRunningTotal<axisStartValue)&&
                        (newRunningTotal<axisStartValue)),
                    barBase=this.getValueCoord(
                        (isFirstBar||clustered?baseValue:Math.max(axisStartValue,prevRunningTotal)),
                        vertical,
                        context),
                    barLength=(badValue?0:
                        this.getValueCoord(
                            Math.max(axisStartValue,newRunningTotal),vertical,context)-
                        barBase),
                    item=null;
                if(isFirstBar){
                    if(vertical){
                        if(stacked){
                            if(isPositiveBar){
                                prevPositiveDrawnY=barBase;
                            }else{
                                prevNegativeDrawnY=barBase;
                            }
                        }else{
                            prevDrawnY=barBase;
                        }
                    }else{
                        if(stacked){
                            if(isPositiveBar){
                                prevPositiveDrawnX=barBase;
                            }else{
                                prevNegativeDrawnX=barBase;
                            }
                        }else{
                            prevDrawnX=barBase;
                        }
                    }
                }
                if(!badValue){
                    if(stacked){
                        if(isPositiveBar){
                            positiveRunningTotal=newRunningTotal;
                        }else{
                            negativeRunningTotal=newRunningTotal;
                        }
                    }
                    if(!belowAxisStartValue){
                        firstBar=false;
                        if(drawBars){
                            var barProps=isc.shallowClone(this.barProperties);
                            if(!this.useAutoGradients){
                                barProps.fillColor=this._getDataColor(j,context);
                            }else{
                                barProps.fillGradient=this._getDataGradient(j,null,null,context);
                            }
                            item=this.drawBar(
                                vertical,barStart,barBase,barThickness,barLength,barProps,
                                context);
                        }
                    }
                }
                currBar=this._getDrawnValue(context,i,j);
                if(vertical){
                    currBar.drawnY=barBase+barLength;
                    if(stacked){
                        if(isPositiveBar){
                            currBar.prevDrawnY=prevPositiveDrawnY;
                            prevPositiveDrawnY=currBar.drawnY;
                        }else{
                            currBar.prevDrawnY=prevNegativeDrawnY;
                            prevNegativeDrawnY=currBar.drawnY;
                        }
                    }
                    currBar.drawnX=barStart+barThickness/2;
                    currBar.barWidth=barThickness;
                    currBar.barHeight=Math.abs(barLength);
                }else{
                    currBar.drawnX=barBase+barLength;
                    if(stacked){
                        if(isPositiveBar){
                            currBar.prevDrawnX=prevPositiveDrawnX;
                            prevPositiveDrawnX=currBar.drawnX;
                        }else{
                            currBar.prevDrawnX=prevNegativeDrawnX;
                            prevNegativeDrawnX=currBar.drawnX;
                        }
                    }
                    currBar.drawnY=barStart+barThickness/2;
                    currBar.barWidth=barLength;
                    currBar.barHeight=Math.abs(barThickness);
                }
                currBar.barThickness=barThickness;
                currBar.drawItemId=item&&item.ID;
                currBar.value=currBarValue;
            }
            if(drawBars&&context==this){
                var usePairs=(labelDataPairs!=null),
                    pairIndex=(usePairs&&labelDataPairs.findIndex(
                        "dataValue",data[i].title,Array.DATETIME_VALUES));
                if(!usePairs||pairIndex!=-1){
                    var barStart=startOffset+((i-start)*barOffset),
                        labelOffset=barStart+Math.floor(clusterSize/2),
                        label=(usePairs?labelDataPairs[pairIndex].label:data[i].title);
                    var facetValue={
                        id:(usePairs?labelDataPairs[pairIndex].dataValue:data[i].facetValueId),
                        title:label
                    };
                    this.drawDataLabel(labelOffset,label,vertical,rotateLabels,facetValue);
                }
            }
        }
    }else{
        var records,seriesIndex=null;
        if(isExtraAxisChart){
            if(this.isMultiFacet()){
                var fixedFacetValue=this._getFixedFacetValue(context);
                seriesIndex=this.getLegendFacet().values.findIndex("id",fixedFacetValue.id);
                records=data.getProperty("series").getProperty(seriesIndex).getProperty("record");
            }else{
                records=data.getProperty("record");
            }
        }
        var barBase=this.getValueCoord(baseValue,vertical,context);
        for(var i=start;i<=end;i++){
            var barStart=((i-start)*barOffset)+startOffset,
                value=(isExtraAxisChart?records[i][extraAxisMetric]:data[i].value),
                badValue=!isc.isA.Number(value),
                belowAxisStartValue=(value<axisStartValue),
                barLength=(badValue?0:
                    this.getValueCoord(Math.max(axisStartValue,value),vertical,context)-
                    barBase),
                item=null;
            if(drawBars&&!(badValue||belowAxisStartValue)){
                var barProps=isc.shallowClone(this.barProperties);
                if(!this.useAutoGradients){
                    barProps.fillColor=this._getDataColor(i,context);
                }else{
                    barProps.fillGradient=this._getDataGradient(i,null,null,context);
                }
                item=this.drawBar(
                    vertical,barStart,barBase,barThickness,barLength,barProps,context);
            }
            var currBar=this._getDrawnValue(context,i,seriesIndex);
            if(vertical){
                currBar.drawnX=barStart+barThickness/2;
                currBar.drawnY=barBase+barLength;
                currBar.barWidth=barThickness;
                currBar.barHeight=Math.abs(barLength);
            }else{
                currBar.drawnY=barStart+barThickness/2;
                currBar.drawnX=barBase+barLength;
                currBar.barWidth=barLength;
                currBar.barHeight=Math.abs(barThickness);
            }
            currBar.barThickness=barThickness;
            currBar.drawItemId=item&&item.ID;
            if(drawBars&&context==this){
                var usePairs=(labelDataPairs!=null),
                    pairIndex=(usePairs&&labelDataPairs.findIndex(
                        "dataValue",data[i].title,Array.DATETIME_VALUES));
                if(!usePairs||pairIndex!=-1){
                    var labelOffset=Math.round(barStart+(barThickness/2)),
                        label=(usePairs?labelDataPairs[pairIndex].label:data[i].title);
                    var facetValue={
                        id:(usePairs?labelDataPairs[pairIndex].dataValue:data[i].facetValueId),
                        title:label
                    };
                    this.drawDataLabel(labelOffset,label,vertical,rotateLabels,facetValue);
                }
            }
        }
    }
}
,isc.A._getShowDataValues=function isc_FacetChart__getShowDataValues(context){
    context=context||this;
    var showDataValues=context.chartType!="Scatter"&&context.showDataValues&&
                         !(!context._showDataValues&&context._showValueOnHover);
    if(this._hasExtraAxes()){
        var settings=this._getExtraAxisSettings(),
            numAxes=1+settings.visible.length;
        for(var j=0;showDataValues&&j<numAxes;++j){
            var c=(j==0?this:settings.visible[j-1]);
            if(c==context){
                break;
            }else{
                showDataValues=!(c.showDataValues&&!(!c._showDataValues&&c._showValueOnHover));
            }
        }
    }
    return showDataValues;
}
,isc.A._getShowValueOnHover=function isc_FacetChart__getShowValueOnHover(context){
    context=context||this;
    return(
        !this._getShowDataValues(context)&&
        (context.showValueOnHover||
        (context.showValueOnHover!==false&&
        context.showDataValues&&
        !(context._showDataValues&&!context._showValueOnHover))));
}
,isc.A._getShowValueOnHoverContext=function isc_FacetChart__getShowValueOnHoverContext(){
    if(this._hasExtraAxes()){
        var settings=this._getExtraAxisSettings().visible,
            numAxes=1+settings.length;
        for(var j=0;j<numAxes;++j){
            var context=(j==0?this:settings[j-1]);
            if(this._getShowValueOnHover(context)){
                return context;
            }
        }
    }else if(this._getShowValueOnHover()){
        return this;
    }
    return null;
}
,isc.A._drawDataValueLabels=function isc_FacetChart__drawDataValueLabels(data,context,checkDataValueLabels){
    if(this._getShowDataValues(context)){
        var cache={},
            isExtraAxisChart=(context!=this),
            contextIsMultiFacet=context.isMultiFacet(),
            extraAxisMetric,
            records,
            seriesIndex;
        if(isExtraAxisChart){
            extraAxisMetric=context._metric;
            if(!contextIsMultiFacet){
                if(this.isMultiFacet()){
                    var fixedFacetValue=this._getFixedFacetValue(context);
                    seriesIndex=this.getLegendFacet().values.findIndex("id",fixedFacetValue.id);
                    records=data.getProperty("series").getProperty(seriesIndex).getProperty("record");
                }else{
                    records=data.getProperty("record");
                }
            }
        }
        switch(context.chartType){
            case"Area":
            case"Line":
                if(this.isMultiFacet()&&(!isExtraAxisChart||context.isMultiFacet())){
                    var maxWidth=0;
                    for(var i=0;i<data.length;i++){
                        var prevWidth=maxWidth;
                        maxWidth=0;
                        for(var j=0;j<data[i].series.length;j++){
                            var dataObj=data[i].series[j],
                                value=(isExtraAxisChart?
                                    dataObj.record&&dataObj.record[extraAxisMetric]:
                                    dataObj.value);
                            if(!isc.isA.Number(value))continue;
                            var labelSize=this._getHoverLabel(cache,i,j,context,value);
                            maxWidth=Math.max(maxWidth,labelSize.width);
                            if(prevWidth>0){
                                var dx=this._getDrawnValue(context,i,j).drawnX
                                    -this._getDrawnValue(context,i-1,0).drawnX
                                    -prevWidth;
                                if(dx<20){
                                    context._showValueOnHover=true;
                                    delete context._showDataValues;
                                    return false;
                                }
                            }
                            for(var k=j+1;k<data[i].series.length;k++){
                                var dataObj=data[i].series[k],
                                    value=(isExtraAxisChart?
                                        dataObj.record&&dataObj.record[extraAxisMetric]:
                                        dataObj.value);
                                if(!isc.isA.Number(value))continue;
                                var dy=Math.abs(this._getDrawnValue(context,i,k).drawnY
                                        -this._getDrawnValue(context,i,j).drawnY);
                                dy-=labelSize.height;
                                if(dy<5){
                                    context._showValueOnHover=true;
                                    delete context._showDataValues;
                                    return false;
                                }
                            }
                        }
                    }
                    if(!checkDataValueLabels){
                        for(var i=0;i<data.length;i++){
                            for(var j=0;j<data[i].series.length;j++){
                                var label=this._getHoverLabel(cache,i,j);
                                if(label!=null){
                                    var drawnValue=this._getDrawnValue(context,i,j);
                                    this._drawDataValueLabelForPoint(drawnValue.drawnX,
                                        drawnValue.drawnY,label);
                                }
                            }
                        }
                    }
                }else{
                    var k=!contextIsMultiFacet?seriesIndex:null;
                    for(var j=1;j<data.length;j++){
                        var value=isExtraAxisChart?records[j][extraAxisMetric]:data[j].value;
                        if(!isc.isA.Number(value))continue;
                        var labelSize=this._getHoverLabel(cache,j-1,null,context,
                                isExtraAxisChart?records[j-1][extraAxisMetric]:data[j-1].value);
                        var dx=this._getDrawnValue(context,j,k).drawnX
                            -this._getDrawnValue(context,j-1,k).drawnX
                            -labelSize.width;
                        if(dx<20){
                            context._showValueOnHover=true;
                            delete context._showDataValues;
                            return false;
                        }
                    }
                    this._getHoverLabel(cache,data.length-1,null,context,
                                        isExtraAxisChart?records[data.length-1][extraAxisMetric]
                                        :data[data.length-1].value);
                    if(!checkDataValueLabels){
                        for(var j=0;j<data.length;j++){
                            var label=this._getHoverLabel(cache,j);
                            if(label!=null){
                                var drawnValue=this._getDrawnValue(context,j,k);
                                this._drawDataValueLabelForPoint(drawnValue.drawnX,drawnValue.drawnY,label);
                            }
                        }
                    }
                }
                break;
            case"Radar":
                if(this.isMultiFacet()){
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            if(!isc.isA.Number(data[i].series[j].value))continue;
                            var labelSize=this._getHoverLabel(cache,i,j,context,data[i].series[j].value);
                            var labelDiag=Math.sqrt(labelSize.width*labelSize.width+labelSize.height*labelSize.height);
                            for(var i2=i;i2<data.length;i2++){
                                for(var j2=(i2==i)?j+1:0;j2<data[i2].series.length;j2++){
                                    if(!isc.isA.Number(data[i2].series[j2].value))continue;
                                    var labelSize2=this._getHoverLabel(cache,i2,j2,context,data[i2].series[j2].value);
                                    var labelDiag2=Math.sqrt(labelSize2.width*labelSize2.width+labelSize2.height*labelSize2.height);
                                    var dx=data[i].series[j].drawnX-data[i2].series[j2].drawnX;
                                    var dy=data[i].series[j].drawnY-data[i2].series[j2].drawnY;
                                    var distance=Math.sqrt(dx*dx+dy*dy);
                                    distance-=(labelDiag+labelDiag2)/2;
                                    if(distance<=0){
                                        this._showValueOnHover=true;
                                        delete this._showDataValues;
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            var label=this._getHoverLabel(cache,i,j);
                            if(label!=null){
                                this._drawDataValueLabelForPoint(data[i].series[j].drawnX,
                                    data[i].series[j].drawnY,label);
                            }
                        }
                    }
                }else{
                    for(var j=0;j<data.length;j++){
                        if(!isc.isA.Number(data[j].value))continue;
                        var labelSize=this._getHoverLabel(cache,j,null,context,data[j].value);
                        var labelDiag=Math.sqrt(labelSize.width*labelSize.width+labelSize.height*labelSize.height);
                        for(var j2=j+1;j2<data.length;j2++){
                            if(!isc.isA.Number(data[j2].value))continue;
                            var labelSize2=this._getHoverLabel(cache,j2,null,context,data[j2].value);
                            var labelDiag2=Math.sqrt(labelSize2.width*labelSize2.width+labelSize2.height*labelSize2.height);
                            var dx=data[j].drawnX-data[j2].drawnX;
                            var dy=data[j].drawnY-data[j2].drawnY;
                            var distance=Math.sqrt(dx*dx+dy*dy);
                            distance-=(labelDiag+labelDiag2)/2;
                            if(distance<=0){
                                this._showValueOnHover=true;
                                delete this._showDataValues;
                                return;
                            }
                        }
                    }
                    for(var j=0;j<data.length;j++){
                        var label=this._getHoverLabel(cache,j);
                        if(label!=null){
                            this._drawDataValueLabelForPoint(data[j].drawnX,data[j].drawnY,label);
                        }
                    }
                }
                break;
            case"Bar":
            case"Column":
                if(this.isMultiFacet()&&(!isExtraAxisChart||context.isMultiFacet())){
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            var dataObj=data[i].series[j],
                                value=(isExtraAxisChart?
                                    dataObj.record&&dataObj.record[extraAxisMetric]:
                                    dataObj.value);
                            if(!isc.isA.Number(value))continue;
                            var drawnValue=this._getDrawnValue(context,i,j),
                                labelSize=this._getHoverLabel(cache,i,j,context,value),
                                dy=drawnValue.barHeight-labelSize.height,
                                dx=drawnValue.barWidth-labelSize.width;
                            if(dy<5||dx<10){
                                context._showValueOnHover=true;
                                delete context._showDataValues;
                                return false;
                            }
                        }
                    }
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            var label=this._getHoverLabel(cache,i,j);
                            if(label!=null){
                                var bar=this._getDrawnValue(context,i,j);
                                if(this._drawDataValueLabelForBar(
                                        bar.drawnX,bar.drawnY,label,context.chartType,
                                        checkDataValueLabels))
                                {
                                    return true;
                                }
                            }
                        }
                    }
                }else{
                    var k=!contextIsMultiFacet?seriesIndex:null;
                    for(var j=0;j<data.length;j++){
                        var value=isExtraAxisChart?records[j][extraAxisMetric]:data[j].value;
                        if(!isc.isA.Number(value))continue;
                        var label=this._getHoverLabel(cache,j,null,context,value),
                            bar=this._getDrawnValue(context,j,k);
                        if(this._drawDataValueLabelForBar(
                                bar.drawnX,bar.drawnY,label,context.chartType,
                                checkDataValueLabels))
                        {
                            return true;
                        }
                    }
                }
                break;
            case"Doughnut":
            case"Pie":
                var radiusStep=data[0].radiusStep;
                if(radiusStep<40){
                    this._showValueOnHover=true;
                    delete this._showDataValues;
                    return;
                }
                if(this.isMultiFacet()){
                    var labelPos=radiusStep*2/3;
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            var s=data[i].series[j];
                            if(!isc.isA.Number(s.value))continue;
                            var labelSize=this._getHoverLabel(cache,i,j,context,s.value);
                            var rad=s.pieRadius-Math.max(labelPos,labelSize.width+15);
                            var angle=s.endAngle-s.startAngle;
                            if(angle<60){
                                var avgAngle=s.startAngle+angle/2,
                                    heightIsDominantFactor=avgAngle<60||(120<=avgAngle&&avgAngle<240)||300<=avgAngle;
                                if((!heightIsDominantFactor&&labelSize.width>labelMaxSize)||
                                    (heightIsDominantFactor&&labelSize.height>labelMaxSize))
                                {
                                    this._showValueOnHover=true;
                                    delete this._showDataValues;
                                    return;
                                }
                            }
                        }
                    }
                    for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].series.length;j++){
                            var s=data[i].series[j];
                            var label=this._getHoverLabel(cache,i,j);
                            if(label!=null){
                                var rad=s.pieRadius-Math.max(labelPos,label.width+15);
                                this._drawDataValueLabelForPie(s.pieX,s.pieY,s.startAngle,s.endAngle,label,rad);
                            }
                        }
                    }
                }else{
                    var doughnutSize=(this.doughnutSize==null?0:this.doughnutSize);
                    for(var j=0;j<data.length;j++){
                        var s=data[j];
                        if(!isc.isA.Number(s.value))continue;
                        var rad=s.pieRadius/2-doughnutSize,
                            angle=s.endAngle-s.startAngle,
                            labelSize=this._getHoverLabel(cache,j,null,context,s.value);
                        if(angle<60){
                            var labelMaxSize=rad*Math.tan(angle*isc.Math._radPerDeg);
                            var avgAngle=s.startAngle+angle/2,
                                heightIsDominantFactor=avgAngle<60||(120<=avgAngle&&avgAngle<240)||300<=avgAngle;
                            if((!heightIsDominantFactor&&labelSize.width>labelMaxSize)||
                                (heightIsDominantFactor&&labelSize.height>labelMaxSize))
                            {
                                this._showValueOnHover=true;
                                delete this._showDataValues;
                                return;
                            }
                        }
                    }
                    for(var j=0;j<data.length;j++){
                        var label=this._getHoverLabel(cache,j);
                        if(label!=null){
                            var s=data[j];
                            this._drawDataValueLabelForPie(s.pieX,s.pieY,s.startAngle,s.endAngle,label,data[j].pieRadius/2);
                        }
                    }
                }
                break;
        }
    }
    return false;
}
,isc.A._drawDataValueLabelForBar=function isc_FacetChart__drawDataValueLabelForBar(left,top,label,chartType,checkDataValueLabel){
    if(chartType=="Column"){
        left-=label.width/2;
        top-=label.height;
    }else{
        top-=label.height/2;
        left+=4;
    }
    var chartRectLineWidth=this.getChartRectLineWidth(),
        minLeft=0,maxRight=0,minTop=0,maxBottom=0;
    if(chartRectLineWidth==0){
        maxRight=this.getInnerContentWidth();
        maxBottom=this.getInnerContentHeight();
    }else{
        var chartRect=this.getChartRect(),
            radius=1+chartRectLineWidth/2;
        minLeft=Math.ceil(chartRect.left+radius);
        minTop=Math.ceil(chartRect.top+radius);
        maxRight=Math.floor(chartRect.left+chartRect.width-radius);
        maxBottom=Math.floor(chartRect.top+chartRect.height-radius);
    }
    if(left<minLeft){
        left=minLeft;
    }else{
        if((left+label.width)>maxRight){
            if(checkDataValueLabel&&chartType=="Bar"){
                return true;
            }
            left=maxRight-label.width-5;
        }
    }
    if(top<minTop){
        if(checkDataValueLabel&&chartType=="Column"){
            return true;
        }
        top=minTop;
    }else{
        if((top+label.height)>maxBottom){
            top=maxBottom-label.height-5;
        }
    }
    if(!checkDataValueLabel){
        this.drawLabel(left,top,label.text,this.hoverLabelProperties);
    }
    return false;
}
,isc.A._drawDataValueLabelForPoint=function isc_FacetChart__drawDataValueLabelForPoint(drawnX,drawnY,label){
    var left=drawnX-label.width/2;
    var top=drawnY-label.height-4;
    if(left<0){
        left=0;
    }else{
        var innerContentWidth=this.getInnerContentWidth();
        if((left+label.width)>innerContentWidth){
            left=innerContentWidth-label.width-5;
        }
    }
    if(top<0){
        top=0;
    }else{
        var innerContentHeight=this.getInnerContentHeight();
        if((top+label.height)>innerContentHeight){
            top=innerContentHeight-label.height-5;
        }
    }
    this.drawLabel(left,top,label.text,this.hoverLabelProperties);
}
,isc.A._drawDataValueLabelForPie=function isc_FacetChart__drawDataValueLabelForPie(left,top,startAngle,endAngle,label,prevRadius){
    var angle=(startAngle+endAngle)/2+90;
    if(angle<0){
        angle+=360;
    }
    var radialCoords=this._getRadialLabelCoordinates([left,top],prevRadius||this.maxRadius,
        angle,label.value,this.hoverLabelProperties);
    left=radialCoords[0];
    top=radialCoords[1];
    if(left<0){
        left=0;
    }else{
        var innerContentWidth=this.getInnerContentWidth();
        if((left+label.width)>innerContentWidth){
            left=innerContentWidth-label.width-5;
        }
    }
    if(top<0){
        top=0;
    }else{
        var innerContentHeight=this.getInnerContentHeight();
        if((top+label.height)>innerContentHeight){
            top=innerContentHeight-label.height-5;
        }
    }
    this.drawLabel(left,top,label.text,this.hoverLabelProperties);
}
,isc.A.drawBar=function isc_FacetChart_drawBar(vertical,start,base,thickness,length,props,context){
    if(!vertical){
        return this.drawBar(!vertical,base,start,length,thickness,props,context);
    }
    props.click=this._clickShape;
    return this.drawRect(
        start,(length>0?base:base+length),thickness,Math.abs(length),props,context);
}
,isc.A.drawRect=function isc_FacetChart_drawRect(left,top,width,height,props,context){
    var rect=isc.DrawRect.create(props,{
            autoDraw:true,
            drawPane:this,
            left:left,
            top:top,
            width:width,
            height:height,
            shadow:(this._showShadows(context)?props.shadow:null)
    });
    return rect;
}
,isc.A.drawDataSeriesLine=function isc_FacetChart_drawDataSeriesLine(points,seriesNum){
    this.drawDataLine(points,{lineColor:this._getDataColor(seriesNum)},this);
}
,isc.A._drawDataShape=function isc_FacetChart__drawDataShape(points,props,connected,autoDraw,context){
    var drawItemClass=(connected?"DrawPolygon":"DrawPath"),
        defaultProps=this.dataShapeProperties;
    if(!this._showShadows(context)){
        defaultProps.shadow=null;
    }
    return isc[drawItemClass].create(defaultProps,props,{
        drawPane:this,
        points:points,
        autoDraw:autoDraw
    });
}
,isc.A.drawDataLine=function isc_FacetChart_drawDataLine(points,props,context){
    var smooth=(this._getDataLineType(context)=="smooth");
    if(!this._getDiscontinuousLines(context)){
        var cleanPoints=[];
        for(var i=0;i<points.length;i++){
            if(!isNaN(points[i][1])){
                cleanPoints.add(points[i]);
            }
        }
        this.drawDataLineSegment(cleanPoints,0,cleanPoints.length,props,context,smooth,true);
        return;
    }
    var lineStart=null;
    for(var i=0;i<points.length;i++){
        var point=points[i];
        if(isNaN(point[1])){
            if(lineStart!=null){
                this.drawDataLineSegment(points,lineStart,i,props,context,smooth,true);
                lineStart=null;
            }
        }else if(lineStart==null){
            lineStart=i;
        }
    }
    if(lineStart!=null){
        this.drawDataLineSegment(points,lineStart,points.length,props,context,smooth,true);
    }
}
,isc.A.drawDataLineSegment=function isc_FacetChart_drawDataLineSegment(points,startIndex,endIndex,props,context,smooth,autoDraw){
    context=context||this;
    var defaultProps=this.isFilled(context)?context.dataOutlineProperties:context.dataLineProperties;
    if(!this._showShadows(context)){
        defaultProps.shadow=null;
    }
    var numPoints=endIndex-startIndex,
        usePoint=(numPoints==1),
        useLines=(!usePoint&&(!smooth||numPoints<=2)),
        useSpline=!(usePoint||useLines);
    var epsilon=1e-9,
        indices,
        sqrts;
    if(useSpline){
        indices=[startIndex];
        sqrts=[];
        for(var i=startIndex;i<endIndex-1;){
            var j=i+1,
                sqrtDistance=0;
            for(;j<endIndex;++j){
                var p0=points[i],
                    p1=points[j],
                    distance=isc.Math._hypot(p1[0]-p0[0],p1[1]-p0[1]);
                sqrtDistance=Math.sqrt(distance);
                if(sqrtDistance>epsilon){
                    break;
                }
            }
            if(j<endIndex){
                indices.push(j);
                sqrts.push(sqrtDistance);
            }
            i=j;
        }
    }
    usePoint=usePoint||(useSpline&&indices.length==1);
    useLines=useLines||(useSpline&&indices.length==2);
    useSpline=!(usePoint||useLines);
    if(usePoint){
        return isc.DrawTriangle.create(defaultProps,props,{
            drawPane:this,
            points:this.getTriangleOnPoint(points[startIndex],this.singlePointMarkerSize),
            autoDraw:autoDraw,
            fillColor:(props&&props.lineColor)||defaultProps.lineColor
        });
    }else if(useLines){
        var dpConfig={
            drawPane:this,
            points:points.slice(startIndex,endIndex),
            autoDraw:autoDraw
        };
        if(context.chartType=="Line"||
            (context.chartType=="Area"&&!this.isFilled(context)))
        {
            dpConfig.svgFilter="isc_ds1";
        }
        return isc.DrawPath.create(defaultProps,props,dpConfig);
    }else{
        var n=indices.length,
            additionalPoint0=[
                2*points[indices[0]][0]-points[indices[1]][0],
                2*points[indices[0]][1]-points[indices[1]][1]],
            additionalPoint1=[
                2*points[indices[n-1]][0]-points[indices[n-2]][0],
                2*points[indices[n-1]][1]-points[indices[n-2]][1]];
        sqrts.unshift(sqrts[0]);
        sqrts.push(sqrts[sqrts.length-1]);
        var drawCurve;
        for(var i=0;i<n-1;++i){
            var pn1=(i==0?additionalPoint0:points[indices[i-1]]),
                p0=points[indices[i]],
                p1=points[indices[i+1]],
                p2=(i==n-2?additionalPoint1:points[indices[i+2]]),
                sqrtD1=sqrts[i],
                sqrtD2=sqrts[i+1],
                sqrtD3=sqrts[i+2],
                d1=sqrtD1*sqrtD1,
                d2=sqrtD2*sqrtD2,
                d3=sqrtD3*sqrtD3,
                scalar1=(2*d1+3*sqrtD1*sqrtD2+d2),
                scalar2=(2*d3+3*sqrtD3*sqrtD2+d2),
                cp1Denom=3*sqrtD1*(sqrtD1+sqrtD2),
                cp2Denom=3*sqrtD3*(sqrtD3+sqrtD2),
                cp1x=(d1*p1[0]-d2*pn1[0]+scalar1*p0[0])/cp1Denom,
                cp1y=(d1*p1[1]-d2*pn1[1]+scalar1*p0[1])/cp1Denom,
                cp2x=(d3*p0[0]-d2*p2[0]+scalar2*p1[0])/cp2Denom,
                cp2y=(d3*p0[1]-d2*p2[1]+scalar2*p1[1])/cp2Denom;
            drawCurve=isc.DrawCurve.create(defaultProps,props,{
                drawPane:this,
                autoDraw:autoDraw,
                startPoint:p0,
                controlPoint1:[cp1x,cp1y],
                controlPoint2:[cp2x,cp2y],
                endPoint:p1
            });
        }
        return drawCurve;
    }
}
);
isc.evalBoundary;isc.B.push(isc.A.drawValueLine=function isc_FacetChart_drawValueLine(startPoint,endPoint,props){
    var lineProps={drawPane:this,autoDraw:true};
    if(startPoint!=null){
        lineProps.startLeft=startPoint[0];
        lineProps.startTop=startPoint[1];
    }
    if(endPoint!=null){
        lineProps.endLeft=endPoint[0];
        lineProps.endTop=endPoint[1];
    }
    isc.DrawLine.create(this.valueLineProperties,props,lineProps);
}
,isc.A.drawPieData=function isc_FacetChart_drawPieData(){
    var rect=this.getChartRect(),
        centerPoint=this.getChartCenter(),
        radius=Math.min(rect.width,rect.height)/2-(this.getChartRectLineWidth()*2),
        data=this.getOrderedData(),
        doughnutSize=(this.shouldShowDoughnut()?(radius*this.doughnutRatio):0);
    var labelHeight=20;
    if(this.isMultiFacet()){
        var numSeries=data.length;
        if(this.stacked){
            radius=this.getChartRadius();
        }
        var totalRingsRadius=radius-doughnutSize,
            radiusStep=totalRingsRadius/numSeries,
            anglePerSeries=360/numSeries;
        data[0].radiusStep=radiusStep;
        var piesPerRow=Math.ceil(Math.sqrt((rect.width/rect.height)*numSeries)),
            numRows=Math.ceil(numSeries/piesPerRow),
            lastRowPies=numSeries%piesPerRow==0?piesPerRow:numSeries%piesPerRow;
        if(lastRowPies<piesPerRow&&(numRows-1)<=(piesPerRow-1-lastRowPies)){
            piesPerRow-=1;
            lastRowPies+=(numRows-1);
        }
        var pieSpace=Math.min(rect.width/piesPerRow,rect.height/numRows),
            pieRadius=(pieSpace-labelHeight)/2,
            rowOffset=(rect.width-(piesPerRow*pieSpace))/2,
            lastRowOffset=(rect.width-(lastRowPies*pieSpace))/2;
        for(var i=0;i<numSeries;i++){
            var series=data[i].series,
                seriesTitle=data[i].title,
                values=new Array(series.length),
                total=0;
            var facetValue={
                id:data[i].facetValueId,
                title:data[i].title
            };
            for(var j=series.length;j--;){
                var value=series[j].value;
                if(!isc.isA.Number(value))value=0;
                values[j]=value;
                total+=value;
            }
            if(this.stacked){
                var seriesRadius=radius-(radiusStep*i);
                this.drawPieSeries(values,total,centerPoint,seriesRadius,i,(i!=0));
                var labelAngle=this.pieLabelAngleStart+(anglePerSeries*i);
                this.drawRadialLabel(centerPoint,radius+this.pieLabelLineExtent,
                                     labelAngle,seriesTitle,facetValue);
                var innerPoint=isc.GraphMath.polar2screen(labelAngle,
                                                            seriesRadius-(radiusStep/2),
                                                            centerPoint,true),
                    outerPoint=isc.GraphMath.polar2screen(labelAngle,radius+this.pieLabelLineExtent,
                                                            centerPoint,true);
                this.drawValueLine(innerPoint,outerPoint,this.pieLabelLineProperties);
            }else{
                var currentRow=Math.floor(i/piesPerRow);
                var top=rect.top+(currentRow*pieSpace);
                var left=rect.left+((i%piesPerRow)*pieSpace);
                if(currentRow==numRows-1)left+=lastRowOffset;
                else left+=rowOffset;
                var pieCenter=[left+(labelHeight/2)+pieRadius,
                                 top+labelHeight+pieRadius];
                this.drawPieSeries(values,total,pieCenter,pieRadius,i);
                if(this.shouldShowDoughnut()){
                    isc.DrawOval.create({
                        shadow:(this._showShadows(this)?
                            {blur:5,color:"#333333",offset:[0,0]}:null)
                    },this.doughnutHoleProperties,{
                        drawPane:this,
                        autoDraw:true,
                        centerPoint:pieCenter,
                        radius:pieRadius*this.doughnutRatio
                    });
                }
                var labelSize=this.measureLabel(seriesTitle,this.dataLabelProperties);
                var label=this.drawLabel(left+(pieSpace/2)-(labelSize.width/2),
                               top+(labelHeight/2)-(labelSize.height/2),
                               seriesTitle,this.dataLabelProperties);
                this._processDataLabelActions(label,facetValue);
            }
        }
    }else{
        var values=new Array(data.length),
            total=0;
        for(var j=data.length;j--;){
            var value=data[j].value;
            if(!isc.isA.Number(value))value=0;
            values[j]=value;
            total+=value;
        }
        this.drawPieSeries(values,total,centerPoint,radius,0,false);
    }
    if(this.shouldShowDoughnut()&&(!this.isMultiFacet()||this.stacked)){
        isc.DrawOval.create({
            shadow:(this._showShadows(this)?
                {blur:5,color:"#333333",offset:[0,0]}:null)
        },this.doughnutHoleProperties,{
            drawPane:this,
            autoDraw:true,
            centerPoint:centerPoint,
            radius:doughnutSize
        });
    }
}
,isc.A.drawPieSeries=function isc_FacetChart_drawPieSeries(values,total,centerPoint,radius,dataIndex,innerRing){
    if(this._showShadows(this)&&!innerRing){
        isc.DrawOval.create({
            shadow:{blur:8,color:"#111111",offset:[2,2]}
        },this.pieBorderProperties,this.shadowProperties,{
            drawPane:this,
            autoDraw:true,
            centerPoint:centerPoint,
            radius:radius-1
        });
    }
    if(this.showValueOnHover||this._showValueOnHover||this._showDataValues){
        isc.DrawOval.create({
            fillColor:"#ffffff"
        },this.pieBorderProperties,{
            drawPane:this,
            autoDraw:true,
            centerPoint:centerPoint,
            radius:radius-1
        });
    }
    var startAngle=this.pieStartAngle;
    this.logDebug("startAngle is: "+startAngle);
    var orderedData=this.getOrderedData();
    for(var i=0;i<values.length;i++){
        var value=values[i],
            sectorAngle=(total!=0?360*value/total:0),
            sectorStartAngle=Math.floor(startAngle),
            sectorEndAngle=Math.ceil(startAngle+sectorAngle);
        var series=(orderedData[dataIndex].series==null?orderedData[i]:orderedData[dataIndex].series[i]);
        series.pieX=centerPoint[0];
        series.pieY=centerPoint[1];
        series.startAngle=sectorStartAngle;
        series.endAngle=sectorEndAngle;
        series.pieRadius=radius;
        if(value==0){
            continue;
        }
        var sectorConfig={
            drawPane:this,
            autoDraw:true,
            centerPoint:centerPoint,
            radius:radius,
            startAngle:sectorStartAngle,
            endAngle:sectorEndAngle,
            fillColor:!this.useAutoGradients?this._getDataColor(i):null,
            fillGradient:this.useAutoGradients?this._getPieSeriesGradient(i,centerPoint,radius):null,
            click:this._clickShape
        };
        if(this.useAutoGradients&&this.drawingType!="svg"){
            sectorConfig.svgFillGradient=this._getPieSeriesGradient(i,centerPoint,radius,false,"svg");
        }
        var sector=isc._PieSeriesSector.create(this.pieSliceProperties,sectorConfig);
        series.drawItemId=sector.ID;
        startAngle+=sectorAngle;
    }
    if(innerRing){
        isc.DrawOval.create(innerRing?this.pieRingBorderProperties:this.pieBorderProperties,{
            drawPane:this,
            autoDraw:true,
            centerPoint:centerPoint,
            radius:radius,
            isPointInPath:function(){
                return false;
            }
        });
    }
}
,isc.A.getYAxisMetric=function isc_FacetChart_getYAxisMetric(){
    return this.yAxisMetric||this.metricFacet.values[0].id;
}
,isc.A.getXAxisMetric=function isc_FacetChart_getXAxisMetric(){
    return this.xAxisMetric||this.metricFacet.values[1].id;
}
,isc.A.getSecondGradations=function isc_FacetChart_getSecondGradations(){
    if(this._secondGradations)return this._secondGradations;
    var availableWidth=Math.max(150,
                                  this.getInnerContentWidth()-(2*this.chartRectMargin)-300);
    return this._getGradations(true,false,availableWidth);
}
,isc.A.drawScatterData=function isc_FacetChart_drawScatterData(rotateXLabels){
    var xMin=this._secondAxisStartValue,
        xMax=this._secondAxisEndValue,
        yMin=this._axisStartValue,
        yMax=this._axisEndValue;
    if(xMin==null||xMax==null||yMin==null||yMax==null){
        return;
    }
    var hGradations=this.getSecondGradations();
    this._drawGradations(false,hGradations,xMin,xMax);
    if(!this.showStatisticsOverData){
        this._drawStatistics();
    }
    var hGradationLabels=this._dataLabels;
    for(var i=hGradations.length;i--;){
        var left=this._getXCoord(hGradations[i],xMin,xMax,false);
        this.drawDataLabel(left,hGradationLabels[i],true,rotateXLabels);
    }
    var data=this.getOrderedData(),
        legendFacet=this.getLegendFacet();
    if(legendFacet==null){
        this.drawScatterSeries(data,0,xMin,xMax,yMin,yMax);
    }else{
        for(var i=0;i<legendFacet.values.length;i++){
            this.drawScatterSeries(data[i].series,i,xMin,xMax,yMin,yMax);
        }
    }
}
,isc.A.drawScatterSeries=function isc_FacetChart_drawScatterSeries(series,seriesNum,xMin,xMax,yMin,yMax){
    var rect=this.getChartRect(),
        xMetric=this.getXAxisMetric(),
        yMetric=this.getYAxisMetric(),
        points=[],
        yValues=[],
        outOfBoundsPoint=[NaN,NaN];
    for(var i=0;i<series.length;i++){
        var record=series[i].record;
        if(record!=null){
            var xValue=record[xMetric],
                yValue=record[yMetric];
            if(xValue<xMin||yValue<yMin){
                points.add(outOfBoundsPoint);
            }else{
                var xOffset=this._getXCoord(xValue,xMin,xMax,false),
                    yOffset=this.getYCoord(yValue);
                series[i].drawnX=xOffset;
                series[i].drawnY=yOffset;
                points.add([xOffset,yOffset]);
            }
            yValues.add(yValue);
        }else{
            points.add(outOfBoundsPoint);
            yValues.add(null);
        }
    }
    if(this.showScatterLines){
        this.drawDataSeriesLine(points,seriesNum);
    }
    this.drawPoints(points,series.getProperty("record"),seriesNum,yValues);
    if(this._getLowErrorMetric()!=null){
        this._drawErrorBars(points,series.getProperty("record"),seriesNum,rect);
    }
}
,isc.A._getProbabilityMetric=function isc_FacetChart__getProbabilityMetric(){
    var pm=this.probabilityMetric,mf=this.metricFacet;
    return(pm!=null&&mf!=null&&mf.values.findIndex("id",pm)!=-1?pm:null);
}
,isc.A._getStatCache=function isc_FacetChart__getStatCache(criteria){
    if(criteria==null){
        criteria=this.getDefaultMetric();
    }
    if(isc.isA.String(criteria)&&this.metricFacet!=null&&this.metricFacet.values.findIndex("id",criteria)!=-1){
        var metric=criteria;
        criteria={};
        criteria[this.metricFacet.id]=metric;
    }else{
        criteria={};
    }
    var facetIds=this._facetIds||(this._facetIds=this._getFacets().getProperty("id"));
    var sb=isc.StringBuffer.newInstance();
    for(var i=0,len=facetIds.length;i<len;++i){
        var facetId=facetIds[i];
        if(criteria[facetId]!=null){
            sb.append(facetId,"=",criteria[facetId].toString(),";");
        }
    }
    var cache=this._statCache||(this._statCache={}),
        key=sb.toString();
    if(cache[key]==null){
        cache[key]={
            criteria:criteria
        };
    }
    return cache[key];
}
,isc.A._getDataArray=function isc_FacetChart__getDataArray(criteria,cache){
    var data=(cache.data||(cache.data=this.getValue(cache.criteria,true)));
    return data;
}
,isc.A._getProbabilities=function isc_FacetChart__getProbabilities(criteria,cache,probMetric){
    if(cache.probabilities!=null){
        return cache.probabilities;
    }
    criteria=cache.criteria;
    var c=isc.addProperties({},criteria);
    c[this.metricFacet.id]=probMetric;
    var probabilities=this.getValue(c,true);
    var n=probabilities.length,
    sum=0;
    for(var i=n;i--;){
        var p=probabilities[i];
        if(!(isc.isA.Number(p)&&p>=0)){
            probabilities[i]=0;
        }else{
            sum+=p;
        }
    }
    if(sum!=1){
        if(sum==0){
            var uniformProbability=1/n;
            for(var i=n;i--;){
                probabilities[i]=uniformProbability;
            }
        }else{
            for(var i=n;i--;){
                probabilities[i]/=sum;
            }
        }
    }
    return(cache.probabilities=probabilities);
}
,isc.A._getSortedDataIndex=function isc_FacetChart__getSortedDataIndex(criteria){
    var cache=this._getStatCache(criteria);
    if(cache.sortedDataIndex!=null){
        return cache.sortedDataIndex;
    }else{
        var data=this._getDataArray(criteria,cache);
        var index=new Array(data.length);
        for(var i=data.length;i--;){
            index[i]=i;
        }
        index.sort(function(i,j){
            return data[i]-data[j];
        });
        return(cache.sortedDataIndex=index);
    }
}
,isc.A.getNumDataPoints=function isc_FacetChart_getNumDataPoints(criteria){
    var cache=this._getStatCache(criteria),
        data=this._getDataArray(criteria,cache);
    return(data==null?null:data.length);
}
,isc.A.getMean=function isc_FacetChart_getMean(criteria){
    var cache=this._getStatCache(criteria);
    if(cache.mean!=null){
        return cache.mean;
    }
    var data=this._getDataArray(criteria,cache),
        mean=null;
    if(data!=null){
        var probMetric=this._getProbabilityMetric();
        if(probMetric==null){
            mean=isc.Chart._mean(data);
        }else{
            var probabilities=this._getProbabilities(criteria,cache,probMetric);
            mean=0;
            for(var i=data.length;i--;){
                mean+=data[i]*probabilities[i];
            }
        }
    }
    return(cache.mean=mean);
}
,isc.A._numberSortOrder=function isc_FacetChart__numberSortOrder(a,b){return a-b;}
,isc.A.getMedian=function isc_FacetChart_getMedian(criteria){
    return this.getPercentile(criteria,50);
}
,isc.A.getPercentile=function isc_FacetChart_getPercentile(criteria,percentile){
    if(!isc.isA.Number(percentile)){
        return null;
    }
    percentile=Math.max(0,Math.min(100,percentile));
    var statCacheKey="percentile("+percentile+")";
    percentile/=100;
    var cache=this._getStatCache(criteria);
    if(cache[statCacheKey]!=null){
        return cache[statCacheKey];
    }
    var data=this._getDataArray(criteria,cache);
    if(data==null){
        return null;
    }
    var probMetric=this._getProbabilityMetric(),
        len=data.length;
    var i,j,valuei,valuej;
    if(probMetric==null){
        var sortedData=cache.sortedData||(cache.sortedData=data.sort(this._numberSortOrder));
        i=Math.floor(percentile*(len-1));
        j=Math.ceil(percentile*(len-1));
        valuei=sortedData[i];
        valuej=sortedData[j];
    }else{
        var index=this._getSortedDataIndex(criteria),
            probabilities=this._getProbabilities(criteria,cache,probMetric),
            sum=0;
        for(j=0;j<len&&sum<percentile;++j){
            sum+=probabilities[index[j]];
        }
        --j;
        valuej=data[index[j]];
        for(i=j;i<len&&probabilities[index[i]]==0;){
            ++i;
        }
        if(i==len)--i;
        for(sum=1-sum;i>=0&&sum<1-percentile;--i){
            sum+=probabilities[index[i]];
        }
        ++i;
        valuei=data[index[i]];
    }
    return(cache[statCacheKey]=(valuei+valuej)/2);
}
,isc.A.getRange=function isc_FacetChart_getRange(criteria){
    var max=this.getMax(criteria),
        min=this.getMin(criteria);
    return(max==null||min==null?null:(max-min));
}
,isc.A.getStdDev=function isc_FacetChart_getStdDev(criteria,population){
    var sigmaSq=this.getVariance(criteria,population);
    return(sigmaSq==null?null:Math.sqrt(sigmaSq));
}
,isc.A.getVariance=function isc_FacetChart_getVariance(criteria,population){
    var cache=this._getStatCache(criteria),
        thisStat=(population?"population":"sample")+"Variance",
        otherStat=(!population?"population":"sample")+"Variance";
    if(cache[thisStat]!=null){
        return cache[thisStat];
    }else if(cache[otherStat]!=null){
        var n=cache.data.length;
        return(cache[thisStat]=cache[otherStat]*(population?(n-1)/n:n/(n-1)));
    }
    var data=this._getDataArray(criteria,cache);
    if(data==null){
        return null;
    }
    var probMetric=this._getProbabilityMetric(),
        mean=this.getMean(criteria),
        n=data.length,
        variance;
    if(probMetric==null){
        variance=isc.Chart._variance(data,population,mean);
    }else{
        var probabilities=this._getProbabilities(criteria,cache,probMetric);
        var meanSq=0;
        for(var i=data.length;i--;){
            var t=data[i];
            meanSq+=t*t*probabilities[i];
        }
        variance=meanSq-mean*mean;
        if(!population){
            variance*=n/(n-1);
        }
    }
    return(cache[thisStat]=variance);
}
,isc.A.getMax=function isc_FacetChart_getMax(criteria){
    var cache=this._getStatCache(criteria);
    if(cache.max!=null){
        return cache.max;
    }else if(cache.sortedData!=null){
        return(cache.max=cache.sortedData.last());
    }else{
        var data=this._getDataArray(criteria,cache);
        return(data==null?null:(cache.max=data.max()));
    }
}
,isc.A.getMin=function isc_FacetChart_getMin(criteria){
    var cache=this._getStatCache(criteria);
    if(cache.min!=null){
        return cache.min;
    }else if(cache.sortedData!=null){
        return(cache.min=cache.sortedData.first());
    }else{
        var data=this._getDataArray(criteria,cache);
        return(data==null?null:(cache.min=data.min()));
    }
}
,isc.A.setRegressionLineType=function isc_FacetChart_setRegressionLineType(regressionLineType){
    var valid=(regressionLineType=="line"||regressionLineType=="polynomial");
    if(valid){
        var changed=(regressionLineType!=this.regressionLineType);
        this.regressionLineType=regressionLineType;
        if(changed&&this.showRegressionLine&&this.regressionPolynomialDegree!=1){
            this._redrawFacetChart(false);
        }
    }
}
,isc.A.setShowRegressionLine=function isc_FacetChart_setShowRegressionLine(showRegressionLine){
    var changed=(showRegressionLine!=this.showRegressionLine);
    this.showRegressionLine=showRegressionLine;
    if(changed){
        this._redrawFacetChart(false);
    }
}
,isc.A.setRegressionPolynomialDegree=function isc_FacetChart_setRegressionPolynomialDegree(regressionPolynomialDegree){
    var valid=this._isDegreeValid(regressionPolynomialDegree);
    if(valid){
        var changed=(regressionPolynomialDegree!=this.regressionPolynomialDegree);
        this.regressionPolynomialDegree=regressionPolynomialDegree;
        if(changed&&this.showRegressionLine&&this.regressionLineType=="polynomial"){
            this._redrawFacetChart(false);
        }
    }
}
,isc.A._isDegreeValid=function isc_FacetChart__isDegreeValid(degree){
    return(isc.isA.Number(degree)&&degree>0&&degree==Math.round(degree));
}
,isc.A.getSimpleLinearRegressionFunction=function isc_FacetChart_getSimpleLinearRegressionFunction(xMetric,yMetric){
    return this.getPolynomialRegressionFunction(
            1,xMetric,yMetric,"FacetChart.getSimpleLinearRegressionFunction()");
}
,isc.A._validatePolynomialDegree=function isc_FacetChart__validatePolynomialDegree(degree){
    return isc.isA.Number(degree)&&degree>0&&Math.round(degree)===degree;
}
,isc.A.getPolynomialRegressionFunction=function isc_FacetChart_getPolynomialRegressionFunction(degree,xMetric,yMetric,callee){
    callee=isc.isA.String(callee)?callee:"FacetChart.getPolynomialRegressionFunction()";
    if(!this._validatePolynomialDegree(degree)){
        if(degree!=null){
            this.logWarn("Invalid degree argument passed to "+callee+".  "+
                "The degree must be a positive integer.");
        }
        degree=this.regressionPolynomialDegree;
        if(!this._validatePolynomialDegree(degree)){
            this.logWarn("The regressionPolynomialDegree property of the FacetChart is invalid.  "+
                "The degree must be a positive integer.");
            return null;
        }
    }
    var metricFacetId=this.metricFacet.id,
        xfv,yfv;
    if(!(isc.isA.String(xMetric)&&(xfv=this.getFacetValue(metricFacetId,xMetric)))){
        if(xMetric!=null){
            this.logWarn("Invalid xMetric argument passed to "+callee+".  "+
                "The xMetric must be the String ID of a metric facet value.");
        }
        xMetric=this.getXAxisMetric();
        if(!(isc.isA.String(xMetric)&&(xfv=this.getFacetValue(metricFacetId,xMetric)))){
            this.logWarn("Could not find an x-axis metric defined for the FacetChart.");
            return null;
        }
    }
    if(!(isc.isA.String(yMetric)&&(yfv=this.getFacetValue(metricFacetId,yMetric)))){
        if(yMetric!=null){
            this.logWarn("Invalid yMetric argument passed to "+callee+".  "+
                "The yMetric must be the String ID of a metric facet value.");
        }
        yMetric=this.getYAxisMetric();
        if(!(isc.isA.String(yMetric)&&(yfv=this.getFacetValue(metricFacetId,yMetric)))){
            this.logWarn("Could not find a y-axis metric defined for the FacetChart.");
            return null;
        }
    }
    var xCriteria={},yCriteria={};
    xCriteria[metricFacetId]=xfv.id;
    yCriteria[metricFacetId]=yfv.id;
    return isc.FacetChart._calculateBestFitPolynomial(degree,
            this.getValue(xCriteria,true),
            this.getValue(yCriteria,true));
}
,isc.A._drawStatistics=function isc_FacetChart__drawStatistics(criteria,vertical){
    if(this.isPieChart()){
        return;
    }
    if(this.isMultiFacet()&&this.isStacked()){
        return;
    }
    var radar=this.chartType=="Radar";
    var m;
    if(criteria&&this.metricFacet&&
        criteria[this.metricFacet.id]&&
        this.metricFacet.findIndex("id",criteria[this.metricFacet.id])!=-1)
    {
        m=criteria[this.metricFacet.id];
    }else{
        m=this.getDefaultMetric();
    }
    if(vertical==null){
        if(this.chartType=="Scatter"){
            if(m==this.getXAxisMetric())vertical=false;
            else if(m==this.getYAxisMetric())vertical=true;
        }else if(radar){
            if(m==this.valueProperty)vertical=false;
        }else if(this.hasXGradations()){
            if(m==this.valueProperty)vertical=false;
        }else if(this.hasYGradations()){
            if(m==this.valueProperty)vertical=true;
        }
    }
    if(vertical==null){
        return;
    }
    var chartRect=this.getChartRect();
    var top=chartRect.top,
        left=chartRect.left,
        width=chartRect.width,
        height=chartRect.height,
        bottom=top+height,
        right=left+width;
    var center,maxRadius;
    if(radar){
        center=this.getChartCenter();
        maxRadius=this.getChartRadius();
    }
    var xMin,xMax;
    if(this.chartType=="Scatter"){
        var xMetric=this.getXAxisMetric();
        xMin=Math.min(0,this.getMinValue(xMetric));
        xMax=this.getMaxValue(xMetric);
    }
    if(radar&&vertical){
        return;
    }
    var showExpectedValueLine=this.showExpectedValueLine,
        showStandardDeviationLines=this.showStandardDeviationLines&&isc.isAn.Array(this.standardDeviations),
        meanValue=null,
        stdDevValue=null;
    if(showExpectedValueLine||showStandardDeviationLines){
        meanValue=this.getMean(criteria);
        if(showStandardDeviationLines){
            stdDevValue=this.getStdDev(criteria);
        }
        if(meanValue==null){
            showExpectedValueLine=showStandardDeviationLines=false;
        }
        if(stdDevValue==null){
            showStandardDeviationLines=false;
        }
    }
    if(showStandardDeviationLines){
        var stdDevs=this.standardDeviations,
            numStdDevs=stdDevs.length,
            symmetric=this.useSymmetricStandardDeviations,
            bandPropsList=this.standardDeviationBandProperties;
        if(symmetric){
            stdDevs=stdDevs.map(Math.abs);
            var hasZero=(stdDevs.first()===0),
                offset=hasZero?1:0,
                bandPropsListLen=numStdDevs-offset,
                fullStdDevsLen=2*(numStdDevs-offset)+offset,
                fullStdDevs=new Array(fullStdDevsLen),
                fullBandPropsListLen=2*bandPropsListLen-1,
                fullBandPropsList=new Array(fullBandPropsListLen);
            for(var i=numStdDevs-offset;i--;){
                var j=i+offset;
                fullStdDevs[j]=-(fullStdDevs[fullStdDevsLen-1-j]=stdDevs[numStdDevs-1-i]);
                fullBandPropsList[i]=fullBandPropsList[fullBandPropsListLen-1-i]=bandPropsList[bandPropsListLen-1-i];
            }
            if(hasZero){
                fullStdDevs[numStdDevs]=0;
            }
            numStdDevs=fullStdDevsLen;
            stdDevs=fullStdDevs;
            bandPropsList=fullBandPropsList;
        }
        if(this.bandedStandardDeviations&&!radar&&numStdDevs>1){
            var prevValue,
                value=meanValue+stdDevValue*stdDevs[0],
                prevCoord,
                coord;
            if(vertical){
                coord=this.getYCoord(value);
                coord=Math.max(top,Math.min(bottom,coord));
            }else{
                coord=this._getXCoord(value,xMin,xMax);
                coord=Math.max(left,Math.min(right,coord));
            }
            for(var i=1;i<numStdDevs;++i){
                prevValue=value;
                value=meanValue+stdDevValue*stdDevs[i];
                prevCoord=coord;
                var t=top,l=left,w=width,h=height;
                if(vertical){
                    coord=this.getYCoord(value);
                    coord=Math.max(top,Math.min(bottom,coord));
                    t=prevCoord;
                    h=coord-t;
                }else{
                    coord=this._getXCoord(value,xMin,xMax);
                    coord=Math.max(left,Math.min(right,coord));
                    l=prevCoord;
                    w=coord-l;
                }
                var bandProps=bandPropsList[i-1];
                if(bandProps==null){
                    continue;
                }
                this.addDrawItem(isc.DrawRect.create(bandProps,{
                    autoDraw:true,
                    top:t,
                    left:l,
                    width:w,
                    height:h
                }));
            }
        }
        for(var i=0;i<numStdDevs;++i){
            var stdDev=stdDevs[i],value=meanValue+stdDevValue*stdDev;
            if(stdDev==0&&showExpectedValueLine){
                continue;
            }
            if(radar&&!vertical){
                var ratio=this.getValueRatio(value);
                if(!(ratio<0||ratio>1)){
                    this.addDrawItem(isc.DrawOval.create(this.standardDeviationLineProperties,{
                        autoDraw:true,
                        centerPoint:center,
                        radius:ratio*maxRadius
                    }));
                }
            }else if(vertical){
                var y=this.getYCoord(value);
                if(!(y<top||y>bottom)){
                    this.addDrawItem(isc.DrawLine.create(this.standardDeviationLineProperties,{
                        autoDraw:true,
                        startLeft:left,
                        startTop:y,
                        endLeft:right,
                        endTop:y
                    }));
                }
            }else{
                var x=this._getXCoord(value,xMin,xMax);
                if(!(y<left||y>right)){
                    this.addDrawItem(isc.DrawLine.create(this.standardDeviationLineProperties,{
                        autoDraw:true,
                        startLeft:x,
                        startTop:top,
                        endLeft:x,
                        endTop:bottom
                    }));
                }
            }
        }
    }
    if(showExpectedValueLine){
        if(radar&&!vertical){
            var ratio=this.getValueRatio(meanValue);
            if(!(ratio<0||ratio>1)){
                this.addDrawItem(isc.DrawOval.create(this.expectedValueLineProperties,{
                    autoDraw:true,
                    centerPoint:center,
                    radius:ratio*maxRadius
                }));
            }
        }else if(vertical){
            var y=this.getYCoord(meanValue);
            if(!(y<top||y>bottom)){
                this.addDrawItem(isc.DrawLine.create(this.expectedValueLineProperties,{
                    autoDraw:true,
                    startLeft:left,
                    startTop:y,
                    endLeft:right,
                    endTop:y
                }));
            }
        }else{
            var x=this._getXCoord(meanValue,xMin,xMax);
            if(!(x<left||x>right)){
                this.addDrawItem(isc.DrawLine.create(this.expectedValueLineProperties,{
                    autoDraw:true,
                    startLeft:x,
                    startTop:top,
                    endLeft:x,
                    endTop:bottom
                }));
            }
        }
    }
    this._drawRegressionCurves();
}
,isc.A._drawRegressionCurves=function isc_FacetChart__drawRegressionCurves(){
    if(this.chartType!="Scatter"){
        return;
    }else if(this.showRegressionLine){
        if(this.regressionLineType=="line"){
            var line=this.getSimpleLinearRegressionFunction();
            if(line!=null){
                this._drawPolynomial(line,1,this.regressionLineProperties);
            }
        }else if(this.regressionLineType=="polynomial"){
            var degree=this.regressionPolynomialDegree,
                polynomial=this.getPolynomialRegressionFunction(degree);
            if(polynomial!=null){
                this._drawPolynomial(polynomial,degree,this.regressionLineProperties);
            }
        }
    }
}
,isc.A._drawPolynomial=function isc_FacetChart__drawPolynomial(polynomial,degree,lineProps){
    var chartRect=this.getChartRect(),
        secondGradations=this.getSecondGradations(),
        xMin=this._secondAxisStartValue,
        xMax=this._secondAxisEndValue,
        xRange=xMax-xMin,
        gradations=this.getGradations(),
        yMin=this._axisStartValue,
        yMax=this._axisEndValue,
        n;
    if(degree==1){
        n=2;
    }else{
        n=Math.ceil(chartRect.width/5);
    }
    var points=new Array(n);
    for(var i=n;i--;){
        var x=xMin+i*xRange/(n-1),
            xCoord=this._getXCoord(x,xMin,xMax),
            yCoord=this.getYCoord(polynomial(x));
        points[i]=[xCoord,yCoord];
    }
    var round=!this.supportsFractionalCoordinates(),
        drawPaths=isc.FacetChart._clipDrawPathToRect(points,chartRect,round),
        numDrawPaths=drawPaths.length;
    if(degree==1){
        var startPoint=drawPaths[0][0],
            endPoint=drawPaths[0][1];
        this.addDrawItem(isc.DrawLine.create(lineProps,{
            autoDraw:true,
            startLeft:startPoint[0],
            startTop:startPoint[1],
            endLeft:endPoint[0],
            endTop:endPoint[1]
        }));
    }else{
        for(var i=0;i<numDrawPaths;++i){
            this.addDrawItem(isc.DrawPath.create(lineProps,{
                autoDraw:true,
                points:drawPaths[i]
            }));
        }
    }
}
,isc.A.drawDataPoint=function isc_FacetChart_drawDataPoint(point,series,size,record,value,context,interactivePoints,autoDraw){
    context=context||this;
    interactivePoints=interactivePoints!=null?interactivePoints:this.interactivePoints;
    if(isNaN(point[1]))return;
    var color=this._getDataColor(series,context),
        useMultiplePointShapes=this._getUseMultiplePointShapes(),
        shape=this.pointShapes[(
            useMultiplePointShapes?(series%this.pointShapes.length):0)];
    size=size||context.dataPointSize;
    var shape=isc.DrawOval.create({
        lineColor:color,
        fillColor:color
    },context.dataPointDefaults,context.dataPointProperties,{
        drawPane:this,
        autoDraw:autoDraw,
        centerPoint:point,
        radius:Math.round(size/2)
    });
    shape.isPointInPath=function(x,y){
        if(point[0]<0||point[1]<0)return false;
        var dist=isc.Math._hypot(x-point[0],y-point[1]);
        return dist<size*2;
    };
    shape.setProperties({
        canHover:interactivePoints,
        _context:context,
        dataRecord:record,
        dataValue:value
    });
    return shape;
}
,isc.A.getTriangleOnPoint=function isc_FacetChart_getTriangleOnPoint(point,size){
    var points=[];
    var delta=Math.round(size/2);
    points.push([point[0]-delta,point[1]+delta]);
    points.push([point[0]+delta,point[1]+delta]);
    points.push([point[0],point[1]-delta]);
    return points;
}
,isc.A.prepareForDragging=function isc_FacetChart_prepareForDragging(){
    this.Super("prepareForDragging",arguments);
    var rect=this._chartRect;
    if(rect!=null){
        this.hoopSelectorRect=[
            this.getPageLeft()+rect.left,
            this.getPageTop()+rect.top,
            rect.width,rect.height
        ];
    }
}
,isc.A.updateHoopSelection=function isc_FacetChart_updateHoopSelection(){
}
,isc.A.drawTitle=function isc_FacetChart_drawTitle(){
    if(!this.showTitle){
        this._titleRect={left:0,top:0,width:0,height:0}
        return;
    }
    var dims=this._titleRect=this.measureLabel(this.title||" ",this.titleProperties);
    var left=Math.floor((this.getInnerContentWidth()/2)-(dims.width/2));
    this._titleElement=this.drawLabel(left,0,this.title||" ",this.titleProperties);
}
,isc.A.setTitle=function isc_FacetChart_setTitle(newTitle){
    this.title=newTitle;
    this._redrawFacetChart(false);
}
,isc.A.setShowTitle=function isc_FacetChart_setShowTitle(newSetting){
    this.showTitle=newSetting;
    this._redrawFacetChart(false);
}
,isc.A.shouldShowDataAxisLabel=function isc_FacetChart_shouldShowDataAxisLabel(){
    if(this.chartType=="Scatter"){
        var metricFacet=this._getMetricFacet(),
            facetValue=(
                metricFacet!=null?
                    this.getFacetValue(metricFacet.id,this.getXAxisMetric()):
                    null),
            label=(facetValue&&facetValue.title)||null;
        return(label!=null&&this.showDataAxisLabel!==false);
    }else{
        var dataLabelFacet=this.getDataLabelFacet();
        return(
            !this.isPieChart()&&this.chartType!="Radar"&&
            dataLabelFacet!=null&&dataLabelFacet.title!=null&&
            (this.showDataAxisLabel!==false));
    }
}
,isc.A.shouldShowValueAxisLabel=function isc_FacetChart_shouldShowValueAxisLabel(context){
    context=context||this;
    return(
        !(context!=this&&context.showAxis==false)&&
        (context!=this||(!this.isPieChart()&&this.chartType!="Radar"))&&
        context.valueTitle!=null&&(context.showValueAxisLabel!==false)&&
        (!this.hasYGradations(context.chartType)||this._showYGradations));
}
,isc.A.getDataAxisLabelHeight=function isc_FacetChart_getDataAxisLabelHeight(){
    if(!this.shouldShowDataAxisLabel()){
        return 0;
    }
    var axisLabel;
    if(this.chartType=="Scatter"){
        var metricFacet=this._getMetricFacet(),
            facetValue=(
                metricFacet!=null?
                    this.getFacetValue(metricFacet.id,this.getXAxisMetric()):
                    null);
        axisLabel=(facetValue&&facetValue.title)||null;
        if(axisLabel==null){
            return 0;
        }
    }else{
        var dataLabelFacet=this.getDataLabelFacet();
        if(!dataLabelFacet){
            return 0;
        }
        axisLabel=dataLabelFacet.title;
    }
    var labelDims=this.measureLabel(axisLabel,this.dataAxisLabelProperties);
    return labelDims.height+this.axisLabelMargin;
}
,isc.A.getValueAxisLabelHeight=function isc_FacetChart_getValueAxisLabelHeight(context){
    context=context||this;
    if(!this.shouldShowValueAxisLabel(context))return 0;
    var labelDims=this.measureLabel(context.valueTitle,context.valueAxisLabelProperties);
    return labelDims.height+this.axisLabelMargin;
}
);
isc.evalBoundary;isc.B.push(isc.A.getAxisLabelSpace=function isc_FacetChart_getAxisLabelSpace(yAxis){
    if(yAxis==this.hasYGradations()){
        return this.getValueAxisLabelHeight();
    }else{
        return this.getDataAxisLabelHeight();
    }
}
,isc.A.drawDataAxisLabel=function isc_FacetChart_drawDataAxisLabel(){
    if(!this.shouldShowDataAxisLabel())return;
    var axisLabel;
    if(this.chartType=="Scatter"){
        var facetValue=this.getFacetValue(this._getMetricFacet().id,this.getXAxisMetric());
        axisLabel=facetValue.title||facetValue.id;
    }else{
        axisLabel=this.getDataLabelFacet().title;
    }
    this.drawAxisLabel(axisLabel,this.dataAxisLabelProperties,
                       !this.hasYGradations(),false);
}
,isc.A.drawValueAxisLabel=function isc_FacetChart_drawValueAxisLabel(){
    if(!this.shouldShowValueAxisLabel())return;
    this.drawAxisLabel(this.valueTitle,this.valueAxisLabelProperties,this.hasYGradations(),false);
}
,isc.A._drawAllValueAxisLabels=function isc_FacetChart__drawAllValueAxisLabels(){
    if(!this._hasExtraAxes()){
        this.drawValueAxisLabel();
    }else{
        var settings=this._getExtraAxisSettings();
        if(this._hasSideValueAxisLabels()){
            this.drawValueAxisLabel();
            var context=settings.right[0];
            if(!this.shouldShowValueAxisLabel(context))return;
            context._valueAxisLabel=this.drawAxisLabel(context.valueTitle,context.valueAxisLabelProperties,true,true);
        }else{
            var top=this.getChartTop()+this.getChartHeight()+this.chartRectMargin,
                numAxes=this._getNumValueAxes();
            for(var j=0;j<numAxes;++j){
                var context=(j==0?this:settings.all[j-1]);
                if(!this.shouldShowValueAxisLabel(context)){
                    continue;
                }
                var label=context.valueTitle,
                    props=context.valueAxisLabelProperties,
                    labelDims=this.measureLabel(label,props);
                var left=this._getValueAxisLeft(context),
                    width=context._totalValueAxisWidth;
                context._valueAxisLabel=isc.DrawLabel.create(props,{
                    autoDraw:true,
                    drawPane:this,
                    left:left+Math.round((width-labelDims.width)/2),
                    top:top,
                    height:labelDims.height,
                    contents:label
                });
            }
        }
    }
}
,isc.A.drawAxisLabel=function isc_FacetChart_drawAxisLabel(label,props,yAxis,extraAxis){
    var labelDims=this.measureLabel(label,props),
        chartRect=this.getChartRect();
    if(yAxis){
        var centeringOffset=labelDims.width/2;
        isc.DrawLabel.create(props,{
            autoDraw:true,drawPane:this,
            left:(extraAxis?this.getInnerContentWidth()-labelDims.height:0),
            top:chartRect.top+Math.round(chartRect.height/2+centeringOffset),
            height:labelDims.height,
            rotation:270,
            suppressArbitraryRotationWarning:true,
            contents:label
        });
    }else{
        isc.DrawLabel.create(props,{
            autoDraw:true,drawPane:this,
            left:chartRect.left+Math.round(chartRect.width/2-labelDims.width/2),
            top:(
                chartRect.top+chartRect.height+this.chartRectMargin+
                this.getXLabelsHeight()-labelDims.height),
            contents:label
        });
    }
}
,isc.A._shouldShowLegend=function isc_FacetChart__shouldShowLegend(){
    return(
        this.showLegend!==false&&
        this._hasFacetValues()&&
        (this.isMultiFacet()||
         this.isPieChart()||
         (this.chartType=="Scatter"&&this._getFacets().length>1)||
         (this._hasExtraAxes())));
}
,isc.A.getLegendFacet=function isc_FacetChart_getLegendFacet(){
    var facets=this._getFacets(),
        isPie=this.isPieChart();
    if(this.chartType=="Scatter"){
        return facets[1];
    }else if(this.isMultiFacet()){
        return(this.reversePieFacets&&isPie?facets[0]:facets[1]);
    }else if(isPie){
        return facets[0];
    }else{
        return null;
    }
}
,isc.A.getDataLabelFacet=function isc_FacetChart_getDataLabelFacet(){
    var facets=this._getFacets();
    if(this.chartType=="Scatter"){
        return null;
    }else if(this.isPieChart()){
        if(!this.isMultiFacet()){
            return null;
        }else if(this.reversePieFacets){
            return facets[1];
        }
    }
    return facets[0];
}
,isc.A._getInlinedFacet=function isc_FacetChart__getInlinedFacet(){
    return(this._parentChart||this).inlinedFacet;
}
,isc.A.drawLegend=function isc_FacetChart_drawLegend(){
    this.logDebug("drawing legend","chartDraw");
    var swatchSize=this.legendSwatchSize;
    var legendPadding=this.legendPadding;
    var legendItemPadding=this.legendItemPadding;
    var legendTextPadding=this.legendTextPadding;
    var legendRowPadding=this.legendRowPadding;
    var hasExtraAxes=this._hasExtraAxes();
    var metricFacet=this._getMetricFacet(),
        facet=this.getLegendFacet(),
        numLegendFacetValues=facet&&facet.values&&facet.values.getLength();
    var facetTitles=[];
    if(hasExtraAxes){
        var primaryMetricFacetValue=metricFacet&&metricFacet.values[0],
            primaryMetricTitle=primaryMetricFacetValue!=null?
                    (primaryMetricFacetValue.title||primaryMetricFacetValue.id):this.valueTitle;
        var criteria={};
        if(metricFacet!=null){
            criteria[metricFacet.id]=primaryMetricFacetValue.id;
        }
        if(this.isMultiFacet()){
            for(var k=0;k<numLegendFacetValues;++k){
                var facetValue=facet.values[k];
                criteria[facet.id]=facetValue.id;
                var values=this.getValue(criteria,true),
                    noData=true;
                for(var j=(values!=null?values.length:0);noData&&j--;){
                    noData=!isc.isA.Number(values[j]);
                }
                if(!noData){
                    facetTitles.add({
                        title:primaryMetricTitle+" ("+(facetValue.title||facetValue.id)+")",
                        context:this,
                        series:k,
                        value:primaryMetricFacetValue,
                        metricValue:facetValue
                    });
                }
            }
        }else{
            var values=this.getValue(criteria,true),
                noData=true;
            for(var j=(values!=null?values.length:0);noData&&j--;){
                noData=!isc.isA.Number(values[j]);
            }
            if(!noData){
                facetTitles.add({
                    title:primaryMetricTitle,
                    context:this,
                    series:0,
                    value:primaryMetricFacetValue
                });
            }
        }
        criteria={};
        var settings=this._getExtraAxisSettings().all;
        for(var j=0,numExtraAxes=settings.length;j<numExtraAxes;++j){
            var metricSettings=settings[j];
            var metricFacetValue=this.getFacetValue(metricFacet.id,metricSettings._metric),
                metricTitle=(metricFacetValue.title||metricFacetValue.id);
            criteria[metricFacet.id]=metricFacetValue.id;
            if(metricSettings.isMultiFacet()){
                for(var k=0;k<numLegendFacetValues;++k){
                    var facetValue=facet.values[k];
                    criteria[facet.id]=facetValue.id;
                    var values=this.getValue(criteria,true),
                        noData=true;
                    for(var l=(values!=null?values.length:0);noData&&l--;){
                        noData=!isc.isA.Number(values[l]);
                    }
                    if(!noData){
                        facetTitles.add({
                            title:metricTitle+" ("+(facetValue.title||facetValue.id)+")",
                            context:metricSettings,
                            series:k,
                            value:metricFacetValue,
                            metricValue:facetValue
                        });
                    }
                }
            }else{
                var values=this.getValue(criteria,true),
                    noData=true;
                for(var l=(values!=null?values.length:0);noData&&l--;){
                    noData=!isc.isA.Number(values[l]);
                }
                if(!noData){
                    var title=metricSettings.legendLabel;
                    if(title==null){
                        title=metricTitle;
                        if(this.isMultiFacet()){
                            var fixedFacetValue=this._getFixedFacetValue(metricSettings);
                            title=title+" ("+(fixedFacetValue.title||fixedFacetValue.id)+")";
                        }
                    }
                    facetTitles.add({
                        title:title,
                        context:metricSettings,
                        series:0,
                        value:metricFacetValue,
                        metricValue:fixedFacetValue
                    });
                }
            }
        }
    }else{
        if(!facet.values)return;
        var criteria={};
        if(metricFacet!=null){
            criteria[metricFacet.id]=metricFacet.values[0].id;
        }
        for(var i=0;i<numLegendFacetValues;i++){
            var facetValue=facet.values[i];
            criteria[facet.id]=facetValue.id;
            var values=this.getValue(criteria,true),
                noData=true;
            for(var j=(values!=null?values.length:0);noData&&j--;){
                noData=!isc.isA.Number(values[j]);
            }
            if(!noData){
                facetTitles.add({
                    title:facetValue.title||facetValue.id,
                    value:facetValue,
                    series:i
                });
            }
        }
    }
    var availWidth=this.getInnerWidth();
    var currLeft=legendPadding;
    var numRows=1;
    for(var i=0;i<facetTitles.length;i++){
        var labelDims=this.measureLabel(facetTitles[i].title,this.legendLabelProperties);
        var currSize=swatchSize+legendTextPadding+labelDims.width;
        if(currLeft+currSize+legendPadding>availWidth){
            numRows++;
            currLeft=legendPadding;
        }
        if(i!=facetTitles.length-1){
            currSize+=legendItemPadding;
        }
        facetTitles[i].width=labelDims.width;
        facetTitles[i].height=labelDims.height;
        facetTitles[i].rowNum=numRows;
        facetTitles[i].left=currLeft;
        currLeft+=currSize;
    }
    currLeft+=legendPadding;
    var left,height,top,width;
    if(numRows>1){
        width=availWidth;
    }else{
        width=currLeft;
    }
    height=(numRows*swatchSize)+(legendPadding*2)+((numRows-1)*legendRowPadding);
    top=this.getInnerContentHeight()
            -(this._getCanZoom()?this._zoomChartMargin+this.zoomChartHeight+this._zoomChartSliderScrollbarHeight:0)
            -height;
    if(width==availWidth)left=0;
    else left=Math.floor((availWidth/2)-(width/2));
    this._legendRect={
        left:left,
        top:top,
        width:width,
        height:height
    };
    if(this.showLegendRect){
        var legendRect=this.drawRect(left,top,width,height,this.legendRectProperties,this);
        this._processLegendActions(legendRect);
    }
    var legendLabelProperties=isc.addProperties({
        _verticalAlignMiddle:true
    },this.legendLabelProperties);
    for(i=0;i<facetTitles.length;i++){
        var labelWidth=facetTitles[i].width;
        var currLeft=left+facetTitles[i].left;
        var currRowNum=facetTitles[i].rowNum;
        var currTop=top+((swatchSize+legendRowPadding)*(currRowNum-1))
            +legendPadding;
        if(hasExtraAxes){
            var ft=this._createExtraAxisLegendSwatch(facetTitles[i].context,
                facetTitles[i].series,currLeft,currTop,swatchSize);
            this._processLegendActions(ft,facetTitles[i].value,facetTitles[i].metricValue);
        }else{
            var legendProperties={fillColor:this._getDataColor(facetTitles[i].series)};
            this._processLegendActions(legendProperties,facetTitles[i].value,facetTitles[i].metricValue);
            this.drawRect(currLeft,currTop,swatchSize,swatchSize,
                isc.addProperties(legendProperties,this.legendSwatchProperties),this);
        }
        currLeft+=swatchSize+legendTextPadding;
        var lbl=this.drawLabel(currLeft,currTop+Math.round((swatchSize-this.getDataLabelHeight())/2),
                       facetTitles[i].title,legendLabelProperties);
        this._processLegendActions(lbl,facetTitles[i].value,facetTitles[i].metricValue);
    }
}
,isc.A.setDataColors=function isc_FacetChart_setDataColors(dataColors,context){
    context=context||this;
    if(isc.isAn.Array(dataColors)&&dataColors.length>0){
        context.dataColors=dataColors;
        if(this.data){
            this._redrawFacetChart(false);
        }
    }
}
,isc.A.getDataColor=function isc_FacetChart_getDataColor(index,context){
    context=context||this;
    var color=context.dataColors[index%context.dataColors.length];
    return(!isc.startsWith(color,"#"))?"#"+color:color;
}
,isc.A.getDataGradient=function isc_FacetChart_getDataGradient(index,create,drawingType,context,hasOwnDataColors){
    context=context||this;
    create=create!==false;
    drawingType=drawingType==undefined?this.drawingType:drawingType;
    var color=(hasOwnDataColors===false?this:context).getDataColor(index);
    var id=context.chartType+color.replace("#","-");
    var gradient;
    if(!create||!context.dataGradients[id]){
        switch(this.chartType){
            case"Bar":
            gradient={
                id:id,
                x1:'0%',
                y1:'0%',
                x2:'0%',
                y2:'100%',
                colorStops:[{
                    color:this.getClass().mixrgb(color,"-#0A0A0A"),
                    offset:0.0
                },{
                    color:color,
                    offset:0.2
                },{
                    color:this.getClass().mixrgb(color,"+#333333"),
                    offset:0.4
                },{
                    color:color,
                    offset:0.7
                },{
                    color:this.getClass().mixrgb(color,"-#111111"),
                    offset:1.0
                }]
            };
            if(create)this.createLinearGradient(id,gradient);
            break;
            case"Column":
            gradient={
                id:id,
                x1:'0%',
                y1:'0%',
                x2:'100%',
                y2:'0%',
                colorStops:[{
                    color:this.getClass().mixrgb(color,"-#0A0A0A"),
                    offset:0.0
                },{
                    color:color,
                    offset:0.2
                },{
                    color:this.getClass().mixrgb(color,"+#333333"),
                    offset:0.4
                },{
                    color:color,
                    offset:0.7
                },{
                    color:this.getClass().mixrgb(color,"-#111111"),
                    offset:1.0
                }]
            };
            if(create)this.createLinearGradient(id,gradient);
            break;
            case"Area":
            case"Line":
            gradient={
                id:id,
                x1:0,x2:0,
                y1:"0%",y2:"100%",
                colorStops:[
                     {color:this.getClass().mixrgb(color,"+#555555"),offset:0.0},
                     {color:this.getClass().mixrgb(color,"+#222222"),offset:0.3},
                     {color:this.getClass().mixrgb(color,"-#333333"),offset:1.0}
                ]
            };
            if(create)this.createLinearGradient(id,gradient);
            break;
            case"Doughnut":
            case"Pie":
            gradient={
                id:id,
                colorStops:[{
                    color:color,
                    offset:0.0
                },{
                    color:color,
                    offset:drawingType=="vml"?0.8:0.9
                },{
                    color:this.getClass().mixrgb(color,"-#222222"),
                    offset:drawingType=="vml"?0.9:0.95
                },{
                    color:this.getClass().mixrgb(color,"-#666666"),
                    offset:1.0
                }]
            };
            if(drawingType!="svg"){
                isc.addProperties(gradient,{
                    cx:0,
                    cy:0,
                    r:'72%',
                    fx:0,
                    fy:0
                });
            }
            if(create)this.createRadialGradient(id,gradient);
            break;
            default:
            gradient={
                id:id,
                x1:'0%',
                y1:'0%',
                x2:'0%',
                y2:'100%',
                colorStops:[{
                    color:this.getClass().mixrgb(color,"+"+(drawingType=="vml"?"#111111":"#222222")),
                    offset:0.0
                },{
                    color:color,
                    offset:0.4
                },{
                    color:color,
                    offset:0.6
                },{
                    color:this.getClass().mixrgb(color,"-"+(drawingType=="vml"?"#111111":"#1A1A1A1A")),
                    offset:1.0
                }]
            };
            if(create)this.createLinearGradient(id,gradient);
            break;
        }
    }
    if(gradient&&create)context.dataGradients[id]=gradient;
    return(create?id:gradient);
}
,isc.A._getPieSeriesGradient=function isc_FacetChart__getPieSeriesGradient(index,centerPoint,radius,create,drawingType){
    create=create!==false;
    drawingType=drawingType==undefined?this.drawingType:drawingType;
    if(drawingType!="svg")return this._getDataGradient(index,create,drawingType);
    if(this._nextSVGDefID==undefined)this._nextSVGDefID=1;
    var id="radialGradient"+(this._nextSVGDefID++);
    var radialGradient={
        id:id,
        _baseGradient:this._getDataGradient(index,create,drawingType),
        cx:centerPoint[0],
        cy:centerPoint[1],
        r:radius,
        _temporary:true
    };
    if(create){
        this.createRadialGradient(id,radialGradient);
        return id;
    }else{
        this.addGradient(radialGradient);
        return radialGradient;
    }
}
,isc.A.getRadarShapeGradient=function isc_FacetChart_getRadarShapeGradient(color,shape,centerPoint,isFirst){
    var shapePoints=shape.points,
        innerColor=this.getClass().mixrgb(color,"+#444444"),
        outerColor=this.getClass().mixrgb(color,"-#444444");
    var maxRadius=0.01,
        minRadius=Number.MAX_VALUE;
    for(var i=shapePoints.length;i--;){
        var distance=isc.GraphMath.straightDistance(shapePoints[i],centerPoint);
        maxRadius=Math.max(distance,maxRadius);
        minRadius=Math.min(distance,minRadius);
    }
    if(isFirst)minRadius=0;
    var ratio=minRadius/maxRadius;
    var shapeCenter=shape.getCenter(),
        x=-shapeCenter[0]+centerPoint[0],
        y=-shapeCenter[1]+centerPoint[1];
    return{
        cx:x,
        cy:y,
        r:maxRadius,
        fx:x,
        fy:y,
        colorStops:[
            {color:innerColor,offset:0},
            {color:innerColor,offset:ratio},
            {color:outerColor,offset:1.0}
        ]
    };
}
,isc.A._getColorMutePercent=function isc_FacetChart__getColorMutePercent(colorMutePercent,defaultColorMutePercent){
    if(isc.isA.String(colorMutePercent)){
        var percentage=colorMutePercent.endsWith("%");
        colorMutePercent=parseFloat(colorMutePercent);
    }
    if(isc.isA.Number(colorMutePercent)){
        colorMutePercent=Math.min(colorMutePercent,100);
        colorMutePercent=-Math.min(-colorMutePercent,100);
    }else{
        colorMutePercent=defaultColorMutePercent;
    }
    return colorMutePercent;
}
,isc.A._getDataColor=function isc_FacetChart__getDataColor(index,context){
    context=context||this;
    return isc.DrawPane._mutergb(this.colorMutePercent,context.getDataColor(index));
}
,isc.A._getDataGradient=function isc_FacetChart__getDataGradient(index,create,drawingType,context){
    context=context||this;
    var cache=context._mutedDataGradients;
    if(cache==null){
        cache=context._mutedDataGradients={};
    }
    var chartType=context.chartType,
        cacheKey=chartType+"_"+index;
    if(cache[cacheKey]==null){
        var mutergb=isc.DrawPane._mutergb,
            colorMutePercent=this.colorMutePercent;
        var gradient=context.getDataGradient(index,create,drawingType);
        if(isc.isA.String(gradient)){
            gradient=this.getGradient(gradient);
        }
        gradient=isc.clone(gradient);
        gradient.startColor=gradient.startColor&&mutergb(colorMutePercent,gradient.startColor);
        gradient.endColor=gradient.endColor&&mutergb(colorMutePercent,gradient.endColor);
        var numColorStops=isc.isAn.Array(gradient.colorStops)?gradient.colorStops.length:0;
        for(var i=0;i<numColorStops;++i){
            var colorStop=gradient.colorStops[i];
            colorStop.color=colorStop.color&&mutergb(colorMutePercent,colorStop.color);
        }
        var metricIndex=0;
        if(context!=this){
            metricIndex=1+this._getExtraAxisMetrics().indexOf(context._metric);
        }
        var id=this.getID()+"_"+metricIndex+"_"+chartType+"_data_gradient_"+index;
        if(typeof(gradient.direction)==="number"){
            gradient=this.createSimpleGradient(id,gradient);
        }else if(typeof(gradient.x1)==="number"){
            gradient=this.createLinearGradient(id,gradient);
        }else{
            gradient=this.createRadialGradient(id,gradient);
        }
        cache[cacheKey]=gradient;
    }
    return cache[cacheKey];
}
,isc.A._getBackgroundColor=function isc_FacetChart__getBackgroundColor(){
    return this.backgroundColor||"#ffffff";
}
,isc.A.drawLabel=function isc_FacetChart_drawLabel(left,top,text,props,rotate){
    var noRotateProps=(rotate?this.rotateProps:null);
    var lbl=isc.DrawLabel.create(props,noRotateProps,{
        autoDraw:true,
        drawPane:this,
        left:left,
        top:top,
        contents:text
    });
    return lbl;
}
,isc.A.getDrawnValueAtPoint=function isc_FacetChart_getDrawnValueAtPoint(x,y,metric){
    return this.getNearestDrawnValue(x,y,metric,true);
}
,isc.A.getDrawnValuesAtPoint=function isc_FacetChart_getDrawnValuesAtPoint(x,y){
    return this.getNearestDrawnValues(x,y,true);
}
,isc.A.drawnValueContainsPoint=function isc_FacetChart_drawnValueContainsPoint(drawnValue,x,y){
    if(drawnValue==null||
        (x!=null&&y==null))
    {
        return null;
    }
    if(x==null){
        x=this.getOffsetX()-this.getLeftMargin()-this.getLeftPadding();
        y=this.getOffsetY()-this.getTopMargin()-this.getTopPadding();
    }
    var context=this;
    if(this._hasExtraAxes()){
        var i=this._getExtraAxisMetrics().indexOf(drawnValue.facetValues.metric);
        if(i!=-1){
            context=this._getExtraAxisSettings().all[i];
        }
    }
    return this._isDrawnValueUnderCoordinates(drawnValue,x,y,context);
}
,isc.A._isDrawnValueUnderCoordinates=function isc_FacetChart__isDrawnValueUnderCoordinates(drawnValue,x,y,context){
    switch(context.chartType){
        case"Bar":
            var chartRect=this.getChartRect();
            if(chartRect!=null&&!(chartRect.left<=x&&x<=(chartRect.left+chartRect.width))){
                return false;
            }
            var halfBarThickness=drawnValue.barThickness/2;
            if(!(x<=drawnValue.x)||
                !(drawnValue.y-halfBarThickness<=y&&y<=drawnValue.y+halfBarThickness))
            {
                return false;
            }
            if(drawnValue.prevX!=null){
                if(!(drawnValue.prevX<=x)){
                    return false;
                }
            }
            break;
        case"Column":
            var chartRect=this.getChartRect();
            if(chartRect!=null&&!(chartRect.top<=y&&y<=(chartRect.top+chartRect.height))){
                return false;
            }
            var halfBarThickness=drawnValue.barThickness/2;
            if(!(drawnValue.y<=y)||
                !(drawnValue.x-halfBarThickness<=x&&x<=drawnValue.x+halfBarThickness))
            {
                return false;
            }
            if(drawnValue.prevY!=null){
                if(!(y<=drawnValue.prevY)){
                    return false;
                }
            }
            break;
        case"Scatter":
        case"Area":
        case"Line":
        case"Radar":
            if(isc.Math._hypot(x-drawnValue.x,y-drawnValue.y)>this.dataPointSize){
                return false;
            }
            break;
        case"Doughnut":
        case"Pie":
            var centerX=drawnValue.x,
                centerY=drawnValue.y,
                radius=drawnValue.radius,
                startAngle=drawnValue.startAngle,
                endAngle=drawnValue.endAngle;
            var doughnutSize=(context.shouldShowDoughnut()?(radius*context.doughnutRatio):0);
            var r=isc.Math._hypot(x-centerX,y-centerY);
            if(!(doughnutSize<=r&&r<=radius))return false;
            var angle=isc.DrawItem.computeAngle(centerX,centerY,x,y);
            if(!(startAngle<=angle&&angle<=endAngle)&&
                !(endAngle<=angle&&angle<=startAngle))
            {
                return false;
            }
            break;
        default:
            return false;
    }
    return true;
}
,isc.A.getNearestDrawnValue=function isc_FacetChart_getNearestDrawnValue(x,y,metric,checkAtPoint){
    if(!this._canGetNearestDrawnValue(x,y)){
        return null;
    }
    var context=this;
    if(this._hasExtraAxes()){
        var i=this._getExtraAxisMetrics().indexOf(metric);
        if(i!=-1){
            context=this._getExtraAxisSettings().all[i];
        }
    }
    if(x==null){
        x=this.getOffsetX()-this.getLeftMargin()-this.getLeftPadding();
        y=this.getOffsetY()-this.getTopMargin()-this.getTopPadding();
    }
    var res=this._getNearestDrawnValue(x,y,context,true,false);
    if(res!=null){
        if(checkAtPoint&&!this._isDrawnValueUnderCoordinates(res,x,y,context)){
            return null;
        }
        delete res.drawItemId;
        delete res.text;
    }
    return res;
}
,isc.A.getNearestDrawnValues=function isc_FacetChart_getNearestDrawnValues(x,y,checkAtPoint){
    if(!this._canGetNearestDrawnValue(x,y)){
        return null;
    }
    if(x==null){
        x=this.getOffsetX()-this.getLeftMargin()-this.getLeftPadding();
        y=this.getOffsetY()-this.getTopMargin()-this.getTopPadding();
    }
    var res;
    if(this.chartType=="Scatter"){
        res=this._getScatterNearestDrawnValues(x,y,false);
        if(checkAtPoint){
            for(var i=0,resLen=(res!=null?res.length:0);i<resLen;++i){
                if(!this._isDrawnValueUnderCoordinates(res[i],x,y,this))res[i]=null;
            }
        }
    }else{
        var dataLabelFacet=this.getDataLabelFacet(),
            legendFacet=this.getLegendFacet(),
            valueFacet=(this.inlinedFacet!=null&&
                this.inlinedFacet!=dataLabelFacet&&this.inlinedFacet!=legendFacet
                ?this.inlinedFacet:null),
            hasExtraAxes=this._hasExtraAxes(),
            settings=hasExtraAxes&&this._getExtraAxisSettings().all,
            len=(valueFacet!=null?valueFacet.values.length:1);
        res=new Array(len);
        for(var i=0;i<len;++i){
            var context;
            if(i==0){
                context=this;
            }else if(hasExtraAxes){
                var metric=valueFacet.values[i].id;
                for(var k=0;k<settings.length;++k){
                    if(metric==settings[k]._metric){
                        context=settings[k];
                        break;
                    }
                }
            }else{
                context=null;
            }
            if(context==null){
                res[i]=null;
            }else{
                res[i]=this._getNearestDrawnValue(x,y,context,true,false);
                if(checkAtPoint&&res[i]!=null){
                    if(!this._isDrawnValueUnderCoordinates(res[i],x,y,context))res[i]=null;
                }
            }
        }
    }
    for(var i=0,resLen=(res!=null?res.length:0);i<resLen;++i){
        if(res[i]!=null){
            delete res[i].drawItemId;
            delete res[i].text;
        }
    }
    return res;
}
,isc.A._canGetNearestDrawnValue=function isc_FacetChart__canGetNearestDrawnValue(x,y){
    if(x!=null&&y==null){
        isc.logWarn("Both coordinates should be passed in method getNearestDrawnValue or no "+
            "coordinates at all to use getOffset methods.");
        return false;
    }else if(!this.isDrawn()){
        isc.logWarn("Chart should be drawn before requesting nearestDrawnValue.");
        return false;
    }else if(this.chartType!="Scatter"&&this.getOrderedData().length==0){
        return false;
    }else if(this.chartType=="Scatter"&&this._getData().length==0){
        return false;
    }else{
        return true;
    }
}
,isc.A._getScatterNearestDrawnValues=function isc_FacetChart__getScatterNearestDrawnValues(x,y,keepText){
    var hypot=isc.Math._hypot,
        data=this.getOrderedData(),
        legendFacet=this.getLegendFacet(),
        nearestDrawnValue=null,
        bestJ=null,
        minDistance=null;
    for(var j=legendFacet?legendFacet.values.length:1;j--;){
        var series=(legendFacet?data[j].series:data);
        for(var i=series.length;i--;){
            var s=series[i];
            if(s.record!=null){
                var distance=hypot(x-s.drawnX,y-s.drawnY);
                if(minDistance==null||distance<minDistance){
                    nearestDrawnValue=s;
                    if(legendFacet)bestJ=j;
                    minDistance=distance;
                }
            }
        }
    }
    if(nearestDrawnValue==null){
        return null;
    }else{
        var metricFacet=this.metricFacet,
            len=metricFacet.values.length,
            res=new Array(len),
            xAxisMetric=this.getXAxisMetric(),
            yAxisMetric=this.getYAxisMetric(),
            xIndex=metricFacet.values.findIndex("id",xAxisMetric),
            yIndex=metricFacet.values.findIndex("id",yAxisMetric),
            facetValues={};
        if(legendFacet!=null){
            facetValues[legendFacet.id]=data[bestJ].facetValueId;
        }
        for(var i=len;i--;){
            if(i==xIndex||i==yIndex){
                var value=nearestDrawnValue.record[i==xIndex?xAxisMetric:yAxisMetric];
                res[i]={
                    x:Math.round(nearestDrawnValue.drawnX),
                    y:Math.round(nearestDrawnValue.drawnY),
                    value:value,
                    facetValues:facetValues,
                    record:nearestDrawnValue.record,
                    text:(keepText?this.formatDataValue(value):null),
                    drawItemId:nearestDrawnValue.drawItemId
                };
            }else{
                res[i]=null;
            }
        }
        return res;
    }
}
,isc.A._getNearestDrawnValue=function isc_FacetChart__getNearestDrawnValue(x,y,context,byDistanceOnly,keepText){
    if(context.chartType=="Scatter"){
        var nearestDrawnValues=this._getScatterNearestDrawnValues(x,y,keepText);
        if(nearestDrawnValues==null){
            return null;
        }else{
            var metricFacet=this.metricFacet,
                xAxisMetric=this.getXAxisMetric(),
                yAxisMetric=this.getYAxisMetric(),
                xIndex=metricFacet.values.findIndex("id",xAxisMetric),
                yIndex=metricFacet.values.findIndex("id",yAxisMetric);
            return(nearestDrawnValues[yIndex]||nearestDrawnValues[xIndex]||null);
        }
    }
    var hypot=isc.Math._hypot,
        d=this.getOrderedData(),
        range=this._getZoomValueRange(),
        start=range[0].index,
        end=1+range[1].index,
        dataLabelFacet=this.getDataLabelFacet(),
        dataLabelFacetId=dataLabelFacet&&dataLabelFacet.id,
        legendFacet=this.getLegendFacet(),
        legendFacetId=legendFacet&&legendFacet.id,
        valueFacet=(this.inlinedFacet!=null&&
            this.inlinedFacet!=dataLabelFacet&&this.inlinedFacet!=legendFacet
            ?this.inlinedFacet:null);
    var isExtraAxis=(context!=this),
        contextIsMultiFacet=context.isMultiFacet(),
        extraAxisMetric,
        seriesIndex;
    if(isExtraAxis){
        extraAxisMetric=context._metric;
        if(this.isMultiFacet()&&!context.isMultiFacet()){
            var fixedFacetValue=this._getFixedFacetValue(context);
            seriesIndex=legendFacet.values.findIndex("id",fixedFacetValue.id);
        }
    }
    switch(context.chartType){
        case"Bar":
            var series=null,
                facetValues={};
            if(this.isMultiFacet()){
                var clustered=contextIsMultiFacet&&!this.isStacked(context),
                    data=null;
                if(clustered){
                    outer:for(var i=0,bestDiff=null;i<d.length;++i){
                        var di=d[i];
                        for(var j=0;j<di.series.length;++j){
                            var s=di.series[j];
                            if(isc.isA.Number(s.value)){
                                var diff=s.drawnY&&Math.abs(s.drawnY-y);
                                if(bestDiff==null||diff<bestDiff){
                                    data=di;
                                    series=s;
                                    bestDiff=diff;
                                }else{
                                    break outer;
                                }
                            }
                        }
                    }
                }else{
                    var stacked=(contextIsMultiFacet&&this.isStacked(context));
                    for(var i=0,bestDiff=null;i<d.length;++i){
                        var s=null;
                        for(var j=d[i].series.length;s==null&&j--;){
                            if(isc.isA.Number(d[i].series[j].value)){
                                s=d[i].series[j];
                                break;
                            }
                        }
                        if(s!=null){
                            var diff=Math.abs(s.drawnY-y);
                            if(bestDiff==null||diff<bestDiff){
                                data=d[i];
                                bestDiff=diff;
                            }else{
                                break;
                            }
                        }
                    }
                    if(data!=null){
                        var bestDiff=0,
                            first=true,
                            withinBar=false;
                        for(var j=0;j<data.series.length;++j){
                            var s=data.series[j];
                            if(isc.isA.Number(s.value)){
                                var prevDrawnX=s.prevDrawnX,
                                    drawnX=(prevDrawnX+s.drawnX)/2,
                                    diff=Math.abs(drawnX-x),
                                    flag=(
                                        (prevDrawnX<=x&&x<=s.drawnX)||
                                        (s.drawnX<=x&&x<=prevDrawnX));
                                if(first||
                                        (withinBar?
                                            (flag&&diff<bestDiff):
                                            (flag||diff<bestDiff)))
                                {
                                    series=s;
                                    bestDiff=diff;
                                }else if(!stacked){
                                    break;
                                }
                                first=false;
                                withinBar=withinBar||flag;
                            }
                        }
                    }
                }
                facetValues[dataLabelFacetId]=data&&data.facetValueId;
                facetValues[legendFacetId]=series&&series.facetValueId;
            }else{
                for(var i=0,bestDiff=null;i<d.length;++i){
                    var s=d[i];
                    if(isc.isA.Number(s.value)){
                        var diff=Math.abs(s.drawnY-y);
                        if(bestDiff==null||diff<bestDiff){
                            series=s;
                            bestDiff=diff;
                        }else{
                            break;
                        }
                    }
                }
                facetValues[dataLabelFacetId]=series&&series.facetValueId;
            }
            if(valueFacet!=null){
                facetValues[valueFacet.id]=valueFacet.values[0].id;
            }
            return(series&&{
                x:Math.round(series.drawnX),
                y:Math.round(series.drawnY),
                prevX:series.prevDrawnX,
                barThickness:series.barThickness,
                value:series.value,
                text:(keepText?this.formatDataValue(series.value):null),
                facetValues:facetValues,
                record:series.record,
                drawItemId:series.drawItemId
            });
        case"Column":
            var case1=this.isMultiFacet()&&(!isExtraAxis||contextIsMultiFacet),
                case2=!case1&&isExtraAxis&&this.isMultiFacet(),
                case3=!case1&&!case2,
                series=null,value,facetValues={},record;
            if(case1){
                var clustered=contextIsMultiFacet&&!this.isStacked(context),
                    bestI=null,
                    bestJ=null;
                if(clustered){
                    outer:for(var i=start,bestDiff=null;i<end;++i){
                        var di=d[i];
                        for(var j=0;j<di.series.length;++j){
                            var dv=this._getDrawnValue(context,i,j);
                            if(isc.isA.Number(dv.value)){
                                var diff=Math.abs(dv.drawnX-x);
                                if(bestDiff==null||diff<bestDiff){
                                    bestI=i;
                                    bestJ=j;
                                    bestDiff=diff;
                                }else{
                                    break outer;
                                }
                            }
                        }
                    }
                }else{
                    var stacked=(contextIsMultiFacet&&this.isStacked(context));
                    for(var i=start,bestDiff=null;i<end;++i){
                        var dv=null;
                        for(var j=d[start].series.length;dv==null&&j--;){
                            var temp=this._getDrawnValue(context,i,j);
                            if(isc.isA.Number(temp.value))dv=temp;
                        }
                        if(dv!=null){
                            var diff=Math.abs(dv.drawnX-x);
                            if(bestDiff==null||diff<bestDiff){
                                bestI=i;
                                bestDiff=diff;
                            }else{
                                break;
                            }
                        }
                    }
                    if(bestI!=null){
                        var bestDiff=0,
                            first=true,
                            withinColumn=false;
                        for(var j=0;j<d[bestI].series.length;++j){
                            var dv=this._getDrawnValue(context,bestI,j);
                            if(isc.isA.Number(dv.value)){
                                var prevDrawnY=dv.prevDrawnY,
                                    drawnY=(prevDrawnY+dv.drawnY)/2,
                                    diff=Math.abs(drawnY-y),
                                    flag=(
                                        (prevDrawnY<=y&&y<=dv.drawnY)||
                                        (dv.drawnY<=y&&y<=prevDrawnY));
                                if(first||
                                        (withinColumn?
                                            (flag&&diff<bestDiff):
                                            (flag||diff<bestDiff)))
                                {
                                    bestJ=j;
                                    bestDiff=diff;
                                }else if(!stacked){
                                    break;
                                }
                                first=false;
                                withinColumn=withinColumn||flag;
                            }
                        }
                    }
                }
                if(bestI!=null&&bestJ!=null){
                    series=this._getDrawnValue(context,bestI,bestJ);
                    var obj=d[bestI].series[bestJ];
                    record=obj.record;
                    value=(isExtraAxis?record[extraAxisMetric]:obj.value);
                    facetValues[dataLabelFacetId]=d[bestI].facetValueId;
                    facetValues[legendFacetId]=obj.facetValueId;
                    if(valueFacet!=null){
                        facetValues[valueFacet.id]=(isExtraAxis?extraAxisMetric:valueFacet.values[0].id);
                    }
                }
            }else{
                var bestI=null,
                    bestJ=(case2?seriesIndex:null);
                for(var i=start,bestDiff=null;i<end;++i){
                    var dv=this._getDrawnValue(context,i,bestJ);
                    if(isc.isA.Number(dv.value)){
                        var diff=Math.abs(dv.drawnX-x);
                        if(bestDiff==null||diff<bestDiff){
                            bestI=i;
                            bestDiff=diff;
                        }else{
                            break;
                        }
                    }
                }
                if(bestI!=null){
                    series=this._getDrawnValue(context,bestI,bestJ);
                    var obj=(case2?d[bestI].series[bestJ]:d[bestI]);
                    record=obj.record;
                    value=(isExtraAxis?record[extraAxisMetric]:obj.value);
                    facetValues[dataLabelFacetId]=d[bestI].facetValueId;
                    if(case2){
                        facetValues[legendFacetId]=obj.facetValueId;
                    }
                    if(valueFacet!=null){
                        facetValues[valueFacet.id]=(isExtraAxis?extraAxisMetric:valueFacet.values[0].id);
                    }
                }
            }
            return(series&&{
                x:Math.round(series.drawnX),
                y:Math.round(series.drawnY),
                prevY:series.prevDrawnY,
                barThickness:series.barThickness,
                value:value,
                text:(keepText?context.formatDataValue(value):null),
                facetValues:facetValues,
                record:record,
                drawItemId:series.drawItemId
            });
        case"Area":
        case"Line":
            var case1=this.isMultiFacet()&&(!isExtraAxis||contextIsMultiFacet),
                case2=!case1&&isExtraAxis&&this.isMultiFacet(),
                case3=!case1&&!case2,
                bestI=null,bestJ=null,series=null;
            if(byDistanceOnly){
                for(var i=end-1,minDistance=null;i>=start;--i){
                    for(var j=(case1?d[i].series.length:1);j--;){
                        var k=(case1?j:(case2?seriesIndex:null)),
                            drawnValue=this._getDrawnValue(context,i,k);
                        if(isc.isA.Number(drawnValue.value)){
                            var distance=hypot(x-drawnValue.drawnX,y-drawnValue.drawnY);
                            if(minDistance==null||distance<minDistance){
                                minDistance=distance;
                                bestI=i;
                                bestJ=k;
                                series=drawnValue;
                            }
                        }
                    }
                }
            }else if(case1){
                for(var i=start,bestDiff=null;i<end;++i){
                    var dv=null;
                    for(var j=d[start].series.length;dv==null&&j--;){
                        var temp=this._getDrawnValue(context,i,j);
                        if(isc.isA.Number(temp.value))dv=temp;
                    }
                    if(dv!=null){
                        var diff=Math.abs(dv.drawnX-x);
                        if(bestDiff==null||diff<bestDiff){
                            bestI=i;
                            bestDiff=diff;
                        }else{
                            break;
                        }
                    }
                }
                if(bestI!=null){
                    for(var j=0,foundBelow=false,bestDiff=null;j<d[bestI].series.length;++j){
                        var s=this._getDrawnValue(context,bestI,j);
                        if(isc.isA.Number(s.value)){
                            var drawnY=s.drawnY,
                                diff=Math.abs(drawnY-y);
                            if(!foundBelow&&drawnY>=y){
                                foundBelow=true;
                                bestDiff=diff;
                                series=s;
                                bestJ=j;
                            }else if((!foundBelow||drawnY>=y)&&(series==null||bestDiff>diff)){
                                bestDiff=diff;
                                series=s;
                                bestJ=j;
                            }
                        }
                    }
                }
            }else{
                bestI=null;
                bestJ=(case2?seriesIndex:null);
                for(var i=start,bestDiff=null;i<end;++i){
                    var dv=this._getDrawnValue(context,i,bestJ);
                    if(isc.isA.Number(dv.value)){
                        var diff=Math.abs(dv.drawnX-x);
                        if(bestDiff==null||diff<bestDiff){
                            bestI=i;
                            bestDiff=diff;
                        }else{
                            break;
                        }
                    }
                }
                series=(bestI!=null&&this._getDrawnValue(context,bestI,bestJ));
            }
            if(series==null){
                return null;
            }
            var value,
                facetValues={},
                record;
            if(case1){
                var obj=d[bestI].series[bestJ];
                record=obj.record;
                value=(isExtraAxis?record[extraAxisMetric]:obj.value);
                facetValues[dataLabelFacetId]=d[bestI].facetValueId;
                facetValues[legendFacetId]=obj.facetValueId;
                if(valueFacet!=null){
                    facetValues[valueFacet.id]=(isExtraAxis?extraAxisMetric:valueFacet.values[0].id);
                }
            }else{
                var obj=(case2?d[bestI].series[bestJ]:d[bestI]);
                record=obj.record;
                value=(isExtraAxis?record[extraAxisMetric]:obj.value);
                facetValues[dataLabelFacetId]=d[bestI].facetValueId;
                if(case2){
                    facetValues[legendFacetId]=obj.facetValueId;
                }
                if(valueFacet!=null){
                    facetValues[valueFacet.id]=(isExtraAxis?extraAxisMetric:valueFacet.values[0].id);
                }
            }
            return{
                x:Math.round(series.drawnX),
                y:Math.round(series.drawnY),
                value:value,
                text:(keepText?context.formatDataValue(value):null),
                facetValues:facetValues,
                record:record
            };
        case"Radar":
            var data=null,facetValues={};
            if(this.isMultiFacet()){
                var bestI=null,
                    bestJ=null;
                for(var i=0,distance=null;i<d.length;++i){
                    for(var j=0;j<d[i].series.length;++j){
                        var s=d[i].series[j];
                        if(isc.isA.Number(s.value)){
                            var dist=hypot(s.drawnX-x,s.drawnY-y);
                            if(distance==null||dist<distance){
                                distance=dist;
                                data=s;
                                bestI=i;
                                bestJ=j;
                            }
                        }
                    }
                }
                if(data!=null){
                    facetValues[dataLabelFacetId]=d[bestI].facetValueId;
                    facetValues[legendFacetId]=data.facetValueId;
                }
            }else{
                for(var i=0,distance=null;i<d.length;++i){
                    var s=d[i];
                    if(isc.isA.Number(s.value)){
                        var dist=hypot(s.drawnX-x,s.drawnY-y);
                        if(distance==null||dist<distance){
                            distance=dist;
                            data=d[i];
                        }
                    }
                }
                facetValues[dataLabelFacetId]=data&&data.facetValueId;
            }
            if(valueFacet!=null){
                facetValues[valueFacet.id]=valueFacet.values[0].id;
            }
            return(data&&{
                x:Math.round(data.drawnX),
                y:Math.round(data.drawnY),
                value:data.value,
                text:(keepText?this.formatDataValue(data.value):null),
                facetValues:facetValues,
                record:data.record
            });
        case"Doughnut":
        case"Pie":
            var isMultiFacet=this.isMultiFacet(),
                facetValues={},
                series=null
            if(!isMultiFacet){
                for(var i=0,angleInDegrees=null;i<d.length;++i){
                    var s=d[i];
                    if(isc.isA.Number(s.value)){
                        if(angleInDegrees==null){
                            var deltaY=y-s.pieY,
                                deltaX=x-s.pieX;
                            angleInDegrees=Math.atan2(deltaY,deltaX)*180/Math.PI;
                            if(angleInDegrees<0)angleInDegrees+=360;
                        }
                        if(angleInDegrees>s.startAngle&&angleInDegrees<s.endAngle){
                            series=s;
                        }
                    }
                }
            }else{
                var seriesIndex=null;
                if(this.stacked){
                    for(var i=0,distance=null;i<d.length;++i){
                        var s=null;
                        for(var j=d[0].series.length;s==null&&j--;){
                            var temp=d[i].series[j];
                            if(isc.isA.Number(temp.value))s=temp;
                        }
                        if(s!=null){
                            if(distance==null){
                                distance=hypot(s.pieX-x,s.pieY-y);
                            }
                            if(distance<s.pieRadius&&(seriesIndex==null||
                                    s.pieRadius<d[seriesIndex].series[0].pieRadius))
                            {
                                seriesIndex=i;
                            }
                        }
                    }
                }else{
                    for(var i=0,distance=null;i<d.length;++i){
                        var s=null;
                        for(var j=d[0].series.length;s==null&&j--;){
                            var temp=d[i].series[j];
                            if(isc.isA.Number(temp.value))s=temp;
                        }
                        if(s!=null){
                            var dist=hypot(s.pieX-x,s.pieY-y);
                            if(distance==null||dist<distance){
                                distance=dist;
                                seriesIndex=i;
                            }
                        }
                    }
                }
                if(seriesIndex!=null){
                    var data=d[seriesIndex],
                        deltaY=y-data.series[0].pieY;
                        deltaX=x-data.series[0].pieX;
                        angleInDegrees=Math.atan2(deltaY,deltaX)*180/Math.PI;
                    if(angleInDegrees<0)angleInDegrees+=360;
                    for(var i=0;i<data.series.length;++i){
                        var s=data.series[i];
                        if(isc.isA.Number(s.value)){
                            if(angleInDegrees>=s.startAngle&&angleInDegrees<s.endAngle){
                                series=s;
                            }
                        }
                    }
                    facetValues[dataLabelFacetId]=d[seriesIndex].facetValueId;
                }
            }
            if(series==null){
                return null;
            }
            facetValues[legendFacetId]=series.facetValueId;
            if(valueFacet!=null){
                facetValues[valueFacet.id]=valueFacet.values[0].id;
            }
            return{
                x:Math.round(series.pieX),
                y:Math.round(series.pieY),
                value:series.value,
                text:(keepText?this.formatDataValue(series.value):null),
                facetValues:facetValues,
                record:series.record,
                startAngle:series.startAngle,
                endAngle:series.endAngle,
                radius:series.pieRadius,
                drawItemId:series.drawItemId
            };
        default:
            return null;
    }
}
);
isc.evalBoundary;isc.B.push(isc.A._getDrawnValueHelper=function isc_FacetChart__getDrawnValueHelper(facetValues,context,i,j){
    var res=this._getDrawnValue(context,i,j,true);
    if(res==null||
        (this.isPieChart(context.chartType)?
            (res.pieX==null||res.pieY==null):
            (res.drawnX==null||res.drawnY==null)))
    {
        return null;
    }
    var result={
        x:res.drawnX,
        y:res.drawnY,
        value:res.value,
        facetValues:facetValues,
        record:res.record
    };
    if(res.startAngle!=null){
        result.x=res.pieX;
        result.y=res.pieY;
        result.startAngle=res.startAngle;
        result.endAngle=res.endAngle;
        result.radius=res.pieRadius;
    }else if(res.barThickness!=null)result.barThickness=res.barThickness;
    return result;
}
,isc.A.getDrawnValue=function isc_FacetChart_getDrawnValue(facetValues,logWarnings,multiple){
    if(logWarnings==null)logWarnings=true;
    if(!this.isDrawn()){
        if(logWarnings)isc.logWarn("Chart should be drawn before requesting nearestDrawnValue.");
        return null;
    }
    var d=this.getOrderedData();
    var isMultiFacet=this.isMultiFacet();
    if(d.length==0)return null;
    var dataLabelFacet=this.getDataLabelFacet(),
        dataLabelFacetId=dataLabelFacet&&dataLabelFacet.id,
        legendFacet=this.getLegendFacet(),
        legendFacetId=legendFacet&&legendFacet.id,
        valueFacet=(this.inlinedFacet!=null&&
            this.inlinedFacet!=dataLabelFacet&&this.inlinedFacet!=legendFacet
            ?this.inlinedFacet:null),
        valueFacetId=valueFacet&&valueFacet.id,
        firstFacetId=(dataLabelFacet?dataLabelFacetId:legendFacetId),
        metric=null,
        isScatterChart=this.chartType=="Scatter";
    if(facetValues&&valueFacet&&!valueFacet.values.find("id",metric=facetValues[valueFacetId])){
        return null;
    }
    var context=this;
    if(this._hasExtraAxes()&&metric!=null){
        var i=this._getExtraAxisMetrics().indexOf(metric);
        if(i!=-1){
            context=this._getExtraAxisSettings().all[i];
        }
    }
    if(!multiple){
        if(!facetValues){
            if(logWarnings)isc.logWarn("FacetValues should be passed to get drawn value.");
            return null;
        }
        if((dataLabelFacet&&!facetValues.hasOwnProperty(dataLabelFacetId))||
            (legendFacet&&!facetValues.hasOwnProperty(legendFacetId))||
            (valueFacet&&!facetValues.hasOwnProperty(valueFacetId)))
        {
            return null;
        }
        for(var i=d.length;i--;){
            if(d[i].facetValueId==facetValues[firstFacetId]){
                if(isScatterChart){
                    if(d[i].series.length!=1){
                        return null;
                    }
                    return this._getDrawnValueHelper(facetValues,context,i,0);
                }else if(!isMultiFacet){
                    return this._getDrawnValueHelper(facetValues,context,i);
                }else{
                    for(var j=d[i].series.length;j--;){
                        if(d[i].series[j].facetValueId==facetValues[legendFacetId]){
                            return this._getDrawnValueHelper(facetValues,context,i,j);
                        }
                    }
                }
            }
        }
        return null;
    }else{
        var res,
            results=[],
            resFacetValues;
        for(var i=d.length;i--;){
            if(facetValues==null||
                facetValues[firstFacetId]==null||
                d[i].facetValueId==facetValues[firstFacetId])
            {
                if(isScatterChart){
                    for(var j=d[i].series.length;j--;){
                        resFacetValues={};
                        resFacetValues[firstFacetId]=d[i].facetValueId;
                        var dv=this._getDrawnValueHelper(resFacetValues,context,i,j);
                        if(dv!=null){
                            results.add(dv);
                        }
                    }
                }else if(!isMultiFacet){
                    resFacetValues={};
                    resFacetValues[firstFacetId]=d[i].facetValueId;
                    var dv=this._getDrawnValueHelper(resFacetValues,context,i);
                    if(dv!=null){
                        results.add(dv);
                    }
                }else{
                    for(var j=d[i].series.length;j--;){
                        if(facetValues==null||
                            facetValues[legendFacetId]==null||
                            d[i].series[j].facetValueId==facetValues[legendFacetId])
                        {
                            resFacetValues={};
                            resFacetValues[firstFacetId]=d[i].facetValueId;
                            resFacetValues[legendFacetId]=d[i].series[j].facetValueId;
                            var dv=this._getDrawnValueHelper(resFacetValues,context,i,j);
                            if(dv!=null){
                                results.add(dv);
                            }
                        }
                    }
                }
            }
        }
        return results;
    }
}
,isc.A.getDrawnValues=function isc_FacetChart_getDrawnValues(facetValues,logWarnings){
    return this.getDrawnValue(facetValues,logWarnings,true);
}
,isc.A._getDrawnValue=function isc_FacetChart__getDrawnValue(context,i,j,returnNullForWrongFixedFacetValue){
    var data=this.getOrderedData(),
        legendFacet=this.getLegendFacet(),
        isZoomChart=this._isZoomChart(),
        isZoomSelectionChart=this._isZoomSelectionChart(),
        isMainChart=!(isZoomChart||isZoomSelectionChart);
    if(context.chartType=="Scatter"){
        return(legendFacet?data[i].series[j]:data[i]);
    }
    var isMultiFacet=this.isMultiFacet(),
        isExtraAxisChart=(context!=this),
        extraAxisIndex;
    if(isExtraAxisChart){
        extraAxisIndex=this._getExtraAxisSettings().all.indexOf(context);
        if(isMultiFacet&&!context.isMultiFacet()){
            var fixedFacetValue=this._getFixedFacetValue(context),
                fixedFacetValueIndex=legendFacet.values.findIndex("id",fixedFacetValue.id);
            if(returnNullForWrongFixedFacetValue&&j!=null&&j!=fixedFacetValueIndex){
                return null;
            }else{
                j=fixedFacetValueIndex;
            }
        }
    }
    var obj=isMultiFacet?data[i].series[j]:data[i],
        record=obj.record;
    if(isExtraAxisChart){
        obj=((obj.drawn||(obj.drawn=[]))[extraAxisIndex]||(obj.drawn[extraAxisIndex]={}));
    }
    if(isZoomChart){
        obj=(obj.zoom||(obj.zoom={}));
    }else if(isZoomSelectionChart){
        obj=(obj.zoomSelection||(obj.zoomSelection={}));
    }
    obj.record=record;
    return obj;
}
,isc.A.mouseOut=function isc_FacetChart_mouseOut(){
    if(this._mouseOutOfDrawItemTimerEvent==null){
        var self=this;
        this._mouseOutOfDrawItemTimerEvent=isc.Timer.setTimeout(function(){
            delete self._mouseOutOfDrawItemTimerEvent;
            self._cleanHoverItems();
            self._unhoverValueAxisLabel();
        },100);
    }
    return true;
}
,isc.A.mouseOver=function isc_FacetChart_mouseOver(){
    if(this._mouseOutOfDrawItemTimerEvent!=null){
        isc.Timer.clear(this._mouseOutOfDrawItemTimerEvent);
        delete this._mouseOutOfDrawItemTimerEvent;
    }
    return true;
}
,isc.A.handleTouchMove=function isc_FacetChart_handleTouchMove(event){
    event.DOMevent.preventDefault();
}
,isc.A.mouseMove=function isc_FacetChart_mouseMove(){
    var data=this._getData();
    if(!isc.isAn.Array(data)||data.length==0||!this._hasFacetValues()){
        return;
    }
    var rect=this.getChartRect();
    if(rect==null){
        return;
    }
    var x=this.getOffsetX()-this.getLeftMargin()-this.getLeftPadding(),
        y=this.getOffsetY()-this.getTopMargin()-this.getTopPadding();
    if(x>=rect.left&&x<=rect.left+rect.width&&
        y>=rect.top&&y<=rect.top+rect.height)
    {
        var context=this._getShowValueOnHoverContext();
        if(context!=null){
            if(this._hoverLabel==null){
                this._hoverRect=isc.DrawRect.create(this.hoverRectProperties,{
                    autoDraw:true,
                    drawPane:this,
                    height:20,
                    width:24,
                    top:-100,
                    shadow:(this._showShadows(this)?
                        this.hoverRectProperties.shadow:null)
                });
                this._hoverLabel=isc.DrawLabel.create(this.hoverLabelProperties,{
                    autoDraw:true,
                    drawPane:this,
                    synchTextMove:true,
                    contents:"",
                    shadow:(this._showShadows(this)?
                        this.hoverLabelProperties.shadow:null)
                });
            }
            var nearestValue=this._getNearestDrawnValue(x,y,context,false,true);
            if(nearestValue!=null&&nearestValue.value==null)nearestValue.value=0;
            if(nearestValue!=null&&this._hoverLabel.contents!==nearestValue.value){
                var size=this.measureHoverLabel(nearestValue.text);
                if(this._hoverRect.drawingVML){
                    this._hoverRect.destroy();
                    this._hoverRect=isc.DrawRect.create(this.hoverRectProperties,{
                        autoDraw:true,
                        drawPane:this,
                        height:size.height+8,
                        width:size.width+8,
                        top:-300
                    });
                    this._hoverLabel.destroy();
                    this._hoverLabel=isc.DrawLabel.create(this.hoverLabelProperties,{
                        autoDraw:true,
                        drawPane:this,
                        synchTextMove:true,
                        contents:nearestValue.text
                    });
                }else{
                    this._hoverLabel.contents=nearestValue.text;
                    this._hoverRect.width=size.width+8;
                    this._hoverRect.height=size.height+8;
                }
                this._hoverLabel.draw();
                var rectLeft=nearestValue.x;
                var rectTop=nearestValue.y;
                switch(context.chartType){
                    case"Area":
                    case"Line":
                    case"Radar":
                        if(context.showDataPoints==true){
                        }
                        rectTop-=this._hoverRect.height+4;
                        rectLeft+=4;
                        break;
                    case"Bar":
                        rectTop-=this._hoverRect.height/2;
                        rectLeft-=this.hoverLabelOffset;
                        break;
                    case"Column":
                        rectTop-=this._hoverRect.height;
                        break;
                    case"Doughnut":
                    case"Pie":
                        var angle=(nearestValue.startAngle+nearestValue.endAngle)/2+90;
                        if(angle<0){
                            angle+=360;
                        }
                        var radialCoords=this._getRadialLabelCoordinates([nearestValue.x,nearestValue.y],this.maxRadius||nearestValue.radius,
                            angle,nearestValue.text,this.hoverLabelProperties);
                        rectLeft=radialCoords[0];
                        rectTop=radialCoords[1];
                }
                if(nearestValue.drawItemId){
                    var drawItem=window[nearestValue.drawItemId];
                    if(this._highlightedItem&&this._highlightedItem.ID!=drawItem.ID){
                        this._cleanHighlightedItem();
                    }
                    if(this._highlightedItem==null){
                        this._highlightedItem=drawItem;
                        if(drawItem.radius){
                            drawItem.setFillOpacity((100-this.brightenPercent)/100);
                        }else{
                            var color=drawItem.lineColor;
                            drawItem.prevLineColor=color;
                            color=this._getHighlightedColor(color,this.brightenPercent);
                            drawItem.setLineWidth(2);
                            drawItem.setLineColor(color);
                        }
                    }
                }
                if(rectLeft<0){
                    rectLeft=0;
                }else{
                    var innerContentWidth=this.getInnerContentWidth();
                    if((rectLeft+this._hoverRect.width)>innerContentWidth){
                        rectLeft=innerContentWidth-this._hoverRect.width-8;
                    }
                }
                if(rectTop<0){
                    rectTop=0;
                }else{
                    var innerContentHeight=this.getInnerContentHeight();
                    if((rectTop+this._hoverRect.height)>innerContentHeight){
                        rectTop=innerContentHeight-this._hoverRect.height-8;
                    }
                }
                var dy=4;
                if(isc.Browser.isFirefox)dy+=3;
                this._hoverLabel.moveTo(rectLeft+4,rectTop+dy);
                this._hoverRect.moveTo(rectLeft,rectTop);
            }else if(nearestValue==null){
                this._cleanHoverItems();
            }
        }else{
            this._cleanHoverItems();
        }
    }else if(this._getCanMoveAxes()){
        var settings=this._getExtraAxisSettings(),
            numAxes=1+settings.visible.length;
        for(var j=0;j<numAxes;++j){
            var context=(j==0?this:settings.visible[j-1]),
                left=this._getValueAxisLeft(context),
                right=left+context._totalValueAxisWidth;
            if(left<=x&&x<=right){
                if(context==this){
                    break;
                }
                var chartRectTop=rect.top,
                    chartRectBottom=chartRectTop+rect.height,
                    hover=(left<=x&&x<=right&&chartRectTop<=y&&y<=chartRectBottom),
                    valueAxisLabel=context._valueAxisLabel;
                if(!hover&&valueAxisLabel!=null){
                    var boundingBox=valueAxisLabel.getBoundingBox();
                    hover=(
                        (left<=x&&x<=right&&
                            (boundingBox[1]<=y||chartRectTop<=y)&&
                            (y<=boundingBox[3]||y<=chartRectBottom))||
                        (boundingBox[0]<=x&&x<=boundingBox[2]&&
                            boundingBox[1]<=y&&y<=boundingBox[3]));
                }
                if(hover){
                    this._hoverValueAxisLabel(context);
                    return;
                }
            }
        }
    }
    if(this._getCanMoveAxes()){
        this._unhoverValueAxisLabel();
    }
}
,isc.A._cleanHoverItems=function isc_FacetChart__cleanHoverItems(){
    if(this._hoverLabel!=null){
        this._hoverLabel.destroy();
        this._hoverRect.destroy();
        this._hoverLabel=null;
        this._hoverRect=null;
        if(this._highlightedItem)this._cleanHighlightedItem();
    }
}
,isc.A._cleanHighlightedItem=function isc_FacetChart__cleanHighlightedItem(){
    this._highlightedItem.setLineColor(this._highlightedItem.prevLineColor);
    this._highlightedItem.setLineWidth(1);
    delete this._highlightedItem.prevLineColor;
    if(this._highlightedItem.radius){
        this._highlightedItem.setFillOpacity(1.0);
    }
    delete this._highlightedItem;
}
,isc.A._getHighlightedColor=function isc_FacetChart__getHighlightedColor(color,percent){
    if(color.charAt(0)=="#"){
        color=color.substring(1,7);
    }
    var r=parseInt(color.substring(0,2),16);
    var g=parseInt(color.substring(2,4),16);
    var b=parseInt(color.substring(4,6),16);
    r=Math.min(255,r+Math.round((r*percent)/100));
    g=Math.min(255,g+Math.round((g*percent)/100));
    b=Math.min(255,b+Math.round((b*percent)/100));
    return"#"+(r>15?"":"0")+r.toString(16)
        +(g>15?"":"0")+g.toString(16)
        +(b>15?"":"0")+b.toString(16);
}
,isc.A._getHoverLabel=function isc_FacetChart__getHoverLabel(baseCache,index1,index2,context,value){
    var cache;
    if(index2!=null){
        cache=(baseCache[index1]||(baseCache[index1]={}))[index2];
    }else{
        cache=baseCache[index1];
    }
    if(cache!=null){
        return cache;
    }else if(value==null){
        return null;
    }else{
        var labelText=context.formatDataValue(value);
        cache=this.measureHoverLabel(labelText);
        cache.text=labelText;
        cache.value=value;
        if(index2!=null){
            baseCache[index1][index2]=cache;
        }else{
            baseCache[index1]=cache;
        }
        return cache;
    }
}
,isc.A.measureHoverLabel=function isc_FacetChart_measureHoverLabel(labelText){
    return this.measureLabel(labelText,this.hoverLabelProperties);
}
,isc.A.destroy=function isc_FacetChart_destroy(){
    if(this._contextMenu!=null){
        this._contextMenu.destroy();
        delete this._contextMenu;
    }
    this._cleanHoverItems();
    this.Super("destroy",arguments);
}
,isc.A._getDataType=function isc_FacetChart__getDataType(){
    if(this.labelCollapseMode=="numeric"){
        return"float";
    }else if(this.labelCollapseMode=="time"){
        return"date";
    }
    var minDataValue=this._getMinDataValue(),
        maxDataValue=this._getMaxDataValue();
    if(isc.isA.Number(minDataValue)&&isc.isA.Number(maxDataValue)){
        return"float";
    }else if(isc.isA.Date(minDataValue)&&isc.isA.Date(maxDataValue)){
        return"date";
    }else if(isc.isA.String(minDataValue)&&isc.isA.String(maxDataValue)){
        return"string";
    }
}
,isc.A._hasDiscreteDataValues=function isc_FacetChart__hasDiscreteDataValues(){
    var discrete=(
        this.chartType=="Bar"||this.chartType=="Column"||
        this.labelCollapseMode=="sample");
    if(!discrete){
        var dataType=this._getDataType();
        discrete=(dataType=="string"||dataType==null);
        if(!discrete){
            var sorted=this._dataIsSorted;
            if(sorted==null){
                sorted=true;
                var data=this.getOrderedData();
                for(var i=data.length,lastTitle=data[i-1].title;sorted&&i--;){
                    var title=data[i].title;
                    sorted=(title<=lastTitle);
                    lastTitle=title;
                }
                this._dataIsSorted=sorted;
            }
            discrete=!sorted;
        }
    }
    return discrete;
}
,isc.A._getMinDataValue=function isc_FacetChart__getMinDataValue(){
    var data=this.getOrderedData(),
        len=data.length;
    var i=0;
    while(i<len&&data[i].title==null)
        ++i;
    return data[(i==len?0:i)].title;
}
,isc.A._getMaxDataValue=function isc_FacetChart__getMaxDataValue(){
    var data=this.getOrderedData(),
        len=data.length;
    var i=len-1;
    while(i>=0&&data[i].title==null)
        --i;
    return data[(i==-1?len-1:i)].title;
}
,isc.A._delegateToParentChartMethods=function isc_FacetChart__delegateToParentChartMethods(){
    var obj={};
    var methods=[
        "getFacet",
        "getFacetValue",
        "getOrderedData",
        "getValue",
        "setData",
        "setFacets",
        "swapFacets",
        "getFacetData",
        "deriveFacetValues",
        "isMultiFacet",
        "getValueFromRecord",
        "getDataRecord",
        "getDataSeries",
        "getDefaultMetric",
        "getMinValue",
        "getMaxValue"];
    for(var i=0,len=methods.length;i<len;++i){
        var method=methods[i];
        obj[method]=(function(method){
            return function(){
                var parentChart=this._parentChart;
                return parentChart[method].apply(parentChart,arguments);
            };
        })(method);
    }
    obj.setupChart=function(){};
    return obj;
}
,isc.A._isZoomChart=function isc_FacetChart__isZoomChart(){
    return(this._parentChart!=null&&this._parentChart.zoomChart==this);
}
,isc.A._isZoomSelectionChart=function isc_FacetChart__isZoomSelectionChart(){
    return(this._parentChart!=null&&this._parentChart.zoomSelectionChart==this);
}
,isc.A._getData=function isc_FacetChart__getData(){
    return(this._parentChart||this).data;
}
,isc.A._getFacets=function isc_FacetChart__getFacets(){
    return(this._parentChart||this).facets;
}
,isc.A._getMetricFacet=function isc_FacetChart__getMetricFacet(){
    return(this._parentChart||this).metricFacet;
}
,isc.A._getMultiCellData=function isc_FacetChart__getMultiCellData(){
    return(this._parentChart||this).multiCellData;
}
,isc.A._getHighErrorMetric=function isc_FacetChart__getHighErrorMetric(){
    return(this._parentChart||this).highErrorMetric;
}
,isc.A._getLowErrorMetric=function isc_FacetChart__getLowErrorMetric(){
    return(this._parentChart||this).lowErrorMetric;
}
,isc.A._isDateValued=function isc_FacetChart__isDateValued(metricId){
    if(this.chartType=="Scatter"&&metricId!=this.getXAxisMetric()){
        return false;
    }
    var interfaceIsDateValued=isc.Chart.getPrototype()._isDateValued;
    return interfaceIsDateValued.apply(this._parentChart||this,arguments);
}
,isc.A.zoomTo=function isc_FacetChart_zoomTo(startValue,endValue){
    if(!this._getCanZoom()){
        return;
    }
    this._setZoomValueRange([{dataValue:startValue},{dataValue:endValue}],false);
    var range=this._getZoomValueRange();
    this.zoomStartValue=range[0].dataValue;
    this.zoomEndValue=range[1].dataValue;
    if(this.zoomChartSlider!=null){
        this.zoomChartSlider.setValues(range[0].lambda,range[1].lambda);
        this._refreshZoomSelectionChart();
    }
}
,isc.A.setZoomStartValue=function isc_FacetChart_setZoomStartValue(zoomStartValue){
    this.zoomTo(zoomStartValue,this.zoomEndValue);
}
,isc.A.setZoomEndValue=function isc_FacetChart_setZoomEndValue(zoomEndValue){
    this.zoomTo(this.zoomStartValue,zoomEndValue);
}
,isc.A._getZoomChartTop=function isc_FacetChart__getZoomChartTop(){
    return this.getTopPadding()+
        this.getChartTop()+
        this.getChartHeight()+
        this.chartRectMargin+
        this.getXLabelsHeight()+
        (this._legendRect?this.legendMargin+this._legendRect.height:0)+
        this._zoomChartMargin;
}
,isc.A._getZoomChartLeft=function isc_FacetChart__getZoomChartLeft(){
    return this.getLeftPadding()+this.getChartLeft();
}
,isc.A._setZoomChartProperties=function isc_FacetChart__setZoomChartProperties(){
    var zoomChartProps={
        autoDraw:false,
        redrawWithParent:false,
        _constructor:"FacetChart",
        labelCollapseMode:this._getZoomChartLabelCollapseMode(),
        _parentChart:this,
        extraAxisMetrics:this.extraAxisMetrics.duplicate(),
        extraAxisSettings:isc.clone(this.extraAxisSettings)
    };
    this._zoomChartProperties=isc.addProperties({
        colorMutePercent:this.zoomMutePercent
    },this.zoomChartProperties,zoomChartProps);
    this._zoomSelectionChartProperties=isc.addProperties({},this.zoomSelectionChartProperties,zoomChartProps);
    var lineOrAreaChart=(this.chartType=="Line"||this.chartType=="Area"),
        areaChart=lineOrAreaChart&&this.isFilled(),
        lineChart=lineOrAreaChart&&!areaChart;
    this.zoomChartDefaults.showInlineLabels=areaChart;
    this.zoomSelectionChartDefaults.showInlineLabels=areaChart;
    if(lineChart){
        this.zoomChartDefaults.showGradationsOverData=false;
        this.zoomSelectionChartDefaults.showGradationsOverData=false;
        var lineProps={lineWidth:2,lineColor:"#d3d3d3",linePattern:"dash"};
        this.zoomChartDefaults.gradationLineProperties=lineProps;
        this.zoomSelectionChartDefaults.gradationLineProperties=lineProps;
    }else{
        this.zoomChartDefaults.showGradationsOverData=true;
        this.zoomSelectionChartDefaults.showGradationsOverData=true;
        var lineProps={lineWidth:2,lineColor:this._getBackgroundColor()};
        this.zoomChartDefaults.gradationLineProperties=lineProps;
        this.zoomSelectionChartDefaults.gradationLineProperties=lineProps;
    }
}
,isc.A._createZoomChartAndSlider=function isc_FacetChart__createZoomChartAndSlider(){
    if(this._getCanZoom()){
        this._zoomChartNeedsRedraw=true;
        var zoomShowSelection=this.zoomShowSelection,
            left=this._getZoomChartLeft(),
            top=this._getZoomChartTop(),
            chartWidth=this.getChartWidth(),
            range=this._getZoomValueRange(),
            minLambda=range[0].lambda,maxLambda=range[1].lambda;
        var extraProperties=isc.addProperties({
            logScale:this._getZoomLogScale(),
            chartType:this.chartType,
            stacked:this.stacked,
            filled:this.filled,
            connected:this.connected
        },this._delegateToParentChartMethods());
        isc.addProperties(this._zoomChartProperties,{
            autoDraw:false,
            top:top,
            left:left,
            width:chartWidth,
            height:this.zoomChartHeight
        },extraProperties);
        var zoomChart=this.addAutoChild("zoomChart",this._zoomChartProperties);
        this._zoomChartSliderProperties=isc.addProperties({},this.zoomChartSliderProperties,{
            _constructor:"RangeSlider",
            left:left,
            top:top,
            width:chartWidth,
            height:this.zoomChartHeight+this._zoomChartSliderScrollbarHeight,
            showTrack:false,
            labelStartProperties:{},
            labelDragProperties:{},
            labelEndProperties:{},
            startThumbProperties:{backgroundColor:"transparent"},
            endThumbProperties:{backgroundColor:"transparent"},
            minValue:0,
            maxValue:1,
            startValue:minLambda,
            endValue:maxLambda
        });
        var slider=this.addAutoChild("zoomChartSlider",this._zoomChartSliderProperties);
        this.observe(slider,"resized","observer._refreshZoomSelectionChart()");
        this.observe(slider,"changed","observer._zoomChartSliderChanged(arguments[0],arguments[1],arguments[2])");
        slider.labelStart.hide();
        slider.labelDrag.hide();
        slider.labelEnd.hide();
        if(zoomShowSelection){
            var offset=slider.startThumb.getLeft();
            var selectionWidth=slider.endThumb.getRight()-offset+1;
            var zoomSelectionViewCanvas=this._zoomSelectionViewCanvas=isc.Canvas.create({
                redrawWithParent:false,
                backgroundColor:this._getBackgroundColor(),
                padding:0,
                left:left+offset,
                top:top,
                width:selectionWidth,
                height:this.zoomChartHeight,
                overflow:"hidden",
                hideUsingDisplayNone:true
            });
            this.addChild(zoomSelectionViewCanvas);
            isc.addProperties(this._zoomSelectionChartProperties,{
                autoParent:"none",
                left:-offset,
                top:0,
                width:chartWidth,
                height:this.zoomChartHeight
            },extraProperties);
            var zoomSelectionChart=this.addAutoChild("zoomSelectionChart",this._zoomSelectionChartProperties);
            zoomSelectionViewCanvas.addChild(zoomSelectionChart);
            slider.moveAbove(zoomSelectionViewCanvas);
        }
    }
    this._zoomChartCreated=true;
}
);
isc.evalBoundary;isc.B.push(isc.A._zoomChartSliderChanged=function isc_FacetChart__zoomChartSliderChanged(startValue,endValue,isDragging){
    this._refreshZoomSelectionChart();
    if(!isDragging){
        this._setZoomValueRange([{lambda:startValue},{lambda:endValue}],false);
        var range=this._getZoomValueRange(),
            zoomStartValue=this.zoomStartValue=range[0].dataValue,
            zoomEndValue=this.zoomEndValue=range[1].dataValue;
        if(this.zoomChanged){
            this.zoomChanged(zoomStartValue,zoomEndValue);
        }
    }
}
,isc.A._refreshZoomSelectionChart=function isc_FacetChart__refreshZoomSelectionChart(){
    var zoomChartSlider=this.zoomChartSlider,
        zoomShowSelection=this.zoomShowSelection,
        zoomSelectionChart=this.zoomSelectionChart,
        zoomSelectionViewCanvas=this._zoomSelectionViewCanvas;
    if(zoomShowSelection){
        var left=this.zoomChart.getLeft(),
            startThumb=zoomChartSlider.startThumb,
            endThumb=zoomChartSlider.endThumb,
            minX=startThumb.getLeft(),
            diffX=endThumb.getRight()-minX+1,
            maxX=minX+diffX;
        zoomSelectionViewCanvas.setLeft(left+minX);
        zoomSelectionViewCanvas.setWidth(diffX);
        zoomSelectionChart.setLeft(-minX);
    }
}
,isc.A._destroyZoomChartAndSlider=function isc_FacetChart__destroyZoomChartAndSlider(){
    if(this.zoomSelectionChart!=null){
        this.zoomSelectionChart.destroy();
        delete this.zoomSelectionChart;
    }
    if(this._zoomSelectionViewCanvas!=null){
        this._zoomSelectionViewCanvas.destroy();
        delete this._zoomSelectionViewCanvas;
    }
    if(this.zoomChartSlider!=null){
        this.ignore(this.zoomChartSlider,"changed");
        this.ignore(this.zoomChartSlider,"resized");
        this.zoomChartSlider.destroy();
        delete this.zoomChartSlider;
    }
    if(this.zoomChart!=null){
        this.zoomChart.destroy();
        delete this.zoomChart;
    }
    delete this._zoomChartCreated;
}
,isc.A._getCanZoom=function isc_FacetChart__getCanZoom(chartType){
    if(chartType==null)chartType=this.chartType;
    return(chartType!="Radar"&&!this.isPieChart(chartType)&&
            chartType!="Scatter"&&
            this.hasYGradations(chartType)&&this.canZoom);
}
,isc.A._getZoomChartLabelCollapseMode=function isc_FacetChart__getZoomChartLabelCollapseMode(){
    if(this.labelCollapseMode!=null){
        return this.labelCollapseMode;
    }else if(this._getCanZoom()){
        var type=this._getDataType();
        if(type=="float")return"numeric";
        if(type=="date")return"time";
        if(type=="string")return"sample";
    }
}
,isc.A._getZoomLogScale=function isc_FacetChart__getZoomLogScale(context){
    context=context||this;
    if(context.zoomLogScale!=null&&!context.zoomLogScale){
        return false;
    }else{
        var zoomBounds=this._getZoomDataBounds(context);
        return(zoomBounds.minValue>0);
    }
}
,isc.A._getZoomStartPosition=function isc_FacetChart__getZoomStartPosition(){
    if(this.zoomStartPosition!=null){
        return this.zoomStartPosition;
    }else{
        if(this._getDataType()=="date"){
           var day=1000*60*60*24,
               now=new Date(),
               lastDate=this._getMaxDataValue();
           if(now.getTime()-lastDate.getTime()<day){
               return"end";
           }
        }
        return"start";
    }
}
,isc.A._getZoomValueRange=function isc_FacetChart__getZoomValueRange(){
    var range;
    if(this._zoomValueRange==null){
        if(this._getCanZoom()){
            range=[{dataValue:this.zoomStartValue},{dataValue:this.zoomEndValue}];
        }else{
            range=[{lambda:0.0},{lambda:1.0}];
        }
        this._setZoomValueRange(range,true);
        this.zoomStartValue=range[0].dataValue;
        this.zoomEndValue=range[1].dataValue;
    }else{
        range=this._zoomValueRange;
    }
    return range;
}
,isc.A._dateComparator=function isc_FacetChart__dateComparator(date1,date2){
    return Date.compareDates(date2,date1);
}
,isc.A._setZoomValueRange=function isc_FacetChart__setZoomValueRange(range,dontRedraw){
    var data=this.getOrderedData(),
        len=data.length,
        min=range[0],max=range[1],
        minLambda=min.lambda,maxLambda=max.lambda,
        minDataValue=this._getMinDataValue(),
        maxDataValue=this._getMaxDataValue(),
        type=this._getDataType(),
        discrete=this._hasDiscreteDataValues(),
        byLambda=(min.lambda!=null&&max.lambda!=null),
        byDataValue=!byLambda;
    if(!(byLambda||discrete||max.dataValue==null||min.dataValue==null)&&
        max.dataValue<min.dataValue)
    {
        var swap=min.dataValue;
        min.dataValue=max.dataValue;
        max.dataValue=swap;
    }
    if(byDataValue){
        var zoomStartValue=min.dataValue,zoomEndValue=max.dataValue;
        if(!discrete){
            if(zoomStartValue<minDataValue||maxDataValue<zoomStartValue){
                zoomStartValue=null;
            }
            if(zoomEndValue<minDataValue||maxDataValue<zoomEndValue){
                zoomEndValue=null;
            }
        }
        if(zoomStartValue==null&&zoomEndValue==null){
            byLambda=true;
            byDataValue=false;
            var zoomStartPosition=this._getZoomStartPosition();
            if(zoomStartPosition=="start"){
                minLambda=0.0;
                maxLambda=1.0/5.0;
            }else if(zoomStartPosition=="end"){
                minLambda=4.0/5.0;
                maxLambda=1.0;
            }
            min.lambda=minLambda;
            max.lambda=maxLambda;
        }else if(zoomStartValue==null){
            zoomStartValue=minDataValue;
        }else if(zoomEndValue==null){
            zoomEndValue=maxDataValue;
        }
        min.dataValue=zoomStartValue;
        max.dataValue=zoomEndValue;
    }
    var i,j,startDataValue,endDataValue;
    if(discrete){
        if(byLambda){
            i=Math.floor(minLambda*(len-1));
            startDataValue=data[i].title;
            j=Math.ceil(maxLambda*(len-1));
            endDataValue=data[j].title;
        }else{
            startDataValue=min.dataValue;
            endDataValue=max.dataValue;
            var k=data.findIndex("title",startDataValue,Array.DATETIME_VALUES);
            if(k!=-1){
                i=k;
            }else{
                k=0;
            }
            k=data.findNextIndex(k,"title",endDataValue,len-1,Array.DATETIME_VALUES);
            if(k!=-1){
                j=k;
            }
            if(i==null&&j!=null){
                this.logWarn(
                        "Could not find data value "+startDataValue+" in the data.  "+
                        "Defaulting to show the data from the beginning of the data set up to zoomEndValue.");
                this._setZoomValueRange([{
                    dataValue:minDataValue
                },{
                    dataValue:endDataValue
                }],dontRedraw);
                return;
            }else if(i!=null&&j==null){
                this.logWarn(
                        "Could not find data value "+endDataValue+" in the data.  "+
                        "Defaulting to show the data from zoomStartValue to the end of the data set.");
                this._setZoomValueRange([{
                    dataValue:startDataValue
                },{
                    dataValue:maxDataValue
                }],dontRedraw);
                return;
            }else if(i==null&&j==null){
                this.logWarn(
                        "Could not find zoomStartValue or zoomEndValue in the data.  Defaulting to show "+
                        "the entire data set.");
                this._setZoomValueRange([{lambda:0.0},{lambda:1.0}],dontRedraw);
                return;
            }else{
                minLambda=len>1?i/(len-1):0;
                maxLambda=len>1?j/(len-1):1;
            }
        }
    }else if(type=="float"){
        if(byLambda){
            startDataValue=(1.0-minLambda)*minDataValue+minLambda*maxDataValue;
            endDataValue=(1.0-maxLambda)*minDataValue+maxLambda*maxDataValue;
        }else{
            startDataValue=min.dataValue;
            endDataValue=max.dataValue;
            var delta=maxDataValue-minDataValue;
            minLambda=(
                delta>0?
                    Math.max(0,Math.min(1,(min.dataValue-minDataValue)/delta)):0);
            maxLambda=(
                delta>0?
                    Math.max(0,Math.min(1,(max.dataValue-minDataValue)/delta)):1);
        }
        i=isc.FacetChart._binarySearch(data,0,len-1,"title",startDataValue);
        j=isc.FacetChart._binarySearch(data,0,len-1,"title",endDataValue);
        if(i<0)i=-(1+i);
        if(j<0)j=-(2+j);
    }else if(type=="date"){
        var comparator=this._dateComparator,
            minTime=minDataValue.getTime(),
            maxTime=maxDataValue.getTime();
        if(byLambda){
            startDataValue=new Date(Math.floor((1.0-minLambda)*minTime+minLambda*maxTime));
            endDataValue=new Date(Math.ceil((1.0-maxLambda)*minTime+maxLambda*maxTime));
        }else{
            startDataValue=min.dataValue;
            endDataValue=max.dataValue;
            var startTime=startDataValue.getTime(),
                endTime=endDataValue.getTime(),
                delta=maxTime-minTime;
            minLambda=(
                delta>0?
                    Math.max(0,Math.min(1,(startTime-minTime)/delta)):0);
            maxLambda=(
                delta>0?
                    Math.max(0,Math.min(1,(endTime-minTime)/delta)):1);
        }
        i=isc.FacetChart._binarySearch(data,0,len-1,"title",startDataValue,comparator);
        j=isc.FacetChart._binarySearch(data,0,len-1,"title",endDataValue,comparator);
        if(i<0)i=-(1+i);
        if(j<0)j=-(2+j);
    }
    isc.addProperties(range[0],{
        index:i,
        dataValue:startDataValue,
        lambda:minLambda
    });
    isc.addProperties(range[1],{
        index:j,
        dataValue:endDataValue,
        lambda:maxLambda
    });
    this._zoomValueRange=range;
    delete this._zoomDataBounds;
    if(this._hasExtraAxes()){
        var settings=this._getExtraAxisSettings().all;
        for(var j=settings.length;j--;){
            delete settings[j]._zoomDataBounds;
        }
    }
    if(!dontRedraw){
        this._redrawFacetChart(false);
    }
}
,isc.A._getZoomStartValue=function isc_FacetChart__getZoomStartValue(){
    return this._getZoomValueRange()[0].dataValue;
}
,isc.A._getZoomEndValue=function isc_FacetChart__getZoomEndValue(){
    return this._getZoomValueRange()[1].dataValue;
}
,isc.A._getZoomDataBounds=function isc_FacetChart__getZoomDataBounds(context){
    context=context||this;
    if(context._zoomDataBounds!=null){
        return context._zoomDataBounds;
    }
    var data=this.getOrderedData(),
        len=data.length,
        range=this._getZoomValueRange(),
        start=range[0].index,
        end=1+range[1].index;
    var isExtraAxisChart=(context!=this),
        extraAxisMetric=isExtraAxisChart&&context._metric,
        stacked=context.isMultiFacet()&&this.isStacked(context);
    var logScale=context.logScale;
    var minValue,maxValue;
    if(!(start<end)){
    }else if(this.isMultiFacet()&&(!isExtraAxisChart||context.isMultiFacet())){
        var numSeries=data[start].series.length;
        if(stacked){
            var isBarChart=(context.chartType=="Column"||context.chartType=="Bar");
            for(var i=start;i<end;++i){
                var series=data[i].series,value=0,
                    hasPositiveValue=false,
                    minPositiveValue=0,maxPositiveValue=0,
                    hasNegativeValue=false,
                    minNegativeValue=0,maxNegativeValue=0,
                    hasZeroFirst=false;
                for(var j=0;j<numSeries;++j){
                    var s=series[j],
                        v=(isExtraAxisChart?s.record&&s.record[extraAxisMetric]:s.value);
                    if(isc.isA.Number(v)){
                        if(isBarChart){
                            if(v>0){
                                if(!hasPositiveValue){
                                    minPositiveValue=v;
                                }
                                hasPositiveValue=true;
                                maxPositiveValue+=v;
                            }else if(!logScale){
                                if(v==0){
                                    hasZeroFirst=(hasZeroFirst||!(hasPositiveValue||hasNegativeValue));
                                }else{
                                    if(!hasNegativeValue){
                                        maxNegativeValue=v;
                                    }
                                    hasNegativeValue=true;
                                    minNegativeValue+=v;
                                }
                            }
                        }else{
                            value+=v;
                            if(!logScale||value>0){
                                minValue=(minValue==null?value:Math.min(minValue,value));
                                maxValue=(maxValue==null?value:Math.max(maxValue,value));
                            }
                        }
                    }
                }
                if(isBarChart&&(hasPositiveValue||hasNegativeValue)){
                    var minVal=0,maxVal=0;
                    if(hasPositiveValue&&hasNegativeValue){
                        minVal=minNegativeValue;
                        maxVal=maxPositiveValue;
                    }else if(hasPositiveValue){
                        minVal=(hasZeroFirst?0:minPositiveValue);
                        maxVal=maxPositiveValue;
                    }else if(hasNegativeValue){
                        minVal=minNegativeValue;
                        maxVal=(hasZeroFirst?0:maxNegativeValue);
                    }
                    minValue=(minValue==null?minVal:Math.min(minValue,minVal));
                    maxValue=(maxValue==null?maxVal:Math.max(maxValue,maxVal));
                }
            }
        }else{
            for(var i=start;i<end;++i){
                var series=data[i].series;
                for(var j=0;j<numSeries;++j){
                    var s=series[j],
                        value=(isExtraAxisChart?s.record&&s.record[extraAxisMetric]:s.value);
                    if(isc.isA.Number(value)&&(!logScale||value>0)){
                        minValue=(minValue==null?value:Math.min(minValue,value));
                        maxValue=(maxValue==null?value:Math.max(maxValue,value));
                    }
                }
            }
        }
    }else if(this.isMultiFacet()){
        var fixedFacetValue=this._getFixedFacetValue(context),
            seriesIndex=this.getLegendFacet().values.findIndex("id",fixedFacetValue.id);
        for(var i=start;i<end;++i){
            var s=data[i].series[seriesIndex],
                value=s.record&&s.record[extraAxisMetric];
            if(isc.isA.Number(value)&&(!logScale||value>0)){
                minValue=(minValue==null?value:Math.min(minValue,value));
                maxValue=(maxValue==null?value:Math.max(maxValue,value));
            }
        }
    }else{
        for(var i=start;i<end;++i){
            var s=data[i],
                value=(isExtraAxisChart?s.record&&s.record[extraAxisMetric]:s.value);
            if(isc.isA.Number(value)&&(!logScale||value>0)){
                minValue=(minValue==null?value:Math.min(minValue,value));
                maxValue=(maxValue==null?value:Math.max(maxValue,value));
            }
        }
    }
    if(start<end&&logScale&&minValue==null&&maxValue==null){
        minValue=maxValue=0;
    }
    var zoomDataBounds={
        minValue:minValue,
        maxValue:maxValue,
        minDataValue:this._getZoomStartValue(),
        maxDataValue:this._getZoomEndValue()
    };
    var metricFacet=this._getMetricFacet(context);
    if(!this._hasExtraAxes()&&metricFacet!=null){
        var lowErrorMetric=this._getLowErrorMetric(),
            highErrorMetric=this._getHighErrorMetric();
        if(lowErrorMetric!=null){
            this._minMaxWithErrorMetric(lowErrorMetric,zoomDataBounds,logScale);
        }
        if(highErrorMetric!=null){
            this._minMaxWithErrorMetric(highErrorMetric,zoomDataBounds,logScale);
        }
    }
    return(context._zoomDataBounds=zoomDataBounds);
}
,isc.A._getMinLabelGap=function isc_FacetChart__getMinLabelGap(vertical,props){
    if(this.minLabelGap!=null)return this.minLabelGap;
    if(vertical){
        return Math.ceil(this.measureLabel("Xy",props).height/2);
    }else{
        return this.measureLabel("XXXX",props).width;
    }
}
,isc.A._calculateAxisLayout=function isc_FacetChart__calculateAxisLayout(axes,horizontalAxis,availableWidth,availableHeight){
    var numAxes=axes.length,
        location=new Array(numAxes),
        axisMeasureCaches=new Array(numAxes),
        utilityCache=[];
    for(var j=numAxes;j--;){
        location[j]=0;
        axisMeasureCaches[j]=[];
    }
    var utilityFn=function(location,extra){
        return isc.FacetChart._objective(
            axisMeasureCaches,utilityCache,axes,
            horizontalAxis,location,availableWidth,availableHeight,extra);
    };
    var solution=isc.FacetChart._localSearch(axes,utilityFn,location),
        solutionFound=(solution!=null);
    var info={};
    utilityFn(location,info);
    return info;
}
,isc.A._createAxis=function isc_FacetChart__createAxis(vertical,context,minAxisWidth){
    var labelCollapseMode=this.labelCollapseMode,
        valueGradations=this.chartType=="Scatter"||
                (vertical&&this.hasYGradations())||(!vertical&&this.hasXGradations());
    var axis=null;
    if(valueGradations){
        if(this._showYGradations){
            var c=(isc.isAn.Array(context)?context[0]:context);
            if((c.chartType!="Scatter"||vertical)&&this.shouldUseLogGradations(c)){
                axis=isc.FacetChart._createLogGradationsAxis(vertical);
            }else{
                var primary=c.chartType!="Scatter"||vertical;
                axis=isc.FacetChart._createLinearGradationsAxis(
                    primary,vertical,
                    (!vertical&&(c.chartType=="Scatter"||this.hasXGradations())));
            }
        }else{
            axis=isc.FacetChart._createEmptyAxis(vertical);
        }
    }else{
        if(labelCollapseMode=="numeric"){
            axis=isc.FacetChart._createLabelCollapseModeNumericAxis(vertical);
        }else if(labelCollapseMode=="time"){
            axis=isc.FacetChart._createLabelCollapseModeTimeAxis(vertical);
        }else if(labelCollapseMode=="sample"){
            axis=isc.FacetChart._createLabelCollapseModeSampleAxis(vertical);
        }else{
            axis=isc.FacetChart._createLabelCollapseModeNoneAxis(vertical);
        }
    }
    axis.rotateLabels=function(measure){
        return measure._rotated;
    };
    axis.useGradations=function(measure){
        return measure._useGradations;
    };
    axis.logScale=function(measure){
        return measure._useGradations&&measure._logScale;
    };
    axis.init(this,context,minAxisWidth);
    return axis;
}
,isc.A._clickShape=function isc_FacetChart__clickShape(){
    var pane=this;
    if(this.drawPane){
        pane=this.drawPane;
    }
    if(!pane.getNearestDrawnValues)return;
    var res=pane.getNearestDrawnValues();
    if(pane.valueClick){
        pane.valueClick(res[0]);
    }
}
);
isc.B._maxIndex=isc.C+258;

isc.A=isc.FacetChart;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._SECONDS=1000;
isc.A._FIFTEEN_SECONDS=15000;
isc.A._THIRTY_SECONDS=30000;
isc.A._MINUTES=60000;
isc.A._FIVE_MINUTES=300000;
isc.A._QUARTER_HOURS=900000;
isc.A._HALF_HOURS=1800000;
isc.A._HOURS=3600000;
isc.A._DAYS=86400000;
isc.A._WEEKS=604800000;
isc.A._MONTHS=2592000000;
isc.A._QUARTERS=7776000000;
isc.A._YEARS=31536000000;
isc.B.push(isc.A._evenIndexOf=function isc_c_FacetChart__evenIndexOf(arr,obj,pos,endPos){
    pos=arr.indexOf(obj,pos,endPos);
    while(!(pos==-1||pos%2==0)){
        pos=arr.indexOf(obj,pos+1,endPos);
    }
    return pos;
}
,isc.A._oddIndexOf=function isc_c_FacetChart__oddIndexOf(arr,obj,pos,endPos){
    pos=arr.indexOf(obj,pos,endPos);
    while(!(pos==-1||pos%2==1)){
        pos=arr.indexOf(obj,pos+1,endPos);
    }
    return pos;
}
,isc.A._calculateOrdinaryLeastSquares=function isc_c_FacetChart__calculateOrdinaryLeastSquares(X,y){
    var XtX=isc.Math._dotAtA(X),
        L=isc.Math._cholesky(XtX);
    if(L==null){
        var Xplus=isc.Math._pseudoInv(X);
        if(Xplus==null){
            return null;
        }else{
            var m=Xplus.length,n=Xplus[0].length,
                b=new Array(m);
            for(var i=m;i--;){
                var Xplusi=Xplus[i],sum=0;
                for(var j=n;j--;){
                    sum+=Xplusi[j]*y[j];
                }
                b[i]=sum;
            }
            return b;
        }
    }
    var Xty=isc.Math._dotAtb(X,y);
    var n=L.length,z=new Array(n);
    for(var i=0;i<n;++i){
        var Li=L[i],
            sum=0;
        for(var j=i;j--;){
            sum+=Li[j]*z[j];
        }
        z[i]=(Xty[i]-sum)/Li[i];
    }
    var beta=new Array(n);
    for(var i=n;i--;){
        var sum=0;
        for(var j=i+1;j<n;++j){
            sum+=L[j][i]*beta[j];
        }
        beta[i]=(z[i]-sum)/L[i][i];
    }
    return beta;
}
,isc.A._generatePolynomial=function isc_c_FacetChart__generatePolynomial(beta){
    var degree=beta.length-1;
    var sb=isc.StringBuffer.newInstance();
    sb.append("return ");
    for(var i=degree;i--;){
        sb.append("(");
    }
    sb.append(beta[degree]);
    for(var i=degree;i--;){
        sb.append("*x+",beta[i],")");
    }
    sb.append(";");
    return isc._makeFunction("x",sb.toString());
}
,isc.A._calculateBestFitPolynomial=function isc_c_FacetChart__calculateBestFitPolynomial(degree,x,y){
    var m=x.length,n=degree+1,
        M=new Array(m);
    for(var i=m;i--;){
        var Mi=M[i]=new Array(n),
            xval=x[i];
        for(var j=0,powX=1;j<n;++j,powX*=xval){
            Mi[j]=powX;
        }
    }
    var coefficients=isc.FacetChart._calculateOrdinaryLeastSquares(M,y);
    return(coefficients!=null?isc.FacetChart._generatePolynomial(coefficients):null);
}
,isc.A._clipDrawPathToRect=function isc_c_FacetChart__clipDrawPathToRect(points,chartRect,round){
    var n=points.length;
    if(n==0){
        return[];
    }
    var bounds=[chartRect.left,chartRect.top,chartRect.left+chartRect.width,chartRect.top+chartRect.height],
        drawPaths=[],
        path=null,
        prevPoint,point=points[0],
        slope=new Array(2);
    if(bounds[0]<=point[0]&&point[0]<=bounds[2]&&bounds[1]<=point[1]&&point[1]<=bounds[2]){
        path=[point];
    }
    for(var i=1;i<n;++i){
        prevPoint=point;
        point=points[i];
        slope[0]=1/(slope[1]=(point[1]-prevPoint[1])/(point[0]-prevPoint[0]));
        var p0=prevPoint,p1=point;
        for(var m=0;m<4;++m){
            var k=m%2,l=(k+1)%2,s=(m<2?-1:1),bound=bounds[s+1+k];
            var p0WithinBound=!(s*p0[k]>s*bound),
                p1WithinBound=!(s*p1[k]>s*bound);
            if(p0WithinBound^p1WithinBound){
                var newPoint=new Array(2);
                newPoint[k]=bound;
                newPoint[l]=p0[l]+(bound-p0[k])*slope[l];
                if(!p0WithinBound){
                    p0=newPoint;
                }else{
                    p1=newPoint;
                }
            }else if(!(p0WithinBound||p1WithinBound)){
                p0=p1=null;
                break;
            }
        }
        if(p0==null){
        }else{
            if(p0===prevPoint){
            }else{
                if(round){
                    p0[0]=Math.round(p0[0]);
                    p0[1]=Math.round(p0[1]);
                }
                path=[p0];
            }
            if(p1===point){
                path.push(point);
            }else{
                if(round){
                    p1[0]=Math.round(p1[0]);
                    p1[1]=Math.round(p1[1]);
                }
                path.push(p1);
                drawPaths.push(path);
                path=null;
            }
        }
    }
    if(path!=null){
        drawPaths.push(path);
    }
    return drawPaths;
}
,isc.A._bellCurve=function isc_c_FacetChart__bellCurve(mu,sigma,x){
    var z=(x-mu)/sigma;
    return Math.exp(-z*z/2.0);
}
,isc.A._createEmptyAxis=function isc_c_FacetChart__createEmptyAxis(vertical){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            if(isc.isAn.Array(context)){
                this._context=context;
            }else{
                context=this._context=[context];
                minAxisWidth=[minAxisWidth];
            }
            this._minParallel=new Array(context.length);
            this._minPerpendicular=new Array(context.length);
            for(var j=context.length;j--;){
                this._minParallel[j]=(vertical?0:minAxisWidth[j]);
                this._minPerpendicular[j]=(vertical?minAxisWidth[j]:0);
            }
        },
        increaseScope:function(){return false;},
        decreaseScope:function(){return false;},
        measure:function(){
            var chart=this._chart,
                context=this._context,
                minValue,maxValue;
            for(var j=context.length;j--;){
                var c=context[j],
                    dataBounds=chart._getZoomDataBounds(c),
                    minVal=vertical?dataBounds.minValue:dataBounds.minDataValue,
                    maxVal=vertical?dataBounds.maxValue:dataBounds.maxDataValue;
                if(minVal!=null){
                    minValue=(minValue!=null?Math.min(minValue,minVal):minVal);
                }
                if(maxVal!=null){
                    maxValue=(maxValue!=null?Math.max(maxValue,maxVal):maxVal);
                }
            }
            this._minValue=minValue;
            this._maxValue=maxValue;
            return[{
                parallel:this._minParallel.duplicate(),
                perpendicular:this._minPerpendicular.duplicate(),
                _rotated:false,
                _useGradations:true,
                _logScale:this._context[0].logScale
            }];
        },
        utility:function(width,height,measure){return 1;},
        getLabelDataPairs:function(measure){
            var chart=this._chart,
                context=this._context,
                minValue=this._minValue,
                maxValue=this._maxValue;
            var dataValues=(
                    minValue==null||maxValue==null?[]:[minValue,maxValue]);
            var ret=new Array(context.length);
            for(var j=context.length;j--;){
                var c=context[j],
                    showAxis=!(c!=chart&&c.showAxis==false);
                ret[j]=new Array(dataValues.length);
                for(var i=dataValues.length;i--;){
                    ret[j][i]={
                        label:(showAxis?c.formatAxisValue(dataValues[i],!vertical):""),
                        dataValue:dataValues[i]
                    };
                }
            }
            return ret;
        },
        _getAxisStartValue:function(){
            var context=this._context,
                minValue=this._minValue,
                maxValue=this._maxValue;
            if(minValue==null||maxValue==null){
                return null;
            }else if(context[0].axisStartValue!=null){
                return context[0].axisStartValue;
            }else{
                return minValue;
            }
        },
        _getAxisEndValue:function(){
            var context=this._context,
                minValue=this._minValue,
                maxValue=this._maxValue;
            if(minValue==null||maxValue==null){
                return null;
            }else{
                return maxValue;
            }
        }
    };
}
,isc.A._createLinearGradationsAxis=function isc_c_FacetChart__createLinearGradationsAxis(primary,vertical,reserveSpaceForFirstAndLastLabels){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            if(isc.isAn.Array(context)){
                this._context=context;
            }else{
                context=this._context=[context];
                minAxisWidth=[minAxisWidth];
            }
            var isScatter=(chart.chartType=="Scatter"),
                isDateScatter=isScatter,
                defaultMetric=(isScatter?
                    (primary?chart.getYAxisMetric():chart.getXAxisMetric()):
                    chart.getDefaultMetric());
            for(var j=context.length;j--;){
                isDateScatter=isDateScatter&&chart._isDateValued(
                    context[j]==chart?defaultMetric:context[j]._metric);
            }
            this._isDateScatter=isDateScatter;
            this._minParallel=new Array(context.length);
            this._minPerpendicular=new Array(context.length);
            var minValue,maxValue;
            for(var j=context.length;j--;){
                this._minParallel[j]=(vertical?0:minAxisWidth[j]);
                this._minPerpendicular[j]=(vertical?minAxisWidth[j]:0);
                var minVal,maxVal;
                if(isScatter){
                    var minMaxVals=chart._getMultiMinMaxValues(primary,context[j]);
                    minVal=minMaxVals.minValue;
                    maxVal=minMaxVals.maxValue;
                }else{
                    var dataBounds=chart._getZoomDataBounds(context[j]);
                    minVal=primary?dataBounds.minValue:dataBounds.minDataValue;
                    maxVal=primary?dataBounds.maxValue:dataBounds.maxDataValue;
                }
                if(minVal!=null){
                    if(minValue==null){
                        minValue=minVal;
                    }else if(isDateScatter){
                        minValue=isc.DateUtil._min(minValue,minVal);
                    }else{
                        minValue=Math.min(minValue,minVal);
                    }
                }
                if(maxVal!=null){
                    if(maxValue==null){
                        maxValue=maxVal;
                    }else if(isDateScatter){
                        maxValue=isc.DateUtil._max(maxValue,maxVal);
                    }else{
                        maxValue=Math.max(maxValue,maxVal);
                    }
                }
            }
            var isEmptyChart=(minValue==null||maxValue==null);
            if(!isEmptyChart){
                var definedAxisStartValue=chart._getAxisStartValue(primary,minValue,maxValue,null,context[0]);
                if(isDateScatter){
                    isEmptyChart=(
                        isc.isA.Date(definedAxisStartValue)&&
                        definedAxisStartValue.getTime()>maxValue.getTime());
                }else{
                    isEmptyChart=(
                        definedAxisStartValue!=null&&definedAxisStartValue>maxValue);
                }
            }
            this._isEmptyChart=isEmptyChart;
            if(isEmptyChart){
                return;
            }
            this._minValue=minValue;
            this._maxValue=maxValue;
            if(isDateScatter){
                isc.addProperties(this,isc.FacetChart._getDateAxisConstants(chart,context));
                this._possibleIncrements=isc.FacetChart._getPossibleDateScopes(0);
            }else{
                this._props=new Array(context.length);
                this._labelHeight=new Array(context.length);
                for(var j=context.length;j--;){
                    var c=context[j],
                        showAxis=!(c!=chart&&c.showAxis==false);
                    if(showAxis){
                        this._props[j]=c.gradationLabelProperties;
                        this._labelHeight[j]=chart._getGradationLabelHeight(c);
                    }
                }
                this._possibleIncrements=chart._getPossibleIncrements(
                    primary,minValue,maxValue,context[0]);
            }
            this._index=Math.floor((this._possibleIncrements.length-1)/2);
        },
        increaseScope:function(){
            if(this._isEmptyChart)return false;
            var flag=this._index<this._possibleIncrements.length-1;
            if(flag)++this._index;
            return flag;
        },
        decreaseScope:function(){
            if(this._isEmptyChart)return false;
            var flag=this._index>0;
            if(flag)--this._index;
            return flag;
        },
        measure:function(){
            var isDateScatter=this._isDateScatter,
                context=this._context;
            if(this._isEmptyChart){
                var gradations=new Array(context.length);
                for(var j=context.length;j--;){
                    gradations[j]=[];
                }
                var ret={
                    parallel:this._minParallel.duplicate(),
                    perpendicular:this._minPerpendicular.duplicate(),
                    _rotated:false,
                    _gradations:gradations,
                    _axisStartValue:null,
                    _axisEndValue:null,
                    _useGradations:true,
                    _logScale:false
                };
                if(reserveSpaceForFirstAndLastLabels){
                    ret._reserveLeft=ret._reserveRight=0;
                }
                if(isDateScatter){
                    var labels=new Array(context.length);
                    for(var j=context.length;j--;){
                        labels[j]=[];
                    }
                    ret._labels=labels;
                }
                return[ret];
            }
            var chart=this._chart,
                showInlineLabels=!primary&&chart.showInlineLabels,
                minValue=this._minValue,
                maxValue=this._maxValue,
                increment=this._possibleIncrements[this._index];
            var info=chart._getAxisBoundaryValues(primary,minValue,maxValue,increment,context[0]);
            var base=info.startValue,
                ceil=info.endValue,
                bm=info.b,
                cm=info.c,
                numGradations=info.numGradations,
                oneGradationLabel=info.oneGradationLabel,
                zero=isDateScatter&&info.zero,
                scale=(numGradations>1&&
                    (isDateScatter?0:(ceil-base)/((cm-bm)*increment)));
            var cutoff=1.5*Math.max(chart._getAvailableWidth(),chart._getAvailableHeight()),
                forceRotateLabels=(chart.rotateLabels=="always"&&!showInlineLabels),
                tryRotatingLabels=chart._canRotateLabels(),
                parallelLengthIsHeight=(vertical||(tryRotatingLabels&&!showInlineLabels)),
                parallelLengthIsWidth=!(vertical||forceRotateLabels),
                cutoffHeight=!parallelLengthIsHeight,
                cutoffWidth=!parallelLengthIsWidth;
            var gradations=null,
                dateScatterInfo=null;
            if(isDateScatter){
                var basePrime=isc.FacetChart._dateCeil(increment,base);
                dateScatterInfo=isc.FacetChart._getDateAxisLabels(
                    this,chart,increment,basePrime,ceil,cutoff,parallelLengthIsHeight,
                    parallelLengthIsWidth,false,true);
                gradations=dateScatterInfo.pairs.getProperty("dataValue");
                numGradations=gradations.length;
            }else{
                gradations=new Array(numGradations);
                for(var i=numGradations;i--;){
                    gradations[i]=((bm+i)*increment);
                }
            }
            var retParallel1=parallelLengthIsHeight&&new Array(context.length),
                retPerpendicular1=parallelLengthIsHeight&&new Array(context.length),
                retParallel2=parallelLengthIsWidth&&new Array(context.length),
                retPerpendicular2=parallelLengthIsWidth&&new Array(context.length),
                dataAndChartRectMargin=chart._getDataAndChartRectMargin(vertical);
            for(var j=context.length;j--;){
                var c=context[j],
                    showAxis=!(c!=this&&c.showAxis==false);
                if(!showAxis){
                    if(parallelLengthIsHeight){
                        retParallel1[j]=retPerpendicular1[j]=0;
                    }
                    if(parallelLengthIsWidth){
                        retParallel2[j]=retPerpendicular2[j]=0;
                    }
                    continue;
                }
                var props=this._props[j],
                    sumHeight=0,maxWidth=0,sumWidth=0,maxHeight=0;
                if(isDateScatter){
                    sumHeight=dateScatterInfo.sumHeight[j];
                    maxWidth=dateScatterInfo.maxWidth[j];
                    sumWidth=dateScatterInfo.sumWidth[j];
                    maxHeight=dateScatterInfo.maxHeight[j];
                }else{
                    var minHorizontalLabelGap=chart._getMinLabelGap(false,props),
                        minVerticalLabelGap=chart._getMinLabelGap(true,props),
                        labelHeight=this._labelHeight[j],
                        maxLabelWidth=0,
                        maxLabelWidthBetweenGradations=0;
                    if(!cutoffHeight&&numGradations>1){
                        cutoffHeight=Math.ceil(
                                scale*
                                Math.max(chart.pixelsPerGradation,labelHeight+minVerticalLabelGap)*
                                (numGradations-1))>cutoff;
                    }
                    var prevLabelWidth=0;
                    for(var i=0;i<numGradations;++i){
                        var gradation=gradations[i];
                        if(!(cutoffHeight&&cutoffWidth)&&!(oneGradationLabel&&i>0)){
                            var labelWidth=chart.measureLabel(c.formatAxisValue(gradation,!vertical),props).width;
                            if(!showInlineLabels){
                                var sum=Math.ceil((labelWidth+prevLabelWidth)/2);
                                if(sum>maxLabelWidthBetweenGradations){
                                    maxLabelWidthBetweenGradations=sum;
                                }
                                maxLabelWidth=Math.max(maxLabelWidth,labelWidth);
                                prevLabelWidth=labelWidth;
                            }else{
                                if(i!=numGradations-1&&labelWidth>maxLabelWidthBetweenGradations){
                                    maxLabelWidthBetweenGradations=labelWidth;
                                }
                            }
                            if(!cutoffWidth&&numGradations>1){
                                cutoffWidth=Math.ceil(
                                        scale*
                                        Math.max(chart.pixelsPerGradation,maxLabelWidthBetweenGradations+minHorizontalLabelGap)*
                                        (numGradations-1))>cutoff;
                            }
                        }
                    }
                    if(numGradations>1){
                        sumHeight=Math.ceil(
                            scale*
                            Math.max(chart.pixelsPerGradation,labelHeight+minVerticalLabelGap)*
                            (numGradations-1));
                        sumWidth=Math.ceil(
                            scale*
                            Math.max(chart.pixelsPerGradation,maxLabelWidthBetweenGradations+minHorizontalLabelGap)*
                            (numGradations-1));
                    }else{
                        sumWidth=sumHeight=0;
                    }
                    maxWidth=maxLabelWidth;
                    maxHeight=labelHeight;
                }
                maxHeight=(showInlineLabels?0:maxHeight);
                if(parallelLengthIsHeight){
                    var reserveLeft1=0,reserveRight1=0;
                    if(reserveSpaceForFirstAndLastLabels){
                        reserveLeft1=reserveRight1=Math.max(0,Math.ceil(maxHeight/2)-dataAndChartRectMargin);
                    }
                    retParallel1[j]=reserveLeft1+reserveRight1+Math.max(sumHeight,this._minParallel[j]);
                    retPerpendicular1[j]=Math.max(maxWidth,this._minPerpendicular[j]);
                }
                if(parallelLengthIsWidth){
                    var reserveLeft2=0,reserveRight2=0;
                    if(reserveSpaceForFirstAndLastLabels){
                        var firstLabel,lastLabel;
                        if(isDateScatter){
                            firstLabel=dateScatterInfo.pairs.first();
                            lastLabel=dateScatterInfo.pairs.last();
                        }else{
                            firstLabel=c.formatAxisValue(gradations.first(),!vertical);
                            lastLabel=c.formatAxisValue(gradations.last(),!vertical);
                        }
                        var firstLabelWidth=chart.measureLabel(firstLabel,props).width,
                            lastLabelWidth=chart.measureLabel(lastLabel,props).width;
                        reserveLeft2=Math.max(0,Math.ceil(firstLabelWidth/2)-dataAndChartRectMargin);
                        reserveRight2=Math.max(0,Math.ceil(lastLabelWidth/2)-dataAndChartRectMargin);
                    }
                    retParallel2[j]=reserveLeft2+reserveRight2+Math.max(sumWidth,this._minParallel[j]);
                    retPerpendicular2[j]=Math.max(maxHeight,this._minPerpendicular[j]);
                }
            }
            var retGradations;
            if(parallelLengthIsHeight||parallelLengthIsWidth){
                retGradations=new Array(context.length);
                for(var j=context.length;j--;){
                    retGradations[j]=gradations;
                }
            }
            var ret=[];
            if(parallelLengthIsHeight){
                var m={
                    parallel:retParallel1,
                    perpendicular:retPerpendicular1,
                    _rotated:!vertical&&tryRotatingLabels,
                    _gradations:retGradations,
                    _b:bm,
                    _c:cm,
                    _axisStartValue:base,
                    _axisEndValue:ceil,
                    _oneGradationLabel:oneGradationLabel,
                    _useGradations:true,
                    _logScale:false,
                    _cutoff:(cutoffHeight&&cutoffWidth),
                    _isDateScatter:isDateScatter
                };
                if(reserveSpaceForFirstAndLastLabels){
                    m._reserveLeft=reserveLeft1;
                    m._reserveRight=reserveRight1;
                }
                if(isDateScatter){
                    m._zero=zero;
                    m._labelDataPairs=dateScatterInfo.pairs;
                }
                ret.push(m);
            }
            if(parallelLengthIsWidth){
                var m={
                    parallel:retParallel2,
                    perpendicular:retPerpendicular2,
                    _rotated:false,
                    _gradations:retGradations,
                    _b:bm,
                    _c:cm,
                    _axisStartValue:base,
                    _axisEndValue:ceil,
                    _oneGradationLabel:oneGradationLabel,
                    _useGradations:true,
                    _logScale:false,
                    _cutoff:(cutoffHeight&&cutoffWidth),
                    _isDateScatter:isDateScatter
                };
                if(reserveSpaceForFirstAndLastLabels){
                    m._reserveLeft=reserveLeft2;
                    m._reserveRight=reserveRight2;
                }
                if(isDateScatter){
                    m._zero=zero;
                    m._labelDataPairs=dateScatterInfo.pairs;
                }
                ret.push(m);
            }
            return ret;
        },
        utility:function(width,height,measure){
            if(this._isEmptyChart)return 1.0;
            var chart=this._chart,
                gradations=measure._gradations[0],
                numGradations=gradations.length;
            if(measure._isDateScatter){
                var u1=(1.0-this._index/this._possibleIncrements.length),
                    u2=(numGradations>0?1:0);
                return(u1+u2)/2;
            }
            var axisLength=(vertical?height:width)[0],
                valueRange=this._valueRange,
                gradationsRange=gradations.last()-gradations.first();
            if(reserveSpaceForFirstAndLastLabels){
                axisLength-=measure._reserveLeft+measure._reserveRight;
            }
            var base=measure._axisStartValue,
                b=measure._b,
                c=measure._c;
            var pixelsPerGradation=axisLength,
                u5=1.0;
            if(c>b){
                var increment=gradations[1]-gradations[0],
                    ceil=measure._axisEndValue,
                    axisLengthBetweenGradations=axisLength*(
                        gradationsRange/(ceil-base));
                pixelsPerGradation=axisLengthBetweenGradations/(numGradations-1);
                u5=(1-2/increment*Math.abs(base-increment*Math.round(base/increment)));
            }
            var deltaPixelsPerGradation=Math.abs(pixelsPerGradation-chart.pixelsPerGradation),
                maxDeltaPixelsPerGradation=Math.max(
                    chart.pixelsPerGradation,axisLength-chart.pixelsPerGradation);
            var u1=(measure._cutoff?0:1),
                u2=(measure._rotated?0:1),
                u3=isc.FacetChart._bellCurve(chart.pixelsPerGradation,3.0,pixelsPerGradation),
                u4=1-deltaPixelsPerGradation/maxDeltaPixelsPerGradation;
            return(u1+u2+u3+u4+u5)/5;
        },
        getLabelDataPairs:function(width,height,measure){
            var chart=this._chart,
                context=this._context,
                oneGradationLabel=measure._oneGradationLabel;
            if(measure._isDateScatter){
                var ret=new Array(context.length);
                for(var i=context.length;i--;){
                    ret[i]=measure._labelDataPairs;
                }
                return ret;
            }else{
                return context.map(function(c,j){
                    var showAxis=!(c!=chart&&c.showAxis==false);
                    return measure._gradations[j].map(function(gradation,i){
                        var label=(showAxis&&(!oneGradationLabel||i==0)?
                                c.formatAxisValue(gradation,!vertical):"");
                        return{label:label,dataValue:gradation};
                    });
                });
            }
        },
        _getAxisStartValue:function(width,height,measure){
            return measure._axisStartValue;
        },
        _getAxisEndValue:function(width,height,measure){
            return measure._axisEndValue;
        }
    };
}
,isc.A._createLogGradationsAxis=function isc_c_FacetChart__createLogGradationsAxis(vertical){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            if(isc.isAn.Array(context)){
                this._context=context;
            }else{
                context=this._context=[context];
                minAxisWidth=[minAxisWidth];
            }
            this._minParallel=new Array(context.length);
            this._minPerpendicular=new Array(context.length);
            var minValue,maxValue;
            for(var i=context.length;i--;){
                this._minParallel[i]=(vertical?0:minAxisWidth[i]);
                this._minPerpendicular[i]=(vertical?minAxisWidth[i]:0);
                var minVal,maxVal;
                if(chart.chartType=="Scatter"){
                    var minMaxVals=chart._getMultiMinMaxValues(true,context[i]);
                    minVal=minMaxVals.minValue;
                    maxVal=minMaxVals.maxValue;
                }else{
                    var dataBounds=chart._getZoomDataBounds(context[i]);
                    minVal=dataBounds.minValue;
                    maxVal=dataBounds.maxValue;
                }
                if(minVal!=null){
                    minValue=(minValue!=null?Math.min(minValue,minVal):minVal);
                }
                if(maxVal!=null){
                    maxValue=(maxValue!=null?Math.max(maxValue,maxVal):maxVal);
                }
            }
            this._isEmptyChart=(minValue==null&&maxValue==null);
            this._props=new Array(context.length);
            this._minHorizontalLabelGap=new Array(context.length);
            this._minVerticalLabelGap=new Array(context.length);
            this._gradations=new Array(context.length);
            this._labelHeight=new Array(context.length);
            for(var i=context.length;i--;){
                var c=context[i],
                    showAxis=!(c!=chart&&c.showAxis==false);
                if(showAxis){
                    var props=this._props[i]=c.gradationLabelProperties;
                    this._minHorizontalLabelGap[i]=chart._getMinLabelGap(false,props);
                    this._minVerticalLabelGap[i]=chart._getMinLabelGap(true,props);
                    this._gradations[i]=chart.getLogGradations(maxValue,minValue,null,c);
                    this._labelHeight[i]=chart._getGradationLabelHeight(c);
                }
            }
        },
        increaseScope:function(){return false;},
        decreaseScope:function(){return false;},
        measure:function(){
            if(this._isEmptyChart){
                return[{
                    parallel:this._minParallel.duplicate(),
                    perpendicular:this._minPerpendicular.duplicate(),
                    _rotated:false,
                    _useGradations:true,
                    _logScale:true
                }];
            }
            var chart=this._chart,
                showInlineLabels=chart.showInlineLabels,
                forceRotateLabels=(chart.rotateLabels=="always"&&!showInlineLabels),
                tryRotatingLabels=chart._canRotateLabels(),
                context=this._context,
                ret=[];
            var minLog=chart.logValue(context[0]._axisStartValue,null,context[0]),
                maxLog=chart.logValue(context[0]._axisEndValue,null,context[0]);
            for(var j=context.length;j-->1;){
                minLog=Math.min(
                    minLog,
                    chart.logValue(context[j]._axisStartValue,null,context[j]));
                maxLog=Math.max(
                    maxLog,
                    chart.logValue(context[j]._axisEndValue,null,context[j]));
            }
            if(vertical||(tryRotatingLabels&&!showInlineLabels)){
                var retParallel=new Array(context.length),
                    retPerpendicular=new Array(context.length);
                for(var j=context.length;j--;){
                    var c=context[j],
                        showAxis=!(c!=chart&&c.showAxis==false);
                    if(!showAxis){
                        retParallel[j]=retPerpendicular[j]=0;
                        continue;
                    }
                    var props=this._props[j],
                        gradations=this._gradations[j],
                        numGradations=gradations.getLength(),
                        minHorizontalLabelGap=this._minHorizontalLabelGap[j],
                        minVerticalLabelGap=this._minVerticalLabelGap[j],
                        labelHeight=this._labelHeight[j];
                    var logGradations=c.logGradations,delta;
                    for(var i=0;i<logGradations.getLength();++i){
                        var d=chart.logValue(gradations[i+1],null,c)
                                -chart.logValue(gradations[i],null,c);
                        if(delta==null||d<delta){
                            delta=d;
                        }
                    }
                    var maxWidth=0;
                    for(var i=0;i<numGradations;++i){
                        maxWidth=Math.max(
                            chart.measureLabel(c.formatAxisValue(gradations[i],!vertical),props).width,
                            maxWidth);
                    }
                    retParallel[j]=Math.max(
                            Math.ceil((labelHeight+minVerticalLabelGap)*(maxLog-minLog)/delta),
                            this._minParallel[j]);
                    retPerpendicular[j]=Math.max(maxWidth,this._minPerpendicular[j]);
                }
                ret.push({
                    parallel:retParallel,
                    perpendicular:retPerpendicular,
                    _rotated:!vertical&&tryRotatingLabels,
                    _useGradations:true,
                    _gradations:this._gradations,
                    _logScale:true
                });
            }
            if(!(vertical||forceRotateLabels)){
                var retParallel=new Array(context.length),
                    retPerpendicular=new Array(context.length);
                for(var j=context.length;j--;){
                    var c=context[j],
                        showAxis=!(c!=this&&c.showAxis==false);
                    if(!showAxis){
                        retParallel[j]=retPerpendicular[j]=0;
                        continue;
                    }
                    var props=this._props[j],
                        gradations=this._gradations[j],
                        numGradations=gradations.getLength(),
                        minHorizontalLabelGap=this._minHorizontalLabelGap[j],
                        minVerticalLabelGap=this._minVerticalLabelGap[j],
                        labelHeight=this._labelHeight[j];
                    var max=0.0,
                        prevW=chart.measureLabel(c.formatAxisValue(gradations[0],!vertical),props).width,
                        prevLogValue=chart.logValue(gradations[0],null,c);
                    for(var i=1;i<numGradations;++i){
                        var w=chart.measureLabel(c.formatAxisValue(gradations[i],!vertical),props).width,
                            logValue=chart.logValue(gradations[i],null,c),
                            delta=logValue-prevLogValue,
                            m;
                        if(!showInlineLabels){
                            m=Math.ceil(((prevW+w)/2.0+minHorizontalLabelGap)*(maxLog-minLog)/delta);
                        }else if(i!=numGradations-1){
                            m=Math.ceil((w+minHorizontalLabelGap)*(maxLog-minLog)/delta);
                        }
                        max=Math.max(max,m);
                        prevW=w;
                        prevLogValue=logValue;
                    }
                    retParallel[j]=Math.max(max,this._minParallel[j]);
                    retPerpendicular[j]=Math.max((showInlineLabels?0:labelHeight),this._minPerpendicular[j]);
                }
                ret.push({
                    parallel:retParallel,
                    perpendicular:retPerpendicular,
                    _rotated:false,
                    _useGradations:true,
                    _gradations:this._gradations,
                    _logScale:true
                });
            }
            return ret;
        },
        utility:function(width,height,measure){
            return measure._rotated?0.5:1.0;
        },
        getLabelDataPairs:function(width,height,measure){
            if(this._isEmptyChart){
                return[[]];
            }
            var chart=this._chart,
                context=this._context;
            return this._gradations.map(function(gradations,j){
                var c=context[j],
                    showAxis=!(c!=chart&&c.showAxis==false);
                return gradations.map(function(gradation){
                    return{
                        label:(showAxis?c.formatAxisValue(gradation,!vertical):""),
                        dataValue:gradation
                    };
                });
            });
        },
        _getAxisStartValue:function(width,height,measure){
            return this._context[0]._axisStartValue;
        },
        _getAxisEndValue:function(width,height,measure){
            return this._context[0]._axisEndValue;
        }
    };
}
,isc.A._createLabelCollapseModeNoneAxis=function isc_c_FacetChart__createLabelCollapseModeNoneAxis(vertical){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            this._data=chart.getOrderedData();
            this._props=chart.dataLabelProperties;
            this._labelHeight=chart.getDataLabelHeight();
        },
        increaseScope:function(){return false;},
        decreaseScope:function(){return false;},
        measure:function(){
            var chart=this._chart,
                showInlineLabels=chart.showInlineLabels,
                data=this._data,
                props=this._props,
                len=data.getLength(),
                maxAdjacentLabelWidthsAvg,
                maxWidth=0,
                maxHeight=this._labelHeight,
                dataAndChartRectMargin=chart._getDataAndChartRectMargin(vertical),
                reserveLeft1=(vertical?0:Math.max(0,Math.ceil(maxHeight/2)-dataAndChartRectMargin)),
                reserveRight1=reserveLeft1,
                reserveLeft2=0,reserveRight2=0;
            var adjacentLabelWidthsSum=0,
                maxAdjacentLabelWidthsSum=0,
                prevLabelWidth=0;
            for(var i=0;i<len;++i){
                var label=data[i].title;
                var labelWidth=chart.measureLabel(label,props).width;
                if(i==0||i==len-1){
                    var halfLabelWidth=Math.ceil(labelWidth/2);
                    if(i==0){
                        reserveLeft2=Math.max(0,halfLabelWidth-dataAndChartRectMargin);
                    }else{
                        reserveRight2=Math.max(0,halfLabelWidth-dataAndChartRectMargin);
                    }
                }
                if(labelWidth>maxWidth)maxWidth=labelWidth;
                adjacentLabelWidthsSum+=labelWidth;
                if(adjacentLabelWidthsSum>maxAdjacentLabelWidthsSum)maxAdjacentLabelWidthsSum=adjacentLabelWidthsSum;
                adjacentLabelWidthsSum-=prevLabelWidth;
                prevLabelWidth=labelWidth;
            }
            var minLabelGap=chart._getMinLabelGap(vertical,props);
            maxAdjacentLabelWidthsAvg=Math.ceil(minLabelGap+maxAdjacentLabelWidthsSum/2);
            var sumWidth=0,sumHeight=0;
            if(chart.chartType=="Area"||chart.chartType=="Line"){
                sumWidth=(len-1)*maxAdjacentLabelWidthsAvg;
                sumHeight=(len-1)*maxHeight;
            }else{
                sumWidth=len*maxAdjacentLabelWidthsAvg-minLabelGap;
                sumHeight=len*maxHeight;
            }
            if(chart._isZoomChart()||chart._isZoomSelectionChart()){
                reserveLeft1=reserveRight1=reserveLeft2=reserveRight2=0;
            }
            var ret=[],
                forceRotateLabels=(chart.rotateLabels=="always"&&!showInlineLabels),
                tryRotatingLabels=chart._canRotateLabels(),
                canRotate=!vertical&&tryRotatingLabels&&!showInlineLabels;
            if(vertical||canRotate){
                ret.push({
                    parallel:reserveLeft1+reserveRight1,
                    perpendicular:maxWidth,
                    _rotated:!vertical&&tryRotatingLabels,
                    _useGradations:false,
                    _totalLabelLength:sumHeight,
                    _totalUnrotatedLabelLength:sumWidth,
                    _reserveLeft:reserveLeft1,
                    _reserveRight:reserveRight1
                });
            }
            if(!(vertical||forceRotateLabels)){
                ret.push({
                    parallel:reserveLeft2+(canRotate?sumWidth:0)+reserveRight2,
                    perpendicular:(showInlineLabels?0:maxHeight),
                    _rotated:false,
                    _useGradations:false,
                    _totalLabelLength:sumWidth,
                    _reserveLeft:reserveLeft2,
                    _reserveRight:reserveRight2
                });
            }
            return ret;
        },
        utility:function(width,height,measure){
            var axisLength=(vertical?height:width)-measure._reserveLeft-measure._reserveRight,
                totalLabelLength=measure._totalLabelLength,
                rotated=measure._rotated,
                totalUnrotatedLabelLength=measure._totalUnrotatedLabelLength,
                forceRotateLabels=(this._chart.rotateLabels=="always"&&!this._chart.showInlineLabels);
            if(rotated&&!forceRotateLabels&&totalUnrotatedLabelLength<axisLength){
                return 0.0;
            }else if(totalLabelLength>axisLength){
                return 0.5*isc.FacetChart._bellCurve(axisLength,0.1*axisLength,totalLabelLength);
            }else{
                return 1.0;
            }
        },
        getLabelDataPairs:function(width,height,measure){
            var data=this._data;
            return data.map(function(d){
                return{label:d.title,dataValue:d.title};
            });
        }
    };
}
);
isc.evalBoundary;isc.B.push(isc.A._createLabelCollapseModeNumericAxis=function isc_c_FacetChart__createLabelCollapseModeNumericAxis(vertical){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            this._data=chart.getOrderedData();
            this._props=chart.gradationLabelProperties;
            this._labelHeight=chart._getGradationLabelHeight();
            var axis=this._gradationsAxis=isc.FacetChart._createLinearGradationsAxis(
                    false,vertical,!(
                        vertical||chart._isZoomChart()||chart._isZoomSelectionChart()));
            axis.init(chart,context,minAxisWidth);
            while(axis.decreaseScope())
                ;
            this._scope=0;
        },
        increaseScope:function(){
            var axis=this._gradationsAxis;
            var flag=this._scope==0||axis.increaseScope();
            if(flag)++this._scope;
            return flag;
        },
        decreaseScope:function(){
            var axis=this._gradationsAxis;
            var flag=this._scope>0;
            if(flag){
                if(this._scope!=1)axis.decreaseScope();
                --this._scope;
            }
            return flag;
        },
        measure:function(){
            var chart=this._chart,
                showInlineLabels=chart.showInlineLabels,
                props=this._props,
                data=this._data,
                axis=this._gradationsAxis,
                labelHeight=this._labelHeight,
                useGradations=this._scope!=0;
            if(!useGradations){
                var len=data.getLength(),
                    maxHeight=labelHeight,
                    sumHeight=(len-1)*maxHeight,
                    maxWidth=0,
                    sumWidth=0,
                    dataAndChartRectMargin=chart._getDataAndChartRectMargin(vertical),
                    reserveLeft1=(vertical?0:Math.max(0,Math.ceil(maxHeight/2)-dataAndChartRectMargin)),
                    reserveRight1=reserveLeft1,
                    reserveLeft2=0,
                    reserveRight2=0;
                for(var i=0;i<len;++i){
                    var label=chart.formatAxisValue(data[i].title,!vertical),
                        labelWidth=chart.measureLabel(label,props).width;
                    if(!showInlineLabels&&(i==0||i==len-1)){
                        var halfLabelWidth=Math.ceil(labelWidth/2);
                        if(i==0){
                            reserveLeft2=Math.max(0,halfLabelWidth-dataAndChartRectMargin);
                        }else{
                            reserveRight2=Math.max(0,halfLabelWidth-dataAndChartRectMargin);
                        }
                        sumWidth+=halfLabelWidth;
                    }else if(!showInlineLabels||(i!=len-1)){
                        sumWidth+=labelWidth;
                    }
                    if(labelWidth>maxWidth)maxWidth=labelWidth;
                }
                if(chart._isZoomChart()||chart._isZoomSelectionChart()){
                    reserveLeft1=reserveRight1=reserveLeft2=reserveRight2=0;
                }
                var ret=[],
                    forceRotateLabels=(chart.rotateLabels=="always"&&!showInlineLabels),
                    tryRotatingLabels=chart._canRotateLabels();
                if(vertical||(tryRotatingLabels&&!showInlineLabels)){
                    ret.push({
                        parallel:reserveLeft1+sumHeight+reserveRight1,
                        perpendicular:maxWidth,
                        _rotated:!vertical&&tryRotatingLabels,
                        _useGradations:useGradations,
                        _reserveLeft:reserveLeft1,
                        _reserveRight:reserveRight1
                    });
                }
                if(!(vertical||forceRotateLabels)){
                    ret.push({
                        parallel:reserveLeft2+sumWidth+reserveRight2,
                        perpendicular:(showInlineLabels?0:maxHeight),
                        _rotated:false,
                        _useGradations:useGradations,
                        _reserveLeft:reserveLeft2,
                        _reserveRight:reserveRight2
                    });
                }
                return ret;
            }else{
                return axis.measure().map(function(m){
                    m._useGradations=true;
                    return m;
                });
            }
        },
        utility:function(width,height,measure){
            var axis=this._gradationsAxis,useGradations=measure._useGradations;
            return!useGradations?1.0:0.5*axis.utility(width,height,measure);
        },
        getLabelDataPairs:function(width,height,measure){
            var chart=this._chart,
                data=this._data;
                axis=this._gradationsAxis,
                useGradations=measure._useGradations;
            if(!useGradations){
                return data.map(function(d){
                    return{label:chart.formatAxisValue(d.title,!vertical),dataValue:d.title};
                });
            }else{
                return axis.getLabelDataPairs(width,height,measure)[0];
            }
        }
    };
}
,isc.A._dateFloor=function isc_c_FacetChart__dateFloor(scope,date){
    var year=date.getFullYear(),
        month=date.getMonth(),
        day=date.getDate(),
        hour=date.getHours(),
        minute=date.getMinutes(),
        second=date.getSeconds();
    if(scope==isc.FacetChart._FIFTEEN_SECONDS){
        return new Date(year,month,day,hour,minute,15*Math.floor(second/15),0);
    }else if(scope==isc.FacetChart._THIRTY_SECONDS){
        return new Date(year,month,day,hour,minute,30*Math.floor(second/30),0);
    }else if(scope==isc.FacetChart._MINUTES){
        return new Date(year,month,day,hour,minute,0,0);
    }else if(scope==isc.FacetChart._FIVE_MINUTES){
        return new Date(year,month,day,hour,5*Math.floor(minute/5),0,0);
    }else if(scope==isc.FacetChart._QUARTER_HOURS){
        return new Date(year,month,day,hour,15*Math.floor(minute/15),0,0);
    }else if(scope==isc.FacetChart._HALF_HOURS){
        return new Date(year,month,day,hour,30*Math.floor(minute/30),0,0);
    }else if(scope==isc.FacetChart._HOURS){
        return new Date(year,month,day,hour,0,0,0);
    }else if(scope==isc.FacetChart._DAYS){
        return new Date(year,month,day);
    }else if(scope==isc.FacetChart._WEEKS){
        var firstDayOfWeek=isc.DateChooser.getPrototype().firstDayOfWeek,
            floorDay=day-((7+date.getDay()-firstDayOfWeek)%7);
        return new Date(year,month,floorDay);
    }else if(scope==isc.FacetChart._MONTHS){
        return new Date(year,month,1);
    }else if(scope==isc.FacetChart._QUARTERS){
        return new Date(year,3*Math.floor(month/3),1);
    }else if(scope==isc.FacetChart._YEARS){
        return new Date(year,0,1);
    }
}
,isc.A._dateCeil=function isc_c_FacetChart__dateCeil(scope,date){
    var year=date.getFullYear(),
        month=date.getMonth(),
        day=date.getDate(),
        hour=date.getHours(),
        minute=date.getMinutes(),
        second=date.getSeconds(),
        millisecond=date.getMilliseconds();
    if(scope==isc.FacetChart._FIFTEEN_SECONDS){
        if(millisecond>0)++second;
        return new Date(year,month,day,hour,minute,15*Math.ceil(second/15),0);
    }else if(scope==isc.FacetChart._THIRTY_SECONDS){
        if(millisecond>0)++second;
        return new Date(year,month,day,hour,minute,30*Math.ceil(second/30),0);
    }else if(scope==isc.FacetChart._MINUTES){
        if(second+millisecond>0)++minute;
        return new Date(year,month,day,hour,minute,0,0);
    }else if(scope==isc.FacetChart._FIVE_MINUTES){
        if(second+millisecond>0)++minute;
        return new Date(year,month,day,hour,5*Math.ceil(minute/5),0,0);
    }else if(scope==isc.FacetChart._QUARTER_HOURS){
        if(second+millisecond>0)++minute;
        return new Date(year,month,day,hour,15*Math.ceil(minute/15),0,0);
    }else if(scope==isc.FacetChart._HALF_HOURS){
        if(second+millisecond>0)++minute;
        return new Date(year,month,day,hour,30*Math.ceil(minute/30),0,0);
    }else if(scope==isc.FacetChart._HOURS){
        if(minute+second+millisecond>0)++hour;
        return new Date(year,month,day,hour,0,0,0);
    }else if(scope==isc.FacetChart._DAYS){
        if(hour+minute+second+millisecond>0)++day;
        return new Date(year,month,day);
    }else if(scope==isc.FacetChart._WEEKS){
        var firstDayOfWeek=isc.DateChooser.getPrototype().firstDayOfWeek,
            dayOfWeek=date.getDay();
        if(hour+minute+second+millisecond>0){
            ++day;
            dayOfWeek=(dayOfWeek+1)%7;
        }
        var ceilDay=day+((7-(dayOfWeek-firstDayOfWeek))%7);
        return new Date(year,month,ceilDay);
    }else if(scope==isc.FacetChart._QUARTERS){
        if(second+millisecond+minute+hour+day-1>0)++month;
        return new Date(year,3*Math.ceil(month/3),1);
    }else{
        var floorDate=isc.FacetChart._dateFloor(scope,date);
        if(floorDate.getTime()==date.getTime()){
            return floorDate;
        }else if(scope==isc.FacetChart._MONTHS){
            return new Date(year,month+1,1);
        }else if(scope==isc.FacetChart._YEARS){
            return new Date(year+1,0,1);
        }
    }
}
,isc.A._dateAddScope=function isc_c_FacetChart__dateAddScope(scope,date,n){
    var year=date.getFullYear(),
        month=date.getMonth(),
        day=date.getDate(),
        hour=date.getHours(),
        minute=date.getMinutes(),
        second=date.getSeconds();
    if(scope==isc.FacetChart._FIFTEEN_SECONDS){
        return new Date(year,month,day,hour,minute,second+15*n,0);
    }else if(scope==isc.FacetChart._THIRTY_SECONDS){
        return new Date(year,month,day,hour,minute,second+30*n,0);
    }else if(scope==isc.FacetChart._MINUTES){
        return new Date(year,month,day,hour,minute+n,0,0);
    }else if(scope==isc.FacetChart._FIVE_MINUTES){
        return new Date(year,month,day,hour,minute+5*n,0,0);
    }else if(scope==isc.FacetChart._QUARTER_HOURS){
        return new Date(year,month,day,hour,minute+15*n,0,0);
    }else if(scope==isc.FacetChart._HALF_HOURS){
        return new Date(year,month,day,hour,minute+30*n,0,0);
    }else if(scope==isc.FacetChart._HOURS){
        return new Date(year,month,day,hour+n,0,0,0);
    }else if(scope==isc.FacetChart._DAYS){
        return new Date(year,month,day+n);
    }else if(scope==isc.FacetChart._WEEKS){
        return new Date(year,month,day+7*n);
    }else if(scope==isc.FacetChart._MONTHS){
        return new Date(year,month+n,1);
    }else if(scope==isc.FacetChart._QUARTERS){
        return new Date(year,month+3*n,1);
    }else if(scope==isc.FacetChart._YEARS){
        return new Date(year+n,0,1);
    }
}
,isc.A._nextDate=function isc_c_FacetChart__nextDate(scope,date){
    return isc.FacetChart._dateAddScope(scope,date,1);
}
,isc.A._prevDate=function isc_c_FacetChart__prevDate(scope,date){
    return isc.FacetChart._dateAddScope(scope,date,-1);
}
,isc.A._dateSubtract=function isc_c_FacetChart__dateSubtract(scope,date1,date2){
    var guess=Math.round((date1.getTime()-date2.getTime())/scope),
        date=isc.FacetChart._dateAddScope(scope,date2,guess),
        time=date1.getTime();
    while(date.getTime()<time){
        date=isc.FacetChart._nextDate(scope,date);
        ++guess;
    }
    while(date.getTime()>time){
        date=isc.FacetChart._prevDate(scope,date);
        --guess;
    }
    return guess;
}
,isc.A._detectInternationalization=function isc_c_FacetChart__detectInternationalization(){
    var shortMonthNames=Date.getShortMonthNames(),
        englishShortMonthNames=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        shortDayNames=Date.getShortDayNames(),
        englishShortDayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    for(var i=0,len=shortMonthNames.getLength();i<len;++i){
        if(shortMonthNames[i]!=englishShortMonthNames[i]){
            return true;
        }
    }
    for(var i=0,len=shortDayNames.getLength();i<len;++i){
        if(shortDayNames[i]!=englishShortDayNames[i]){
            return true;
        }
    }
    return false;
}
,isc.A._getPossibleDateScopes=function isc_c_FacetChart__getPossibleDateScopes(interval){
    var scopes=[
        isc.FacetChart._FIFTEEN_SECONDS,
        isc.FacetChart._THIRTY_SECONDS,
        isc.FacetChart._MINUTES,
        isc.FacetChart._FIVE_MINUTES,
        isc.FacetChart._QUARTER_HOURS,
        isc.FacetChart._HALF_HOURS,
        isc.FacetChart._HOURS,
        isc.FacetChart._DAYS,
        isc.FacetChart._WEEKS,
        isc.FacetChart._MONTHS,
        isc.FacetChart._QUARTERS,
        isc.FacetChart._YEARS];
    if(interval>0){
        for(var i=0;i<scopes.length-1;){
            if(scopes[i]+scopes[i+1]<2*interval){
                scopes.splice(i,1);
            }else{
                ++i;
            }
        }
    }
    return scopes;
}
,isc.A._getDateAxisConstants=function isc_c_FacetChart__getDateAxisConstants(chart,contexts){
    var internationalization=isc.FacetChart._detectInternationalization(),
        arrayOfContexts=isc.isAn.Array(contexts),
        numContexts=(arrayOfContexts?contexts.length:1);
    var ret={
        _internationalization:internationalization,
        _slack:(internationalization?5:0),
        _props:new Array(numContexts),
        _minHorizontalLabelGap:new Array(numContexts),
        _minVerticalLabelGap:new Array(numContexts),
        _may99:new Array(numContexts),
        _may9999:new Array(numContexts),
        _9999:new Array(numContexts),
        _2359pm:new Array(numContexts),
        _235900pm:new Array(numContexts)
    };
    var almostMidnight=isc.Time.parseInput("23:59pm"),
        timeOf2359pm=isc.Time.toTime(almostMidnight),
        shortTimeOf2359pm=isc.Time.toShortTime(almostMidnight);
    for(var i=numContexts;i--;){
        var context=(arrayOfContexts?contexts[i]:contexts),
            props=context.gradationLabelProperties;
        ret._props[i]=props;
        ret._minHorizontalLabelGap[i]=chart._getMinLabelGap(false,props);
        ret._minVerticalLabelGap[i]=chart._getMinLabelGap(true,props);
        ret._may99[i]=chart.measureLabel("May 99",props);
        ret._may9999[i]=chart.measureLabel("May 9999",props);
        ret._9999[i]=chart.measureLabel("9999",props);
        ret._2359pm[i]=chart.measureLabel(shortTimeOf2359pm,props);
        ret._235900pm[i]=chart.measureLabel(timeOf2359pm,props);
    }
    return ret;
}
,isc.A._getDateAxisLabels=function isc_c_FacetChart__getDateAxisLabels(constants,chart,scope,minDate,maxDate,cutoff,parallelLengthIsSumHeight,parallelLengthIsSumWidth,showInlineLabels,useGradations){
    var arrayOfContexts=isc.isAn.Array(constants._props),
        numContexts=(arrayOfContexts?constants._props.length:1),
        slack=constants._slack;
    var minTime=minDate.getTime(),
        maxTime=maxDate.getTime(),
        ret={
            sumWidth:new Array(numContexts),
            maxWidth:new Array(numContexts),
            sumHeight:new Array(numContexts),
            maxHeight:new Array(numContexts),
            pairs:[]
        },
        pairs=ret.pairs;
    if(scope==isc.FacetChart._FIFTEEN_SECONDS||scope==isc.FacetChart._THIRTY_SECONDS){
        var minDayTime=isc.FacetChart._dateFloor(isc.FacetChart._DAYS,minDate).getTime(),
            len=1+Math.round((maxTime-minTime)/scope);
        var totalHeight=0,
            totalWidth=0;
        for(var i=numContexts;i--;){
            var minHorizontalLabelGap=constants._minHorizontalLabelGap[i],
                minVerticalLabelGap=constants._minVerticalLabelGap[i],
                rep1=constants._may99[i],
                rep2=constants._235900pm[i],
                maxWidth=Math.max(rep1.width+slack,rep2.width),
                maxHeight=Math.max(rep1.height,rep2.height),
                sumWidth=(len-1)*(maxWidth+minHorizontalLabelGap),
                sumHeight=(len-1)*(maxHeight+minVerticalLabelGap);
            ret.maxWidth[i]=maxWidth;
            ret.maxHeight[i]=maxHeight;
            ret.sumWidth[i]=sumWidth;
            ret.sumHeight[i]=sumHeight;
            totalHeight+=sumHeight;
            totalWidth+=sumWidth;
        }
        if((parallelLengthIsSumHeight&&totalHeight<=cutoff)||
            (parallelLengthIsSumWidth&&totalWidth<=cutoff))
        {
            for(var i=0;i<len;++i){
                var date=isc.FacetChart._dateAddScope(scope,minDate,i),
                    time=date.getTime(),
                    label;
                if((time-minDayTime)%isc.FacetChart._DAYS==0){
                    label=date.getShortMonthName()+" "+date.getDate();
                }else{
                    label=isc.Time.toTime(date);
                }
                pairs.push({dataValue:date,label:label});
            }
        }
    }else if(
        scope==isc.FacetChart._MINUTES||
        scope==isc.FacetChart._FIVE_MINUTES||
        scope==isc.FacetChart._QUARTER_HOURS||
        scope==isc.FacetChart._HALF_HOURS||
        scope==isc.FacetChart._HOURS)
    {
        var minDayTime=isc.FacetChart._dateFloor(isc.FacetChart._DAYS,minDate).getTime(),
            len=1+Math.round((maxTime-minTime)/scope);
        var totalHeight=0,
            totalWidth=0;
        for(var i=numContexts;i--;){
            var minHorizontalLabelGap=constants._minHorizontalLabelGap[i],
                minVerticalLabelGap=constants._minVerticalLabelGap[i],
                rep1=constants._may99[i],
                rep2=constants._2359pm[i],
                maxWidth=Math.max(rep1.width+slack,rep2.width),
                maxHeight=Math.max(rep1.height,rep2.height),
                sumWidth=(len-1)*(maxWidth+minHorizontalLabelGap),
                sumHeight=(len-1)*(maxHeight+minVerticalLabelGap);
            ret.maxWidth[i]=maxWidth;
            ret.maxHeight[i]=maxHeight;
            ret.sumWidth[i]=sumWidth;
            ret.sumHeight[i]=sumHeight;
            totalHeight+=sumHeight;
            totalWidth+=sumWidth;
        }
        if((parallelLengthIsSumHeight&&totalHeight<=cutoff)||
            (parallelLengthIsSumWidth&&totalWidth<=cutoff))
        {
            for(var i=0;i<len;++i){
                var date=isc.FacetChart._dateAddScope(scope,minDate,i),
                    time=date.getTime(),
                    label;
                if((time-minDayTime)%isc.FacetChart._DAYS==0){
                    label=date.getShortMonthName()+" "+date.getDate();
                }else{
                    label=isc.Time.toShortTime(date);
                }
                pairs.push({dataValue:date,label:label});
            }
        }
    }else if(scope==isc.FacetChart._DAYS||scope==isc.FacetChart._WEEKS){
        var len=1+Math.round((maxTime-minTime)/scope);
        var totalWidth=0,
            totalHeight=0;
        for(var i=numContexts;i--;){
            var minHorizontalLabelGap=constants._minHorizontalLabelGap[i],
                minVerticalLabelGap=constants._minVerticalLabelGap[i],
                rep=constants._may99[i],
                maxWidth=rep.width+slack,
                maxHeight=rep.height,
                sumWidth=(len-1)*(rep.width+slack+minHorizontalLabelGap),
                sumHeight=(len-1)*(rep.height+minVerticalLabelGap);
            ret.maxWidth[i]=maxWidth;
            ret.maxHeight[i]=maxHeight;
            ret.sumWidth[i]=sumWidth;
            ret.sumHeight[i]=sumHeight;
            totalWidth+=sumWidth;
            totalHeight+=sumHeight;
        }
        if((parallelLengthIsSumHeight&&totalHeight<=cutoff)||
            (parallelLengthIsSumWidth&&totalWidth<=cutoff))
        {
            for(var i=0;i<len;++i){
                var date=isc.FacetChart._dateAddScope(scope,minDate,i),
                    label=date.getShortMonthName()+" "+date.getDate();
                pairs.push({dataValue:date,label:label});
            }
        }
    }else if(scope==isc.FacetChart._MONTHS||scope==isc.FacetChart._QUARTERS){
        var shortMonthNames=isc.Date.getShortMonthNames(),
            month=minDate.getMonth(),
            year=minDate.getFullYear(),
            len=1+Math.round((maxTime-minTime)/scope);
        var totalWidth=0,
            totalHeight=0;
        for(var i=numContexts;i--;){
            var minHorizontalLabelGap=constants._minHorizontalLabelGap[i],
                minVerticalLabelGap=constants._minVerticalLabelGap[i],
                rep=constants._may9999[i];
                sumWidth=(len-1)*(rep.width+slack+minHorizontalLabelGap),
                sumHeight=(len-1)*(rep.height+minVerticalLabelGap),
                maxWidth=rep.width+slack,
                maxHeight=rep.height;
            ret.maxWidth[i]=maxWidth;
            ret.maxHeight[i]=maxHeight;
            ret.sumWidth[i]=sumWidth;
            ret.sumHeight[i]=sumHeight;
            totalWidth+=sumWidth;
            totalHeight+=sumHeight;
        }
        if((parallelLengthIsSumHeight&&totalHeight<=cutoff)||
            (parallelLengthIsSumWidth&&totalWidth<=cutoff))
        {
            for(var i=0;i<len;++i){
                var m=(month+(scope==isc.FacetChart._MONTHS?i:3*i))%12;
                if(i!=0&&m==0)++year;
                var label=(
                        ((i==0&&
                        (len==1||m!=(scope==isc.FacetChart._MONTHS?11:9)))||
                        m==0)
                            ?""+year:shortMonthNames[m]);
                pairs.push({
                    dataValue:isc.FacetChart._dateAddScope(scope,minDate,i),
                    label:label
                });
            }
        }
    }else if(scope==isc.FacetChart._YEARS){
        var year=minDate.getFullYear(),
            len=maxDate.getFullYear()-year+1;
        for(var i=numContexts;i--;){
            var minHorizontalLabelGap=constants._minHorizontalLabelGap[i],
                minVerticalLabelGap=constants._minVerticalLabelGap[i],
                rep=constants._9999[i],
                sumWidth=(len-1)*(rep.width+minHorizontalLabelGap),
                sumHeight=(len-1)*(rep.height+minVerticalLabelGap),
                maxWidth=rep.width,
                maxHeight=rep.height;
            ret.maxWidth[i]=maxWidth;
            ret.maxHeight[i]=maxHeight;
            ret.sumWidth[i]=sumWidth;
            ret.sumHeight[i]=sumHeight;
        }
        for(var i=0;i<len;++i){
            pairs.push({
                dataValue:isc.FacetChart._dateAddScope(scope,minDate,i),
                label:""+year
            });
            ++year;
        }
    }
    return ret;
}
,isc.A._createLabelCollapseModeTimeAxis=function isc_c_FacetChart__createLabelCollapseModeTimeAxis(vertical){
    var all=0,
        seconds=isc.FacetChart._SECONDS,
        fifteenSeconds=isc.FacetChart._FIFTEEN_SECONDS,
        thirtySeconds=isc.FacetChart._THIRTY_SECONDS,
        minutes=isc.FacetChart._MINUTES,
        fiveMinutes=isc.FacetChart._FIVE_MINUTES,
        quarterHours=isc.FacetChart._QUARTER_HOURS,
        halfHours=isc.FacetChart._HALF_HOURS,
        hours=isc.FacetChart._HOURS,
        days=isc.FacetChart._DAYS,
        weeks=isc.FacetChart._WEEKS,
        months=isc.FacetChart._MONTHS,
        quarters=isc.FacetChart._QUARTERS,
        years=isc.FacetChart._YEARS;
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            var data=this._data=chart.getOrderedData();
            var range=this._range=chart._getZoomValueRange();
            var dataBounds=this._dataBounds=chart._getZoomDataBounds();
            this._isEmptyChart=(dataBounds.minDataValue==null&&dataBounds.maxDataValue==null);
            var discrete=this._discrete=(chart.chartType=="Column");
            isc.addProperties(this,isc.FacetChart._getDateAxisConstants(chart,chart));
            var minDate=dataBounds.minDataValue,
                maxDate=dataBounds.maxDataValue,
                start=range[0].index,
                end=1+range[1].index,
                len=end-start,
                scopes;
            if(len<2){
                scopes=[all];
            }else{
                var interval=0;
                if(discrete){
                    var i=start,
                        prevTime=data[i].title.getTime(),
                        time=data[i+1].title.getTime();
                    for(;i<end-1;prevTime=time,time=data[++i].title.getTime()){
                        var diff=time-prevTime;
                        if(diff>0&&(interval==null||diff<interval)){
                            interval=diff;
                        }
                    }
                }else{
                    interval=(maxDate.getTime()-minDate.getTime())/(len-1);
                }
                scopes=isc.FacetChart._getPossibleDateScopes(interval);
                scopes.push(all);
            }
            this._scopes=scopes;
            this._index=scopes.indexOf(all);
        },
        increaseScope:function(){
            if(this._isEmtpyChart)return false;
            var scopes=this._scopes,
                flag=this._index<scopes.getLength()-1;
            if(flag)++this._index;
            return flag;
        },
        decreaseScope:function(){
            if(this._isEmptyChart)return false;
            var flag=this._index>0;
            if(flag)--this._index;
            return flag;
        },
        _round:function(scope,date){
            var time=date.getTime(),
                floorDate=isc.FacetChart._dateFloor(scope,date),
                floorTime=floorDate.getTime(),
                ceilDate=isc.FacetChart._dateCeil(scope,date),
                ceilTime=ceilDate.getTime();
            if(time-floorTime<ceilTime-time){
                return floorDate;
            }else{
                return ceilDate;
            }
        },
        _getMaxDiscreteAxisLength:function(chart,data,dataLength,maxLabelSpacing,minBarsBetweenLabels){
            var minAxisLength=0,
                maxAxisLength=Math.max(maxLabelSpacing/minBarsBetweenLabels*dataLength),
                info={},
                epsilon=1;
            for(var i=1000;(maxAxisLength-minAxisLength>epsilon)&&i--;){
                var axisLength=Math.round((minAxisLength+maxAxisLength)/2);
                info=chart._calculateBarLayout(
                        chart,data,dataLength,axisLength+2*chart.dataMargin,0,info);
                var spacing=minBarsBetweenLabels*info.clusterSize+(minBarsBetweenLabels-1)*info.clusterGap;
                if(spacing<=maxLabelSpacing){
                    minAxisLength=axisLength;
                }else{
                    maxAxisLength=axisLength;
                }
            }
            return maxAxisLength;
        },
        measure:function(){
            var chart=this._chart,
                discrete=this._discrete,
                clustered=discrete&&chart.isMultiFacet()&&!chart.isStacked(),
                showInlineLabels=chart.showInlineLabels,
                availableSpace=Math.max(chart._getAvailableWidth(),chart._getAvailableHeight()),
                cutoff=1.5*availableSpace,
                scope=this._scopes[this._index],
                useGradations=(!discrete&&scope!=all),
                forceRotateLabels=(chart.rotateLabels=="always"&&!chart.showInlineLabels),
                tryRotatingLabels=chart._canRotateLabels(),
                parallelLengthIsSumHeight=(vertical||(tryRotatingLabels&&!chart.showInlineLabels)),
                parallelLengthIsSumWidth=!(vertical||forceRotateLabels),
                pairs;
            var slack=this._slack;
            var sumWidth=0,maxWidth=0,
                sumHeight=0,maxHeight=0;
            var dataBounds=this._dataBounds,
                data=this._data;
            var dataAndChartRectMargin=chart._getDataAndChartRectMargin(vertical),
                reserveLeft1=0,
                reserveRight1=0,
                reserveLeft2=0,
                reserveRight2=0;
            if(discrete){
                var range=this._range,
                    start=range[0].index,
                    end=1+range[1].index,
                    dataLength=end-start;
                var k=(scope==all?1:null),
                    maxLength=0,
                    maxLengthLabel=null,
                    isFirstLabel=true;
                var labelDate=(scope!=all&&this._round(scope,data[start].title)),
                    i0=start;
                pairs=[];
                for(var i=start,triedRounding=false;i<end;){
                    var date;
                    if(scope==all){
                        date=labelDate=data[i].title;
                    }else{
                        var j=isc.FacetChart._binarySearch(
                                    data,i,end-1,"title",labelDate,chart._dateComparator);
                        if(j<0){
                            var insertionPoint=-(1+j);
                            if(insertionPoint==i&&!triedRounding){
                                triedRounding=true;
                                labelDate=this._round(scope,data[i].title);
                                continue;
                            }else if(insertionPoint==end){
                                break;
                            }else{
                                var time=labelDate.getTime(),
                                    canUseLeft=(insertionPoint>i),
                                    leftDate=canUseLeft&&data[insertionPoint-1].title,
                                    prevTime=canUseLeft&&isc.FacetChart._prevDate(scope,labelDate).getTime(),
                                    leftLambda=canUseLeft&&((time-leftDate.getTime())/(time-prevTime)),
                                    useLeft=canUseLeft&&(0<=leftLambda&&leftLambda<0.1),
                                    canUseRight=(insertionPoint<end),
                                    rightDate=canUseRight&&data[insertionPoint].title,
                                    nextTime=canUseRight&&isc.FacetChart._nextDate(scope,labelDate).getTime(),
                                    rightLambda=canUseRight&&((rightDate.getTime()-time)/(nextTime-time)),
                                    useRight=canUseRight&&(0<=rightLambda&&rightLambda<0.1);
                                if(useLeft&&useRight){
                                    useLeft=(leftLambda<rightLambda);
                                    useRight=!useLeft;
                                }
                                if(useLeft){
                                    i=insertionPoint-1;
                                }else if(useRight){
                                    i=insertionPoint;
                                }else{
                                    if(!triedRounding){
                                        triedRounding=true;
                                        labelDate=this._round(scope,data[i].title);
                                    }else{
                                        triedRounding=false;
                                        ++i;
                                    }
                                    continue;
                                }
                            }
                        }else{
                            i=j;
                        }
                        var numBars=i-i0;
                        if(i0!=start&&(k==null||numBars<k)){
                            k=numBars;
                        }
                        date=data[i].title;
                    }
                    var label=this._getDateLabel(scope,labelDate,isFirstLabel);
                    pairs.push({dataValue:date,label:label});
                    if(scope==all){
                        var length=label.length;
                        if(length>maxLength){
                            maxLength=length;
                            maxLengthLabel=label;
                        }
                    }else{
                        triedRounding=false;
                        labelDate=isc.FacetChart._nextDate(scope,labelDate);
                    }
                    isFirstLabel=false;
                    i0=i;
                    ++i;
                }
                var props=this._props[0],
                    minHorizontalLabelGap=this._minHorizontalLabelGap[0],
                    minVerticalLabelGap=this._minVerticalLabelGap[0];
                if(scope==all){
                    maxHeight=chart.measureLabel("Xy",props).height;
                    maxWidth=chart.measureLabel(maxLengthLabel||"",props).width;
                    reserveLeft1=reserveRight1=(
                        vertical?0:Math.max(0,Math.ceil(maxHeight/2)-dataAndChartRectMargin));
                    reserveLeft2=reserveRight2=Math.max(
                        0,Math.ceil(maxWidth/2)-dataAndChartRectMargin);
                }else if(scope==fifteenSeconds||scope==thirtySeconds){
                    var rep1=this._may99[0],
                        rep2=this._235900pm[0];
                    maxWidth=Math.max(rep1.width+slack,rep2.width);
                    maxHeight=Math.max(rep1.height,rep2.height);
                }else if(
                    scope==minutes||scope==fiveMinutes||scope==quarterHours||
                    scope==halfHours||scope==hours)
                {
                    var rep1=this._may99[0],
                        rep2=this._2359pm[0];
                    maxWidth=Math.max(rep1.width+slack,rep2.width);
                    maxHeight=Math.max(rep1.height,rep2.height);
                }else if(scope==days||scope==weeks){
                    var rep=this._may99[0];
                    maxWidth=rep.width+slack;
                    maxHeight=rep.height;
                }else if(scope==months||scope==quarters){
                    var rep=this._may9999[0];
                    maxWidth=rep.width+slack;
                    maxHeight=rep.height;
                }else if(scope==years){
                    var rep=this._9999[0];
                    maxWidth=rep.width;
                    maxHeight=rep.height;
                }
                if(parallelLengthIsSumHeight){
                    if(k!=null&&dataLength>1){
                        sumHeight=this._getMaxDiscreteAxisLength(
                                chart,data,dataLength,maxHeight+minVerticalLabelGap,k);
                    }else{
                        sumHeight=0;
                    }
                }
                if(parallelLengthIsSumWidth){
                    if(k!=null&&dataLength>1){
                        sumWidth=this._getMaxDiscreteAxisLength(
                                chart,data,dataLength,maxWidth+minHorizontalLabelGap,k);
                    }else{
                        sumWidth=0;
                    }
                }
            }else if(scope==all){
                var props=this._props[0],
                    minHorizontalLabelGap=this._minHorizontalLabelGap[0],
                    minVerticalLabelGap=this._minVerticalLabelGap[0],
                    range=this._range,
                    start=range[0].index,
                    end=1+range[1].index,
                    len=end-start;
                maxHeight=chart.measureLabel("Xy",props).height;
                sumHeight=(len-1)*(maxHeight+minVerticalLabelGap);
                sumWidth=(len-1)*minHorizontalLabelGap;
                reserveLeft1=reserveRight1=(
                    vertical?0:Math.max(0,Math.ceil(maxHeight/2)-dataAndChartRectMargin));
                var startLabel=data[start].title.toNormalDatetime();
                reserveLeft2=Math.max(
                    0,Math.ceil(chart.measureLabel(startLabel,props).width/2)-dataAndChartRectMargin);
                var endLabel=data[end-1].title.toNormalDatetime();
                reserveRight2=Math.max(
                    0,Math.ceil(chart.measureLabel(endLabel,props).width/2)-dataAndChartRectMargin);
                var heightCutoffFlag=(!parallelLengthIsSumHeight||sumHeight>cutoff),
                    widthCutoffFlag=(!parallelLengthIsSumWidth||sumWidth>cutoff),
                    i=start,
                    sumHeight0=sumHeight,
                    sumWidth0=sumWidth;
                pairs=[];
                for(;i<end&&!(heightCutoffFlag&&widthCutoffFlag);++i){
                    var date=data[i].title,
                        label=date.toNormalDatetime(),
                        labelWidth=chart.measureLabel(label,props).width;
                    if(!showInlineLabels&&(i==start||i==end-1)){
                        sumWidth+=Math.ceil(labelWidth/2);
                    }else if(!showInlineLabels||i!=end-1){
                        sumWidth+=labelWidth;
                    }
                    if(labelWidth>maxWidth)maxWidth=labelWidth;
                    pairs.push({dataValue:date,label:label});
                    widthCutoffFlag=(!parallelLengthIsSumWidth||sumWidth>cutoff);
                }
                if(parallelLengthIsSumWidth&&sumWidth>cutoff){
                    sumWidth=(
                        sumWidth0+Math.ceil(
                            (sumWidth-sumWidth0)/Math.max(1,i-start)*len));
                }
                if(parallelLengthIsSumHeight&&sumHeight>cutoff){
                    sumHeight=(
                        sumHeight0+Math.ceil(
                            (sumHeight-sumHeight0)/Math.max(1,i-start)*len));
                }
                if(heightCutoffFlag&&widthCutoffFlag){
                    pairs=[];
                }
            }else{
                var minFacetValue=dataBounds.minDataValue,
                    maxFacetValue=dataBounds.maxDataValue,
                    minDate,maxDate;
                if(discrete){
                    minDate=minFacetValue;
                    maxDate=maxFacetValue;
                }else{
                    minDate=isc.FacetChart._dateCeil(scope,minFacetValue);
                    maxDate=isc.FacetChart._dateFloor(scope,maxFacetValue);
                    if(Date.compareDates(minDate,maxDate)<=0){
                        minDate=isc.FacetChart._dateFloor(scope,minFacetValue);
                        maxDate=isc.FacetChart._dateCeil(scope,maxFacetValue);
                        if(Date.compareDates(minDate,maxDate)<=0){
                            minDate=isc.FacetChart._dateFloor(scope,new Date(minDate.getTime()-1));
                            maxDate=isc.FacetChart._dateCeil(scope,new Date(maxDate.getTime()+1));
                        }
                    }
                }
                var numer=(maxFacetValue.getTime()-minFacetValue.getTime()),
                    denom=(maxDate.getTime()-minDate.getTime()),
                    scale=Math.max(1.0,Math.min(1.1,(denom==0?1:(numer/denom)))),
                    info=isc.FacetChart._getDateAxisLabels(
                        this,chart,scope,minDate,maxDate,cutoff,
                        parallelLengthIsSumHeight,parallelLengthIsSumWidth,showInlineLabels,
                        useGradations);
                pairs=info.pairs;
                sumHeight=Math.ceil(scale*info.sumHeight[0]);
                maxWidth=info.maxWidth[0];
                sumWidth=Math.ceil(scale*info.sumWidth[0]);
                maxHeight=info.maxHeight[0];
            }
            if(chart._isZoomChart()||chart._isZoomSelectionChart()){
                reserveLeft1=reserveRight1=reserveLeft2=reserveRight2=0;
            }
            var ret=[];
            if(parallelLengthIsSumHeight){
                ret.push({
                    parallel:reserveLeft1+sumHeight+reserveRight1,
                    perpendicular:maxWidth,
                    _rotated:!vertical&&tryRotatingLabels,
                    _useGradations:useGradations,
                    _logScale:false,
                    _labelDataPairs:pairs,
                    _reserveLeft:reserveLeft1,
                    _reserveRight:reserveRight1
                });
            }
            if(parallelLengthIsSumWidth){
                ret.push({
                    parallel:reserveLeft2+sumWidth+reserveRight2,
                    perpendicular:(showInlineLabels?0:maxHeight),
                    _rotated:false,
                    _useGradations:useGradations,
                    _logScale:false,
                    _labelDataPairs:pairs,
                    _reserveLeft:reserveLeft2,
                    _reserveRight:reserveRight2
                });
            }
            return ret;
        },
        utility:function(width,height,measure){
            var scopes=this._scopes;
            if(scopes[this._index]==all){
                return 1.0;
            }else{
                return 0.5*(1.0-this._index/scopes.getLength());
            }
        },
        getLabelDataPairs:function(width,height,measure){
            return measure._labelDataPairs;
        },
        _getDateLabel:function(scope,date,isFirst){
            if(scope==all){
                return date.toNormalDatetime();
            }else if(scope==fifteenSeconds||scope==thirtySeconds){
                if(date.getHours()==0&&date.getMinutes()==0&&date.getSeconds()==0){
                    return date.getShortMonthName()+" "+date.getDate();
                }else{
                    return isc.Time.toTime(date);
                }
            }else if(
                scope==minutes||scope==fiveMinutes||scope==quarterHours||
                scope==halfHours||scope==hours)
            {
                if(date.getHours()==0&&date.getMinutes()==0){
                    return date.getShortMonthName()+" "+date.getDate();
                }else{
                    return isc.Time.toShortTime(date);
                }
            }else if(scope==days||scope==weeks){
                return date.getShortMonthName()+" "+date.getDate();
            }else if(scope==months||scope==quarters){
                var month=date.getMonth();
                if(isFirst||(month==0)){
                    return""+date.getFullYear();
                }else{
                    return isc.Date.getShortMonthNames()[month];
                }
            }else if(scope==years){
                return""+date.getFullYear();
            }else{
                return"";
            }
        }
    };
}
);
isc.evalBoundary;isc.B.push(isc.A._createLabelCollapseModeSampleAxis=function isc_c_FacetChart__createLabelCollapseModeSampleAxis(vertical){
    return{
        init:function(chart,context,minAxisWidth){
            this._chart=chart;
            var data=this._data=chart.getOrderedData(),
                range=chart._getZoomValueRange(),
                start=this._start=range[0].index,
                end=range[1].index,
                len=this._len=end-start+1;
            var dataAndChartRectMargin=chart._getDataAndChartRectMargin(vertical);
            var repLabel="",repLabelLength=0;
            for(var i=start;i<=end;++i){
                var label=data[i].title.toString();
                if(i==start){
                    var d=chart.measureLabel(label,chart.dataLabelProperties);
                    this._reserveLeft1=Math.max(0,Math.ceil(d.height/2)-dataAndChartRectMargin);
                    this._reserveLeft2=Math.max(0,Math.ceil(d.width/2)-dataAndChartRectMargin);
                }
                if(i==end){
                    var d=chart.measureLabel(label,chart.dataLabelProperties);
                    this._reserveRight1=Math.max(0,Math.ceil(d.height/2)-dataAndChartRectMargin);
                    this._reserveRight2=Math.max(0,Math.ceil(d.width/2)-dataAndChartRectMargin);
                }
                if(label.length>repLabelLength){
                    repLabel=label;
                    repLabelLength=label.length;
                }
            }
            this._maxLabelWidth=chart.measureLabel(repLabel,chart.dataLabelProperties).width;
            this._labelHeight=chart.getDataLabelHeight();
            this._minHorizontalLabelGap=chart._getMinLabelGap(false,chart.dataLabelProperties);
            this._minVerticalLabelGap=chart._getMinLabelGap(true,chart.dataLabelProperties);
            var availableAxisLength=vertical?chart._getAvailableHeight():chart._getAvailableWidth();
            this._scopes=len<2?[1]:[];
            for(var i=len-1;i>=1;--i){
                var n=1+Math.floor((len-1)/i);
                if(this._scopes.indexOf(n)==-1){
                    this._scopes.push(n);
                }
            }
            this._idealScopes=this._getIdealScopes(len);
            this._index=this._scopes.length-1;
        },
        _range:function(a,b){
            var len=b-a+1,
                r=new Array(len);
            for(var i=0;i<len;++i){
                r[i]=a+i;
            }
            return r;
        },
        _getIdealScopes:function(n){
            if(n>2){
                return isc.FacetChart._getDivisors(n-1)
                        .sort(function(a,b){return a-b;})
                        .map(function(d){return d+1;});
            }else{
                return[n];
            }
        },
        increaseScope:function(){
            var flag=(this._index<this._scopes.getLength()-1);
            if(flag)++this._index;
            return flag;
        },
        decreaseScope:function(){
            var flag=this._index>0;
            if(flag)--this._index;
            return flag;
        },
        measure:function(){
            var chart=this._chart,
                showInlineLabels=chart.showInlineLabels,
                isZoomChart=(chart._isZoomChart()||chart._isZoomSelectionChart()),
                reserve=!(vertical||isZoomChart),
                scope=this._scopes[this._index],
                labelHeight=this._labelHeight,
                minHorizontalLabelGap=this._minHorizontalLabelGap,
                minVerticalLabelGap=this._minVerticalLabelGap,
                forceRotateLabels=(chart.rotateLabels=="always"&&!showInlineLabels),
                tryRotatingLabels=chart._canRotateLabels(),
                ret=[];
            var sumWidth=0,sumHeight=0;
            if(scope>2){
                if(isZoomChart||chart.chartType=="Area"||chart.chartType=="Line"){
                    sumWidth=(scope-1)*(this._maxLabelWidth+minHorizontalLabelGap);
                    sumHeight=(scope-1)*(labelHeight+minVerticalLabelGap);
                }else{
                    sumWidth=scope*(this._maxLabelWidth+minHorizontalLabelGap)-minHorizontalLabelGap;
                    sumHeight=scope*(labelHeight+minVerticalLabelGap)-minVerticalLabelGap;
                }
            }
            if(vertical||(tryRotatingLabels&&!showInlineLabels)){
                    reserveLeft=(reserve?this._reserveLeft1:0),
                    reserveRight=(reserve?this._reserveRight1:0);
                ret.push({
                    parallel:reserveLeft+reserveRight+sumHeight,
                    perpendicular:this._maxLabelWidth,
                    _rotated:!vertical&&tryRotatingLabels,
                    _totalUnrotatedLabelLength:reserveLeft+sumWidth+reserveRight,
                    _useGradations:false,
                    _reserveLeft:reserveLeft,
                    _reserveRight:reserveRight
                });
            }
            if(!(vertical||forceRotateLabels)){
                var reserveLeft=(reserve?this._reserveLeft2:0),
                    reserveRight=(reserve?this._reserveRight2:0);
                ret.push({
                    parallel:reserveLeft+reserveRight+sumWidth,
                    perpendicular:(showInlineLabels?0:labelHeight),
                    _rotated:false,
                    _useGradations:false,
                    _reserveLeft:reserveLeft,
                    _reserveRight:reserveRight
                });
            }
            return ret;
        },
        utility:function(width,height,measure){
            var axisLength=(
                    (vertical?height:width)-measure._reserveLeft-measure._reserveRight),
                forceRotateLabels=(
                    this._chart.rotateLabels=="always"&&!this._chart.showInlineLabels);
            if(measure._rotated&&!forceRotateLabels&&
                measure._totalUnrotatedLabelLength<axisLength)
            {
                return 0.0;
            }
            var j=this._idealScopes.indexOf(this._scopes[this._index]);
            if(j!=-1){
                return(j+1)/(this._idealScopes.getLength()+1);
            }else{
                return 0.2*(this._index+1)/(this._scopes.getLength()+1);
            }
        },
        getLabelDataPairs:function(width,height,measure){
            var chart=this._chart,
                data=this._data,
                n=this._scopes[this._index],
                start=this._start,
                len=this._len;
            var skip=len>2?Math.floor((len-1)/(n-1)):1,
                labelDataPairs=[];
            for(var i=0;i<n-1;++i){
                var j=start+skip*i;
                labelDataPairs.push({label:data[j].title,dataValue:data[j].title});
            }
            labelDataPairs.push({label:data[start+len-1].title,dataValue:data[start+len-1].title});
            return labelDataPairs;
        }
    };
}
,isc.A._getDivisors=function isc_c_FacetChart__getDivisors(n){
    var findFactor=isc.FacetChart._findFactor,
        primeFactors=[],powers=[],divisors=[];
    if(n!=1){
        var stack=[n];
        while(!stack.isEmpty()){
            var m=stack.pop();
            var p=findFactor(m);
            if(p==1){
                primeFactors.push(m);
            }else{
                stack.push(p);
                stack.push(m/p);
            }
        }
    }
    for(var i=0,offset=0,len=primeFactors.getLength();i<len;++i){
        var j=i-offset;
        var prime=primeFactors[j];
        var count=1;
        var offset2=0;
        for(var k=j+1;k<len;++k){
            var l=k-offset-offset2;
            if(primeFactors[l]==prime){
                ++count;
                ++offset2;
                primeFactors.splice(l,1);
            }
        }
        len-=offset2;
        powers[j]=count;
    }
    var combinations=1;
    var bases=[];
    for(var i=0,len=powers.getLength();i<len;++i){
        bases.push(combinations);
        combinations*=(powers[i]+1);
    }
    bases.push(combinations);
    for(var i=0;i<combinations;++i){
        var divisor=1;
        for(var j=0,len=primeFactors.getLength();j<len;++j){
            divisor*=Math.pow(primeFactors[j],Math.floor(i/bases[j])%(powers[j]+1));
        }
        divisors.push(divisor);
    }
    return divisors;
}
,isc.A._findFactor=function isc_c_FacetChart__findFactor(n){
    var factor=isc.FacetChart._pollardRho(1,n);
    if(factor!=null)return factor;
    factor=isc.FacetChart._pollardRho(8,n);
    if(factor!=null)return factor;
    if(n==4){
        return 2;
    }else if(n==5713){
        return 197;
    }else if(n==8927){
        return 113;
    }else if(n==42733){
        return 283;
    }else if(n==51379){
        return 269;
    }
    return 1;
}
,isc.A._gcd=function isc_c_FacetChart__gcd(a,b){
    var r0=a,r1=b,r2;
    while((r2=r0%r1)!=0){
        r0=r1;
        r1=r2;
    }
    return r1;
}
,isc.A._pollardRho=function isc_c_FacetChart__pollardRho(c,n){
    var gcd=isc.FacetChart._gcd,
        x=2,y=2,d=1;
    while(d==1){
        x=(x*x+c)%n;
        var temp=(y*y+c)%n;
        y=(temp*temp+c)%n;
        d=gcd(Math.abs(x-y),n);
    }
    return(d==n?null:d);
}
,isc.A._objective=function isc_c_FacetChart__objective(axisMeasureCaches,utilityCache,axes,horizontalAxis,location,availableWidth,availableHeight,extra){
    var saveExtraInfo=isc.isAn.Object(extra),
        cachedUtility=isc.FacetChart._getCacheByAxes(utilityCache,location);
    if(!saveExtraInfo&&cachedUtility!=null){
        return cachedUtility;
    }
    var numAxes=axes.length;
    for(var i=numAxes;i--;){
        if(axisMeasureCaches[i][location[i]]==null){
            axisMeasureCaches[i][location[i]]=axes[i].measure();
        }
    }
    var maxUtility=null,
        k=axes.indexOf(horizontalAxis);
    var i=1;
    for(var j=numAxes;j--;){i*=axisMeasureCaches[j][location[j]].length;}
    var axisWidths=new Array(numAxes),
        axisHeights=new Array(numAxes),
        digits=new Array(numAxes);
    for(;i--;){
        var flag=false,
            reqWidth=0,
            reqHeight=null;
        for(var j=numAxes,n=i;j--;){
            var m=axisMeasureCaches[j][location[j]],
                d=digits[j]=n%m.length,
                parallel=m[d].parallel,
                perpendicular=m[d].perpendicular,
                axisWidth,axisHeight;
            if(j==k){
                if(isc.isAn.Array(parallel)){
                    axisWidths[j]=parallel.duplicate();
                    axisWidth=parallel.max();
                }else{
                    axisWidth=axisWidths[j]=parallel;
                }
                if(isc.isAn.Array(perpendicular)){
                    axisHeights[j]=perpendicular.duplicate();
                    axisHeight=perpendicular.sum();
                }else{
                    axisHeight=axisHeights[j]=perpendicular;
                }
            }else{
                if(isc.isAn.Array(perpendicular)){
                    axisWidths[j]=perpendicular.duplicate();
                    axisWidth=perpendicular.sum();
                }else{
                    axisWidth=axisWidths[j]=perpendicular;
                }
                if(isc.isAn.Array(parallel)){
                    axisHeights[j]=parallel.duplicate();
                    axisHeight=parallel.max();
                }else{
                    axisHeight=axisHeights[j]=parallel;
                }
            }
            reqWidth+=axisWidth;
            reqHeight=(reqHeight==null?axisHeight:Math.max(reqHeight,axisHeight));
            n=(n-d)/m.length;
        }
        if(reqWidth<=availableWidth&&reqHeight<=availableHeight){
            var extraAvailableWidth=availableWidth-reqWidth;
            if(isc.isAn.Array(axisWidths[k])){
                for(var l=axisWidths[k].length;l--;){
                    axisWidths[k][l]+=extraAvailableWidth;
                }
            }else{
                axisWidths[k]+=extraAvailableWidth;
            }
            var verticalAxisHeight=(
                    availableHeight
                    -(isc.isAn.Array(axisHeights[k])?axisHeights[k].sum():axisHeights[k])),
                utility=1.0;
            for(var j=numAxes;j--;){
                var m=axisMeasureCaches[j][location[j]];
                if(j!=k){
                    if(isc.isAn.Array(axisHeights[j])){
                        for(var l=axisHeights[j].length;l--;){
                            axisHeights[j][l]=verticalAxisHeight;
                        }
                    }else{
                        axisHeights[j]=verticalAxisHeight;
                    }
                }
                utility*=(1+axes[j].utility(axisWidths[j],axisHeights[j],m[digits[j]]));
            }
            if(maxUtility==null||utility>maxUtility){
                flag=true;
                maxUtility=utility;
            }
        }else{
            var utility=Math.min(
                    (availableWidth-reqWidth)*availableHeight,
                    availableWidth*(availableHeight-reqHeight));
            if(maxUtility==null||utility>maxUtility){
                flag=true;
                maxUtility=utility;
            }
            var horizontalAxisHeight=axisHeights[k]=Math.min(axisHeights[k],availableHeight),
                verticalAxisWidth=0;
            for(var j=numAxes;j--;){
                if(j!=k){
                    if(isc.isAn.Array(axisWidths[j])){
                        for(var l=axisWidths[j].length;l--;){
                            if(availableWidth<reqWidth){
                                var w=axisWidths[j][l]=Math.floor(axisWidths[j][l]*availableWidth/reqWidth);
                                verticalAxisWidth+=w;
                            }
                        }
                    }else{
                        if(availableWidth<reqWidth){
                            var w=axisWidths[j]=Math.floor(axisWidths[j]*availableWidth/reqWidth);
                            verticalAxisWidth+=w;
                        }
                    }
                    if(isc.isAn.Array(axisHeights[j])){
                        for(var l=axisHeights[j].length;l--;){
                            axisHeights[j][l]=availableHeight-horizontalAxisHeight;
                        }
                    }else{
                        axisHeights[j]=availableHeight-horizontalAxisHeight;
                    }
                }
            }
            if(!(availableWidth<reqWidth)){
                verticalAxisWidth=reqWidth-axisWidths[k];
            }
            axisWidths[k]=availableWidth-verticalAxisWidth;
        }
        if(flag&&saveExtraInfo){
            var axisMeasures=new Array(numAxes);
            for(var j=numAxes;j--;){
                axisMeasures[j]=axisMeasureCaches[j][location[j]][digits[j]];
            }
            isc.addProperties(extra,{
                axisMeasures:axisMeasures,
                axisWidths:axisWidths.map(function(w){return(isc.isAn.Array(w)?w.duplicate():w);}),
                axisHeights:axisHeights.map(function(h){return(isc.isAn.Array(h)?h.duplicate():h);})
            });
        }
    }
    isc.FacetChart._setCacheByAxes(utilityCache,location,maxUtility);
    return maxUtility;
}
,isc.A._getCacheByAxes=function isc_c_FacetChart__getCacheByAxes(cache,location){
    var numAxes=location.length;
    for(var i=0;i<numAxes-1;++i){
        if(cache[location[i]]==null){
            return null;
        }else{
            cache=cache[location[i]];
        }
    }
    return cache[location[numAxes-1]];
}
,isc.A._setCacheByAxes=function isc_c_FacetChart__setCacheByAxes(cache,location,newValue){
    var numAxes=location.length;
    for(var i=0;i<numAxes-1;++i){
        if(cache[location[i]]==null){
            cache=cache[location[i]]=[];
        }else{
            cache=cache[location[i]];
        }
    }
    cache[location[numAxes-1]]=newValue;
    return newValue;
}
,isc.A._localSearch=function isc_c_FacetChart__localSearch(axes,utilityFn,location){
    var moveFn=isc.FacetChart._move,
        moveToFn=isc.FacetChart._moveTo,
        locationToVertex=isc.FacetChart._locationToVertex,
        binarySearch=isc.FacetChart._binarySearch,
        _this=this,
        numAxes=axes.length,
        maxUtilityLevel=Math.pow(1.3,numAxes);
    var bounds=new Array(2*numAxes);
    for(var i=2*numAxes;i--;)bounds[i]=null;
    var utilityCache=[];
    var bestUtilityLocation=location.duplicate();
    var bestUtility=utilityFn(location);
    isc.FacetChart._setCacheByAxes(utilityCache,location,bestUtility);
    var graph=this._createLocationGraph();
    var move=new Array(numAxes);
    for(var count=0;true;++count){
        var center=location.duplicate(),
            cachedUtility=isc.FacetChart._getCacheByAxes(utilityCache,location),
            utility;
        if(cachedUtility==null){
            utility=isc.FacetChart._setCacheByAxes(utilityCache,location,utilityFn(location));
        }else{
            utility=cachedUtility;
        }
        var maxUtility=null,
            maxUtilityLocation=null;
        for(var i=numAxes;i--;){
            move[i]=0;
        }
        var maximum=true,minimum=true,partialMaxCount=0,partialMinCount=0;
        for(var i=numAxes;i--;){
            var partialMax=true,partialMin=true;
            for(var step=-1;step<=1;step+=2){
                move[i]=step;
                var moved=moveFn(axes,move,location,bounds);
                if(moved){
                    var u=utilityFn(location);
                    graph.addEdge(center,utility,location,u);
                    maximum=maximum&&utility>=u;
                    minimum=minimum&&utility<=u;
                    partialMax=partialMax&&utility>u;
                    partialMin=partialMin&&utility<u;
                    isc.FacetChart._setCacheByAxes(utilityCache,location,u);
                    if(maxUtility==null||u>maxUtility){
                        maxUtility=u;
                        maxUtilityLocation=location.duplicate();
                    }
                }
                moveToFn(axes,location,center,bounds);
            }
            if(!(partialMin&&partialMax)){
                if(partialMin)++partialMinCount;
                if(partialMax)++partialMaxCount;
            }
            move[i]=0;
        }
        if(maxUtility!=null&&maxUtility>bestUtility){
            bestUtility=maxUtility;
            bestUtilityLocation=maxUtilityLocation;
        }
        var utilityLevel=Math.min(0,maxUtilityLevel*(1-count/20)),
            done=(maximum&&bestUtility>=utilityLevel);
        maximum=maximum&&partialMaxCount==numAxes;
        var saddle=!maximum&&(numAxes<2||(partialMinCount>1&&partialMaxCount>1));
        minimum=minimum&&!(maximum||saddle);
        if(done){
            break;
        }
        graph.visit(center,utility,maximum,minimum,saddle);
        var newLocation=graph.getNewLead();
        if(newLocation!=null){
            moveToFn(axes,location,newLocation);
        }else{
            break;
        }
    }
    moveToFn(axes,location,bestUtilityLocation);
    return(bestUtility>=0.0?location:null);
}
,isc.A._createLocationGraph=function isc_c_FacetChart__createLocationGraph(){
    return{
        vertices:[],
        leads:new isc.FacetChart._priorityQueue(),
        _locationToKey:function(location){
            return location.join(",");
        },
        _keyToLocation:function(key){
            return key.split(",").map(parseInt,10);
        },
        _getVertex:function(location){
            var key=this._locationToKey(location);
            var j=isc.FacetChart._binarySearch(this.vertices,0,this.vertices.length-1,"key",key);
            if(j<0){
                var obj={
                    key:key,
                    visited:false,
                    priority:0,
                    index:0,
                    forward:[],
                    reverse:[]
                };
                this.vertices.addAt(obj,-(1+j));
                this.leads.enqueue(obj);
                return obj;
            }else{
                return this.vertices[j];
            }
        },
        getNewLead:function(){
            var vertex=this.leads.dequeue();
            return(vertex!=null?this._keyToLocation(vertex.key):null);
        },
        _calculatePriority:function(vertex){
            var epsilon=10e-6;
            var utilityScore=1/(1+Math.exp(epsilon*-vertex.utility));
            var forward=vertex.forward,
                reverse=vertex.reverse,
                structureScore=0;
            for(var i=reverse.length;i--;){
                var adjacent=reverse[i];
                if(adjacent.saddle){
                    structureScore=5;
                    break;
                }else if(adjacent.minimum){
                    structureScore=Math.max(structureScore,4);
                }else{
                    structureScore=Math.max(structureScore,3);
                }
            }
            if(structureScore==0){
                for(var i=forward.length;i--;){
                    var adjacent=forward[i];
                    if(adjacent.saddle){
                        structureScore=2;
                        break;
                    }else if(adjacent.maximum){
                        structureScore=Math.max(structureScore,1);
                    }
                }
            }
            structureScore/=5;
            return(utilityScore+structureScore)/2;
        },
        addEdge:function(location1,utility1,location2,utility2){
            var vertex1=this._getVertex(location1),
                vertex2=this._getVertex(location2);
            vertex1.utility=utility1;
            vertex2.utility=utility2;
            if(!(vertex1.visited||vertex2.visited)){
                if(utility1<=utility2){
                    vertex1.forward.push(vertex2);
                    vertex2.reverse.push(vertex1);
                }
                if(utility1>=utility2){
                    vertex1.reverse.push(vertex2);
                    vertex2.forward.push(vertex1);
                }
            }
        },
        visit:function(location,utility,maximum,minimum,saddle){
            var vertex=this._getVertex(location);
            vertex.visited=true;
            vertex.utility=utility;
            vertex.maximum=maximum;
            vertex.minimum=minimum;
            vertex.saddle=saddle;
            var leads=this.leads;
            leads.remove(vertex);
            var forward=vertex.forward,
                reverse=vertex.reverse;
            for(var i=forward.length;i--;){
                var adjacent=forward[i];
                if(!adjacent.visited){
                    leads.changePriority(adjacent,this._calculatePriority(adjacent));
                }
            }
            for(var i=reverse.length;i--;){
                var adjacent=reverse[i];
                if(!adjacent.visited){
                    leads.changePriority(adjacent,this._calculatePriority(adjacent));
                }
            }
        }
    };
}
,isc.A._priorityQueue=function isc_c_FacetChart__priorityQueue(){
    isc.addProperties(this,{
        priorityProperty:"priority",
        indexProperty:"index",
        dequeue:function(){
            var len=this._data.length;
            if(len==0){
                return null;
            }else{
                var node=this._data[0],
                    newRoot=this._data.pop();
                delete node[this.indexProperty];
                if(len>1){
                    this._data[0]=newRoot;
                    newRoot[this.indexProperty]=0;
                    this._bubbleDown(0);
                }
                return node;
            }
        },
        enqueue:function(node){
            this._data.push(node);
            var len=this._data.length;
            node[this.indexProperty]=len-1;
            this._bubbleUp(len-1);
        },
        changePriority:function(node,newPriority){
            var priorityProperty=this.priorityProperty,
                oldPriority=node[priorityProperty];
            if(newPriority!=oldPriority){
                var index=this._findIndex(node);
                if(index!=-1){
                    node[this.priorityProperty]=newPriority;
                    if(newPriority<oldPriority){
                        this._bubbleDown(index);
                    }else{
                        this._bubbleUp(index);
                    }
                }
            }
        },
        remove:function(node){
            if(this.contains(node)){
                this.changePriority(node,2);
                this.dequeue();
            }
        },
        contains:function(node){
            return(this._findIndex(node)!=-1);
        },
        _findIndex:function(node){
            var index=node[this.indexProperty];
            if(!(0<=index&&index<this._data.length)){
                return-1;
            }else{
                return index;
            }
        },
        _data:[],
        _bubbleUp:function(index){
            var priorityProperty=this.priorityProperty,
                indexProperty=this.indexProperty,
                data=this._data,
                node=data[index],
                nodePriority=node[priorityProperty];
            while(index>0){
                var parentIndex=(index-1)>>>1,
                    parent=data[parentIndex];
                if(parent[priorityProperty]<nodePriority){
                    data[index]=parent;
                    parent[indexProperty]=index;
                    index=parentIndex;
                }else{
                    break;
                }
            }
            data[index]=node;
            node[indexProperty]=index;
        },
        _bubbleDown:function(index){
            var priorityProperty=this.priorityProperty,
                indexProperty=this.indexProperty,
                data=this._data,
                len=data.length,
                halfLen=(len>>>1),
                node=data[index],
                nodePriority=node[priorityProperty];
            while(index<halfLen){
                var leftIndex=(index<<1)+1,
                    rightIndex=leftIndex+1,
                    higherPriorityIndex=(
                        (rightIndex<len&&
                         data[leftIndex][priorityProperty]<data[rightIndex][priorityProperty])
                            ?rightIndex:leftIndex);
                var child=data[higherPriorityIndex];
                if(child[priorityProperty]>nodePriority){
                    data[index]=child;
                    child[indexProperty]=index;
                    index=higherPriorityIndex;
                }else{
                    break;
                }
            }
            data[index]=node;
            node[indexProperty]=index;
        }
    });
}
,isc.A._move=function isc_c_FacetChart__move(axes,move,location,bounds){
    var numAxes=axes.length,
        success=true;
    if(bounds!=null){
        for(var i=numAxes;success&&i--;){
            var min=bounds[i],
                max=bounds[numAxes+i],
                pos=location[i]+move[i];
            success=(min==null||min<=pos)&&(max==null||pos<=max);
        }
        if(!success){
            return null;
        }
    }
    for(var i=numAxes;success&&i--;){
        var mag=Math.abs(move[i]),
            step=(move[i]>0?1:-1),
            actionObj=axes[i],
            action=move[i]>0?"increaseScope":"decreaseScope";
        for(var j=0;success&&j<mag;++j){
            success=actionObj[action].call(actionObj);
            if(success){
                location[i]+=step;
            }else if(bounds!=null){
                bounds[Math.max(step,0)*numAxes+i]=location[i];
            }
        }
    }
    return success?location:null;
}
,isc.A._moveTo=function isc_c_FacetChart__moveTo(axes,locationA,locationB,bounds){
    var numAxes=axes.length,
        move=new Array(numAxes);
    for(var i=numAxes;i--;){
        move[i]=locationB[i]-locationA[i];
    }
    return isc.FacetChart._move(axes,move,locationA,bounds);
}
,isc.A._binarySearch=function isc_c_FacetChart__binarySearch(arr,i,j,property,value,comparator){
    if(!isc.isA.Function(comparator))comparator=null;
    if(arr.isEmpty())return-1;
    if(comparator!=null&&property!=null){
        while(i+1<j){
            var k=Math.floor((i+j)/2),
                cmp=comparator(value,arr[k][property]);
            if(cmp<0){
                j=k;
            }else if(cmp>0){
                i=k;
            }else{
                return k;
            }
        }
        var k;
        var cmpI=comparator(value,arr[i][property]);
        if(cmpI<0){
            k=i;
        }else if(!(cmpI>0)){
            return i;
        }else{
            var cmpJ=comparator(value,arr[j][property]);
            if(i!=j&&cmpJ<0){
                k=j;
            }else if(i!=j&&!(cmpJ>0)){
                return j;
            }else{
                k=j+1;
            }
        }
        return-(1+k);
    }else if(comparator==null&&property!=null){
        while(i+1<j){
            var k=Math.floor((i+j)/2),
                v=arr[k][property];
            if(value<v){
                j=k;
            }else if(value>v){
                i=k;
            }else{
                return k;
            }
        }
        var k;
        if(value<arr[i][property]){
            k=i;
        }else if(!(value>arr[i][property])){
            return i;
        }else if(i!=j&&value<arr[j][property]){
            k=j;
        }else if(i!=j&&!(value>arr[j][property])){
            return j;
        }else{
            k=j+1;
        }
        return-(1+k);
    }else if(comparator==null&&property==null){
        while(i+1<j){
            var k=Math.floor((i+j)/2),
                v=arr[k];
            if(value<v){
                j=k;
            }else if(value>v){
                i=k;
            }else{
                return k;
            }
        }
        var k;
        if(value<arr[i]){
            k=i;
        }else if(!(value>arr[i])){
            return i;
        }else if(i!=j&&value<arr[j]){
            k=j;
        }else if(i!=j&&!(value>arr[j])){
            return j;
        }else{
            k=j+1;
        }
        return-(1+k);
    }
}
);
isc.B._maxIndex=isc.C+37;

}else{
    isc.defineClass("FacetChart","Canvas","Chart");
    isc.A=isc.FacetChart;
isc.A.invalidClass=true;
isc.A.invalidErrorMessage="FacetChart class requires optional Drawing module which is "+
                "not loaded. Please make sure the Drawing module is included in this page "+
                "before the Charts module."
    ;

    isc.A=isc.FacetChart.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_FacetChart_initWidget(){
            this.logWarn(isc.FacetChart.invalidErrorMessage);
            this.Super("initWidget",arguments);
        }
);
isc.B._maxIndex=isc.C+1;

}
isc.A=isc.FacetChart;
isc.A.allChartTypes=["Area","Column","Bar","Line","Pie","Doughnut","Radar"];
isc.A._allMultiAxisChartTypes=["Area","Column","Line"];
isc.A.regressionLinesContextMenuItemTitle="Regression Lines";
isc.A.hideRegressionLinesContextMenuItemTitle="None";
isc.A.linearRegressionLinesContextMenuItemTitle="Straight Line";
isc.A.polynomialRegressionLinesContextMenuItemTitle="Polynomial Curve";
isc.A.polynomialDegreeRegressionLinesContextMenuItemTitle="Polynomial Degree...";
isc.A.polynomialDegreePrompt="Enter a degree for the polynomial regression curve (must be a positive integer):";
isc.A.invalidPolynomialDegreeMessage="The regression polynomial degree must be a positive integer."
;

isc.A=isc.FacetChart;
isc.A._firstVMLRedrawDelay=100
;

isc.Page.setEvent("load",function(){
    if(isc.FacetChart){
        isc.FacetChart._pageLoadTime=new Date().getTime();
        isc.Timer.setTimeout("isc.FacetChart.addClassProperties({_safeForVMLRedraw: true});"+
                             "isc.Log.logDebug('Marked FacetChart safe for VML redraws','drawing')",
                                    isc.FacetChart._firstVMLRedrawDelay);
        isc.Log.logDebug("Kicked off VML safety delay timer","drawing");
    }
});
isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('Charts');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._Charts_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('Charts module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'Charts'.");}

/*

  SmartClient Ajax RIA system
  Version v9.1p_2014-11-06/Pro Development Only (2014-11-06)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF THE
     SOFTWARE LICENSE AGREEMENT. If you have received this file without an 
     Isomorphic Software license file, please see:

         http://www.isomorphic.com/licenses/license-sisv.html

     You are not required to accept this agreement, however, nothing else
     grants you the right to copy or use this software. Unauthorized copying
     and use of this software is a violation of international copyright law.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. YOU ARE EXPRESSLY PROHIBITED
     FROM ATTEMPTING TO REVERSE ENGINEER THIS SOFTWARE OR MODIFY THIS
     SOFTWARE FOR HUMAN READABILITY.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/


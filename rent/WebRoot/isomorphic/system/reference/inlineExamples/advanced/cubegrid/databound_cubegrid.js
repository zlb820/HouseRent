// skinning
isc.HeaderGrid.addProperties({
    backgroundColor:"#6682A0"
});

// Define "facet" objects. These will be displayed as rows / columns in the CubeGrid
var productRevenue_facets = [

	{
		id:"Regions",
		title:"Region",
        isTree:true,
		values:[
			{id:"sum", title:"All Regions", collapse:false},
			{id:"North", parentId:"sum", title:"North"},
			{id:"South", parentId:"sum", title:"South"},
			{id:"East", parentId:"sum", title:"East"},
			{id:"West", parentId:"sum", title:"West"}
		]
	},

	{
		id:"Scenarios",
		title:"Scenario",
		values:[
			{id:"Actual", title:"Actual"},
			{id:"Budget", title:"Budget"}
		]
	},

	{
		id:"Time",
		title:"Time",
		isTree:true,
		collapsed:true,
		width:150,
		values:[
			{id:"sum", title:"All Years", collapsed:false},
			{id:"2002", parentId:"sum", title:"2002"},
			{id:"2003", parentId:"sum", title:"2003"},
			{id:"2004", parentId:"sum", title:"2004", collapsed:false},
			{id:"Q1-2002", parentId:"2002", title:"Q1-2002"},
			{id:"Q2-2002", parentId:"2002", title:"Q2-2002"},
			{id:"Q3-2002", parentId:"2002", title:"Q3-2002"},
			{id:"Q4-2002", parentId:"2002", title:"Q4-2002"},
			{id:"Q1-2003", parentId:"2003", title:"Q1-2003"},
			{id:"Q2-2003", parentId:"2003", title:"Q2-2003"},
			{id:"Q3-2003", parentId:"2003", title:"Q3-2003"},
			{id:"Q4-2003", parentId:"2003", title:"Q4-2003"},
			{id:"Q1-2004", parentId:"2004", title:"Q1-2004"},
			{id:"Q2-2004", parentId:"2004", title:"Q2-2004"},
			{id:"Q3-2004", parentId:"2004", title:"Q3-2004"},
			{id:"Q4-2004", parentId:"2004", title:"Q4-2004"},
			{id:"1/1/2002", parentId:"Q1-2002", title:"1/1/2002"},
			{id:"2/1/2002", parentId:"Q1-2002", title:"2/1/2002"},
			{id:"3/1/2002", parentId:"Q1-2002", title:"3/1/2002"},
			{id:"4/1/2002", parentId:"Q2-2002", title:"4/1/2002"},
			{id:"5/1/2002", parentId:"Q2-2002", title:"5/1/2002"},
			{id:"6/1/2002", parentId:"Q2-2002", title:"6/1/2002"},
			{id:"7/1/2002", parentId:"Q3-2002", title:"7/1/2002"},
			{id:"8/1/2002", parentId:"Q3-2002", title:"8/1/2002"},
			{id:"9/1/2002", parentId:"Q3-2002", title:"9/1/2002"},
			{id:"10/1/2002", parentId:"Q4-2002", title:"10/1/2002"},
			{id:"11/1/2002", parentId:"Q4-2002", title:"11/1/2002"},
			{id:"12/1/2002", parentId:"Q4-2002", title:"12/1/2002"},
			{id:"1/1/2003", parentId:"Q1-2003", title:"1/1/2003"},
			{id:"2/1/2003", parentId:"Q1-2003", title:"2/1/2003"},
			{id:"3/1/2003", parentId:"Q1-2003", title:"3/1/2003"},
			{id:"4/1/2003", parentId:"Q2-2003", title:"4/1/2003"},
			{id:"5/1/2003", parentId:"Q2-2003", title:"5/1/2003"},
			{id:"6/1/2003", parentId:"Q2-2003", title:"6/1/2003"},
			{id:"7/1/2003", parentId:"Q3-2003", title:"7/1/2003"},
			{id:"8/1/2003", parentId:"Q3-2003", title:"8/1/2003"},
			{id:"9/1/2003", parentId:"Q3-2003", title:"9/1/2003"},
			{id:"10/1/2003", parentId:"Q4-2003", title:"10/1/2003"},
			{id:"11/1/2003", parentId:"Q4-2003", title:"11/1/2003"},
			{id:"12/1/2003", parentId:"Q4-2003", title:"12/1/2003"},
			{id:"1/1/2004", parentId:"Q1-2004", title:"1/1/2004"},
			{id:"2/1/2004", parentId:"Q1-2004", title:"2/1/2004"},
			{id:"3/1/2004", parentId:"Q1-2004", title:"3/1/2004"},
			{id:"4/1/2004", parentId:"Q2-2004", title:"4/1/2004"},
			{id:"5/1/2004", parentId:"Q2-2004", title:"5/1/2004"},
			{id:"6/1/2004", parentId:"Q2-2004", title:"6/1/2004"},
			{id:"7/1/2004", parentId:"Q3-2004", title:"7/1/2004"},
			{id:"8/1/2004", parentId:"Q3-2004", title:"8/1/2004"},
			{id:"9/1/2004", parentId:"Q3-2004", title:"9/1/2004"},
			{id:"10/1/2004", parentId:"Q4-2004", title:"10/1/2004"},
			{id:"11/1/2004", parentId:"Q4-2004", title:"11/1/2004"},
			{id:"12/1/2004", parentId:"Q4-2004", title:"12/1/2004"}
		]
	},
	
	{
		id:"Products",
		title:"Products",
		isTree:true,
		collapsed:true,
		width:175,
		values:[
			{id:"sum", title:"All Products", collapsed:false},
			{id:"ProdFamily1", parentId:"sum", title:"Office Paper Products"},
			{id:"ProdFamily2", parentId:"sum", title:"Office Filing and Storage"},
			{id:"ProdFamily3", parentId:"sum", title:"Office Machines"},
			{id:"ProdFamily4", parentId:"sum", title:"Computer Consumables", collapsed:false},
			{id:"ProdGroup1", parentId:"ProdFamily1", title:"Photocopy / Lasercopy", collapsed:false},
			{id:"ProdGroup2", parentId:"ProdFamily1", title:"Post-it Products"},
			{id:"ProdGroup3", parentId:"ProdFamily2", title:"Folders"},
			{id:"ProdGroup4", parentId:"ProdFamily3", title:"Overhead Projectors"},
			{id:"ProdGroup5", parentId:"ProdFamily4", title:"Printing Supplies"},
			{id:"ProdGroup6", parentId:"ProdFamily4", title:"Storage / Accessories"},
			{id:"Prod01", parentId:"ProdGroup1", title:"Copy Paper A4"},
			{id:"Prod02", parentId:"ProdGroup1", title:"Copy Paper Letter"},
			{id:"Prod03", parentId:"ProdGroup1", title:"Copy Paper Legal"},
			{id:"Prod04", parentId:"ProdGroup1", title:"Paper Reflex A4"},
			{id:"Prod05", parentId:"ProdGroup1", title:"Paper Reflex Letter"},
			{id:"Prod06", parentId:"ProdGroup1", title:"Paper Reflex Legal"},
			{id:"Prod07", parentId:"ProdGroup1", title:"Paper Optix A4"},
			{id:"Prod08", parentId:"ProdGroup1", title:"Paper Optix Letter"},
			{id:"Prod09", parentId:"ProdGroup1", title:"Paper Optix Legal"},
			{id:"Prod10", parentId:"ProdGroup1", title:"Renew Recycled A4"},
			{id:"Prod11", parentId:"ProdGroup1", title:"Renew Recycled Letter"},
			{id:"Prod12", parentId:"ProdGroup1", title:"Renew Recycled Legal"},
			{id:"Prod13", parentId:"ProdGroup2", title:"653 Neon Colors"},
			{id:"Prod14", parentId:"ProdGroup2", title:"654 Blue"},
			{id:"Prod15", parentId:"ProdGroup2", title:"654 Yellow"},
			{id:"Prod16", parentId:"ProdGroup2", title:"654 Green"},
			{id:"Prod17", parentId:"ProdGroup2", title:"654 Neon Yellow"},
			{id:"Prod18", parentId:"ProdGroup3", title:"Manilla Legal Buff"},
			{id:"Prod19", parentId:"ProdGroup3", title:"Manilla Legal Blue"},
			{id:"Prod20", parentId:"ProdGroup3", title:"Manilla Legal Red"},
			{id:"Prod21", parentId:"ProdGroup3", title:"Manilla Legal Green"},
			{id:"Prod22", parentId:"ProdGroup3", title:"Manilla Legal Yellow"},
			{id:"Prod23", parentId:"ProdGroup4", title:"OHP Deltascreen"},
			{id:"Prod24", parentId:"ProdGroup5", title:"Label Copier 98x38"},
			{id:"Prod25", parentId:"ProdGroup5", title:"Label Copier 63x25"},
			{id:"Prod26", parentId:"ProdGroup5", title:"Label Laser 63x25"},
			{id:"Prod27", parentId:"ProdGroup5", title:"Label Copier Avery"},
			{id:"Prod28", parentId:"ProdGroup5", title:"Label Laser Avery"},
			{id:"Prod29", parentId:"ProdGroup5", title:"Label Laser/Copier Avery"},
			{id:"Prod30", parentId:"ProdGroup5", title:"Labels Inkjet J8666"},
			{id:"Prod31", parentId:"ProdGroup5", title:"Labels L7675 Video"},
			{id:"Prod32", parentId:"ProdGroup5", title:"Comp. Paper Bhs7GSM"},
			{id:"Prod33", parentId:"ProdGroup5", title:"Comp. Paper 15x11"},
			{id:"Prod34", parentId:"ProdGroup5", title:"InkJet Cartridge"},
			{id:"Prod35", parentId:"ProdGroup5", title:"BubbleJet Cartridge"},
			{id:"Prod36", parentId:"ProdGroup5", title:"Laserjet Cartidge"},
			{id:"Prod37", parentId:"ProdGroup5", title:"Toner Canon C-f554"},
			{id:"Prod38", parentId:"ProdGroup5", title:"OHP Film 3M pp2900"},
			{id:"Prod39", parentId:"ProdGroup5", title:"OHP Film Blk/Clr"},
			{id:"Prod40", parentId:"ProdGroup5", title:"OHP Film 3M (laser)"},
			{id:"Prod41", parentId:"ProdGroup5", title:"Label Floppy 3.5"},
			{id:"Prod42", parentId:"ProdGroup5", title:"Label CD"},
			{id:"Prod43", parentId:"ProdGroup5", title:"Label Zip"},
			{id:"Prod44", parentId:"ProdGroup6", title:"Diskette Box"},
			{id:"Prod45", parentId:"ProdGroup6", title:"Label Holders"},
			{id:"Prod46", parentId:"ProdGroup6", title:"Keyboard Cover"},
			{id:"Prod47", parentId:"ProdGroup6", title:"Pen tidy"},
			{id:"Prod48", parentId:"ProdGroup6", title:"Screen Filter 15''"},
			{id:"Prod49", parentId:"ProdGroup6", title:"Screen Filter 18''"},
			{id:"Prod50", parentId:"ProdGroup6", title:"Screen Mesh 15''"}
		]
	}
];

//======================================================================
//	Create a CubeGrid (multidimensional grid) component
//======================================================================
isc.CubeGrid.create({
	ID:"report",
    
    // Don't draw this CubeGrid - it will be written into a Layout with the facet-control
    // UI components
    autoDraw:false,

	// data configuration
	facets:         productRevenue_facets, // defined above
	dataSource:     "productRevenue",      // defined in datasource file productRevenue.ds.xml
	valueProperty:  "value",
	cellIdProperty: "cellID",
	hiliteProperty: "_hilite",

	// initial facet layout
	rowFacets:        ["Regions", "Products"],
	columnFacets:     ["Time"],
	fixedFacetValues: {Scenarios:"Budget"},

	// hover tips
	canHover:true,
	cellHoverHTML:"if (record != null) return 'cell value: '+record.value+'<br>cell ID: '+record.cellID;",
	hoverProperties:{width:150, height:20},

	enableCharting:			true,
	showFacetValueContextMenus:	true,
	showFacetContextMenus:		true,
	showCellContextMenus:		true,
    valueTitle:"Sales",

	// misc settings for this application
	canCollapseFacets:true,
	canMinimizeFacets:true,
	autoSelectValues:"both",	// both, cols, row, none
	rowHeaderGridMode:true,
	canMoveFacets:true
    
});



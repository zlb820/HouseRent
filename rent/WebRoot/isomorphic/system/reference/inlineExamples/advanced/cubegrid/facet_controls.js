
//======================================================================
// User interface components for describing / manipulating facet position
// ======================================================================

// Create a label to show what facets are currently being displayed in the
// CubeGrid.
isc.Label.create({
    ID:"reportLabel",
    width:500, height:30,
    wrap:false, overflow:"visible", padding:5,
    styleName:"blackOnWhite",
    border:"1px solid black;",
    align:"center", valign:"center",
    layoutAlign:"center",
    autoDraw:false
    // Note - we set up contents dynamically in updateLabels()
})


//======================================================================
// Create a subclass of Menu for manipulating facets
//======================================================================
isc.ClassFactory.defineClass("FacetMenu", "Menu");

// All facet menus have the same basic set of items - set these up on init
// FacetMenus should be initialized with 2 properties:
//  "cubeGrid"    a pointer to a CubeGrid
//  "facetId"     the ID property for the facet for which this is a menu
isc.FacetMenu.addMethods({
    initWidget : function () {
        var cubeGridId = this.cubeGrid.getID();
        this.data = [
            // Items to explicitly add facet to rows / columns
            {   title:"Add To Row Facets", 
                enableIf:"!" + cubeGridId + ".rowFacets.contains('" + this.facetId + "')",
                click:"report.addToRowFacets('" + this.facetId + "');"
            },
            {   title:"Add To Column Facets", 
                enableIf:"!" + cubeGridId+ ".columnFacets.contains('" + this.facetId + "')",
                click:"report.addToColumnFacets('" + this.facetId + "');"                
            },
            
            // Fix facetValue submenu - 
            // When a facetValue is 'fixed', every cell displayed in the cube grid will match
            // the specified value in the appropriate facet.
            {   title:"Fix " + this.facetId + " value",
                submenu:
                    // Note - the data in this submenu is taken directly from the appropriate 
                    // facet's value tree object.  
                    // Whenever a menu's data array is set to a tree object, a hierachical set 
                    // of submenus will be auto-generated to represent this tree.
                    isc.Menu.create({
                        autoDraw:false,
                		canSelectParentItems:true,        
                        data:isc.Tree.create({
                            modelType:"parent",
                            // xxx Note (Not to be included in source version):
                            // We have to set the childrenProperty to something other than 'children',
                            // as the children property will be written onto the facet value objects,
                            // and when the facet values are later uesd to intantiate buttons in 
                            // the headers of the CubeGrid, the entire subtree of facetValues is 
                            // instantiated as a subtree of children within every Button in the header.
                            childrenProperty:"childNodes",
                            data:this.cubeGrid.getFacet(this.facetId).values
                    }),
                    itemClick:"report.fixFacetValue('" + facetId + "', item.id)"
            	})
            }
            
        ];
        
        return this.Super("initWidget", arguments);
    }
});


// Add some simple helper methods to the report for programmatically pivoting and fixing facet 
// values.
// These methods will show a warn dialog if the user attempts to remove the last facet from
// either axis
report.addMethods({
    addToColumnFacets : function (facetId) {
        // If this is the only rowFacet, we can't make it a column facet
        if (this.rowFacets.length == 1 && this.rowFacets.contains(facetId)) {
            isc.warn("Unable to add " + facetId + " to column facets.<br>" +
                     "This would remove the only row-facet for this cubeGrid.");
            return;
        }
        this.addColumnFacet(facetId);
    },
    
    addToRowFacets : function (facetId) {

        // If this is the only rowFacet, we can't make it a column facet
        if (this.columnFacets.length == 1 && this.columnFacets.contains(facetId)) {
            isc.warn("Unable to add " + facetId + " to row facets.<br>" +
                     "This would remove the only column-facet for this cubeGrid.");
            return;
        }
        this.addRowFacet(facetId);
    },
    
    fixFacetValue : function (facetId, facetValue) {
        // If this is the only rowFacet, or column facet we can't fix it
        if ((this.columnFacets.length == 1 && this.columnFacets.contains(facetId)) ||
            (this.rowFacets.length == 1 && this.rowFacets.contains(facetId))) {
            isc.warn("Unable to fix value for " + facetId + ".<br>" +
                     "This would remove the only column-facet for this cubeGrid.");
            return;
        }
        
        this.setFixedFacetValue(facetId,facetValue);
    }
});
//======================================================================
// Create a subclass of MenuButton which supports facet manipulation via
// drag & drop
//======================================================================
isc.ClassFactory.defineClass("FacetMenuButton", "MenuButton");

// Set defaults on MenuButton class to avoid re-setting properties on each instance
isc.FacetMenuButton.addProperties({
	width:175,
	canDrag:true,
	canDrop:true,
	dragType:"facet",
    prompt:"Drag to desired facet position, or click to display menu."
});


//======================================================================
// create Menus / MenuButtons for each facet
//======================================================================

var facetIds = ["Regions", "Scenarios", "Time", "Products"]

// Use a VLayout to stack the menu buttons one above another
isc.VLayout.create({
    width:175,
    ID:"menuButtonStack",
    membersMargin:20,
    autoDraw:false
})

// Create the FacetMenuButtons, and FacetMenus for each facet
for (var i = 0; i < facetIds.length; i++) {
    var facetId = facetIds[i];
    
    menuButtonStack.addMember(
        isc.FacetMenuButton.create({
            // title for this button set up below by updateLabels()
    
            autoDraw:false,
        	ID:facetId + "Button",
        
            // Initialize a FacetMenu instance for the 'Regions' facet
            // - initWidget for this class will make use of the 'cubeGrid' and 'facetId' properties
            //   to instantiate the menu with appropriate menu items.
            // Note - we re-use this menu as a context menu below, referring to it by it's ID.
        	menu: isc.FacetMenu.create({
                ID:facetId + "Menu",
                width: 175,
                cubeGrid:report,
                facetId:facetId
            }),
        
    	    facetId:facetId   // cubeGrid detects dropped components with facetId property
        })
    );
}    

//======================================================================
// Create 2 ListGrids as an alternative UI for drag-rearranging facets
//======================================================================

// RowFacet ListGrid - displays the facets displayed as rows
// allows drag and drop manipulation of facets
isc.ListGrid.create({
    ID:"rowFacetList",
    autoDraw:false,
    left:250,
    width:150, height:150,

    canSort:false, showSortArrow:"none", leaveScrollbarGap:false,
    selectionType:"single",

    fields:[{title:"Row Facets", name:"title"}],
    
    // On a context click on a record, show the appropriate menu
    cellContextClick : function (record, rowNum, colNum) {
        // the appropriate menus are named "RegionsMenu", etc.
        var menu = window[record.id + "Menu"];
        menu.showContextMenu();
        return false;
    },
        
    canReorderRecords:true,
    canDragRecordsOut:true,
    canAcceptDroppedRecords:true,
    
    // We're going to override default ListGrid drag and drop behavior to support
    // - dragging the facet menu-buttons into the ListGrid
    // - dragging the records directly from the ListGrid to the CubeGrid header bars
    // - updating the CubeGrid header bars whenever drag and drop of records occurs
    
    // To enable dragging records to the cubeGrid headers, set dragType to facet
    dragType:"facet",

    // Allow anything with dragType facet to drop onto us
    willAcceptDrop : function () {
        if (isc.Event.getDragTarget().dragType == "facet") return true;
        return false;            
    },

    // override 'transferDragData' - disallow dragging the last facet from this
    // axis
    transferDragData : function () {
        var selection = this.getDragData();
        if (selection.length == this.data.getLength()) {
            isc.warn("Unable to shift all row facets onto columns - cubeGrid requires at least "
                    + "one facet on each axis.");
            return null;
        }
        return this.Super("transferDragData", arguments);
    },

    // Override recordDrop to add / reorder facets in the CubeGrid
    recordDrop : function (dropRecords, targetRecord, dropIndex, sourceWidget) {
        if (sourceWidget.dragType == "facet") {
            // rather than updating this list's data, add the data to the cubeGrid rowFacets
            // and we'll get updated by observation
            report.addRowFacet(sourceWidget.facetId, dropIndex)
        }
    },
    
    // Override dragStart to set up the 'facetId' on this object, so if the user drags to the
    // CubeGrid header bar, the CubeGrid knows which facet is being dragged from the
    // dragTarget's 'facetId'
    dragStart : function () {
        if (this.Super('dragStart')) {
            this.facetId = this.getSelectedRecord().id;
        }
    }
      
});

// ColumnFacet ListGrid
// (Basically the same as the RowFacet ListGrid above, but displays the facets displayed as Columns)
isc.ListGrid.create({
    ID:"colFacetList",
    autoDraw:false,
    left:450,
    width:150, height:150,

    canSort:false, showSortArrow:"none", leaveScrollbarGap:false,
    selectionType:"single",
    
    fields:[{title:"Column facets", name:"title"}],

    // On a context click on a record, show the appropriate menu
    cellContextClick : function (record, rowNum, colNum) {
        var menu = window[record.id + "Menu"];
        menu.showContextMenu();
        return false;
    },
    
    canReorderRecords:true,
    canDragRecordsOut:true,
    canAcceptDroppedRecords:true,

    // We're going to override default ListGrid drag and drop behavior to support
    // - dragging the facet menu-buttons into the ListGrid
    // - dragging the records directly from the ListGrid to the CubeGrid header bars
    // - updating the CubeGrid header bars whenever drag and drop of records occurs
    
    dragType:"facet",
    
    willAcceptDrop : function () {
        if (isc.Event.getDragTarget().dragType == "facet") return true;
        return false;            
    },
    
    // override 'transferDragData' - disallow dragging the last facet from this
    // axis
    transferDragData : function () {
        var selection = this.getDragData();
        if (selection.length == this.data.getLength()) {
            isc.warn("Unable to shift all column facets onto rows - cubeGrid requires at least "
                    + "one facet on each axis.");
            return null;
        }
        return this.Super("transferDragData", arguments);
    },
    
    // Override recordDrop to add / reorder facets in the CubeGrid
    recordDrop : function (dropRecords, targetRecord, dropIndex, sourceWidget) {
        if (sourceWidget.dragType == "facet") {
            // rather than updating this list's data, add the data to the cubeGrid rowFacets
            // and we'll get updated by observation
            report.addColumnFacet(sourceWidget.facetId, dropIndex)
        }
    },
    dragStart : function () {
        if (this.Super('dragStart')) {
            this.facetId = this.getSelectedRecord().id;
        }
    }
    
});

// Combine the controls into a single canvas for easy UI management
isc.Canvas.create({
    ID:"controlCanvas",
    autoDraw:false,
    height:150,
    width:600,
    overflow:"hidden",
    layoutAlign:"center",
    children:[
        menuButtonStack,
        rowFacetList,
        colFacetList
    ]
})

//======================================================================
// Functions to update the various UI components when the CubeGrid facets
// are rearranged
//======================================================================

isc.Page.addClassMethods({
    // A function to update the records displayed in the two ListGrids
    updateLists : function () {
    
        // Update the data for each ListGrid based on the rowFacets / columnFacets arrays
        // for the CubeGrid
        var data = [];
        for (var i = 0; i < report.rowFacets.length; i++) {
            data[i] = report.getFacet(report.rowFacets[i]);
        }
        rowFacetList.setData(data)
        
        data = [];
        for (var j = 0; j < report.columnFacets.length; j++) {
            data[j] = report.getFacet(report.columnFacets[j]);
        }
        colFacetList.setData(data)
    },
    
    // A function to update the UI when facets are added / removed from the row or column headers
    // Updates the menu-button titles and the Label for the CubeGrid as a whole
    updateLabels : function () {    
        
        // Get the titles for the fixed facet values
        var fixedFacetValueTitles = {};
        for (var i in report.fixedFacetValues) {
            fixedFacetValueTitles[i] = report.getFacetValue(i, report.fixedFacetValues[i]).title;
        }
        
        // update the titles of the menu-buttons to reflect whether each facet is fixed, or displayed
        // in columns or rows.
        
        // we have the set of facet IDs globally as facetIds
        for (var i = 0; i < facetIds.length; i++) {
            var facetId = facetIds[i],
                // is this facet fixed at some value?
                displayType = fixedFacetValueTitles[facetId];
            
            // if not fixed, are we visible in rows, or in columns?
            if (displayType == null) 
                displayType = (report.columnFacets.contains(facetId) ? "in columns" : "in rows");
            
            // get a pointer to the button to update
            var menuButton = window[facetId + "Button"];
            menuButton.setTitle("<b>" + facetId + "</b>: [" + displayType + "]");
        }
        
        // update the title displayed above the CubeGrid
        var fixedValueString;
        for (var j in fixedFacetValueTitles) {
            if (fixedValueString == null) fixedValueString = "";
            else fixedValueString += ", ";
            fixedValueString += j + ": <i>'" + fixedFacetValueTitles[j] + "'</i>";
        }
        
        if (fixedValueString == null) fixedValueString = "none"
        reportLabel.setContents("<B>Report - fixed values: " + fixedValueString + "</B>")
    
    }
})    

// Add handler methods to the CubeGrid to call the methods to update the Page UI 
// when the facets are rearranged
report.addMethods({	
	facetAdded : function (facetId) {
        isc.Page.updateLists();
        isc.Page.updateLabels();
	},
        
    facetMoved : function (facetId) {
        isc.Page.updateLists();
        isc.Page.updateLabels();
    }
});

isc.Page.observe(report, "setFixedFacetValue", "isc.Page.updateLists(); isc.Page.updateLabels();");

// Do an initial update of the UI so it's all correct to start with.
isc.Page.updateLists();
isc.Page.updateLabels();


// Display the CubeGrid and controls in a layout
isc.VLayout.create({
    height:"100%", width:"100%",
    membersMargin:20,
    members:[
        controlCanvas,
        reportLabel,
        report
    ]
})

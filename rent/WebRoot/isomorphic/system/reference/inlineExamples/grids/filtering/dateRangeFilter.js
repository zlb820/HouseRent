// ---------------------------------------------------------------------------------------
// DynamicForm Example (DateRangeItem)

isc.Label.create({
    ID: "externalDynamicFormLabel",
    contents: "External DynamicForm (DateRangeItem)",
    width: 595,
    height: 25,
    baseStyle: "exampleSeparator"
});

isc.DynamicForm.create({
    ID: "form",
    width: 500, 
    titleOrientation: "top",
    dataSource: "worldDS",
    items: [
        { name: "independence", editorType: "DateRangeItem", showTitle: false, allowRelativeDates: true },
        { name: "searchButton", type: "ButtonItem", title: "Filter",
            click: function () {
                var criteria = form.getField("independence").getCriterion();
                grid1.fetchData(criteria);
            }
        }
    ]
});

// Create a ListGrid displaying data from the worldDS
isc.ListGrid.create({
    ID: "grid1",
    width: 595,
    dataSource: "worldDS"
});

// ---------------------------------------------------------------------------------------
// Inline FilterEditor Example (MiniDateRangeItem)
isc.Label.create({
    ID: "filterEditorLabel",
    contents: "FilterEditor (MiniDateRangeItem)",
    width: 595,
    height: 25,
    baseStyle: "exampleSeparator"
});

// Create a ListGrid displaying data from the worldDS and also displaying a FilterEditor
isc.ListGrid.create({
    ID: "grid2",
    width: 595,
    dataSource: "worldDS",
    autoFetchData: true,
    showFilterEditor: true
});

isc.VLayout.create({
    width: "100%",
    height: "100%",
    membersMargin: 10,
    members: [
        externalDynamicFormLabel, form, grid1, filterEditorLabel, grid2
    ]
})

//Give the DateRangeItem an initial value (see the DateRange object)
form.getItem("independence").setValue({ 
 start: { _constructor: "RelativeDate", value: "-1200m" }, 
 end: { _constructor: "RelativeDate", value: "-600m" }
});

form.getItem("searchButton").click();

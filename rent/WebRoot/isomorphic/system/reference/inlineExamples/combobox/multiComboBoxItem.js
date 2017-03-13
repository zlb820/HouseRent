var initialLayoutStyle = "flow";

var configureForm = isc.DynamicForm.create({
    isGroup: true,
    groupTitle: "Configure Multi ComboBox",
    width: "100%",
    padding: 3,
    titleOrientation: "top",
    items: [{
        title: "Change layout style",
        type: "select",
        shouldSaveValue: false,
        defaultValue: initialLayoutStyle,
        valueMap: ["flow", "horizontal", "horizontalReverse", "vertical", "verticalReverse"],
        changed: function (form, item, value) {
            selectedSupplyItems.getField("supplies").setLayoutStyle(value);
        }
    }]
});

var suppliesForm = isc.DynamicForm.create({
    top: 75,
    ID: "selectedSupplyItems",
    width: "100%",
    numCols: 1,
    titleOrientation: "top",
    items: [{
        name: "supplies",
        title: "Items",
        editorType: "MultiComboBoxItem",
        optionDataSource: "supplyItem",
        displayField: "itemName",
        valueField: "itemID",
        value: [1, 10, 23, 123],
        autoFetchData: true,
        layoutStyle: initialLayoutStyle
    }]
});

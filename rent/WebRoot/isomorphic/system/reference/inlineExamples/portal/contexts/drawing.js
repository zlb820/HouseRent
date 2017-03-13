
isc.DataSource.create({
    ID: "DrawItem",
    Constructor: "DrawItem",
    serverType: "component"
});

isc.DataSource.create({
    ID: "DrawPane",
    inheritsFrom: "Canvas",
    Constructor: "DrawPane",
    serverType: "component",
    instanceConstructor: "com.smartgwt.client.widgets.drawing.DrawPane",
    fields: [
        { name: "drawItems", type: "DrawItem", multiple: true, propertiesOnly: true }
    ]
});

isc.DataSource.create({
    ID: "EditDrawPane",
    inheritsFrom: "DrawPane",
    Constructor: "EditDrawPane",
    serverType: "component"
});

isc.DrawItem.addProperties({
    setEditMode : function (editingOn, editContext, editNode) {
        if (editingOn == null) editingOn = true;
        if (this.editingOn == editingOn) return;
        this.editingOn = editingOn;

        if (this.editingOn) {
            this.editContext = editContext;
        }
        this.editNode = editNode;
    }
});


// Define a class EditDrawPane to be an EditContext for holding EditNodes having
// DrawItems as their live objects.
isc.ClassFactory.defineClass("EditDrawPane", "DrawPane", "EditContext");

isc.EditDrawPane.addClassProperties({
    _applyProperties : function (properties, obj) {
        // assert isc.isAn.Instance(obj)
        var keys = isc.getKeys(properties),
            original = obj._originalProperties = {};

        for (var i = 0, numKeys = keys.length; i < numKeys; ++i) {
            var key = keys[i];
            original[key] = obj.getProperty(key);
        }

        obj.setProperties(properties);
    },

    _unapplyProperties : function (properties, obj) {
        // assert isc.isAn.Instance(obj)
        obj.setProperties(obj._originalProperties);
    }
});

isc.EditDrawPane.addProperties({

    // This is needed if the system schema has not been loaded.
    getObjectField : function (type) {
        var classObject = isc.ClassFactory.getClass(type);
        if (isc.isA.DrawItem(classObject)) {
            return "drawItems";
        } else {
            return null;
        }
    },

    setEditMode : function (editingOn) {
        if (editingOn == null) editingOn = true;
        if (this.editingOn != editingOn) {
            this.editingOn = editingOn;

            // Clear the selection and hide the selection rectangle if
            // edit mode is turned off.
            if (!editingOn) {
                if (this._selector != null) {
                    this._selector.hide();
                    this._selector.moveBelow(this);
                    this._selectorShowing = false;
                }
                var selection = this._selectedEditNodes;
                this._unselect(selection);
            }

            var editNodes = this.getEditNodeArray();
            for (var i = 0, len = editNodes.getLength(); i < len; ++i) {
                editNodes[i].liveObject.setEditMode(editingOn, this);
            }
        }
    },

    initWidget : function () {
        this.rootLiveObject = this;
        this.rootComponent = {
            _constructor: "EditDrawPane"
        };

        this.Super("initWidget", arguments);
    },

    canAcceptDrop: true,

    // drag selection properties
    canDrag: true,
    dragAppearance: "none",
    overflow: "hidden",
    _selectedEditNodes: [],

    //> @attr EditPane.persistCoordinates (boolean : true : IRW)
    // If enabled, changes to components position and size will be persisted to their
    // EditNodes.  This applies to both programmatic calls and user interaction (drag
    // reposition or drag resize).
    //
    // @visibility external
    //<
    persistCoordinates: true,

    // Override DrawPane.createLinearGradient(), createRadialGradient(), and
    // createSimpleGradient() to save the gradients created for the draw items in the draw pane
    // while the draw items are being edited.  The gradients are part of the state of the draw
    // pane and thus must be serialized along with all other state in getDrawPaneState().

    createLinearGradient : function (id, linearGradient) {
        var ret = this.Super("createLinearGradient", arguments);
        if (this.editingOn) {
            this._linearGradients = this._linearGradients || {};
            this._linearGradients[ret] = linearGradient;
        }
        return ret;
    },

    createRadialGradient : function (id, radialGradient) {
        var ret = this.Super("createRadialGradient", arguments);
        if (this.editingOn) {
            this._radialGradients = this._radialGradients || {};
            this._radialGradients[ret] = radialGradient;
        }
        return ret;
    },

    createSimpleGradient : function (id, simpleGradient) {
        var ret = this.Super("createSimpleGradient", arguments);
        if (this.editingOn) {
            this._simpleGradients = this._simpleGradients || {};
            this._simpleGradients[ret] = simpleGradient;
        }
        return ret;
    },

    // Serialization
    // ---------------------------------------------------------------------------------------

    //> @method editPane.getDrawPaneState()
    // Returns an object containing a copy of all state of this draw pane that is necessary
    // to recreate it.  The returned object has the form:
    // <pre>
    //     {
    //         linearGradients: { someId: someLinearGradient, ... },
    //         radialGradients: { otherId: someRadialGradient, ... },
    //         simpleGradients: { anotherId: someSimpleGradient, ... },
    //         rotation: someDegreesRotation,
    //         zoomLevel: someZoom,
    //         width: someWidth,
    //         height: someHeight,
    //         drawItems: [somePaletteNode, anotherPaletteNode, ...]
    //    }
    // </pre>
    // <p>+link{rotation,rotation}, +link{zoomLevel,zoomLevel}, +link{width,width}, and
    // +link{height,height} are identical to the same +link{DrawPane} properties.
    // The drawItems property is an Array of +link{PaletteNode}s representing all current
    // +link{EditNode}s of +link{DrawItem}s in this draw pane.
    // The linearGradients, radialGradients, and simpleGradients are maps from the string IDs
    // of +link{LinearGradient}s, +link{RadialGradient}s, and +link{SimpleGradient}s,
    // respectively.
    // <p>The gradients can be recreated by calling one of the createGradient() methods.
    // The EditNodes in drawItems can be restored by adding the EditNodes via
    // +link{addNode()} to a new EditDrawPane.
    //
    // @return (Object) the state suitable for saving and for subsequent restoration
    // of this EditDrawPane
    // @visibility external
    //<
    getDrawPaneState : function () {
        return {
            linearGradients: this._linearGradients,
            radialGradients: this._radialGradients,
            simpleGradients: this._simpleGradients,
            rotation: this.rotation,
            zoomLevel: this.zoomLevel,
            width: this.getWidth(),
            height: this.getHeight(),
            drawItems: this._getDrawItemsState()
        };
    },

    _getDrawItemsState : function () {
        var nodes = this.getEditNodeArray(),
            root = this.getEditNodeTree().getRoot(),
            ret = [];

        for (var i = 0, len = nodes.length; i < len; ++i) {
            var node = nodes[i];
            if (root != node) {
                ret.push({ type: node.type, defaults: node.defaults });
            }
        }
        return ret;
    },


    // Component creation
    // ---------------------------------------------------------------------------------------

    // This is needed if the system schema has not been loaded yet.
    getObjectField : function (type) {
        var classObject = isc.ClassFactory.getClass(type);
        if (isc.isA.DrawItem(classObject)) {
            return "drawItems";
        } else {
            return null;
        }
    },

    // on drop from a palette, add a new component
    drop : function () {
        var source = isc.EventHandler.getDragTarget();

        // If the source isn't a Palette then perform the standard drop interaction.
        if (!isc.isA.Palette(source)) {
            return this.Super("drop", arguments);
        }

        var data = source.transferDragData(),
            paletteNode = (isc.isAn.Array(data) ? data[0] : data);
        if (!paletteNode) return false;

        this.requestLiveObject(paletteNode, function (editNode) {
            if (editNode) {
                // Add the new component at the current mouse position.
                this.addNode(editNode);
                editNode.liveObject.moveTo(this.getOffsetX(), this.getOffsetY());
            }
        }, source);

        return isc.EventHandler.STOP_BUBBLING;
    },

    // The EditDrawPane is the default parent for added nodes.
    getDefaultParent : function (newNode, returnNullIfNoSuitableParent) {
        return this.getEditNodeTree().getRoot();
    },

    // Override Canvas.removeChild() to call EditContext.removeNode(), and to remove the
    // component from the list of selected DrawItems.
    removeChild : function (child, name) {
        this.Super("removeChild", arguments);
        var node = this.getEditNodeArray().find("liveObject", child);
        if (node) {
            this.removeNode(node);
        }
        this._selectedEditNodes.remove(node);
    },

    click : function (event) {
        var target = event.target;
        if (this.editingOn && isc.isA.DrawItem(target)) {
            var editNode = this.getEditNodeArray().find("liveObject", target);
            if (editNode != null) {
                var oldSelection = this._selectedEditNodes;

                if (isc.EventHandler.shiftKeyDown()) {
                    // Toggle selection of the edit node.
                    if (oldSelection == null || !oldSelection.contains(editNode)) {
                        var selection = this._selectedEditNodes = oldSelection || [];
                        selection.push(editNode);
                        this._select(editNode);
                    } else {
                        oldSelection.remove(editNode);
                        this._unselect(editNode);
                    }
                } else {
                    // Let this edit node be the only edit node selected.
                    var wasSelected = (oldSelection != null && oldSelection.contains(editNode));
                    if (wasSelected) {
                        oldSelection.remove(editNode);
                    }
                    this._unselect(oldSelection);
                    this._selectedEditNodes = [editNode];
                    if (!wasSelected) {
                        this._select(editNode);
                    }
                }
                return false;
            }
        }
        return this.Super("click", arguments);
    },

    // Override Canvas.showContextMenu() to change the context menu based on whether there
    // are currently selected edit nodes.  In such case provide menu options for grouping
    // the DrawItem liveObjects into a DrawGroup (and adding a corresponding EditNode), deleting
    // the DrawItems (and removing EditNodes), or simultaneously transforming the DrawItems.
    showContextMenu : function () {
        var selection = this._selectedEditNodes;
        if (this.editingOn && selection != null && selection.length > 0) {
            var x = this.getOffsetX(), y = this.getOffsetY();
            window._x = x;

            var x0 = this._selectorX0,
                y0 = this._selectorY0,
                x1 = this._selectorX1,
                y1 = this._selectorY1,
                left = Math.min(x0, x1),
                right = Math.max(x0, x1),
                top = Math.min(y0, y1),
                bottom = Math.max(y0, y1);

            var menu = this.getMenuConstructor().create({
                autoDraw: false,
                data: [{
                    title: "Group Items",
                    click : function (target) {
                        // TODO
                    }
                }, {
                    title: "Clear Items",
                    click : function (target) {
                        // TODO
                    }
                }, {
                    title: "Rotate Items",
                    click : function (target) {
                        var selection = target._selectedEditNodes;
                        if (selection != null) {
                            for (var i = 0, len = selection.length; i < len; ++i) {
                                var drawItem = selection[i].liveObject;
                                drawItem.rotateBy(90);
                            }
                        }
                    }
                }]
            });
            menu.showContextMenu(this);
            return false;

        } else {
            var menu = this.getMenuConstructor().create({
                autoDraw: false,
                data: [{
                    title: "Clear",
                    click : function (target) {
                        // TODO
                    }
                }]
            });
            return false;
        }

        return true;
    },

    //> @attr editDrawPane.enableSelection (boolean : true: IRW)
    // Whether the draw items can be selected.
    // @visibility external
    //<
    enableSelection: true,

    //> @attr editDrawPane.selectionProperties (DrawItem Properties : null : IR)
    // Properties to apply to the +link{EditNode.liveObject,liveObject}s of the selected edit
    // nodes when they are selected.  The +link{DrawItem.lineColor,lineColor} of the
    // selectionProperties is used as the border color of the selector rectangle.
    // @visibility external
    //<
    selectionProperties: {
        lineColor: "#0000ff",
        fillColor: "#0000ff",
        linePattern: "solid",
        lineWidth: 3,
        lineOpacity: 1,
        fillOpacity: 0.1,
        fillGradient: null,
        shadow: null
    },

    // create selector hoop
    mouseDown : function () {
        var target = isc.EventHandler.getTarget();

        if (!(this.editingOn && this.enableSelection && target == this)) {
            // Selection was not enabled, or the mouse went down over a specific draw item.
            return false;
        }

        if (this._selector == null) {
            this._selector = isc.Canvas.create({
                autoDraw: false,
                keepInParentRect: true,
                left: isc.EventHandler.getX(),
                top: isc.EventHandler.getY(),
                redrawOnResize: false,
                overflow: "hidden",
                border: ("1px solid " + this.selectionProperties.lineColor)
            });
            this.addChild(this._selector);
        }

        this._selectorX0 = this.getOffsetX();
        this._selectorY0 = this.getOffsetY();

        this._resizeSelector();
        this._selector.show();
        this._selectorShowing = true;

        return this.Super("mouseDown", arguments);
    },

    // Override Canvas.dragMove() to resize the selector rectangle.
    dragMove : function() {
        if (this.editingOn && this._selector != null && this._selectorShowing) {
            this._resizeSelector();
        }
        return this.Super("dragMove", arguments);
    },

    // Override Canvas.mouseUp() and dragStop() to hide the selector rectangle.
    mouseUp : function () {
        if (this.editingOn && this._selector != null && this._selectorShowing) {
            this._selector.hide();
            this._selector.moveBelow(this);
            this._selectorShowing = false;
        }
        return this.Super("mouseUp", arguments);
    },

    dragStop : function() {
        if (this.editingOn && this._selector != null && this._selectorShowing) {
            this._selector.hide();
            this._selector.moveBelow(this);
            this._selectorShowing = false;
        }
        return this.Super("dragStop", arguments);
    },

    _select : function (editNodes) {
        if (!editNodes) {
            return;
        } else if (!isc.isAn.Array(editNodes)) {
            isc.EditDrawPane._applyProperties(this.selectionProperties, editNodes.liveObject);
            this._toggleDrawItemKnobs(editNodes.liveObject, true);
        } else {
            for (var i = 0, len = editNodes.length; i < len; ++i) {
                isc.EditDrawPane._applyProperties(this.selectionProperties, editNodes[i].liveObject);
                this._toggleDrawItemKnobs(editNodes[i].liveObject, true);
            }
        }
    },

    _unselect : function (editNodes) {
        if (!editNodes) {
            return;
        } else if (!isc.isAn.Array(editNodes)) {
            isc.EditDrawPane._unapplyProperties(this.selectionProperties, editNodes.liveObject);
            this._toggleDrawItemKnobs(editNodes.liveObject, false);
        } else {
            for (var i = 0, len = editNodes.length; i < len; ++i) {
                isc.EditDrawPane._unapplyProperties(this.selectionProperties, editNodes[i].liveObject);
                this._toggleDrawItemKnobs(editNodes[i].liveObject, false);
            }
        }
    },

    _toggleDrawItemKnobs : function (drawItem, show) {
        // assert drawItem != null

        var knobs = [],
            isRect = isc.isA.DrawRect(drawItem),
            isOval = !isRect && isc.isA.DrawOval(drawItem),
            isLine = !(isRect || isOval) && isc.isA.DrawLine(drawItem),
            isLinePath = !(isRect || isOval || isLine) && isc.isA.DrawLinePath(drawItem),
            isCurve = !(isRect || isOval || isLine || isLinePath) && isc.isA.DrawCurve(drawItem);

        if (isRect || isOval) {
            knobs.push("resize");
        }
        if (isRect || isOval || isLine || isLinePath) {
            knobs.push("move");
        }
        if (isLine || isCurve || isLinePath) {
            knobs.push("startPoint");
            knobs.push("endPoint");
        }
        if (isCurve) {
            knobs.push("controlPoint1");
            knobs.push("controlPoint2");
        }

        if (show) {
            drawItem.showKnobs(knobs);
        } else {
            drawItem.hideKnobs(knobs);
        }
    },

    // Highlight the draw items that intersect the selector rectangle.
    _updateCurrentSelection : function (selectorRight, selectorTop, selectorLeft, selectorBottom) {
        var oldSelection = this._selectedEditNodes;

        // Get a list of all edit nodes of draw items that intersect the selection rectangle.
        var data = this.getEditNodeTree(),
            editNodes = data.getChildren(data.getRoot());

        // Select only those edit nodes whose live objects currently intersect the selector rectangle.
        var selection = [];
        for (var i = 0, len = editNodes.length; i < len; ++i) {
            var editNode = editNodes[i],
                drawItem = editNode.liveObject;
            if (this._intersects(selectorRight, selectorTop, selectorLeft, selectorBottom, drawItem)) {
                selection.push(editNode);

                // Select the editNode if it is not already selected, otherwise remove
                // the editNode from oldSelection so that it is not unselected with
                // other edit nodes.
                var j = (oldSelection == null ? -1 : oldSelection.indexOf(editNode));
                if (j == -1) {
                    this._select(editNode);
                } else {
                    oldSelection.removeAt(j);
                }
            }
        }

        // Unselect the edit nodes that are in the old selection but not in the new selection.
        this._unselect(oldSelection);

        this._selectedEditNodes = selection;
    },

    // Determines whether the drawItem intersects the rectangle spanning the points (left, top) and (right, bottom).
    _intersects : function (right, top, left, bottom, drawItem) {
        var box = drawItem.getBoundingBox(); // minX, minY, maxX, maxY

        // assert left <= right && top <= bottom
        // assert box[0] <= box[2] && box[1] <= box[3]

        var disjointX = (box[2] < left || right < box[0]),
            disjointY = (box[3] < top || bottom < box[1]);
        return (!disjointX && !disjointY);
    },

    // Resize the selector rectangle to the minimum rectangle containing the initial
    // point and the current mouse coordinates.
    _resizeSelector : function () {
        // assert (this._selector != null)

        var x0 = this._selectorX0,
            y0 = this._selectorY0,
            x1 = this._selectorX1 = this.getOffsetX(),
            y1 = this._selectorY1 = this.getOffsetY(),
            left = Math.min(x0, x1),
            right = Math.max(x0, x1),
            top = Math.min(y0, y1),
            bottom = Math.max(y0, y1);

        // assert (right >= left && bottom >= top)

        this._selector.resizeTo(right - left, bottom - top);
        this._selector.setLeft(left);
        this._selector.setTop(top);

        this._updateCurrentSelection(right, top, left, bottom);
    }
});


// Create an EditDrawPane in which to place the components.
isc.EditDrawPane.create({
    ID: "editDrawPane",
    showEdges: true,
    width: "*"
});


// Define a class for all of the tiles in the TilePalette defined below.  Each
// tile has a DrawPane that is used to render a single DrawItem.
isc.defineClass("SimpleDrawItemTile", "SimpleTile").addProperties({
    initWidget : function () {
        this._drawPane = isc.DrawPane.create({
            autoDraw: false,
            width: "100%",
            height: "100%"
        });
        this.children = [this._drawPane];

        this.Super("initWidget", arguments);

        this._record = this.getRecord();
    },

    getInnerHTML : function () {
        return isc.Canvas.getInstanceProperty("getInnerHTML").call(this, arguments);
    },

    _drawRecord : function (record) {
        var tilePalette = this.creator,
            drawItem = tilePalette.makeEditNode(record).liveObject;

        if (!isc.isAn.Instance(drawItem)) {
            drawItem = isc[drawItem._constructor].create(isc.addProperties({}, drawItem, {
                autoDraw: false
            }));
        }

        this._drawPane.addDrawItem(drawItem);
    },

    draw : function () {
        var ret = this.Super("draw", arguments);
        this._drawRecord(this.getRecord());
        return ret;
    },

    redraw : function () {
        var drawPane = this._drawPane,
            record = this.getRecord();

        if (record !== this._record) {
            drawPane.erase();

            this._drawRecord(record);
            this._record = record;
        }

        return this.Super("redraw", arguments);
    }
});


isc.TilePalette.create({
    ID: "tilePalette",
    width: 300,
    tileWidth: 80,
    tileHeight: 80,
    canDragTilesOut: true,

    // Make the editDrawPane the default target when double-clicking
    // on components in this palette.
    defaultEditContext: editDrawPane,

    tileConstructor: "SimpleDrawItemTile",
    fields: [{
        name: "type"
    }, {
        name: "title",
        title: "Component"
    }],

    initWidget : function () {
        // We are supplying the component data inline for this example.
        // However, the TilePalette is a subclass of TileGrid, so you could
        // also use a dataSource.
        this.data = this.getData(this.tileWidth, this.tileHeight, 3);

        // Set default properties on the DrawItems offered in the palette.
        var defaultDrawItemProperties = {
            canDragReposition: true,
            canDragResize: true,
            keepInParentRect: true,
            dragAppearance: "target",
            lineWidth: 2,
            startArrow: null,
            endArrow: null,
            canDrag: true
        };
        for (var i = 0, len = this.data.length; i < len; ++i) {
            var defaults = this.data[i].defaults;
            if (defaults == null) {
                defaults = this.data[i].defaults = {};
            }
            isc.addDefaults(defaults, defaultDrawItemProperties);
        }

        this.Super("initWidget", arguments);
    },

    // Creates PaletteNodes for each of nine different types of DrawItems.  The
    // defaults of the nodes are set so that the shapes will fit in the grid
    // tiles.
    getData : function (tileWidth, tileHeight, topPadding, leftPadding, rightPadding, bottomPadding) {
        if (tileHeight == null) tileHeight = tileWidth;

        if (topPadding == null) topPadding = 2;
        if (leftPadding == null) leftPadding = topPadding;
        if (rightPadding == null) rightPadding = leftPadding;
        if (bottomPadding == null) bottomPadding = topPadding;

        tileWidth -= (leftPadding + rightPadding);
        tileHeight -= (topPadding + bottomPadding);

        var xc = leftPadding + (tileWidth / 2),
            yc = topPadding + (tileHeight / 2),
            width = tileWidth - leftPadding - rightPadding,
            height = tileHeight - topPadding - bottomPadding,
            center = [Math.round(xc), Math.round(yc)],

            // variables for the DrawRect:
            smallAngle = Math.PI / 5,
            rectPoints = this.getPolygonPoints(
                width, height, xc, yc,
                [smallAngle, Math.PI - smallAngle, Math.PI + smallAngle, -smallAngle]),
            rectTop = rectPoints[1][1],
            rectLeft = rectPoints[1][0],
            rectWidth = rectPoints[3][0] - rectLeft,
            rectHeight = rectPoints[3][1] - rectTop;

            // variable for the DrawSector:
            radius = Math.min(width, height);

        return [{
            title: "Curve",
            type: "DrawCurve",
            defaults: isc.addProperties(
                {}, this.scaleAndCenterBezier(width, height, xc, yc, [200, 50], [300, 150], [250, 0], [250, 200]))
        }, {
            title: "Line",
            type: "DrawLine",
            defaults: {
                startPoint: [Math.round(xc - width / 2), Math.round(yc - height / 2)],
                endPoint: [Math.round(xc + width / 2), Math.round(yc + height / 2)]
            }
        }, {
            title: "Line Path",
            type: "DrawLinePath",
            defaults: {
                startPoint: [Math.round(xc - width / 2), Math.round(yc - height / 2)],
                endPoint: [Math.round(xc + width / 2), Math.round(yc + height / 2)]
            }
        }, {
            title: "Oval",
            type: "DrawOval",
            defaults: {
                centerPoint: [Math.round(xc), Math.round(yc)],
                radius: Math.round(Math.min(width, height) / 2)
            }
        }, {
            title: "Path",
            type: "DrawPath",
            defaults: {
                points: this.scaleAndCenter(
                    width, height, xc, yc,
                    [[500, 50], [525, 50], [550, 75], [575, 75],
                     [600, 75], [600, 125], [575, 125], [550, 125],
                     [525, 150], [500, 150]])
            }
        }, {
            title: "Polygon",
            type: "DrawPolygon",
            defaults: {
                points: this.getRegularPolygonPoints(7, width, height, xc, yc, Math.PI / 2)
            }
        }, {
            title: "Rectangle",
            type: "DrawRect",
            defaults: {
                top: rectTop,
                left: rectLeft,
                width: rectWidth,
                height: rectHeight
            }
        }, {
            title: "Sector",
            type: "DrawSector",
            defaults: {
                radius: Math.round(radius),
                startAngle: 0,
                endAngle: 90,
                centerPoint: [Math.round(xc - radius / 2), Math.round(yc - radius / 2)]
            }
        }, {
            title: "Triangle",
            type: "DrawTriangle",
            defaults: {
                points: this.getRegularPolygonPoints(3, width, height, xc, yc, Math.PI / 2)
            }
        }];
    },

    // Computes the top-, left-, bottom-, and right-most coordinates in a list
    // of points, then translates and scales all points to fit the entire shape
    // into the given width and height.
    scaleAndCenter : function (width, height, xc, yc, points) {
        var n = points.length,
            minX = points[0][0],
            maxX = minX,
            minY = points[0][1],
            maxY = minY;

        for (var i = 1; i < n; ++i) {
            var x = points[i][0],
                y = points[i][1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        var x0 = (minX + maxX) / 2,
            y0 = (minY + maxY) / 2,
            scaleX = width / (maxX - minX),
            scaleY = height / (maxY - minY);

        for (var i = 0; i < n; ++i) {
            var point = points[i];
            point[0] = Math.round(xc + scaleX * (point[0] - x0));
            point[1] = Math.round(yc + scaleY * (point[1] - y0));
        }
        return points;
    },

    // Define a cubic polynomial expression used in calculations for Bezier
    // curves.
    bezier : function (x, y, z, w, t) {
        return (((x - 3 * (y - z) - w) * t + 3 * (y - z - z + w)) * t + 3 * (z - w)) * t + w;
    },

    // Computes the minimum and maximum value of the polynomial defined in
    // bezier(), for 0 <= t <= 1.
    bezierExtrema : function (x, y, z, w) {
        var a = (x - 3 * y + 3 * z - w),
            b = (2 * y - 4 * z + 2 * w),
            c = (-w + z),
            discriminant = (b * b - 4 * a * c),
            list = [0, 1];

        if (a == 0) {
            if (b != 0) {
                var root = -c / b;
                root = Math.max(0, Math.min(1, root));
                if (!list.contains(root)) {
                    list.push(root);
                }
            }
        } else if (discriminant >= 0) {
            var sqrtDiscriminant = Math.sqrt(discriminant),
                root1 = (-b + sqrtDiscriminant) / (2 * a),
                root2 = (-b - sqrtDiscriminant) / (2 * a);

            root1 = Math.max(0, Math.min(1, root1));
            root2 = Math.max(0, Math.min(1, root2));
            if (!list.contains(root1)) {
                list.push(root1);
            }
            if (!list.contains(root2)) {
                list.push(root2);
            }
        }

        var min = this.bezier(x, y, z, w, list[0]),
            max = min;

        for (var i = 1; i < list.length; ++i) {
            var value = this.bezier(x, y, z, w, list[i]);
            min = Math.min(min, value);
            max = Math.max(max, value);
        }
        return { min: min, max: max };
    },

    // Computes the bounding box (the array [min. x, min. y, max. x, max. y])
    // of a Bezier curve with endpoints p0 and p3 and control points p1 and p2.
    getBezierBoundingBox : function (p0, p1, p2, p3) {
        var xExtrema = this.bezierExtrema(p0[0], p1[0], p2[0], p3[0]),
            yExtrema = this.bezierExtrema(p0[1], p1[1], p2[1], p3[1]);

        return [xExtrema.min, yExtrema.min, xExtrema.max, yExtrema.max];
    },

    // Like scaleAndCenter() (defined above) but works with Bezier curves rather
    // than arrays of points.
    scaleAndCenterBezier : function (width, height, xc, yc, startPoint, endPoint, controlPoint1, controlPoint2) {
        var box = this.getBezierBoundingBox(startPoint, controlPoint1, controlPoint2, endPoint),
            maxX = box[2],
            minX = box[0],
            maxY = box[3],
            minY = box[1],
            scaleX = width / (maxX - minX),
            scaleY = height / (maxY - minY),
            x0 = (minX + maxX) / 2,
            y0 = (minY + maxY) / 2;
        return {
            startPoint: [
                Math.round(xc + scaleX * (startPoint[0] - x0)),
                Math.round(yc + scaleY * (startPoint[1] - y0))],
            endPoint: [
                Math.round(xc + scaleX * (endPoint[0] - x0)),
                Math.round(yc + scaleY * (endPoint[1] - y0))],
            controlPoint1: [
                Math.round(xc + scaleX * (controlPoint1[0] - x0)),
                Math.round(yc + scaleY * (controlPoint1[1] - y0))],
            controlPoint2: [
                Math.round(xc + scaleX * (controlPoint2[0] - x0)),
                Math.round(yc + scaleY * (controlPoint2[1] - y0))]
        };
    },

    // Calls getPolygonPoints() with angles spread even over the full 360 degrees.
    getRegularPolygonPoints : function (n, width, height, xc, yc, startAngle) {
        var theta = 2 * Math.PI / n,
            angles = new Array(n);
        for (var i = 0; i < n; ++i) {
            angles[i] = startAngle + i * theta;
        }
        return this.getPolygonPoints(width, height, xc, yc, angles);
    },

    // Computes an array of Points for a polygon that has an equal distance
    // from its center to any of its vertices to fit in the given width and
    // height.
    getPolygonPoints : function (width, height, xc, yc, angles) {
        var n = angles.length,
            maxSin = -1, minSin = 1, maxCos = -1, minCos = 1,
            points = new Array(n);

        for (var i = 0; i < n; ++i) {
            var angle = angles[i],
                sin = Math.sin(angle),
                cos = Math.cos(angle);

            points[i] = [cos, sin];

            maxSin = Math.max(maxSin, sin);
            minSin = Math.min(minSin, sin);
            maxCos = Math.max(maxCos, cos);
            minCos = Math.min(minCos, cos);
        }

        var t = Math.min(
                width / (maxCos - minCos),
                height / (maxSin - minSin)),
            xCenter = xc - width / 2 + (width - t * (maxCos - minCos)) / 2 - t * minCos,
            yCenter = yc - height / 2 + (height - t * (maxSin - minSin)) / 2 + t * maxSin;

        for (var i = 0; i < n; ++i) {
            var point = points[i];
            point[0] = Math.round(xCenter + t * point[0]);
            point[1] = Math.round(yCenter - t * point[1]);
        }

        return points;
    }
});


// Layout for the example. The layouts are nested because this
// is used as a basis for other examples, in which some
// user interface elements are added.
isc.VLayout.create({
    ID: "vlayout",
    width: "100%",
    height: "100%",
    membersMargin: 10,
    members: [
        isc.HLayout.create({
            ID: "hlayout",
            membersMargin: 20,
            width: "100%",
            height: "100%",
            members: [
                tilePalette,
                editDrawPane
            ]
        })
    ]
});


// This button will destroy the EditDrawPane and then recreate it from saved state.
isc.Button.create({
    ID: "destroyAndRecreateButton",
    title: "Destroy and Recreate",
    autoFit: true,
    layoutAlign: "right",

    destroyAndRecreateEditDrawPane : function () {
        // We save the editDrawPane node data in a variable
        var state = editDrawPane.getDrawPaneState();

        // Animate the disappearnce of the pane, since otherwise
        // everything happens at once.
        editDrawPane.animateFade(0, function () {
            // Once the animation is finished, remove the editDrawPane
            // and destroy it.
            hlayout.removeMember(editDrawPane);
            editDrawPane.destroy();

            // Then recreate it ...
            editDrawPane = isc.EditDrawPane.create({
                ID: "editDrawPane",
                showEdges: true,
                rotation: state.rotation,
                zoomLevel: state.zoomLevel,
                width: state.width,
                height: state.height
            });
            hlayout.addMember(editDrawPane);

            // Make the new editDrawPane the default Edit Context for the palette,
            // to support double-clicking on components.
            tilePalette.setDefaultEditContext(editDrawPane);

            // And recreate the nodes that we saved earlier
            for (var key in state.linearGradients) {
                editDrawPane.createLinearGradient(key, state[key]);
            }
            for (var key in state.radialGradients) {
                editDrawPane.createRadialGradient(key, state[key]);
            }
            for (var key in state.simpleGradients) {
                editDrawPane.createSimpleGradient(key, state[key]);
            }
            if (isc.isAn.Array(state.drawItems)) {
                state.drawItems.map(function (node) {
                    editDrawPane.addFromPaletteNode(node);
                });
            }
        }, 2000, "smoothEnd");
    },

    click : function () {
        this.destroyAndRecreateEditDrawPane();
    }
});

// This inserts the button into the overall layout for the example.
vlayout.addMember(destroyAndRecreateButton, 0);


// This adds a checkbox to toggle the edit mode of the editDrawPane.
var checkboxForm = isc.DynamicForm.create({
    fields: [{
        name: "isEditMode",
        title: "Edit Mode?",
        type: "checkbox",
        changed : function (form) {
            editDrawPane.setEditMode(form.getValue("isEditMode"));
        },
        defaultValue: !!editDrawPane.editingOn
    }]
});
vlayout.addMember(checkboxForm, 0);

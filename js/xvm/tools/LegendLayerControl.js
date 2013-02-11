/**
 * @author Micho Garcia
 */

OpenLayers.Control.LegendLayerControl = OpenLayers.Class(OpenLayers.Control, {

	/*
	 * Constant: Z_INDEX
	 * {Integer} Defaults z-index
	 */
	Z_INDEX : 2000,

	/**
	 * Property: type
	 * {String} The type of <OpenLayers.Control> -- When added to a
	 *     <Control.Panel>, 'type' is used by the panel to determine how to
	 *     handle our events.
	 */
	type : OpenLayers.Control.TYPE_BUTTON,

	/*
	 * Constant: DEFAULT_PARAMS
	 * {Object} Hash with defaults parameters to GetLegendGraphic
	 * petition key/value pair
	 */
	DEFAULT_PARAMS : {
		service : 'wms',
		version : '1.1.1',
		request : 'getlegendgraphic',
		format : 'image/png'
	},

	/*
	 * Property: visible
	 * {boolean} Indicate if div is visible
	 * Defaults false
	 */
	visible : false,

	/*
	 * Property: params
	 * {Object} Parameters to petition
	 */
	params : {},

	/*
	 * Property: htmlTable
	 * {DOMElement} the table with legend
	 */
	htmlTable : null,

	/*
	 * Property: width
	 * {Float}
	 */
	width : null,

	/*
	 * Property: height
	 * {Float}
	 */
	height : null,

	/*
	 * Property: addLayerName
	 * {boolean}
	 * Indicates if necesary add layer name to legend
	 * Defaults true
	 */
	addLayerName : true,

	/*
	 * Property: requests
	 * {Array(OpenLayers.Request)}
	 * Request queue
	 */
	requests : new Array(),

	/*
	 * Method: setLayer
	 * {OpenLayer.Layer} this.layer setter
	 */
	setLayer : function(alayer) {
		this.layer = alayer;
	},

	/*
	 * Method: initialize
	 *
	 */
	initialize : function(div, params) {
		//console.log('initialize');
		OpenLayers.Control.prototype.initialize.apply(this);
		this.div = OpenLayers.Util.getElement(div);
		if(this.id == null) {
			this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
		}
		OpenLayers.Util.applyDefaults(params, this.DEFAULT_PARAMS);
		this.params = OpenLayers.Util.upperCaseObject(params);
	},

	/*
	 * Method: activate
	 */
	activate : function() {
		//console.log('activate');
		return OpenLayers.Control.prototype.activate.apply(this);
	},

	/*
	 * Method: draw
	 */
	draw : function() {
		//console.log('draw');
		OpenLayers.Control.prototype.draw.apply(this, arguments);
		if(!this.div) {
			this.div = OpenLayers.Util.createDiv(this.id);
		}
		OpenLayers.Element.addClass(this.div, 'olLegendLayer');
		this.div.style.zIndex = this.Z_INDEX;
		this.div.style.position = 'absolute';
		var center = this.map.getPixelFromLonLat(this.map.getCenter());
		this.div.style.top = center.y;
		this.div.style.left = center.x;
		this.map.viewPortDiv.appendChild(this.div);

		return this.div;
	},

	/*
	 * Method: getLegendGraphic
	 * create the url to make getlegendgraphic petition to server
	 */
	getLegendGraphic : function(layer) {

		//console.log('getLegendGraphic');
		if(layer.params != undefined) {
			this.createTableLegend(layer);
			if(layer.params.LAYERS instanceof Array) {
				var layers = layer.params.LAYERS;
			} else {
				var layers = new Array(layer.params.LAYERS);
			}
		}

		for(var n in layers) {
			this.params.LAYER = layers[n];
			var paramStr = OpenLayers.Util.getParameterString(this.params);
			var legendUrl = OpenLayers.Util.urlAppend(layer.url, paramStr);
			//console.log(legendUrl);
			var request = OpenLayers.Request.GET({
				url : layer.url,
				params : this.params,
				scope : {
					layerName : layer.name.replace(" ", "").toLowerCase() + "_table",
					url : legendUrl,
					layer : layers[n],
					obj : this
				},
				callback : this._responseGetLegend
			});
			this.requests.push(request);
		}
	},

	/*
	 * Method: _responseGetLegend
	 * Response from getlegendgraphic server petition
	 */
	_responseGetLegend : function(request) {

		var contentType = request.getResponseHeader('Content-Type');

		var table = document.getElementById(this.layerName);
		
		// TODO necessary because not control destroy event into Panel
		// REFACTOR
		if(table == null) {
			this.obj.abort();
			return;
		}
		//console.log(this.layerName);
		//console.log(table);
		if(contentType == this.obj.params.FORMAT) {
			var lastRow = table.rows.length;
			var row = table.insertRow(lastRow);

			var cellIzquierda = row.insertCell(0);
			cellIzquierda.setAttribute('class', 'olLegendLeftCell');
			var img = document.createElement('img');
			img.setAttribute('src', this.url);
			cellIzquierda.appendChild(img);
			
			if (this.layerName == 'sitga-base_table') {
				var cellDerecha = row.insertCell(1);
				cellDerecha.setAttribute('class', 'olLegendRightCell');
				var layerName = document.createTextNode(this.layer);
				cellDerecha.appendChild(layerName);				
			}
		} else {
			var lastRow = table.rows.length;
			var row = table.insertRow(lastRow);			
			var cellDerecha = row.insertCell(0);
			var layerName = document.createTextNode('Non existe lenda para esta capa');
			cellDerecha.appendChild(layerName);
		}
	},

	/*
	 * Method: createDivLegend
	 * Creates a table into a div with legend
	 *
	 */
	createTableLegend : function(layer) {
		var table = document.createElement('table');
		table.setAttribute('id', layer.name.replace(" ", "").toLowerCase() + "_table");
		OpenLayers.Element.addClass(table, 'olLegendLayersTable');
		this.div.appendChild(table);
		var row = table.insertRow(0);
		row.setAttribute('id', layer.name.replace(" ", "").toLowerCase() + "_row");
		var cellHeader = row.insertCell(0);
		//var layerName = document.createTextNode(layer.name)
		var layerName = document.createTextNode('Lenda');
		cellHeader.appendChild(layerName);
		//console.log(table);
	},

	/*
	 * Method: destroyDivLegend
	 * Destroy the legend div
	 */
	destroyTableLegend : function() {
		if(this.div.hasChildNodes()) {
			while(this.div.childNodes.length >= 1) {
				this.div.removeChild(this.div.firstChild);
			}
		}
		this.visible = false;
	},

	/*
	 *Method: loadLegendLayer
	 * Load into div legend table
	 */
	loadLegendLayer : function(evt) {
		var layers = this.map.getLayersBy('visibility', true);
		this.abort();
		this.destroyTableLegend();
		for(var n in layers) {
			this.getLegendGraphic(layers[n]);
		}
		this.visible = true;
	},

	/*
	 *Method: loadLegendLayer
	 * Load into div legend table
	 */
	changeLegendLayer : function(evt) {
		if(evt.property == 'visibility') {
			this.loadLegendLayer(evt);
		}
	},

	/*
	 * Method: abortAllRequest
	 * Finish all active request
	 */
	abort : function() {
		for(var n in this.requests) {
			this.requests[n].abort();
		}
	},

	/*
	 * Method: trigger
	 * Launch the legend, if control is added in panel
	 */
	trigger : function() {
		//console.log('trigger');
		if(!this.visible) {
			this.map.events.register("changebaselayer", this, this.loadLegendLayer);
			this.map.events.register("changelayer", this, this.changeLegendLayer);
			this.loadLegendLayer(null);
			this.div.style.visibility = 'visible';
		} else {
			this.map.events.unregister("changebaselayer", this, this.loadLegendLayer);
			this.map.events.unregister("changelayer", this, this.changeLegendLayer);
			this.abort();
			this.destroyTableLegend();
			this.div.style.visibility = 'hidden';
		}
	},

	CLASS_NAME : "OpenLayers.Control.LegendLayerControl"
});

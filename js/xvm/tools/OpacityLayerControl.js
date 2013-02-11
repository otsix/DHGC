/*
 * Author: Micho Garcia
 */

OpenLayers.Control.OpacityLayerControl = OpenLayers.Class(OpenLayers.Control, {

	/**
	 * Property: type
	 * {String} The type of <OpenLayers.Control> -- When added to a
	 *     <Control.Panel>, 'type' is used by the panel to determine how to
	 *     handle our events.
	 */
	type : OpenLayers.Control.TYPE_BUTTON,

	/*
	 * Property: opacity
	 * {Number} Layer opacity
	 */
	opacity : 1,

	/*
	 * Property: initialOpacity
	 * {Number} Tha initials opacity layer
	 */
	initialOpacity : null,

	/*
	 * Property: topLayer
	 * {OpenLayers.Layer}
	 */
	topLayer : null,

	/*
	 * Method: initialize
	 * Control constructor
	 */
	initialize : function(div, options) {
		//console.log('initialize');
		OpenLayers.Control.prototype.initialize.apply(this, [options]);
		this.div = OpenLayers.Util.getElement(div);
	},

	/*
	 * Method: activate
	 * Activate control
	 */
	activate : function() {
		//console.log('activate');
		OpenLayers.Control.prototype.activate.apply(this, arguments);
		this.getTopLayerFromMap();
		this.map.events.register('changelayer', this, this._changeLayer);
		this.div.style.visibility = 'visible';
		this.topLayer.setOpacity(this.opacity);
		return true;

	},

	/*
	 * Method: deactivate
	 * Deactivate Control
	 */
	deactivate : function() {
		//console.log('deactivate');
		OpenLayers.Control.prototype.deactivate.apply(this, arguments);
		this.map.events.unregister('changelayer', this, this._changeLayer);
		this.div.style.visibility = 'hidden';
		this.topLayer.setOpacity(1);
		return false;

	},

	/*
	 * Method: setTopLayer
	 * this.topLayer setter
	 *
	 * Parameters:
	 * {OpenLayers.Layer}
	 */
	setTopLayer : function(alayer) {
		this.topLayer = alayer;
	},

	/*
	 * Method: getTopLayer
	 * this.topLayer getter
	 *
	 * Returns: {OpenLayers.Layer}
	 */
	getTopLayer : function() {
		return this.topLayer;
	},

	/*
	 * Method: draw
	 */
	draw : function(px) {
		//console.log('draw');
		OpenLayers.Control.prototype.draw.apply(this);

		this.getTopLayerFromMap();
		// TODO refactor this, set position:absolute outside the control
		// change zIndex
		this.div.style.position = 'absolute';
		this.div.style.zIndex = 2000;
		this.div.style.visibility = 'hidden';
		this.map.viewPortDiv.appendChild(this.div);

		return this.div;
	},

	/*
	 * Method: _getValidLayers
	 * Returns: {Array(OpenLayers.Layer)}
	 */
	getValidLayers : function() {
		var visibleArrayLayers = this.map.getLayersBy('visibility', true);
		var switcherArrayLayers = new Array();
		for(var n in visibleArrayLayers) {
			if(visibleArrayLayers[n].displayInLayerSwitcher != false) {
				switcherArrayLayers.push(visibleArrayLayers[n])
			}
		}
		if(switcherArrayLayers.length > 0) {
			return switcherArrayLayers;
		} else {
			return null;
		}

	},

	/*
	 * Method: getTopLayerFromMap
	 * set into topLayer property layer with biggest
	 * z-index
	 */
	getTopLayerFromMap : function() {
		var arrayLayers = this.getValidLayers();
		if(arrayLayers != null) {
			var orderedArrayLayers = arrayLayers.sort(function(a, b) {
				return (a.div.style.zIndex < b.div.style.zIndex);
			})
			this.topLayer = orderedArrayLayers[0];
			this.initialOpacity = this.topLayer.opacity;
		} else {
			//this.topLayer = null;
		}
	},

	/*
	 * Method: setOpacity
	 * Assigns opacity value to layer
	 * {Float}
	 */
	setOpacity : function(evt, value) {
		this.topLayer.setOpacity(value);
		this.opacity = value;
	},

	/*
	 * Method: _changeBaseLayer
	 * Listener to changebaselayer map event
	 */
	_changeBaseLayer : function(evt) {
	},

	/*
	 * Method: _changeLayer
	 * Listener to change layer
	 */
	_changeLayer : function(evt) {
		if(evt.property == "visibility") {
			this.topLayer.setOpacity(1);
			this.getTopLayerFromMap();
			if(this.topLayer != null) {
				this.topLayer.setOpacity(this.opacity);
			}
		}
	},

	/*
	 * Method: trigger
	 * Launch the slider control
	 */
	trigger : function() {
		if(this.active) {
			this.deactivate();
		} else {
			this.activate();
		}
	},

	CLASS_NAME : "OpenLayers.Control.OpacityLayerControl"
});

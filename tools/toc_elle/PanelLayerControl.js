/**
 * @author Micho Garcia
 */

PanelLayerControl = function(options) {

	/*
	 * Property: layer
	 * {OpenLayer.Layer}
	 */
	this.layer = null;

	/*
	 * Property: div
	 * {DOMElement}
	 * DIV element to create panel
	 */
	this.div = null;

	/*
	 * Property: legendControl
	 * {OpenLayers.Control.LegendLayerControl}
	 */
	this.legendControl = null;

	/*
	 * Method: initialize
	 * Constructor
	 */
	this.initialize = function(options) {
		this.legendControl = new OpenLayers.Control.LegendLayerControl();
	};

	/*
	 * Method: draw
	 * Draw into viewport the panel with controls
	 */
	this.draw = function() {
		var div = document.createElement("div");
		this.div = div;
		div.setAttribute("id", "id_panel_" + this.layer.id);
		$(this.layer.map.viewPortDiv).append(div);
		$(div).dialog({
			resizable : true,
			show : {
				effect : 'drop',
				direction : "left"
			},
			hide : {
				effect : 'drop',
				direction : "left"
			},
			title : this.layer.name,
			height : 200,
			maxHeight : 500,
			minWidth : 275,
			width : 275,
			maxWidth : 275
		});

		$(div).dialog().on('dialogclose', null, this, function(evt) {
			evt.data.destroy(evt);
		})
		
		// add slider control
		var slider = document.createElement("div");
		slider.setAttribute("id", "id_slider_" + this.layer.id);
		$(div).append(slider);

		if(!this.layer.opacity) {
			this.layer.opacity = 1;
		}
		
		$(slider).slider({
			min : 0,
			max : 1,
			step : 0.1,
			value : this.layer.opacity
		});

		$(slider).on("slide", null, this, this.setOpacity);

		//add legend control
		var legend = document.createElement("div");
		var legendid = "id_legend_" + this.layer.id;
		$(legend).attr("id", legendid);
		$(legend).css({
			'margin' : '5px'
		});
		$(div).append(legend);
		this.legendControl.initialize(legendid, {width:15, heigth:15});
		this.legendControl.getLegendGraphic(this.layer);

	};

	/*
	 * Method: destroy
	 */
	this.destroy = function(evt, ui) {
		$(evt.target).dialog("destroy");
		$(evt.target).remove();
		evt.data.div = null;
	};

	/*
	 * Method: setOpacity
	 * {jQuery Event}
	 * Apply opacity to layer
	 */
	this.setOpacity = function(evt, ui) {
		evt.data.layer.setOpacity(ui.value);
	};

	/*
	 * Method: launch
	 * Parameters:
	 * {jQuery.Event}
	 * This method is necessary to responds
	 * panel events
	 */
	this.launch = function(evt) {
		this.layer = evt.data.layer;
		if(this.div == null) {
			this.draw();
		}
	};

	this.initialize(options);
}

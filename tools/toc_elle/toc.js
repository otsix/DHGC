/*
 * @author: IET / MIcho Garcia
 *
 * TOC
 *
 *
 *
 */

TOC = function(map) {

	/*
	 * Property: Map
	 * {OpenLayers.Map}
	 */
	this.map = map;

	/**
	 * Property: dataLayers
	 * {Array(<OpenLayers.Layer>)}
	 */
	this.dataLayers = null;

	/**
	 * Property: baseLayers
	 * {Array(<OpenLayers.Layer>)}
	 */
	this.baseLayers = null;

	/**
	 * Property: urlWMS
	 * {String}
	 * WMS Service URL Base
	 */
	this.urlWMS = null;

	/*
	 * Property: listeners
	 * {Object} Save listeners. This must have a
	 * common structure
	 */
	this.listeners = {};

	/*
	 * Method: register
	 * Parameters:
	 * {Object} Type determinate event type &
	 * listener is the object receive event. Need implements
	 * a trigger function called *launch* receives f.Event and
	 * an property named TOC where TOC it is saved
	 */
	this.register = function(type, listener) {
		this.listeners[type] = listener;
		listener.TOC = this;
	};

	/*
	 * Property: activePanels
	 * {Array(PanelLayerControl)}
	 */
	this.activePanels = {};

	/*
	 * Method: seturlWMS
	 * Parameter:
	 * {String} WMS Service URL
	 * urlWMS setter
	 */
	this.seturlWMS = function(url) {
		this.urlWMS = url;
	}
	/*
	 * Method: initTOC()
	 * Parameters:
	 * {Array(OpenLayers.Layer)}
	 * Initialize TOC
	 */
	this.initTOC = function(base_layers) {
		this.baseLayers = [];
		this.dataLayers = [];

		$(".capas .layer_group1").children().remove();
		$.ajax({
			url : "tools/toc_elle/get-elle-layers.php",
			type : "GET",
			dataType : "json",
			success : this.loadLayers,
			context : this,
			error : function(response) {
				alert("Error na resposta.");
			}
		});

		$(".capas .capa-section1").children().remove();

		this.createNewGroupOnAccordion('Capas Base');
		for(var n in base_layers) {
			var new_layer = base_layers[n];
			this.addLayerOnTOC('Capas Base', new_layer, new_layer.name);
		}
	};

	/*
	 * Method: getLayer
	 * Parameters:
	 * {String} Layer ID
	 * {String} Layer title
	 * Returns:
	 * {OpenLayer.Layer.WMS}
	 * Create a layer WMS object with defaults parameter
	 */
	this.getLayer = function(layerID, layerTitle, visible) {
		return new OpenLayers.Layer.WMS(layerTitle, this.urlWMS, {
			layers : layerID,
			transparent : true,
			format : "image/png"
		}, {
			isBaseLayer : false,
			singleTile : false,
			visibility : visible,
			opacity: 0.75,
			transitionEffect : 'resize',
			buffer : 0
		});
	};

	/*
	 * Method: addLayerOnTOC
	 * Parameters:
	 * {String} group name
	 * {String} layer name
	 * {String} layer title
	 */
	this.addLayerOnTOC = function(group, new_layer, title) {
		var id = $(".capas .capa-section1").children().length;
		this.map.addLayer(new_layer);
		this.map.setLayerIndex(new_layer, 0);
		//TODO 1.- Catch the right accordion
		var baseLayer = new_layer.isBaseLayer;

		if(new_layer.displayInLayerSwitcher) {

			// only check a baselayer if it is *the* baselayer, check data
			//  layers if they are visible
			var checked = (baseLayer) ? (new_layer == this.map.baseLayer) : new_layer.getVisibility();

			// create input element
			var inputElem = document.createElement("input");
			inputElem.id = "input_" + new_layer.name.split(' ').join('').toLowerCase();
			inputElem.name = (baseLayer) ? id + "_baseLayers" : new_layer.name;
			inputElem.type = (baseLayer) ? "radio" : "checkbox";
			inputElem.value = new_layer.name;
			inputElem.checked = checked;
			inputElem.defaultChecked = checked;
			inputElem.style.verticalAlign = (baseLayer) ? "middle" : "middle";
			var title = (checked) ? 'Desactivar capa' : 'Activar capa';
			$(inputElem).attr('title', title)
			
			var context = {
				'inputElem' : inputElem,
				'layer' : new_layer,
				'group' : group,
				'TOC' : this
			};

			$(inputElem).on(
				"change",
				null,
				context,
				this.onInputClick
			);

			// create span
			var labelSpan = document.createElement("span");
			$(labelSpan).attr("class", "labelSpan");
			$(labelSpan).text(new_layer.name);
			$(labelSpan).css({"verticalAlign": "middle", "cursor": "pointer"});
			$(labelSpan).attr("title", group + " - " + new_layer.name);

			// create image
			var image = $('<img>', {
				src : "images/layer-panel.png",
				css : {
					'verticalAlign' : "middle",
					'margin-left': '3px', 
					'margin-right': '3px',
					'margin-bottom': '1px',
					'margin-top': '1px',
					'cursor' : 'pointer'
				}
			});
			$(image).attr("title", "Lenda/Transparencia");

			var panel = new PanelLayerControl(null);
			panel.initialize(null);
			$(image).on("click", null, context, function(evt) {
				panel.launch(evt);
			});

			// create li
			var line = $('<li>');

			$(line).append(inputElem);
			$(line).append(image);
			$(line).append(labelSpan);
			

			$(".capas .layer_group" + id).append(line);

			if(this.listeners.selection != undefined) {
				if(inputElem.checked) {
					var evt = this.createEvtLayer(group, new_layer);
					this.listeners.selection.launch(evt);
				}
			}

			var groupArray = (baseLayer) ? this.baseLayers : this.dataLayers;

			groupArray.push({
				'layer' : new_layer,
				'inputElem' : inputElem,
				'labelSpan' : labelSpan
			});
		}
	};

	/*
	 * Method: isPanelActive
	 * Parameters:
	 * {String} An id layer
	 * Returns:
	 * {boolean}
	 */
	this.isPanelActive = function(id_layer) {
		return this.activePanels[id_layer]
	};

	/*
	 * Method: panelActive
	 * Parameters:
	 * {String} An id layer
	 * {boolean} sets active value for layer
	 */
	this.panelActive = function(id_layer, active) {
		this.activePanels[id_layer] = active;
	}
	/**
	 * Method:
	 * A label has been clicked, check or uncheck its corresponding input
	 *
	 * Parameters:
	 * e - {Event}
	 *
	 * Context:
	 *  - {DOMElement} inputElem
	 *  - {<OpenLayers.Control.LayerSwitcher>} layerSwitcher
	 *  - {<OpenLayers.Layer>} layer
	 */

	this.onInputClick = function(e) {
		//if(!e.data.inputElem.disabled) {
		if(e.data.inputElem.type == "radio") {
			//e.data.inputElem.checked = true;
			e.data.layer.map.setBaseLayer(e.data.layer);
		} else {
			//e.data.inputElem.checked = !e.data.inputElem.checked;
			e.data.TOC.updateMap();
		}
		// Add to selection layer tab
		if(e.data.TOC.listeners.selection != undefined) {
			e.data.TOC.listeners.selection.launch(e);
		}
		$(e.data.inputElem).parent().parent().find(':radio').each(function() {
			$(this).attr('title', 'Activar capa');
		});
		var title = (e.data.inputElem.checked) ? 'Desactivar capa' : 'Activar capa';
		$(e.data.inputElem).attr('title', title)
	};

	/**
	 * Method: createEvtLayer
	 * Parameters:
	 * {OpenLayers.Layer}
	 * Creates an object with similar structure that jQuery
	 * event to send listeners. Requires a *data* property
	 * Returns:
	 * {Object} with properties
	 * 		'group' : {String}
	 * 		'layer' : {OpenLayers.Layer},
	 * 		'TOC' : {TOC}
	 */
	this.createEvtLayer = function(group, layer) {
		var evt = new Object();
		evt.data = {
			'group' : group,
			'layer' : layer,
			'TOC' : this
		};

		return evt;
	};

	/**
	 * Method: updateMap
	 * Cycles through the loaded data and base layer input arrays and makes
	 *     the necessary calls to the Map object such that that the map's
	 *     visual state corresponds to what the user has selected in
	 *     the control.
	 */
	this.updateMap = function() {
		// set the newly selected base layer
		for(var i = 0, len = this.baseLayers.length; i < len; i++) {
			var layerEntry = this.baseLayers[i];
			if(layerEntry.inputElem.checked) {
				this.map.setBaseLayer(layerEntry.layer, false);
			}
		}

		// set the correct visibilities for the overlays
		for(var i = 0, len = this.dataLayers.length; i < len; i++) {
			var layerEntry = this.dataLayers[i];
			layerEntry.layer.setVisibility(layerEntry.inputElem.checked);
		}
	};

	/*
	 * Method: createNewGroupOnAccordion
	 * Parameters:
	 * {String}
	 * Creates a new group on the "Capas" accordion
	 */
	this.createNewGroupOnAccordion = function(group_name) {
		// TODO Refactor this method
		var tocElementsNum = $(".capas .capa-section1").children().length + 1;
		//Collapse_num is for the very clean Celso code on the BoxContainer... ;-)
		var collapse_num = (tocElementsNum == 1) ? 32 : 13;
		var is_desplegable = (tocElementsNum == 1) ? 'accordion_expanded' : 'expandable';
		//despeg_num is for the very clean Celso code on the BoxContainer... ;-)
		var despleg_num = (tocElementsNum == 1) ? 2 : '';
		
		var html_code_new_group = '<li> ' + '<a href="#" class="' + is_desplegable + '" title="' + group_name + '">' + 
		'       <div class="form-collapse-table" id="collapse_' + collapse_num + '">' + 
		'            <span class="form-collapse-mid" id="collapse-text_' + collapse_num + '">' + group_name + '</span>' + 
		'        </div></a>' + '<ul class="form-section' + despleg_num + ' layer_group' + tocElementsNum + 
		'" style="margin-left: 10px;">' + '</ul></li>';

		$(".capas .capa-section1").append(html_code_new_group);
	};

	/*
	 * Method: loadLayers
	 * Parameters:
	 * {Object JSON}
	 * Receives response from layers service with JSON
	 * structure
	 */
	this.loadLayers = function(elle_toc) {

		var lyrs_num = elle_toc.length;
		var group_name = '';
		for(var i = lyrs_num - 1; i >= 0; i--) {
			var create_new_group = false;
			if(group_name == '' || elle_toc[i].grupo != group_name) {
				group_name = elle_toc[i].grupo;
				create_new_group = true;
			}
			if(!elle_toc[i].grupo) {
				//if no group, then default
				group_name = 'default';
				create_new_group = true;
			}
			if(create_new_group) {
				this.createNewGroupOnAccordion(group_name);
			}
			var layer = elle_toc[i].nombre_tabla;
			var title = elle_toc[i].nombre_capa;
			var isVisible = (elle_toc[i].visible == "f") ? false : true;
			var new_layer = this.getLayer(layer, title, isVisible);
			new_layer.group = group_name;
			this.addLayerOnTOC(elle_toc[i].grupo, new_layer, title);
		}
		expand_collapse_accordions();

		this.raiseBaseLayers();
	};

	/*
	 * Method: raiseBaseLayers
	 * Parameters:
	 * Put all base layers at the bottom of the map.layers list and base layer accordion group also.
	 *
	 */
	this.raiseBaseLayers = function() {
		for(var i in map.layers) {
			var lyr = map.layers[i];
			if(lyr.isBaseLayer) {
				map.raiseLayer(lyr);
			}
		};
		var baseGroup = $(".capas .capa-section1").children().first();
		$(".capas .capa-section1").append(baseGroup);
		//$(".capas .capa-section1").children().first().remove();
	};
}
/*
 * @author: IET / Micho Garcia
 *
 * Auxiliar class to send layers to selection tab.
 * To use register like listener into TOC using TOC.register() method.
 * If necessary to implemment launch method receives a jQuery event
 */
Selection = function() {

	/*
	 * Property: TOC
	 * {TOC}
	 * TOC asocciates to Selection
	 */
	this.TOC = null;

	/*
	 * Property: baseLayer
	 * {OpenLayers.Layer}
	 * Saves baseLayer
	 */
	this.baseLayer = null;
	
	/*
	 * Property: layers
	 * {Array(OpenLayers.Layer)}
	 */
	this.layers = {};
	
	/**
	 * Property: activelayers
	 * {Array(OpenLayers.Layer)}
	 */
	this.activeLayers = [];

	/*
	 * Method: launch
	 * Parameters:
	 * {jQuery event} Receives a jQuery event. Create a new line
	 * into selection panel
	 */
	this.launch = function(evt) {

		var layerName = evt.data.layer.id.replaceAll('.','_');
		var layerLine = $('#' + layerName);

		if(evt.data.layer.isBaseLayer == true) {
			if(this.baseLayer != null) {
				$(".capas_visibles .capas_visibles-section1 #base_layer").remove();
			}
			this.baseLayer = evt.data.layer;
		}

		if(layerLine.length == 0) {
			var context = {
				'obj' : this,
				'layer' : evt.data.layer,
				'TOC' : evt.data.TOC
			};

			// create check queryable
			var query = $('<input>', {
				css : {
					'verticalAlign' : "middle",
					'cursor' : 'pointer'					
				}
			});
			query.attr('type', 'checkbox');
			query.attr("title", "Activar capa para consulta");
			context.query = query;
			$(query).on(
				"change", 
				null, 
				context, 
				this.addLayerQueryable
			);

			// create logo of information
			var info_logo = $('<img>', {
				css : {
					'verticalAlign' : "middle",
					'cursor' : 'pointer',
					'width' : '16px',
					'height' : '16px'
				}
			});
			$(info_logo).attr('src', "images/info.jpg");
			$(info_logo).on("click", null, context, function(evt) {
				line = $(this.parentNode);
				query = line.children('input');
				query.attr('checked', !query.attr('checked'));
				var title = (query.is(':checked')) ? 'Desactivar capa para consulta' : 'Activar capa para consulta';
				$(this).attr('title', title);
				query.attr('title', title);
				evt.data.obj.addLayerQueryable(evt);
			});
			$(info_logo).attr("title", "Activar consulta en capa");

			// create cross
			var cross = $('<img>', {
				css : {
					'verticalAlign' : "middle",
					'cursor' : 'pointer',
					'width' : '16px',
					'height' : '16px'
				}
			});

			if(evt.data.layer.isBaseLayer) {
				$(cross).attr('src', "images/layer-switcher-maximize.png");
				$(cross).attr('title', 'Capa base');
			} else {
				$(cross).attr('src', "images/cleanlayer.png");
				$(cross).attr('title', 'Eliminar capa');

				$(cross).on("click", null, context, function(evt) {
					evt.data.obj.onClickCross(evt.data.layer);
				});
			}

			var labelSpan = $("<span>");
			$(labelSpan).attr("class", "labelSpan");
			$(labelSpan).text(evt.data.layer.name);
			$(labelSpan).css({"verticalAlign" : "middle", "cursor": "pointer"});
			$(labelSpan).attr("title", evt.data.group + " - " + evt.data.layer.name);

			// create image
			var image = $('<img>', {
				src : "images/layer-panel.png",
				css : {
					'verticalAlign' : "middle",
					'margin-left': '3px', 
					'margin-right': '3px',
					'margin-bottom': '1px',
					'margin-top': '1px',
					'cursor' : 'pointer'
				}
			});
			$(image).attr("title", "Lenda/Transparencia");

			var panel = new PanelLayerControl(null);
			$(image).on("click", null, context, function(evt) {
				panel.launch(evt);
			});

			// create li
			var line = $('<li>');//.attr('tag', evt.data.layer.getZIndex());
			if(evt.data.layer.isBaseLayer) {
				line.attr('id', 'base_layer');
			} else {
				line.attr('id', layerName);
			}

			if(!evt.data.layer.isBaseLayer) {
				$(line).append(info_logo);
				$(line).append(query);
				
				var nlayers = $('#capas_visibles').text().extractInteger() + 1;
				$('#capas_visibles').text('Visibles (' + nlayers.toString() +')');
			}

			$(line).append(cross);
			$(line).append(image);
			$(line).append(labelSpan);			

			$(".capas_visibles  .capas_visibles-section1").append(line);
		} else {
			var nlayers = $('#capas_visibles').text().extractInteger() - 1;
			$('#capas_visibles').text('Visibles (' + nlayers.toString() +')');
			$(".capas_visibles .capas_visibles-section1" + " " + '#' + layerName).remove();
		}
	};
	
	/**
	 * Method: addLayerQueryable
	 * Parameters: 
	 * {jQuery.Event}
	 */
	this.addLayerQueryable = function(evt) {
		var title = "";
		if($(evt.data.query).is(':checked')) {
			evt.data.obj.activeLayers.push(evt.data.layer);
			title = "Desactivar consulta en capa";
		} else {
			var index = null;
			var j = 0;
			while (index == null) {
				if (evt.data.obj.activeLayers[j].id == evt.data.layer.id) 
				{
					index = j;
					evt.data.obj.activeLayers.splice(j,1);
				}
				j++;
			}
			title = "Activar consulta en capa";
		};
		$(this).attr('title', title);
		$(':first-child', $(this).parent()).attr('title', title);
		var selectControl = evt.data.TOC.map.getControlsByClass('OpenLayers.Control.WMSGetFeatureInfo')[0];
		selectControl.layers = (evt.data.obj.activeLayers.length === 0) ? null : evt.data.obj.activeLayers;
	}

	/**
	 * Method: onClickCross
	 * Parameters:
	 * {OpenLayers.Layer}
	 */
	this.onClickCross = function(layer) {
		if(layer.isBaseLayer) {
			// if is baselayer do not remove
		} else {
			for(var n in this.TOC.dataLayers) {
				var layerEntry = this.TOC.dataLayers[n];
				if(layerEntry.layer == layer) {
					layerEntry.inputElem.checked = false;
				}
			}
		}
		var layerName = layer.id.replaceAll('.','_');
		$(".capas_visibles .capas_visibles-section1" + " " + '#' + layerName).remove()
		var nlayers = $('#capas_visibles').text().extractInteger() - 1;
		$('#capas_visibles').text('Visibles (' + nlayers.toString() +')');
		this.TOC.updateMap();
	};
	
	/*
	 * Method: updateSelect
	 * Order layers into select control
	 */
}

/*
 * Util: this function implements replaceAll method
 * into String object using prototype.
 * Necessary to use layers ID
 */
String.prototype.replaceAll = function(str1, str2, ignore)
{
   return this.replace(new RegExp(str1.replace(/([\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, function(c){return "\\" + c;}), "g"+(ignore?"i":"")), str2);
};

/**
 * Util: extract integer from string if its around () 
 */
String.prototype.extractInteger = function() {
	var first = this.indexOf('(');
	var last = this.indexOf(')');
	return parseInt(this.substring(first + 1, last));
}

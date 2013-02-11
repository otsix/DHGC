/**
 * XVM: Xeovisor Minimo 
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License: 
 *   LICENSE.txt file available at the root application directory
 *
 * https://forxa.mancomun.org/projects/xeoportal
 * http://xeovisorminimo.forxa.mancomun.org
 *
 */

OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url="; //each urlwms must be included in this file to allow getFeatureInfo   


FeatureInfo = function() {
	
	/**
	 * Property
	 * {String}
	 */
	this.urlWMS = null
	
	/**
	 * Property
	 * {OpenLayers.Control.WMSGetFeatureInfo}
	 */
	this.featureInfo = null
	
	/**
	 * Property
	 * {Array(OpenLayers.Layer.WMS)}
	 */
	this.layers = null;
	
	/**
	 * Method
	 * Parameters
	 * {Array(OpenLayers.Layer.WMS)}
	 */
	this.setLayers = function(layers) {
		this.layers = layers;
		if (this.featureInfo) {
			this.featureInfo.layers = layers;
		}
	}
	
	/*	
	 * 
	 */
	this.formatInfo = function(features) {
	    var html = '<table class="feat_info">';
	    if (features && features.length) {
			for (var i = 0, len = features.length; i < len; i++) {
			    var feature = features[i];
			    var attributes = feature.attributes;
			    if (feature.layer == null){
					feature.layer = new OpenLayers.Layer.WMS()
					feature.layer.name = feature.type;
				if (!feature.layer.name){
				    feature.layer.name = '';
				}
				if (feature.gml && feature.gml.featureType){
				    feature.layer.name = feature.gml.featureType;
				}
			    }
			    html += '<tr><th colspan="2" class="feat_header">' +
				$.i18n.prop("layer")+': ' + feature.layer.name + "</th><th></th><tr>";
			    for (var k in attributes) {
					html += '<tr><th class="attr_col">' + k.replace(/_/gi, ' ') + '</th>'+
				    '<td class="value_col">' + attributes[k] + '</td></tr>';
			    }
			}
	    }
	    return html += '</table>';
	}
	
	this.formatGeomediaInfo = function(response){
	    var xmlFormat = new OpenLayers.Format.XML();
	    var doc = xmlFormat.read(response);
	    var nodesLayer = xmlFormat.getElementsByTagNameNS(doc, "*", "Layer");
	    var features = new Array();
	    var pieces = [];
	
	    if (nodesLayer.length == 0){
			contents = $.i18n.prop("features_not_found");
			return contents;
	    };
	
	    for(var i=0; i<nodesLayer.length; ++i) {
			var n = nodesLayer[i];
			var lyrName = n.attributes[0].value;
			pieces.push(lyrName);
			var nodesAttr = xmlFormat.getElementsByTagNameNS(n, "*", "Attribute");
			var layer = new OpenLayers.Layer.Vector(lyrName);
			layer.name= lyrName;
			var data = new Array();
			for(var j=0; j<nodesAttr.length; ++j) {
			    nAtt = nodesAttr[j];
			    pieces.push(xmlFormat.write(nAtt));
			    data[nAtt.attributes[0].value]=nAtt.textContent;
			}
			var feature = new OpenLayers.Feature.Vector(layer,data, null);
			//	feature.attributes = data;
			feature.layer = layer;
			features.push(feature);
	    }
	    return formatInfo(features);
	}
	
	this.getError = function (text){
	    var html = $.i18n.prop("no_features_found");
	    if (text.toUpperCase().indexOf("ERROR")!=-1 || text.toUpperCase().indexOf("EXCEPTION")!=-1){
			html = $.i18n.prop("error_on_getFeatureInfo");
	    } 
	    return html;
	}
	
	this.getFeatureInfo = function(urlWMS){
	    getFeatureInfo(urlWMS, 'application/vnd.ogc.gml');
	}
	
	/**
	 * Method
	 * Parameters:
	 * {OpenLayers.Event}
	 */
	this.showsFeatureInfo = function(evt) {
		    var contents = "";

		    if (this.featureInfo.infoFormat == 'application/vnd.ogc.gml') {
				var features = this.featureInfo.format.read(evt.text);
				if (features && features.length > 0){
				    contents = this.formatInfo(features);
				} else {
				    contents = $.i18n.prop("features_not_found");
				}
		    } else if (this.featureInfo.infoFormat == 'text/xml') {
				contents = formatGeomediaInfo(e.text);
		    } else {
				contents = evt.text;
		    };

		    map.addPopup(new OpenLayers.Popup.FramedCloud(
				"chicken", 
				map.getLonLatFromPixel(evt.xy),
				null,
				contents,
				null,
				true
		    ));		
	}
		
	/**
	 * urlWMS: url to send the request
	 * format: 'application/vnd.ogc.gml' or 'text/html' or 'text/xml'
	 */
	this.getFeatureInfo = function(urlWMS, infoformat){
	
		this.urlWMS = urlWMS;
		
	    this.featureInfo = new OpenLayers.Control.WMSGetFeatureInfo({
			infoFormat: infoformat,
			url: urlWMS, 
			queryVisible: true, // just query visible layers
			title: $.i18n.prop("featureinfo_tooltip"),
			layers: this.layers
	    });
	    
	    this.featureInfo.events.register(
	    	'getfeatureinfo',
	    	this,
	    	this.showsFeatureInfo	
	    )
	    
	    return this.featureInfo;
	}
}
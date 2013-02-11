// This is the javascript section of generated xeovisor minimo called with GET parameters.
var map, info;
function init(){

    function loadTranslation(lang){
		$.i18n.properties({
		    name:'text',
	    	path:'config/',
	    	mode:'map',
	    	language:lang
		});
    }
    loadTranslation("gl");
    
    //create the map
    var bounds_epsg25829 = new OpenLayers.Bounds(460000,4600000,690000,4870000);
	//var bounds_epsg25829 = new OpenLayers.Bounds(460000,4625000,690000,4856000);
    var epsg = "EPSG:25829";

	var mousePositionControl = new OpenLayers.Control.MousePosition(
		{
			numDigits:0
		});
	
    var options = {
		projection: new OpenLayers.Projection(epsg),
		displayProjection: new OpenLayers.Projection(epsg),
		units: "m",
		resolutions: [449.21875,224.609375,112.3046875,56.15234375,28.076171875,14.0380859375,7.01904296875,3.509521484375,1.7547607421875,0.87738037109375,0.438690185546875,0.219345092773437],
		maxResolution: 300,
		minResolution: 0.2,
		tileSize: new OpenLayers.Size(512,512),
		maxExtent: bounds_epsg25829,
		controls: [
		    new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}}),
		    mousePositionControl
		]
    };
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
    map = new OpenLayers.Map('map', options);
    map.Z_INDEX_BASE.Popup = 800;
    mousePositionControl.prefix = map.displayProjection.projCode + " ";
    /*var layers = getLayers();
    map.addLayers(layers);
    //Set next layer after "empty layer"
    map.setBaseLayer(layers[1]);*/   
   	
	var toc = new TOC(map);
	toc.seturlWMS(urlWMS);
	toc.register("selection", new Selection());
	toc.initTOC(getLayers());
    
	//TODO Define properly on the "resources.js" file
    //var urlWMS = "http://six.agri.local/arcgis/services/Biodiversidade/Mapserver/WMSServer";
	//var info_format = "application/vnd.ogc.gml";//Para UMN Mapserver
	var controlFeatureInfo = new FeatureInfo();
    var featureInfo = controlFeatureInfo.getFeatureInfo(urlWMS, info_format);
    //Zoom to a specific area by GET
    
    	
    map.zoomToExtent(bounds_epsg25829, true);
    
	var navHistory = new OpenLayers.Control.NavigationHistory();
	navHistory.previous.title = $.i18n.prop("zoom_previous");
	navHistory.next.title = $.i18n.prop("zoom_next");
 	map.addControl(navHistory);
 	
	////help button
 	var helpBtn = new OpenLayers.Control.Button({
		displayClass: "olControlHelpBtn",
		trigger: launchHelpDialog,
		title:$.i18n.prop("help")
	});
 	//// end help button
 	
    ////permalink button
    //var permalinkBtn = new OpenLayers.Control.Button({
    //    anchor:false,
    //    displayClass: "olControlPermalinkBtn",
    //    trigger: launchPermalinkDialog,
    //    title:$.i18n.prop("permalink_tooltip")
    //});
    //// end permalink button   
	
 	var resetVectorBtn = new OpenLayers.Control.Button({
		displayClass: "olControlResetVectorBtn",
		trigger: resetVector,
		title:$.i18n.prop("clean_search_vectors_tooltip")
	});

    // allow testing of specific renderers via "?renderer=Canvas", et
    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

	function handleMeasurements(event) {
        var geometry = event.geometry;
        var units = event.units;
        var order = event.order;
        var measure = event.measure;
        if (order==1){
			alert("Distancia : " + (measure.toFixed(3)+ " " + units));
        }else{
            alert("Area : " + (measure.toFixed(1)+ " " + units + "2"));
        }
    }

	var measure_line =  new OpenLayers.Control.Measure(
		OpenLayers.Handler.Path, {
			displayClass: "olControlMeasureLine",
			persist: true,
            handlerOptions: {
				layerOptions: {
					renderers: renderer
				}
			}
		}
	);
	measure_line.events.on({
		"measure": handleMeasurements
    });
	measure_line.title = $.i18n.prop("measured_line");

    var measure_area =  new OpenLayers.Control.Measure(
		OpenLayers.Handler.Polygon, {
			displayClass: "olControlMeasureArea",
            persist: true,
            handlerOptions: {
				layerOptions: {
					renderers: renderer
				}
			}
		}
	);
	measure_area.events.on({
		"measure": handleMeasurements
	});
    measure_area.title = $.i18n.prop("measured_area");
//INICIO Boton descarga
	download = new OpenLayers.Control.Button({ 
	    displayClass:"olControlDownload", 
	    trigger: downloadClick 
	});

	download.title = $.i18n.prop("download");

//FIN Boton descarga
    var panel = new OpenLayers.Control.Panel();
    panel.addControls([
    featureInfo,
    download,
    new OpenLayers.Control.MouseDefaults({title:$.i18n.prop("pan_tooltip")}),
	new OpenLayers.Control.ZoomIn({title:$.i18n.prop("zoomin_tooltip")}),
	new OpenLayers.Control.ZoomOut({title:$.i18n.prop("zoomout_tooltip")}),	
	new OpenLayers.Control.ZoomBox({title:$.i18n.prop("zoombox_tooltip")}),
	navHistory.next,
	navHistory.previous,
	new OpenLayers.Control.ZoomToMaxExtent({title:$.i18n.prop("zoomtomaxextent_tooltip")}),
	//new OpenLayers.Control.OpacityLayerControl('opacitydiv'),
	//new OpenLayers.Control.LegendLayerControl('legend',{width: 10, height: 10}),
	measure_line,
	measure_area,
	resetVectorBtn,
	//permalinkBtn,
	helpBtn
    ]);
    map.addControl(panel);
    
    //map.addControl(new OpenLayers.Control.Permalink({anchor:false}));
 
    featureInfo.activate();
    
    //[NachoV] NOTE: Layer must be initialized with Map params to be shown properly. 
	var overviewLyr = map.layers[7].clone();
	var controlOptions = {
		minRatio: 2000,
		autoPan: false,
        maximized: true, //,layers: [catastroLayer] //devuelve error catastroLayer not defined
        layers: [overviewLyr]
    }
    map.addControl(new OpenLayers.Control.OverviewMap(controlOptions));


	
    // FullScreen mode on the onclick event of coords_div of OL (not supported on some IE versions, because not compliant with standards)
    if (document.getElementsByClassName){
       var obj = document.getElementsByClassName('olControlMousePosition').item(0);
       obj.setAttribute('onclick', 'changeToFullScreen()');
       obj.onmousedown = changeToFullScreen;
    }
    
} //fin init()


var oTable;
function initDownloadButton() {
	$('#lista_descargas tbody td').hover(function() {
		var iCol = $('td').index(this) % 4;
		var nTrs = oTable.fnGetNodes();
		$('td:nth-child(' + (iCol + 1) + ')', nTrs).addClass('highlighted');
	}, function() {
		var nTrs = oTable.fnGetNodes();
		$('td.highlighted', nTrs).removeClass('highlighted');
	});
	oTable = $('#lista_descargas').dataTable({
		"bSortClasses" : false
	});

	$('#lista_descargas').dataTable({
		"bPaginate" : false,
		"bLengthChange" : false,
		"bFilter" : true,
		"bSort" : false,
		"bInfo" : false,
		"bAutoWidth" : false
	});
};



/**
 * Function that clean all search geometries on the map
 */
function resetVector(){
	search_vector.removeAllFeatures();
}

function isRightClick(e) {

	var rightclick = false;
	if(!e)
		var e = window.event;
	if(e.which)
		rightclick = (e.which == 3);
	else if(e.button)
		rightclick = (e.button == 2);

	return rightclick;

}

function changeToFullScreen(e) {

	var obj = document.getElementById('slider');
	obj.style.float = "right";
	obj.style.width = "200px";

	if(isRightClick(e)) {
		$('#slider').slider({
			orientation : 'horizontal',
			min : 0,
			max : 100,
			step : 10,
			value : 100,
			slide : function(event, ui) {
				var lyrs = map.getLayersBy('visibility', true);
				if(lyrs.length) {
					var lyr = lyrs[lyrs.length - 1];
					lyr.setOpacity(ui.value / 100.0);
				}
				//$("#amount").val( "$" + ui.value);
			}
		});
		return;
	}
	var obj = document.getElementsByTagName('html').item(0);
	obj.style.margin = "0px";
	obj.style.width = "100%";
	obj.style.height = "100%";

	var obj = document.getElementsByTagName('body').item(0);
	obj.style.margin = "0px";
	obj.style.width = "100%";
	obj.style.height = "100%";

	var obj = document.getElementById('map');
	obj.style.margin = "0px";
	obj.style.width = "100%";
	obj.style.height = "100%";

	map.updateSize();
}

//Function to OL.map from others apps
function getXeovisorMinMap(){
    if (map == undefined){
		init();
    }
    return map;
}


/**
 * Vector Layer where show the geometry result of search operations.
 */
var search_vector = '';
var map = '';
var opacityControl;

function xvm_init() {
	init();
	//Cambiar css del panel de controles del XVM y color de fondo del control de capas
		// openlayers popup "chicken"
	$(".olControlLayerSwitcher .layersDiv").css("background-color", "black");
	$(".olControlPanel").css({
		"padding" : "2px",
		"border" : "1px solid gray",
		"top" : "30px",
		"left" : "0px",
		"background-color" : "white",
		"-moz-border-radius" : "5px 5px 5px 5px",
		"-webkit-border-bottom-right-radius" : "5px",
		"-webkit-border-top-right-radius" : "5px",
		"-khtml-border-bottom-right-radius" : "5px",
		"-khtml-border-top-right-radius" : "5px",
		"opacity" : "0.9",
		"filter" : "filter:alpha(opacity=90);"
	});
	
	$(".olControlPanel div").css("float", "left");

	$("div.olControlMousePosition").css({
		"bottom" : "110px",
		"color" : "black",
		"width" : "100px"
	});
	$(".olControlOverviewMapContainer").css("bottom", "107px");

	$(".olControlOverviewMapElement").css({
		"background" : "#7DB1D3",
		"border" : "1px solid #666",
		"opacity" : "0.8",
		"filter" : "filter:alpha(opacity=80)",
		"-moz-border-radius" : "5px 5px 5px 5px",
		"-webkit-border-bottom-left-radius" : "5px",
		"-webkit-border-top-left-radius" : "5px",
		"-khtml-border-bottom-left-radius" : "5px",
		"-khtml-border-top-left-radius" : "5px"
	});

	$(".olControlOverviewMapMinimizeButton").css({
		"background" : "#000000",
		"opacity" : "0.5",
		"filter" : "filter:alpha(opacity=50)"
	});

	
	search_vector = new OpenLayers.Layer.Vector("search_result",{
			style: {
				strokeColor: "red",
				strokeWidth: 3, 
				fillColor: "red", 
				fillOpacity: 0.2,
				pointRadius: 10
			}
		});	
	search_vector.displayInLayerSwitcher = false;
	
	initSplash("presentacion");
	initSearchDialog();
//	initSearchMapSheetsDialog();
    initSearchSystemDialog();
	initSearchCatastroDialog();

	// mapping folder stock
	var MAPS_FOLDER;
	$.ajax({
		url : 'php/get_files_path.php',
		dataType : 'text',
		success : function(data) {
			MAPS_FOLDER = data;
		}
	});
	// Open layerSwitcher by default
	//var lysw = map.getControlsByClass('OpenLayers.Control.LayerSwitcher')[0];
	//lysw.maximizeControl();

	//Change callback function of the infoTool // descargas.js
	featureInfo = map.getControlsBy('displayClass', 'olControlWMSGetFeatureInfo')[0];
	//anular el click en WMSfeatureInfoTool
	
	opacityControl = map.getControlsBy('CLASS_NAME', 'OpenLayers.Control.OpacityLayerControl')[0];
	
	
	//console.log(opacityControl);

	map.addLayer(search_vector);

	$("#downloadDialog").dialog({
		title : "Descarga de series cartográficas",
		height : 240,
		width : 350,
		modal : true,
		autoOpen : false,
		closeOnEscape : true,
		resizable : false,
		buttons : {
			Cerrar : function() {
				$(this).dialog('close');
			}
		}
	});
}
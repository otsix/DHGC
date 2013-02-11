/**
 * @author Micho Garcia
 * To use this jQuery code if necessary create an global
 * variable with teh OpenLayers.OpacityLayerControl
 */

/*
 * Code to opacity control
*/
$(function() {
	$("#sliderdiv").slider({
		min : 0,
		max : 1,
		step : 0.1,
		value: 1,
		slide : setOpacity
	});
});
$(function() {
	$("#opacitydiv").draggable();
}); 

function setOpacity(evt, ui) {
	//opacityControl must be an global variable
	opacityControl.setOpacity(evt, ui.value);
}

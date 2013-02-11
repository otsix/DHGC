function coordinatesDrawPoint(x, y){
    geojson = { 
        "type":"Point", 
        "coordinates":[x, y]
    };
    search_vector.removeAllFeatures();
    if(geojson) {
        var geojson_format = new OpenLayers.Format.GeoJSON();
        var feat = geojson_format.read(geojson);
        search_vector.addFeatures(feat);
    } else {
        //alert("Non respondiu nada");
    }
}
function IsNumeric(strString) //  check for valid numeric strings	
{
	if(!/\D/.test(strString)) return true;//IF NUMBER
	else if(/^\d+\.\d+$/.test(strString)) return true;//IF A DECIMAL NUMBER HAVING AN INTEGER ON EITHER SIDE OF THE DOT(.)
	else return false;
}

$(document).ready(function(){ // Script del Navegador 

	function isInMapBounds(x,y){
		var bounds = map.getMaxExtent();
		return bounds.contains(x,y,false);
	}

	$("#search-coord-btn").click(function() {
			var coordx = $("#coordx");
			var coordy = $("#coordy");
			var x = coordx.val();
			var y = coordy.val();
						
			if (IsNumeric(x) && IsNumeric(y) && x !="" & y != "" )
			{ 
				if (isInMapBounds(x,y)){
				    coordinatesDrawPoint(x,y);
					map.setCenter(
							new OpenLayers.LonLat(x, y), 5, dragging=true, forceZoomChange=true
					);
				} else {
					//TODO error!!
					return;
				}
			} else {
				return;
			}
	});//click()
});
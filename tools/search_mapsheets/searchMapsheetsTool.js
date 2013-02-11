function msZoomToBBox(bbox) {
	if(bbox) {
		var bounds = new OpenLayers.Bounds();
		bounds.extend(new OpenLayers.Geometry.Point(bbox['xmin'], bbox['ymin']));
		bounds.extend(new OpenLayers.Geometry.Point(bbox['xmax'], bbox['ymax']));

		map.zoomToExtent(bounds, true);
		map.zoomTo(map.getZoom()-1);
	} else {
		//alert("Non respondiu nada");
	}
}

function msDrawJSON(geojson) {
	search_vector.removeAllFeatures();
	if(geojson) {
		var geojson_format = new OpenLayers.Format.GeoJSON();
		var feat = geojson_format.read(jQuery.parseJSON(geojson.the_geom));
		search_vector.addFeatures(feat);
	} else {
		//alert("Non respondiu nada");
	}
}

function initSearchMapSheetsDialog() {
	$("#search-folla5-btn").button();
	$("#search-dialog").dialog();

	/////////////////////////////
	//Init folla5 ComboBox
	var cbox = $("#search-folla5-cbox");
	cbox.children().remove();
	cbox.append('<option value="' + 0 + '">Seleccione...</option>');
	$.ajax({
		url : "tools/search_mapsheets/search_mapsheets.php",
		type : "GET",
		dataType : "json",
		success : function(response) {
			if(response) {
			    result = response;
			    cbox = $("#search-folla5-cbox");
			    for(var i = 0; i < result.length; i++) {
				cbox.append('<option value="' + result[i].clasico + '">' + result[i].clasico + '</option>');
			    }
			} else {
			    //alert("Non respondiu nada");
			}
		},
		error : function(response) {
			alert("Error collendo listaxe de Follas5000.");
		}
	});
	//ajax()

	cbox.change(function() {
		//alert($(this).val());
		//updateConcelloCBox($(this).val());
	});
	
	$("#search-folla5-btn").click(function() {
		var cbox = $("#search-folla5-cbox");
		var value = cbox.val();
		if(value == 0) {
			return;
		}
		$.ajax({
			url : "tools/search_mapsheets/get-bbox.php",
			type : "GET",
			data : "code=" + cbox.val(),
			dataType : "json",
			success : msZoomToBBox,
			error : function(response) {
				alert("Error na resposta.");
			}
		});
		$.ajax({
			url : "tools/search_mapsheets/get-geojson.php",
			type : "GET",
			data : "code=" + cbox.val(),
			dataType : "json",
			success : msDrawJSON,
			error : function(response) {
				alert("Error na resposta.");
			}
		});

	});
}


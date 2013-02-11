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

function initSearchSystemDialog() {
	$("#search-sistema-btn").button();
	$("#search-dialog").dialog();

	/////////////////////////////
	//Init sistema ComboBox
	var cbox = $("#search-sistema-cbox");
	cbox.children().remove();
	cbox.append('<option value="' + 0 + '">Seleccione...</option>');
	$.ajax({
		url : "tools/search_system/search_system.php",
		type : "GET",
		dataType : "json",
		success : function(response) {
			if(response) {
			    result = response;
			    cbox = $("#search-sistema-cbox");
			    for(var i = 0; i < result.length; i++) {
				cbox.append('<option value="' + result[i].nombre_se + '">' + result[i].nombre_se + '</option>');
			    }
			} else {
			    alert("Non respondiu nada SE");
			}
		},
		error : function(response) {
			alert("Error collendo listaxe de Sistemas de Explotación.");
		}
	});
	//ajax()

	cbox.change(function() {
		//alert($(this).val());
		//updateConcelloCBox($(this).val());
	});
	
	$("#search-sistema-btn").click(function() {
		var cbox = $("#search-sistema-cbox");
		var value = cbox.val();
		if(value == 0) {
			return;
		}
		$.ajax({
			url : "tools/search_system/get-bbox.php",
			type : "GET",
			data : "code=" + cbox.val(),
			dataType : "json",
			success : msZoomToBBox,
			error : function(response) {
				alert("Error na resposta.");
			}
		});
		$.ajax({
			url : "tools/search_system/get-geojson.php",
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


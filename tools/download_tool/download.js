function initDownload() {
	
	//TODO get a connection to DB._map table to get groups and layers
	// and build a nice a flexible ToC!!! :-)
	//var tabla = document.getElementById("lista_descargas");
	var tabla = $("#lista_descargas");
	tabla.children().remove();
	
}

function downloadClick() {
	
	initDownload();
	
	$.ajax({
			url : "tools/download_tool/get-download.php",
			type : "GET",
			dataType : "json",
			success : loadLayersDownload,
			error : function(response) {
				alert("Error na resposta.");
			}
			
		});
		
	$("#dialogo").dialog({
		modal : true,
		title : "Panel de descargas",
		height: 400,
		width : 610,
		minWidth : 350,
		maxWidth : 700,
		maxHeight : 600,
		show : "fold",
		hide : "scale"
	});
}

function loadLayersDownload(response){
	
	var html = '<thead><tr> <th><b>Grupo</b></th> <th>Capa</th> <th>Última versión</th> <th>Descarga</th>  </tr></thead><tbody>';
	var rows_num = response.length;

	for(var i = rows_num - 1; i >= 0; i--) {
		html =html + '<tr class="gradeC"><td>'+ response[i].group +'</td><td>'+ response[i].layer+ '</td><td>'+ response[i].last_version+ '</td><td><a href="'+ url_descargas + response[i].file_name+ '"><img src="images/download.png" alt="-" />Descargar</a></td></tr>';
	}
	html =html + '</tbody>';
	$("#lista_descargas").append(html);
	
}
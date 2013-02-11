<?php

// Set your return content type
header('Content-type: application/xml');

$RC=$_GET["RC"];

if (!isset($RC)){
	return 'RC not set';
}

// Website url to open
$daurl = 'https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_CPMRC?' .
	'Provincia=&Municipio=&SRS=epsg:25829&RC='.$RC;

// Get that website's content
$handle = fopen($daurl, "r");

// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>
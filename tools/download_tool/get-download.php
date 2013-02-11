<?php
/**
 * This code connects to PostGIS descargas table 
 * to get download layers.
 */

include '../../php/config.php';
include '../../php/access-bbdd.php';
include 'get-functions.php';

$getfeaturesD = new GetFeaturesDownload($connectionstring_dhgc, $connectionstring_carto);
$connected = $getfeaturesD->connect();
if($DEBUG_MODE){
	$connected = (TRUE) ? debug("Connected...") : debug("ERROR: NOT CONNECTED!!") ;
}

//$MAP_NAME='default';

try {
	$list = $getfeaturesD->getDownloadLayers();
	
	echo json_encode($list);
	
} catch (SINAException $ex) {
	echo $ex.getMessage();
}
?>


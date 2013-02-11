<?php
/**
 * This code connects to PostGIS _map table (defined by ELLE gvSIG-EIEL extension)
 * to get ToC layers.
 */

include '../../php/config.php';
include '../../php/access-bbdd.php';
include 'get-functions.php';

$getfeatures = new GetFeatures($connectionstring_dhgc, $connectionstring_carto);
$connected = $getfeatures->connect();
if($DEBUG_MODE){
	$connected = (TRUE) ? debug("Connected...") : debug("ERROR: NOT CONNECTED!!") ;
}

$MAP_NAME='default';

try {
	if (isset($MAP_NAME)){
		$list = $getfeatures->getELLELayers($MAP_NAME);
	} else {
		$list = $getfeatures->getELLELayers('default');
	}
	echo json_encode($list);
} catch (SINAException $ex) {
	echo $ex.getMessage();
}
?>


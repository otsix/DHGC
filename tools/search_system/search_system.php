<?php
include '../../php/config.php';
include '../../php/access-bbdd.php';
include 'get-functions.php';

$getfeatures = new GetFeatures($connectionstring_dhgc, $connectionstring_carto);
$connected = $getfeatures->connect();
if($DEBUG_MODE){
	$connected = (TRUE) ? debug("Connected...") : debug("ERROR: NOT CONNECTED!!") ;
}

if (isset($_GET['sistema'])){
	$sistema = $_GET['sistema'];
}

try {
	if (isset($sistema)){
		$list = $getfeatures->getSistemaList($sistema);
	} else {
		$list = $getfeatures->getSistemaList();
	}
	echo json_encode($list);
} catch (SINAException $ex) {
	echo $ex.getMessage();
}
?>


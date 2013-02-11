<?php
include '../../php/config.php';
include '../../php/access-bbdd.php';
include 'get-functions.php';

$table = '"public"."sistema_explotacion"';
$column = 'nombre_se';
$code = $_GET['code'];


$getfeatures = new GetFeatures($connectionstring_dhgc, $connectionstring_carto);
$connected = $getfeatures->connect();

try {
	$bbox = $getfeatures->getGeometryJSON($table, $column, $code, TRUE);
	echo json_encode($bbox);
} catch (SINAException $ex) {
	echo $ex.getMessage();
}
?>

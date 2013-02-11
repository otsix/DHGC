<?php
include '../../php/config.php';
include '../../php/access-bbdd.php';
include 'get-functions.php';

##TODO It must have a "AMBITO" table with the BBOX
$table = '"public"."'.$_GET['table'].'"';
$column = $_GET['column'];
$code = $_GET['code'];

// $table = '"carto"."provincia"';
// $column = 'cdprov';
// $code = '15';

$getfeatures = new GetFeatures($connectionstring_dhgc, $connectionstring_carto);
$connected = $getfeatures->connect_carto();

try {
	#$feat = $getfeatures->search($dato);
	$bbox = $getfeatures->getBBox($table, $column, $code, FALSE);
	echo json_encode($bbox);
} catch (SINAException $ex) {
	echo $ex.getMessage();
}
?>

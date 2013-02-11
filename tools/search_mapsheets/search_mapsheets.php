<?php
include '../../php/config.php';
include '../../php/access-bbdd.php';
include 'get-functions.php';

$getfeatures = new GetFeatures($connectionstring);
$connected = $getfeatures->connect();
if($DEBUG_MODE){
	$connected = (TRUE) ? debug("Connected...") : debug("ERROR: NOT CONNECTED!!") ;
}

if (isset($_GET['folla5'])){
	$folla5 = $_GET['folla5'];
}

try {
	if (isset($folla5)){
		$list = $getfeatures->getFolla5List($folla5);
	} else {
		$list = $getfeatures->getFolla5List();
	}
	echo json_encode($list);
} catch (SINAException $ex) {
	echo $ex.getMessage();
}
?>


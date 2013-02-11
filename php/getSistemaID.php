<?php

   include ('config.php');

   function processSQLResult($result){
   	  $tb = '';
      if(pg_num_rows($result)>0){         
         while ($row = pg_fetch_row($result)){
             $tb .= $row[0];
         }
      }
      return $tb;
   }

$dbconn = pg_connect($connectionstring);

$lon = $_GET['lon'];
$lat = $_GET['lat'];

$sql = "SELECT nombre_se 
FROM sistema_explotacion
WHERE st_intersects(the_geom,
setsrid(st_makepoint(". $lon . ", ". $lat ."), getsrid(the_geom)))";

if ($DEBUG_MODE) {debug($sql);}

$res = pg_query($dbconn, $sql);
$msg = processSQLResult($res);

echo $msg;

?>


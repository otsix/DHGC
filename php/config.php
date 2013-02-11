<?php

require_once ('PhpConsole.php');
PhpConsole::start();

//DEBUG_MODE=1 when devel, else set to "0"
$DEBUG_MODE=1;

////////TODO change to CartoBASE db (it must contain all base layers admin-limits, etc.)
$host_carto="localhost"; // DB hostname
$port_carto="5432"; // DB Port
$db_name_carto="cartobase"; // DB Name 
$username_carto="cartobase_reader"; //Username 
$password_carto="20webcarto12"; //Password to access 
$connectionstring_carto = "host=$host_carto dbname=$db_name_carto user=$username_carto password=$password_carto";

////////TODO change to CartoBASE db (it must contain all base layers admin-limits, etc.)
$host_dhgc="localhost"; // DB hostname
$port_dhgc="5432"; // DB Port
$db_name_dhgc="dhgc"; // DB Name 
$username_dhgc="dhgc_reader"; //Username 
$password_dhgc="20dhgc12"; //Password to access 
$connectionstring_dhgc = "host=$host_dhgc dbname=$db_name_dhgc user=$username_dhgc password=$password_dhgc";

/////cambiar valor de la variable $MAPS_FOLDER para el directorio de alojamiento de cartografia
$MAPS_FOLDER="../cdix/pdfs/";
?>
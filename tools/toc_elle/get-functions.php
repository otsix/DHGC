<?php

include '../../php/config.php';

class GetFeatures extends AccessBBDD {
	
	function __construct($connectionstring_dhgc, $connectionstring_carto) {
		parent::__construct($connectionstring_dhgc, $connectionstring_carto);
	}
	
	public function getELLELayers($map_name){
		global $DEBUG_MODE;
		$sqlquery = 'SELECT nombre_capa, nombre_tabla, posicion, visible, grupo '.
		'FROM _map WHERE mapa = \''.$map_name.'\' order by posicion';
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn_dhgc, $sqlquery);
		return pg_fetch_all($result);
	}
}
?>
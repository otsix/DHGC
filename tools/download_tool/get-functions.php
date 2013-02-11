<?php

include '../../php/config.php';

class GetFeaturesDownload extends AccessBBDD {
	
	function __construct($connectionstring_dhgc, $connectionstring_carto) {
		parent::__construct($connectionstring_dhgc, $connectionstring_carto);
	}
	
	public function getDownloadLayers(){
		global $DEBUG_MODE;
		$sqlquery = 'SELECT * FROM descargas';
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn_dhgc, $sqlquery);
		return pg_fetch_all($result);
	}
}
?>
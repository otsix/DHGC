<?php

include '../../php/config.php';

class GetFeatures extends AccessBBDD {
	
	function __construct($connectionstring_dhgc, $connectionstring_carto) {
		parent::__construct($connectionstring_dhgc, $connectionstring_carto);
	}
	
    private function convertFeaturesToJSON($result) {
		
		$features = array();
		while ($row = pg_fetch_array($result)) {
  			//Read all columns
			$cols = array_keys($row);
  			$cols_length = count($cols);
  			$properties = '';
  			for ($i = 1; $i < $cols_length - 1; $i=$i+2){
    			$k = $cols[$i];
    			//TODO remove 'geom' here
    			$properties = $properties . '"'. $k .'":"' . $row[$k] . '",';
  			};
  			$properties = substr($properties, 0, -1);

			$feature = '{ "type": "Feature", "id": ' . $row['id_issue'] . ', "properties": { '.$properties.' }, "geometry": ' . $row['geom'] . ' },';
  			array_push($features, $feature);
		}
		return $features;
	}

	public function getMalla5000ById($id){
		global $DEBUG_MODE;
		
//		$sqlquery = "SELECT *,  st_asgeojson(the_geom) as geom from incidencias where id_issue=" . $id;
		$sqlquery = "SELECT *,  st_asgeojson(the_geom) as geom from malla5_etrs_concellos where clasico= . $id";
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn, $sqlquery);
		
		if (pg_num_rows($result) != 0) {
			$features = $this -> convertFeaturesToJSON($result);
		}
		
		return substr($features[0], 0, -1);
	}
	
	public function getFolla50List(){
		global $DEBUG_MODE;
		//TODO creo que sería mejor "CLASICO"
		$sqlquery = 'select folla50, clasico from malla50_etrs_concellos order by clasico';
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn, $sqlquery);
		return pg_fetch_all($result);
	}	
	public function getFolla25List(){
		global $DEBUG_MODE;
		//TODO creo que sería mejor "CLASICO"
		$sqlquery = 'select folla25, clasico from malla25_etrs_concellos order by clasico';
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn, $sqlquery);
		return pg_fetch_all($result);
	}
	public function getFolla5List(){
		global $DEBUG_MODE;
		//TODO creo que sería mejor "CLASICO"
		$sqlquery = 'select folla5, clasico from malla5_etrs_concellos order by clasico';
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn, $sqlquery);
		return pg_fetch_all($result);
	}
	
/*
	public function getFolla5List($folla25){//$folla25
		$sqlquery = 'select folla5 from malla5_etrs_concellos'.
		"WHERE folla25 ='". $folla25 ."'".
		//"WHERE codparro::text LIKE '". $cdconc ."%' ".
		'ORDER BY folla5';
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn, $sqlquery);
		return pg_fetch_all($result);
	}
*/	

	public function getBBox($tbl, $col, $id){
		return(getBBoxString($tbl,$col, $id, FALSE));
	}
	
	public function getBBoxString($tbl, $col, $id, $isString){
		global $DEBUG_MODE;
		$sqlbbox = 'SELECT st_xmax(the_geom) as xmax, st_ymax(the_geom) as ymax, ' . 
		'st_xmin(the_geom) as xmin, st_ymin(the_geom) as ymin ' . 
		'FROM '.$tbl . ' ';
		if ($isString) {
			$sqlbbox .= ' WHERE "'.$col."\"='" . $id . "';";	
		} else {
			$sqlbbox .= ' WHERE "'.$col.'"=' . $id . ';';
		}
		
		if($DEBUG_MODE){debug($sqlbbox);}
		
		$result_bbox = pg_query($this->conn, $sqlbbox);
		
		$count_bbox = pg_num_rows($result_bbox);
		if ($count_bbox == 1) {
			$row = pg_fetch_row($result_bbox);
			$xmax = $row[pg_field_num($result_bbox, 'xmax')];
			$ymax = $row[pg_field_num($result_bbox, 'ymax')];
			$xmin = $row[pg_field_num($result_bbox, 'xmin')];
			$ymin = $row[pg_field_num($result_bbox, 'ymin')];
			$bbox = array();
			$bbox['xmax'] = $xmax;
			$bbox['ymax'] = $ymax;
			$bbox['xmin'] = $xmin;
			$bbox['ymin'] = $ymin;
			//$bbox = $xmax . ',' . $ymax . ',' . $xmin . ',' . $ymin;
		}
		return $bbox;
	}
	
	public function getGeometryJSON($tbl, $col, $id, $isString){
		global $DEBUG_MODE;
		$sqlbbox = 'SELECT ST_AsGeoJSON(the_geom) as the_geom ' .
		'FROM '.$tbl . ' ';
		if ($isString) {
			$sqlbbox .= ' WHERE "'.$col."\"='" . $id . "';";
		} else {
			$sqlbbox .= ' WHERE "'.$col.'"=' . $id . ';';
		}
		if($DEBUG_MODE){debug($sqlbbox);}

		$result_bbox = pg_query($this->conn, $sqlbbox);
		$count_bbox = pg_num_rows($result_bbox);
		if ($count_bbox == 1) {
			$row = pg_fetch_row($result_bbox);
			$the_geom = $row[pg_field_num($result_bbox, 'the_geom')];
			$bbox = array();
			$bbox['the_geom'] = $the_geom;
		}
		return $bbox;
	}

}
?>
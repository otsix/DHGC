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
	

	public function getSistemaList(){
		global $DEBUG_MODE;
		//TODO creo que sería mejor "CLASICO"
		$sqlquery = 'select cod_se, nombre_se from sistema_explotacion order by nombre_se';
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn_dhgc, $sqlquery);
		return pg_fetch_all($result);
	}
	


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
		
		$result_bbox = pg_query($this->conn_dhgc, $sqlbbox);
		
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
		$tolerance = 10;
		$sqlbbox = 'SELECT ST_AsGeoJSON(st_simplify(the_geom, '.$tolerance.'),0) as the_geom ' .
		'FROM '.$tbl . ' ';
		if ($isString) {
			$sqlbbox .= ' WHERE "'.$col."\"='" . $id . "';";
		} else {
			$sqlbbox .= ' WHERE "'.$col.'"=' . $id . ';';
		}
		if($DEBUG_MODE){debug($sqlbbox);}

		$result_bbox = pg_query($this->conn_dhgc, $sqlbbox);
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
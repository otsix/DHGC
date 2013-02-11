<?php

include ('../../php/config.php');

class GetFeatures extends AccessBBDD {
 		
	function __construct($connectionstring_dhgc, $connectionstring_carto) {
		parent::__construct($connectionstring_dhgc, $connectionstring_carto);
	}
	
	public function getProvinciaList(){
		global $DEBUG_MODE;
		$sqlquery = 'SELECT cdprov, nome '.
					'FROM public.provincia '.
					'ORDER BY cdprov';
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn_carto, $sqlquery);
		return pg_fetch_all($result);
	}
	
	public function getConcellosList($cdprov){
		global $DEBUG_MODE;
		$sqlquery = 'select cdconc, nome from public.concello '.
		'WHERE cdprov = '. $cdprov .' '.
		'ORDER BY cdconc';
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn_carto, $sqlquery);
		return pg_fetch_all($result);
	}

	public function getParroquiasList($cdconc){
		global $DEBUG_MODE;
		$sqlquery = 'select codparro, nome from public.parroquia '.
		"WHERE codparro::text LIKE '". $cdconc ."%' ".
		'ORDER BY codparro';
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn_carto, $sqlquery);
		return pg_fetch_all($result);
	}
	
	public function getEntidadesList($cdconc){
		global $DEBUG_MODE;
		$sqlquery = 'select cod_ine9, nomb10 from public.entidade_singular '.
		"WHERE cod_ine9::text LIKE '". $cdconc . "%' ".
		'ORDER BY nomb10';
		if($DEBUG_MODE){debug($sqlquery);}
		$result = pg_query($this -> conn_carto, $sqlquery);
		return pg_fetch_all($result);
	}
	
	
	public function getBBox($tbl, $col, $id, $isString){
		global $DEBUG_MODE;
		$sqlbbox = 'SELECT st_xmax(the_geom) as xmax, st_ymax(the_geom) as ymax, ' . 
		'st_xmin(the_geom) as xmin, st_ymin(the_geom) as ymin ' . 
		'FROM '.$tbl.' ';
		if ($isString) {
			$sqlbbox .= ' WHERE "'.$col."\"='" . $id . "';";
		} else {
			$sqlbbox .= ' WHERE "'.$col.'"=' . $id . ';';
		}
		
		if($DEBUG_MODE){debug($sqlbbox);}
		
		$result_bbox = pg_query($this->conn_carto, $sqlbbox);
		
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

		$result_bbox = pg_query($this->conn_carto, $sqlbbox);
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
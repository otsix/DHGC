/**
 * Micho Garcia - michogar@gmail.com
 * Creacion - 20110526
 * Ultima modificacion - 20110527
 */


/**
 * Clase para realizar el getfeatureinfo. Para instalarlo:
 * 		(code)
 * 			control_getfeatureinfo = new Xunta_getfeatureinfo(mapa)
 * 			control_getfeatureinfo.init(url, [capas])
 * 		(code)
 * En caso de existir mas de un servidor de mapas, se debe instanciar un 
 * objeto por cada servidor con el grupo de capas del mismo
 * Una vez instanciado el control, este debe activarse y desactivarse mediante
 * los metodos activate y deactivate
 */

/**
 * Constructor: 
 * Parametro:
 * map - {OpenLayers.Map} Mapa sobre el que se van a añadir los controles
 * 
 */
Xunta_getfeatureinfo = function(map) {

	/**
	 * Propiedad: map
	 * 
	 * El mapa 
	 */
	this.map = map;
	
	/**
	 * Propiedad: click
	 * 
	 * Se mantiene el control en esta propiedad para permitir el acceso desde 
	 * otros métodos
	 */
	this.click = null;


	/**
	 * Funcion: init
	 * 
	 * Parametros: 
	 * 
	 * map - {OpenLayers.Map} Mapa sobre el que crear el control
	 * url - {String} URL del servicio que se quiere consultar
	 * layers - {Array} Arreglo con las capas que queremos que sean consultadas  
	 * 
	 * Inicializa el control y lo añade al mapa. SOLO para capas de un mismo servicio. 
	 * Para activar el control para mas servicios se debe instanciar por cada servicio 
	 * y pasarle el grupo de capas del mismo.
	 * 
	 */
	this.init = function(url, layers){

		this.click = new OpenLayers.Control.WMSGetFeatureInfo({
			url: url, 
			title: 'Identificar features con click',
			layers: layers,
			infoFormat: 'application/vnd.ogc.gml',
			queryVisible: true
		})
		this.click.events.register("getfeatureinfo", this, this.showLayerInfo)
		this.map.addControl(this.click);		
	};
	
	/**
	 * Function: activate
	 * 
	 * Activa el control getfeatureinfo 
	 */
	this.activate = function()
	{
		this.click.activate();
	};
	
	/**
	 * Function: deactivate
	 * 
	 * Desactiva el control getfeatureinfo
	 */
	this.deactivate = function()
	{
		this.click.deactivate();
	}

	/**
	 * Function: showLayerInfo
	 *  
	 * Parametros: 
	 * evt - {OpenLayers.Event} Recibe el evento que se genera en el click del control WMSGetFeatureInfo
	 * 
	 * Muestra la información recibida del click en un popup que es añadido al mapa
	 */
	this.showLayerInfo = function(evt)
	{
		if (evt.features.length == 0)
			return;

		var html = '';
		for (var i=0;i<evt.features.length;i++) {
			html += this.tableHTML(evt.features[i]);
		}
		this.showPopup(evt.xy, html);
	};

	/**
	 * Function: killPopups
	 * 
	 * Elimina todos los popups que haya en el mapa recorriendo el array de popups
	 */
	this.killPopups = function ()
	{	
		for (var n=0; n<map.popups.length; n++){
			this.map.popups[n].destroy();
		}
	};

	/**
	 * Function: showPopup
	 * 
	 * Parametros:
	 * xyYnfo - {xy} Coordenadas de la pantalla (pixels) sobre los que se ha realizado el click
	 * html - {String} Cadena con la estructura HTML para publicar en el popup
	 * 
	 * Comprueba si existe un popup sobre el mapa y en ese caso lo destruye y crea uno nuevo 
	 * con la info del getfeatureinfo
	 */
	this.showPopup = function (xyInfo, html)
	{
		this.killPopups();

		var lonlatPop = map.getLonLatFromPixel(new OpenLayers.Pixel(xyInfo.x, xyInfo.y));
		var popup = new OpenLayers.Popup('infopopup',
				lonlatPop,
				null,
				html,
				true,
				this.killPopups);
		popup.autoSize = true;
		this.map.addPopup(popup);
	};

	/**
	 * Function: tableHTML
	 * Parametros:
	 * feature - {OpenLayers.Feature} Objeto que sobre el que se ha realizado la petición
	 * getfeatureinfo
	 * 
	 * Con el objeto que recibe se crea una tabla en HTML mostrando la información 
	 * de la peticion
	 */

	this.tableHTML = function (feature)
	{
		var html = '<table id="infotable"><tbody><h3>' + feature.type + '</h3><br>';
		for (attribute in feature.attributes) {
			html += '<tr><td>' + attribute  + '</td><td>' + feature.attributes[attribute] + '</td></tr>';
		}
		html += '</tbody></table><br>';

		return html;
	};
};
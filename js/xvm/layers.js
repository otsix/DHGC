/**
 * XVM: Xeovisor Minimo 
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License: 
 *   LICENSE.txt file available at the root application directory
 *
 * https://forxa.mancomun.org/projects/xeoportal
 * http://xeovisorminimo.forxa.mancomun.org
 *
 */

function getLayer(urlWMS, layerID, layerTitle){
    return new OpenLayers.Layer.WMS(layerTitle,
				    urlWMS, {
					layers: layerID,
    					transparent: true,
    					format: "image/png"
    				    },{
    					isBaseLayer: false,
    					singleTile: false,
    					visibility: true, //set true to display by default on load
					transitionEffect: 'resize',
    					buffer: 0
    				    }
				   );
}

function getLayers(){
    var layers_arr = new Array();
    ///////////////////////////////////
    // Base Layers
    ///////////////////////////////////

    var mtnLayer = new OpenLayers.Layer.WMS("Topografico (MTN)",
					    "http://www.idee.es/wms/MTN-Raster/MTN-Raster", {
						layers: "mtn_rasterizado"
					    }, {
						isBaseLayer: true,
						buffer: 0,
						opacity: 0.8,
						transitionEffect: 'resize',
						visibility: true
					    }
					   );
    layers_arr.push(mtnLayer);
    
    var topoLayer = new OpenLayers.Layer.WMS("IGN-Base",
					     "http://www.ign.es/wms-inspire/ign-base", {
						 layers: "IGNBaseTodo"
					     }, {
						 isBaseLayer: true,
						 buffer: 0,
						 transitionEffect: 'resize',
						 visibility: false
					     }
					    );
    layers_arr.push(topoLayer);

    var sitgaLayer = new OpenLayers.Layer.WMS("SITGA-Base", 
					      "http://ideg.xunta.es/wms/request.aspx", {
						  layers : ["Toponimia_txt_1_5000", "CONCELLO", 
							    "Hidrografia_txt_1_5000", "Edificacions_1_5000", 
							    "Hidrografia_1_5000", "IGREXA", "VILAS", "CIDADES_B", "CIDADES", 
							    "SECUNDARIA", "AUTOESTRADA_AUTOVIA", "REDE_ESTATAL", 
							    "PRIMARIA_BASICA", "CORREDOR", "PRIMARIA_COMPLEMENT", 
							    "PRESA", "ENCORO", "RIO_DOBLE", "RIOS", "PARROQUIA", "PROVINCIA",
							    "NOMECONCELLO", 
							    "TOPONIMIA_COSTA", "TXT_CIDADES", "TXT_CIDADES_B", 
							    "TXT_PARROQUIA", "TXT_VILAS"]
					      }, {
						  isBaseLayer : true,
						  transitionEffect : 'resize',
						  buffer : 0,
						  opacity : 0.6,
						  singleTile : true,
						  visibility : false
					      }
					     );
    layers_arr.push(sitgaLayer);

    var pnoaIDEG_0708Layer = new OpenLayers.Layer.WMS("Ortofoto-IDEG (2007-08)",
						      "http://ideg.xunta.es/wms_orto_2007-08/request.aspx", {
							  layers: "Ortofoto_2007_08"
						      }, {
							  isBaseLayer: true,
							  buffer: 0,
							  transitionEffect: 'resize',
							  visibility: false
						      }
						     );
    layers_arr.push(pnoaIDEG_0708Layer);

    var pnoaIDEG_03Layer = new OpenLayers.Layer.WMS("Ortofoto-IDEG (2003)",
						    "http://ideg.xunta.es/wms-orto/request.aspx", {
							layers: "LandsatSpot2003,ortofotos2003"
						    }, {
							isBaseLayer: true,
							buffer: 0,
							transitionEffect: 'resize',
							visibility: false
						    }
						   );
    layers_arr.push(pnoaIDEG_03Layer);

    var pnoaMRLayer = new OpenLayers.Layer.WMS("IDEE-PNOA-MR",
					       "http://www.idee.es/wms/PNOA-MR/PNOA-MR", {
						   layers: "PNOA-MR"
					       }, {
						   isBaseLayer: true,
						   buffer: 0,
						   transitionEffect: 'resize',
						   visibility: false
					       }
					      );
    layers_arr.push(pnoaMRLayer);

    var pnoaLayer = new OpenLayers.Layer.WMS("IDEE-PNOA",
					     "http://www.idee.es/wms/PNOA/PNOA", {
						 layers: "pnoa"
					     }, {
						 isBaseLayer: true,
						 buffer: 0,
						 transitionEffect: 'resize',
						 visibility: false
					     }
					    );
    layers_arr.push(pnoaLayer);

    var catastroLayer = new OpenLayers.Layer.WMS("Catastro",
						 "http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx", {
						     layers: "CATASTRO"
						 }, {
						     isBaseLayer: true,
						     buffer: 0,
						     singleTile: false,
						     transitionEffect: 'resize',
						     visibility: false
						 }
						);
    layers_arr.push(catastroLayer);
    
    var emptyLayer = new OpenLayers.Layer.Image($.i18n.prop("no_base_layer"),
						'js/xvm/images/white.png',
						map.maxExtent,
						new OpenLayers.Size(1, 1),
						{
						    opacity: 0,
						    isBaseLayer: true,
						    buffer: 0,
						    singleTile: true
						}
					       );
    layers_arr.push(emptyLayer);

    ///////////////////////////////////
    // Custom Layers
    ///////////////////////////////////
    // custom WMS layer. Pass urlWMS and layer1 params. to customize the viewer.
    // var customWMS = "http://193.144.40.244/cgi-bin/ideaeg?"; // custom WMS service
    // var lyrWMS = customWMS; // custom layer URL WMS service
    // var layer = "IPPC"; // custom layer
    // var title = "IPPC"; // layer name to show to the user in TOC

    // var custom_lyr = new OpenLayers.Layer.WMS(
    // 					      title,
    // 					      customWMS, 
    // 					      {
    // 						  layers: [layer],
    // 						  transparent: true,
    // 						  format: "image/png"
    // 					      },{
    // 						  isBaseLayer: false, // custom layers should set "false" here
    // 						  singleTile: true,
    // 						  visibility: true, //set true to display by default on load
    // 						  buffer: 0
    // 					      }
    // 					      );
    // layers_arr.push(custom_lyr);

    return layers_arr;
}
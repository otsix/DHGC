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



function launchHelpDialog(){
    var p = map.getControlsByClass('OpenLayers.Control.Permalink')[0];
    //alert($.i18n.prop("help_alert"));
    window.open("axuda.htm");
} 
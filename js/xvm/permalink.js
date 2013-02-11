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
* PERMALINK FUNCTION
*/

function copyToClipboard (text) {
    //TODO translate
    window.prompt ($.i18n.prop("permalink_prompt"), text);
}

function launchPermalinkDialog(){
    var p = map.getControlsByClass('OpenLayers.Control.Permalink')[0];
    var my_url = p.base + '?'+ OpenLayers.Util.getParameterString(p.createParams());
    copyToClipboard(my_url);
} 
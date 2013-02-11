function initSplash(apartado) {
	$("#splash").trigger('click');
}

$(document).ready(function(){
	$("#splash").fancybox({
		'padding'		: 0,
		'width': '50%',

		
		'autoScale'			: false,
		'wmode'				: 'transparent',
		'type'				: 'iframe'
	});	

});



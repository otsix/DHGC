function expand_collapse_accordions(){ // Script del Navegador 
	$("ul.form-section2").show();
	$("ul.form-section").hide();
	$("a.expandable").click(function(e){
		var expandable = $(this).parent().find("ul.form-section");
		$('.expandable').parent().find("ul.form-section").not(expandable).slideUp('slow');
		$('.accordion_expanded').parent().find("ul.form-section2").not(expandable).slideUp('slow');
		expandable.slideToggle('slow');
		e.preventDefault();
	});
	$("a.accordion_expanded").click(function(e){
		var expandable = $(this).parent().find("ul.form-section2");
		$('.expandable').parent().find("ul.form-section").not(expandable).slideUp('slow');
		expandable.slideToggle('slow');
		e.preventDefault();
	});
}

$(document).ready(
	expand_collapse_accordions()
);
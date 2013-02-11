$(document).ready(function(){
	 var status = 1;
	var toggler = $("#toggler");
    var boxContainer = $("#boxContainer");
    var mappanel = $("#mappanel");
	var abrecierra=$("#abrecierra");
	toggler.click(clickToggler);
	// control de elemento lateral (toggler)
    function clickToggler(){      
        //ocultamos panel si esta mostrandose
        if(status ==1){
		
            boxContainer.hide();//"slow"
			abrecierra.css("left", "0px");
            mappanel.css("left","0px");
            toggler.addClass("off");
            
            status = 0;
        }
        //mostramos panel si esta oculto
        else{
            boxContainer.show();//"slow"
			abrecierra.css("left", boxContainer.width() + "px");
           // mappanel.css("left", "280px"); boxContainer.width()
            toggler.removeClass("off");
            
            status = 1;
        }
    }

    $(".menu > li").click(function(e){
        var a = e.target.id;
        //desactivamos seccion y activamos elemento de menu
        $(".menu li.active").removeClass("active");
        $(".menu #"+a).addClass("active");
        //ocultamos divisiones, mostramos la seleccionada
        $(".content").css("display", "none");
        $(".content_busca").css("display", "none");
        $("."+a).fadeIn();
    });
});
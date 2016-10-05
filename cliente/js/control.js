var url="http://127.0.0.1:1338/";

function iniciar(){
	pedirNombre();
	$('#inicio').append('<p id="crear"><button id="crear" type="button" class="btn btn-primary btn-lg">Crear nueva partida</button></p>');
    $('#crear').on("click",function(){
      $('#crear').remove();
      $.getScript("js/juego.js", function(){
        //Stuff to do after someScript has loaded
        console.log("ok");
      });
      empezar($('#nombre').val());
     });
 }

function pedirNombre(){
	$('#inicio').append('<p id="nom"><input type="text" id="nombre"> ')
}

//Comunicaciones
 function empezar(nombre){
 	if (nombre=="")
 		nombre="jugador";
	$.getJSON(url+"empezar/"+nombre,function(data){						
						
	})
}
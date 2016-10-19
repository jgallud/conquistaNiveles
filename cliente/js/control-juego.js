
var url="http://127.0.0.1:1338/";
var game;

//Funciones que modifican el index

function inicio(){
	if ($.cookie("nombre")!=undefined)
	{
		comprobarUsuario();
	}
	else{
		mostrarCabecera();
	}
}

function borrarControl(){
	$('#control').remove();
}

function mostrarCabecera(){
	$('#cabecera').remove();
	$('#enh').remove();
	$('#datos').remove();
	$('#prog').remove();
	$('#control').append('<p id="cabecera"><h2 id="cabeceraP">Panel de  Control</h2><input type="text" id="nombre" placeholder="introduce tu nombre"></p>');
	botonNombre();
}

function botonNombre(){
	var nombre="";
	$('#control').append('<button type="button" id="nombreBtn" class="btn btn-primary btn-md">Iniciar partida</button>');
	$('#nombreBtn').on('click',function(){
		nombre=$('#nombre').val();
		$('#nombre').remove();
		$('#nombreBtn').remove();		
		crearUsuario(nombre);
	});
}

function mostrarInfoJugador(){
	var nombre=$.cookie("nombre");
	var id=$.cookie("id");
	var nivel=$.cookie("nivel");
	var percen=Math.floor((nivel/3)*100);
	$('#datos').remove();
	$('#cabeceraP').remove();
	$('#cabecera').remove();
	$('#prog').remove();
	$('#control').append('<div id="cabecera"><h2>Panel</h2></div>')
	$('#control').append('<div id="datos"><h4>Nombre: '+nombre+'<br />Nivel: '+nivel+'</h4></div>');
	$('#control').append('<div class="progress" id="prog"><div class="progress-bar" aria-valuemin="0" aria-valuemax="100" style="width:'+percen+'%">'+percen+'%</div></div>');
	siguienteNivel();
}

function siguienteNivel(){
	$('#control').append('<button type="button" id="siguienteBtn" class="btn btn-primary btn-md">Siguiente nivel</button>')
	$('#siguienteBtn').on('click',function(){
		$('#siguienteBtn').remove();
		$('#enh').remove();
		$('#res').remove();
  		$('#resultados').remove();
		crearNivel($.cookie('nivel'));
	});
}

function noHayNiveles(){
	$('#juegoId').append("<h2 id='enh'>Lo siento, no tenemos más niveles</h2>");
	$('#control').append('<button type="button" id="siguienteBtn" class="btn btn-primary btn-md">Volver a empezar</button>')
	$('#siguienteBtn').on('click',function(){
		$('#siguienteBtn').remove();
		reset();
	});
}

function nivelCompletado(tiempo){
	//game.destroy();
	game.destroy();
	$('#juegoId').append("<h2 id='enh'>Enhorabuena!</h2>");
	comunicarNivelCompletado(tiempo);
	obtenerResultados();
}

function mostrarResultados(datos){
  //eliminarGame();
  //eliminarCabeceras();
  $('#res').remove();
  $('#resultados').remove();
  $('#juegoId').append('<h3 id="res">Resultados</h3>');
  var cadena="<table id='resultados' class='table table-bordered table-condensed'><tr><th>Nombre</th><th>Nivel</th><th>Tiempo</th></tr>";
    for(var i=0;i<datos.length;i++){
      cadena=cadena+"<tr><td>"+datos[i].nombre+"</td><td> "+datos[i].nivel+"</td>"+"</td><td> "+datos[i].tiempo+"</td></tr>";      
    }
    cadena=cadena+"</table>";
    $('#juegoId').append(cadena);
}

function reset(){
	borrarCookies();
	mostrarCabecera();
}

function borrarCookies(){
	$.removeCookie("nombre");
	$.removeCookie("id");
	$.removeCookie("nivel");
}

//Funciones de comunicación con el servidor

function crearUsuario(nombre){
	if (nombre==""){
		nombre="jugador";
	}
	$.getJSON(url+'crearUsuario/'+nombre,function(datos){
		$.cookie('nombre',datos.nombre);
		$.cookie('id',datos.id);
		$.cookie('nivel',datos.nivel);
		mostrarInfoJugador();
	});
	//mostrar datos
}

function comprobarUsuario(){
	var id=$.cookie("id");

	$.getJSON(url+'comprobarUsuario/'+id,function(datos){
		if (datos.nivel<0){
			borrarCookies();
			mostrarCabecera();
		}
		else{
			$.cookie("nivel",datos.nivel);
			mostrarInfoJugador();
		}
	});
}

function comunicarNivelCompletado(tiempo){
	var id=$.cookie("id");

	$.getJSON(url+'nivelCompletado/'+id+"/"+tiempo,function(datos){
			$.cookie("nivel",datos.nivel);
			mostrarInfoJugador();
	});	
}

function obtenerResultados(){
	var id=$.cookie("id");

	$.getJSON(url+'obtenerResultados/'+id,function(datos){
			//$.cookie("nivel",datos.nivel);
			mostrarResultados(datos);
	});
}
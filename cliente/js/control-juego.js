
var url="http://127.0.0.1:1338/";

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
	$('#datos').remove();
	$('#cabeceraP').remove();
	$('#cabecera').remove();
	$('#control').append('<p id="cabecera"><h2>Panel</h2></p>')
	$('#control').append('<div id="datos">Nombre: '+nombre+' Nivel: '+nivel+' Id:'+id+'</div>');
	siguienteNivel();
}

function siguienteNivel(){
	$('#control').append('<button type="button" id="siguienteBtn" class="btn btn-primary btn-md">Siguiente nivel</button>')
	$('#siguienteBtn').on('click',function(){
		$('#siguienteBtn').remove();
		crearNivel($.cookie('nivel'));
	});
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

var url="http://127.0.0.1:1338/";

//Funciones que modifican el index

function inicio(){
	mostrarCabecera();
}

function borrarControl(){
	$('#control').remove();
}

function mostrarCabecera(){
	$('#cabecera').remove();
	$('#control').append('<p id="cabecera"><h2>Panel de  Control</h2><input type="text" id="nombre" placeholder="introduce tu nombre"></p>');
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

function mostrarInfoJugador(datos){
	$('#datos').remove();
	$('#control').append('<div id="datos">Nombre: '+datos.nombre+' Nivel: '+datos.nivel+' Id:'+datos.id+'</div>');
}

//Funciones de comunicación con el servidor

function crearUsuario(nombre){
	if (nombre==""){
		nombre="jugador";
	}
	$.getJSON(url+'crearUsuario/'+nombre,function(datos){
		mostrarInfoJugador(datos);
	});
	//mostrar datos
}
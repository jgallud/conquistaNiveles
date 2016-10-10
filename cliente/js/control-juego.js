
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
	$('#control').append('<div id="cabecera"><h2>Panel de  Control</h2><input type="text" id="nombre" placeholder="introduce tu nombre"></div>');
	botonNombre();
}

function botonNombre(){
	var nombre="";
	$('#cabecera').append('<button type="button" id="nombreBtn" class="btn btn-primary btn-md">Enviar</button>');
	$('#nombreBtn').on('click',function(){
		nombre=$('#nombre').val();
		$('#nombre').remove();
		$('#nombreBtn').remove();		
		crearUsuario(nombre);
	});
}

function mostrarInfoJugador(datos){
	$('#datos').remove();
	$('#cabecera').append('<div id="datos">Nombre: '+datos.nombre+' Nivel: '+datos.nivel+' Id:'+datos.id+'</div>');
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
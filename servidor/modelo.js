var _ = require("underscore");

function Juego(){
	this.nombre="Niveles";
	this.niveles=[];
	this.usuarios=[];
	this.resultados=[];
	this.agregarNivel=function(nivel){
		this.niveles.push(nivel);
	}
	this.agregarUsuario=function(usuario){
		this.usuarios.push(usuario);
	}
	this.obtenerUsuario=function(id){
		return _.find(this.usuarios,function(usu){
			return usu.id==id
		});
	}
	this.agregarResultado=function(resultado){
		this.resultados.push(resultado);
	}
}

function Nivel(num){
	this.nivel=num;
}

function Usuario(nombre){
	this.id=new Date().valueOf();
	this.nombre=nombre;
	this.nivel=0;
}

function Resultado(nombre,nivel,tiempo){
	this.nombre=nombre;
	this.nivel=nivel;
	this.tiempo=tiempo;
}

module.exports.Juego=Juego;
module.exports.Usuario=Usuario;
module.exports.Resultado=Resultado;
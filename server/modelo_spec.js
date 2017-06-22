var modelo=require('./modelo.js');

describe("El juego Conquista Niveles...",function(){
	var fm;
	var juego;

	beforeEach(function(){
		fm=new modelo.JuegoFM("./coordenadas.json");
		juego=fm.makeJuego();
	});

	it("tiene una coleccion de 4 niveles y 0 usuarios",function(){	
		expect(juego.niveles.length).toEqual(4);
		expect(juego.usuarios.length).toEqual(0);
	});

	it("tiene una colección de resultados vacía",function(){
		expect(juego.resultados.length).toEqual(0);
	});

	it("Registrar al usuario pepe@pepe.es con clave pepe",function(done){
		
	})

	xit("agrega el usuario Pepe",function(){
		var usuario=new modelo.Usuario("Pepe");
		juego.agregarUsuario(usuario);

		expect(juego.usuarios[0]).toEqual(usuario);
		expect(juego.usuarios[0].nombre).toEqual("Pepe");
		expect(juego.usuarios[0].nivel).toEqual(0);
	});

	xit("comprobar obtenerUsuario (usuario existente)",function(){
		var usuario=new modelo.Usuario("Pepe");
		juego.agregarUsuario(usuario);		
		var key=usuario.key;
		var usu=juego.obtenerUsuario(key);
		expect(usu.key).toEqual(key);
	});

	xit("comprobar obtenerUsuario (usuario no existente)",function(){
		var key=00000;
		var usuario=juego.obtenerUsuario(key);
		expect(usuario).toBeUndefined();
	});

	xit("comprobar agregar resultado",function(){
		var res=new modelo.Resultado("Pepe","Pepe",0,11,Date.now());
		juego.agregarResultado(res);
		expect(juego.resultados.length).toEqual(1);
		expect(juego.resultados[0].nombre).toEqual("Pepe");
		expect(juego.resultados[0].nivel).toEqual(0);
		expect(juego.resultados[0].tiempo).toEqual(11);
	})
})

var fs=require("fs");
//var config=JSON.parse(fs.readFileSync("config.json"));
//var host=config.host;
//var port=config.port;
var exp=require("express");
var app=exp(); 
var mongo=require("mongodb"); 
var modelo=require('./servidor/modelo.js');

var juego= new modelo.Juego();
var usuariosCol;

app.set('port', (process.env.PORT || 5000));

//app.use(app.router);
app.use(exp.static(__dirname +"/cliente"));

app.get("/",function(request,response){
	var contenido=fs.readFileSync("./cliente/index-nav.html");
	response.setHeader("Content-type","text/html");
	insertar({nombre:"Pepe",email:"pe@pe.es"});
	response.send(contenido);
});

app.get('/crearUsuario/:nombre',function(request,response){
	//crear el usuario con el nombre
	var usuario= new modelo.Usuario(request.params.nombre);
	juego.agregarUsuario(usuario);
	var id=usuario.id;
	usuario=juego.obtenerUsuario(id);
	console.log(usuario);
	response.send({'nombre':usuario.nombre,'nivel':usuario.nivel,'id':usuario.id});
});

app.get('/comprobarUsuario/:id',function(request,response){
	var id=request.params.id;
	var usuario=juego.obtenerUsuario(id);
	var json={'nivel':-1};
	//console.log("comprobar usuario: "+usuario);
	if (usuario!=undefined){		
		json={'nivel':usuario.nivel};
	}
	response.send(json);
});

app.get('/nivelCompletado/:id/:tiempo',function(request,response){
	var id=request.params.id;
	var tiempo=request.params.tiempo;
	var usuario=juego.obtenerUsuario(id);
	juego.agregarResultado(new modelo.Resultado(usuario.nombre,usuario.nivel,tiempo));
	usuario.nivel+=1;
	console.log(juego.resultados);
	if (usuario!=undefined){		
		json={'nivel':usuario.nivel};
	}
	response.send(json);
});

app.get('/obtenerResultados/:id',function(request,response){
	var id=request.params.id;
	var usuario=juego.obtenerUsuario(id);
	var json={'resultados':[]};
	if (usuario){
		json=juego.resultados;
	}
	response.send(json);
})

//console.log("Servidor escuchando en el puerto "+port);
//app.listen(port);

function insertar(usu){
	usuariosCol.insert(usu,function(err){
		if(err){
			console.log("error");
		}
		else{
			console.log("Nuevo usuario creado");
			//juego.agregarUsuario(usu);
			//response.send(usu);
		}
	});

}


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var db= new mongo.Db("usuarioscn",new mongo.Server("127.0.0.1","27017",{}));

db.open(function(error){
	console.log("conectado a Mongo: usuarioscn");
	db.collection("usuarios",function(err,col){
		console.log("tenemos la colección");
		usuariosCol=col;
	})
})

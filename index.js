var fs=require("fs");
var bodyParser=require("body-parser");
//var mongo=require("mongodb").MongoClient;
//var ObjectID=require("mongodb").ObjectID;
var exp=require("express");
var app=exp(); 
var http=require("http");
var server=http.createServer(app);

var moduloEmail=require("./server/email2.js");
var io=require("socket.io");
var modelo=require("./server/modelo.js");
//var cf=require("./server/cifrado.js");

var fm=new modelo.JuegoFM("./server/coordenadas.json");
var juego=fm.makeJuego();


app.set('port', (process.env.PORT || 5000));

var persistencia=require("./server/persistencia.js");

app.use(exp.static(__dirname +"/client"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');

app.get("/",function(request,response){     
	var contenido=fs.readFileSync("./index.html");    
	response.setHeader("Content-type","text/html");
	response.send(contenido);    
});

app.get('/comprobarUsuario/:id',function(request,response){
    var id=request.params.id;
    var usuario=juego.obtenerUsuario(id);
    var json={'nivel':-1};
    if (usuario){        
        json={'nivel':usuario.nivel};
    }
    response.send(json);
});

app.post("/login",function(request,response){
    var email=request.body.email;
    var pass=request.body.password;    
    if (!pass){
        pass="";
    }
    juego.iniciarSesion(email,pass,function(usr){
        response.send(usr);
    });        
});

app.post("/signup",function(request,response){
    var email=request.body.email;
    var pass=request.body.password;    
    if (!pass){
        pass="";
    }
    juego.registrarUsuario(email,pass,function(usr){
        response.send(usr);
    });
});

app.get('/enviarClave/:email',function(request,response){
    var email=request.params.email;

    juego.reiniciarClaveYEnviar(email,function(result){
        response.send(result);
    });
});

app.get('/volverAEnviarMail/:email',function(request,response){
    var email=request.params.email;
    juego.volverAEnviarMail(email,function(respuesta){
        response.send(respuesta);
    });
});

app.get("/confirmarUsuario/:email/:key",function(request,response){
    var key=request.params.key;
    var email=request.params.email;
    var usuario;

    juego.confirmarUsuario(email,key,function(usr){
        if (!usr){
            console.log("El usuario no existe o la cuenta ya está activada");
            response.send("<h1>La cuenta ya esta activada</h1>");
        }
        else{
            response.redirect("/");
        }
    });
});

app.get("/obtenerKeyUsuario/:email/:adminKey",function(request,response){
    var adminKey=request.params.adminKey;
    var email=request.params.email;
    var usuario;

    juego.obtenerKeyUsuario(email,adminKey,function(result){
        response.send(result)
    });
});

app.get("/cambiarClave/:email/:key",function(request,response){
    var key=request.params.key;
    var email=request.params.email;
    var usuario;
    juego.cambiarClave(email,key,function(usr){
        if (!usr){
            console.log("El usuario no existe o la cuenta ya está activada");
            response.send("<h1>La cuenta ya esta activada</h1>");
        }
        else{
            response.redirect("/");
        }
    });
});

app.get('/pedirNivel/:uid',function(request,response){
    var uid=request.params.uid;
    var usuario=juego.obtenerUsuario(uid);
    var json={'nivel':-1};
    if (usuario && usuario.nivel<juego.niveles.length){
        response.send(juego.niveles[usuario.nivel]);
    }
    else{
        response.send(json);   
    }
});

app.get('/volverAJugar/:uid',function(request,response){
    var uid=request.params.uid;
    var usuario=juego.obtenerUsuario(uid);
    var json={'nivel':-1};
    if (usuario){
        usuario.volverAJugar(function(result){
            response.send(result);
        });
    }
});

app.get('/nivelCompletado/:id/:tiempo',function(request,response){
    var id=request.params.id;
    var tiempo=request.params.tiempo;
    var usuario=juego.obtenerUsuario(id);
    var fecha=Date.now();
    if (usuario)
    {
        socket.emit('nueva',{"texto":usuario.email+", nivel: "+usuario.nivel+", tiempo: "+tiempo});
        usuario.nivelCompletado(tiempo,fecha,function(nivel){
            response.send(nivel);
        });
    }
    else{
        response.send({'nivel':-1});
    }
});

app.get("/obtenerResultados/:uid",function(request,response){
    var usr=juego.obtenerUsuario(request.params.uid);
    if (usr){
        juego.obtenerResultados(function(result){
            response.send(result);
        });
    }
    else{
        response.send({'resultados':[]});
    }
});

app.get("/obtenerUid/:email/:key",function(request,response){
    var email=request.params.email;
    var key=request.params.key;
    juego.obtenerUid(email,key,function(result){
        response.send(result)
    });
});

app.delete("/eliminarUsuario/:uid",function(request,response){
    var uid=request.params.uid;
    //var json={'resultados':-1};
    //if (ObjectID.isValid(uid))
    //{
    juego.eliminarUsuario(uid,function(result){
        response.send(result);
    });
    //}
    //else{
    //    response.send(json);
    //}    
});

app.put("/actualizarUsuario",function(request,response){
    var uid=request.body.uid;
    var usu=juego.obtenerUsuario(uid);
    if (usu){
        usu.actualizar(request.body,function(result){
            response.send(result);
        });
    }
    else{
        response.send({'email':undefined});
    }
});

server.listen(app.get('port'),function(){
    console.log('Node app se está ejecutando en puerto',app.get('port'));
});


var socket=io.listen(server);
socket.on('connection',function(client){
    client.on('listo',function(data){
        console.log('Cliente preparado');
    })
})

persistencia.conectar();

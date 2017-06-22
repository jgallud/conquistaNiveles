var mongo=require("mongodb").MongoClient;
var ObjectID=require("mongodb").ObjectID;
var url="http://url-proyect/";


function Persistencia(){
    this.usuariosCol=undefined;
    this.resultadosCol=undefined;
    this.limboCol=undefined;

    this.encontrarUsuario=function(email,pass,callback){
        encontrar(this.usuariosCol,{email:email,password:pass},callback);
    };

    this.encontrarUsuarioCriterio=function(criterio,callback){
        encontrar(this.usuariosCol,criterio,callback);
    };

    this.encontrarResultadosCriterio=function(criterio,callback){
        encontrar(this.resultadosCol,criterio,callback);
    };

    this.encontrarTodosResultados=function(callback){
        encontrarTodos(this.resultadosCol,callback);
    };

    this.encontrarLimbo=function(email,callback){
        encontrar(this.limboCol,{email:email},callback);
    };

    this.confirmarCuenta=function(email,key,callback){
        encontrar(this.limboCol,{email:email,key:key},callback);
    };

    function encontrar(coleccion,criterio,callback){
        coleccion.find(criterio).toArray(function(error,usr){
            if (usr.length==0){
                callback(undefined);
                //response.send({'email':''});
            }
            else{
                callback(usr[0]);
                //juego.agregarUsuario(usr[0]);
                //response.send(usr[0]);
            }
        });
    };

    function encontrarTodos(coleccion,callback){
        coleccion.find().toArray(function(error,usr){
            callback(usr);
        });
    };

    this.modificarColeccionLimbo=function(usr,callback){
        modificarColeccion(this.limboCol,usr,callback);
    }

    this.modificarColeccionUsuarios=function(usr,callback){
        modificarColeccion(this.usuariosCol,usr,callback);
    }

    this.modificarColeccionResultados=function(resu,callback){
        modificarColeccion(this.resultadosCol,resu,callback);
    }


    function modificarColeccion(coleccion,usr,callback){
        coleccion.findAndModify({_id:ObjectID(usr._id)},{},usr,{},function(err,result){
            if (err){
                console.log("No se pudo actualizar (método genérico)");
            }
            else{     
                console.log("Usuario actualizado"); 
            }
            callback(result);
        });
    }

    //module.exports.modificarColeccion=modificarColeccion;

    this.insertarUsuarioLimbo=function(usu,callback){
        insertarUsuario(this.limboCol,usu,callback);
    }

    this.insertarUsuarioUsuarios=function(usu,callback){
        insertarUsuario(this.usuariosCol,usu,callback);
    }

    this.insertarResultado=function(resu,callback){
        insertarUsuario(this.resultadosCol,resu,callback);
    }

    function insertarUsuario(coleccion,usu,callback){
        coleccion.insert(usu,function(err,result){
            if(err){
                console.log("error");
            }
            else{
                console.log("Nuevo usuario creado: "+usu.nombre);
                callback(usu);
                /*
                juego.agregarUsuario(usu);
                //response.send("<h1>Conquista Niveles: Cuenta confirmada</h1>");                
                response.redirect("/");
                */
            }
        });
    }

    //module.exports.insertarUsuario=insertarUsuario;

    this.eliminarUsuario=function(uid,callback){
        eliminar(this.usuariosCol,{_id:ObjectID(uid)},callback);
    }

    this.eliminarLimbo=function(uid,callback){
        eliminar(this.limboCol,{_id:ObjectID(uid)},callback);
    }

    function eliminar(coleccion,criterio,callback){
        coleccion.remove(criterio,function(err,result){
                //console.log(result);
            if(!err){
                callback(result);
            }
        });
    }

//module.exports.eliminar=eliminar;

    this.conectar=function(callback){
        var pers=this;
        mongo.connect("mongodb://user:key@url:port/usuarioscn", function(err, db) {        
            if (err){
                console.log("No pudo conectar a la base de datos")
            }
            else{
                console.log("conectado a Mongo: usuarioscn");
                db.collection("usuarios",function(err,col){
                    if (err){
                        console.log("No pude obtener la coleccion")
                    }
                    else{       
                        console.log("tenemos la colección usuarios");
                        //juego.iniUsuarios(col);
                        pers.usuariosCol=col;   
                    }
                    //db.close();
                });
                db.collection("resultados",function(err,col){
                    if (err){
                        console.log("No pude obtener la coleccion resultados")
                    }
                    else{       
                        console.log("tenemos la colección resultados");
                        //juego.iniUsuarios(col);
                        pers.resultadosCol=col;   
                    }
                });
                db.collection("limbo",function(err,col){
                    if (err){
                        console.log("No pude obtener la coleccion")
                    }
                    else{       
                        console.log("tenemos la colección limbo");
                        //juego.iniUsuarios(col);
                        pers.limboCol=col;   
                    }
                    //db.close();
                });
                callback(db);
            }
        });
    }

}

module.exports.Persistencia=Persistencia;
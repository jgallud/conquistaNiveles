var _ = require("underscore");
var fs=require("fs");
var ObjectID=require("mongodb").ObjectID;
var persistencia=require("./persistencia.js");
var moduloEmail=require("./email2.js");
var cf=require("./cifrado.js");

function Juego(){
	this.nombre="Niveles";
	this.niveles=[];
	this.usuarios=[];
	this.resultados=[];
	this.agregarNivel=function(nivel){
		this.niveles.push(nivel);
	}
	this.agregarUsuario=function(usuario){
		var usu=_.find(this.usuarios,function(usu){
			return usu._id==usuario._id
			});
		if (usu==undefined){
			this.usuarios.push(usuario);
		}
	}
	this.obtenerUsuario=function(id){
		return _.find(this.usuarios,function(usu){
			return usu._id==id
		});
	}
	this.agregarResultado=function(resultado){
		this.resultados.push(resultado);
	}
	this.iniUsuarios=function(col){
		col.forEach(function(item){
			this.agregarUsuario(item);
		})
	}
	this.obtenerUid=function(email){
		return _.find(this.usuarios,function(usu){
			return usu.email==email
		});
	}
	this.iniciarSesion=function(email,pass,callback){
		var ju=this;
		var passCifrada=cf.encrypt(pass);
	    persistencia.encontrarUsuario(email,passCifrada,function(usr){
	    if (!usr){
            callback({'email':''});
        }
        else{
        	var usuario=new Usuario(usr.email,usr.password);
        	usuario.nivel=usr.nivel;
        	usuario._id=usr._id;
        	usuario.maxNiveles=ju.niveles.length;
            ju.agregarUsuario(usuario);
            callback(usuario);
        }
	    });
	}
	this.registrarUsuario=function(email,pass,callback){
		var ju=this;
		var passCifrada=cf.encrypt(pass);
		persistencia.encontrarLimbo(email,function(usr){
			if(!usr){
	            usu=new Usuario(email,passCifrada);//fm.makeUsuario(email,cf.encrypt(request.body.password));
	            //usu.maxNiveles=ju.niveles.length;
	            persistencia.insertarUsuarioLimbo(usu,function(usu){
	                callback({email:'ok'});
	                moduloEmail.enviarEmail(usu.email,usu.key,"Confirme su correo en este enlace: ");
	            });
	        }
	        else{
	        	callback({email:undefined});
	        }
    	});
	}
	this.confirmarUsuario=function(email,key,callback){
		persistencia.confirmarCuenta(email,key,function(usr){
        if (!usr){
            //console.log("El usuario no existe");
            //response.send("<h1>La cuenta ya esta activada</h1>");
            callback(undefined);
        }
        else{
        	persistencia.insertarUsuarioUsuarios(usr,function(usu){
                //response.redirect("/");
                usr.key="";
                callback(usu);
                persistencia.modificarColeccionLimbo(usr,function(result){});
            });
        }
    });
	}
	this.obtenerResultados=function(callback){
		persistencia.encontrarTodosResultados(function(result){
             //json=result;
             //res.send(json);
             callback(result);
        });
	}
	this.reiniciarClaveYEnviar=function(email,callback){
		var key=(new Date().valueOf()).toString();
		persistencia.encontrarLimbo(email,function(usr){
         if (!usr){
            console.log("El usuario no existe");
            //response.send({email:''});
            callback({email:''});
         }
         else{      
            //response.send({email:'ok'});
            callback({email:'ok'});
            moduloEmail.enviarEmailResetPassword(usr.email,key,"Al hacer click en este enlace, se borrará su clave. Al entrar debe crear una nueva.");
            usr.key=key;
            persistencia.modificarColeccionLimbo(usr,function(result){});
        }
    });
	}
	this.volverAEnviarMail=function(email,callback){
		persistencia.encontrarLimbo(email,function(usr){
	     if (!usr){
	            console.log("El usuario no existe");
	            //response.send({email:''});
	            callback({email:''})
	         }
	         else{      
	            //response.send({email:'ok'});
	            callback({email:'ok'});
	            moduloEmail.enviarEmail(usr.email,usr.key,"Confirme el correo haciendo click en este enlace.");
	        }
	    });
	}
	this.cambiarClave=function(email,key,callback){
		persistencia.confirmarCuenta(email,key,function(usr){
	        if (!usr){
	            //console.log("El usuario no existe");
	            //response.send("<h1>La cuenta ya esta activada</h1>");
	            callback(undefined);
	        }
	        else{
	            usr.key="";
	            usr.password="";
	            persistencia.modificarColeccionLimbo(usr,function(result){});
	            persistencia.modificarColeccionUsuarios(usr,function(result){});
	           //response.redirect("/");
	           callback(usr);
	        }
	    });
	}
	this.eliminarUsuario=function(uid,callback){
		var json={'resultados':-1};
		if (ObjectID.isValid(uid)){
			persistencia.eliminarUsuario(uid,function(result){
	            if (result.result.n==0){
	                console.log("No se pudo eliminar de usuarios");
	            }
	            else{
	                json={"resultados":1};
	                console.log("Usuario eliminado de usuarios");
	            }
	            persistencia.eliminarLimbo(uid,function(result){
	                if (result.result.n==0){
	                    console.log("No se pudo eliminar del limbo");
	                }
	                else{
	                    json={"resultados":1};
	                    console.log("Usuario eliminado del limbo");
	                }
	                //response.send(json);
	                callback(json);
	            });
	        }); 
		}
	    else{
	    	callback(json);
	    }
	}
	this.obtenerKeyUsuario=function(email,adminKey,callback){
		if (adminKey=="cLaVeRooT")
	    {
	        persistencia.encontrarLimbo(email,function(usr){
	            if (!usr){
	                callback({key:""});
	            }
	            else{
	                callback({key:usr.key});
	            }
	        });
	    }
	    else
	    {
	        callback({key:""});
	    }
	}
	this.obtenerUid=function(email,key,callback){		    
		var json={uid:-1};
	    persistencia.confirmarCuenta(email,key,function(usr){
	        if (usr){
	            json={uid:usr._id};
	        }           
	        callback(json);
	    });
	}
}


function JuegoFM(archivo){
	this.juego=new Juego();
	this.array=leerCoordenadas(archivo);

	this.makeJuego=function(){		
		var indi=0;
		var juego=this.juego;
		this.array.forEach(function(ele){
			//console.log(ele.gravedad);
			//console.log(ele.coord);
			var nivel=new Nivel(indi,ele.coord,ele.gravedad);
			juego.agregarNivel(nivel);
			indi++;
		});
		return juego;
	}
	this.makeUsuario=function(email,pass){
		var usu=new Usuario(email,pass);
		return usu;
	}
}

function leerCoordenadas(archivo){
	var array=JSON.parse(fs.readFileSync(archivo));
	//console.log(array);
	return array;
}

function Point(x,y){
	this.x=x;
	this.y=y;
}

function Nivel(num,coord,gravedad){
	this.nivel=num;
	this.coordenadas=coord;
	this.gravedad=gravedad;
}

function Usuario(email,pass){
	this.key=(new Date().valueOf()).toString();
	this.nombre=email.match(/^([^@]*)@/)[1];//email;
	this.nivel=0;
	this.email=email;
	this.password=pass;
	this._id=undefined;
	this.maxNiveles=undefined;
	this.nivelCompletado=function(tiempo,fecha,callback){
		//agregarResultado(new modelo.Resultado(usuario.nombre,usuario.email,usuario.nivel,tiempo,Date.now()));
		this.agregarResultado(new Resultado(this.nombre,this.email,this.nivel,tiempo,fecha));
        //socket.emit('nueva',{"texto":usuario.email+", nivel: "+usuario.nivel+", tiempo: "+tiempo});
        this.nivel=this.nivel+1;
        var usu=this;
        persistencia.modificarColeccionUsuarios(usu,function(result){
            if (!result){
                console.log("No se pudo actualizar (nivel completado)");            
                //response.send({'nivel':-1});
                callback({'nivel':-1});
            }
            else{            
                persistencia.encontrarUsuarioCriterio({_id:usu._id},function(usr){
                    //response.send({'nivel':usr.nivel,'max':juego.niveles.length});
                    callback({'nivel':usr.nivel,'max':usr.maxNiveles})
                });
            }
        });
	}
	this.agregarResultado=function(res){
	     persistencia.encontrarResultadosCriterio({email:res.email,nivel:res.nivel},function(usr){
	        if (!usr){
	            //resultadosCol.insert(res,function(err){
	            persistencia.insertarResultado(res,function(err){
	                if(err){
	                    console.log("error");
	                }
	                else{
	                    console.log("Nuevo resultado creado");            
	                }   
	            });
	        }
	        else{
	            //persistencia.modificarColeccion(resultadosCol,{email:usr.email,nivel:usr.nivel,tiempo:{$gt:res.tiempo}},function(result){
	            persistencia.modificarColeccionResultados({email:usr.email,nivel:usr.nivel,tiempo:{$gt:res.tiempo}},function(result){    
	                if (!result){
	                   console.log("No se pudo actualizar (resultados)");            
	                }
	                else{
	                    console.log("resultado modificado");
	                }
	            })
	        }
	    });
	}
	this.volverAJugar=function(callback){
		this.nivel=0;     
		var usuario=this;   
        persistencia.modificarColeccionUsuarios(usuario,function(result){
            //console.log(result);
            if (!result){
                //console.log("No se pudo actualizar (volver a jugar)");            
                callback({'nivel':-1});
            }
            else{            
                //persistencia.encontrarUsuarioCriterio({_id:usuario._id},function(usr){
                callback(usuario);
                //});
            }
        });
	}
	this.actualizar=function(nuevo,callback){
		this.comprobarCambios(nuevo);
		var usu=this;
         persistencia.modificarColeccionUsuarios(usu,function(result){
            if (!result){
                console.log("No se pudo actualizar (actualizar usuario)");
                //response.send(json);
                callback({'email':undefined});
            }
            else{            
                //persistencia.encontrar(usuariosCol,{_id:ObjectID(uid)},function(usr){
                //    if (usr){
                //        json=usr;       
                //    }
                console.log("Usuario modificado");
                callback(usu);
                //    response.send(json);
                //});
            }
        });
	}
	this.comprobarCambios=function(nuevo){
     	if(nuevo.email!=this.email && nuevo.email!=""){
             this.email=nuevo.email;
	     }    
	     var newpass=cf.encrypt(nuevo.newpass);
	     if (nuevo.newpass!=undefined && newpass!=this.password && nuevo.newpass!=""){
	         this.password=newpass;
	     }
	     if (nuevo.nombre!=undefined && nuevo.nombre!=this.nombre && nuevo.nombre!="")
	     {
	         this.nombre=nuevo.nombre;
	     }
	}
}


function Resultado(nombre,email,nivel,tiempo,fecha){
	this.nombre=nombre;
	this.nivel=nivel;
	this.tiempo=tiempo;
	this.email=email;
	this.fecha=fecha;
}

module.exports.JuegoFM=JuegoFM;
module.exports.Juego=Juego;
module.exports.Usuario=Usuario;
module.exports.Resultado=Resultado;
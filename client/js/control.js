var url="http://127.0.0.1:5000/";

var nombre;
var nivel=-1;
var game;
var socket=io(url);


function comprobarUsuario(){
  eliminarCabeceras();
  //if ($.cookie("uid")!=undefined)
  if($.cookie("usr")!=undefined)
  {
    srvComprobarUsuario();
  }
  else{
    mostrarNavLogin();
    //mostrarIntro();
    mostrarLogin();
  }
 }

function mostrarNavLogout(){
  var strLogout='<li><a href="#" onclick="mostrarActualizarEliminar();"><span class="glyphicon glyphicon-user"></span> Modificar perfil</a></li>';
  strLogout = strLogout + '<li><a href="#" onclick="reset();"><span class="glyphicon glyphicon-log-out"></span> Salir</a></li>';

  $('#inicio li').remove();
  $('#inicio').append(strLogout);
}

function mostrarNavLogin(){
  var strLogin='<li><a href="#" onclick="mostrarRegistro();"><span class="glyphicon glyphicon-user-add"></span> Registrar usuario</a></li>';
  strLogin=strLogin+'<li><a href="#" onclick="mostrarLogin();"><span class="glyphicon glyphicon-log-in"></span> Iniciar sesión</a></li>';

  $('#inicio li').remove();
  $('#inicio').append(strLogin);
}

function mostrarIntro(){
  var cadena='<h3>Conquista Niveles</h3>';
  $('#intro').append(cadena);
}

function mostrarLogin(){
  //borrarLogin();
  limpiar();
  //mostrarIntro();
  var cadena='<div class="container" id="login"><div class="mainbox col-md-6 col-md-offset-3">';
  cadena=cadena+'<h2 id="cabeceraP">Inicio de sesión</h2><div id="ig1" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email" type="text" class="form-control" name="email" placeholder="Escribe tu email"></div>';
  cadena=cadena+'<div id="ig2" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>';
  cadena=cadena+'<input id="clave" type="password" class="form-control" name="password" placeholder="Escribe tu clave"></div></div></div>';

  //$('#control').append('<p id="login"><h2 id="cabeceraP">Inicio de sesión</h2><input type="email" id="email" class="form-control" placeholder="introduce tu email" required><input type="password" id="clave" class="form-control" placeholder="introduce tu clave" required></p>');
  $('#home').append(cadena);
  $('#home').append('<p id="nombreBtn"><button type="button" id="nombreBtn" class="btn btn-primary btn-md">Iniciar partida</button></p><a href="#" id="refRecordar">Recordar clave</a>');//' <a href="#" id="refRegistro" onclick="mostrarRegistro();">Registrar usuario</a>');
  $('#home').append('<h4 id="info"><span class="label label-warning"></span></h4>');
  $('#email').blur(function() {
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    if (testEmail.test(this.value) ) 
    {
      $('#nombreBtn').on('click',function(){
        var nombre=$('#email').val();
        var clave=$('#clave').val();
        //$('#nombre').remove();
        $('#login').remove();
        $('#nombreBtn').remove();   
        loginUsuario(nombre,clave);
      });
      $('#refRecordar').on('click',function(){
        var nombre=$('#email').val();        
        enviarClave(nombre);
      });
    }
    else {
      mostrarAviso("Debe ser una dirección de email");
      //$("#info span").text("Debe ser una dirección de email");
      //alert('failed');
    }
  });
}

function mostrarRegistro(){
  //borrarLogin();
  limpiar();

//  $('#home').append('<p id="cabecera"><h2 id="cabeceraP">Registro de usuarios</h2><input type="email" id="email" class="form-control" placeholder="introduce tu email"><input type="password" id="clave" class="form-control" placeholder="introduce tu clave"></p>');
var cadena='<div class="container" id="login"><div class="mainbox col-md-6 col-md-offset-3">';
  cadena=cadena+'<h2 id="cabeceraP">Nuevo usuario</h2><div id="ig1" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email" type="text" class="form-control" name="email" placeholder="Escribe tu email"></div>';
  cadena=cadena+'<div id="ig12" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email2" type="text" class="form-control" name="email" placeholder="Repite el email"></div>';
  cadena=cadena+'<div id="ig2" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>';
  cadena=cadena+'<input id="clave" type="password" class="form-control" placeholder="Escribe tu clave"></div></div></div>';

  //$('#control').append('<p id="login"><h2 id="cabeceraP">Inicio de sesión</h2><input type="email" id="email" class="form-control" placeholder="introduce tu email" required><input type="password" id="clave" class="form-control" placeholder="introduce tu clave" required></p>');
  $('#home').append(cadena);
 
  $('#home').append('<button type="button" id="nombreBtn" class="btn btn-primary btn-md">Registrar usuario</button>');
  $('#home').append('<h4 id="info"><span class="label label-warning"></span></h4>');
  $('#email2').blur(function() {
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    var nombre=$('#email').val();
    var nombre2=$('#email2').val();
    if (testEmail.test(this.value)&&comprobarEmail(nombre,nombre2)) 
    {
        $('#nombreBtn').on('click',function(){  
          var clave=$('#clave').val();      
          $('#nombre').remove();
          $('#nombreBtn').remove();   
          registroUsuario(nombre,clave);
        });
    }
    else {
      mostrarAviso("Debe ser una dirección de email o las direcciones no coinciden");
      //$("#info span").text("Debe ser una dirección de email");
      //alert('failed');
    }
  });
}

function comprobarEmail(cad1,cad2){
  if (cad1==cad2){
    return true;
  }
  else{
    return false;
  }
}

function mostrarSolicitarReenvioMail(){
  $('#reenvio').remove();
  $('#home').append('<button type="button" id="reenvio" class="btn btn-primary btn-md">Reenviar email</button>');
  $('#email').blur(function() {
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    if (testEmail.test(this.value)) 
    {
        $('#reenvio').on('click',function(){
        var nombre=$('#email').val();
        //var clave=$('#clave').val();
        //$('#nombre').remove();
        //$('#nombreBtn').remove();   
        //registroUsuario(nombre,clave);
        reenviarMail(nombre);
      });
    }
    else {
      mostrarAviso("Debe ser una dirección de email");
      //$("#info span").text("Debe ser una dirección de email");
      //alert('failed');
    }
  });
}

function mostrarAviso(cadena){
  $("#info span").text(cadena);
}

function mostrarActualizarEliminar(){
  //borrarLogin();
  limpiar();
  var uid;
  if ($.cookie("usr")!=undefined){
    var usr=JSON.parse($.cookie("usr"));
    uid=usr._id;
  }
  //if ($.cookie('uid')!=undefined)
  if(uid!=undefined)
  {
    $('#control').append('<p id="cabecera"><h2 id="cabeceraP">Actualizar datos usuario</h2><input type="text" id="email" class="form-control" placeholder="Email: '+usr.email+'"><input type="text" id="nombre" class="form-control" placeholder="Nombre: '+usr.nombre+'"><input type="password" id="newpass" class="form-control" placeholder="introduce tu nueva clave"></p>');
    $('#control').append('<button type="button" id="actualizarBtn" class="btn btn-primary btn-md">Actualizar usuario</button> <button type="button" id="eliminarBtn" class="btn btn-danger btn-md">Eliminar usuario</button>');
    $('#actualizarBtn').on('click',function(){
      var email=$('#email').val();
      var nombre=$('#nombre').val();
      var newpass=$('#newpass').val();
      $('#actualizarBtn').remove();   
      actualizarUsuario(email,nombre,newpass);
    });
    $('#eliminarBtn').on('click',function(){
      var nombre=$('#email').val();
      //var clave=$('#clave').val();
      $('#nombre').remove();
      $('#eliminarBtn').remove();   
      eliminarUsuario(nombre);
    });
  }
  else{
    mostrarLogin();
  }
}

/*
function borrarLogin(){
  $('#login .glyphicon').remove();
  $('#login').remove();
  $('#email').remove();
  $('#clave').remove();
  $('#nombreBtn').remove();
  $('#cabeceraP').remove();
}
*/

function limpiar(){
  $('#ig1').remove();
  $('#ig12').remove();
  $('#ig2').remove();
  $('#login').remove();
  $('#email').remove();
  $('#clave').remove();
  $('#nombreBtn').remove();
  $('#datos').remove();
  $('#cabeceraP').remove();
  $('#cabecera').remove();
  $('#prog').remove();
  $('#cabecera').remove();
  $('#enh').remove();
  $('#siguienteBtn').remove();
  $('#actualizarBtn').remove();
  $('#eliminarBtn').remove();
  $('#refRegistro').remove();
  $('#nombre').remove();
  $('#newpass').remove();
  $('#tabla').remove();
  $('#tabla_wrapper').remove();
  $('#info').remove();
  $('#panel').remove();
  $('#reenvio').remove();
  $('#refRecordar').remove();
  //$('#res').remove();
  //$('#resultados').remove();
  $('#datos2').remove();
  $('#tab').remove();
}

function mostrarInfoJugador(){
  var usr=JSON.parse($.cookie("usr"));
  var email= usr.email;//$.cookie("email");
  var id=usr._id;//$.cookie("uid");
  var nivel=usr.nivel;//$.cookie("nivel");
  var nombre=usr.nombre;//$.cookie("nombre");
  var max=1000;

  mostrarNavLogout();
  if ($.cookie("max")!=undefined)
  {
    max=parseInt($.cookie("max"));
  }
  var percen=Math.floor((nivel/max)*100);
  limpiar();
  //borrarLogin();
  $('p').remove();
  var cadena='<div id="cabecera" class="panel panel-default"><div class="panel-heading"><h3>Información del juego</h3></div>';
  cadena=cadena+'<div id="datos" class="panel-body"><p id="datos2"><strong>Email:</strong> '+email+'</p><p id="datos2"><strong>Nombre:</strong> '+nombre+'</p><p id="datos2"><strong>Nivel:</strong> '+nivel+' </p><p id="datos2"><strong>Progreso:</strong> '+percen+'% completado</p></div></div>';
  $('#control').append(cadena);
 // $('#control').append('<div id="cabecera" class="panel panel-default"><div class="panel-heading"><h3>Panel de Control</h3></div>');
  //$('#control').append('<div id="datos" class="panel-body"><h4><p>Email: '+email+'</p><p>Nombre: '+nombre+'</p><p>Nivel: '+nivel+' </p><p>'+percen+'% completado</p></h4></div></div>');
  //$('#control').append('<div id="prog" class="progress-bar" aria-valuemin="0" aria-valuemax="100" style="width:'+percen+'%">'+percen+'%</div></div></div>');
  siguienteNivel();
  mostrarPanel();
  obtenerResultados();
}

function mostrarPanel(){
  $('#panel').remove();
  var cadena="<div id='panel' class='panel panel-default'>";
  cadena=cadena+"<div class='panel-heading'><h4>Últimos logros de otros jugadores</h4></div>";
  cadena=cadena+"<div class='panel-body' id='noticias'></div></div>";
  $('#control').append(cadena);
}

socket.on('nueva',function(datos){
    $('#noticias').text(datos.texto);
})


function siguienteNivel(){
  var usr=JSON.parse($.cookie("usr"));
  $('#control').append('<p><button type="button" id="siguienteBtn" class="btn btn-primary btn-block">Siguiente nivel</button></p>')
  $('#siguienteBtn').on('click',function(){
    $('#siguienteBtn').remove();
    $('#enh').remove();
    $('#res').remove();
    $('#resultados').remove();
    $('#tab').remove();
    if ($('#juegoId').length==0){
      $('#canvas').append('<div id="juegoId"></div>');
    }
    //crearNivel($.cookie('nivel'));
    pedirNivel(usr.nivel);
  });
}

function eliminarResultados(){
  $('#res').remove();
  $('#resultados').remove();
}

function mostrarResultados(datos){
  eliminarGame();
  $('#juegoId').remove();
  //$('#res').remove();
  //$('#resultados').remove();
  $('#tab').remove();

  //var cadena="<div class='panel panel-default' id='res'><div class='panel-heading'><h4>Resultados</h4></div>";
  //cadena=cadena+"<div class='panel-body'>";
  
  var cadena='<div id="tab" class="container-fluid"><h3>Resultados</h3><ul class="nav nav-tabs">';
  cadena=cadena+'<li class="active"><a href="#resultados" data-toggle="tab">Todos</a></li>'
  cadena=cadena+'<li><a href="#mislogros" data-toggle="tab">Mis logros</a></li>'
  cadena=cadena+'<li><a href="#losmejores" data-toggle="tab">Los mejores</a></li></ul>'
  cadena=cadena+'<div class="tab-content">';
  cadena=cadena+"<div class='tab-pane active' id='resultados'>";
  cadena=cadena+obtenerTodos(datos);
  cadena=cadena+'</div>';
  cadena=cadena+"<div class='tab-pane' id='mislogros'>";
  cadena=cadena+obtenerMisLogros(datos);
  cadena=cadena+'</div>';
  cadena=cadena+"<div class='tab-pane' id='losmejores'>";
  cadena=cadena+obtenerLosMejores(datos);
  cadena=cadena+'</div>';
  cadena=cadena+'</div><div class="paging-container" id="demo"> </div>';
  cadena=cadena+'</div>';
  $('#canvas').append(cadena); 
  mostrarControlPaginas(datos.length);
}

function mostrarControlPaginas(max){
  Pagination('#demo',{
          itemsCount: max,
          pageSize: 10,
          onPageSizeChange: function (ps) {
            console.log('changed to ' + ps);
          },
          onPageChange: function (paging) {
            //custom paging logic here
            //console.log(paging);
            var start = paging.pageSize * (paging.currentPage - 1),
              end = start + paging.pageSize,
              $rows = $('#table').find('.data');

            $rows.hide();

            for (var i = start; i < end; i++) {
              $rows.eq(i).show();
            }
          }
        });
}

function obtenerTodos(datos){
  var cadena="<table id='table' class='table table-bordered table-condensed table-striped'><thead><tr><th>Nombre</th><th>Fecha</th><th>Nivel</th><th>Tiempo</th></tr></thead>";
  cadena=cadena+'<tbody>';
  for(var i=0;i<datos.length;i++){
      var fecha=new Date(datos[i].fecha);
      var strFecha=fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear()+'  '+fecha.getHours()+':'+fecha.getMinutes();
      cadena=cadena+"<tr class='data'><td>"+datos[i].nombre+"</td><td>"+strFecha+"</td><td> "+datos[i].nivel+"</td>"+"</td><td> "+datos[i].tiempo+"</td></tr>";      
    }
    cadena=cadena+"</tbody></table>";
  return cadena;
}

function obtenerMisLogros(datos){
  var usr=JSON.parse($.cookie("usr"));
  var miEmail=usr.email;
  misDatos=_.sortBy(_.filter(datos,function(each){
    return each.email==miEmail
  }),'nivel');  
  var cadena="<table class='table table-bordered table-condensed table-striped'><tr><th>Nombre</th><th>Fecha</th><th>Nivel</th><th>Tiempo</th></tr>";
  for(var i=0;i<misDatos.length;i++){ 
      var fecha=new Date(misDatos[i].fecha);
      var strFecha=fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear()+'  '+fecha.getHours()+':'+fecha.getMinutes();
      cadena=cadena+"<tr><td>"+misDatos[i].nombre+"</td><td>"+strFecha+"</td><td> "+misDatos[i].nivel+"</td>"+"</td><td> "+misDatos[i].tiempo+"</td></tr>";      
    }
    cadena=cadena+"</table>";
  return cadena;
}

function obtenerLosMejores(datos){
  var usr=JSON.parse($.cookie("usr"));
  var miEmail=usr.email;
  var max=3;
  var nuevaCol=[];
  if ($.cookie("max")!=undefined)
  {
    max=parseInt($.cookie("max"));
  }
  
  for(var i=0;i<max;i++){
    nuevaCol.push(_.min(_.filter(datos,function(each){
      return each.nivel==i;
    }),function(ele){
      return ele.tiempo;
    }))
  }
  var cadena="<table class='table table-bordered table-condensed table-striped'><tr><th>Nombre</th><th>Fecha</th><th>Nivel</th><th>Tiempo</th></tr>";
  for(var i=0;i<nuevaCol.length;i++){ 
      var fecha=new Date(nuevaCol[i].fecha);
      var strFecha=fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear()+'  '+fecha.getHours()+':'+fecha.getMinutes();
      cadena=cadena+"<tr><td>"+nuevaCol[i].nombre+"</td><td>"+strFecha+"</td><td> "+nuevaCol[i].nivel+"</td>"+"</td><td> "+nuevaCol[i].tiempo+"</td></tr>";      
    }
    cadena=cadena+"</table>";
  return cadena;
}

function noHayNiveles(){
  //$("#juegoId").remove();
  $('#reset').remove();
  $('#control').append('<p id="reset"><button id="reset" type="button" class="btn btn-primary btn-lg">Volver a jugar</button></p>');
  $('#reset').on("click",function(){
      //$('#reset').remove();
      //$('#canvas').append('<div id="juegoId"></div>');
      //reset();
      volverAJugar();
     });
}

function eliminarCabeceras(){
  $('#resultados').remove();
  $('#res').remove();
  $('#cabecera').remove();
  $('#nombre').remove();
  $('#crear').remove();
  $('#nivel').remove();
  $('#help').remove();  
  $('#reset').remove();
  $('#siguienteBtn').remove();
  $('#juegoId').remove();
  eliminarGame();
}

function reset(){
  eliminarCabeceras();
  eliminarCookies();
  eliminarGame();
  mostrarNavLogin();
  //iniciar();
  comprobarUsuario();
}

function eliminarGame(){
  if (game && game.state!=null) {
    game.destroy();
    //game=undefined;
  }
}

function eliminarCookies(){
  /*
  $.removeCookie("uid");
  $.removeCookie("email");
  $.removeCookie("nivel");
  $.cookie('nombre');
  */
  $.removeCookie("usr");
  $.removeCookie("max");
}

function nivelCompletado(tiempo){
  //game.destroy();
  //game.destroy();
  eliminarGame();
  $('#juegoId').append("<h2 id='enh'>Enhorabuena!</h2>");
  comunicarNivelCompletado(tiempo);
}


//Comunicaciones

function srvComprobarUsuario(){
  var usr=JSON.parse($.cookie("usr"));
  var id=usr._id;//$.cookie("uid");

  $.getJSON('/comprobarUsuario/'+id,function(datos){
    if (datos.nivel<0){
      eliminarCookies();
      //mostrarCabecera();
      mostrarLogin();
    }
    else{
      //$.cookie("nivel",datos.nivel);
      usr.nivel=datos.nivel;
      $.cookie("usr",JSON.stringify(usr));
      mostrarInfoJugador();
    }
  });
}

function loginUsuario(nombre,clave){
  //var id=$.cookie("id");

  $.ajax({
    type:'POST',
    url:'/login/',
    data:JSON.stringify({email:nombre,password:clave}),
    success:function(data){
      if (data.email==""){
        //mostrarRegistro();
        mostrarLogin();
        mostrarAviso("Usuario o clave incorrectos");
      }
      else{
        /*
        $.cookie('nombre',data.nombre);
        $.cookie('email',data.email);
        $.cookie('uid',data._id);
        $.cookie('nivel',data.nivel);
        */
        $.cookie("usr",JSON.stringify(data));
        mostrarInfoJugador();
        socket.emit("listo",data._id);
       }
      },
    contentType:'application/json',
    dataType:'json'
  });
}

function registroUsuario(nombre,clave){
  //var id=$.cookie("id");

  $.ajax({
    type:'POST',
    url:'/signup/',
    data:JSON.stringify({email:nombre,password:clave}),
    success:function(data){
      if (data.email==undefined){
        mostrarRegistro();
        mostrarAviso("Dirección de email inventada o el usuario ya existe");
        mostrarSolicitarReenvioMail();
      }
      else{
        /*
        $.cookie('nombre',data.nombre);
        $.cookie('email',data.email);
        $.cookie('uid',data._id);
        $.cookie('nivel',data.nivel);
        */
        //$.cookie("usr",JSON.stringify(data));
        //mostrarInfoJugador();         
         mostrarLogin();
         mostrarAviso("Te hemos enviado un email para confirmar tu cuenta");
      }
      },
    contentType:'application/json',
    dataType:'json'
  });
}

function actualizarUsuario(email,nombre,newpass){
  var usr=JSON.parse($.cookie("usr"));
  var nivel=usr.nivel;//$.cookie("nivel");
  //var nivel=(JSON.parse($.cookie("usr"))).nivel;
 $.ajax({
    type:'PUT',
    url:'/actualizarUsuario',
    data:JSON.stringify({uid:usr._id,email:email,nombre:nombre,newpass:newpass,nivel:nivel}),
    success:function(data){
      if (data.email==undefined){
        mostrarRegistro();
      }
      else{
        /*
        $.cookie('nombre',data.nombre);
        $.cookie('email',data.email);
        $.cookie('uid',data._id);
        $.cookie('nivel',data.nivel);
        */
        $.cookie("usr",JSON.stringify(data));
        //mostrarActualizarEliminar();
        mostrarInfoJugador();
      }
      },
    contentType:'application/json',
    dataType:'json'
  });
}

function eliminarUsuario(){
  var usr=JSON.parse($.cookie("usr"));
  $.ajax({
    type:'DELETE',
    url:'/eliminarUsuario/'+usr._id,//$.cookie("uid"),
    data:'{}',
    success:function(data){
      if (data.resultados==1)
      {
        reset();
      }
      },
    contentType:'application/json',
    dataType:'json'
  });
}


function comunicarNivelCompletado(tiempo){
  //var id=$.cookie("uid");
  var usr=JSON.parse($.cookie("usr"));
  var uid=usr._id;
  $.getJSON('/nivelCompletado/'+uid+"/"+tiempo,function(datos){
      usr.nivel=datos.nivel;
      $.cookie("usr",JSON.stringify(usr));
      $.cookie("max",datos.max);
      //$.cookie("nivel",datos.nivel);
      mostrarInfoJugador();
      obtenerResultados()
  }); 
}


function obtenerResultados(){
  //var uid=$.cookie("uid");
   var uid;
  if ($.cookie("usr")!=undefined){
    var usr=JSON.parse($.cookie("usr"));
    uid=usr._id;
  }
  if (uid!=undefined){
    $.getJSON("/obtenerResultados/"+uid,function(data){           
        mostrarResultados(data);
    });
  } 
}

function pedirNivel(){
 var usr=JSON.parse($.cookie("usr"));
  var uid=usr._id;
  if (uid!=undefined){
    $.getJSON("/pedirNivel/"+uid,function(data){    
        //console.log(data);       
        crearNivel(data);
    });
  } 
}

function volverAJugar(){
  var usr=JSON.parse($.cookie("usr"));
  var uid=usr._id;
  if (uid!=undefined){
    $.getJSON("/volverAJugar/"+uid,function(data){    
        //console.log(data);       
        $.cookie("usr",JSON.stringify(data));
        mostrarInfoJugador();
    });
  } 
}

function reenviarMail(email){
  $.getJSON("/volverAEnviarMail/"+email,function(data){    
      if (data.email==undefined){
        mostrarRegistro();
        mostrarAviso("Dirección de email inventada o el usuario ya existe");
        mostrarSolicitarReenvioMail();
      }
      else{
         mostrarLogin();
         mostrarAviso("Te hemos enviado un email para confirmar tu cuenta");
      }
    });
}

function enviarClave(email){
  if (email==undefined){
    mostrarLogin();
    mostrarAviso("Introduce usuario");
  }
  else{
    $.getJSON("/enviarClave/"+email,function(data){    
        if (data.email==""){
          mostrarRegistro();
          mostrarAviso("Dirección de email inventada o el usuario ya existe");
          mostrarSolicitarReenvioMail();
        }
        else{
           mostrarLogin();
           mostrarAviso("Te hemos enviado un email para confirmar tu cuenta");
        }
      });
  }
}

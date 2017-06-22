// using SendGrid's Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
var sendgrid = require("sendgrid")("user_name","user_password");

var url="https://proyectobase.herokuapp.com/";


module.exports.enviarEmail=function(direccion,key,msg){
	var email = new sendgrid.Email();
	email.addTo(direccion);
	email.setFrom('user-email');
	email.setSubject('confirmar cuenta');
	email.setHtml('<a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">'+msg+'</a>');

	sendgrid.send(email);	
}

module.exports.enviarEmailResetPassword=function(direccion,key,msg){
	var email = new sendgrid.Email();
	email.addTo(direccion);
	email.setFrom('user-email');
	email.setSubject('Reiniciar clave');
	email.setHtml('<a href="'+url+'cambiarClave/'+direccion+'/'+key+'">'+msg+'</a>');

	sendgrid.send(email);	
}
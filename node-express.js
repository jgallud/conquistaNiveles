
var fs=require("fs");
var config=JSON.parse(fs.readFileSync("config.json"));
var host=config.host;
var port=config.port;
var exp=require("express");
var app=exp(); 

//app.use(app.router);
app.use(exp.static(__dirname +"/cliente"));

app.get("/",function(request,response){
	var contenido=fs.readFileSync("./cliente/index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});

console.log("Servidor escuchando en el puerto "+port);
app.listen(port,host);


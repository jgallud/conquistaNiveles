
function crearNivel(data)
{

    if(data.nivel<0){
        noHayNiveles();
    }
    else{
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'juegoId', { preload: preload, create: create, update: update,render:render });

        function preload() {

            game.load.image('sky', 'assets/sky.png');
            game.load.image('sky2', 'assets/sky2y.png');
            game.load.image('ground', 'assets/platform.png');
            game.load.image('ground2', 'assets/platform2.png');
            game.load.image('meteorito', 'assets/meteorito.png');
            game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
            game.load.image('heaven','assets/heaven.png');
            game.load.spritesheet('explosion','assets/explosion.png',128,128);
        }

        //var game;
        var player;
        var platforms;
        var grupoFin;
        var cursors;
        var heaven;

        var meteoritos;

        var text="Vidas:";
        var style={font:"30px Arial",fill:"#ffffff",align:"right"};
        var board;

        var segundos=0;
        var textContador=0;
        var timer;
        var nivel=data.id;
        var coord=data.coordenadas;
        var gravedad=data.gravedad;

        var explosions;

        function create() {
        //iniCoordenadas();
        //console.log(coord);
        game.world.setBounds(0,0,800,1200);
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        //game.add.sprite(0, 0, 'sky');
        game.add.sprite(0, 0, 'sky2');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();
        grupoFin=game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;
        grupoFin.enableBody=true;

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        //var ledge = platforms.create(200, 450, 'ground2');
        var ledge;

        for(var i=0;i<coord.length;i++){
            ledge = platforms.create(coord[i][0], coord[i][1], 'ground2');
            ledge.body.immovable = true;
        }       


        heaven=grupoFin.create(0,0,'heaven');
        heaven.scale.setTo(2,1);
        heaven.body.immovable = true;

        //ledge = platforms.create(350, 60, 'ground');
        //ledge.body.immovable = true;

        // The player and its settings
        player = game.add.sprite(32, game.world.height - 110, 'dude');

        player.vidas=5;

        game.camera.follow(player);

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        player.anchor.setTo(0.5,0.5);
        //game.physics.enable(player,Phaser.Physics.ARCADE);

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

       
        //  Finally some meteoritos to collect
        meteoritos = game.add.group();

        //  We will enable physics for any meteorito that is created in this group
        meteoritos.enableBody = true;
        meteoritos.physicsBodyType = Phaser.Physics.ARCADE;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++)
        {
            lanzarEstrella(gravedad);
        }

        text="Vidas: "+player.vidas;
        board=game.add.text(game.world.width-150,30,text,style);

        textContador=game.add.text(game.world.width-155,60,'Tiempo:0',style);
        timer=game.time.events.loop(Phaser.Timer.SECOND,updateContador,this);

        //var name = prompt("Hola jugador, escribe tu nombre", "Nadie");if(name) {    console.log("Hola "+name+", encantado de conocerte!");}

        player.name=name;

        explosions=game.add.group();
        explosions.createMultiple(30,'explosion');
        explosions.forEach(setupPiedra,this);

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();

            
        }

        function lanzarEstrella(gravedad){
            
                var i=Math.floor((Math.random()*700)+1);
                //  Create a meteorito inside of the 'meteoritos' group
                var meteorito = meteoritos.create(i, 5, 'meteorito'); //i*70,0

                //  Let gravity do its thing
                meteorito.body.gravity.y = gravedad;
                meteorito.anchor.setTo(0.5,0.5);

                //  This just gives each meteorito a slightly random bounce value
                //meteorito.body.bounce.y = 0.7 + Math.random() * 0.2;
                meteorito.checkWorldBounds = true;
        }

        function update() {
           
            //  Collide the player and the meteoritos with the platforms
            game.physics.arcade.collide(player, platforms);
            //game.physics.arcade.collide(meteoritos, platforms);

            //game.physics.arcade.collide(player2, platforms);

            //  Checks to see if the player overlaps with any of the meteoritos, if he does call the collectmeteorito function
            game.physics.arcade.overlap(player, meteoritos, collectmeteorito, null, this);
            //game.physics.arcade.overlap(player2, meteoritos, collectmeteorito, null, this);
            
            game.physics.arcade.overlap(meteoritos, platforms, endmeteorito, null,this)
            game.physics.arcade.overlap(player,grupoFin,endLevel,null,this);

            //  Reset the players velocity (movement)
            player.body.velocity.x = 0;
           
            //player.body.velocity.y=0;

            //player2.body.velocity.x = 0;
            //player2.body.velocity.y=0;

            if (cursors.left.isDown)
            {
                //  Move to the left
                player.body.velocity.x = -150;

                player.animations.play('left');
            }
            else if (cursors.right.isDown)
            {
                //  Move to the up
                player.body.velocity.x = 150;

                player.animations.play('right');
            }
            /*
            else if (cursors.up.isDown)
            {
                //  Move to the up
                player.body.velocity.y = -100;

                player.animations.play('up');
            }
            else if (cursors.down.isDown)
            {
                //  Move to the up
                player.body.velocity.y = 100;

                player.animations.play('down');
            }
            */
            else
            {
                //  Stand still
                player.animations.stop();

                player.frame = 4;
            }
            
            
            //  Allow the player to jump if they are touching the ground.
            if (cursors.up.isDown && player.body.touching.down)
            {
                player.body.velocity.y = -250;
            }
            
        }

        function setupPiedra(piedra){
            piedra.anchor.x=0.5;
            piedra.anchor.y=0.5;
            piedra.animations.add('explosion');
        }

        function render(){
            textContador.setText('Tiempo: '+segundos);            
            game.debug.text(textContador.text,32,32);
            game.debug.text(board.text,32,52);
            
        }

        function updateContador(){
            segundos++;
            textContador.setText('Tiempo: '+segundos);    
        }

        function collectmeteorito (player, meteorito) {
            
            // Removes the meteorito from the screen
            //console.log('jugador con estrella');
            meteorito.kill();

            var explosion=explosions.getFirstExists(false);
            explosion.reset(player.body.x,player.body.y);
            explosion.play('explosion',16,false,true);

            player.vidas=player.vidas-1.
            board.setText("Vidas: "+player.vidas);
            if (player.vidas<=0)
            {
                loSiento(player);
            }
            

        }

        function loSiento(player){
            console.log("Has muerto!");
            board.setText("Fin del juego!");
            board.x=game.world.width-230;
            player.kill();
            game.time.events.remove(timer);
            terminarMeteoritos();
        }

        function terminarMeteoritos(){
            meteoritos.forEach(function(c) {c.kill(); });
        }

        function endmeteorito (meteorito, platform) {
            
            // Removes the meteorito from the screen
            //console.log('Estrella estrellada');
            meteorito.kill();
            lanzarEstrella(meteorito.body.gravity.y);
        }

        function endLevel(player,heaven){
            console.log('Conseguiste completar el nivel');
            game.time.events.remove(timer);
            board.setText("Nivel completado!");
            board.x=game.world.width-247;
            nivelCompletado(segundos);
            //mostrarDatos(segundos, player.vidas);
            player.kill();
            terminarMeteoritos();
            segundos=0;
        }
    }
}
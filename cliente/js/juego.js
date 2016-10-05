
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'juegoId', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('ground2', 'assets/platform2.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('heaven','assets/heaven.png');

}

var player;
var platforms;
var grupoFin;
var cursors;
var heaven;

var stars;

var text="Vidas:";
var style={font:"30px Arial",fill:"#ffffff",align:"right"};
var board;

var segundos=0;
var textContador=0;
var timer;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

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
    var ledge = platforms.create(200, 450, 'ground2');
    ledge.body.immovable = true;

    ledge = platforms.create(100, 350, 'ground2');
    ledge.body.immovable = true;

    ledge = platforms.create(0, 250, 'ground2');
    ledge.body.immovable = true;

    ledge = platforms.create(200, 150, 'ground2');
    ledge.body.immovable = true;

    //zona derecha
    ledge = platforms.create(700, 450, 'ground2');
    ledge.body.immovable = true;

    ledge = platforms.create(600, 350, 'ground2');
    ledge.body.immovable = true;

    ledge = platforms.create(game.world.height-100, 250, 'ground2');
    ledge.body.immovable = true;

    ledge = platforms.create(600, 150, 'ground2');
    ledge.body.immovable = true;

    heaven=grupoFin.create(0,0,'heaven');
    heaven.scale.setTo(2,1);
    heaven.body.immovable = true;

    //ledge = platforms.create(350, 60, 'ground');
    //ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 110, 'dude');

    player.vidas=5;

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    /*
    player2 = game.add.sprite(232, game.world.height - 110, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player2);

    //  Player physics properties. Give the little guy a slight bounce.
    player2.body.bounce.y = 0.2;
    player2.body.gravity.y = 0;//300
    player2.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player2.animations.add('left', [0, 1, 2, 3], 10, true);
    player2.animations.add('right', [5, 6, 7, 8], 10, true);
    */

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;
    stars.physicsBodyType = Phaser.Physics.ARCADE;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 64, 'star'); //i*70,0

        //  Let gravity do its thing
        star.body.gravity.y = 100;

        //  This just gives each star a slightly random bounce value
        //star.body.bounce.y = 0.7 + Math.random() * 0.2;
        star.checkWorldBounds = true;
    }
     text="Vidas: "+player.vidas;
    board=game.add.text(game.world.width-150,30,text,style);

    textContador=game.add.text(game.world.width-155,60,'Tiempo:0',style);
    timer=game.time.events.loop(Phaser.Timer.SECOND,updateContador,this);

    //var name = prompt("Hola jugador, escribe tu nombre", "Nadie");if(name) {    console.log("Hola "+name+", encantado de conocerte!");}

    player.name=name;

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
}

function update() {
   
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    //game.physics.arcade.collide(stars, platforms);

    //game.physics.arcade.collide(player2, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    //game.physics.arcade.overlap(player2, stars, collectStar, null, this);
    
    game.physics.arcade.overlap(stars, platforms, endStar, null,this)
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

function updateContador(){
    segundos++;
    textContador.setText('Tiempo: '+segundos);    
}

function collectStar (player, star) {
    
    // Removes the star from the screen
    //console.log('jugador con estrella');
    player.vidas=player.vidas-1.
    board.setText("Vidas: "+player.vidas);
    if (player.vidas<=0)
    {
        console.log("Has muerto!");
        player.kill();
    }
    star.kill();

}

function endStar (star, platform) {
    
    // Removes the star from the screen
    console.log('Estrella estrellada');
    star.kill();

}

function endLevel(player,heaven){
    console.log('Conseguiste completar el nivel');
    game.time.events.remove(timer);
    board.setText("Nivel completado!");
    board.x=game.world.width-247;
    player.kill();
}


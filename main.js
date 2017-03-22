// Initialize Phaser, and create a 800x480px game
var screenWidth = 800;
var screenHeight = 480;
var game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS, 'gameContainer');

var updatesCounter = 0;
var caughtPokemons = 0;
var text = null;
var menu;
var levelMultiplier = 1
var backgroundSprite;

var levelTwoThreshold = 10;
var levelThreeThreshold = 30;
var levelFourThreshold = 50;

// Create our 'main' state that will contain the game
var mainState = {

    preload: function() {
    	game.load.crossOrigin = 'anonymous';
      game.load.audio('catch', 'sounds/blaster.mp3');
      catchSound = game.add.audio('catch');
      game.load.audio('fall', 'sounds/fall.mp3');
      fallSound = game.add.audio('fall');

      	// Load all needed images
      	game.load.image('background', 'http://d4k.wwilk.com/assets/pokemon_background2.png');
        game.load.image('background2', 'http://d4k.wwilk.com/assets/pokemon_background.png');
        game.load.image('background3', 'http://pokemongame:8080/sprites/background3.png');
        game.load.image('background4', 'http://pokemongame:8080/sprites/background4.jpg');
        game.load.image('menuBackground', 'http://pokemongame:8080/sprites/menuBackground.jpg');
        game.load.image('Chartoken', 'http://pokemongame:8080/sprites/Chartoken.png');
        game.load.image('menuButton', 'http://pokemongame:8080/sprites/menuButton.png');
      	game.load.image('pokemon', 'http://d4k.wwilk.com/assets/pikachu.png');
        game.load.image('charmander', 'http://d4k.wwilk.com/assets/charmander.png');
        game.load.image('squirtle', 'https://pbs.twimg.com/media/B4in8N8CAAAJEc_.png');
        game.load.image('bulbasaur', 'http://pokemongame:8080/sprites/bulbasaur.png');
        game.load.image('pidgey', 'http://pokemongame:8080/sprites/pidgey.png');
        game.load.image('rattata', 'http://pokemongame:8080/sprites/ratatta.png');
        game.load.image('voltorb', 'http://pokemongame:8080/sprites/voltorb.gif');
        game.load.image('aerodactyl', 'http://pokemongame:8080/sprites/aerodactyl.png');
        game.load.image('snorlax', 'http://pokemongame:8080/sprites/snorlax.png');
        game.load.image('lapras', 'http://pokemongame:8080/sprites/lapras.png');
        game.load.image('electrabuzz', 'http://pokemongame:8080/sprites/electrabuzz.png');
        game.load.image('magmar', 'http://pokemongame:8080/sprites/magmar.png');
    },

    create: function() {
      // Set the background image
    	backgroundSprite = game.add.tileSprite(0, 0, screenWidth, screenHeight, 'background');
      //Create Menu Button on start game
      var menu = game.add.sprite(screenWidth-250, 10, 'menuButton');
      menu.scale.setTo(0.1, 0.1);
      menu.inputEnabled = true;
      menu.events.onInputDown.add(function(){
        // load the menu background
        backgroundSprite.loadTexture('menuBackground');
        pokemon.destroy();
        game.paused = true;
      }, this);
    	// Set the physics system
     	game.physics.startSystem(Phaser.Physics.ARCADE);

     	// Create text container and set it to initial value
     	text = game.add.text(0, 0, 'Catch a Pokemon by clicking on it', { fill: '#ffffff'});
      token = game.add.sprite(screenWidth-100, 10, 'Chartoken');
      token.scale.setTo(0.05, 0.05);
      tokenCount = game.add.text(screenWidth-50, 10, 'x 0', { fill: '#ffffff'});
    },

    update: function() {
  		updatesCounter++;
  		// change levels
      if (caughtPokemons >= levelTwoThreshold && caughtPokemons < levelThreeThreshold) {
        levelMultiplier = 1.5
        backgroundSprite.loadTexture('background2');
      } else if (caughtPokemons >= levelThreeThreshold && caughtPokemons < levelFourThreshold) {
        levelMultiplier = 1.7
        backgroundSprite.loadTexture('background3');
      } else if (caughtPokemons >= levelFourThreshold) {
        levelMultiplier = 2.0
        backgroundSprite.loadTexture('background4');
      }
      // Create pokemon only every 100th call of update function
      // add the pokemons to the stage
      if(updatesCounter % 100 == 0){
      	 createPokemon(updatesCounter/100);
      }
    }

};

function createPokemon(updatesCounter) {
	// Select initial x position of the pokemon randomly
 	var horizontalPosition = parseInt(screenWidth * Math.random());
 	var verticalPosition = 0;
  var gravity = 300;
  var pokemons = [
    'pokemon', 'charmander', 'squirtle', 'bulbasaur',
    'pidgey', 'rattata', 'voltorb', 'aerodactyl',
    'snorlax', 'lapras', 'electrabuzz', 'magmar'
  ];
  var name = pokemons [Math.floor(Math.random() * pokemons.length)]


    // Display the Pokemon on the screen
    pokemon = game.add.sprite(horizontalPosition, verticalPosition, name);

    switch (name) {
      case 'squirtle':
      case 'bulbasaur':
      case 'rattata':
      case 'voltorb':
        gravity = 350
        pokemon.scale.setTo (0.1, 0.1);
        break;
      case 'pidgey':
        pokemon.scale.setTo (0.1, 0.1);
        game.physics.arcade.enable(pokemon);
        pokemon.body.gravity.x = gravity;
        gravity = 360
        break;
      case 'aerodactyl':
        pokemon.scale.setTo (0.2, 0.2);
        game.physics.arcade.enable(pokemon);
        pokemon.body.gravity.x = gravity;
        gravity = 450
        break;
      case 'snorlax':
        pokemon.scale.setTo (0.2, 0.2);
        gravity = 1000
        break;
      case 'lapras':
        pokemon.scale.setTo (0.1, 0.1);
        gravity = 550
        break;
      case 'electrabuzz':
      case 'magmar':
        pokemon.scale.setTo (0.5, 0.5);
        gravity = 550
        break;
    }

	// Enables all kind of input actions on this image (click, etc)
    pokemon.inputEnabled = true;
    pokemon.checkWorldBounds = true;
    pokemon.events.onOutOfBounds.add(function() {
      fallSound.play();
    }, this);

	   pokemon.events.onInputDown.add(function(){
      	caughtPokemons++;
        tokenCount.text = 'x ' + caughtPokemons;
      	text.text = 'Congratulations, you caught ' + caughtPokemons + ' Pokemon';
      	pokemon.destroy();
        catchSound.play();
    }, this);

    // Add gravity to the pokemon to make it fall
    game.physics.arcade.enable(pokemon);
    pokemon.body.gravity.y = gravity * levelMultiplier
};


// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');

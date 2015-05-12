// The parent of the Enemy and Player objects.
var Entity = function() {
	// The image/sprite for our entities, this uses
    // a helper we've provided to easily load images
	this.sprite = '';
	
	// The default size for images, so that Entity.render
	// more easily applies to all the children I need
	this.width = 101;
	this.height = 171;
};

// Draw the entity on the screen, required method for game.
// This is reused for all entities.
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 
					this.x, this.y, this.width, this.height);
};


// Enemies our player must avoid, inherits from Entity class
var Enemy = function() {
	Entity.call(this);    
    this.sprite = 'images/enemy-bug.png';
    // Starting the enemy on the off-screen left of the three
    // different tracks/roads.
    this.tracks = [
		{x: -200, y: 60},
		{x: -200, y: 140},
		{x: -200, y: 220}
    ];
    // The different speeds the enemy can go at
    this.speeds = [200, 300, 400];

	// Set initial position and speed
    this.setPosition();
    this.setSpeed();
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
	// Move the enemy forward down the track
	this.x += this.currentSpeed * dt;
	
	// Handles when the enemy goes far enough offscreen
	if (this.x > 600) {
		this.setPosition();
		this.setSpeed();
	}
};

// Chooses which track the enemy is to go on and puts
// them in the right place
Enemy.prototype.setPosition = function() {
	var trackChoice = Math.floor(Math.random()*3);
	var currentTrack = this.tracks[trackChoice];
	this.x = currentTrack.x;
	this.y = currentTrack.y;
};

// Setup speed for enemy
Enemy.prototype.setSpeed = function() {
	var speedChoice = Math.floor(Math.random()*3);
	this.currentSpeed = this.speeds[speedChoice];
};

// See if player's position is within the enemy's
Enemy.prototype.hasHitPlayer = function (playerX, playerY) {
	if ( (this.y == playerY) && 
		( (this.x <= playerX + 70) && (this.x >= playerX - 70) ) ) {
		
		return true;
	}
	
	return false;
};

// Player class, which inherits from Entity class
var Player = function() {
	Entity.call(this);
	this.sprite = 'images/char-cat-girl.png';
	// How far (in pixels) movement is
	this.step = {
		x: 100,
		y: 80
	};
	
	this.setPosition();
	this.score = 0;		// Game score
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

// Movement based on key input, without leaving map
Player.prototype.handleInput = function(key) {	
	if (key == 'left' && this.x > 80) {
		this.x -= this.step.x;
	}
	if (key == 'right' && this.x < 360) {
		this.x += this.step.x;
	}
	if (key == 'up' && this.y > -20) {
		this.y -= this.step.y;
	}
	if (key == 'down' && this.y < 380) {
		this.y += this.step.y;
	}
};

// Places player at starting point
Player.prototype.setPosition = function() {
	this.x = 200;
	this.y = 380;
};

// Used to see if player has made it to the water,
// important for checking if player got a star
Player.prototype.hasCrossedRoad = function() {
	if (this.y < 0) {
		return true;
	}
	return false;
};

// This entity-based class is for resized
// images with need for positioning at setup
var Item = function (x, y) {
	Entity.call(this);
	this.x = x;
	this.y = y;
};

Item.prototype = Object.create(Entity.prototype);
Item.prototype.constructor = Item;

// For the heart gage.
var Heart = function (x, y) {
	Item.call(this, x, y);
	this.sprite = 'images/Heart.png';
	this.width = 50;
	this.height = 85;
};

Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Heart;

// Collectable stars
var Star = function (x, y) {
	Item.call(this, x, y);
	this.sprite = 'images/Star.png';
	this.width = 90;
	this.height = 142;
};

Star.prototype = Object.create(Item.prototype);
Star.prototype.constructor = Star;

// For seeing if player got this star
Star.prototype.isPlayerHere = function(playerX) {
	if (this.x == playerX + 7) {
		return true;
	}
	return false;
};


// Declaration of all important objects.
var allEnemies;
var player;
var hearts;
var stars;

// For handling loss of life
function checkCollisions() {
	for (enemy in allEnemies) {
		var thisEnemy = allEnemies[enemy];

		if ( thisEnemy.hasHitPlayer(player.x, player.y) ) {
			player.setPosition();
			hearts.pop();
		}
	}
}

// For handling getting to the other side of
// the tracks
function checkCrossing() {
	if (player.hasCrossedRoad()) {
		
		// Player get star?
		var hasStar = false;
		for (star in stars) {
			var thisStar = stars[star];
			
			// Yes? Remove star and add 10 points.
			if (thisStar.isPlayerHere(player.x)) {
				player.score += 10;
				hasStar = true;
				// Restock stars if they would be empty
				if (stars.length > 1) {
					stars.splice(star,1);
				} else {
					setupStars();
				}
				// not worth checking beyond one match
				break;
			}
		}
		
		// No? Still get a point.
		if (!hasStar) {
			player.score++;
		}
		
		player.setPosition();
	}
}

// For easily restocking stars, since they
// can be replaced throughout the game
function setupStars() {
	stars = [new Star(7, 5), new Star(107, 5), new Star(207, 5),
				new Star(307, 5), new Star(407, 5)];
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This draws the score onto the screen.
function renderText() {
	ctx.fillText("Score: " + player.score, 0, 5);
}

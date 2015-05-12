// The parent of the Enemy and Player objects.
var Entity = function() {
	// The image/sprite for our entities, this uses
    // a helper we've provided to easily load images
	this.sprite = '';
};

// Update the entity's position, required method for game
// Parameter: dt, a time delta between ticks
Entity.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers. 
};

// Draw the entity on the screen, required method for game
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Enemies our player must avoid, inherits from Entity class
var Enemy = function() {
	Entity.call(this);    
    this.sprite = 'images/enemy-bug.png';
    this.tracks = [
		{x: -200, y: 60},
		{x: -200, y: 140},
		{x: -200, y: 220}
    ];
    this.speeds = [200, 300, 400];

    this.setPosition();
    this.setSpeed();
}

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
	this.x += this.currentSpeed * dt;
	
	if (this.x > 600) {
		this.setPosition();
		this.setSpeed();
	}
}

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
}

// See if player's position is within the enemy's
Enemy.prototype.hasHitPlayer = function (playerX, playerY) {
	if ( (this.y == playerY) && 
		( (this.x <= playerX + 70) && (this.x >= playerX - 70) ) ) {
		
		return true;
	}
	
	return false;
}

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
	
	this.score = 0;
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
	if (this.y < 0) {
		this.crossed();
	}
}

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

Player.prototype.setPosition = function() {
	this.x = 200;
	this.y = 380;
};

Player.prototype.crossed = function() {
	this.score++;
	this.setPosition();
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies;
var player;

function checkCollisions() {
	for (enemy in allEnemies) {
		var thisEnemy = allEnemies[enemy];

		if ( thisEnemy.hasHitPlayer(player.x, player.y) ) {
			player.setPosition();
		}
	}
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

// This draws text onto the screen.
function renderText() {
	ctx.clearRect(0, 0, ctx.canvas.width, 40);
	var canvasHeight = ctx.canvas.height;
	ctx.fillText("Score: " + player.score, 0, 5);
}

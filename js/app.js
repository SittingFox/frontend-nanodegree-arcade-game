// The parent of the Enemy and Player objects. I've seen
// this word used in video games, and I thought it would
// fit for this.
var Entity = function() {
	// The image/sprite for our entities, this uses
    // a helper we've provided to easily load images
	this.sprite = '';
    this.setPosition();
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

// Since both enemy and player need to set positions
Entity.prototype.setPosition = function() {};

// Enemies our player must avoid
var Enemy = function() {
	Entity.call(this);    
    this.sprite = 'images/enemy-bug.png';
}

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

Entity.prototype.setPosition = function() {
	this.x = 100;
	this.y = 100;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	Entity.call(this);
	this.sprite = 'images/char-cat-girl.png';
	// How far (in pixels) movement is
	this.step = {
		x: 100,
		y: 80
	};
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
	if (key == 'up' && this.y > 0) {
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy()];
var player = new Player();

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
